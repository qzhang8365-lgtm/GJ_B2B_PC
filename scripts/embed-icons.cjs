#!/usr/bin/env node
/*
 * 将 PC 原型页使用的 SVG 图标、Skill 图片和转换运行时写进 HTML 本身，
 * 让 Chrome file:// 与 Figma「Capture design / 网页导入」能保留图标、图片和 1px 描边。
 *
 * 用法：node scripts/embed-icons.cjs <页面.html> [更多页面.html] [--check]
 * 默认直接改写原文件；--check 只检查固定内嵌区块是否存在且与当前依赖一致。
 */
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const ASSET_ROOT = path.join(ROOT, 'assets');
const ICON_ROOT = path.join(ASSET_ROOT, 'icons', 'iconfont');
const COMPONENT_CSS = path.join(ASSET_ROOT, 'styles', 'gj-b2b-components.css');
const COMPONENT_ROOT = path.join(ROOT, 'references', 'components');
const SCRIPT_ROOT = path.join(ASSET_ROOT, 'scripts');
const RUNTIME_PATH = path.join(SCRIPT_ROOT, 'gj-b2b-inline-icons.js');
const START = '<!-- gj-pc-icons:start -->';
const END = '<!-- gj-pc-icons:end -->';
const BLOCK = new RegExp(escapeRegExp(START) + '[\\s\\S]*?' + escapeRegExp(END));
const ICON_NAME = /icf_[A-Za-z0-9_.-]+?(?=\.svg|['"`\s),;}\]])/g;
const ASSET_REF = /assets\/((?:icons|images)\/[^'"`)\s<>]+?\.(?:svg|png|jpe?g))/gi;
const MIME = { svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg' };
const check = process.argv.includes('--check');
const pages = process.argv.slice(2).filter(argument => !argument.startsWith('--'));

if (!pages.length) {
  console.error('用法：node scripts/embed-icons.cjs <页面.html> [更多页面.html] [--check]');
  process.exit(2);
}

for (const required of [COMPONENT_CSS, RUNTIME_PATH, ICON_ROOT]) {
  if (!fs.existsSync(required)) {
    console.error(`缺少运行依赖：${required}`);
    process.exit(2);
  }
}

const runtime = fs.readFileSync(RUNTIME_PATH, 'utf8').replace(/<\/script/gi, '<\\/script').trim();
const componentCss = fs.readFileSync(COMPONENT_CSS, 'utf8');
const sharedScripts = fs.readdirSync(SCRIPT_ROOT)
  .filter(filename => filename.endsWith('.js') && filename !== path.basename(RUNTIME_PATH))
  .map(filename => ({ file: path.join(SCRIPT_ROOT, filename), text: fs.readFileSync(path.join(SCRIPT_ROOT, filename), 'utf8') }));
const componentTemplates = walkFiles(COMPONENT_ROOT)
  .filter(filename => /\.(?:css|html|js|json|md)$/i.test(filename))
  .map(filename => ({ file: filename, text: fs.readFileSync(filename, 'utf8') }));

const commonIcons = new Set([
  ...iconNamesIn(componentCss),
  ...sharedScripts.flatMap(source => iconNamesIn(source.text)),
  ...componentTemplates.flatMap(source => iconNamesIn(source.text)),
]);
const commonAssets = new Set([
  ...assetsIn(componentCss, COMPONENT_CSS),
  ...sharedScripts.flatMap(source => [...assetsIn(source.text, source.file)]),
  ...cssAssetsIn(componentCss, COMPONENT_CSS),
]);

let failures = 0;
for (const pageArgument of pages) {
  const file = path.resolve(pageArgument);
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
    console.error(`页面不存在：${file}`);
    failures++;
    continue;
  }

  const original = fs.readFileSync(file, 'utf8');
  if (original.includes(START) !== original.includes(END)) {
    console.error(`内嵌标记不完整，请先修复：${pageArgument}`);
    failures++;
    continue;
  }
  const source = original.replace(BLOCK, '');
  const pageDir = path.dirname(file);
  const localTexts = [{ file, text: source }];

  for (const reference of linkedResources(source, 'script', 'src')) {
    const linked = resolveLocalReference(reference, pageDir);
    if (linked && fs.existsSync(linked) && fs.statSync(linked).isFile()) {
      localTexts.push({ file: linked, text: fs.readFileSync(linked, 'utf8') });
    }
  }
  for (const reference of linkedStyles(source)) {
    const linked = resolveLocalReference(reference, pageDir);
    if (linked && fs.existsSync(linked) && fs.statSync(linked).isFile()) {
      localTexts.push({ file: linked, text: fs.readFileSync(linked, 'utf8') });
    }
  }

  const icons = new Set(commonIcons);
  const assets = new Set(commonAssets);
  for (const item of localTexts) {
    iconNamesIn(item.text).forEach(name => icons.add(name));
    assetsIn(item.text, item.file).forEach(asset => assets.add(asset));
    if (/\.css$/i.test(item.file) || item.file === file) cssAssetsIn(item.text, item.file).forEach(asset => assets.add(asset));
  }

  const iconData = {};
  for (const name of [...icons].sort()) {
    const iconFile = path.join(ICON_ROOT, `${name}.svg`);
    if (!fs.existsSync(iconFile)) continue;
    iconData[name] = cleanMaskSvg(fs.readFileSync(iconFile, 'utf8'));
  }

  const assetData = {};
  for (const relative of [...assets].sort()) {
    const assetFile = locateAsset(relative, pageDir);
    if (!assetFile) continue;
    assetData[relative] = dataUrl(assetFile);
  }

  const cssSources = [componentCss];
  localTexts.filter(item => /\.css$/i.test(item.file)).forEach(item => cssSources.push(item.text));
  for (const style of source.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) cssSources.push(style[1]);
  const maskPreflight = buildMaskPreflight(cssSources, assetData);

  const embedded = `${START}\n<style data-gj-pc-mask-preflight>/* 在正文解析前阻止 file:// 外部 SVG mask 请求；运行时随后转换载体。 */\n${maskPreflight}\n</style>\n<script>/* 由 scripts/embed-icons.cjs 生成；请勿手改。图标 ${Object.keys(iconData).length} 个，图片资源 ${Object.keys(assetData).length} 个。 */\nwindow.GJ_PC_ICONS=${safeJson(iconData)};\nwindow.GJ_PC_ASSETS=${safeJson(assetData)};</script>\n<script>${runtime}</script>\n${END}`;
  const next = original.includes(START) && original.includes(END)
    ? original.replace(BLOCK, () => embedded)
    : insertBlock(original, embedded);

  if (check) {
    if (next !== original) {
      failures++;
      console.error(`未内嵌或内嵌已过期：${pageArgument}`);
    } else console.log(`已内嵌：${pageArgument}（${Object.keys(iconData).length} 个图标、${Object.keys(assetData).length} 个图片资源）`);
  } else {
    fs.writeFileSync(file, next);
    console.log(`${original.includes(START) ? '已更新' : '已内嵌'}：${pageArgument}（${Object.keys(iconData).length} 个图标、${Object.keys(assetData).length} 个图片资源，约 ${(Buffer.byteLength(embedded) / 1024).toFixed(0)} KB）`);
  }
}

process.exit(failures ? 1 : 0);

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function walkFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  const result = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...walkFiles(target));
    else if (entry.isFile()) result.push(target);
  }
  return result;
}

function iconNamesIn(text) {
  return [...new Set((text.match(ICON_NAME) || []).map(name => name.replace(/\.$/, '')))]
    .filter(name => fs.existsSync(path.join(ICON_ROOT, `${name}.svg`)));
}

function assetsIn(text, ownerFile) {
  const result = new Set();
  for (const match of text.matchAll(ASSET_REF)) {
    const relative = match[1].replace(/\\/g, '/');
    if (/\$\{|\{\{/.test(relative)) {
      expandTemplateAsset(relative, text, result);
    } else if (locateAsset(relative, path.dirname(ownerFile))) result.add(relative);
  }
  return result;
}

function expandTemplateAsset(relative, hint, result) {
  const directory = path.join(ASSET_ROOT, path.dirname(relative));
  if (!fs.existsSync(directory)) return;
  const escaped = path.basename(relative).replace(/[.*+?^()|[\]\\]/g, '\\$&');
  const pattern = new RegExp('^' + escaped.replace(/\\\$\\\{[^}]*\}|\$\{[^}]*\}|\{\{[^}]*\}\}/g, '.+') + '$');
  const matches = fs.readdirSync(directory).filter(filename => pattern.test(filename));
  const selected = matches.length > 12
    ? matches.filter(filename => hint.includes(filename) || hint.includes(filename.replace(/\.[^.]+$/, '')))
    : matches;
  selected.forEach(filename => result.add(path.posix.join(path.dirname(relative), filename)));
}

function cssAssetsIn(text, ownerFile) {
  const result = new Set();
  const urlPattern = /url\(\s*(['"]?)(.*?)\1\s*\)/gi;
  for (const match of text.matchAll(urlPattern)) {
    const reference = match[2];
    if (!/\.(?:svg|png|jpe?g)(?:[?#].*)?$/i.test(reference) || /^(?:data:|blob:|https?:|\/\/)/i.test(reference)) continue;
    const resolved = path.resolve(path.dirname(ownerFile), reference.replace(/[?#].*$/, ''));
    const relative = path.relative(ASSET_ROOT, resolved).replace(/\\/g, '/');
    if (!relative.startsWith('..') && /^(?:icons|images)\//.test(relative) && fs.existsSync(resolved)) result.add(relative);
  }
  return result;
}

function linkedResources(html, tagName, attribute) {
  const tags = html.match(new RegExp(`<${tagName}\\b[^>]*>`, 'gi')) || [];
  return tags.map(tag => tag.match(new RegExp(`\\b${attribute}=["']([^"']+)["']`, 'i'))?.[1]).filter(Boolean);
}

function linkedStyles(html) {
  return (html.match(/<link\b[^>]*>/gi) || [])
    .filter(tag => /\brel=["']stylesheet["']/i.test(tag))
    .map(tag => tag.match(/\bhref=["']([^"']+)["']/i)?.[1])
    .filter(Boolean);
}

function resolveLocalReference(reference, baseDir) {
  if (!reference || /^(?:data:|blob:|https?:|\/\/)/i.test(reference)) return null;
  const clean = reference.replace(/[?#].*$/, '');
  if (clean.startsWith('/')) return path.join(ROOT, clean.replace(/^\/+/, ''));
  return path.resolve(baseDir, clean);
}

function locateAsset(relative, pageDir) {
  const canonical = path.join(ASSET_ROOT, relative);
  if (fs.existsSync(canonical)) return canonical;
  const local = path.resolve(pageDir, 'assets', relative);
  return fs.existsSync(local) ? local : null;
}

function cleanMaskSvg(svg) {
  var cleaned = svg
    .replace(/<\?xml[^>]*>/gi, '')
    .replace(/<!--([\s\S]*?)-->/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\s(?:width|height)="[^"]*"/gi, '')
    .replace(/\sstyle="[^"]*display\s*:\s*block;?[^"]*"/gi, '')
    .replace(/\s(fill|stroke)="(?!none\b|currentColor\b|url\()[^"]*"/gi, ' $1="currentColor"')
    .replace(/((?:fill|stroke)\s*:\s*)(?!none\b|currentColor\b|url\()[^;"'}]+/gi, '$1currentColor');
  cleaned = cleaned.replace(/^<svg\b([^>]*)>/i, function (_, attributes) {
    var next = attributes
      .replace(/\saria-hidden="[^"]*"/gi, '')
      .replace(/\sfocusable="[^"]*"/gi, '')
      .replace(/\spreserveAspectRatio="none"/gi, ' preserveAspectRatio="xMidYMid meet"');
    if (!/\sfill=/i.test(next)) next += ' fill="currentColor"';
    return '<svg' + next + ' aria-hidden="true" focusable="false">';
  });
  return cleaned;
}

function dataUrl(file) {
  const extension = path.extname(file).slice(1).toLowerCase();
  return `data:${MIME[extension] || 'application/octet-stream'};base64,${fs.readFileSync(file).toString('base64')}`;
}

function buildMaskPreflight(sources, assetData) {
  const rules = [];
  const seen = new Set();
  for (const css of sources) {
    for (const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const selector = match[1].trim();
      if (!selector || selector.startsWith('@') || /[<>]/.test(selector)) continue;
      const declarations = [];
      for (const property of match[2].matchAll(/(?:^|;)\s*((?:-webkit-)?mask(?:-image)?)\s*:\s*([^;]+)(?=;|$)/gi)) {
        const name = property[1].toLowerCase();
        const original = property[2].replace(/\s*!important\s*$/i, '').trim();
        const icons = iconNamesIn(original);
        let value = original.replace(/url\(\s*(['"]?)(.*?)\1\s*\)/gi, (full, quote, reference) => {
          const icon = (reference.match(ICON_NAME) || [])[0];
          const key = icon ? `icons/iconfont/${icon}.svg` : null;
          return key && assetData[key] ? `url("${assetData[key]}")` : full;
        });
        if (value === original && /var\(\s*--(?:gj-icon|i|gj-metric-graph)\b/i.test(original)) value = 'none';
        if (value === original && !icons.length) continue;
        declarations.push(`${name}:${value}!important`);
        if (icons[0]) declarations.push(`--gj-pc-mask-icon:${icons[0]}!important`);
      }
      if (!declarations.length) continue;
      const rule = `${selector}{${[...new Set(declarations)].join(';')}}`;
      if (!seen.has(rule)) {
        seen.add(rule);
        rules.push(rule);
      }
    }
  }
  return rules.join('\n');
}

function safeJson(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}

function insertBlock(html, embedded) {
  if (/<\/head>/i.test(html)) return html.replace(/<\/head>/i, embedded + '\n</head>');
  if (/<\/body>/i.test(html)) return html.replace(/<\/body>/i, embedded + '\n</body>');
  throw new Error('HTML 缺少 </head> 或 </body>，无法写入内嵌区块。');
}
