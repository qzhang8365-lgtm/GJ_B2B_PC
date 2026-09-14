# DatePicker Figma 审计

来源：Figma 页面 `2401:13`（DatePicker 日期选择器），2026-09-08 只读检查，2026-09-10 复核新增状态。当前为 **6 个组件集、108 个 variant、11 个独立组件**；关键尺寸、变量绑定和组合结构再用 design context 与 variable definitions 交叉核实。

## 已确认的真实结构

- `Date-Picker`（`3042:4720`）：60 variants（2026-09-10 由 24 增补）。属性为 Size × Status × Range × Disable。Status=`default / filled / hover / focus / error / filled-hover / filled-focus / filled-error`；Disable=true 只与 default/filled 组合。固定宽 260；Small/Medium/Large 高度为 24/32/40、圆角为 4/6/8，左右内边距 12，图标 16。无 Open、无 Clear 轴。
- `Datepicker_item/Date_item`（`3055:1071`）：28 variants。日期格 32×32、圆角 6；通知点 4；支持 Hover、Selected、Today、Disabled、Notification 和范围起/中/止组合。
- `Datepicker_item/Month_item`（`3055:1513`）：4 variants，80×32、左右内边距 16、圆角 6，包含 Default/Hover/Selected/Disabled。
- `Calendar_item/reminder`（`3276:9678`）：5 variants，8px 圆点，Blue/Red/Green/Orange/Grey 分别映射 Feedback 语义色。
- `Calendar_Date`（`3276:9792`）：2 variants；无提醒 280×274，有提醒 280×354，面板圆角 12。
- `Calendar_item/content`（`3495:2378`）：9 variants；大日历单格 120×120，组合为 840×640 网格，完整 `Calendar_large` 为 880×728。
- 独立面板：单月范围 280×322、双月范围 560×322、月/年面板均 280×318。范围操作区为 48px 高、按钮间距 12、无顶部分割线，按钮是真实 Medium Button 实例。
- 紧凑日期网格宽 256，单元格 32，Figma 实测列间距 5.2、行间距 4；范围中间背景宽 44，用于跨列间距连续铺色。

## 字体与变量

- 触发器：Large=`中文/S7-CN-R`（16/24）；Medium 与 Small 都是 `中文/S8-CN-R`（14/22）。本地旧 CSS 把 Small 写为 12/18，与 Figma 不符。
- 星期栏：`中文/S9-CN-R`（12/18）；提醒文本：`中文/S8-CN-R`。
- 日期数字、月/年项和紧凑面板标题仍使用 Figma 旧样式 `Body/regular`（Roboto 14/22）；大日历日期为 PingFang SC Semibold 16/26，但未读到可复用的当前样式绑定。
- 已确认语义色：`Background/Container`、`Background/Background`、`Background/Hover`、`Background/Selected`、`Border/default`、`Border/secondary`、`Text/Primary`、`Text/Tertiary`、`Text/disable`、`Text/blue`、`Text/reversal`、`Brand/GJ_Blue` 与五个 Feedback 色。

## 待处理项

| ID | 优先级 | 发现 | 本 Skill 处理 |
|---|---:|---|---|
| DTP-001 | P2 | 属性值大小写和命名不一致：`medium/Large/small`、反引号范围属性、`disable`、`Input-Seperator` | mapping 中统一规范化；不把原拼写泄漏为代码 API |
| DTP-002 | P2 · 已关闭 | 触发器没有 Hover/Focus/Open/Error/Clear variants | 2026-09-10 设计已补 Hover/Focus/Error 及 filled-*；Open/Clear 仍不是触发器轴 |
| DTP-003 | P2 | 触发器尺寸、圆角、间距虽与变量库值吻合，但读取不到对应 Dimension 变量绑定 | componentToken 记录数值和建议别名；待设计侧绑定后复核 |
| DTP-004 | P2 | 日期/月/年/标题仍使用旧 `Body/regular` Roboto 14/22 | 暂保留 Figma 真值；请设计侧确认是否迁移到当前 UI 字体样式，不得自行换 GJType |
| DTP-005 | P1 · 运行时已关闭 | Figma 存在 Disabled+Hover variants，且仍铺 `Background/Hover` | 2026-09-09 共享 CSS 已让 Disabled 抑制 hover/press/selected/range 背景；Figma 源 variant 仍待设计侧同步 |
| DTP-006 | P1 · 已关闭 | 本地规则/CSS 写 4px 等距网格，Figma 实测横向 5.2px、纵向 4px；范围桥宽随之为 44px | 2026-09-09 共享 CSS 已改为 5.2/4px，范围连接补偿同步为 5.2px |
| DTP-007 | P1 · 已关闭 | 本地通用 318px 面板/56px footer 与真实 Date 274/354、Range 322、Month/Year 318、范围操作区 48/gap12/无边框不符 | 2026-09-09 共享 CSS 已落地 48px footer、12px gap、无顶边框；面板高度由真实内容决定，不裁切 6 周日期 |
| DTP-008 | P3 | 星期文案出现 `Wen` | 实现修正为 `Wed`；建议设计侧同步修正 |
| DTP-009 | P2 | 大日历示例数据缺少 11、重复 12，且某日期使用全角数字 `１` | 视为文档示例数据错误，不进入组件逻辑或 Token |
| DTP-010 | P3 | Reminder 外层属性用 `grey`，嵌套 Badge Dot 源组件用 `gray` | 本地统一为 `Grey`，映射保留源拼写说明 |
| DTP-011 | P2 · 已关闭（2026-09-10） | Month_item 只有 Default/Selected/Disabled，没有 Hover | 设计已在 Figma 补充 Hover variant（4812:21021），详见下方复核记录 |

## 本地实现差异边界

2026-09-09 已把 DTP-005/006/007 的运行时修正落到共享基座，并保留 Figma 源变体待同步的边界。源文件未核实的属性仍不写成 Figma 真值。

## 2026-09-10：触发器交互态（关闭 DTP-002）

用户确认「已补充」。只读核对 `3042:4720`：组件集 description 仍为空，补充的是 **variant** 而不是 description。

- 现 60 个子变体（3 Size × 8 Status × 2 Range 的可交互组合，加上 Disable=true 的 12 个 default/filled）。加入 Month Hover 后，页合计 6 套 / 108 variants / 11 standalone。
- Medium 抽样：hover=`Border/hover` 1px；focus=`Border/focused` 1.5px + 未绑定 DROP_SHADOW（blur 4、`#2B73FF` α=0.25）；error=`Border/error` 1px 无阴影。filled-* 只改文字为 `Text/Primary`，描边规则相同。图标始终 `Text/Tertiary`（含 Disabled）。
- 没有 Status=open / Status=clear，触发器上也没有清除图标。Open 与 Focus 同视觉；Clear 仍是面板 footer。

本地已把上述矩阵写入 schema / mapping / tokens，共享 `.gj-date-trigger` 按 Figma 描边与 focus 光晕落地；规范页增加冻结态。

## 结论

DatePicker 已从 `rules-derived` 升级为 `figma-audited`。生成页面时必须优先读取本目录三件套与 `date-picker.tokens.json`；Figma 没有提供的交互态必须标注为规则补充，Figma 中已确认的问题也不得原样复制到运行时组件。


## 2026-09-10：Month_item 补充 Hover variant（关闭 DTP-011）

用户反馈「已补充变体」。只读核对 `3055:1513`（`Datepicker_item/Month_item` 组件集）：变体从 3 个增至 4 个——新增 `status=hover`（节点 `4812:21021`），与既有 `status=selected`(`3055:1512`)、`status=default`(`3055:1511`)、`status=disable`(`3055:1510`) 并列。

`get_design_context` 抽样对比 hover 与 default 两个节点：

| 属性 | Default(`3055:1511`) | Hover(`4812:21021`) |
|---|---|---|
| 尺寸 | 80×32 | 80×32 |
| 圆角 | `Radius/Radius-SM`(6) | `Radius/Radius-SM`(6) |
| 背景 | 无 | `Background/Hover`(rgba(43,115,255,0.05)) |
| 文字 | `中文/S8-CN-R` + `Text/Primary` | 同左 |

差异仅背景色，几何与文字完全一致，属于标准的「同尺寸叠加悬浮背景」模式，不是新的交互逻辑。

前端复核：月/年网格单元格复用共享类 `.gj-calendar-cell`（`assets/styles/gj-b2b-components.css` 第 228-229 行），其 `:hover:not(:disabled){background:var(--ds-background-hover)}` 已经绑定 `--ds-background-hover`，与 Figma 新增的 `Background/Hover` 语义和数值一致，圆角也同为 `--ds-radius-sm`。即代码侧在这次 Figma 补充之前就已经正确实现了月/年格的 hover 视觉，本次只是把 Figma 源补齐到与代码一致，不需要改代码。

`schema.json`（`normalizedProperties.monthItem.status`、`figmaInventory` variant 计数 3→4、总 variant 数 107→108）与 `mapping.json` 已同步更新。


## 2026-09-10：日期/月年/标题字体迁移确认（关闭 DTP-004）

设计确认：不保留旧 `Body/regular`（Roboto）样式，日期数字、月/年项、紧凑面板标题统一采用当前 UI 字体变量体系，不换用 `GJType`（`GJType` 按字体强制约束仅供 Metric/Gauge/Progress 等核心指标使用，不适用于日期文本）。

只做代码侧核验，未去 Figma：`assets/styles/gj-b2b-components.css` 里 `.gj-calendar-day`（日期数字）用 `font:400 14px/22px var(--ds-font-family-ui)`，`.gj-calendar-title`（月/年标题）用 `font:500 14px/22px var(--ds-font-family-ui)`——两者字体族都已经是 `--ds-font-family-ui`（当前 UI 字体栈：PingFang SC / SF Pro 等，随操作系统切换），本来就不是 Roboto。字号/行高 14/22 与 `中文/S8-CN-R` 一致；`.gj-calendar-title` 用了 500 字重做视觉层级区分，比常规正文（400）略重，不完全等同任何一个已登记的 Text Style（S8 是 400，S5-CN-S 是 600），属于实现侧在当前字体族内部的字重选择，不涉及字体族本身，不在 DTP-004 讨论范围内，如需进一步统一可另开新项，本次不处理。

结论：DTP-004 的核心诉求（不再使用 Roboto，迁移到当前 UI 字体）代码侧已经满足，不需要改代码，只更新文档口径。

## 2026-09-11：清理预览页残留旧 CSS（新增并关闭 DTP-012）

背景：延续 MDL-010（见 `components/modal/audit.md`）建立的方法，对 `preview/date-picker/index.html` 做同样的死代码核查——用户明确的标准原则是预览页无论静态展示区还是交互区，都应该只用标准组件基座渲染，不应该残留旧 CSS。

排查方法：同 MDL-010，解析页面全部 `<style>` 块，提取每个选择器涉及的类名，逐个类名对照页面真实 `class="..."` 属性（含 JS 动态拼接的模板字符串）确认是否被引用；复合选择器按逗号拆分成分支逐项判断，只删除全部分支都确认无引用的规则，混有真实类的复合选择器保留但裁掉死亡分支。

整条规则删除（5 条）：`.code`、`.range-calendar`、`.weekdays,.days`、`.year-grid`。

验证：脚本二次扫描确认页面残留死选择器为 0；`<style>` 块大括号计数与逐字符深度校验均通过；Playwright 起本地 http.server 渲染整页并截图，静态展示区与交互 Demo 区视觉、交互均与改动前一致，无回归。

结论：DTP-012 已关闭。`preview/date-picker/index.html` 内嵌 CSS 现在只包含仍被页面实际使用的选择器。

## 2026-09-11：预览页改用统一展示框架并精简结构（新增并关闭 DTP-013）

背景：延续同批组件页重构（Button/Divider/Tabs/Sidebar/Navbar/GridNav/Checkbox/Radio/Input/Switch），`preview/date-picker/index.html` 此前仍是页面私有结构（`.shell/.component/.panel/.trigger-card/.window-card/.interaction-stage` 等私有类），未使用共享的 `docs-shell/docs-section/docs-stage/docs-surface-*` 展示框架。

处理：
- 整页迁移到 `docs-shell`/`docs-sheet`/`docs-section`/`docs-stage` 框架，原「输入触发器」「触发器状态」两个面板合并为一个「触发器」段落（内部用「类型与尺寸」「状态」两个 `docs-stage-label` 分组），尺寸真值（Large 260×40 圆角8 / Medium 260×32 圆角6 / Small 260×24 圆角4，内边距12px，图标16px）折进页首简介文字。
- 「完整窗口与代表性变体」「组成结构与尺寸」「交互演示」「选用规则」四段保留，选用规则从 6 条卡片收敛为标准三列表格。
- 背景选择按组件自身默认填充逐段判断，不是所有段落套同一个颜色：
  - 「触发器」：`.gj-date-trigger` 默认是白底 + 描边（与 Input 的 outlined 同款契约），用 `docs-surface-white`。
  - 「完整窗口与代表性变体」：`.gj-calendar` 面板本身白底、无边框无投影，是典型的悬浮卡片场景，用 `docs-surface-gray` 让面板边界可辨；四个窗口（单日期/范围/月份/年份）直接摆在灰色画布上，不再像旧版一样每个窗口外面再包一层同色的 `.window-card` 灰底——旧版「灰画布 + 灰卡片 + 白面板」三层里中间那层是多余的，会造成「卡片和画布同色」的问题（与 Input 页面 INP-010 是同一类错误，这次直接跳过，不用等用户第二次反馈）。
  - 「交互演示」：`.lab` 里既有白底描边的触发器又有白底无边框的日历面板，面板是这块区域的主体，所以 `.lab` 用 `docs-surface-gray`；`.controls` 固定 `docs-surface-white`。
- 未改动任何日历渲染/交互逻辑（`dateCalendar`/`rangeCalendar`/`pickerGrid`/`bindPanel` 等函数与原版逐字节一致），只替换了外层 HTML 结构、类名和背景类。

验证：`<div>`/`<section>`/`<table>`/`<tr>` 标签计数与 `<style>`/内联 `<script>` 的大括号、圆括号、反引号计数校验均通过；本地起服务用 Playwright 全页截图确认触发器（白画布）、完整窗口（灰画布 + 白面板，无同色叠加）、交互演示（灰画布 + 白色触发器/控制面板）三处背景符合规则；交互测试覆盖模式切换（单日期→范围）、范围起止点连续点击及自动交换、触发器尺寸切换（Large 类名生效）、面板收起（`interactivePanel` 清空），均无回归。

结论：DTP-013 已关闭。`preview/date-picker/index.html` 现在与其余已重构组件页使用同一套展示框架，背景选择也吸取了 Input 页面 INP-010 的教训，没有再出现同色画布叠同色卡片的问题。

## 2026-09-11：触发器与完整窗口改用真正的网格布局（用户反馈"矩阵不整齐"，追加修正 DTP-013）

背景：用户反馈 Switch 与 DatePicker 两页"排版布局不是很合理，矩阵不整齐"，以多选框、输入框两页为参照标准。

复核：DatePicker 的问题比 Switch 更直接——「触发器」区原来用 `flex-wrap` 把 5 个（类型与尺寸）/6 个（状态）宽度接近但不完全一致的按钮堆在一起，容器每行能放下几个纯粹取决于视口宽度，1280px 宽时会出现"4 个一行 + 1 个单独换行"的参差效果，缩到 1000px 又变成不同的换行方式——本质上是"内容自然换行"而不是"设计好的矩阵"，这正是用户说的"不整齐"。「完整窗口与代表性变体」区同理用 `flex-wrap` 摆 4 个宽度不同（280/560/280/280）的窗口，也会随视口宽度变化出现不同的参差排列。

处理：
- 「触发器」拆成三个真正等分的网格，不再依赖换行凑数：「类型」单日期 vs 范围，2 项 2 列；「尺寸」Large/Medium/Small，3 项 3 列；「状态」Default/Hover/Focus/Error/Filled/Disabled，6 项 3 列 × 2 行——每个网格都严格填满，不会因为视口宽度不同而改变每行个数。
- 「完整窗口与代表性变体」改成 2 列网格，把顺序调整为「单日期 + 月份选择」（同宽，占满一行）→「日期范围」（宽度是前两者的 2 倍，显式 `grid-column:1/-1` 占满整行）→「年份选择」（单独一行）——这个排列在任何桌面宽度下都是同一个结构，不再随容器宽度变化而重新换行。
- 两处都加了窄屏断点（960px 以下窗口网格改单列，700px 以下尺寸/状态网格改 2 列，480px 以下全部改单列），保证移动宽度下依然可读。

验证：`<div>`/`<section>`/`<button>` 标签计数与 `<style>` 大括号计数校验通过；Playwright 在 1280px 和 1000px 两个宽度下分别截图确认「触发器」三个网格和「完整窗口」的排列在两个宽度下结构一致、没有参差换行；交互测试（模式切换到范围、连续点击两个日期确认起止点自动交换、触发器尺寸切换）重新跑了一遍，无回归。

结论：DTP-013 的背景/框架迁移结论不变，本次是同一项工作里对「触发器」「完整窗口」两处展示形式的进一步修正，把靠 flex-wrap 换行拼出来的"伪矩阵"换成显式定义的网格。
