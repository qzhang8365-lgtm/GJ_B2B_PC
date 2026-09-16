#!/usr/bin/env node
/**
 * scripts/downstream-check/build-package.mjs
 *
 * 从本仓库的真实 Token 源文件（references/tokens/gj-b2b.tokens.json）生成
 * 一份自包含的静态快照 known-tokens.json，供同目录的 check-page.mjs 使用。
 *
 * 背景：check-page.mjs 是设计给同事复制到自己项目仓库里跑的零依赖脚本，
 * 不能反过来依赖这个设计系统仓库本身；所以它需要的 Token 数据必须先在
 * 本仓库里"编译"成一份静态 JSON，随脚本一起复制过去。
 *
 * 用法：node scripts/downstream-check/build-package.mjs
 * 同事更新设计系统后，重新执行本脚本并把生成的 known-tokens.json
 * 连同 check-page.mjs 一起复制到自己项目仓库，替换旧版本即可。
 *
 * 不在提交门禁里自动触发——known-tokens.json 是给同事仓库用的产物，
 * 不是本仓库自身校验会读取的文件；变更 Token 后手动重新生成即可。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..');
const tokensPath = path.join(repoRoot, 'references/tokens/gj-b2b.tokens.json');

if (!fs.existsSync(tokensPath)) {
  console.error(`找不到 Token 源文件：${tokensPath}`);
  process.exit(1);
}

const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));

const HEX_RE = /^#[0-9a-fA-F]{3,8}$/;

function addHex(map, hex, name) {
  if (typeof hex !== 'string' || !HEX_RE.test(hex)) return;
  const key = hex.toUpperCase();
  if (!map[key]) map[key] = [];
  if (!map[key].includes(name)) map[key].push(name);
}

const hexToTokenNames = {};
for (const [name, def] of Object.entries(tokens.color?.primitive || {})) {
  addHex(hexToTokenNames, def?.value, name);
}
for (const [name, def] of Object.entries(tokens.color?.semantic || {})) {
  addHex(hexToTokenNames, def?.resolved || def?.value, name);
}

const spacingLadderPx = [];
const pxToTokenNames = {};
for (const [name, def] of Object.entries(tokens.dimension || {})) {
  if (def && def.unit === 'px' && typeof def.value === 'number') {
    if (!pxToTokenNames[def.value]) pxToTokenNames[def.value] = [];
    pxToTokenNames[def.value].push(name);
    if (name.startsWith('Interval/space') && def.value > 0) {
      spacingLadderPx.push(def.value);
    }
  }
}
spacingLadderPx.sort((a, b) => a - b);

// 只收录 SKILL.md 正文里明确点名"禁止用于重画共享组件"的私有类名，
// 不是猜测或扩写——名单来自 SKILL.md「实现中：逐状态映射」小节原文。
const forbiddenPrivateClasses = [
  { selector: '.btn', reuseInstead: 'gj-* 共享 Button 类', note: 'SKILL.md：不得用 .input / .form-item / .btn 等页面私有类重画同一组件' },
  { selector: '.input', reuseInstead: 'gj-field / gj-input-wrap', note: 'SKILL.md：Input 的共享基座为 gj-field + gj-input-wrap' },
  { selector: '.form-item', reuseInstead: 'gj-form-item', note: 'SKILL.md：Form 的共享基座为 gj-form-item' },
  { selector: '.navbar', reuseInstead: 'gj-navbar', note: 'SKILL.md：禁止在规范页或模式页保留 .navbar / .menu-item / .dropdown 等私有复制实现' },
  { selector: '.menu-item', reuseInstead: 'gj-navbar-menu-*', note: '同上，Navbar 横向菜单' },
  { selector: '.dropdown', reuseInstead: 'gj-dropdown / gj-dropdown-item', note: '同上，Navbar 浮层；也适用于其它场景下自建的 .dropdown' },
];

const pkg = {
  $comment: '静态快照，由 build-package.mjs 从 references/tokens/gj-b2b.tokens.json 自动生成，不要手工编辑。',
  generatedFrom: 'references/tokens/gj-b2b.tokens.json',
  generatedAt: new Date().toISOString().slice(0, 10),
  hexToTokenNames,
  spacingLadderPx,
  pxToTokenNames,
  forbiddenPrivateClasses,
};

const outPath = path.join(__dirname, 'known-tokens.json');
fs.writeFileSync(outPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');

console.log(
  `已生成 ${path.relative(repoRoot, outPath)}：` +
    `${Object.keys(hexToTokenNames).length} 个色值、` +
    `${spacingLadderPx.length} 档间距、` +
    `${forbiddenPrivateClasses.length} 条私有类黑名单。`
);
