# Drawer audit

来源：`references/components/drawer/rules.md`、已验收预览页 `preview/drawer/index.html`、inventory 页面 `Drawer✅`。2026-09-09 用户明确：Drawer 规范页实现得比较标准，可以直接进行审计补充，不再逐项走 Figma `get_design_context` 复核。走 `local-contract` 路径（与 Chart、Icon 处理方式一致）。本轮**没有**对 Figma 组件做节点级核实，不得把本文件写成 figma-audited。

## 契约范围

- `size`：Small 400 / Medium 600 / Large 800px，优先用满足内容的最小档位。
- Header 64px（标题 16/24、600），Content 20px 内边距独立滚动，Footer 20px 内边距、按钮 40px 高、8px 间距、右对齐、最多一个 Primary。
- 行为：禁止 Drawer 嵌套 Drawer；`dirty=true` 时 Close/Cancel/Esc/蒙层关闭均需二次确认；打开后焦点进入并限制在内部，关闭后焦点返回触发元素；动效 240–300ms ease-out，从右向左进入、反向退出。
- 组件 Token：`references/tokens/components/drawer.tokens.json`，本轮新增并接入构建。

## 实现对照

- 预览页 `preview/drawer/index.html` 的锚定值（宽度、Header/Footer 高度、内边距、按钮尺寸）与 `rules.md`、`schema.json` 现有记录完全一致，未发现差异，这是用户判断"实现得比较标准"的依据。
- 预览页 demo 交互（`.demo-stage`/`.scrim`/`.demo-drawer`）实测出的蒙层色（`Background/MK_45`）、投影（`Background/MK_20`）、过渡时长（260ms，落在 240–300ms 区间内）已写入 `drawer.tokens.json`，均取自页面真实内联样式而非推测。

## 开放问题

1. **DRW-001 · 待前端实现（P3，非阻断）** — `assets/styles/gj-b2b-components.css` 目前没有共享的 `.gj-drawer*` 组件基座（对照 Modal 已有 `.gj-modal-layer/.gj-modal/.gj-modal-header/.gj-modal-content/.gj-modal-footer` 这套共享类）。Drawer 现在只有 `preview/drawer/index.html` 页面内联样式作为参考实现，尚未被提炼成业务可直接复用的共享基座。这是如实记录的实现差距，不影响本次契约层（schema/mapping/audit/token）的完整性，也不是这轮审计任务范围内要做的前端开发工作，留给后续前端实现时跟进。

## 结论

Drawer 为 `local-contract`：schema / mapping / audit / 组件 Token 已按用户确认与现有规则、已验收预览页补齐。覆盖看板不再缺 structuredContract 与 componentToken。唯一记录的差距（DRW-001）是共享 CSS 基座尚未提炼，不阻断契约层完整性；如未来需要逐 variant 的 Figma 真值核实，需用户另行发起，不在本轮范围内。

## 2026-09-09：共享 CSS 基座提炼（关闭 DRW-001）

`preview/drawer/index.html` 原本内联定义的 `.drawer`/`.drawer-header`/`.drawer-title`/`.close`/`.drawer-content`/`.drawer-footer`/`.scrim`/`.demo-drawer` 样式，已提炼为 `assets/styles/gj-b2b-components.css` 的共享类 `.gj-drawer`/`.gj-drawer-header`/`.gj-drawer-title`/`.gj-drawer-close`/`.gj-drawer-content`/`.gj-drawer-footer`/`.gj-drawer-scrim`，对齐 Modal 组件已有的 `.gj-modal-*` 共享基座模式。对应结构与颜色数值同步写成 `assets/styles/gj-b2b-tokens.css` 里的 `--ds-component-drawer-*` 变量。

两处设计决定（提炼时做出，均未改变预览页最终视觉）：
- 共享基座 `.gj-drawer` 默认就代表真实的右侧覆盖面板形态（`position:absolute` + 滑入滑出动效），而不是把定位样式单独放进一个「demo」专属修饰符——因为覆盖面板本来就是 Drawer 组件的真实形态，不是仅用于演示。预览页里用于静态展示组件结构的"组件结构"示意图（`.anatomy-drawer`）反过来做了页面局部覆盖（取消绝对定位、还原为 Grid 内的静态盒子），只保留它自己独有的边框和投影两个文档专属差异。
- 原来依赖祖先容器 `.demo-stage.closed` 联动子元素的写法（`.demo-stage.closed .scrim`/`.demo-stage.closed .demo-drawer`），改成直接在 `.gj-drawer`/`.gj-drawer-scrim` 元素自身切换 `.is-closed` 修饰符，交互脚本相应调整（`closeDrawer`/`render` 不再操作 `#stage` 的 class，直接操作 `drawer`/`scrim` 两个元素）。

`preview/drawer/index.html` 的 `<style>` 块已删除对应重复规则，标签配平（div 47/47、button 6/6、textarea 1/1 等）与内联脚本 `node --check` 均已验证通过。`mapping.json`/`drawer.tokens.json` 已同步更新 `implementation.status` 为 `shared-css-base` 并订正 `cssVariable` 字段（宽度改为运行时 `--gj-drawer-width` 自定义属性驱动，而不是三个固定的尺寸类，如实记录）；`drawer.tokens.json` 的 `openItems.DRW-001` 已清空。

## 结论

Drawer 仍为 `local-contract`（未做 Figma 节点级审计，不受本次改动影响），但前端实现层面不再有"仅预览页内联参考实现"的缺口——DRW-001 已解决，且已对齐 Modal 组件的共享基座模式。

## 2026-09-10：修复共享 CSS token 损坏（标题栏内边距丢失等）

用户反馈组件预览页出现“布局变化、内容溢出/覆盖、间距/内边距丢失”，核查后发现 `assets/styles/gj-b2b-tokens.css` 的 Drawer token 区块（`--ds-component-drawer-*`）在某次向 `drawer.tokens.json` 同步时出错：多个条目的 `cssVariable` 字段本身是说明性中文文字（例如“直接引用 var(--ds-border-default)，未建立组件专属别名”），被同步脚本原样当成了 CSS 自定义属性名写入 `:root{}`，产生了一批语法无效的声明。受影响且有实际视觉/交互后果的有：

- `--ds-component-drawer-header-padding`、`--ds-component-drawer-header-gap`：从未被正确定义（连带原本要定义它们的声明本身也是坏的），`.gj-drawer-header{padding:var(--ds-component-drawer-header-padding)}` 因此失效为 0——这正是用户看到的标题栏左右内边距丢失。
- `--ds-component-drawer-shadow`：值被错误写成 `-8px 0 24px {Background/MK_20}`（未解析的 Figma 变量路径，不是合法 CSS 值），导致抽屉面板完全没有投影。
- `--ds-component-drawer-motion-duration`、`--ds-component-drawer-scrim-motion-duration`：均缺失，导致抽屉打开/关闭没有滑动过渡、蒙层没有淡入淡出，是瞬时切换。

修复：重写 `gj-b2b-tokens.css` 里这一整段，把纯说明性文字改回真正的 CSS 注释（`/* ... */`），把有实际引用需要的补成合法 token（`header-padding: 0 20px`、`header-gap: var(--ds-space-4)`、`shadow` 改用 `var(--ds-background-mk-20)`、补上 `motion-duration: 260ms` 与 `scrim-motion-duration: 220ms`），并新增 `--ds-component-drawer-width: 600px` 作为 `--gj-drawer-width` 的 CSS 级默认兜底（此前同样缺失，目前预览页因为 JS 总会行内设置尺寸而未暴露，但属于同一批问题，一并补齐）。已用 Playwright 渲染截图 + `getComputedStyle` 核对：标题栏内边距/间距、投影、面板与蒙层过渡时长均恢复正常，抽屉其余部分（组件结构图、尺寸表、交互 demo、使用规则）未受影响。`drawer.tokens.json` 的 `cssVariable` 字段与新增 token 已同步更新。

补充：用户随后指出"组件结构"示意图里的抽屉没有待在容器内，而是跑到了外面盖住整个区域。复测发现这是另一个独立问题，不在 `preview/drawer/index.html` 本身，而在 `preview/index.html`（组件交互验收工作台的外壳页）：它在 iframe `load` 事件里用 `doc.head.appendChild(componentStyles)` 重新注入一份 `gj-b2b-components.css?v=general-2`，`appendChild` 把它加到了 `<head>` 末尾——晚于预览页自己原有的 `<style>` 块（其中就包含 `.anatomy-drawer{position:static}` 这条局部覆盖）。两条规则选择器优先级相同（都是单类选择器），层叠顺序里"后来者获胜"，于是新注入的 `.gj-drawer{position:absolute}`（共享默认行为）反而盖过了页面本该生效的局部覆盖，导致示意图里的抽屉被绝对定位铺满，跑出"组件结构"卡片。

已用本地 HTTP 服务器 + Playwright 完整复现（直接打开单个预览页不会复现，必须经过 `preview/index.html` 的 iframe 注入逻辑，file:// 协议下同源限制还会挡住 `contentDocument` 访问，所以只能起 HTTP 服务器测）：修复前 `position:absolute`、`contained:false`（抽屉铺满整个 iframe）；把 `appendChild` 改成 `doc.head.insertBefore(componentStyles,doc.head.firstChild)`（让重新注入的样式表永远排在最前，不再晚于页面自己的 `<style>`）后，`position:static`、`contained:true`，与直接打开单文件的结果完全一致。已通过 `preview/index.html#drawer` 端到端截图确认，`preview/index.html#skeleton` 同步验证未受影响、也无回归。

这是外壳页级别的问题，理论上影响所有"预览页局部覆盖某个 `.gj-*` 共享类默认样式"这一模式的组件，不止 Drawer——外壳页的加载顺序一改，全部预览页都会一起受益，不需要逐个组件排查。

## 2026-09-16：规范页优化与 Token 源回归修复（关闭 DRW-002）

本轮优化规范页时重新从 `drawer.tokens.json` 执行构建，发现 2026-09-10 曾在生成 CSS 中修复的问题并未完全回写到 Token 源：三档尺寸、Header Border、Footer Button Height、Close Icon、Motion Easing 等条目的 `cssVariable` 字段仍写着说明性中文，构建器会把这些文字误生成为非法 CSS 属性名；`drawer.shadow` 仍包含无法在组合字符串内解析的 `{Background/MK_20}`。因此每次重新运行 `build-tokens.mjs` 都会让损坏声明复发。

修复：把非 CSS 变量的说明移入 `note`；新增合法的 `--ds-component-drawer-width` 与 `--ds-component-drawer-title-color` 源 Token；投影改成可直接生成的 `-8px 0 24px var(--ds-background-mk-20)`。重建后 Drawer Token 区只保留合法自定义属性，`validate-tokens.mjs` 全量通过。schema 同步删除已关闭的“缺少共享基座”旧约束并登记实际 `.gj-drawer*` 实现入口。

规范页迁移到统一 `component-docs.css` 骨架，重组为组件结构、尺寸结构、交互演示、组件边界四段；静态与交互示例均引用共享 Drawer、Button、Input、Selector、DatePicker、Textarea、Checkbox 与 Modal。交互补齐显式打开入口、蒙层关闭开关、dirty 二次确认、Escape、Focus Trap、关闭后焦点返回、只读内容隐藏 Footer；未引入 Drawer 嵌套。

结论：DRW-002 已关闭，无新增待确认项；组件仍保持 `local-contract`，不升级为 Figma 审计状态。

2026-09-16 版式复核：组件结构恢复 Header、Content、Close、Footer 四组带方向箭头的空间标注；“尺寸与结构”移至交互演示之后，先体验行为再查参数。

同日展示层精简：预览页将 4 张承载边界卡片改为 1 张对照表，并把 6 条行为规则合并为 3 张双规则卡；底层规则、schema、mapping 与 Token 均未删减。

同日结构标注复核：箭头不再按两块说明区域平均定位，改为对应 Drawer 的真实三段高度（Header 64px、Content 252px、Footer 80px）；Close 与 Footer 的右侧箭头继续伸入面板 32px，分别对准关闭图标中心线和操作区。
