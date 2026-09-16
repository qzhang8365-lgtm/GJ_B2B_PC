#!/usr/bin/env node
/**
 * scripts/downstream-check/check-page.mjs
 *
 * 面向下游消费仓库的零依赖静态校验脚本——复制本文件和同目录的
 * known-tokens.json 到你自己的项目仓库，对该仓库里用国金 PC 端 B 端
 * 设计系统生成的 HTML/CSS 页面做一次快速体检，不需要安装 Node 以外的
 * 任何依赖（不需要 Playwright/Chromium）。
 *
 * 用法：
 *   node check-page.mjs <文件或目录> [<文件或目录> ...]
 *   不传参数时，默认扫描当前目录下的 .html / .css 文件（自动跳过
 *   node_modules、.git、dist、build）。
 *
 * 覆盖三类检查：
 * 1. 【阻断】命中已知语义/原始 Token 色值的裸十六进制颜色——应改用
 *    CSS 变量或语义 Token，而不是把颜色值原样写死。
 * 2. 【阻断】出现设计系统 SKILL.md 明确禁止的私有重画类名（如 .btn、
 *    .input、.navbar 等）——这些组件已有共享 gj-* 实现，禁止另起炉灶。
 * 3. 【提示，不阻断】间距数值疑似落在设计系统 4px 阶梯之外、或文本里
 *    出现 emoji——这两类误报率较高（例如正文文案本身包含 emoji、或
 *    该数值属于第三方库样式），只打印提示供人工判断，不影响退出码。
 *
 * 局限（明确写在这里，避免误用）：
 * - 纯正则/文本扫描，不启动浏览器，看不到真实渲染后的几何结果——查不出
 *   内容溢出、元素重叠这类必须渲染才能发现的问题。这类校验仍需使用设计
 *   系统仓库自己的 scripts/verify-page.mjs（需要 Playwright）。
 * - known-tokens.json 是某个时间点的静态快照，设计系统 Token 更新后需要
 *   找设计系统仓库重新生成、重新复制过来，本脚本不会自动同步。
 * - 私有类名黑名单只覆盖 SKILL.md 正文明确点名的几个，不是详尽清单。
 *
 * 退出码：命中任一【阻断】项时返回 1；只有【提示】或全部通过时返回 0。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next', '.cache']);
const EXT_RE = /\.(html?|css)$/i;

function loadKnownTokens() {
  const p = path.join(__dirname, 'known-tokens.json');
  if (!fs.existsSync(p)) {
    console.error(
      `找不到 ${p}。check-page.mjs 需要与 known-tokens.json 放在同一目录——` +
        `请从设计系统仓库的 scripts/downstream-check/ 一并复制过来。`
    );
    process.exit(2);
  }
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function collectFiles(inputs) {
  const files = [];
  function walk(p) {
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      const base = path.basename(p);
      if (SKIP_DIRS.has(base)) return;
      for (const entry of fs.readdirSync(p)) {
        walk(path.join(p, entry));
      }
    } else if (stat.isFile() && EXT_RE.test(p)) {
      files.push(p);
    }
  }
  const targets = inputs.length > 0 ? inputs : ['.'];
  for (const t of targets) {
    if (!fs.existsSync(t)) {
      console.error(`路径不存在，跳过：${t}`);
      continue;
    }
    walk(t);
  }
  return files;
}

function lineAt(content, index) {
  return content.slice(0, index).split('\n').length;
}

const HEX_RE = /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g;
const EMOJI_RE = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu;

function checkFile(file, known) {
  const content = fs.readFileSync(file, 'utf8');
  const blocking = [];
  const advisory = [];

  // 1. 裸 HEX 命中已知 Token 值
  for (const m of content.matchAll(HEX_RE)) {
    const hex = m[0].toUpperCase();
    const names = known.hexToTokenNames[hex];
    if (names && names.length > 0) {
      blocking.push({
        line: lineAt(content, m.index),
        message: `裸十六进制 ${m[0]} 命中已知 Token 值（${names.join(' / ')}），应改用对应 CSS 变量或语义 Token，不要写死颜色值。`,
      });
    }
  }

  // 2. 禁止的私有重画类名（作为 CSS 类选择器出现，如 .btn { 或 .btn,／.btn:hover）
  for (const rule of known.forbiddenPrivateClasses) {
    const escaped = rule.selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`${escaped}(?=[\\s,:.{)#\\[]|$)`, 'g');
    for (const m of content.matchAll(re)) {
      blocking.push({
        line: lineAt(content, m.index),
        message: `出现私有类名 ${rule.selector}，应改用共享实现 ${rule.reuseInstead}。（${rule.note}）`,
      });
    }
  }

  // 3.（提示）间距疑似不在 4px 阶梯上——只抓内联 style 或 CSS 规则里的
  //    padding/margin/gap 单值 px 数字，不解析简写四值语法，避免过度复杂。
  const spacingPropRe = /\b(padding|margin|gap|row-gap|column-gap)\s*:\s*(\d+)px\b/g;
  const ladder = new Set(known.spacingLadderPx);
  for (const m of content.matchAll(spacingPropRe)) {
    const px = Number(m[2]);
    if (px > 0 && !ladder.has(px)) {
      advisory.push({
        line: lineAt(content, m.index),
        message: `${m[1]}: ${px}px 不在设计系统间距阶梯（${known.spacingLadderPx.join('/')}）上，确认是否为有意例外。`,
      });
    }
  }

  // 3.（提示）emoji——可能被当图标使用，也可能是正文文案，仅提示不阻断。
  for (const m of content.matchAll(EMOJI_RE)) {
    advisory.push({
      line: lineAt(content, m.index),
      message: `出现字符 “${m[0]}”，如果是被当作图标使用，应改用图标库资源；如果是正文文案自带的 emoji，可忽略本条。`,
    });
  }

  return { blocking, advisory };
}

function main() {
  const args = process.argv.slice(2);
  const known = loadKnownTokens();
  const files = collectFiles(args);

  if (files.length === 0) {
    console.log('没有找到 .html / .css 文件可检查。');
    process.exit(0);
  }

  let totalBlocking = 0;
  let totalAdvisory = 0;

  for (const file of files) {
    const { blocking, advisory } = checkFile(file, known);
    if (blocking.length === 0 && advisory.length === 0) continue;
    console.log(`\n${file}`);
    for (const item of blocking) {
      console.log(`  [阻断] L${item.line}: ${item.message}`);
    }
    for (const item of advisory) {
      console.log(`  [提示] L${item.line}: ${item.message}`);
    }
    totalBlocking += blocking.length;
    totalAdvisory += advisory.length;
  }

  console.log(
    `\n共检查 ${files.length} 个文件：${totalBlocking} 项阻断，${totalAdvisory} 项提示。`
  );

  process.exit(totalBlocking > 0 ? 1 : 0);
}

main();
