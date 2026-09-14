# Navbar Figma 审计

来源：页面节点 `2638:1002`、说明节点 `4171:4760`；组件节点 `3025:394`(Navbar)、`3143:2981`(Menu_item)、`3143:3036`(Menu_group)、`3233:256`(Menu_dropdown，独立组件)。2026-09-09～2026-09-10 通过 `get_metadata`、`get_design_context`、`get_variable_defs` 只读复查，未修改 Figma。

## 组件集与 variant 数量更正

原 tracker 记「3 个组件集、13 个 variant、1 个独立组件」。本轮用 `get_metadata` 逐个组件集拉取 symbol 列表核对：

| 组件集 | 节点 | variant 轴 | variant 数 |
|---|---|---|---:|
| Navbar | `3025:394` | style(white/background) × Menu(false/true) | 4 |
| Menu_item | `3143:2981` | status(default/active) × collapseIcon(true/false) | 4 |
| Menu_group | `3143:3036` | count(Default/4/5/6) | 4 |

3 个组件集共 **12 个 variant**（非 13），另有 1 个独立组件 Menu_dropdown（`3233:256`）。已按此更正 `schema.json` 与 `audit-tracker.md`。

## Navbar 组件集（4/4 variant 已核实）

逐一用 `get_design_context` 核实的 4 个 variant：`style=white,Menu=false`(`3025:317`，默认)、`style=background,Menu=false`(`3025:395`)、`style=white,Menu=true`(`3143:3542`)、`style=background,Menu=true`(`3143:3600`)。

- **表面差异不只是颜色**：`white` 表面除了背景色（`Background/Container` 白）以外，还带底部 1px 描边 `Border/default`(#ebeef2)；`background` 表面（`Background/Background` #f5f7fa）**没有边框**，靠背景色本身与页面区分。此前的描述“颜色只换表面，结构不变”不完全准确，本轮已更正。
- **组件属性默认值**（Avatar/Bulletin/IconGroup/LogButton/SearchBox 五个布尔属性）在全部 4 个 style×Menu 组合下完全一致：`Avatar=true、Bulletin=false、IconGroup=true、LogButton=false、SearchBox=true`。
- **Menu=true 时的布局**：`[Bulletin?] → flex-1占位 → MenuGroup → flex-1占位 → 功能区（SearchBox/IconGroup/Divider/usergroup/LogButton）`，白色与背景灰两种表面下结构完全相同，仅顶层容器边框/背景差异（见上）。
- **SearchBox 在 Navbar 里被覆盖为 200px 宽**，与 SearchBox 组件自身默认的 233px 不同，属于 Navbar 的场景化覆盖，不代表 SearchBox 组件本身默认值改变。

### Navbar 内部构成元素（此前未逐一记录，本轮补齐）

- **Divider**（复用节点 `2394:866`）：在 Navbar 内出现两次——Bulletin 文案与图标之间、icongroup 与 usergroup 之间。默认值 `type=vertical, dashed=false, position=center, title=false`，尺寸 20×1，色值 `Border/default`(#ebeef2)。
- **Bulletin**：「公告」图形（26.903×11.886 svg）+ Divider + 提示文案。文案示例「暂时没有需要特别关注的公告哦～」，字体 PingFang SC Regular 12/18，**颜色为原始十六进制 `#999`，未绑定任何 Token，也未匹配到已命名 Text Style**——这是本轮发现的一个真实缺口，需要设计侧确认对应语义色后再补 Token，不能凭 rules 自行编一个。
- **LogButton**：内部复用通用 Button 组件（Figma 图层命名为 `Button`）。高 24，内边距 8/5，圆角 4，背景 `Button/Primary/Bg-default`(#2b73ff)，文案「退出」，PingFang SC Regular 12/18 白色。此前 schema 完全没有这部分规格，本轮补齐。
- **IconGroup**：间距 12，图标 20×20（示例 `icf_contact_mail`、`system/icon-notification`）。
- **usergroup**：Avatar + 「用户」文案，间距 8，文案 PingFang SC Regular 14/22，色 `Text/Primary`(#101828)，文字样式 `中文/S8-CN-R`。

## Menu_item 组件集（4/4 variant 已核实）

| variant | 节点 | 背景 | 文字样式 | 折叠图标 |
|---|---|---|---|---|
| default + collapseIcon=true | `3143:2980` | 无 | `中文/S8-CN-R`（Regular 14/22）`Text/Primary` | `icf_Arrow_down.svg` 14×14 |
| default + collapseIcon=false | `3143:3013` | 无 | 同上 | 无 |
| active + collapseIcon=false | `4172:5505` | `Background/Hover_2`(rgba(0,0,0,0.03)) | `中文/S5-CN-S`（Semibold 14/22）`Text/Primary` | 无 |
| active + collapseIcon=true | `3143:2991` | `Background/Hover_2` | `中文/S5-CN-S`（Semibold） | `icf_Arrow_up.svg` 14×14 |

折叠图标不是固定图标：`collapseIcon=true` 时，图标随 `status` 在向下箭头（default，未展开）与向上箭头（active，已展开）间切换，方向跟随展开状态而非只看 collapseIcon 本身。前导业务图标统一 16×16。尺寸：高 36，内边距 12/8（水平/垂直，此前 schema 缺垂直内边距，本轮补齐为 8），圆角 8，内部图文间距 8。

## Menu_group 组件集（4/4 variant 已核实）

已读取组件集 `3143:3036` 的完整设计上下文，并分别读取 `count=Default`(`3143:3035`)、`4`(`3143:3053`)、`5`(`3143:3075`)、`6`(`3143:3103`) 的变量绑定。四档内部 Menu_item 结构（36 高、圆角 8、内边距 12/8、图文间距 8、`中文/S8-CN-R`）一致，差异仅为重复数量。

## Menu_dropdown（独立组件，非 variant 集合）

节点 `3233:256`。此前 schema 记 `referenceWidth: 231`，本轮 `get_design_context` 实测为 **320**，已更正。容器：背景 `Background/Container`(白)，内边距 16，圆角 12，纵向排列，间距 8。

- **标题**：文字样式 `中文/S5-CN-S`（Semibold 14/22），颜色 `Text/Secondary`(#475467)。此前 schema 完全没有记录标题的 token/文字样式，本轮补齐。
- **菜单行**：固定 4 行（非 variant 轴），每行高 40，水平内边距 8，圆角 8，图标 20×20，图文间距 8。**4 行文字全部是 Semibold**（`中文/S5-CN-S`），并非只有首行或激活行加粗——此前完全没有记录这一点。取样节点里第一行被命名为 `hover` 且带背景 `Background/Hover_2`(rgba(0,0,0,0.03))，其余 3 行命名为 `default` 且无背景色，判断这是行级 hover 交互态展示，不是独立的顶层 variant。
- **`effectStyle: "shadow-center"` 仍未核实**：`get_variable_defs` 对该节点未返回任何 effect/shadow 相关键，这是本轮所用 MCP 工具的能力限制（该接口只解析变量绑定，不解析 Figma 的 Effect Style/阴影），不代表「确认没有阴影」。如需精确的阴影数值用于像素级还原，需要人工在 Figma 客户端里核对该 Effect Style。

## 开放问题

1. **Bulletin 文案色 `#999` 未绑定 Token · 待设计确认** — 现状是原始十六进制值，也没有匹配到任何已命名 Text Style。下一步：设计侧确认对应的语义色（大概率是某档 Tertiary/Placeholder 灰阶），确认后补 Token 并同步更新 `mapping.json`。
2. **Menu_dropdown 阴影数值未核实 · 工具限制，非设计缺失** — `effectStyle: "shadow-center"` 只是既有 schema 的既定描述，本轮未能通过 `get_variable_defs` 解析出具体的模糊半径/扩散/颜色数值。如实现时需要像素级还原，建议人工在 Figma 里核对。
3. **共享实现基座仍待建设** — 本轮已把规范页的可验证样式改为消费 Navbar 组件 Token，但页面仍使用私有 `.navbar/.menu-item/.dropdown` 类；这不影响 NAV-001 的 Figma 审计结论，但尚未满足跨规范页和模式页复用同一 `gj-*` 基座的工程门禁，已单列 NAV-004。
## 结论

Navbar 升级为 `figma-audited`。3 个组件集共 12 个 variant（更正此前记录的 13）+ 1 个独立组件（Menu_dropdown）已完成审计，12/12 variant 的结构、属性、尺寸和可由工具读取的变量绑定均已核实。发现并补齐了此前 schema 缺失的 Divider/LogButton/Bulletin/usergroup 内部构成规格、Menu_item 垂直内边距、Menu_dropdown 标题与菜单行的 token/文字样式绑定，并更正了 Menu_dropdown 宽度（231→320）与 Navbar 表面差异描述（不只是颜色，还有边框）。遗留项已拆为 NAV-002（设计确认）、NAV-003（工具限制下的人工复查）与 NAV-004（共享基座建设），不混淆为已核实事实。

## 2026-09-11：清理预览页残留旧 CSS（新增并关闭 NAV-005）

背景：延续 MDL-010（见 `components/modal/audit.md`）建立的方法，对 `preview/navbar/index.html` 做同样的死代码核查——用户明确的标准原则是预览页无论静态展示区还是交互区，都应该只用标准组件基座渲染，不应该残留旧 CSS。

排查方法：同 MDL-010，解析页面全部 `<style>` 块，提取每个选择器涉及的类名，逐个类名对照页面真实 `class="..."` 属性（含 JS 动态拼接的模板字符串）确认是否被引用；复合选择器按逗号拆分成分支逐项判断，只删除全部分支都确认无引用的规则，混有真实类的复合选择器保留但裁掉死亡分支。

整条规则删除（16 条）：`.anatomy`、`.anatomy-navbar`、`.atom`、`.atom strong`、`.atom:last-child`、`.demo-item`、`.demo-label`、`.demo-label code`、`.demo-stack`、`.icon`。

验证：脚本二次扫描确认页面残留死选择器为 0；`<style>` 块大括号计数与逐字符深度校验均通过；Playwright 起本地 http.server 渲染整页并截图，静态展示区与交互 Demo 区视觉、交互均与改动前一致，无回归。

结论：NAV-005 已关闭。`preview/navbar/index.html` 内嵌 CSS 现在只包含仍被页面实际使用的选择器。
