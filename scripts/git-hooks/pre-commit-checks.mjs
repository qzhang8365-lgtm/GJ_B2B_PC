#!/usr/bin/env node
/**
 * scripts/git-hooks/pre-commit-checks.mjs
 *
 * 提交门禁的实际检查逻辑，由同目录 pre-commit 调用。安装方式见
 * package.json 的 install-hooks 脚本（`npm run install-hooks`），
 * 本质是 `git config core.hooksPath scripts/git-hooks`。
 *
 * 覆盖三类检查，命中"阻断项"即拒绝本次提交；命中"需人工确认项"只打印
 * 提示、不阻断（原因见下方"生成后一致性验证"小节的分级说明）。紧急情况
 * 下可用 `git commit --no-verify` 跳过全部检查，但应在提交信息里注明
 * 跳过原因，方便日后追溯。
 *
 * 1. 结构安全网（本脚本新增，不是设计系统原有文字规则的机械化，是补充
 *    的兜底）：本次提交涉及的 .json 文件必须是合法 JSON；.css/.html
 *    文件里花括号、<style>/<script>/常见容器与表单标签必须闭合平衡。
 *    用来拦截脚本化编辑（sed/Python 批量替换）误伤语法结构、
 *    但从代码本身看不出来的情况。
 * 2. 审计留痕同步：references/audit-tracker.md「维护规则」第 2 条要求
 *    "来源 audit 增加或关闭问题时，同一提交必须更新本表"；本检查把这条
 *    文字规则变成强制门禁。
 * 3. 生成后一致性验证：references/generation-verification.md 要求任何
 *    新生成或修改的页面模式/组件预览页、或改动共享样式后，交付前必须
 *    完成渲染实测；本检查在提交命中这些文件时自动调用
 *    scripts/verify-page.mjs。
 *
 * 已知局限（刻意保持这是一次"微调"而不是重做校验体系）：
 * - 渲染检查读取的是工作区文件内容，不是 git 暂存区快照；正常"改完就
 *   git add 再提交"的流程下两者一致，只有刻意只暂存部分修改时才会有偏差。
 * - 不检查"源 Token 改了但没跑 build-tokens.mjs"这类语义规则，仍需
 *   人工遵守 SKILL.md「维护」章节。
 * - 依赖 Playwright；未安装时会阻断涉及预览页/共享样式的提交并提示
 *   `npm install`，而不是静默跳过验证。
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const REPO_ROOT = execFileSync('git', ['rev-parse', '--show-toplevel']).toString().trim();

// verify-page.mjs 的 finding.type 分级：
// - HARD_BLOCK：当前代码逻辑下没有已知的合理误报（overflow 只在真的
//   overflow:hidden/clip 且内容确实被裁切时才上报，故意加宽不裁剪的
//   说明文字已经在脚本里被排除，不会走到这里）。
// - REVIEW_ONLY：脚本注释和 audit-tracker.md 历史记录里明确记过合理
//   误报的类型（例如 Badge 角标叠在头像/图标上、sticky 操作列压住被
//   滚动列，都是 sibling-overlap 的已知合法场景；图标独立语义色是
//   icon-text-color-diff-needs-check 的已知合法场景），因此只提示、
//   不阻断，避免门禁因为"历史上已经确认没问题的模式"反复拦人。
const HARD_BLOCK_FINDING_TYPES = new Set([
  'overflow',
  'spacing-off-ladder',
  'svg-non-uniform-scale',
  'row-control-height-mismatch',
  'icon-text-color-mismatch',
]);
const REVIEW_ONLY_FINDING_TYPES = new Set([
  'sibling-overlap',
  'scrollable-needs-affordance-check',
  'icon-text-color-diff-needs-check',
]);

function stagedFiles() {
  const raw = execFileSync(
    'git',
    ['diff', '--cached', '--name-status', '-z', '--diff-filter=ACM'],
    { cwd: REPO_ROOT }
  ).toString('utf8');
  const tokens = raw.split('\0').filter(Boolean);
  return tokens.map((t) => {
    const tab = t.indexOf('\t');
    return { status: t.slice(0, tab), file: t.slice(tab + 1) };
  });
}

function stagedContent(file) {
  return execFileSync('git', ['show', ':' + file], { cwd: REPO_ROOT }).toString('utf8');
}

function countMatches(str, re) {
  const m = str.match(re);
  return m ? m.length : 0;
}

const blocking = []; // { file, message }
const reviewOnly = []; // { file, message }

const files = stagedFiles();
if (files.length === 0) {
  process.exit(0);
}

// ---------- 1. JSON / 标签平衡安全网 ----------
for (const { file } of files) {
  let content;
  if (file.endsWith('.json')) {
    try {
      content = stagedContent(file);
    } catch (e) {
      continue; // 文件已被删除等情况
    }
    try {
      JSON.parse(content);
    } catch (e) {
      blocking.push({ file, message: `JSON 解析失败：${e.message}` });
    }
  } else if (file.endsWith('.css')) {
    try {
      content = stagedContent(file);
    } catch (e) {
      continue;
    }
    const open = countMatches(content, /\{/g);
    const close = countMatches(content, /\}/g);
    if (open !== close) {
      blocking.push({ file, message: `CSS 花括号不平衡：{ 共 ${open} 个，} 共 ${close} 个` });
    }
  } else if (file.endsWith('.html')) {
    try {
      content = stagedContent(file);
    } catch (e) {
      continue;
    }
    const tagPairs = [
      ['<style', '</style>'],
      ['<script', '</script>'],
      ['<div', '</div>'],
      ['<span', '</span>'],
      ['<section', '</section>'],
      ['<table', '</table>'],
      ['<tr', '</tr>'],
      ['<td', '</td>'],
      ['<th', '</th>'],
      ['<button', '</button>'],
      ['<select', '</select>'],
    ];
    for (const [openTag, closeTag] of tagPairs) {
      const openRe = new RegExp(openTag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?=[\\s>])', 'g');
      const closeRe = new RegExp(closeTag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const openCount = countMatches(content, openRe);
      const closeCount = countMatches(content, closeRe);
      if (openCount !== closeCount) {
        blocking.push({
          file,
          message: `标签不平衡：${openTag}> 共 ${openCount} 个，${closeTag} 共 ${closeCount} 个`,
        });
      }
    }
    const scriptBlocks = content.match(/<script[^>]*>([\s\S]*?)<\/script>/g) || [];
    for (const block of scriptBlocks) {
      const braceOpen = countMatches(block, /\{/g);
      const braceClose = countMatches(block, /\}/g);
      const parenOpen = countMatches(block, /\(/g);
      const parenClose = countMatches(block, /\)/g);
      if (braceOpen !== braceClose) {
        blocking.push({ file, message: `内联 <script> 花括号不平衡：{ 共 ${braceOpen} 个，} 共 ${braceClose} 个` });
      }
      if (parenOpen !== parenClose) {
        blocking.push({ file, message: `内联 <script> 圆括号不平衡：( 共 ${parenOpen} 个，) 共 ${parenClose} 个` });
      }
    }
  }
}

// ---------- 2. 审计留痕同步 ----------
const stagedPaths = new Set(files.map((f) => f.file));
const auditMdChanged = files.filter((f) => /^references\/components\/[^/]+\/audit\.md$/.test(f.file));
if (auditMdChanged.length > 0 && !stagedPaths.has('references/audit-tracker.md')) {
  blocking.push({
    file: 'references/audit-tracker.md',
    message:
      `本次提交修改了 ${auditMdChanged.map((f) => f.file).join('、')}，但未同步暂存 references/audit-tracker.md。` +
      '按该文件「维护规则」第 2 条，来源 audit 增加或关闭问题时，同一提交必须更新跟踪表。',
  });
}

// ---------- 3. 生成后一致性验证（渲染实测） ----------
const previewPageRe = /^preview\/[^/]+\/index\.html$/;
const patternPageRe = /^preview\/patterns\/[^/]+\.html$/;
const sharedStyleFiles = new Set(['assets/styles/gj-b2b-tokens.css', 'assets/styles/gj-b2b-components.css']);

const stagedPreviewPages = files
  .filter((f) => previewPageRe.test(f.file) || patternPageRe.test(f.file))
  .map((f) => f.file);
const sharedStyleChanged = files.some((f) => sharedStyleFiles.has(f.file));

const renderCheckSet = new Set(stagedPreviewPages);
if (sharedStyleChanged) {
  const patternsDir = path.join(REPO_ROOT, 'preview', 'patterns');
  try {
    for (const name of fs.readdirSync(patternsDir)) {
      if (name.endsWith('.html')) renderCheckSet.add(path.posix.join('preview', 'patterns', name));
    }
  } catch (e) {
    // preview/patterns 目录不存在时跳过
  }
}

if (renderCheckSet.size > 0) {
  let playwrightAvailable = true;
  try {
    execFileSync('node', ['-e', "require.resolve('playwright')"], { cwd: REPO_ROOT });
  } catch (e) {
    playwrightAvailable = false;
  }

  if (!playwrightAvailable) {
    blocking.push({
      file: '(generation-verification.md)',
      message:
        `本次提交涉及 ${renderCheckSet.size} 个预览/模式页面或共享样式文件，按 generation-verification.md 要求必须完成渲染实测，` +
        '但未检测到 Playwright。请先在仓库根目录执行一次 `npm install` 后重新提交；' +
        '确需临时跳过请用 `git commit --no-verify` 并在提交信息中注明原因。',
    });
  } else {
    for (const rel of renderCheckSet) {
      const abs = path.join(REPO_ROOT, rel);
      if (!fs.existsSync(abs)) continue; // 例如提交里是删除该文件
      let stdout = '';
      let crashed = false;
      let crashMessage = '';
      try {
        stdout = execFileSync(
          'node',
          [path.join(REPO_ROOT, 'scripts', 'verify-page.mjs'), abs, '--width=1440,1280'],
          { cwd: REPO_ROOT }
        ).toString('utf8');
      } catch (e) {
        stdout = e.stdout ? e.stdout.toString('utf8') : '';
        if (!stdout.trim()) {
          crashed = true;
          crashMessage = (e.stderr ? e.stderr.toString('utf8') : '') || e.message;
        }
      }

      if (crashed) {
        blocking.push({
          file: rel,
          message: `渲染验证脚本本身运行失败（可能是 Playwright 浏览器内核缺失，需要 \`npx playwright install chromium\`）：\n${crashMessage.slice(0, 1500)}`,
        });
        continue;
      }

      let report;
      try {
        report = JSON.parse(stdout);
      } catch (e) {
        blocking.push({ file: rel, message: `无法解析 verify-page.mjs 输出：${e.message}` });
        continue;
      }

      const hardHits = [];
      const reviewHits = [];
      const pageErrorHits = [];
      for (const w of report.widths || []) {
        for (const pe of w.pageErrors || []) {
          pageErrorHits.push(`[${w.width}px] ${pe}`);
        }
        for (const f of w.findings || []) {
          const line = `[${w.width}px][${f.type}] ${f.selector}: ${f.detail}${f.count > 1 ? `（重复 ${f.count} 次）` : ''}`;
          if (HARD_BLOCK_FINDING_TYPES.has(f.type)) hardHits.push(line);
          else if (REVIEW_ONLY_FINDING_TYPES.has(f.type)) reviewHits.push(line);
          else reviewHits.push(`[未分级类型，按需人工确认] ${line}`);
        }
      }

      if (pageErrorHits.length > 0) {
        blocking.push({ file: rel, message: `页面渲染时出现 JS 运行时错误：\n${pageErrorHits.join('\n')}` });
      }
      if (hardHits.length > 0) {
        blocking.push({ file: rel, message: `渲染实测发现问题（阻断类型）：\n${hardHits.join('\n')}` });
      }
      if (reviewHits.length > 0) {
        reviewOnly.push({
          file: rel,
          message:
            `渲染实测发现需人工确认的项（历史上这些类型存在已知合理场景，例如 Badge 叠在头像上、` +
            `sticky 操作列压住被滚动列、图标使用独立语义色，不自动阻断，但请对照 references/generation-verification.md 核实）：\n${reviewHits.join('\n')}`,
        });
      }
    }
  }
}

// ---------- 汇总 ----------
if (reviewOnly.length > 0) {
  console.warn('\n以下为需人工确认项（不阻断提交）：\n');
  for (const r of reviewOnly) {
    console.warn(`- [${r.file}] ${r.message}\n`);
  }
}

if (blocking.length > 0) {
  console.error(`\n提交门禁未通过（${blocking.length} 项阻断），可用 \`git commit --no-verify\` 跳过并在提交信息中注明原因：\n`);
  for (const b of blocking) {
    console.error(`- [${b.file}] ${b.message}\n`);
  }
  process.exit(1);
}

console.log(`提交门禁通过（${files.length} 个暂存文件，含 ${renderCheckSet.size} 个渲染实测）。`);
process.exit(0);
