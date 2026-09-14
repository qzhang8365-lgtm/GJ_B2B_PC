# GridNav Figma 审计

来源：用户指定节点 `2638:1000`（页面 `宫格导航GridNav✅`），2026-09-09 通过 Figma Desktop `get_metadata`、`get_design_context`、`get_screenshot` 与 `get_variable_defs` 只读检查。未修改 Figma。

inventory 页面记 **2 套 / 7 variants / 0 standalone**。页上母版是 **2 个带 `属性=值` 子图层的组件集**，合计 **7 variants**。MCP 把母版标成 `<frame>`、变体标成 `<symbol>`，仍按 COMPONENT_SET 计。

左侧 `GridNav` 画板 `2938:2212` 是规范说明（文案、场景截图、Tabs 示意），里面的 `2976:765` 是 **5×2 实例**，不是第三套母版。母版右侧另有松散实例 `4142:16648`（308×148，对上 `grid=4*2`），同样不计入 sets / variants / standalone。inventory **2 / 7 / 0 与页上母版一致**，不开 inventory 缺口项。

## 已确认的组件集

| 套 | 母版节点 | variants | 轴 |
|---|---|---:|---|
| `GridNav-item` | `2938:3783` | 3 | `badge` × `number_badge`（缺 `badge=false, number_badge=true`） |
| `GridNav` | `2942:532` | 4 | `grid=4*1 / 5*1 / 4*2 / 5*2` |

### 1. `GridNav-item`

样本：无徽标 `2938:3782`、圆点轴 `2942:539`、数字轴 `3372:4331`。三态外框均为 **68×70**。

结构（三态图层树相同）：

1. `Placeholder/placeholder` 实例，36×36，圆角 8，水平居中（x=16）
2. 标题文本「最多6个字…」，68×18，居中

Auto layout：纵向、`gap 8`、`py 4`、`items-center`。高度核算：`4 + 36 + 8 + 18 + 4 = 70`。

| 项 | Figma 实测 | Token / 样式 |
|---|---|---|
| 项宽 | 68 | 直接值；无 `Components/*` 对应档 |
| 项高 | 70 | hug 结果，不是独立高度变量 |
| 图标 | 36×36 | 直接值 |
| 图标圆角 | 8 | 已绑定 `Radius/Radius-MD` |
| 图标槽填充 | `Background/Secondary` `#EBEEF2` | 2026-09-09 旧 `背景色/*` 改绑；Placeholder 子树仍可见 `Background/Container` |
| 图文间距 | 8 | `Interval/space3` |
| 垂直 padding | 4 | `Interval/space2` |
| 标题 | `中文/S9-CN-R` 12/18/400 PingFang SC | `Text/Secondary` `#475467` |
| 标题示例 | 文案本身带省略号 `…` | 实现仍应对超出 68px 的真实标题做单行省略 |

`get_variable_defs` 2026-09-09 复查已不再返回旧 `背景色/CB1`、`背景色/CB3`，改为 `Background/Secondary`、`Background/Container`、`Radius/Radius-MD`。

#### Badge 轴

| variant | 节点 | 角色 |
|---|---|---|
| `badge=false, number_badge=false` | `2938:3782` | 代码实现的基础项 |
| `badge=true, number_badge=false` | `2942:539` | **仅设计师示意** |
| `badge=true, number_badge=true` | `3372:4331` | **仅设计师示意** |

2026-09-09 用户确认：带 badge 的 Figma 变体只给设计师用。代码组合 Badge 组件，位置按 Badge 规则锚在图标右上角（GNV-001 关闭）。

未发布组合：`badge=false, number_badge=true`。本地归一：`none` = 双 false；`dot` = badge true；`number` = 双 true。

Figma **不发布** Hover / Pressed / Focus / Disabled 轴。Hover 由代码使用 `Background/Hover` 并写入 Token（GNV-003 关闭）。

### 2. `GridNav`

| grid | 节点 | 宽×高 | 布局 |
|---|---|---|---|
| `4*1` | `2942:531` | 308×70 | 横向 flex，`gap 12` |
| `5*1` | `2943:2411` | 388×70 | 横向 flex，`gap 12` |
| `4*2` | `2942:603` | 308×148 | 4 列 × 2 行 grid，`column-gap 12` / `row-gap 8` |
| `5*2` | `2943:2443` | 388×148 | 5 列 × 2 行 grid，`column-gap 12` / `row-gap 8` |

宽度核算：`4×68 + 3×12 = 308`，`5×68 + 4×12 = 388`。双行高度：`70 + 8 + 70 = 148`。宫格内嵌的都是 `GridNav-item` 实例，本页样本均为无徽标。

规范画板实例 `2976:765`（5×2）宽 **372**，子项 x 步长 76（68+8）。这是说明画板被挤窄后的实例覆盖，**不是母版 12px 列间距**。实现以母版 `2942:532` 为准。

## 相对旧 rules-derived 的核对

1. `grid` 四档、项宽 68、图标 36、图文距 8、列距 12、行距 8、最多 10 项：**与母版一致**。
2. 标题 12/18 应对 `中文/S9-CN-R` + `Text/Secondary`，旧规则未写 Text Style。
3. 图标槽圆角 8、填充白底：旧规则未写；现按母版记入 Token。
4. 圆点 / 数字 Badge：Figma 用 `badge` × `number_badge` 表达，带徽标变体仅设计师使用；代码组合 Badge。
5. Hover：Figma 不发布状态轴；代码使用 `Background/Hover` 并写入 Token。
6. 徽标几何仍以 Badge 组件为准，不进 `grid-nav.tokens.json`。

## 开放问题

1. **GNV-001 · P1 · 已关闭** — 2026-09-09 用户确认：Figma 加 badge 的 GridNav-item 仅设计师使用；代码以 Badge 组件及其位置规则组合。
2. **GNV-002 · P2 · 已关闭** — 2026-09-09 复查 `variable_defs` 已改为 `Background/Secondary` 与 `Background/Container`；用户确认旧背景色改绑 `Background/Secondary`。图标槽 Token 已改为 Secondary。
3. **GNV-003 · P2 · 已关闭** — 2026-09-09 用户确认不需要在 Figma 设置状态轴；Hover 使用 `Background/Hover` 并写入 Token。
4. **GNV-004 · P3 · 已关闭** — 2026-09-09 metadata 已读到 `number_badge`。缺 `badge=false, number_badge=true` 仍由 mapping 归一，不再单开项。
5. **GNV-005 · P2 · 已关闭** — 2026-09-09 用户确认已重新绑定；复查读到 `Radius/Radius-MD`。间距继续使用 `Interval/space2|3|4`。

## 结论

GridNav 保持 `figma-audited`。2026-09-09 用户确认后，GNV-001～005 全部关闭。代码 Hover 与图标槽颜色已写入组件 Token。`pendingExtraction` 为空。

## 2026-09-11：清理预览页残留旧 CSS（新增并关闭 GNV-006）

背景：延续 MDL-010（见 `components/modal/audit.md`）建立的方法，对 `preview/gridnav/index.html` 做同样的死代码核查——用户明确的标准原则是预览页无论静态展示区还是交互区，都应该只用标准组件基座渲染，不应该残留旧 CSS。

排查方法：同 MDL-010，解析页面全部 `<style>` 块，提取每个选择器涉及的类名，逐个类名对照页面真实 `class="..."` 属性（含 JS 动态拼接的模板字符串）确认是否被引用；复合选择器按逗号拆分成分支逐项判断，只删除全部分支都确认无引用的规则，混有真实类的复合选择器保留但裁掉死亡分支。

整条规则删除（9 条）：`.field-note`、`.mini-title`、`.muted`、`.props`、`.workbench`、`.workbench-main`、`.workbench-side`。

验证：脚本二次扫描确认页面残留死选择器为 0；`<style>` 块大括号计数与逐字符深度校验均通过；Playwright 起本地 http.server 渲染整页并截图，静态展示区与交互 Demo 区视觉、交互均与改动前一致，无回归。

结论：GNV-006 已关闭。`preview/gridnav/index.html` 内嵌 CSS 现在只包含仍被页面实际使用的选择器。

## 2026-09-11：图标槽去除灰底，修复 Glass Icon 边缘露灰（新增并关闭 GNV-007）

背景：用户在预览页看到宫格导航的每个图标外围都露出一圈浅灰色方形描边，指出这是「毛玻璃图标」背后的底色问题，要求修复。

排查：`.gj-gridnav-icon-wrap` 的填充 `Background/Secondary` 是 GNV-002（2026-09-09）用 `variable_defs` 核实过的 Figma 真值，本身没有记错。但图标资产层面，`components/icon/rules.md`「Effect Icon / Glass Icon」与 `design-system-rules.md` 的 Glass 效果章节早就写明：这批 Glass Icon 在烘焙 PNG 时固定假设背后是「干净的白色背景」，并且明确点名宫格导航是目标场景之一。GridNav 当前接入的图标资产（`assets/icons/glassicon/png/`，`preview/gridnav/index.html` 里 `GLASS_ICONS` 列表）100% 是这批 Glass Icon——图标本身是带柔和阴影、圆角、部分半透明处理的成品图，不是需要底色衬托的单色线性图标。把它们贴在一个不透明的浅灰方块上，图标圆角/斜切边缘之外的方块直角区域就会露出这块灰色，形成视觉上的「描边」瑕疵。这是两个各自独立、各自有依据的既有决定（GNV-002 的图标槽底色 vs Glass Icon 的烘焙假设）在实际渲染中互相冲突，此前没有人把两者摆在一起用真实 Glass 图标验证过。

用 Playwright 实测 10 个真实业务图标（首页/数据中心/交易服务/研报/账户/消息中心/投研平台/业务办理/功能设置/更多功能）放大截图，逐个确认灰色描边清晰可见，排除是单个图标素材的偶发问题。

决策：图标槽默认改为透明，不再叠加 `Background/Secondary`，让 Glass Icon 回到它烘焙时假设的干净背景上。圆角 Token 保留（不影响任何视觉，只是暂时没有可见的填充色可以被裁出圆角）。为不删掉 GNV-002 已确认的填充能力，新增可选修饰类 `.gj-gridnav-icon-wrap-tinted{background:var(--ds-component-grid-nav-icon-background)}`，供未来如果业务改用不透明的线性/填充类图标、需要一块底色衬托时按需叠加，不作为默认行为。

实现：`assets/styles/gj-b2b-components.css` 的 `.gj-gridnav-icon-wrap` 背景改为 `transparent`，上方加 2026-09-11 说明注释；新增 `.gj-gridnav-icon-wrap-tinted` 规则。`references/components/grid-nav/rules.md` 的图标槽描述同步记录了 GNV-002 与 Glass Icon 规则的冲突背景与最终结论。

验证：Playwright 重新渲染 `preview/gridnav/index.html`，放大截图单个图标槽和完整网格，10 个真实 Glass 图标（首页/数据中心/交易服务/研报/账户/消息中心/投研平台/业务办理/功能设置/更多功能）确认灰色描边全部消失，图标边缘干净地落在白色页面背景上，与其余布局、间距、文字无变化。

结论：GNV-007 已关闭。GridNav 图标槽默认透明，与 Glass Icon「干净白色背景」的烘焙假设保持一致；`Background/Secondary` 填充作为可选修饰类保留，供未来非 Glass 图标场景使用。
