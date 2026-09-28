#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const argv = process.argv.slice(2);
const input = argv.find(value => !value.startsWith('--'));
const mode = argv.includes('--write') ? 'write' : argv.includes('--check') ? 'check' : '';
const rootArg = argv.find(value => value.startsWith('--project-root='));

if (!input || !mode) {
  console.error('用法: node scripts/stage-project-assets.mjs <页面HTML或目录> --check | --write [--project-root=<项目根目录>]');
  process.exit(2);
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(scriptDir, '..');
const skillAssets = path.join(skillRoot, 'assets');
const projectRoot = path.resolve(rootArg ? rootArg.slice('--project-root='.length) : process.cwd());
const projectAssets = path.join(projectRoot, 'assets');
const inputPath = path.resolve(input);

if (!fs.existsSync(inputPath)) {
  console.error(`入口不存在: ${inputPath}`);
  process.exit(2);
}

const htmlFiles = collectHtml(inputPath);
if (!htmlFiles.length) {
  console.error(`未找到 HTML: ${inputPath}`);
  process.exit(2);
}

for (const htmlFile of htmlFiles) {
  if (!isInside(htmlFile, projectRoot)) {
    console.error(`页面必须位于项目根目录内: ${htmlFile}`);
    process.exit(2);
  }
}

const findings = [];
const copied = [];
const visited = new Set();
const basenameIndex = buildBasenameIndex(skillAssets);

for (const htmlFile of htmlFiles) processHtml(htmlFile);

const blockers = findings.filter(item => item.level === 'error');
for (const item of findings) {
  const owner = path.relative(projectRoot, item.owner) || path.basename(item.owner);
  console.log(`${item.level === 'error' ? '阻断' : '提示'}: ${owner} -> ${item.message}`);
}
for (const file of copied) console.log(`已复制: assets/${toPosix(path.relative(projectAssets, file))}`);

if (blockers.length) {
  console.error(`项目资源门禁失败：${blockers.length} 个阻断项。`);
  process.exit(1);
}

console.log(mode === 'write'
  ? `项目资源归档完成：复制 ${copied.length} 个依赖文件，未残留公共 Skill 运行时路径。`
  : '项目资源门禁通过：资源均位于项目内，未发现公共 Skill 运行时路径。');

function collectHtml(entry) {
  const stat = fs.statSync(entry);
  if (stat.isFile()) return /\.html?$/i.test(entry) ? [entry] : [];
  const result = [];
  const walk = directory => {
    for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
      if (item.name === 'assets' || item.name === 'node_modules' || item.name === '.git') continue;
      const absolute = path.join(directory, item.name);
      if (item.isDirectory()) walk(absolute);
      else if (/\.html?$/i.test(item.name)) result.push(absolute);
    }
  };
  walk(entry);
  return result.sort();
}

function processHtml(htmlFile) {
  let html = fs.readFileSync(htmlFile, 'utf8');
  const refs = collectHtmlRefs(html);
  const replacements = new Map();

  for (const ref of refs) {
    const resolved = resolveReference(ref, htmlFile);
    if (!resolved || resolved.external) continue;
    const staged = stageResolved(resolved.path, htmlFile, ref);
    if (staged) {
      const suffix = ref.match(/[?#].*$/)?.[0] || '';
      const relative = ensureRelative(toPosix(path.relative(path.dirname(htmlFile), staged))) + suffix;
      replacements.set(ref, relative);
    }
  }

  if (mode === 'write' && replacements.size) {
    for (const [from, to] of replacements) html = html.split(from).join(to);
    fs.writeFileSync(htmlFile, html);
  }

  scanForbiddenText(html, htmlFile);
}

function collectHtmlRefs(html) {
  const refs = new Set();
  for (const match of html.matchAll(/\b(?:src|href|poster)\s*=\s*["']([^"']+)["']/gi)) refs.add(match[1]);
  for (const match of html.matchAll(/\bsrcset\s*=\s*["']([^"']+)["']/gi)) {
    for (const part of match[1].split(',')) refs.add(part.trim().split(/\s+/)[0]);
  }
  for (const match of html.matchAll(/url\(\s*(["']?)([^)'"\s]+)\1\s*\)/gi)) refs.add(match[2]);
  return [...refs];
}

function resolveReference(raw, owner) {
  const value = raw.trim();
  if (!value || /^(?:#|data:|blob:|javascript:|mailto:|tel:|https?:|\/\/)/i.test(value)) return { external: true };
  const clean = value.replace(/[?#].*$/, '');
  try {
    if (/^file:/i.test(clean)) return { path: fileURLToPath(clean) };
  } catch {
    findings.push({ level: 'error', owner, message: `无法解析本地 URL：${value}` });
    return null;
  }
  if (path.isAbsolute(clean)) {
    if (clean.startsWith('/assets/')) return { path: path.join(projectRoot, clean.slice(1)) };
    return { path: path.resolve(clean) };
  }
  return { path: path.resolve(path.dirname(owner), clean) };
}

function stageResolved(resolvedPath, owner, raw) {
  if (isInside(resolvedPath, skillAssets)) {
    const relative = path.relative(skillAssets, resolvedPath);
    const target = path.join(projectAssets, relative);
    findings.push({
      level: mode === 'check' ? 'error' : 'info',
      owner,
      message: `引用公共 Skill 资源 ${raw}`
    });
    if (mode === 'write') copyDependency(resolvedPath, target, owner);
    return target;
  }

  if (isInside(resolvedPath, projectAssets)) {
    if (!fs.existsSync(resolvedPath)) {
      const relative = path.relative(projectAssets, resolvedPath);
      const source = path.join(skillAssets, relative);
      if (mode === 'write' && fs.existsSync(source)) copyDependency(source, resolvedPath, owner);
      else findings.push({ level: 'error', owner, message: `项目资源缺失 assets/${toPosix(relative)}` });
    } else if (/\.css$/i.test(resolvedPath)) {
      inspectProjectCss(resolvedPath, owner);
    } else if (/\.m?js$/i.test(resolvedPath)) {
      inspectRuntime(resolvedPath, owner);
    }
    return null;
  }

  if (isInside(resolvedPath, projectRoot)) {
    if (!fs.existsSync(resolvedPath)) {
      findings.push({ level: 'error', owner, message: `本地资源不存在 ${raw}` });
    } else if (/\.css$/i.test(resolvedPath)) {
      inspectProjectCss(resolvedPath, owner);
    } else if (/\.m?js$/i.test(resolvedPath)) {
      inspectRuntime(resolvedPath, owner);
    }
    return null;
  }

  if (path.isAbsolute(resolvedPath) && !isInside(resolvedPath, projectRoot)) {
    findings.push({ level: 'error', owner, message: `引用项目外绝对路径 ${raw}` });
    return null;
  }

  if (!fs.existsSync(resolvedPath)) findings.push({ level: 'error', owner, message: `本地资源不存在 ${raw}` });
  return null;
}

function copyDependency(source, target, owner) {
  const key = `${source}=>${target}`;
  if (visited.has(key)) return;
  visited.add(key);

  if (!fs.existsSync(source)) {
    findings.push({ level: 'error', owner, message: `Skill 源资源不存在 ${path.relative(skillRoot, source)}` });
    return;
  }

  if (fs.existsSync(target)) {
    const sourceBuffer = fs.readFileSync(source);
    const targetBuffer = fs.readFileSync(target);
    if (!sourceBuffer.equals(targetBuffer)) {
      findings.push({ level: 'error', owner, message: `项目已有不同内容，未覆盖 assets/${toPosix(path.relative(projectAssets, target))}` });
      return;
    }
  } else if (mode === 'write') {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source, target);
    copied.push(target);
  }

  if (/\.css$/i.test(source)) inspectSourceCss(source, target, owner);
  if (/\.m?js$/i.test(source)) inspectRuntime(source, owner);
}

function inspectSourceCss(sourceCss, targetCss, owner) {
  let css = fs.readFileSync(sourceCss, 'utf8');
  const replacements = new Map();
  for (const ref of collectCssRefs(css)) {
    const resolved = resolveReference(ref, sourceCss);
    if (!resolved || resolved.external || !isInside(resolved.path, skillAssets)) continue;
    const target = path.join(projectAssets, path.relative(skillAssets, resolved.path));
    copyDependency(resolved.path, target, owner);
    if (/^(?:file:|\/Users\/|.*(?:\.codex|\.claude)\/skills\/)/i.test(ref)) {
      replacements.set(ref, ensureRelative(toPosix(path.relative(path.dirname(targetCss), target))));
    }
  }
  if (mode === 'write' && replacements.size) {
    for (const [from, to] of replacements) css = css.split(from).join(to);
    fs.writeFileSync(targetCss, css);
  }
  scanForbiddenText(css, targetCss);
}

function inspectProjectCss(cssFile, owner) {
  const key = `project:${cssFile}`;
  if (visited.has(key)) return;
  visited.add(key);
  let css = fs.readFileSync(cssFile, 'utf8');
  const replacements = new Map();
  for (const ref of collectCssRefs(css)) {
    const resolved = resolveReference(ref, cssFile);
    if (!resolved || resolved.external) continue;
    const staged = stageResolved(resolved.path, owner, ref);
    if (staged) replacements.set(ref, ensureRelative(toPosix(path.relative(path.dirname(cssFile), staged))));
  }
  if (mode === 'write' && replacements.size) {
    for (const [from, to] of replacements) css = css.split(from).join(to);
    fs.writeFileSync(cssFile, css);
  }
  scanForbiddenText(css, cssFile);
}

function collectCssRefs(css) {
  const refs = new Set();
  for (const match of css.matchAll(/url\(\s*(["']?)([^)'"\s]+)\1\s*\)/gi)) refs.add(match[2]);
  for (const match of css.matchAll(/@import\s+["']([^"']+)["']/gi)) refs.add(match[1]);
  return [...refs];
}

function inspectRuntime(runtimeFile, owner) {
  const key = `runtime:${runtimeFile}`;
  if (visited.has(key) || !fs.existsSync(runtimeFile)) return;
  visited.add(key);
  const code = fs.readFileSync(runtimeFile, 'utf8');
  scanForbiddenText(code, runtimeFile);
  const names = new Set([...code.matchAll(/([A-Za-z0-9_.-]+\.(?:svg|png|jpe?g|webp|gif|woff2?|ttf|otf))/gi)].map(match => match[1]));
  for (const name of names) {
    const matches = basenameIndex.get(name) || [];
    if (matches.length === 1) {
      const source = matches[0];
      copyDependency(source, path.join(projectAssets, path.relative(skillAssets, source)), owner);
    } else if (matches.length > 1) {
      findings.push({ level: 'error', owner, message: `运行时资源 ${name} 在 Skill 中不唯一，需显式选择` });
    }
  }
}

function scanForbiddenText(content, owner) {
  const checks = [
    { pattern: /(?:^|["'(\s])file:\/\/\/[^\s"')]+/gi, label: 'file:// 绝对资源路径' },
    { pattern: /(?:\.codex|\.claude)\/skills\//gi, label: '公共 Skill 目录路径' },
    { pattern: /\/Users\/[^\s"')]+/g, label: '本机绝对路径' }
  ];
  for (const check of checks) {
    if (check.pattern.test(content)) findings.push({ level: 'error', owner, message: `仍包含${check.label}` });
  }
}

function buildBasenameIndex(root) {
  const index = new Map();
  const walk = directory => {
    for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, item.name);
      if (item.isDirectory()) walk(absolute);
      else {
        const list = index.get(item.name) || [];
        list.push(absolute);
        index.set(item.name, list);
      }
    }
  };
  walk(root);
  return index;
}

function isInside(candidate, root) {
  const relative = path.relative(root, candidate);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function ensureRelative(value) {
  return value.startsWith('.') ? value : `./${value}`;
}

function toPosix(value) {
  return value.split(path.sep).join('/');
}
