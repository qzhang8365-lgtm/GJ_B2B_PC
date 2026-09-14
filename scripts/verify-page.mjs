#!/usr/bin/env node
/**
 * scripts/verify-page.mjs
 *
 * 生成后一致性验证的最小可执行版本，配合
 * references/generation-verification.md 使用。
 *
 * 用法：
 *   node scripts/verify-page.mjs <html文件路径> [--width=1440,1280]
 *
 * 依赖 Playwright（本仓库未提交 package.json/node_modules，需要单独
 * `npm install playwright` 才能运行；例如在有权限安装依赖的分析环境
 * 里跑，而不是假设本机已经装好）。
 *
 * 输出：结构化 JSON 报告，写到 stdout；发现任何问题时以非 0 退出码
 * 结束，方便接入自动化流程。
 *
 * 本脚本只覆盖可以机械判定的部分：内容溢出、包围盒重叠、间距阶梯、
 * 图标与相邻文字颜色一致性、同行控件尺寸一致性、SVG 图表内文字非等比
 * 拉伸变形（preserveAspectRatio="none"）。尺寸是否命中具体组件
 * Token、浮层是否被正确触发、以及是否复用了共享组件而不是页面私有
 * 重画，仍需按 generation-verification.md 的流程人工核对，或按需继续
 * 扩展本脚本。
 *
 * 已知的误报类型（拿真实页面跑过之后确认过，报告里出现时先按这个核对，
 * 不要直接当缺陷处理）：
 * - overflow：某些组件故意让说明性文字比自己的布局列更宽、居中显示、不裁剪
 *   （例如分步任务组件 `.gj-step` 的步骤名文案比 32px 的圆点列宽很多，
 *   两侧对称溢出但不会被裁切、也不会盖住相邻步骤），这类"有意更宽、不裁剪"
 *   的标签需要人工确认是否真的视觉溢出，不能只看 scrollWidth/clientWidth。
 * - sibling-overlap：脚本已排除 SVG 内部元素（图表的网格线层、数值标签层等
 *   `<g>` 天然共享同一 viewBox 包围盒，不代表真的互相遮挡）；如果换用其他
 *   图表实现（非内联 SVG），需要自行确认是否要追加类似排除。
 * - icon-text-color-diff-needs-check：非 Button/Text Button 的图标经常故意
 *   使用独立语义色（例如信息提示图标用品牌蓝、次要图标用三级灰），差异本身
 *   不是缺陷，只有查不到对应组件规则记录时才需要去 Figma 或该组件的
 *   rules.md/schema.json 里确认。
 */

import path from 'node:path';
import { pathToFileURL } from 'node:url';

const SPACING_LADDER = [4, 8, 12, 16, 20, 24, 32, 40, 48];

// 设计上就需要覆盖其它内容的浮层类组件，重叠检查时跳过。
const OVERLAY_CLASS_RE =
  /\b(gj-modal|gj-drawer|gj-toast|gj-notification|gj-tooltip|gj-popover|gj-dropdown|gj-mask|gj-scrim|gj-message|gj-cascader-panel)\b/;

function parseArgs(argv) {
  const args = argv.slice(2);
  if (args.length === 0 || args[0].startsWith('--')) {
    console.error('用法: node scripts/verify-page.mjs <html文件路径> [--width=1440,1280]');
    process.exit(2);
  }
  const filePath = args[0];
  let widths = [1440, 1280];
  for (const a of args.slice(1)) {
    if (a.startsWith('--width=')) {
      widths = a
        .slice('--width='.length)
        .split(',')
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => Number.isFinite(n) && n > 0);
    }
  }
  return { filePath, widths };
}

async function loadPlaywright() {
  try {
    return await import('playwright');
  } catch (err) {
    console.error(
      '[verify-page] 找不到 playwright，请先 `npm install playwright`（本项目未提交该依赖）。'
    );
    console.error(String(err && err.message ? err.message : err));
    process.exit(3);
  }
}

// 在页面里执行的检查逻辑（会被 page.evaluate 注入，只能用浏览器内置 API）。
function collectFindingsInPage({ spacingLadder, overlayClassSource }) {
  const overlayClassRe = new RegExp(overlayClassSource);
  const findings = [];
  const tolerance = 3; // px 取整/边框/字体渲染误差

  function describe(el) {
    if (!el) return '(unknown)';
    const id = el.id ? `#${el.id}` : '';
    const cls = el.className && typeof el.className === 'string'
      ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.')
      : '';
    return `${el.tagName.toLowerCase()}${id}${cls}`;
  }

  function isVisible(el) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function isOverlayEl(el) {
    if (overlayClassRe.test(el.className || '')) return true;
    const cs = getComputedStyle(el);
    return cs.position === 'fixed';
  }

  const SVG_NS = 'http://www.w3.org/2000/svg';
  function isSvgInternal(el) {
    // 图表/图标内部的 <g>/<text>/<line>/<path> 等 SVG 子元素按图层组织，
    // 同一 viewBox 下的多个 <g> 包围盒天然互相覆盖（网格线层、数值标签层等），
    // 这类重叠是图表的正常结构，不是 DOM 布局意义上的"兄弟节点互相盖住"。
    return el.namespaceURI === SVG_NS;
  }

  // ---- 1. 内容溢出 ----
  const allEls = Array.from(document.querySelectorAll('body *'));
  for (const el of allEls) {
    if (!isVisible(el)) continue;
    const cs = getComputedStyle(el);
    const overflowX = cs.overflowX;
    const overflowY = cs.overflowY;
    const isScrollable = (v) => v === 'auto' || v === 'scroll';
    // overflow:visible 意味着内容根本不会被裁切，只是几何上比自己的盒子宽/高
    // （常见于故意居中且不裁剪的说明文字，例如分步任务组件的步骤名称），
    // 这种情况没有"内容丢失"，是否与相邻内容视觉冲突交给下面的兄弟重叠检查
    // 单独判断，这里不重复上报。
    const clipsX = overflowX === 'hidden' || overflowX === 'clip';
    const clipsY = overflowY === 'hidden' || overflowY === 'clip';
    const scrollableX = isScrollable(overflowX);
    const scrollableY = isScrollable(overflowY);
    const overflowsX = el.scrollWidth > el.clientWidth + tolerance;
    const overflowsY = el.scrollHeight > el.clientHeight + tolerance;
    if ((overflowsX && clipsX) || (overflowsY && clipsY)) {
      findings.push({
        type: 'overflow',
        selector: describe(el),
        detail: `内容被裁切: scrollWidth=${el.scrollWidth} clientWidth=${el.clientWidth}, scrollHeight=${el.scrollHeight} clientHeight=${el.clientHeight}`,
      });
    } else if ((overflowsX && scrollableX) || (overflowsY && scrollableY)) {
      // 刻意可滚动但需要人工确认是否有可感知的滚动线索（滚动条/渐隐遮罩/提示）。
      findings.push({
        type: 'scrollable-needs-affordance-check',
        selector: describe(el),
        detail: '内容确实超出，容器已声明 overflow:auto/scroll，需人工确认是否有可见滚动线索',
      });
    }
  }

  // ---- 2. 兄弟节点包围盒重叠 ----
  const parents = new Set(allEls.map((el) => el.parentElement).filter(Boolean));
  for (const parent of parents) {
    const kids = Array.from(parent.children).filter(
      (el) => el.nodeType === 1 && isVisible(el) && !isOverlayEl(el)
    );
    for (let i = 0; i < kids.length; i++) {
      for (let j = i + 1; j < kids.length; j++) {
        const a = kids[i];
        const b = kids[j];
        if (isOverlayEl(a) || isOverlayEl(b)) continue;
        if (isSvgInternal(a) || isSvgInternal(b)) continue;
        const ra = a.getBoundingClientRect();
        const rb = b.getBoundingClientRect();
        const overlapX = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
        const overlapY = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
        if (overlapX > tolerance && overlapY > tolerance) {
          findings.push({
            type: 'sibling-overlap',
            selector: `${describe(a)} × ${describe(b)}`,
            detail: `重叠区域约 ${Math.round(overlapX)}×${Math.round(overlapY)}px，父容器 ${describe(parent)}`,
          });
        }
      }
    }
  }

  // ---- 3. 间距阶梯 ----
  const containers = allEls.filter((el) => {
    const cs = getComputedStyle(el);
    return (cs.display === 'flex' || cs.display === 'inline-flex' || cs.display === 'grid') && isVisible(el);
  });
  for (const el of containers) {
    const cs = getComputedStyle(el);
    const gapProps = [
      ['gap', cs.gap],
      ['rowGap', cs.rowGap],
      ['columnGap', cs.columnGap],
    ];
    for (const [name, raw] of gapProps) {
      if (!raw || raw === 'normal') continue;
      const values = raw
        .split(' ')
        .map((v) => parseFloat(v))
        .filter((v) => Number.isFinite(v) && v !== 0);
      for (const v of values) {
        const rounded = Math.round(v);
        if (!spacingLadder.includes(rounded)) {
          findings.push({
            type: 'spacing-off-ladder',
            selector: describe(el),
            detail: `${name}=${raw}（计算值 ${rounded}px 不在阶梯 [${spacingLadder.join('/')}] 上）`,
          });
        }
      }
    }
  }

  // ---- 4. Icon 与相邻文字颜色一致性 ----
  const iconEls = allEls.filter((el) => {
    if (!isVisible(el)) return false;
    const cls = el.className && typeof el.className === 'string' ? el.className : '';
    if (!/\bicon\b|\bico-|-icon\b|icf_/i.test(cls) && el.tagName.toLowerCase() !== 'svg') return false;
    const rect = el.getBoundingClientRect();
    // 图标通常是较小的方形元素，避免把大块背景图误判为图标。
    return rect.width > 0 && rect.width < 40 && rect.height > 0 && rect.height < 40;
  });
  // SKILL.md 明确写死的硬规则只覆盖 Button / Text Button：其 Icon 必须
  // currentColor 跟随按钮文字同色。其余组件（Alert、DatePicker 触发器等）
  // 的图标经常故意使用独立于正文的语义色（信息蓝、三级文字灰等），差异本身
  // 不是缺陷，只有在没有对应组件 rules.md/schema.json 记录时才需要人工确认
  // 是否走查过 Figma；所以这里按容器类型分两档上报，而不是一律判定为缺陷。
  const STRICT_CURRENTCOLOR_RE = /\b(gj-btn|gj-text-btn)\b/;
  for (const icon of iconEls) {
    const container = icon.closest('button, a, .gj-btn, .gj-text-btn, .gj-tag, .gj-tabs-button, li, label') || icon.parentElement;
    if (!container) continue;
    const textNodeParent = Array.from(container.querySelectorAll('*')).find((el) => {
      if (el === icon || icon.contains(el) || el.contains(icon)) return false;
      const text = (el.textContent || '').trim();
      return text.length > 0 && el.children.length === 0;
    });
    if (!textNodeParent) continue;
    const iconCs = getComputedStyle(icon);
    const textCs = getComputedStyle(textNodeParent);
    const iconColor =
      iconCs.backgroundColor !== 'rgba(0, 0, 0, 0)' && iconCs.maskImage !== 'none'
        ? iconCs.backgroundColor
        : iconCs.color;
    const textColor = textCs.color;
    if (iconColor && textColor && iconColor !== 'rgba(0, 0, 0, 0)' && iconColor !== textColor) {
      const isStrict = STRICT_CURRENTCOLOR_RE.test(container.className || '');
      findings.push({
        type: isStrict ? 'icon-text-color-mismatch' : 'icon-text-color-diff-needs-check',
        selector: `${describe(icon)} vs ${describe(textNodeParent)}`,
        detail: isStrict
          ? `Button/Text Button 的 Icon 必须 currentColor 跟随文字：icon=${iconColor} text=${textColor}`
          : `icon=${iconColor} text=${textColor}（非 Button/Text Button，可能是有意的语义色，需核对该组件 rules.md/schema.json 是否记录了此例外）`,
      });
    }
  }

  // ---- 5b. SVG 非等比拉伸（preserveAspectRatio="none" 导致文字变形）----
  const svgEls = allEls.filter((el) => el.tagName && el.tagName.toLowerCase() === 'svg');
  for (const svg of svgEls) {
    const par = svg.getAttribute('preserveAspectRatio');
    if (par && par.trim() === 'none') {
      const hasText = !!svg.querySelector('text');
      if (hasText) {
        findings.push({
          type: 'svg-non-uniform-scale',
          selector: describe(svg),
          detail: `preserveAspectRatio="none" 且内部含 <text>，容器宽高比与 viewBox 不一致时文字会被非等比拉伸变形，禁止使用`,
        });
      }
    }
  }

  // ---- 5. 同行控件尺寸一致性 ----
  const rowContainers = allEls.filter((el) => {
    const cs = getComputedStyle(el);
    return (
      isVisible(el) &&
      (cs.display === 'flex' || cs.display === 'inline-flex') &&
      cs.flexDirection.startsWith('row')
    );
  });
  const CONTROL_CLASS_RE =
    /\b(gj-btn|gj-input-wrap|gj-field|gj-select-trigger|gj-selector-trigger|gj-date-picker-trigger|gj-time-picker-trigger|gj-cascader-trigger)\b/;
  for (const row of rowContainers) {
    const kids = Array.from(row.children).filter(
      (el) => isVisible(el) && CONTROL_CLASS_RE.test(el.className || '')
    );
    if (kids.length < 2) continue;
    const heights = kids.map((el) => Math.round(el.getBoundingClientRect().height));
    const distinct = Array.from(new Set(heights));
    if (distinct.length > 1) {
      findings.push({
        type: 'row-control-height-mismatch',
        selector: describe(row),
        detail: `同一行内控件高度不一致: ${kids.map((el, i) => `${describe(el)}=${heights[i]}px`).join(', ')}`,
      });
    }
  }

  // 相同 type+selector+detail 的发现去重合并，避免同一类问题在页面里
  // 出现几十次时把报告刷屏（例如同一个共享类在页面里重复了很多次）。
  const seen = new Map();
  for (const f of findings) {
    const key = `${f.type}|${f.selector}|${f.detail}`;
    if (seen.has(key)) {
      seen.get(key).count += 1;
    } else {
      seen.set(key, { ...f, count: 1 });
    }
  }
  return Array.from(seen.values());
}

async function checkAtWidth(chromium, fileUrl, width) {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    const pageErrors = [];
    page.on('pageerror', (e) => pageErrors.push(String(e && e.message ? e.message : e)));
    await page.goto(fileUrl, { waitUntil: 'networkidle' });
    const findings = await page.evaluate(collectFindingsInPage, {
      spacingLadder: SPACING_LADDER,
      overlayClassSource: OVERLAY_CLASS_RE.source,
    });
    return { width, pageErrors, findings };
  } finally {
    await browser.close();
  }
}

async function main() {
  const { filePath, widths } = parseArgs(process.argv);
  const absPath = path.resolve(filePath);
  const fileUrl = pathToFileURL(absPath).href;
  const { chromium } = await loadPlaywright();

  const report = { file: absPath, widths: [], summary: {} };
  let totalFindings = 0;

  for (const width of widths) {
    const result = await checkAtWidth(chromium, fileUrl, width);
    totalFindings += result.findings.length;
    report.widths.push(result);
  }

  report.summary = {
    totalFindings,
    note:
      '本报告只覆盖溢出/重叠/间距阶梯/图标文字同色/同行控件高度五类机械检查；' +
      '尺寸是否命中组件 Token、浮层是否正确触发、是否复用共享组件等仍需按 ' +
      'generation-verification.md 流程人工核对。',
  };

  console.log(JSON.stringify(report, null, 2));
  process.exit(totalFindings > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('[verify-page] 运行失败:', err);
  process.exit(4);
});
