# Button Figma 审计

来源：Figma `3042:6843`，只读检查。组件集包含 192 个 variant，正好覆盖 `4 Level × 3 Size × 4 State × 4 Icon`。

## 2026-08-13 写回复查结果

经用户授权，本轮已直接修正 Figma，并完成全部 192 个 Variant 的重新检查：

- `Small（24px)` 已统一为 `Small(24px)`；
- 144/144 个按钮文字均已绑定正确 Text Style；
- 高度、宽度（icon-only）、四角圆角、横向内边距、0px 上下内边距和内部 gap 已绑定当前正式变量；
- Primary Hover 已从旧变量集合改绑到当前 `GJ_B2B / Button/Primary/Bg-hover`；
- Secondary Hover 已统一为 `Background/Hover`；
- 旧尺寸/颜色变量引用数为 0；
- 确定性的命名或绑定问题数为 0。

仍保留的库级问题：组件没有 Prototype Reaction（BTN-004，已确认由代码承担）。相关变量 Scope 已于 2026-09-10 按 Fill / Stroke / Text Fill / Height / Radius / Gap 收窄并回归绑定（BTN-005 关闭）。Small icon-only 5px 已于 2026-09-09 改为 0 并绑定 `Interval/space1`（BTN-001 关闭）。

交互预览修订：Ghost 在 default、hover、pressed、disabled 状态下均保持无描边，仅改变适用的背景色和文字色。

错误根因记录：初版实现将 Figma 中存在的 stroke 颜色变量绑定直接映射为 CSS 可见边框，没有同时核对描边宽度与最终视觉；Disabled CSS 又错误复用了 Tertiary 与 Ghost 的共享选择器。后续必须按状态矩阵验证计算样式。

Ghost 再次更新后的填充规则：Default/Disabled 使用 `Background/Container`（N01），Hover 使用 `Background/Background`（N03），Pressed 使用 `Background/Secondary`（N04），所有状态 stroke 均为空且四边宽度为 0。12 个 Hover Variant 现已全部统一，不再保留尺寸或图标例外。

交互动效确认：按压时允许轻微缩放反馈，代码使用 `scale(0.98)`；禁止按钮产生向下位移，Disabled 不触发动效。

## 已修复问题（原始审计）

1. **Small 属性值括号拼写不一致**
   - 当前：`Small（24px)`，左侧为中文全角括号，右侧为英文半角括号。
   - 影响：64 个 variant；会让属性值和代码枚举不稳定。
   - 建议：统一为 `Small(24px)`；如希望与中文排版一致，也必须成对使用全角括号。

2. **132/144 个按钮文字未绑定 Text Style**
   - Large：硬编码 `Microsoft YaHei Regular / 16 / 24`。
   - Medium：硬编码 `Microsoft YaHei Regular / 14 / 22`。
   - Small：多数硬编码 `Microsoft YaHei Regular / 12 / 18`。
   - 仅 12 个 Ghost + Small 文字绑定了 `中文/S9-CN-R`。
   - 建议：Large、Medium、Small 分别统一绑定 `中文/S7-CN-R`、`中文/S8-CN-R`、`中文/S9-CN-R`，避免在 Mac 上仍固定为 Microsoft YaHei。

3. **Primary Hover 引用了旧变量集合**
   - 当前：`Variable collection / 按钮色/Primary/Bg-hover`。
   - 应使用：当前 `GJ_B2B / Button/Primary/Bg-hover`。
   - 影响：Primary + Hover 的 12 个 variant。

4. **按钮高度仍引用旧数值变量集合**
   - 当前映射：`control-M=40`、`control-S=32`、`control-XS=24`，均来自旧的 `Variable collection`。
   - 当前正式尺寸阶梯中对应关系应为：Large → `Components/control-L=40`、Medium → `Components/control-M=32`、Small → `Components/control-S=24`。
   - 影响：全部 192 个 variant。建议重新绑定正式变量库，避免名称和值错位。

5. **Secondary Hover 不同尺寸使用了不同背景 Token**
   - Medium：`Background/Hover`，解析为 `#2B73FF0D`。
   - Large、Small：`Background/BG_blue`，解析为 `#E5F0FF`。
   - 同一状态仅因尺寸不同而改变颜色，缺少语义依据。建议确认统一使用哪一个；代码预览暂采用较轻的 `Background/Hover`。

6. **圆角未绑定变量**
   - 全部 192 个 variant 的 `4 / 6 / 8` 均为直接数值。
   - 建议：Small → `Radius/Radius-XS`，Medium → `Radius/Radius-SM`，Large → `Radius/Radius-MD`。

7. **内边距未绑定变量**
   - 主要横向内边距 `8 / 12 / 16` 均为直接数值。
   - 建议分别绑定 `Interval/space3`、`Interval/space4`、`Interval/space5`。数值 0 是否绑定可由团队规范决定。

## 需要确认

1. **Secondary Disabled 使用 Primary 禁用背景 Token 作为边框和文字色**
   - 当前使用 `Button/Primary/Bg-disable`，视觉值为浅蓝，但语义属于 Primary 背景。
   - 建议补充 Secondary 专属禁用 Token，或改用通用 `Text/disable` 与明确的禁用边框 Token。

2. **组件集缺少 description**
   - 当前：Figma 组件集 `3042:6843` description 仍为空。
   - 2026-09-09 已在本地 `rules.md` / `schema.json` / 预览「选用规则」补齐用途、层级、尺寸和 icon-only 边界（BTN-003 关闭）。不把本地文案写进 Figma。

3. **没有 Focus variant，也没有任何 Prototype Reaction**
   - 2026-09-09 关闭（BTN-004）：不增加 Focus 轴，以免 192 variants 扩成 240；也不补 Prototype。Hover / Pressed 已有 Variant，运行时用 `:hover` / `:active`。键盘焦点由代码 `:focus-visible` 承担。Figma 组件 description 已写明「前端应实现 hover、pressed、focus-visible 和 disabled」。

4. **所有相关变量 Scope 均为 `ALL_SCOPES`**
   - 2026-09-09 曾关闭为「不在 Button 内收窄共享变量」。
   - 2026-09-10 用户确认下一步：按 Fill、Stroke、Text Fill、Height、Radius、Gap 收窄并回归绑定。已在本文件 `GJ_B2B` 库落地（见下文 2026-09-10 节）。

## 不列为错误

- Fill、Stroke 没有绑定 Color Style：这些属性已经直接绑定颜色变量，属于有效做法。
- 组件没有 Effect Style：当前按钮本身没有阴影需求，不需要为了完整性强行添加。


## 2026-09-09：Secondary Disabled 语义修正（关闭 BTN-002）

背景：曾评估是否把全部 Button disabled 状态统一改为透明度（opacity）方案。核对 `stateMatrix` 后确认不合适——Primary/Secondary/Tertiary/Ghost 四个 Level 的 disabled 视觉本来就各不相同（Primary 是纯色浅蓝背景、Tertiary/Ghost 是 `Text/disable`+`Border/disabled` 灰色语言、Secondary 是浅蓝描边+浅蓝字），且 `Text/disable`／`Border/disabled` 这套灰色 disabled token 已经在 Checkbox、Input、Selector、Dropdown、Table、Pagination、TextButton 等十余个组件里复用，是本设计系统既定的、颜色驱动而非透明度驱动的 disabled 语言，不需要也不应该推翻。真正的问题只是 BTN-002 本身：Secondary 的 disabled 文字色和边框色错误地复用了 `Button/Primary/Bg-disable`（语义上属于 Primary 背景），而不是拥有自己的语义 token。

讨论过两个方案：A）比照 Tertiary/Ghost，把 Secondary disabled 整体拍平成灰色 `Text/disable`+`Border/disabled`（有 Checkbox `checked-disabled`→整体拍平中性色的先例支持，但 Secondary 默认态本来就是蓝色识别色，直接变灰视觉跳变较大）；B）保留当前浅蓝像素值不变，只是不再借用 Primary 的 token，改为新增一个 Secondary 专属语义 token，指向同一个 `Primitive/Blue/B04`（`#9CC0FF`）原始值。用户确认采用方案 B。

已完成的修改：

- `assets/styles/gj-b2b-tokens.css`：新增语义 token `--ds-button-secondary-disable: var(--ds-primitive-blue-b04)`；`--ds-component-button-secondary-disabled-text` 与 `--ds-component-button-secondary-disabled-border` 改为引用它，不再引用 `--ds-button-primary-bg-disable`。
- `references/tokens/components/button.tokens.json`：`stateMatrix.Secondary.disabled.text`/`.border` 从 `"Button/Primary/Bg-disable"` 改为 `"Button/Secondary/Disable"`，并去掉了原来的 `review` 提示；`openItems.secondaryDisabledSemantic` 已移除（问题已解决，不再是待确认项）。
- `references/components/button/schema.json`：`tokens` 里补充了 `secondary.disabled.text`/`secondary.disabled.border` → `Button/Secondary/Disable`。
- `assets/styles/gj-b2b-components.css` 里的 `.gj-btn-secondary[disabled]` 选择器本身未改动——它已经是通过 `--ds-component-button-secondary-disabled-*` 变量间接取值，改上游 token 即可生效，不需要动 CSS 规则本身。

视觉结果：像素级不变（仍是 `#9CC0FF` 浅蓝），只是语义命名从"借用 Primary 的禁用背景色"变成"Secondary 自己的禁用色"，消除了语义混淆，也为未来设计库正式补充该 token 时留出了对应位置。

## 2026-09-09：补充组件说明（关闭 BTN-003）

背景：Figma Button 组件集 `3042:6843` 的 description 为空。本轮只读确认母版仍是 4 Level × 3 Size × 4 State × 4 Icon = 192 variants；icon-only 热区 Large 40、Medium 32、Small 24。未修改 Figma。

本地已写入用途、层级、尺寸和 icon-only 边界：

- 用途：触发操作 / 提交 / 进入下一流程；轻量文字触发改用 Text Button。
- 层级：Primary → Secondary → Tertiary → Ghost；同一区块尽量一个 Primary；Danger/Success 不是 Level。
- 尺寸：40 / 32 / 24，按容器层级选择；并排时与主控件同高；组间距 4 / 8 / 12。
- icon-only：正方形热区，必须有可识别含义和 `aria-label`；语义不清时改用图标加文字。带级别操作用 `gj-btn-icon-only`；弹窗关闭和卡片工具用 `gj-icon-button`。Text Button 没有 icon-only。Small 的 5px 内边距仍属 BTN-001。

Figma 组件集当时按 description 为空处理；2026-09-09 用 Plugin API 再读时组件集已有用途/层级/尺寸/Icon 说明，并写明前端应实现 focus-visible。本地规范与之同向，未覆盖 Figma 原文。

## 2026-09-09：Small icon-only 内边距（关闭 BTN-001）

Interval 阶梯为 `space1=0`、`space2=4`、`space3=8`，没有 5px。Medium / Large icon-only 与 Small 文字按钮的上下内边距已绑定 `Interval/space1`。只读复查时 16 个 Small icon-only 中 12 个仍是未绑定的 5px，4 个已是 0 但未绑定。

决定：不新增 5px Token，不保留实例直接值。16 个 Small icon-only 的 `paddingTop` / `paddingBottom` 均改为 0，并绑定 `Interval/space1`。代码 `.gj-btn-icon-only` 继续 `padding: 0`、正方形热区。左右内边距仍跟 Small 文字按钮一样绑定 `Interval/space3`（8），不在本项扩大范围。

## 2026-09-09：Focus 与原型（关闭 BTN-004）

组件集 192 variants 的 State 只有 default / hover / pressed / disabled。组件集与子变体 `reactions.length` 均为 0。Figma description 已要求前端实现 `focus-visible`。

决定：不增加 Focus variant，不做 Prototype Reaction。键盘焦点由 `:focus-visible` 承担，环为 `Background/BT_B20`、3px，不改变布局。文档页可用 `is-focus` 冻结示意。

## 2026-09-10：设计确认（BTN-004）

设计侧确认：没有制作 focused，不增加 Focus/原型状态；按钮暂不需要 focused 作为设计或规范展示态。代码继续保留原生 `:focus-visible`（既有 3px / `Background/BT_B20` 环），规范页去掉 Focus 强制态与「键盘焦点」冻结示意。BTN-004 保持已关闭。

## 2026-09-09：变量 Scope（BTN-005 初关，已被 2026-09-10 覆盖）

抽到的 `Interval/space1`、`Interval/space4`、`Components/control-M`、`Radius/Radius-SM`、`Background/Container`、`Border/secondary`、`Text/Primary` 的 `scopes` 当时均为 `ALL_SCOPES`。这些是共享库变量。

当时决定：不在 Button 组件内收窄。推荐映射只登记在 schema，留给变量库维护。2026-09-10 用户要求执行该维护，见下一节。

## 2026-09-10：按角色收窄 Scope 并回归绑定（关闭 BTN-005）

`GJ_B2B` 是本文件本地库（266 个变量，当时全部 `ALL_SCOPES`）。按用户指定的六类角色收窄对应分组，共 130 个变量：

| 角色 | 分组 | Scope | 数量 |
|---|---|---|---|
| Fill | Background、Button | `FRAME_FILL` + `SHAPE_FILL` | 83 + 12 |
| Stroke | Border | `STROKE_COLOR` | 6 |
| Text Fill | Text | `TEXT_FILL` + `SHAPE_FILL` | 6 |
| Height | Components/control-* | `WIDTH_HEIGHT` | 6 |
| Radius | Radius | `CORNER_RADIUS` | 7 |
| Gap | Interval | `GAP`（含 padding） | 10 |

Text 在「Text Fill」之外保留 `SHAPE_FILL`，因为 Button 图标矢量绑定的是 Text 色，不是文字图层。Figma 没有单独的 Height scope，高度/宽度共用 `WIDTH_HEIGHT`（icon-only 正方形同时绑高和宽）。

未改：Primitive / Brand / Table / Feedback / Chart 仍为 `ALL_SCOPES`（不是这六类角色分组）。Tertiary hover/pressed 仍直接绑 `Primitive/Neutral/N02`、`N03`，Secondary disabled 描边/文字仍绑 `Button/Primary/Bg-disable`（BTN-002 的 Figma 遗留，本项不改语义）。

回归绑定：快照 192 个 Variant 的填充/描边/文字/高度/圆角/间距绑定后写入新 Scope，再按快照 `setBoundVariable` / `setBoundVariableForPaint` 重绑。绑定错误 0；抽查 Primary default、Secondary default、Small icon-only disabled、Ghost hover、Tertiary pressed、Secondary disabled，高度、内边距、圆角、间距、填充、描边、文字均仍绑定原变量。

本地 CSS 无需改动，仍按属性消费对应 Token。


## 2026-09-10：BTN-001 复查确认（用户复述同一发现，独立 Figma 核实）

用户再次提交 BTN-001（16 个 Small icon-only Variant 上下内边距），并补充「确认过 Figma 侧组件集，并没有绑定 5px 间距，实际值是 0」。该问题本身已在 2026-09-09 关闭，本轮视为对既有结论的复核请求，未视为新问题重开。

用 `get_metadata` 重新枚举 `3042:6843` 全部 192 个 variant，定位到 16 个 `Icon=icon_only, Size=Small(24px)` 的节点（4 Level × 4 State，尺寸均为 24×24 正方形）。用 `get_design_context` 抽样核实覆盖全部 4 个 Level 的代表节点：

| Level | State | 节点 | 结果 |
|---|---|---|---|
| Primary | default | `3042:7078` | `py-[var(--interval/space1,0px)]` |
| Secondary | hover | `3042:7528` | `py-[var(--interval/space1,0px)]` |
| Tertiary | pressed | `3042:7568` | `py-[var(--interval/space1,0px)]` |
| Ghost | disabled | `3042:7608` | `py-[var(--interval/space1,0px)]` |

4 个样本均返回上下内边距绑定 `Interval/space1`，解析值 `0px`，未见任何残留的 5px 直接值。与用户本轮复述的结论、以及 2026-09-09 已关闭的决定（改为 0 并绑定 `Interval/space1`）完全一致，`schema.json`、`mapping.json`、编译 CSS（`.gj-btn-icon-only{padding:0}`）均无需变更。

补充说明：项目编译后的 `assets/styles/gj-b2b-tokens.css` 里没有生成任何 `--ds-interval-*` 系列的 CSS 变量（Interval 类间距 Token 目前不进入组件级 CSS 变量编译管线，只有各组件自己的 `padding-inline`/`height` 等被编译为具名变量），所以 CSS 侧用字面量 `padding:0` 表达「绑定 `Interval/space1`（值为 0）」是当前架构下唯一可行的写法，不代表未绑定 Token——这一点在 `audit.md` 中一并记录，避免未来复查时误判为「未绑定」。

结论：BTN-001 保持已关闭状态，本轮为独立 Figma 复核，未发现需要变更的内容。

## 2026-09-10：gj-icon-button 取消 Hover 背景叠加（新增并关闭 BTN-006）

用户反馈：`gj-icon-button`（弹窗关闭、卡片工具等轻量图标入口共用的 32px 基座）在 Hover 态叠加背景色（`Background/Hover`）视觉效果不佳，希望 Hover 只改变图标本身颜色，热区不叠加背景。

现状排查：

- `.gj-icon-button` 定义于 `assets/styles/gj-b2b-components.css`，独立于 Token 层——CSS 直接引用全局语义 Token `--ds-background-hover` / `--ds-background-hover-2`，没有任何组件级 Token 介于两者之间，所以本次调整是纯 CSS 类修改，不涉及 `button.tokens.json` 或编译产物的 Token 数值变化。
- 用户表述「多数用在关闭按钮上」与实际情况有出入：Modal（`.gj-modal-close`）与 Notification 的关闭按钮明确不使用 `gj-icon-button`（各自 `rules.md` 已注明不要用 20/16px 关闭图标套用 32px `gj-icon-button`）。当前真实复用方是：`preview/button/index.html` 的文档示例（`aria-label="关闭"`）与 Timeline 的横向翻页箭头（`.gj-timeline-arrow.gj-icon-button`，`aria-label="向前"/"向后"`，见 timeline/rules.md、timeline/mapping.json）。本次改动对两者同时生效。
- 用户仅提及 Hover 态；Pressed（`:active:not(:disabled)`，`Background/Hover_2` 背景 + 缩放）、Focus-visible 环、Disabled 灰化均未要求改动，保持不变。

实现：`.gj-icon-button:hover:not(:disabled)` 移除 `background:var(--ds-background-hover)`，只保留 `color:var(--ds-text-primary)`。其余状态规则不动。

验证：Playwright 渲染 `preview/button/index.html` 的 `gj-icon-button` 示例节点，对比修改前后的 hover 截图——背景色已消失，仅图标（`currentColor` mask）颜色从 `Text/tertiary` 变为 `Text/primary`；Pressed 态背景与缩放不受影响。

文档同步：`button/rules.md`（第 93 行 Hover 描述）、`button/schema.json`（`confirmedDecisions`、`constraints`）、CSS 顶部注释均已更新；`audit-tracker.md` 新增 BTN-006 并直接关闭。

结论：BTN-006 已关闭。`gj-icon-button` Hover 仅变更图标颜色，热区透明；Timeline 横向箭头随共享基座同步生效，未单独覆盖。

## 2026-09-11：清理预览页残留旧 CSS（新增并关闭 BTN-007）

背景：延续 MDL-010（见 `components/modal/audit.md`）建立的方法，对 `preview/button/index.html` 做同样的死代码核查——用户明确的标准原则是预览页无论静态展示区还是交互区，都应该只用标准组件基座渲染，不应该残留旧 CSS。

排查方法：同 MDL-010，解析页面全部 `<style>` 块，提取每个选择器涉及的类名，逐个类名对照页面真实 `class="..."` 属性（含 JS 动态拼接的模板字符串）确认是否被引用；复合选择器按逗号拆分成分支逐项判断，只删除全部分支都确认无引用的规则，混有真实类的复合选择器保留但裁掉死亡分支。

整条规则删除（4 条）：`.matrix`、`.note`、`.props`、`.stage`。

复合选择器裁剪（1 处，保留真实分支/去掉死亡分支）：
- `.controls h2,.stage h2` → `.controls h2`

验证：脚本二次扫描确认页面残留死选择器为 0；`<style>` 块大括号计数与逐字符深度校验均通过；Playwright 起本地 http.server 渲染整页并截图，静态展示区与交互 Demo 区视觉、交互均与改动前一致，无回归。

结论：BTN-007 已关闭。`preview/button/index.html` 内嵌 CSS 现在只包含仍被页面实际使用的选择器。


## 2026-09-14：图标与文字间距统一为 4px（新增 --ds-component-button-icon-gap）

用户在用 `scripts/verify-page.mjs` 对 5 个页面模式做生成后一致性验证时发现：`.gj-btn`（Medium/Large 继承）的图标—文字间距是硬编码 `gap:6px`（无 Token），`.gj-btn-small` 是硬编码 `gap:4px`，两者不统一且都未走 Token；6px 也不在 4px 间距阶梯（4/8/12/16/20/24/32/40/48）上。用户确认统一为 4px（与 Small 原有硬编码值一致，也与已有的 `--ds-component-text-button-icon-gap: var(--ds-space-2)` 保持一致）。

修复：`button.tokens.json` 新增 `iconGap` token（`{Interval/space2}` → `--ds-component-button-icon-gap: var(--ds-space-2)`），跑 `node scripts/build-tokens.mjs` 重新生成 `gj-b2b-tokens.css`/`gj-b2b.tokens.json`；`assets/styles/gj-b2b-components.css` 里 `.gj-btn`、`.gj-btn-small` 的硬编码 gap 都改成引用该 Token（Large 继承 `.gj-btn` 的值，无需单独改）。`node scripts/validate-tokens.mjs` 通过；`scripts/verify-page.mjs` 重新跑 5 个页面模式确认所有 Button 实例的 `spacing-off-ladder` 发现清零。
