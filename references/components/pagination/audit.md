# Pagination Figma 审计

来源：页面 `2402:14`（`分页组件Pagination`），2026-09-09 通过 Figma Desktop `get_metadata`、`get_design_context` 与 `get_variable_defs` 只读复查。未修改 Figma。

PAG-002 要求核对 3 个组件集、35 个 variant 的默认组合和变量绑定。页上带 `属性=值` 子图层的母版是 **3 套 / 35 variants**，另有 **1 个独立件** `jump_to`。旧 inventory `standalone: 0` 漏记独立跳转件，本轮更正为 **3 / 35 / 1**。

MCP 把三套母版标成 `<frame>`，子图层名仍是 `属性=值`，按母版口径计数，不另开「没有 COMPONENT_SET」。

| 套 / 件 | 节点 | variants | 轴 |
|---|---|---:|---|
| `Pagination_item/number` | `2889:3460` | 8 | Size=Default\|mini × state=default\|hover\|selected\|disabled |
| `Pagination_item/arrow` | `2889:3580` | 24 | Size=Default\|small × direction=previous\|Next × State=Default\|hover\|disabled × double=false\|true |
| `Pagination` | `2889:3755` | 3 | type=default\|mini\|type4 |
| `Pagination_item/jump_to`（独立） | `4176:18061` | — | 无 variant 轴 |

8 + 24 + 3 = 35。说明组合里的数字/箭头实例不另计套数。

## 数字项 `Pagination_item/number`

Default 与 mini 状态绑定一致，只改外框 32 / 24。文字始终 `中文/S8-CN-R`，selected 改 `中文/S5-CN-S`。圆角字面 6，未读到 Radius 变量。

| state | 代表节点 | 背景 | 文字 | Text Style |
|---|---|---|---|---|
| default | `2889:3459` / mini `2889:3461` | 透明 | `Text/Primary` | S8 |
| hover | `2889:3458` / mini `2889:3463` | **无填充** | `Text/blue` | S8 |
| selected | `2889:3457` / mini `2889:3465` | `Background/Selected` | `Text/blue` | S5 600 |
| disabled | `2889:3472` / mini `2889:3474` | 透明 | `Text/disable` | S8 |

旧 Token 把 `Background/Hover_2` 写在数字 Hover 上，Figma 数字 Hover **没有**这块底。Hover_2 只出现在箭头 Hover。

## 箭头项 `Pagination_item/arrow`

Default 32×32、`p 6`、图标 20；small 24×24、图标 16。图标色跟随 `Text/Tertiary`。双箭头换资源，不改尺寸。

| State | 代表节点 | 背景 | 图标色 | 其他 |
|---|---|---|---|---|
| Default | `2889:3575` previous；`2889:3574` Next；`2889:3577` double | 透明 | `Text/Tertiary` | 单箭头 `icf_Arrow_left/right`；双箭头 `icf_Arrow_tarrows-left-regular` / `icf_Arrow_arrows-right-regular` |
| hover | `2889:3579`；small `2889:3621` | `Background/Hover_2` | `Text/Tertiary`（不变蓝） | |
| disabled | `2889:3573`；small `2889:3625` | 透明 | `Text/Tertiary` | 生成 `opacity-40`，**不是** `Text/disable` |

small Default `2889:3617` 与 Default 同色。方向轴只换图标朝向。

## 组合 `Pagination`

| type | 节点 | 结构 | 间距 |
|---|---|---|---|
| default | `2889:3754` 248×32 | 上一页 disabled + 页码 1–5（1 selected）+ 下一页 | `gap 4` |
| mini | `2889:3753` 192×24 | 同上，项 24 | `gap 4` |
| type4（Full） | `2889:3752` 620×32 | 「Total 65 items」+ 组：上一页 disabled、1–8、省略 `icf_system_more`、50、下一页、jump_to | 外层 `gap 8`，组内 `gap 4` |

三套组合都 **没有** 双箭头。双箭头只存在于 arrow 母版，由产品按需组装。

省略图标 `2889:3679` 绑 `Text/disable`。总数文案 Figma 为英文 `Total 65 items`，`中文/S8-CN-R` + `Text/Primary`。实现中文可用「共 n 条」，不把英文写进产品 CSS。

## 独立件 `jump_to` `4176:18061`

93×26。标签 Figma 文案 `Go to`，`中文/S8-CN-R` + `Text/Primary`。输入框 48×26、圆角 4、`Background/Container`、`Border/default`。标签与输入框 `gap 8`。

## 相对旧 local-contract

1. 数字 Hover 只有蓝字，没有 `Hover_2` 底。箭头 Hover 才有 `Hover_2`，图标保持 Tertiary。
2. 箭头默认/禁用都是 `Text/Tertiary`；禁用再加 40% 透明。数字禁用才是 `Text/disable`。
3. `type=type4` 即 Full。inventory 补记 jump_to 为 standalone。
4. 项间距 4、Full 外间距 8、圆角 6、跳转 48×26 与旧 Token 一致。

## 开放问题

1. **PAG-001 · P2 · 已关闭（2026-09-10）** — 页面本身仍无组件说明，但设计确认按通用规则补充：显示条件、长页码折叠、边界禁用、跳页和快速翻页均已在 `rules.md` 写为正式规则，见下方专门小节。
2. **PAG-002 · P2 · 已关闭（2026-09-09）** — 3 套 35 variants + jump_to 已逐轴核对绑定。

## 使用说明补充（2026-09-10，来源节点 `4806:20549`）

用户指出 Figma 里存在一份独立的分页器使用说明页面（非组件节点，是设计规范/文档类画板），用只读 `get_metadata` 通读全文并原样核对，已整理进 `rules.md` 新增的"使用场景与选型"小节，覆盖：什么时候用分页器（vs 无限滚动）、按场景选型矩阵（完整/迷你/快速跳转/每页条数选择）、三种位置摆放范式、摆放间距原则（16–24px）、宽度适配（含省略号折叠示例 `1 … 4 5 6 … 20`）。

**发现一处 Figma 源文档自身的内容问题（非本 Skill 编造）**：该说明页"分页器的选用"表格第 3 行（场景「用户需调整浏览密度」→ 选型「每页条数选择」）的说明文字是从第 2 行"轻量化内容→迷你版分页器"直接复制过来的，与自身选型明显不符；第 5 行场景/选型与第 3 行重复，但标注了"（待补充）"且给出了正确的说明文字。判断是 Figma 文档编辑中的占位/复制粘贴遗留，本轮采用第 5 行的正确说明，未采用第 3 行的错误重复文字，已在 `rules.md` 里注明取舍依据，不代表 Skill 单方面改写了设计侧的表述。

这份使用说明主要是场景/选型/摆放层面的产品指导，和 PAG-001 的"显示条件、长页码折叠、边界禁用、跳页和快速翻页"技术细节不完全重合（其中"宽度适配"给出的省略号折叠示例对 PAG-001 有部分补充价值，2026-09-10 关闭 PAG-001 时采纳了这个示例）。PAG-001 本身已在同日按通用规则关闭，见下方专门小节。

## 结论

Pagination 升级为 `figma-audited`。生成时：数字与箭头 Hover/禁用分开；Full 外间距 8、组内 4；jump 放在页码组内。`pendingExtraction` 为空。2026-09-10 补充读取了 Figma 侧的分页器使用说明文档（节点 `4806:20549`），已并入 `rules.md`，并记录了源文档自身的一处内容重复/错误。


## 2026-09-10：按通用规则补充技术细节（关闭 PAG-001）

Figma 页面本身没有组件说明，设计确认：显示条件、长页码折叠、边界禁用、跳页和快速翻页按业界通用的企业级分页器约定补充为正式规则，不再是"本地补充、待确认"的临时状态。写入 `rules.md`：

- **显示条件**：内容一页内能展示完时不显示分页器（避免只有页码 1 的无意义控件）；无数据时也不显示，交给数据容器展示空状态（`rules.md` 「用途与类型」「状态与边界」两节已有，本次未改）。
- **长页码折叠**：改为具体算法——总页数 ≤ 7 全部展示；> 7 时首尾固定 + 当前页左右各留 1 页 + 单侧最多一个省略项，间隔为 1 页时直接显示不省略。附了两个具体示例（`1 2 3 4 5 6 … 20` / `1 … 9 10 11 … 20`），这是 Ant Design 等主流企业级组件库的通用折叠规则，不是本 Skill 生造的算法。
- **边界禁用**：第一页禁用上一页/快退，最后一页禁用下一页/快进；双箭头快进快退步长统一、不在操作中途变化（`rules.md` 「状态与边界」节已有，本次未改）。
- **跳页**：只接受有效整数，越界或非数字给出明确反馈，不产生页面闪动或重复请求（`rules.md` 「快速跳转与校验」节已有，本次未改）。
- **快速翻页**：双箭头按 5/10 页步长快进快退，不足一个步长时停在首/末页（`rules.md` 「状态与边界」节已有，本次未改）。

本次实际改动只在「页码范围与省略」一节补充了可执行的折叠算法和示例；其余四项此前已经写得足够具体，只是状态标注还是"待设计确认"，这次一并确认为正式规则。`schema.json` 的 `knownFigmaIssues` 已移除 `PAG-001`。

## 2026-09-11：清理预览页残留旧 CSS（新增并关闭 PAG-003）

背景：延续 MDL-010（见 `components/modal/audit.md`）建立的方法，对 `preview/pagination/index.html` 做同样的死代码核查——用户明确的标准原则是预览页无论静态展示区还是交互区，都应该只用标准组件基座渲染，不应该残留旧 CSS。

排查方法：同 MDL-010，解析页面全部 `<style>` 块，提取每个选择器涉及的类名，逐个类名对照页面真实 `class="..."` 属性（含 JS 动态拼接的模板字符串）确认是否被引用；复合选择器按逗号拆分成分支逐项判断，只删除全部分支都确认无引用的规则，混有真实类的复合选择器保留但裁掉死亡分支。

整条规则删除（16 条）：`.arrow-icon`、`.arrow-icon,.more-icon`、`.code`、`.desc`、`.jump`、`.jump input`、`.jump input:focus`、`.more-icon`、`.page-btn,.arrow-btn,.more-btn`、`.page-btn.selected`、`.page-btn:disabled,.arrow-btn:disabled`、`.page-btn:disabled:hover,.arrow-btn:disabled:hover`、`.page-btn:hover,.arrow-btn:hover,.more-btn:hover`、`.page-group`、`.pagination`、`.total`。

验证：脚本二次扫描确认页面残留死选择器为 0；`<style>` 块大括号计数与逐字符深度校验均通过；Playwright 起本地 http.server 渲染整页并截图，静态展示区与交互 Demo 区视觉、交互均与改动前一致，无回归。

结论：PAG-003 已关闭。`preview/pagination/index.html` 内嵌 CSS 现在只包含仍被页面实际使用的选择器。
