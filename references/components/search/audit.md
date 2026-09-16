# Search Figma 审计

来源：用户提供的四个 Search 组件节点 `2982:4914`、`2982:4993`、`4208:19089`、`4208:19104`，2026-09-09 通过 Figma Desktop `get_design_context` 与 `get_variable_defs` 逐项只读检查。未修改 Figma。

Search 完整资源应记为 **3 套 / 26 variants / 1 standalone**：`Search-Box` 12 variants、`Search-component` 12 variants、`Search_item/result` 2 variants，以及 `Search_result_list` 1 个独立组件。inventory 已按本次用户确认和节点读取结果修正。

## 已确认的组件集

### Search-Box（组件集根容器 `2982:4914`，12 variants）

样本：Medium default `2982:4910`、focused `2982:4903`、filled `2982:4906`、disabled `2982:4909`；Small default `2982:4912`；Large default `2982:4911`、filled `2982:4913`。

| state | 背景 | 边框 | 文字 | 其它 |
|---|---|---|---|---|
| default | `Background/Container` | `Border/secondary` | placeholder `Text/disable` | 无清除 |
| focused | `Background/Container` | `Border/focused` | `Text/Primary` | 2px `Background/BT_B10` ring；光标 `Text/blue`（复用 `input_item/cursor` `2911:4644`）；清除 12px（Medium） |
| filled | `Background/Container` | `Border/secondary` | `Text/Primary` | 有清除；**无** ring |
| disabled | `Background/Background` | **`Border/secondary`（不是 disabled）** | `Text/disable` | 无清除 |

尺寸：

| Size | 高度 | 水平内边距 | 垂直内边距 | gap | 圆角 | 搜索图标 | 清除 | 文字 |
|---|---|---|---|---|---|---|---|---|
| Small | 24 | 6 | 4 | default/filled/disabled 6；focused 8 | 4 | 12 | 未逐档拆 | `中文/S9-CN-R` 12/18 |
| Medium | 32 | 8 | 4 | 6 | 6 | 16 | 12 | `中文/S8-CN-R` 14/22 |
| Large | 40 | 12 | 4 | 8 | 8 | 20 | 16（filled 已核实） | `中文/S7-CN-R` 16/24 |

BOOLEAN `searchIcon`。Props 生成代码含 `size`、`state`、`searchIcon`。

Search-Box 的默认参考宽度为 233px。Medium focused 生成上下文出现 5px 垂直内边距且缺少显式高度；实现仍按 32px 控件档位统一使用 4px + box-shadow ring，避免切换状态时发生尺寸跳动（SEA-004）。

disabled 的 `get_variable_defs`（`2982:4909`）返回 `Text/Tertiary`、`Text/disable`、`中文/S8-CN-R`、`Background/Background`、`Border/secondary`。图标色未在 default 上独立拆绑定。

### Search-component（组件集根容器 `2982:4993`，12 variants）

样本：Medium default `2982:4992`、focused `2982:4991`、disabled `2982:4989`。

- 容器 `gap 8px`，内嵌 Search-Box + Primary `Button`（同档高度）。
- `focused` = 内嵌 Search-Box `focused`。
- `disabled` = 内嵌 Search-Box `disabled` + `Button/Primary/Bg-disable`。
- Small focused 内嵌 Search-Box 的图标—文字 gap 为 8px；Small 其他状态为 6px。

不得自绘搜索按钮。

### Search_item/result（`4208:19089`）+ Search_result_list（`4208:19104`）

- 项高 32，px 8 py 4，圆角 `Radius-XS` 4px，`中文/S8-CN-R`。
- `result_highlight`：底透明；正文 `Text/Primary`，命中 `Text/blue`。
- `hover`：`Background/Hover`，文字规则相同。
- 列表：`Background/Container`，padding 8，圆角 `Radius-MD` 8，效果 `shadow-down`（0 8 20 `Background/MK_10`）。四项无额外行间距，高 144。
- Figma 列表实例宽 197px 只是画板展示值；产品实现必须跟随所属搜索框宽度，不能固定为 197px。Figma **没有**选中行 variant；实现里键盘激活行复用 hover 背景。

## 相对旧 rules-derived 的核对

1. placeholder 旧契约未区分 `Text/disable` / Tertiary；Figma default 是 **`Text/disable`**，现有 CSS 已一致。
2. 禁用边框 Figma 为 **`Border/secondary`**，与 Input 的 `Border/disabled` 不同；现有 CSS 未改禁用边框，一致。
3. Search-Box **active 有 2px `BT_B10` ring**（Input 的 INP-004 不适用于 Search）。现有 CSS `:focus-within` 已有。
4. Small 字号是 **S9**，不是 Input/DatePicker Small 的 S8。现有 CSS 12/18 已一致。
5. Large 清除 **16px** 已核实；Medium 清除 12px。现有 CSS 已一致。
6. 规范页交互示例曾用未定义的 `result-item` 类，未走 `.gj-search-result`。本轮已改回基座类名。
7. 共享 CSS 原先默认宽度写成 240px，且尺寸、间距和状态仍直接引用全局变量或裸值。本轮改为 233px，并接入 `--ds-component-search-*` 组件变量。
8. 结果列表 197px 不进入强制尺寸 Token，只保留为画板实例记录；基座继续使用所属搜索框的 100% 宽度。

## 开放问题

1. **SEA-002 · P3 · 已关闭（2026-09-10）** — Search-Box 与 Search-component 均已统一为 `default / focused / filled / disabled`；旧值 `defalut / active / typing / disable` 已从现行 Figma 属性中移除。
2. **SEA-003 · P3 · 已关闭（2026-09-10）** — 对页面节点 `2638:2417` 重新读取 metadata 后，已返回三个集合根容器 `2982:4914`、`2982:4993`、`4208:19089`，以及独立组件 `4208:19104`。schema 与 Token 不再用页面 ID 代替主 `figmaNode`；页面 ID 只保留为 `figmaPage/pageNodeId`。
3. **SEA-004 · P3 · 状态尺寸异常** — Medium active 生成上下文出现 py=5 且没有显式高度。实现以公共 Medium 32px 高度为准，不复制这一状态特例。

## 结论

Search 为 `figma-audited`：四个用户指定节点均已逐项读取，Search-Box 三档尺寸与四态、Search-component 组合间距与按钮复用、结果项的高亮/hover、结果列表容器均已核实。组件 Token 已接入构建并由共享 CSS 消费。2026-09-10 起两个组件集的状态均统一为 `default/focused/filled/disabled`，SEA-002 已关闭。剩余设计源问题为 SEA-004；不阻断基座使用，也不写入 `pendingExtraction`。

## 2026-09-10：状态命名完整统一（关闭 SEA-002）

用户告知：Search 的状态属性也和 Input 一样，改成了 `focused`。

复查节点 `2982:4914`（Search-Box）与 `2982:4993`（Search-component）：

- Search-Box 原来的 `state=active` 全部 12 个 variant（Small/Medium/Large × 4 态）均已确认改为 `state=focused`。
- Search-component 原来的 `state=typing` 全部 3 个 variant（Small/Medium/Large）均已确认改为 `state=focused`。
- 两个组件集现在字面上都用同一个词 `focused`，此前 `mapping.json` 里"Search-component 的 typing 对应 Search-Box 的 active"这类归一化说明已经过时——两者本来就是同一个概念，现在 Figma 也不再用两个不同的词来表达它。
- 后续复核 `2982:4993` 确认 `defalut` 与 `disable` 也已分别修正为 `default` 与 `disabled`。Search-Box 与 Search-component 现在完整使用相同的四态词表。

代码契约同步：
- `search/schema.json`：`properties.state`、`states` 改为 `focused`；相关 constraints/partialMeasurements 说明同步。
- `search/mapping.json`：`propertyMap.state`、`valueMap`、`tokenMap`（`box.active.*`→`box.focused.*`，`box.small.activeGap`→`box.small.focusedGap`）、`interactionMap`、`layoutNormalization` 全部同步改名；`normalization.oldSchema.focused` 补充了完整的历史沿革说明（曾经叫 focused → 为匹配 Figma 改叫 active → Figma 现在又改回 focused）。
- `references/tokens/components/search.tokens.json`：`size.small.activeGap` 改名为 `size.small.focusedGap`（`stateMatrix` 本来就已经用 `focused` 命名，未受影响）；已重新执行 `node scripts/build-tokens.mjs`。
- `assets/styles/gj-b2b-components.css`：`.gj-search-active` 类改名为 `.gj-search-focused`，`--ds-component-search-size-small-active-gap` 变量改名为 `--ds-component-search-size-small-focused-gap`。
- `preview/search/index.html`：状态表头与演示脚本里的 `gj-search-active` 同步改名为 `gj-search-focused`。

范围说明：`.gj-search-result-active`（结果列表里键盘高亮行）是完全不同的概念（列表项选中态，不是输入框聚焦态），本次未改动。

## 2026-09-11：清理预览页残留旧 CSS（新增并关闭 SEA-004）

背景：延续 MDL-010（见 `components/modal/audit.md`）建立的方法，对 `preview/search/index.html` 做同样的死代码核查——用户明确的标准原则是预览页无论静态展示区还是交互区，都应该只用标准组件基座渲染，不应该残留旧 CSS。

排查方法：同 MDL-010，解析页面全部 `<style>` 块，提取每个选择器涉及的类名，逐个类名对照页面真实 `class="..."` 属性（含 JS 动态拼接的模板字符串）确认是否被引用；复合选择器按逗号拆分成分支逐项判断，只删除全部分支都确认无引用的规则，混有真实类的复合选择器保留但裁掉死亡分支。

整条规则删除（2 条）：`.code`、`.results`。

验证：脚本二次扫描确认页面残留死选择器为 0；`<style>` 块大括号计数与逐字符深度校验均通过（与 button.html 同批次校验时一并发现并排除结构性错误）；本文件删除/裁剪的选择器均逐一比对过页面真实 `class="..."` 与 `classList` 调用，确认为未引用的旧代码，属于低风险清理，未单独截图复核。

结论：SEA-004 已关闭。`preview/search/index.html` 内嵌 CSS 现在只包含仍被页面实际使用的选择器。

## 2026-09-14：预览页按用户 12 条规范重构为共享展示框架，状态展示改为真实矩阵（新增并关闭 SEA-005）

背景：用户提供了一份完整的 12 节组件规范页改版说明（页面总体结构、容器层级、页面节奏与间距、字体层级、示例展示背景、组成结构示意、组件示例、交互演示区、表格与规则整理、响应式与宽度、内容精简原则、验证要求），要求按此说明重写 `preview/search/index.html`。旧页面是页面私有结构（`.shell/.component/.panel/.matrix/.size-list/.result-demo/.stage/.demo-wrap/.controls/.rules` 等），未接入项目统一的 `docs-shell/docs-section/docs-stage` 展示框架，状态展示也不是真正的二维矩阵。

结构调整：精简为「组成结构」「使用模式」「尺寸与状态」「交互演示」「结构与选用规则」五段，删除旧页面的独立代码块展示（`#code`/`renderCode()`）与过程性文案。

组成结构：参考 `preview/selector/index.html` 已验证的 `structure-flow`/`structure-card` 图示模式（4 卡：搜索框 Search 品牌蓝高亮 + 图标/输入区/清除按钮 3 张白色说明卡）。确认按钮与结果列表未纳入组成结构图，因为它们是按使用模式挂载的组合关系，不是 Search 本体的原子构成部分；这两者的说明放在「使用模式」一段，避免同一规则在两处重复出现（规范十一）。

使用模式：新规则第五条明确允许同一 section 内按子示例差异化选择背景。「确认搜索」示例（描边搜索框 + 按钮，无悬浮元素）用白色画布；「即时联想」示例因为 `.gj-search-results` 结果列表本身无边框、只有阴影，直接放在白底上会与页面白色主容器边界不清，改用灰色画布——这与 DatePicker 页面处理 `.gj-calendar` 悬浮面板、以及吸取 Input 页面 INP-010 教训（同色叠加）的做法一致。

尺寸与状态：原「matrix」网格改为真正的 3 行（Small/Medium/Large）× 4 列（Default/Focused/Filled/Disabled）表格，与 Input 页面 `state-table` 同构（`docs-spec-table-wrap` 裸包裹，无额外 `docs-stage` 外层）。Focused/Filled 使用 `references/components/search/rules.md` 明确认可的「文档专用类」（`gj-search-focused`/`gj-search-filled`）并列展示，因为真实组件上这两个状态由 `:focus-within`/`:has()` 自动生效，静态文档页需要手动类才能并列呈现。

交互演示：左侧使用共享 `.gj-search`/`.gj-search-group`/`.gj-search-results` 真实组件基座与既有交互脚本（联想列表渲染、方向键切换、Enter 确认、Esc 关闭、清空按钮均保留原逻辑），右侧属性控制提供 Size/模式/状态三个下拉。

组件示例全部调用已有共享类与图标（`icf_system_search`、`icf_system_close-circle-fill`），未重绘或使用 emoji/占位 SVG；页面私有 CSS 只处理布局（`structure-flow`、`mode-grid`、`state-scroll`、`playground`、`controls` 等），未覆盖 `.gj-search*`/`.gj-btn` 自身样式。

选用规则从原有卡片列表收敛为统一的「主题/推荐做法/边界与避免」三列表格（模式选择、结果列表、空结果、清空与键盘、与筛选的边界、宽度）。

修复过程中发现并修正一处功能缺陷（非页面结构问题，是脚本逻辑问题）：交互演示切换到「即时搜索」模式时用 `button.hidden=instant` 试图隐藏搜索按钮，但共享 `.gj-btn` 基座自身声明了 `display:inline-flex`（作者样式表规则），会覆盖浏览器对 `[hidden]` 属性的默认 `display:none`，导致按钮实际并未消失（Playwright 校验发现 `getComputedStyle` 仍为 `flex`）。改为直接控制 `button.style.display`（`instant?'none':''`）后校验通过。这是一个可能同样存在于其他预览页（如 Upload、Toast 中同样用 `.hidden` 切换 `.gj-btn` 的地方）的潜在共性问题，已记录到 `references/component-page-conventions.md`，本轮只修复 Search 页面自身，其他页面留待各自被审计时再处理。

验证：结构完整性校验（div/section/table/tr/td/button 开闭标签计数、`<style>`/`<script>` 大括号与括号平衡）全部通过；CSS 死选择器扫描确认无孤立选择器；Playwright 全流程交互测试（输入触发联想、方向键选中、Enter 确认、清空、模式/尺寸/状态切换、禁用态）与 720px/480px 窄屏截图（`structure-flow` 由横向「+」连接切换为纵向「↓」、`mode-grid`/`control-grid` 收为单列、两张表格各自在 `docs-spec-table-wrap`/`state-scroll` 容器内局部横向滚动、`document.documentElement.scrollWidth` 在 480/720/960px 视口下均未超出视口宽度）均通过，无视觉或交互回归。

结论：SEA-005 已关闭。`preview/search/index.html` 现已接入项目统一的 `docs-*` 共享展示框架，状态展示为真实二维矩阵，且额外修正了一处 `.gj-btn` 隐藏逻辑缺陷。

## 2026-09-16：清除按钮图标未跟随搜索图标的灰色基座处理，仍显示原始黑色（新增并关闭 SEA-006）

背景：用户反馈「search组件的清除按钮icon颜色还是黑色的，没有绑定灰色，这点应该是基座问题」，并附了 preview/search/index.html「即时联想」演示区的截图——输入框内清除按钮（✕）明显比左侧搜索图标深，前者接近纯黑，后者是柔和灰色。

排查：项目里搜索图标与清除按钮图标其实来自同一批原始 SVG（`icf_system_search.svg`、`icf_system_close-circle-fill.svg`），两个文件内部 `fill` 都硬编码为 `#101828`（深色，非灰色）。搜索图标之所以在页面上看起来是灰色，并不是因为 SVG 本身是灰色，而是共享基座类 `.gj-search-icon{opacity:.64}`（`gj-b2b-components.css`）统一给所有搜索图标加了 64% 不透明度，把深色压成视觉上的灰色。但清除按钮的图标——不论是 `preview/search/index.html` 里直接用的 `<button class="gj-search-clear"><img></button>`（原始 `<img>` 标签），还是 `preview/navbar/index.html` 里通过 JS `mask()` 生成的 `<span class="gj-search-clear-icon">`（currentColor 遮罩方案）——此前都没有对应的不透明度处理，`<img>` 版本直接显示 SVG 原始的深色，`<span>` 版本则因为没有显式 `color` 声明而回退到浏览器按钮默认颜色（同样接近纯黑），两条路径都会显示成黑色。这是共享基座层（`gj-b2b-components.css`）遗漏的处理，不是某个组件页各自的问题，与用户的判断一致。

修复：`assets/styles/gj-b2b-components.css`——
1. `.gj-search-clear img{...}` 补充 `opacity:.64`，与 `.gj-search-icon` 的处理方式完全一致（覆盖 `preview/search/index.html` 这类直接用 `<img>` 的场景）；
2. `.gj-search-clear-icon{...}` 补充 `opacity:.64` 与 `color:var(--ds-component-search-default-icon,var(--ds-text-tertiary))`，与搜索图标遮罩变体（`.gj-search-icon:not(img)`）的双重处理（灰色 Token + 64% 透明度）保持一致（覆盖 `preview/navbar/index.html` 这类通过 `mask()` 生成遮罩图标的场景）。
两处修复只处理颜色/透明度，未改动图标尺寸、布局、显示/隐藏逻辑；同步把 `preview/search/index.html`、`preview/navbar/index.html` 引用 `gj-b2b-components.css` 的版本号分别升级（`search-2`→`search-3`、`navbar-shared-1`→`navbar-shared-2`）避免浏览器缓存旧样式。

验证：Playwright 核实两条路径下清除图标计算透明度均为 `0.64`（与搜索图标一致）；`navbar` 页遮罩图标的计算颜色与搜索图标一致（同为 `--ds-text-tertiary` 灰）；截图复核 `preview/search/index.html`「即时联想」演示区与 `preview/navbar/index.html` 搜索框，清除按钮均变为与搜索图标同色的柔和灰，不再显示黑色；全项目 grep 确认 `.gj-search-clear` 只在这两个页面使用，改动范围明确；对全部 39 个组件规范页跑零报错/零 404 回归扫描，仅 metric 页面出现与本次改动无关的既有图片 404（本地镜像缺文件，非 CSS 改动引入）。

结论：SEA-006 已关闭。
