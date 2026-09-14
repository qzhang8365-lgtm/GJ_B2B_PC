# Cascader audit

- 只读来源：页面 `2638:2478`（`级联选择器cascader✅`）。未修改 Figma。
- 2026-09-10 设计确认：允许选择非叶子节点作为最终值（CAS-001 已关闭，见下方「开放问题」和专门小节）。

## 2026-09-10 CAS-002 逐 variant 只读审计

用户确认颜色已全量绑定，要求用只读 MCP 按组件集逐 variant 补 schema/mapping。本轮使用 Desktop `get_metadata`、`get_variable_defs` 与 Plugin `use_figma`（`skillNames: figma-use`，仅 `return`）。MCP 把母版标成 `<frame>` / `<symbol>`，子图层名仍是 `属性=值`，按母版口径计数。

页顶节点：`Cascader-Menu/Item` 与 `Cascader-Menu/Item-tree` 为 `COMPONENT_SET`；`Cascader-Menu`、`Cascader-Menu_checkbox`、`Cascader-Menu-tree` 为独立 `COMPONENT`。规范展示区 `4208:20452` / `4208:20451` / `4208:20450` 是实例，不计入 sets。

| 套 / 件 | 节点 | type | variants | 轴 / 说明 |
|---|---|---|---:|---|
| `Cascader-Menu/Item` | `2896:313` | COMPONENT_SET | 12 | checkbox × state × arrow |
| `Cascader-Menu/Item-tree` | `4208:20044` | COMPONENT_SET | 9 | state × level × hover |
| `Cascader-Menu` | `3271:6484` | COMPONENT | — | 单选三列 594×240 |
| `Cascader-Menu_checkbox` | `3271:6485` | COMPONENT | — | 多选两列 396×232 |
| `Cascader-Menu-tree` | `4208:20186` | COMPONENT | — | 树面板 185×240 |

旧 inventory **1 / 12 / 2** 只登记了 Item，漏记 Item-tree 与 Menu-tree。本轮更正为 **2 / 21 / 3**。

组件集 description 均为空。全部抽样节点 `reactions: []`。无 Focus 轴。键盘模型按 PAG-001 同类处理：本地补充，不假装 Figma 有焦点稿。

### Item `2896:313`

默认 variant：`2896:312` `checkbox=false, state=Default, arrow=true`。另有 TEXT 属性 `menu#4208:32` 默认「级联选项」。

缺 4 个：`checkbox=true` × `arrow=true` × 四态。不是漏计成两套；多选带箭头父行在 `Cascader-Menu_checkbox` 里用手拼 Frame。

尺寸一律 185×32，`padding 8`，`gap 10`，圆角 4。Disabled 整行 `opacity 0.4`。字 `中文/S8-CN-R` 14/22。

| variant | 节点 | 背景 | 文字 | 箭头 / 勾 |
|---|---|---|---|---|
| false / Default / true | `2896:312` | 无填充 | Primary | `icf_Arrow_right` Tertiary |
| false / Default / false | `2896:307` | 无填充 | Primary | 无箭头 |
| true / Default / false | `2896:309` | 无填充 | Primary | checkbox item：Container + Border/secondary |
| false / hover / true | `2896:308` | Hover | Primary | 箭头 Tertiary |
| false / hover / false | `2896:310` | Hover | Primary | |
| true / hover / false | `2896:311` | Hover | Primary | |
| false / checked / true | `2896:303` | Hover | **blue** | 箭头 Tertiary |
| false / checked / false | `2896:305` | Hover | blue | |
| true / checked / false | `2896:306` | Hover | **Primary** | checkbox 填充 Text/blue，勾 reversal |
| false / disabled / true | `2896:304` | 无填充 + 40% | Primary | 箭头 Tertiary |
| false / disabled / false | `2896:302` | 无填充 + 40% | Primary | |
| true / disabled / false | `2896:301` | 无填充 + 40% | Primary | checkbox 同 Default |

箭头色不随 hover/checked 变蓝，与 2026-09-09 预览修正一致。

### Item-tree `4208:20044`

默认 variant：`4208:20042` `state=active, level=first, hover=false`。缺 `default × hover=true` 三级。

| level | padding-left | 折叠箭头 | 展开箭头 |
|---|---:|---|---|
| first | 8 | `arrow-right-large` Tertiary | `arrow-down-large` Tertiary |
| second | 24 | 同上 | 同上 |
| third | 44 | 无 | 无（叶子） |

`active + hover=true` 行填充 Hover。三级 `active + hover=false`（`4208:20093`）为选中叶子：Hover + Text/blue。三级 `active + hover=true`（`4208:20119`）文字绑回 Primary，按稿不一致；实现选中叶子 hover 保持蓝字。一级 `active + hover=true`（`4208:20113`）箭头仍是 `arrow-right-large`，按稿不一致；实现以展开=down、折叠=right 为准。

### 独立面板

- `Cascader-Menu`：横向三列，列 `3001:1320` 等 198×240、padding 8、`Background/Container`。前两列描边 `Border/default`，第三列无描边。外框圆角 12、自身无填充。滚动条实例 `dropdown_item/scroll` 4×217，填充 `Text/disable`。列内 Item 实例宽 182（198−8−8）。末列选中叶子带 `icf_system_check` + Text/blue。
- `Cascader-Menu_checkbox`：两列 198×232，圆角 12。行是 182×36 Frame + `checkbox` 实例 + 可选 `icf_Arrow_right`，**不是** Item 的 checkbox variant。实现不采用 36px 行高。
- `Cascader-Menu-tree`：185×240，padding 8，圆角 12，`Background/Container`，无描边。7 个 Item-tree 实例 169×32。

`get_variable_defs` 在母版/面板上读到的绑定：`Text/Primary`、`Text/Tertiary`、`Text/blue`、`Text/disable`、`Text/reversal`、`Background/Container`、`Background/Hover`、`Border/default`、`Border/secondary`、`中文/S8-CN-R`。尺寸类属性无变量绑定。

## 2026-09-09 补充核实（用户报告预览页三处问题后）

用户给了 Figma 链接（node-id=2638-2478）反馈预览页三处问题：icon 引用不准/字体颜色、多选选中无反馈、面板宽度不跟随层级展开。这次用 `get_design_context` 对 `2896:313`（Cascader-Menu/Item）和 `4208:20186`（Cascader-Menu-tree）做了实际节点级核实（不是凭经验改的），发现并在 `preview/cascader/index.html` 修了以下几点：

- **Tree 模式图标引用错误**：`4208:20186` 显示 Tree 模式展开箭头用的是 `icf_Arrow_arrow-right-large` / `icf_Arrow_arrow-down-large`，预览页之前错用了级联模式的小箭头 `icf_Arrow_right` / `icf_Arrow_down`。已按真实节点改用 large 版本；两个文件均已确认存在于 `assets/icons/iconfont/`。
- **Tree 模式二级（城市）行缺展开箭头**：数据结构上二级 key 对应的是数组（叶子的父级），代码原来只在“值是对象”时才画箭头，导致二级行可点击展开却不显示箭头。改成所有可展开行统一显示箭头。
- **多选态字体颜色错误**：`2896:313` 显示 checkbox 模式下文字始终是 `Text/Primary`，选中态只有 checkbox 本身变蓝填充，label 不变蓝——之前预览页的 `active`（蓝字）判定把 `selected.includes(v)` 也算了进去，导致多选选中项文字被错误地染蓝。已改成多选模式下文字蓝色只由“是否在当前路径上”驱动，不再由 checkbox 选中状态驱动。
- **Tree 选中叶子多余的勾选图标**：`4208:20186` 里高亮的叶子行（示例“三级选项1”）只有蓝字 + hover 底色，没有额外的勾选图标；预览页之前会在选中的 Tree 叶子后面多画一个 `icf_system_check`，已去掉。
- **多选“没有反馈”的真实原因**：不是样式缺失，是交互逻辑缺失——点击事件里 `selected` 状态只在 `data-leaf==='true'` 时才更新，导致一级/二级的 checkbox 无论点多少次都不会变化（它们视觉上画出来了，但从未接入状态）。已改成多选模式下任意层级点击都会切换 `selected`；单选模式仍保持只在叶子节点提交，未改变既有行为。是否允许把非叶子节点选中当作最终业务值，当时仍是未决的开放问题；这次只是让已经画出来的 checkbox 控件本身能响应点击，没有替用户做那个业务判断。该问题已在 2026-09-10 由设计侧拍板，见下方「2026-09-10：非叶子节点可选（关闭 CAS-001）」。
- **面板宽度不跟随层级展开**：不是 Figma 层面的问题（Figma 本身没有"面板被外层裁剪"这回事），是预览页把交互式面板放在页面右侧 `2fr` 的固定宽度容器里、又给 `.menus` 设了 `overflow:auto`，超出容器宽度就变成横向滚动而不是可见地变宽。真实组件是浮层，不受触发元素所在容器宽度限制。已把 `.menus` 改成 `position:absolute`（相对 `.stage`），去掉宽度上限式的 `overflow:auto`，让面板随层级增加真实变宽，不再被这个演示页的窄列裁剪。

## 2026-09-09 补充：图标颜色

用户又反馈"icon 颜色不准确"。拉了 `2896:313`（Item）和 `4208:20186`（Tree）的 `get_variable_defs`，两处都绑定了独立的 `Text/Tertiary #8d96a3`（和行本身的 `Text/Primary`/`Text/blue` 是分开的变量），且 JSX 里展开箭头在 default/hover/checked 各状态下都复用同一个图标资源、外层容器没有随状态变化的颜色 class——说明箭头图标颜色是固定值，不随行的 hover/选中状态变化。

预览页之前箭头图标(`.ico`)靠 `background:currentColor` 从 `.item` 继承颜色，行变蓝（hover/active）时箭头也跟着变蓝，这是错的。已经加了 `.ico-arrow{color:var(--ds-text-tertiary)}`，级联模式的展开箭头和 Tree 模式的展开箭头都改用这个固定色，不再继承行的状态色。单选叶子节点确认态的勾选图标（`icon(I.check)`）、多选 checkbox 内的勾选图标保持不变——这两处经截图核实确实应该跟随蓝色/白色语境，不是同一类图标。

## 2026-09-09 补充：宽度/高度/圆角三轮修正 + checkbox 样式

上一节把 `.menus` 改成 `position:absolute` 后，用户反馈两个回归：圆角消失、宽度展开后溢出容器。原因是 `position:absolute` 脱离了原来 `overflow:auto` 提供的圆角裁切，且视觉上会越过 `.stage` 的虚线边界。修法：撤回 `position:absolute`，`.menus` 改回正常文档流（`display:flex;align-items:stretch;overflow:hidden;border-radius:12px`，用 `overflow:hidden` 而非 `overflow:auto` 保证圆角裁切且不出现滚动条），改用 CSS Grid 让承载面板的列本身随内容变宽：`.grid` 的第二列由固定 `2fr` 改成 `minmax(340px,max-content)`。

用户随后又反馈：即使这样，层级展开变宽后仍然会遮挡/溢出页面右侧相邻内容——因为面板始终被限制在页面两栏布局的固定右列里，`max-content` 只能让这一列在有限空间内变宽，宽度不够时终究会跟旁边内容打架。用户明确指示："如果这块宽度不够就不要放在页面右侧了，往下直排吧"。这次改用户要的方案：不再让"交互属性"面板留在 `.grid` 的右侧 `aside.col` 里，而是把它整个搬出两栏网格，作为独立的全宽 `<article class="panel demo-panel">` 放在网格下方（`.grid` 现在只包含左侧说明性内容一栏）。这样演示区始终有整页宽度可用，层级展开多宽都不会再被相邻内容挤压——用空间换布局，而不是继续在窄列里想办法压缩宽度。相应删掉了不再需要的 `@media(max-width:1000px){.grid{grid-template-columns:1fr}}`（原本是给两栏布局在窄屏时退化用的，现在网格本来就是单栏）。

同一批还处理了两点之前未记录的修正：
1. **面板高度跟随内容**：用户要求"第一层三个选项，面板就是三行高；展开第二级五个选项，整个面板变成五行高"。原来 `.menu`/`.tree` 都有硬编码 `min-height:232px` 的高度下限，导致选项少时面板仍然固定高。去掉这两处 `min-height`，靠已有的 `.menus{align-items:stretch}` 让 flex 兄弟列自然拉伸到最高一列的真实内容高度，不再需要额外 JS 测高。
2. **多选 checkbox 样式**：用户反馈"checkbox 怎么还是原生css"。核实后发现问题：多选态的 `.check`/`.check.on` 是这个演示页自己手写的方块，勾选态直接塞了一个 16×16 的 `icf_system_check.svg` 图标铺满整个方框，视觉上是一块实心色块，跟组件库里真正核实过的 `.gj-checkbox`（`assets/styles/gj-b2b-components.css` 第 461–468 行）不是同一套画法——真正的 `.gj-checkbox` 勾选态是用 `::after` 一个 10×7 的 `clip-path` 多边形居中画出来的小勾，不是整图标填满。已经把 `.check`/`.check.on` 改成跟 `.gj-checkbox` 完全一致的技术方案（同一套 `clip-path` 多边形、同样的 `--ds-brand-gj-blue`/`--ds-radius-xs` token、加上 hover 边框态），并从 `item()` 里去掉 `icon(I.check)` 这个多余的图标调用。颜色数值本身之前是对的（`--ds-text-blue` 和 `--ds-brand-gj-blue` 都指向同一个 primitive `blue-b06`），问题是画法不一致导致视觉观感像随手写的默认方框，不是颜色错。

## 2026-09-10：非叶子节点可选（关闭 CAS-001）

设计确认：允许把非叶子节点选中作为最终值，采用业界常见的 `changeOnSelect` 模式——点击或 `Enter` 任意层级节点（叶子或非叶子）都会立即把该节点提交为当前值；非叶子节点在提交的同时依然展开下一层，用户既可以停在这一层，也可以继续往更深一层选更具体的值。选中某层后再选其祖先或兄弟节点，用新路径整体替换旧值，不做多值累加（多选模式不受影响，仍按原有 toggle 逻辑各层独立勾选）。

实现改动（`preview/cascader/index.html`）：

- 级联（列）模式单选：点击处理器原来是 `else if (b.dataset.leaf === 'true') selected = [v]`（只有叶子才提交），改为 `else selected = [v]`（任意层级点击都提交）；非叶子原本就会执行的 `path[l] = v` 继续展开下一列，行为不变。
- Tree 模式：原来 `[data-tree]` 节点（省/市这类非叶子）点击只切换展开/折叠，不参与 `selected`。现改为点击时同时更新 `selected`（单选整体替换、多选 toggle 累加）与展开状态；`treeRows()` 渲染时按 `selected.includes(key)` 给非叶子节点加 `is-checked` 样式，与叶子节点的高亮方式一致（复用既有 `.gj-cascader-item.is-checked` CSS，未新增样式）。
- 级联多选模式此前已支持任意层级 toggle（见上方 2026-09-09 补充核实），本次未改动。
- 键盘：`Enter`/`Space` 走原生 `<button>` 点击语义，两处改动后自动覆盖键盘操作，未单独加 Enter 处理。`ArrowRight` 展开下一层时会连带触发点击、从而提交该层为值，这是 `changeOnSelect` 模式下的预期行为，不是新引入的副作用。
- 「叶子选中后关闭」（`closeLeaf`）开关维持原语义不变：非叶子提交后面板保持展开，方便继续往下选；只有选中叶子才按开关设置决定是否关闭，这个区分本来就是 `changeOnSelect` 的标准做法，未额外调整。

`schema.json`（`constraints`、`interaction.keyboard.cascade.Enter`、`interaction.keyboard.tree.Enter`、`knownFigmaIssues`）与 `rules.md`（展开与选择、键盘两节）已同步移除"见 CAS-001"的悬置措辞，改写为已确认的 `changeOnSelect` 行为描述。

## 开放问题

1. **CAS-001 · P1 · 已关闭（2026-09-10）** — 是否允许选择非叶子节点：设计确认允许，采用 `changeOnSelect` 模式，详见上方小节。
2. **CAS-002 · P2 · 已关闭（2026-09-10）** — 2 套 21 variants + 3 独立件已逐轴核对默认组合、颜色绑定；键盘为本地补充。inventory 更正为 2/21/3。

## 结论

Cascader 升级为 `figma-audited`。生成时：列宽 198 不是 Item 母版 185；Hover 不改字色；多选选中字保持 Primary；箭头固定 Tertiary；树缩进 8/24/44；Disabled 40% 透明。`pendingExtraction` 为空。

## 2026-09-11 规范页共享基座修复

- 删除规范站外壳按 URL 动态注入 `mode-previews.js` 的旧逻辑，并删除该遗留脚本。旧脚本使用 `.preview-menu / .item / .check` 和页面内硬编码样式重画组件，导致左侧“模式”区与真实共享基座不一致。
- 左侧单选、多选、树状三种展开态现直接使用 `.gj-cascader / .gj-cascader-column / .gj-cascader-item / .gj-cascader-check`，与右侧交互演示共用同一组件 CSS 与 Token。
- 页面直接打开和嵌入规范站外壳时不再走两套初始化路径；Cascader 只保留页面自身一个权威运行时。

## 2026-09-11：清理预览页残留旧 CSS（新增并关闭 CAS-003）

背景：延续 MDL-010（见 `components/modal/audit.md`）建立的方法，对 `preview/cascader/index.html` 做同样的死代码核查——用户明确的标准原则是预览页无论静态展示区还是交互区，都应该只用标准组件基座渲染，不应该残留旧 CSS。

排查方法：同 MDL-010，解析页面全部 `<style>` 块，提取每个选择器涉及的类名，逐个类名对照页面真实 `class="..."` 属性（含 JS 动态拼接的模板字符串）确认是否被引用；复合选择器按逗号拆分成分支逐项判断，只删除全部分支都确认无引用的规则，混有真实类的复合选择器保留但裁掉死亡分支。

整条规则删除（1 条）：`.code`。

验证：脚本二次扫描确认页面残留死选择器为 0；`<style>` 块大括号计数与逐字符深度校验均通过（与 button.html 同批次校验时一并发现并排除结构性错误）；本文件删除/裁剪的选择器均逐一比对过页面真实 `class="..."` 与 `classList` 调用，确认为未引用的旧代码，属于低风险清理，未单独截图复核。

结论：CAS-003 已关闭。`preview/cascader/index.html` 内嵌 CSS 现在只包含仍被页面实际使用的选择器。

## 2026-09-14：树状选择静态示例误给祖先节点加了选中高亮（新增并关闭 CAS-004）

用户反馈：「级联选择的下拉窗展示又出现了多个 hover 态同时出现」，并附了「树状选择」示例卡截图——广东省、广州市、天河区三行同时呈现一模一样的浅蓝底高亮，看起来像同时有三个 hover。

排查：`preview/cascader/index.html` 里有两套 Tree 渲染逻辑。真正驱动交互演示的 `treeRows()` 函数本来就只在叶子节点满足 `state.selected.includes(name)` 时才加 `is-checked`，祖先节点只根据展开状态切换箭头方向（`treeDown`/`treeRight`），从未加过 `is-checked`——这部分逻辑没有问题。问题出在专门用于「使用模式」对比展示的 `renderSamples()` 函数：这是一段手写的静态 HTML，为了摆出「已经选到天河区」的示意效果，把路径上的 广东省、广州市（祖先）和 天河区（叶子）三个按钮全部写了 `is-checked` 类。

而 CSS 里 `.gj-cascader-item.is-checked` 和 `.gj-cascader-item:hover` 共用同一个背景变量 `--ds-component-cascader-hover-background`（即 `Background/Hover`），这个共用本身没有问题（下面会说明这是 Figma 的原始设计），但把它同时套在三个纵向堆叠的列表行上，视觉上就是三行一模一样的高亮条，跟「鼠标同时悬停在三行上」没有任何区别。

用只读方式核对 Figma 组件集 `Cascader-Menu/Item-tree`（节点 4208:20044，file `8b01I1e3TzH1IhYlr3tJzd`，轴为 `state=[active,default] × level=[first,second,third] × hover=[false,true]`，实收 9 个 variant）：

- 节点 4208:20042（`state=active, level=first, hover=false`，即路径上的祖先节点、未被鼠标悬停）：渲染为纯黑色文字 + 展开箭头图标，不带任何背景色。
- 节点 4208:20093（`state=active, level=third, hover=false`，即真正被选中的叶子节点）：渲染为 `Text/blue` 蓝色文字 + `Background/Hover`（`#2b73ff0d`）浅蓝底高亮。
- 变量核对（`get_variable_defs`）确认整个组件集只用了一个背景变量 `Background/Hover`，供「鼠标悬停」和「叶子已选中」两种含义复用——这是 Figma 自身的 token 设计，不是代码层面的误用；代码里 `--ds-component-cascader-hover-background` 与 Figma 完全对应，无需改动。

结论：真正需要修的不是颜色 token，而是「哪些节点该加 is-checked」——只有路径末端真正被选中的叶子节点才应该获得 `Background/Hover` 高亮，路径中间的祖先节点只是「处于展开状态」，应该保持默认文字颜色，仅靠箭头方向（向下）表达「已展开」，不应该获得选中高亮。

修复：`renderSamples()` 里去掉 广东省、广州市 两个按钮上的 `is-checked` 类，保留原有的展开箭头图标；天河区（叶子）保留 `is-checked`。

顺带核对：多列级联模式（`Cascader-Menu/Item`，节点 `2896:313`，12 variants）里每一列各自高亮自己的已选项（广东省在第一列高亮、广州市在第二列高亮、天河区在第三列带勾选），截图核对 Figma 该组件集的 `checked` 态确认这是分列面包屑式的设计（每列是独立列表，各自标记自己的已选项），不是同一列表内堆叠出多个高亮，与树状视图的问题不是一回事，因此单选级联/多选级联两个示例卡未做任何改动。

验证：结构完整性校验（div/section/button 标签计数、`<style>`/`<script>` 大括号与括号平衡）通过；Playwright 截图确认修复后「树状选择」卡片里 广东省/广州市 显示为默认黑字 + 展开箭头，仅 天河区 保留浅蓝底 + 蓝字选中样式；页面其余部分（单选级联、多选级联、交互演示的展开/选择/键盘行为）截图与控制台核对均无回归，仅剩与本问题无关、其他页面同样存在的 font-runtime.js 预置 404。

结论：CAS-004 已关闭。`preview/cascader/index.html` 的树状选择静态示例现在只高亮真正被选中的叶子节点，祖先节点保持默认展开样式，与 Figma `Cascader-Menu/Item-tree` 组件集的设计一致。

## 2026-09-14：交互演示下拉面板被触发器宽度连带限制（新增并关闭 CAS-005）

用户反馈：「交互演示部分级联展开被容器宽度遮挡」。

排查：`.interactive-anchor{width:min(100%,320px)}` 这个宽度本来是给触发器输入框用的，让它保持普通表单控件的观感，不至于占满整个 `.interaction-stage`。但下拉面板 `#demo`（`.interactive-panel`）是这个锚点容器内的直接子元素，且自身没有显式 `width`，`width:auto` 在块级盒子里等于「使用父容器内容宽度」，于是被连带限制成了 320px。而级联下拉一旦展开第二列，真实内容宽度是 396px（2 × 198px 每列），三列或多选场景会更宽，超出的部分虽然靠面板自带的 `overflow-x:auto` 能横向滚动看到，但没有明显的滚动条视觉提示，用户看到的就是「第二列被截断、右边框和箭头图标都不见了」，读起来像是容器裁切了内容，而不是「还可以往右滚」。

这和 DatePicker 页面处理触发器 + 面板的方式不同：DatePicker 把触发器和日历面板做成 `.interactive-row` 里并排的两个 flex 子项，面板本身不嵌套在触发器的窄容器里，因此面板可以按自己的内容宽度渲染，不会被触发器的宽度绑架。Cascader 页面是把面板放在触发器下方、同一个窄锚点容器内，这种「面板紧贴在触发器下面」的布局更接近真实业务场景（下拉框展开在输入框正下方），但当时遗漏了让面板自身摆脱锚点宽度的限制。

修复：给 `.interactive-panel` 增加 `width:max-content`，使其按下拉内容的实际宽度渲染，不再继承 320px 的锚点宽度；保留原有的 `max-width:calc(100vw - 96px)` 和 `overflow-x:auto`，只在面板自身内容宽度确实超出这个安全上限（例如极窄屏幕 + 多列同时展开的极端情况）时才退化为局部横向滚动，作为兜底而不是常规呈现方式。

验证：Playwright 在 1280 / 1000 / 800 / 600 / 480px 五档视口宽度下，展开「江苏省 → 南京市/苏州市」二级列表核对：面板宽度都等于内容实际宽度（`scrollWidth === clientWidth`，不需要内部滚动），第二列文字与右侧箭头图标完整显示，未被裁切；`document.documentElement.scrollWidth` 在全部测试宽度下均未超过视口宽度（没有引入整页异常横向滚动）。同时完整跑了一遍功能回归：单选级联展开/选中叶子/自动收起、多选级联勾选、切到树状模式、Esc 关闭下拉，均无异常，控制台仅剩与本问题无关、其他页面同样存在的 font-runtime.js 预置 404。

结论：CAS-005 已关闭。交互演示区域的级联下拉面板现在按自身内容宽度展开，不再被触发器的 320px 宽度连带裁切。
