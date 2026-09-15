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

## 2026-09-14：建设共享 Navbar/Avatar 基座并接入统一壳（关闭 NAV-004，拆出 NAV-006）

背景：用户在拓展模式页组件覆盖的讨论中明确"1，需要有统一的壳，侧边栏和顶部导航都需要"，确认了此前遗留问题 3（NAV-004，"共享实现基座仍待建设"）需要现在处理。

排查：`preview/navbar/index.html` 是本组件已完成 Figma 审计（NAV-001~NAV-003）的规范页，内联 `<style>` 和 `navbar(o={})` 渲染函数里的类名/结构/尺寸都是已核实的真实实现——`.navbar`（`gap:10px`、`overflow:visible`）、`.navbar-logo`+`.logo-mark`、`.navbar-menu`+`.menu-item`+`.caret`（水平菜单，本轮未使用）、`.navbar-spacer`、`.bulletin`+`.divider-v`（本轮未使用）、`.navbar-actions`、`.icon-group`+`.icon-btn`（20×20px，无额外热区内边距）、`.user`+`.avatar`（32px 圆形）、`.logout`。只是这套真实实现从未跳出这个规范页本身，被提炼成共享 `gj-*` 基座。

做法：不是凭空设计新样式，而是原样把这套已审计的结构/尺寸/token 用法迁移进 `assets/styles/gj-b2b-components.css`，类名加 `gj-navbar-` 前缀：`.gj-navbar`、`.gj-navbar-background`、`.gj-navbar-logo`、`.gj-navbar-menu`/`-menu-item`/`-menu-icon`、`.gj-navbar-spacer`、`.gj-navbar-bulletin`、`.gj-navbar-divider`、`.gj-navbar-actions`、`.gj-navbar-icon-group`/`-icon-btn`/`-icon`、`.gj-navbar-user`、`.gj-navbar-logout`。同步把 Avatar 的真实实现（`references/tokens/components/avatar.tokens.json`：24/32/40/64 四档尺寸 + `container`/`squareRadius`/`icon` 子 token；`shape.circleRadius:50%`；`style.default.background:#d7dce3`+`style.default.icon`；`style.letter`/`style.picture`；badge 叠加 token）提炼成 `.gj-avatar`/`-24`/`-32`/`-64`/`-square`/`-icon`/`-letter`/`-picture`，并处理了 `.gj-avatar .gj-badge-dot`/`.gj-badge-count` 的角标叠加定位（复用 Badge 本身的类，只覆盖 `left/top/transform/box-shadow` 做描边）。

首次发现（此前未记录）：`references/tokens/components/navbar.tokens.json`（30 个变量）和 `avatar.tokens.json`（28 个变量）其实早就被 `scripts/build-tokens.mjs` 自动构建进 `gj-b2b-tokens.css` 了，只是一直没有对应的共享组件 CSS 去消费它们——token 和组件实现处于不同步状态，这次一并接上。

统一壳：`preview/patterns/` 下 5 个模式页（`dashboard/step-task/object-detail/search-list/form-edit`）统一包入 `.gj-app-shell`（flex 布局：`.gj-sidebar` 固定宽 + `.gj-app-main` 内 `.gj-navbar` 置顶 + 原 `<main class="page ...">` 不变），侧边栏按各页面所属业务节点设置 `active` 高亮与父级分组（"客户管理"）展开态，"机构开户"顶层项带 `gj-badge gj-badge-s gj-badge-red` 待处理数角标。同时把 4 个模式页里手打的假面包屑 `<div class="crumb">机构开户　/　发起开户</div>` 换成真正的共享 `.gj-breadcrumb` 组件（`page-patterns.css` 里对应的 `.crumb{...}` 死规则已删除）。

验证：Playwright 起本地 http.server，5 个模式页在 1440×900 下核实零请求失败、零 pageerror；截图核实侧边栏高亮、面包屑、导航栏未读角标（邮件"5"、通知红点）与头像/用户名渲染正确。`verify-page.mjs` 跑出的新发现里，`header.gj-navbar{gap:10px}` 不在间距阶梯上——核实这个 gap 被 `.gj-navbar-spacer{flex:1}` 完全吸收、不影响任何可见像素，直接改成阶梯值 `8px`，零视觉差异；另有两类此前脚本未见过的误报（Badge 角标与宿主图标的故意 `position:absolute` 重叠、Badge/头像图标与不相关文字被误配对比较颜色），已补进 `scripts/verify-page.mjs` 头部注释的已知误报清单。

范围边界：Navbar 的 Menu_item/Spacer/Actions/IconGroup/User/Logout 与 Avatar 全部已有共享实现并在 5 个模式页里实际复用；Menu_dropdown（水平菜单下拉，NAV-001/NAV-003 已审计过结构和 Token，本轮没有页面用到水平菜单）不在这次范围内，拆出 NAV-006 单独跟踪，不算在 NAV-004 的关闭条件里。

结论：NAV-004 已关闭。Navbar 与 Avatar 现在都有真实的、源自已审计规范页的共享 `gj-*` 基座，5 个模式页统一复用同一套壳，不再各自私有重画。


## 2026-09-15：修复 `preview/patterns/index.html` 画廊页与模式页统一壳的导航重复（NAV-004 补充）

背景：Sally review 上一版统一壳截图后反馈——"基本上是不合格的状态，除了没有用上侧边导航栏和顶部导航栏的共享基座，还与原来的左侧五个模式页的 tab 重复了"。核查后发现问题根源不在 5 个模式页本身（它们内部确实已经在用真实的共享 `.gj-sidebar`/`.gj-navbar`，见上一节），而在一个此前完全没检查过的文件：`preview/patterns/index.html`。

这个文件是项目里早就存在的"页面模式画廊"——用 `<iframe>` 套五个模式页做切换预览，本身有一套独立的、页面私有的顶栏+侧栏（`.pattern-header` + 216px 宽的 `.pattern-nav` 五按钮竖排列表，和 `.gj-sidebar`/`.gj-navbar` 完全无关，不是共享基座）。Sally 平时就是通过这个画廊页查看模式页的，所以她实际看到的是：画廊自己的私有导航（外层）+ iframe 里每个模式页自己的统一壳（内层）——两套导航堆在一起，正是她说的"重复"。这个文件之前一直不在 NAV-004 的排查范围内，是本轮遗漏。

修复方式：不是给画廊也接共享基座（画廊本身是文档/预览工具，不是产品页面，接 `.gj-sidebar`/`.gj-navbar` 反而会制造第三套导航），而是把画廊的私有顶栏+侧栏换成一条极简的水平 tab 条（`.pattern-tabbar`，40px 高，纯文字 tab，不用任何 `gj-*` 类名），明确让它在视觉上读作"文档级的页面切换器"而不是又一套 app 导航；真正的、也是唯一一套产品导航壳保留在 iframe 内部的模式页里不变。切换逻辑（`openPattern()`、`location.hash` 深链）原样保留，只是选择器从 `.pattern-link` 改名 `.pattern-tab`。

验证：本地起 `http.server` 服务整份画廊，Playwright 依次点击 5 个 tab（查询列表/新建编辑表单/对象详情/概览工作台/分步任务）截图核对——每个模式下 iframe 内都只看到一套真实的侧边栏+顶部导航（侧边栏高亮与分组展开态、面包屑均随页面正确切换，例如分步任务页高亮"机构开户"+角标"3"，对象详情页高亮"客户详情"+"客户管理"分组展开），画廊自己的 tab 条清晰区别于产品壳，零 pageerror、零非预期 404。修复后的文件通过 SendUserFile→device_commit_files 管线写回设备，并重新拉取 diff 核对字节级一致。

结论：`preview/patterns/index.html` 的导航重复已修复。至此 5 个模式页无论直接打开还是通过画廊查看，都只呈现一套共享基座导航。

## 2026-09-15：规范页与五个模式页统一到同一 Navbar 基座（关闭 NAV-006）

复查发现五个模式页虽然已经使用 `.gj-navbar*`，但 Navbar 规范页仍由私有 `.navbar/.menu-item/.dropdown` 渲染，造成“规范页组件”和“模式页组件”实际上来自两套实现。现已把规范页的 Logo、Menu Item、Search、IconGroup、User、Logout 和 Menu Dropdown 全部迁移到共享 `.gj-navbar*` 基座，并把此前缺失的 `.gj-navbar-dropdown-*` 正式加入共享组件 CSS。

五个模式页的实例进一步显式声明 `data-gj-navbar` 及 White、Menu=false、Search/IconGroup/Avatar=true 的标准属性组合；与 Sidebar 重复的 Logo 和横向 Menu 保持关闭，移除规范组件本身未包含的演示角标，避免把业务装饰误认成 Navbar 默认结构。规范页和模式页现在消费同一套结构、Token、状态及子组件，不再存在私有顶部栏。


## 2026-09-15（续）：另一 agent 重构壳为"侧边栏即模式页切换器"后，画廊页需要再次修正

背景：上一节的修复（把 `preview/patterns/index.html` 的私有导航换成极简水平 tab 条，iframe 逻辑不变）刚推上设备验证完，Sally 确认"已经让其他 agent 把壳的标准结构定下来了"。核查 `git diff`（working tree 相对 `Initial commit`）发现这不是一句客套话——期间另一个 agent 对 `preview/navbar/index.html`、`references/components/sidebar/schema.json`、新增的 `assets/scripts/gj-sidebar.js` 等做了一轮真实的、范围更大的壳标准化：

1. `preview/navbar/index.html`（Navbar 规范页本身）从页面私有的 `.navbar/.menu-item/.dropdown` 类，改成真正消费 `.gj-navbar-*` 共享类——这原本就是 NAV-004 该做但没做到规范页级别的事。
2. 新增 `assets/scripts/gj-sidebar.js`：给 `.gj-sidebar` 加了真实的折叠/展开交互（`data-gj-sidebar` 根节点 + `data-gj-sidebar-toggle` 按钮，状态存 `sessionStorage`），`schema.json` 同步登记了这两个 hook。
3. **关键变化**：5 个模式页的侧边栏内容，从我之前建的"业务导航"（工作台/机构开户角标 3/客户管理…）换成了直接列出 5 个模式页本身的真实链接（`<a href="dashboard.html" data-pattern-page>` 等），侧边栏自己就是"模式页切换器"，用真实整页跳转，不再是 iframe。

这一步意义很大：它把"5 个模式页之间怎么切换"这件事，从"iframe 画廊 + 私有导航"整体换成了"每个模式页的共享侧边栏本身承担切换职责"，架构上更干净，也是 Sally 要求"统一壳"的更彻底落地。

但这也让我上一节刚做完的修复过时了：`preview/patterns/index.html` 里保留的 iframe + 水平 tab 条，本质上还是"画廊自己再维护一份 5 个模式页的切换列表"，只是从竖排私有导航换成了横排 tab 条——跟侧边栏里那份真实的切换列表重复的问题并没有消失，只是从"两套导航长得不一样"变成了"外层 tab 条 + 内层侧边栏，还是两套"。截图核实：打开画廊后确实同时看到顶部横条的 5 个 tab 和 iframe 内侧边栏的 5 个链接。

修复：既然每个模式页的共享侧边栏现在已经是真实、可用的切换器，画廊这个 iframe 包装层本身就没有存在的必要了。把 `preview/patterns/index.html` 改成一个极简的重定向页——读 `location.hash`（兼容旧的 `#object-detail` 深链），命中已知模式页名就整页跳转过去，默认跳 `search-list.html`，不带任何自己的导航 UI。这样任何入口打开 `index.html` 最终都会落在某个模式页上，页面里只有一套真实的共享壳（侧边栏 + 顶部导航），不会再有第二层包装。

验证：本地起 `http.server`，Playwright 分别访问 `index.html`（默认应落到 search-list.html）和 `index.html#object-detail`（应落到 object-detail.html 且深链生效），核实最终 URL 正确、零 pageerror、零 404，且落地页只呈现一套侧边栏+导航栏，侧边栏按当前模式页正确高亮、面包屑正确。修复后的文件通过 SendUserFile→device_commit_files 管线写回设备，重新拉取 diff 核对字节级一致。

结论：`preview/patterns/index.html` 不再维护任何自己的导航 UI，纯粹作为重定向入口存在；5 个模式页无论从哪个入口打开，都只呈现共享侧边栏+顶部导航这一套真实的壳。上一节记录的"水平 tab 条"方案作废，以本节为准。
