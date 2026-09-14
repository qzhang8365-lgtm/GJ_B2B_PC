# Switch Figma 审计

来源：Figma 页面 `2638:2420`、组件集 `3014:1927`，2026-09-08 只读检查。组件集包含 8 个 variant，完整覆盖 `2 Size × 2 on × 2 disable`，与 inventory 一致。

本轮使用 Figma 设计上下文、节点元数据、变量定义和逐 variant 截图交叉核对。设计侧手动修正后于 2026-09-08 再次读取全部 8 个 variant，并对 Medium/Small 的 on/off/disabled 位置逐项复查。

## 已确认的真实结构

- Medium：44 × 24，thumb 20；Small：28 × 16，thumb 12。
- `on=true` 使用 `Brand/GJ_Blue`，`on=false` 使用 `Text/disable`。
- thumb 在全部状态绑定 `Text/reversal`，并使用 `shadow_small`；本地 componentToken 写的是同值 `Background/Container`，属于语义别名不一致。
- Disabled 截图确认整体弱化；只读返回未暴露精确 opacity，现有 Token 的 `0.4` 仍来自本地规则，不标记为 Figma 精确值。
- Figma 没有 Hover、Pressed、Focus variant。代码里的 `:active` 与 `:focus-visible` 是交互/可访问性补充，不是 Figma 状态。

## 已关闭问题

1. **SWI-001 · 已关闭：on/off 滑块方向已修正**
   - `on=true`：Medium 节点 `3014:1926` / `3014:1925` 的 thumb x=22；Small 节点 `3014:1923` / `3014:1921` 的 thumb x=14，即右侧。
   - `on=false`：Medium 节点 `3014:1924` / `3014:1922` 的 thumb x=2；Small 节点 `3014:1920` / `3014:1919` 的 thumb x=2，即左侧。
   - 组件集仍为 8 个 variant，节点 ID、尺寸、颜色和 `shadow_small` 绑定均未因修正发生意外变化。
   - 结论：与常规 Switch 语义及本地规则“Off 左 / On 右”一致，2026-09-08 复查关闭。

## 开放问题

无。SWI-002、SWI-003 均已关闭，见下方「已关闭问题」相关章节。

## 已关闭问题（补充）

1. **SWI-002 · 已关闭（2026-09-10 设计确认）**
   - Figma thumb 绑定 `Text/reversal`（#FFFFFF）；本地 Token 采用 `Background/Container`（#FFFFFF）。
   - 设计确认 thumb 正式语义为 `Background/Container`；两者视觉值相同，但语义更准确、主题迁移更安全。componentToken 已统一，建议 Figma 侧后续把节点绑定也同步改过来，不阻塞当前实现。

2. **SWI-003 · 已关闭（2026-09-10 设计确认）**
   - 当前只有 on/off/disabled，没有 Hover、Pressed、Focus variant。
   - 设计确认不需要在 Figma 补状态；边界已在 schema `implementationSupplements` 中写明——代码侧保留原生 focus-visible 和轻微 pressed 反馈，不得声称为 Figma variant。

## 结论

Switch 的节点、variant、尺寸、颜色/效果绑定与视觉状态已经完成真实 Figma 审计，schema/mapping 状态保持 `figma-audited`。SWI-001、SWI-002、SWI-003 均已关闭，Switch 组件审计问题已全部关闭。

## 2026-09-10：关闭 SWI-003

设计确认：Figma Switch 组件集保持只提供 on/off/disabled（Size=medium/small 共 8 个 variant），不需要补充 Hover/Pressed/Focus variant。

- `references/components/switch/schema.json`：新增 `confirmedDecisions` 记录该决策；`implementationSupplements` 字段此前已写明代码侧边界（原生 focus-visible + 轻微 pressed 反馈，不得声称为 Figma variant），无需改动。
- 未涉及 mapping、CSS 或 Token 改动，纯粹是决策确认。

## 2026-09-10：关闭 SWI-002（thumb 正式语义确认为 Background/Container）

设计确认：thumb 正式语义为 `Background/Container`，不是 Figma 节点历史绑定的 `Text/reversal`。两者视觉值相同（#FFFFFF），但 `Background/Container` 语义更准确、主题迁移更安全。

同步范围：
- `references/components/switch/schema.json`：`stateBindings` 四态的 `thumb` 字段由 `Text/reversal` 改为 `Background/Container`，并补充说明；`confirmedDecisions` 追加记录。
- `references/components/switch/mapping.json`：`tokenMap` 的 `thumb.figma`/`thumb.localEquivalent` 两个并列 key 合并为单一 `thumb` key，指向确认后的 `Background/Container`。
- `switch.tokens.json` 的 `stateMatrix` 此前就已经统一使用 `Background/Container`，无需改动。
- 建议 Figma 侧后续把节点绑定也同步为 `Background/Container`，本地已先行确认，不阻塞。

## 2026-09-11：清理预览页残留旧 CSS（新增并关闭 SWI-004）

背景：延续 MDL-010（见 `components/modal/audit.md`）建立的方法，对 `preview/switch/index.html` 做同样的死代码核查——用户明确的标准原则是预览页无论静态展示区还是交互区，都应该只用标准组件基座渲染，不应该残留旧 CSS。

排查方法：同 MDL-010，解析页面全部 `<style>` 块，提取每个选择器涉及的类名，逐个类名对照页面真实 `class="..."` 属性（含 JS 动态拼接的模板字符串）确认是否被引用；复合选择器按逗号拆分成分支逐项判断，只删除全部分支都确认无引用的规则，混有真实类的复合选择器保留但裁掉死亡分支。

整条规则删除（2 条）：`.code`、`.section-desc`。

验证：脚本二次扫描确认页面残留死选择器为 0；`<style>` 块大括号计数与逐字符深度校验均通过（与 button.html 同批次校验时一并发现并排除结构性错误）；本文件删除/裁剪的选择器均逐一比对过页面真实 `class="..."` 与 `classList` 调用，确认为未引用的旧代码，属于低风险清理，未单独截图复核。

结论：SWI-004 已关闭。`preview/switch/index.html` 内嵌 CSS 现在只包含仍被页面实际使用的选择器。

## 2026-09-11：预览页改用统一展示框架并精简结构（新增并关闭 SWI-005）

背景：延续 Button/Divider/Tabs/Sidebar/Navbar/GridNav/Checkbox/Radio/Input 的重构节奏，`preview/switch/index.html` 此前仍是最早期的页面私有结构（`.shell/.component/.panel/.state/.stage/.controls` 等私有类，未使用共享的 `docs-shell/docs-section/docs-stage/docs-surface-*` 展示框架）。

处理：
- 整页迁移到 `docs-shell`/`docs-sheet`/`docs-section`/`docs-stage` 框架。
- 原「状态」「尺寸与状态组合」「结构与视觉」「选用规则」「交互属性」五个面板收敛为「状态」「交互演示」「选用规则」三段：「尺寸与状态组合」（44×24 / 28×16、滑块与轨道圆角）和「结构与视觉」（2px 轨道内边距、Brand/GJ_Blue 开启态背景等纯参数说明）折进页首简介文字，不再单独占面板。
- 背景选择：Switch 轨道默认态是 `--ds-text-disable`（#B8C0CC 中灰蓝）、开启态是品牌蓝，两者都比画布灰（#F5F7FA）深得多，与白色画布也有明显明度差，不存在白底组件被吃掉的风险，所以「状态」网格和「交互演示」的演示区、控制面板统一使用 `docs-surface-white`（与 Divider 的 `.lab`/`.controls` 都用白色一致）。
- 「选用规则」从 5 条独立卡片收敛为标准的主题/推荐做法/边界与避免三列表格，把「不代替 Checkbox 或 Radio」并入「使用场景」行的边界列。
- 未改动任何 JS 逻辑；`render()`/`onchange` 绑定与原版一致，只是 DOM 结构和类名换成共享框架。

验证：`<div>`/`<section>` 标签计数与 `<style>` 大括号计数校验通过；本地起服务用 Playwright 截图确认状态网格、交互演示区在白色画布下清晰可辨；交互测试覆盖尺寸切换（Medium/Small）、禁用勾选、显示文字标签勾选、点击开关本身触发的开关联动与事件文案，均无回归。

结论：SWI-005 已关闭。`preview/switch/index.html` 现在与其余已重构组件页使用同一套展示框架和背景选择规则。

## 2026-09-11：状态展示改为尺寸×状态表格（用户反馈"矩阵不整齐"，追加修正 SWI-005）

背景：用户看过 Switch 与 DatePicker 两个重构页后反馈"排版布局不是很合理，矩阵不整齐"，并以多选框、输入框两页为参照标准。

复核：Switch 原来的「状态」区是一个 4 列卡片网格，把「尺寸」（Medium/Small）和「状态」（On/Off/On Disabled/Off Disabled）两个维度硬塞进同一层卡片列表里，靠 8 张卡片自然换行拼成 2 行 4 列——视觉上凑巧对齐，但结构上不是真正的矩阵，不像 Input 页面「尺寸与状态」表格那样用行=尺寸、列=状态的表格直接表达两个维度。

处理：把「状态」区从卡片网格改成表格：行 = Medium / Small，列 = On / Off / On Disabled / Off Disabled，与 Input 的 `state-table` 同款结构（`docs-spec-table-wrap` 包裹一个本地 `state-table`，不再额外套 `docs-stage`）。原来的 `.state-grid`/`.state-cell` 私有类整体移除。

验证：`<div>`/`<section>`/`<table>`/`<tr>`/`<td>` 标签计数与 `<style>` 大括号计数校验通过；Playwright 截图确认 2×4 表格对齐清晰；点击开关验证事件文案联动无回归。

结论：SWI-005 的背景/框架迁移结论不变，本次是同一项工作里对「状态」区展示形式的进一步修正。
