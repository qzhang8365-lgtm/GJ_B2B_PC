# Input Figma 审计

来源：用户提供画板 `4744:3963`（Input），2026-09-08 只读检查。未修改 Figma。旧审计页是 `2165:864`；本轮以用户链接为准。

画板上 4 个组件集 + 4 个独立 symbol，合计 **55** 个。`inventory.json` 仍记该页 5 套 / 66 variants（INP-008）。BOOLEAN（`lefticon` / `right icon` / `input length limit`）不增加 published symbol。

后段 `get_design_context` 曾因 MCP 日限额未拆 `input_item/hint`、`input_item/cursor`、`1.Input_Basic`。2026-09-09 已补读 `3271:5231`、`2911:4644`、`2996:2903`（INP-007 关闭）。error 文案已在 outlined/filled 的 Error 变体核实；label（`3271:5228`）已核实。

## 已确认的状态矩阵

### Input_outlined（`2926:1451`，20 variants）

样本：Middle default `2926:1179`、typing `2926:1213`、typing+Error `2991:3737`、filled `2926:1247`、disabled `2926:1281`；Large default `2926:1315`；textarea typing `2926:1230`。

| State | 背景 | 边框 | 文字 |
|---|---|---|---|
| default | `Background/Container` | `Border/secondary` | placeholder `Text/Tertiary` |
| typing | `Background/Container` | `Border/focused` | `Text/Primary`；光标 `Feedback/brand` 1×16 |
| filled | `Background/Container` | `Border/secondary` | `Text/Primary` + 清除按钮 |
| disabled | `Background/Background` | `Border/disabled` | `Text/Tertiary`（不是 `Text/disable`） |
| typing+Error | `Background/Container` | `Border/error` | 值 `Text/Primary`；说明 `Feedback/error&rise` / `中文/S9-CN-R`，与框 gap 4px |

尺寸（已绑定变量）：

| Size | 高度 | 内边距 | 圆角 | gap | 图标 | 文字 |
|---|---|---|---|---|---|---|
| Small-h24 | `Components/control-S` 24 | 8 | `Radius-XS` 4 | `space2` 4 | 14 | `中文/S8-CN-R` |
| Middle-h32 | `Components/control-M` 32 | 8 | `Radius-SM` 6 | `space3` 8 | 16 | `中文/S8-CN-R` |
| Large-h40 | `Components/control-L` 40 | 12×8 | `Radius-MD` 8 | `space3` 8 | 18 | `中文/S7-CN-R` |

Text area 只在 Middle：高 80，px 12 py 8，圆角 **8**（`Radius-MD`，不是 medium 单行的 6），右下角有拖拽柄。字数 `0/50` 为 `Text/Tertiary` / `中文/S9-CN-R`。

outlined typing **生成代码没有 2px 外圈**，只有 1px `Border/focused`。

### Input_filled（`2989:648`，20 variants）

样本：default `2989:697`、typing `2989:710`、typing+error `2991:3832`、disabled `2989:760`。

| State | 背景 | 边框 | 文字 |
|---|---|---|---|
| default | `Background/Background` | **`Border/default`**（旧 token 写成 transparent，错） | `Text/Tertiary` |
| typing | `Background/Container` | `Border/focused` | `Text/Primary` + 光标 |
| typing+error | `Background/Container` | `Border/error` | 值 Primary；说明 error&rise / S9 |
| disabled | **契约 `Background/Background`**（Figma 实测曾为 `Background/Tertiary`，2026-09-08 设计要求源文件改绑） | `Border/disabled` | `Text/disable` |

属性名 `error` 小写，与 outlined 的 `Error` 不一致（INP-002）；**2026-09-10 复查：Figma 已统一为 `Error`（大写），outlined/filled 两个组件集的变体属性名现一致**，详见下方 INP-002 复查记录。

### Input_Password（`2991:4218`，9 variants）

- `Filled` = 是否已填写，**不是** filled 灰底外观。画板上的空态/聚焦态都是白底 `Background/Container`。
- medium 空态（`2991:4251`）：placeholder **`Text/disable`**，`icf_system_eye-close`。
- medium 已填+可见（`2991:4243`）：`Border/focused` + **`shadow 0 0 0 2px Background/BT_B10`**，`icf_system_eye`，文字 `Text/Primary`。
- 这是 2026-09-08/09 唯一核实到 2px focus ring 的节点；outlined/filled typing 当时的生成代码没有这圈，只有实现里 `.gj-input-wrap:focus-within` 主动补了这圈。2026-09-10 已由设计在 Figma 补齐正式 Effect Style，详见下方 INP-004 关闭记录。
- **2026-09-10 INP-005**：密码框不是独立尺寸，与主输入框同档。设计改稿后只读重测 9 个 variant（母版 `2991:4218`，1 套 / 9 variants），padding / gap / icon 已与 outlined Input field 对齐：

| Size | Password 框层 | outlined Input field |
|---|---|---|
| small 24 | pad 8、gap 4、眼睛 14 | 同 |
| medium 32 | pad 8、gap 8、眼睛 **16** | 同 |
| large 40 | pad 12×8、gap 8、眼睛 18 | 同 |

### 独立件

- `input_item/label` `3271:5228`：高 32、宽 80、gap 4，`中文/S8-CN-R`，`Text/Primary`，默认文案「标题」。
- `input_item/error`：Error 变体已核实为 S9 + `Feedback/error&rise`。
- `input_item/hint` `3271:5231`：240×18，文案「输入提示」，`Text/Tertiary` `#8D96A3`，`中文/S9-CN-R` 12/18/400。
- `input_item/cursor` `2911:4644`：外框 9×20，`px 4`；内条 `2911:4643` 1×20、圆角 2，颜色 `Text/blue` `#2B73FF`（与 `Feedback/brand` 同色）。typing 变体内光标仍按此前 1×16 记录。
- `1.Input_Basic` `2996:2903`：MCP 标成 frame，子图层为 `align=vertical|horizontal`，按母版口径 **1 套 / 2 variants**。BOOLEAN：`helperHint`、`informationicon`（默认 hidden，16px `icf_system_info`）。默认嵌 `Input_outlined` Middle-h32 default。

| 变体 | 节点 | 结构 | 标题→控件 | 控件→hint |
|---|---|---|---|---|
| `align=vertical` | `2996:2880` 240×92 | 标题满宽高 22 + 控件 32 + hint 18 | 12px `Interval/space4` | 8px `Interval/space3` |
| `align=horizontal` | `2996:3027` | 标题列 80×32 + 控件列；hint 仍在控件下方 | 12px（列 x=92） | 4px `Interval/space2` |

Input_Basic 的 12px 标题间距与 Form_item 纵向 4px / 横向 8px 不同。表单场景继续用 Form Token；Input 规范页 `gj-field` 只包控件+hint，纵向采用 8px。

## 相对旧 local-contract 的修正

1. filled 默认边框采用 Figma 真值 `Border/default`，不是 transparent。预览 CSS 已同步。
2. filled disabled 背景按 2026-09-08 设计确认使用 `Background/Background`。Figma 实测曾为 `Background/Tertiary`；当前环境无法写入 Figma，请在 `Input_filled` 的 disabled 变体改绑。
3. outlined disabled 文字采用 Figma 实测 `Text/Tertiary`。预览 CSS 已同步（filled 禁用文字仍为 `Text/disable`）。
4. Password.`Filled` 采用 Figma 真值：表示已填写，不是灰底外观。
5. Text Area 圆角跟随当前尺寸档，默认 medium = `Radius-SM` 6px。Figma Middle textarea 字面 8px 不作为实现。
6. hover 保留现有状态矩阵：`outlined.hover = Border/hover`。

## 开放问题

1. **INP-001 · 已关闭（2026-09-08）** — 用户画板已做真审计；剩余缺口拆到 INP-002 起。
2. **INP-002 · P3 · 部分关闭（2026-09-10 复查）** — `Error`/`error` 大小写已由 Figma 统一为 `Error`（关闭该子项）；`Small-h24`/`small` 尺寸字面值不统一、`lefticon` / `right icon` / `input length limit` 内部命名风格不统一，Figma 侧仍未更名，mapping.json 已提供归一化，是否在 Figma 侧改名待设计决定。
3. **INP-003 · 已关闭（2026-09-08 设计确认 + 实现同步）** — Filled 默认边框用 Figma `Border/default`；Outlined 禁用文字用实测 `Text/Tertiary`；Filled 禁用背景契约改为 `Background/Background`。CSS 已改。Figma filled disabled 源文件仍待设计改绑 Tertiary → Background。
4. **INP-004 · P2 · 已关闭（2026-09-10）** — 2px `BT_B10` focus ring 此前只在 Password 已填可见核实；outlined/filled typing 生成代码没有。设计已在 Figma 补齐正式 Effect Style「focused_outline」，详见下方关闭记录。
5. **INP-005 · P2 · 已关闭（2026-09-10）** — 确认与主输入框对齐，不另开 Password 独立尺寸。设计改稿后 9 个 variant 的 padding / gap / icon 已与 outlined Input field 同档（medium 眼睛 16）。
6. **INP-006 · 已关闭（2026-09-08 设计确认）** — 保留现有 hover 状态矩阵，outlined:hover 使用 `Border/hover`。
7. **INP-007 · P2 · 已关闭（2026-09-09）** — 已补读 hint / cursor / Input_Basic。hint = S9 + Tertiary；独立光标 Text/blue 1×20；Input_Basic 1 套 2 态为组合，不是第四套外观。
8. **INP-008 · P3 · 待 Figma 复查** — inventory 66 vs 本画板 55。

## 结论

Input 为 `figma-audited`。生成时：Filled 默认边框走 `Border/default`；Password.`Filled` 当已填写；Password 与主输入框共用同一尺寸档；Text Area 圆角跟尺寸档；hover 用现有矩阵。Filled 禁用背景以契约 `Background/Background` 为准，请在 Figma 源文件同步改绑。


## 2026-09-10：主输入框外圈补齐 Effect Style（关闭 INP-004）

用户确认：主输入框（Outlined/Filled）也需要外圈；已在 Figma 为全部 Input 组件补上外圈，并新建正式 Effect Style「focused_outline」。

只读复核，`get_design_context` 抽样 6 个代表节点，均在「styles contained in design」里返回 `focused_outline: Effect(type: DROP_SHADOW, color: Background/BT_B10, offset: (0, 0), radius: 0, spread: 2)`：

| 组件 | 节点 | 尺寸/形态 |
|---|---|---|
| Input_outlined | `2926:1213` | Middle-h32, typing |
| Input_outlined | `2926:1077` | Small-h24, typing |
| Input_filled | `2989:710` | Middle-h32, typing |
| Input_filled | `2989:811` | Large-h40, typing |
| Input_filled | `2989:723` | Middle-h32, typing, textarea=true |
| Input_Password | `2991:4243` | medium, Filled=true, Visible=true |

对照组：`2991:3724`（Small-h24, typing, **Error=true**）没有 `focused_outline`，边框直接切换为 `Border/error`，与实现里 `.gj-input-wrap.error{box-shadow:none}` 一致——确认 Error 态不叠加外圈，不是遗漏。

结论：外圈已从「仅 Password 已填可见验证过」升级为「outlined/filled 全尺寸/全形态 + Password 统一使用同一个具名 Effect Style」。

实现同步：

- `references/styles/effects.json` 新增 `focused_outline`（DROP_SHADOW，`Background/BT_B10`，spread 2，`css: "0 0 0 2px var(--ds-background-bt-b10)"`），跑 `node scripts/build-tokens.mjs` 后编译为 `--ds-effect-focused-outline`（`assets/styles/gj-b2b-tokens.css`），数值与原来的字面 `0 0 0 2px var(--ds-background-bt-b10)` 完全一致，纯粹是「给已有视觉一个正式 Token 名字」，不是新增视觉。
- `assets/styles/gj-b2b-components.css`：`.gj-input-wrap.outlined:focus-within,.gj-input-wrap.outlined.typing` 与 `.gj-input-wrap.filled:focus-within,.gj-input-wrap.filled.typing` 的 `box-shadow` 从字面值改为 `var(--ds-effect-focused-outline)`。Password 复用同一套 `.gj-input-wrap` 类，无需单独改。
- `references/tokens/components/input.tokens.json`：新增 `focus.ring` token 指向 `--ds-effect-focused-outline`；`focus.ringWidth`/`focus.ringColor` 的说明更新为已关闭状态；`behavior.focus` 改写为关闭后的完整描述；移除 `openItems.INP-004`。
- `mapping.json`：`tokenMap.password.focus.ring` 改名为 `focus.ring` 并去掉「仅 Password 核实」的限定；`interactionMap.typing` 补充 Effect Style 引用。
- `references/components/input/schema.json`：`knownFigmaIssues` 移除 INP-004，`confirmedDecisions` 新增关闭记录。
- 组件预览页 `preview/effects/index.html` 的 Effect Styles 区块是从 `references/styles/effects.json` 动态渲染的，新增条目会自动出现，不需要另外改 HTML。`preview/input/index.html` 的 typing/password 示例复用共享 `.gj-input-wrap` 类，CSS 变量替换后视觉不变，也不需要改标记。

## 2026-09-10：INP-002 复查（`Error` 大小写已统一，其余命名待定）

复查节点 `4744:3963`（Input 页面）：

- **`Error`/`error` 大小写**：`get_metadata` 显示 Input_outlined（`2926:1451`）与 Input_filled（`2989:648`）的全部 variant 现在均使用 `Error=false`/`Error=true`（大写 E），两者已一致 —— 此前 filled 侧的小写 `error` 已由设计统一为 `Error`。**该子项确认关闭。**
- **尺寸字面值**：`get_design_context` 复查显示 Input_outlined/Input_filled 仍使用 `Size=Small-h24/Middle-h32/Large-h40`，Input_Password（`2991:4218`）仍使用 `Size=large/small/medium`（小写、无 h 后缀）——两套尺寸字面值仍不统一，未改名。`mapping.json` 中 `Size.Small-h24→size=small`、`Size.small→password.size=small` 的归一化继续有效。**此子项保持开放，待设计决定是否在 Figma 改名。**
- **`lefticon` / `right icon` / `input length limit` 命名风格**：`get_design_context` 复查 Input_outlined（`2926:1179`）与 Input_filled（`2989:697`）的组件描述均写明"booleans: lefticon, right icon, input length limit"，两个组件集之间彼此一致，但三个布尔属性自身的命名风格（无空格驼峰 / 带空格 / 多词带空格）仍不统一，未改名。`mapping.json` 中 `lefticon→leftIcon`、`right icon→rightIcon`、`input length limit→showCount` 的归一化继续有效。**此子项保持开放，待设计决定是否在 Figma 改名。**

结论：INP-002 的三个子问题中，`Error`/`error` 大小写已由设计在 Figma 侧修正并关闭。

## 2026-09-10：尺寸字面值决定不改，布尔属性命名给出改名建议

- **尺寸字面值**（`Small-h24`/`Middle-h32`/`Large-h40` vs Password 的 `large`/`small`/`medium`）：用户确认**不改**，保持现状。继续依赖 `mapping.json` 的 `Size.Small-h24→size=small`、`Size.small→password.size=small` 归一化。**该子项关闭。**
- **`lefticon` / `right icon` / `input length limit` 命名风格**：用户要求给出改名建议。参考本设计系统内已大量使用的「Show + Title Case」布尔属性命名约定（如 Empty 的 `Show Description`→`showDescription`、Notification 的 `showIcon`/`showDescription`/`showButton`、Modal 的 `showClose`、Carousel 的 `showIndicator`/`showArrows`、Upload 的 `showFileSize`/`showRemove`），建议将 Input_outlined / Input_filled 的三个布尔属性统一改名为：

  | 现状（Figma） | 建议改名（Figma） | 代码侧（`mapping.json`，不变） |
  |---|---|---|
  | `lefticon` | `Show Left Icon` | `showLeftIcon`（可与 `icon` 属性名一并对齐，见下方说明） |
  | `right icon` | `Show Right Icon` | `showRightIcon` |
  | `input length limit` | `Show Length Limit` | `showCount`（已符合 Show 前缀语义，命名保持不变） |

  说明：当前代码侧生成的 prop 名是 `icon`（对应 `lefticon`，控制左侧图标显隐），若 Figma 改名为 `Show Left Icon` 后，建议 `mapping.json` 同步把这个 prop 改名为 `showLeftIcon` 以完全对齐约定；`right icon` 同理改为 `showRightIcon`；`input length limit` 的代码侧 `showCount` 已经符合 Show 前缀约定，Figma 侧改名后无需再动代码。
  **此项为建议，待设计在 Figma 落地改名后，Claude 会复查确认并同步 `mapping.json`、关闭该子项。**

## 2026-09-10：布尔属性改名落地（INP-002 全部关闭）

用户确认：`input length limit` 已按建议改名为 `Show Length Limit`；同时**删除了 `right icon` 属性**，只保留左侧图标，并改名为 `Show Icon`（未采用此前建议的 `Show Left Icon`，因为右侧图标已不存在，无需再用"Left/Right"区分）。

复查节点 `2926:1451`（Input_outlined）与 `2989:648`（Input_filled）整体，以及各自的 filled 态样本 `2926:1247`/`2989:697`：

- 两个组件集生成代码的 props 均为 `showIcon` / `showLengthLimit`，不再有 `rightIcon` 或任何右侧图标相关的属性。
- filled 态的"清除按钮"（close button）在两个组件集中都不受任何布尔属性控制，是 `state=filled` 时的固定元素——证实 `right icon` 从未是清除按钮的开关，删除它不影响清除按钮逻辑。
- 备注：Figma 组件描述文案（Component description）暂时还是旧文案"booleans: lefticon, right icon, input length limit"，实际属性已确认更新，文案是非阻塞的文档滞后，不影响生成代码。

代码契约同步：
- `schema.json`：`properties.leftIcon` 改名为 `icon`，`properties.rightIcon` 整体移除；`knownFigmaIssues` 中的 `INP-002` 已移除。
- `mapping.json`：`propertyMap` 中 `lefticon`→`Show Icon: icon`，`right icon` 条目移除，`input length limit`→`Show Length Limit: showCount`；`Error`/`error` 合并为单一 `Error` 条目（大小写已统一）。
- 代码侧实现本就只有单一通用 `.gj-input-icon` 图标槽（`assets/styles/gj-b2b-components.css`），从未实现过独立的右侧图标，因此这次 Figma 删除属性与代码实现完全一致，**无需改动 CSS**。

INP-002 三个子问题（`Error`/`error` 大小写、尺寸字面值、布尔属性命名）至此全部关闭。

## 2026-09-10：State 属性值 typing 改名为 focused

用户告知：Input 的状态属性 `typing` 已改为 `focused`。

复查节点 `2926:1451`（Input_outlined）与 `2989:648`（Input_filled）全部 variant：原先所有 `State=typing` 的实例均已确认改为 `State=focused`（Input_Password 没有独立的 State 属性，不受影响）。

背景：`mapping.json` 此前就已经把 Figma 的 `typing` 归一化为代码语义名 `focused`（`propertyMap.State` 注释一直写着"typing → focused"，`references/tokens/components/input.tokens.json` 的 `stateMatrix` 也一直用 `outlined.focused`/`filled.focused` 命名）。这次 Figma 侧改名，是让 Figma 的原始属性值也变成 `focused`，与代码一直以来的语义命名趋于一致，而不是引入新概念。

代码契约同步：
- `schema.json`：`properties.state` 由 `[default, typing, filled, disabled]` 改为 `[default, focused, filled, disabled]`；相关 constraints 与 componentSets 说明同步更新。
- `mapping.json`：`propertyMap.State`、`valueMap`（`State.typing`→`State.focused`）、`tokenMap`（`outlined.typing.*`→`outlined.focused.*`，`filled.typing.*`→`filled.focused.*`）、`interactionMap`（`typing`→`focused`）全部同步改名。
- `rules.md`：状态枚举描述同步改为 `focused`。
- `assets/styles/gj-b2b-components.css`：`.gj-input-wrap.outlined.typing`/`.gj-input-wrap.filled.typing` 改名为 `.focused`（`:focus-within` 选择器不变，视觉数值不变）。
- `preview/input/index.html`：状态演示表格列名与脚本里的 `state==='typing'` 判断同步改为 `focused`；样式表引用的缓存版本号同步升级（`?v=input-5`）。
- `references/tokens/components/input.tokens.json` 中提到 `.typing`/`typing` 的注释文字同步更新为 `focused`（该文件的 `stateMatrix` 结构本来就用 `focused` 命名，只是散落的注释文字沿用了旧说法）；已重新执行 `node scripts/build-tokens.mjs` 同步编译产物。

范围说明：Search 组件自己的 `state=typing`（映射到 Search-Box 的 `state=active`）是独立的属性，本次未核实、未改动，如果 Search 那边也做了同样的改名，需要另外确认。

## 2026-09-11：清理预览页残留旧 CSS（新增并关闭 INP-009）

背景：延续 MDL-010（见 `components/modal/audit.md`）建立的方法，对 `preview/input/index.html` 做同样的死代码核查——用户明确的标准原则是预览页无论静态展示区还是交互区，都应该只用标准组件基座渲染，不应该残留旧 CSS。

排查方法：同 MDL-010，解析页面全部 `<style>` 块，提取每个选择器涉及的类名，逐个类名对照页面真实 `class="..."` 属性（含 JS 动态拼接的模板字符串）确认是否被引用；复合选择器按逗号拆分成分支逐项判断，只删除全部分支都确认无引用的规则，混有真实类的复合选择器保留但裁掉死亡分支。

整条规则删除（1 条）：`.code`。

验证：脚本二次扫描确认页面残留死选择器为 0；`<style>` 块大括号计数与逐字符深度校验均通过（与 button.html 同批次校验时一并发现并排除结构性错误）；本文件删除/裁剪的选择器均逐一比对过页面真实 `class="..."` 与 `classList` 调用，确认为未引用的旧代码，属于低风险清理，未单独截图复核。

结论：INP-009 已关闭。`preview/input/index.html` 内嵌 CSS 现在只包含仍被页面实际使用的选择器。

## 2026-09-11：预览页展示背景改用统一规则（新增并关闭 INP-010）

背景：用户在 Checkbox/Radio 重构完成后指出 Input 页面此前只做了一半（其他 agent 迁移了大部分组件页到统一 `docs-*` 展示框架，但 Input 的背景选择还停留在旧版全灰底状态），要求补齐同一套背景规则（见 `component-page-conventions.md` 「展示背景选择」一节）：
- 默认使用白色展示背景：适合 Tabs、Selector、Input 等自身带灰色填充或描边的组件。
- 灰色背景按需使用：主要用于展示白色组件、阴影、悬浮卡片等需要与页面白底区分的内容。
- 展示背景与组件默认填充至少保持一级明度差；白底组件放在白色画布上时，用边框呈现边界（不算违反明度差规则的例外）。

排查结果：`preview/input/index.html` 原有 3 处 `docs-stage docs-surface-gray`（基础类型、组合与尺寸一致性、交互演示），且「扩展输入」一段完全没有套用 `docs-stage`/`docs-surface-*`。

第一版处理（后被用户反馈纠正）：把「基础类型」「组合与尺寸一致性」「交互演示」三处 `docs-surface-gray` 也一并改成了 `docs-surface-white`，理由是 Input 属于规则里点名的「适合白色展示背景」的组件；同时给 `.sample-card`/`.combo-card`/`.interaction-stage`/`.controls` 四个原本白底无边框的私有类各加了 `border:1px solid var(--ds-border-default)`，避免白底组件在白色画布上边界不清。

用户反馈：这三处的外层画布和里层卡片（sample-card / combo-card / interaction-stage / controls）都是白色，视觉上不好看，要求这三处画布保持原来的浅灰色。

复核后发现问题所在：这三个区域本身已经有一层白色卡片在承担「白色展示面」的角色（Outlined/Filled 对比卡、组合示例卡、交互演示的舞台和控制面板），卡片本身与灰色画布已经有一级明度差，不需要外层画布也改白——外层再改白反而造成两层白色叠在一起、边界模糊。这与「扩展输入」不同：「扩展输入」的 advanced-card 本身是灰色，如果外层画布也留灰会让卡片和画布融在一起，所以那一处改白是必要的、且不产生双白问题。

最终处理：
- 「基础类型」「组合与尺寸一致性」「交互演示」三处画布改回 `docs-surface-gray`（恢复原样），同时撤销给 `.sample-card`/`.combo-card`/`.interaction-stage`/`.controls` 加的边框（灰底 + 白卡片本身明度差已经够，不需要额外边框）。
- 「扩展输入」保留新补的 `<div class="docs-stage docs-surface-white">` 包裹（advanced-card 灰底 vs 白色画布，一级明度差，不需要额外边框）。
- 未改动任何 JS 逻辑与组件基座代码，全程只涉及背景类名与配套边框的增减。

验证：两轮修改都做了 `<div>`/`<section>` 标签计数与 `<style>` 大括号计数校验；本地起服务用 Playwright 全页截图确认最终效果——「基础类型」「组合与尺寸一致性」「交互演示」是浅灰画布 + 白色卡片，「扩展输入」是白色画布 + 浅灰卡片，两种组合都不再出现同色叠加；额外做了 Appearance→Filled、Type→Password 的交互切换测试，事件文案正常更新，无回归。

结论：INP-010 已关闭。`preview/input/index.html` 现在与 Button/Divider/Tabs/Sidebar/Navbar/GridNav/Checkbox/Radio 使用同一套背景选择规则，具体画布深浅按「这一层是否已经有另一层颜色在承担对比」逐段判断，而不是机械地套用组件类型 → 固定背景色的映射。

