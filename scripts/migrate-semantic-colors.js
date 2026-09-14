const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const preview=path.join(root,'preview');
const excluded=new Set(['color/index.html','effects/index.html']);
const aliases={
  text:'ds-text-primary',primary:'ds-text-primary',t:'ds-text-primary',
  secondary:'ds-text-secondary',s:'ds-text-secondary',
  tertiary:'ds-text-tertiary',muted:'ds-text-tertiary',x:'ds-text-tertiary',
  disable:'ds-text-disable',disabled:'ds-text-disable',
  border:'ds-border-default',b:'ds-border-default',
  border2:'ds-border-secondary','border-2':'ds-border-secondary',b2:'ds-border-secondary',
  page:'ds-background-background',bg:'ds-background-background',
  surface:'ds-background-container',panel:'ds-background-container',
  blue:'ds-text-blue',red:'ds-feedback-error-rise',green:'ds-feedback-success-decline'
};
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?files(path.join(dir,entry.name)):[path.join(dir,entry.name)]);}
for(const file of files(preview).filter(file=>file.endsWith('.html'))){
  const relative=path.relative(preview,file).replaceAll(path.sep,'/');
  if(excluded.has(relative))continue;
  let source=fs.readFileSync(file,'utf8');
  const tokenHref=relative.includes('/')?'../../assets/styles/semantic-colors.css':'../assets/styles/semantic-colors.css';
  if(!source.includes('semantic-colors.css'))source=source.replace('</title>',`</title><link rel="stylesheet" href="${tokenHref}">`);
  for(const [oldName,newName] of Object.entries(aliases)){
    const escaped=oldName.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    source=source.replace(new RegExp(`--${escaped}\\s*:[^;}]+;?`,'g'),'');
    source=source.replace(new RegExp(`var\\(--${escaped}\\)`,'g'),`var(--${newName})`);
  }
  source=source
    .replace(/color:\s*#101828\b/gi,'color:var(--ds-text-primary)')
    .replace(/color:\s*#475467\b/gi,'color:var(--ds-text-secondary)')
    .replace(/color:\s*#8d96a3\b/gi,'color:var(--ds-text-tertiary)')
    .replace(/color:\s*#b8c0cc\b/gi,'color:var(--ds-text-disable)')
    .replace(/color:\s*#b3b8c1\b/gi,'color:var(--ds-text-disable)')
    .replace(/color:\s*#fff(?:fff)?\b/gi,'color:var(--ds-text-reversal)')
    .replace(/color:\s*#2b73ff\b/gi,'color:var(--ds-text-blue)')
    .replace(/background(?:-color)?:\s*#fff(?:fff)?\b/gi,'background:var(--ds-background-container)')
    .replace(/background(?:-color)?:\s*#f5f7fa\b/gi,'background:var(--ds-background-background)')
    .replace(/background(?:-color)?:\s*#fafbfc\b/gi,'background:var(--ds-background-tertiary)')
    .replace(/border-color:\s*#2b73ff\b/gi,'border-color:var(--ds-border-focused)')
    .replace(/border-color:\s*#ebeef2\b/gi,'border-color:var(--ds-border-default)')
    .replace(/border-color:\s*#d7dce3\b/gi,'border-color:var(--ds-border-secondary)')
    .replace(/#f8fafc\b/gi,'var(--ds-background-background)')
    .replace(/#e5f0ff\b/gi,'var(--ds-background-selected)')
    .replace(/#f2f7ff\b/gi,'var(--ds-background-selected)')
    .replace(/#ebeef2\b/gi,'var(--ds-border-default)')
    .replace(/#d7dce3\b/gi,'var(--ds-border-secondary)')
    .replace(/#b8c0cc\b/gi,'var(--ds-text-disable)')
    .replace(/#667085\b/gi,'var(--ds-feedback-plain)')
    .replace(/#9cc0ff\b/gi,'var(--ds-button-primary-bg-disable)')
    .replace(/#1f63f0\b/gi,'var(--ds-button-primary-bg-pressed)')
    .replace(/#f93838\b/gi,'var(--ds-feedback-error-rise)')
    .replace(/#12b76a\b/gi,'var(--ds-feedback-success-decline)')
    .replace(/rgba\(43\s*,\s*115\s*,\s*255\s*,\s*\.05\)/gi,'var(--ds-background-hover)')
    .replace(/rgba\(0\s*,\s*0\s*,\s*0\s*,\s*\.03\)/gi,'var(--ds-background-hover-2)')
    .replace(/rgba\(0\s*,\s*0\s*,\s*0\s*,\s*\.1(?:0)?\)/gi,'var(--ds-background-mk-10)')
    .replace(/#111827\b/gi,'var(--ds-background-mk-80)')
    .replace(/#dbeafe\b/gi,'var(--ds-text-reversal)')
    .replace(/#2b73ff\b/gi,'var(--ds-brand-gj-blue)')
    .replace(/#101828\b/gi,'var(--ds-text-primary)')
    .replace(/#475467\b/gi,'var(--ds-text-secondary)')
    .replace(/#8d96a3\b/gi,'var(--ds-text-tertiary)')
    .replace(/#fff(?:fff)?\b/gi,'var(--ds-text-reversal)')
    .replace(/#fafbfc\b/gi,'var(--ds-background-tertiary)')
    .replace(/#f5f7fa\b/gi,'var(--ds-background-background)')
    .replace(/#(?:f7f8fa|f7f9fc|f2f4f8|f1f3f6|edf0f4|e9edf2|eef0f3|e7eaf0)\b/gi,'var(--ds-background-background)')
    .replace(/#(?:d0d5dd|cfd6e1|cfd6e0)\b/gi,'var(--ds-border-secondary)')
    .replace(/rgba\(43\s*,\s*115\s*,\s*255\s*,\s*\.08\)/gi,'var(--ds-background-bt-b8)')
    .replace(/rgba\(43\s*,\s*115\s*,\s*255\s*,\s*\.1\)/gi,'var(--ds-background-bt-b10)')
    .replace(/rgba\(43\s*,\s*115\s*,\s*255\s*,\s*\.15\)/gi,'var(--ds-background-bt-b15)')
    .replace(/rgba\(43\s*,\s*115\s*,\s*255\s*,\s*\.(?:18|2|20|22)\)/gi,'var(--ds-background-bt-b20)')
    .replace(/rgba\(255\s*,\s*255\s*,\s*255\s*,\s*\.(?:9|90)\)/gi,'var(--ds-text-reversal)')
    .replace(/rgba\(255\s*,\s*255\s*,\s*255\s*,\s*\.(?:55|6|60)\)/gi,'var(--ds-background-wt-60)')
    .replace(/rgba\(0\s*,\s*0\s*,\s*0\s*,\s*\.(?:45)\)/gi,'var(--ds-background-mk-45)')
    .replace(/rgba\(0\s*,\s*0\s*,\s*0\s*,\s*\.(?:6|60)\)/gi,'var(--ds-background-mk-60)')
    .replace(/rgba\(16\s*,\s*24\s*,\s*40\s*,\s*\.12\)/gi,'var(--ds-background-mk-10)')
    .replace(/rgba\(16\s*,\s*24\s*,\s*40\s*,\s*\.(?:04|06|08)\)/gi,'var(--ds-background-hover-2)');
  const literalTokens={
    '#6d9fff':'--ds-primitive-blue-b05','#8eb7ff':'--ds-primitive-blue-b04','#b9c8ff':'--ds-primitive-blue-b03','#9cbcff':'--ds-primitive-blue-b04',
    '#1d2f66':'--ds-primitive-deepblue-db10','#91b0ff':'--ds-primitive-deepblue-db04','#4167d8':'--ds-primitive-deepblue-db06','#2f4fb8':'--ds-primitive-deepblue-db07','#dde7ff':'--ds-primitive-deepblue-db02','#eef3ff':'--ds-primitive-deepblue-db01',
    '#fef2f2':'--ds-primitive-red-r01','#fee2e2':'--ds-primitive-red-r02','#fd9b9b':'--ds-primitive-red-r04','#d92020':'--ds-primitive-red-r07',
    '#ecfdf3':'--ds-primitive-green-g01','#d1fadf':'--ds-primitive-green-g02','#6ce9a6':'--ds-primitive-green-g04','#039855':'--ds-primitive-green-g07',
    '#fff7ed':'--ds-primitive-orange-o01','#ffedd5':'--ds-primitive-orange-o02','#fdba74':'--ds-primitive-orange-o04','#f77c09':'--ds-primitive-orange-o06','#ff6a00':'--ds-primitive-orange-o07',
    '#fffbe6':'--ds-primitive-yellow-y01','#fff3bf':'--ds-primitive-yellow-y02','#ffd95a':'--ds-primitive-yellow-y04','#f5b800':'--ds-primitive-yellow-y06','#d99a00':'--ds-primitive-yellow-y07',
    '#ecfeff':'--ds-primitive-cyan-c01','#cffafe':'--ds-primitive-cyan-c02','#67e8f9':'--ds-primitive-cyan-c04','#06b6d4':'--ds-primitive-cyan-c06','#0891b2':'--ds-primitive-cyan-c07',
    '#f0f9ff':'--ds-primitive-sky-s01','#e0f2fe':'--ds-primitive-sky-s02','#7dd3fc':'--ds-primitive-sky-s04','#0ea5e9':'--ds-primitive-sky-s06','#0284c7':'--ds-primitive-sky-s07',
    '#f5f3ff':'--ds-primitive-purple-p01','#ede9fe':'--ds-primitive-purple-p02','#c4b5fd':'--ds-primitive-purple-p04','#8b5cf6':'--ds-primitive-purple-p06','#7c3aed':'--ds-primitive-purple-p07',
    '#fdf2f8':'--ds-primitive-pink-pk01','#fce7f3':'--ds-primitive-pink-pk02','#f9a8d4':'--ds-primitive-pink-pk04','#ec4899':'--ds-primitive-pink-pk06','#db2777':'--ds-primitive-pink-pk07',
    'rgba(43,115,255,.09)':'--ds-background-bt-b10','rgba(43,115,255,.10)':'--ds-background-bt-b10','rgba(249,56,56,.05)':'--ds-background-bt-r5',
    'rgba(16,24,40,.92)':'--ds-background-mk-80','rgba(16,24,40,.9)':'--ds-background-mk-80','rgba(16,24,40,.88)':'--ds-background-mk-80',
    'rgba(255,255,255,.72)':'--ds-background-wt-80','rgba(255,255,255,.76)':'--ds-background-wt-80','rgba(255,255,255,.08)':'--ds-background-wt-10','rgba(255,255,255,.07)':'--ds-background-wt-10','rgba(255,255,255,.055)':'--ds-background-wt-10','rgba(255,255,255,.045)':'--ds-background-wt-10',
    'rgba(71,84,103,.05)':'--ds-background-hover-2','rgba(71,84,103,.06)':'--ds-background-hover-2','rgba(71,84,103,.08)':'--ds-background-hover-2'
  };
  for(const [literal,token] of Object.entries(literalTokens))source=source.replaceAll(literal,`var(${token})`);
  const normalizedTokens={
    '#fff7e8':'--ds-primitive-orange-o01','#fff8eb':'--ds-primitive-orange-o01','#fffaf2':'--ds-primitive-orange-o01','#ffdca8':'--ds-primitive-orange-o03','#7a4b00':'--ds-primitive-orange-o09','#8a4b08':'--ds-primitive-orange-o09',
    '#d92d20':'--ds-primitive-red-r07','#ffd0d0':'--ds-primitive-red-r03','#fff7f7':'--ds-primitive-red-r01','#fff4f3':'--ds-primitive-red-r01',
    '#dbe8ff':'--ds-primitive-blue-b02','#e7f0ff':'--ds-primitive-blue-b01','#eef5ff':'--ds-primitive-blue-b01','#eaf2ff':'--ds-primitive-blue-b01','#f5f9ff':'--ds-primitive-blue-b01','#eef4ff':'--ds-primitive-blue-b01',
    '#a9c8ff':'--ds-primitive-blue-b04','#d5e4ff':'--ds-primitive-blue-b03','#9fc0ff':'--ds-primitive-blue-b04','#bdd4ff':'--ds-primitive-blue-b03','#5f94ff':'--ds-primitive-blue-b05','#cfe0ff':'--ds-primitive-blue-b03','#1f5cbf':'--ds-primitive-blue-b08','#b2dbff':'--ds-primitive-blue-b03',
    '#e7ecf4':'--ds-border-default','#e7ebf0':'--ds-border-default','#e6e9ee':'--ds-border-default','#e8eef8':'--ds-border-default','#d7e4fa':'--ds-border-secondary','#c4cad3':'--ds-text-disable','#999':'--ds-text-tertiary','#000':'--ds-text-primary','#667fff':'--ds-brand-gj-purple',
    'rgb(141,150,163)':'--ds-text-tertiary','rgba(0,0,0,.08)':'--ds-background-mk-10','rgba(0,0,0,.3)':'--ds-background-mk-30','rgba(0,0,0,.35)':'--ds-background-mk-30','rgba(0,0,0,.4)':'--ds-background-mk-45',
    'rgba(16,24,40,.10)':'--ds-background-mk-10','rgba(16,24,40,.09)':'--ds-background-mk-10','rgba(16,24,40,.18)':'--ds-background-mk-20','rgba(16,24,40,.25)':'--ds-background-mk-20','rgba(16,24,40,.45)':'--ds-background-mk-45',
    'rgba(43,115,255,.07)':'--ds-background-bt-b8','rgba(43,115,255,.12)':'--ds-background-bt-b10','rgba(43,115,255,.14)':'--ds-background-bt-b15','rgba(43,115,255,.24)':'--ds-background-bt-b20','rgba(43,115,255,.25)':'--ds-background-bt-b20','rgba(43,115,255,.28)':'--ds-background-bt-b20','rgba(43,115,255,.34)':'--ds-background-bt-b20','rgba(43,115,255,.55)':'--ds-background-bt-b20',
    'rgba(65,103,216,.10)':'--ds-background-bt-db10','rgba(65,103,216,.20)':'--ds-background-bt-db20','rgba(56,189,248,.10)':'--ds-background-bt-s10','rgba(71,84,103,.055)':'--ds-background-hover-2',
    'rgba(255,255,255,.34)':'--ds-background-wt-30','rgba(255,255,255,.42)':'--ds-background-wt-40','rgba(255,255,255,.88)':'--ds-background-wt-80','rgba(215,220,227,.72)':'--ds-border-secondary','rgba(235,238,242,.72)':'--ds-border-default'
  };
  for(const [literal,token] of Object.entries(normalizedTokens))source=source.replaceAll(literal,`var(${token})`);
  fs.writeFileSync(file,source);
}
