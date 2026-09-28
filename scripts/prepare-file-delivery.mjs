#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const [, , input, mode] = process.argv;

if (!input || !['--check', '--write'].includes(mode)) {
  console.error('用法: node scripts/prepare-file-delivery.mjs <html文件路径> --check | --write');
  process.exit(2);
}

const htmlPath = path.resolve(input);
const htmlDir = path.dirname(htmlPath);

if (!fs.existsSync(htmlPath)) {
  console.error(`文件不存在: ${htmlPath}`);
  process.exit(2);
}

const isExternalMaskSource = value =>
  /\.svg(?:[?#].*)?$/i.test(value) &&
  !/^(?:data:|blob:|https?:|\/\/)/i.test(value);

const stripUrl = value => value.trim().replace(/^['"]|['"]$/g, '');
const toDataUrl = filePath => {
  const svg = fs.readFileSync(filePath);
  return `data:image/svg+xml;base64,${svg.toString('base64')}`;
};

const findings = [];
let html = fs.readFileSync(htmlPath, 'utf8');

const iconPattern = /(--gj-icon\s*:\s*url\(\s*)([^)]+?)(\s*\))/gi;
html = html.replace(iconPattern, (full, prefix, rawValue, suffix) => {
  const value = stripUrl(rawValue);
  if (!isExternalMaskSource(value)) return full;

  const assetPath = path.resolve(htmlDir, value.replace(/[?#].*$/, ''));
  findings.push({ type: '--gj-icon', owner: htmlPath, value, assetPath });
  if (mode === '--check') return full;
  if (!fs.existsSync(assetPath)) {
    throw new Error(`找不到 SVG: ${assetPath}`);
  }
  return `${prefix}${toDataUrl(assetPath)}${suffix}`;
});

const stylePattern = /(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi;
html = html.replace(stylePattern, (full, open, css, close) => {
  const rewritten = rewriteCss(css, htmlPath, htmlDir);
  return `${open}${rewritten}${close}`;
});

const linkedStyles = [...html.matchAll(/<link\b[^>]*>/gi)]
  .map(match => match[0])
  .filter(tag => /\brel=["']stylesheet["']/i.test(tag))
  .map(tag => tag.match(/\bhref=["']([^"']+)["']/i)?.[1])
  .filter(Boolean)
  .filter(href => !/^(?:data:|https?:|\/\/)/i.test(href));

for (const href of linkedStyles) {
  const cssPath = path.resolve(htmlDir, href.replace(/[?#].*$/, ''));
  if (!fs.existsSync(cssPath)) continue;
  const css = fs.readFileSync(cssPath, 'utf8');
  const rewritten = rewriteCss(css, cssPath, path.dirname(cssPath));
  if (mode === '--write' && rewritten !== css) fs.writeFileSync(cssPath, rewritten);
}

if (mode === '--write') fs.writeFileSync(htmlPath, html);

if (findings.length === 0) {
  console.log('本地交付检查通过：未发现外部 SVG mask。');
  process.exit(0);
}

for (const item of findings) {
  console.log(`${item.type}: ${path.relative(process.cwd(), item.owner)} -> ${item.value}`);
}

if (mode === '--check') {
  console.error(`发现 ${findings.length} 个外部 SVG mask；file:// 交付前必须内嵌。`);
  process.exit(1);
}

console.log(`已内嵌 ${findings.length} 个 SVG mask。请重新运行 --check 并执行 Chromium/WebKit file:// 验收。`);

function rewriteCss(css, ownerPath, baseDir) {
  const maskPattern = /((?:-webkit-)?mask(?:-image)?\s*:[^;{}]*?url\(\s*)([^)]+?)(\s*\)[^;{}]*[;}])/gi;
  return css.replace(maskPattern, (full, prefix, rawValue, suffix) => {
    const value = stripUrl(rawValue);
    if (!isExternalMaskSource(value)) return full;

    const assetPath = path.resolve(baseDir, value.replace(/[?#].*$/, ''));
    findings.push({ type: 'mask', owner: ownerPath, value, assetPath });
    if (mode === '--check') return full;
    if (!fs.existsSync(assetPath)) {
      throw new Error(`找不到 SVG: ${assetPath}`);
    }
    return `${prefix}${toDataUrl(assetPath)}${suffix}`;
  });
}
