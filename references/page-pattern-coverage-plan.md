# 模式页组件覆盖缺口与落位方案

2026-09-14。方法：对组件库 42 个组件（`references/components/*`）逐个提取根类名，在现有 5 个模式页（`preview/patterns/{search-list,form-edit,object-detail,dashboard,step-task}.html`）里做类名出现次数核对。

## 一、确认的两类问题

### 1. `.crumb`：4 个页面都在用假面包屑，真正的 Breadcrumb 组件从未被用过

`object-detail.html`、`form-edit.html`、`search-list.html`、`step-task.html` 顶部都有一段：

```html
<div class="crumb">机构开户　/　发起开户</div>
```

这是纯文本 + 手打的全角"／"分隔符（`page-patterns.css` 里 `.crumb{...font-size:12px}`），不可点击、没有结构、不是共享组件。而真正的 Breadcrumb 组件（`references/components/breadcrumb/`）类名契约是：

```
.gj-breadcrumb
  .gj-breadcrumb-item
  .gj-breadcrumb-separator
  .gj-breadcrumb-icon
  [aria-current=page]  ← 当前项
```

`assets/styles/gj-b2b-components.css` 里这套类已经真实实现。这是本项目一直在强调的"页面私有重画代替共享组件"问题（同 MDL-010/EMP-010/FRM-002/GNV-006 的模式），建议直接把 4 个页面的 `.crumb` 换成真正的 `.gj-breadcrumb`，不算"新增覆盖"，算"补漏洞"。

### 2. 19 个组件在 5 个模式页里出现次数为 0

| 组件 | 一句话用途（来自各自 rules.md） | 根类名 |
|---|---|---|
| avatar | 头像，圆角 4/6/8/12px 多档 | `.gj-avatar` |
| badge | 依附通知图标/头像/文字右上角的提醒或计数角标，不是状态词展示 | `.gj-badge` |
| carousel | 同层级内容顺序浏览（轮播），不承载必须同时比较的信息 | `.gj-carousel` |
| cascader | 从多级关联数据逐层定位结果，如省市区/部门层级 | `.gj-cascader` |
| divider | 分隔同一容器内的内容组/列表区段，不代替卡片边界 | `.gj-divider` |
| drawer | 从右侧进入并保留当前页面上下文，适合关联详情/筛选/支线表单 | `.gj-drawer` |
| grid-nav | 聚合一组平级快捷功能入口，用于首页功能区/常用入口 | `.gj-gridnav` |
| image | 图片展示 | `.gj-image` |
| notification | 全局通知（Standard 四态，2026-09-09 已按画板核对） | `.gj-notification` |
| input-number | 数量/金额/比例等可计算数值输入，含 Slider 变体 | `.gj-input-number` / `.gj-slider` |
| popover | 居中弹出框（宽 360、圆角 16、`shadow-center`、Button Large 操作区）——不是 hover 提示，比 Modal 轻但比 Tooltip 重 | `.gj-popover` |
| radio | 同一维度互斥选项中选择唯一结果 | `.gj-radio` |
| sidebar | 侧边栏导航，4 套母版/26 variants | `.gj-sidebar` |
| skeleton | 骨架屏，通用加载态占位 | `.gj-skeleton` |
| switch | 立即生效的布尔设置，不代替 Checkbox/Radio | `.gj-switch` |
| time-picker | 时间选择，三种形态对应三套母版 | `.gj-time-*` |
| timeline | 事件历史/阶段记录，Vertical/Horizontal，Dot/Checkmark 节点 | `.gj-timeline` |
| upload | 文件上传，入口直接组合共享 Button（Primary + 左图标） | `.gj-upload` |
| （textarea） | Input 组件的多行变体，`.gj-textarea`，Input 本身有覆盖但这个变体没被用过 | `.gj-textarea`（属于 input 组件，不单独算一个缺口） |

已确认覆盖良好、不在缺口清单里的：button/text-button、table、form(input/select)、tag、tabs、modal、dropdown、pagination、toast、steps、alert、chart、metric、checkbox、search、selector、date-picker、calendar。（checkbox/dropdown/modal/pagination/toast/tabs/steps 目前只出现 1-2 次，覆盖很薄，不算零覆盖，先不纳入本轮范围。）

## 二、落位方案（草案，按你选的"先出方案"来定，还没动代码）

### A. 补进详情页 `object-detail.html`
- **breadcrumb**：替换页面已有的假 `.crumb`（见上）
- **avatar**：详情页元信息区常见"负责人/协作人"字段，可以在 `customer-info-item` 里加一条负责人头像+姓名
- **timeline**：详情页很典型的"操作/审批记录"区块，可以作为 `gj-tabs` 里现有 Tab 之外新增一个"操作记录" Tab 页签内容，或者作为详情页下方新卡片
- **drawer**：可以给详情页某个操作按钮（例如"编辑"）挂一个 Drawer 而不是新开页面，演示 Drawer 承载"关联详情/支线表单"的用法
- **divider**：详情页卡片内如果有多个信息分组，可以用 Divider 替代/补充现有纯靠 margin 分隔的做法（需要先看卡片内部结构，不一定要生硬加）
- **popover**：给某个需要额外说明的字段加"?"图标 + Popover 说明，注意这是居中弹窗不是 hover 提示，场景要选对（比如"为什么这个客户被标记为高风险"这种需要展开说明并可能带确认操作的场景，不是简单字段提示）
- **badge**：详情页如果有"待处理事项"之类的图标，可以挂计数 Badge；如果找不到自然场景就先不加，不能为了覆盖硬塞

### B. 补进表单编辑页 `form-edit.html`
- **radio**：新增一个互斥选择字段
- **switch**：新增一个立即生效的布尔设置字段
- **input-number**：新增一个数量/金额字段
- **time-picker**：和已有的 date-picker 搭配，或单独一个时间字段
- **cascader**：新增一个省市区/部门层级选择字段
- **upload**：新增一个附件上传字段
- ~~textarea 变体~~：已核实，`form-edit.html` 现在的"备注"字段用的是 `.gj-input-wrap.textarea-wrap`（真实共享样式，Input 组件的包裹式实现），不是假实现，不需要动。顺带发现 `gj-b2b-components.css` 里其实平行存在两套 textarea：老的扁平 `.gj-textarea`（和 `.gj-input`/`.gj-select` 同一条规则里）和现在真正在用的 `.gj-input-wrap.textarea-wrap`——这属于组件库自身的历史遗留重复实现，不是模式页的问题，本轮不处理，先记一笔

### C. 补进列表/工作台页
- **skeleton**：`search-list.html` 加载中状态目前完全没有骨架屏演示，可以作为空状态之外的另一种加载态放进去
- **carousel**：`dashboard.html` 顶部加一个公告/banner 轮播
- **image**：详情页或 dashboard 卡片里如果有图文场景，用真实 Image 组件（含加载失败态等）

### D. 需要新开模式页
- **sidebar + grid-nav（+ notification）**：这三个都是"导航壳/全局壳"类组件，5 个现有模式页都是纯内容区，没有共享的顶部导航条或侧边栏，硬塞进某个内容页不自然。建议新增「模式六：导航壳与应用入口」，包含左侧 Sidebar 导航 + 顶部 GridNav 快捷入口宫格 + 顶部通知铃铛/Notification 面板，作为"壳层"的完整演示。

## 三、执行前必须你确认的问题

1. **5 个模式页现在是否共享同一个"壳"？** 目前看下来每个模式页都是独立的 `<div class="page ...">`，没有公共的顶部导航条或侧边栏结构。如果以后所有页面都要套进同一个壳里，Sidebar/GridNav/Notification 应该做成"壳模板"而不是单独一个模式页——这个信息我从代码里判断不出来，需要你确认产品结构上到底要不要壳。
2. **Badge vs Tag 的语义边界**：现在列表/详情页大量用 `gj-tag` 表示状态（"处理中""已完成"等），这是对的用法；Badge 官方定义是"依附通知图标/头像/文字右上角的提醒或计数角标"，不能替代 Tag，也不能为了凑覆盖数字硬塞一个不合语义的位置——需要你指一个真实场景（例如详情页 Tab 上带未读数？还是别的）。
3. **Popover 场景**：360 宽、居中、带 Button Large 操作区的"居中弹出框"，比 Modal 轻但明显重于 Tooltip，具体放哪个字段合适需要你拍板，不然容易做成"看起来像 Modal 的浮夸提示框"。

## 四、建议的执行顺序

1. 先修复 4 个页面的假 `.crumb` → 真 `.gj-breadcrumb`（风险最低，纯替换，不需要你先回答上面的问题）
2. 你确认第三节的 4 个问题后，按 B（表单编辑页 7 项）→ A（详情页 6 项）→ C（列表/工作台 3 项）→ D（新模式页）的顺序推进，每做完一批用 Playwright 截图 + `verify-page.mjs` 自查再给你看

## 五、进度更新（2026-09-14）

**已完成：**

1. **第一节问题 1（假 `.crumb`）已修复** — 4 个页面全部换成真正的 `.gj-breadcrumb`，`page-patterns.css` 里的死规则 `.crumb{...}` 已删除。
2. **第三节问题 1（是否共享同一个壳）已回答并落地**："需要有统一的壳，侧边栏和顶部导航都需要"。做法比原方案 D 更彻底：不是新开一个「模式六」单独演示壳层组件，而是把 Sidebar + Navbar 直接做成共享 `.gj-app-shell`，5 个现有模式页全部包进去（各自按业务节点设置侧边栏高亮/展开态）。副产品：借这次机会把 Navbar/Avatar 从"只有审计过的规范页、没有共享 CSS"补成了真正的共享基座（详见 `components/navbar/audit.md` 2026-09-14 节，关闭 NAV-004）。GridNav/Notification 这两个原计划里同属"壳层"的组件，这次没有涉及——现在看它们更像"内容区组件"（GridNav 是首页快捷入口宫格、Notification 是通知面板），不是必须跟 Sidebar/Navbar 绑在一起的壳组件，留在原 C/新分类里按普通内容组件处理，不再单独开模式页。
3. **第三节问题 2（Badge vs Tag 边界）已回答并落地** — 完整的使用场景表已写入 `components/badge/rules.md`（未读/未处理数量、状态标记、分类标签、入口/功能标记、头像/用户相关、不适用场景六类）。
4. **意外发现并修复一个回归**：接入统一壳后，`search-list.html` 在 1280px 视口下暴露出 Table 组件一个此前从未触发过的缺口——`.gj-table-wrap` 的 `has-overflow` 横向滚动提示从来没有 JS 真正触发过。已提炼成共享脚本 `assets/scripts/gj-table-overflow.js` 并接入 4 个用到表格的模式页，详见 `components/table/audit.md` 2026-09-14 节（关闭 TBL-007）。

**仍未开始：** 第二节 A（详情页 6 项）、B（表单编辑页 6 项 + 1 项已核实无需处理）、C（列表/工作台 3 项）。

**仍待你确认：** 第三节问题 3（Popover 场景——360 宽、居中、带 Button Large 操作区的弹出框具体放哪个字段）。这个问题不影响先推进 A/B/C 里不涉及 Popover 的其余项，但涉及 Popover 的那一项（详情页"?"说明弹窗）需要你先拍板场景才能做。

## 六、第三节三个问题的确认答复（2026-09-15）与方案调整

1. **壳的标准结构**：Sally 确认已请另一个 agent 定下来了。核查 `git diff` 证实：另一个 agent 把 Navbar 规范页也换成了真正消费 `.gj-navbar-*` 的实现，给 `.gj-sidebar` 加了真实的折叠交互（`assets/scripts/gj-sidebar.js`），并且把 5 个模式页的侧边栏内容从"业务导航演示"改成了"直接链接彼此的真实模式页切换器"。这一步顺带暴露了我上一版"画廊 tab 条 + iframe"方案又和新版侧边栏重复的问题——已修复：`preview/patterns/index.html` 改成纯重定向页，不再自带任何导航 UI，详见 `components/navbar/audit.md` 2026-09-15（续）节。往后不再改动壳本身的结构，只在需要新增内容组件时复用它。

2. **Badge vs Tag / 详情页 Tab 未读数**：Sally 确认——表格里用 Tag 表状态是通用做法，和 Badge 不冲突（两者语义本来就不同，不需要互相避让）；详情页的 `gj-tabs` 默认不带未读数角标。据此调整方案 A 的 **badge** 条目：不在 `object-detail.html` 的 Tab 上加角标，按原方案"有自然场景才加、没有就不加"的原则，本轮 object-detail 暂不强行加 Badge。

3. **Popover 场景**：Sally 澄清，实际需要的是删除确认气泡——"一句短问句 + 两个按钮（取消/确认）"，场景示例是"列表行尾的删除图标 → 点开确认：确定删除这条记录？"。核查组件库发现没有单独的 Popconfirm 组件，但真正的 `Popover`（`references/components/popover/`）本身就已经审计过 `button=2`（取消＋主操作）变体，结构正是"状态图形+标题（短问句）+说明+取消/确认双按钮"，360 宽、居中、`shadow-center`——这就是这个场景该用的组件，不需要另造一个"依附触发元素的小气泡"。据此调整：
   - 方案 A 里"给对象详情页字段加'?'说明"的 popover 用法**去掉**（这不是 Sally 确认的真实场景，不能为了凑数硬塞）。
   - 改为在方案 C（列表/工作台页）新增一项：**popover（delete-confirm 用法）**——给 `search-list.html` 表格行尾"操作"列加一个"删除"入口，点击后用真实的 `.gj-popover`（`button=2`）弹出"确定删除这条记录？"+取消/确认，验证交互后关闭。

**方案 A 更新为**（详情页 `object-detail.html`）：breadcrumb（已完成）、avatar、timeline、drawer、divider，共 4 项待做（popover/badge 移出，理由见上）。
**方案 C 更新为**（列表/工作台页）：skeleton、carousel、image，新增 popover（delete-confirm），共 4 项。

## 七、方案 B 执行完成（2026-09-15）

`form-edit.html`（新建机构客户）补齐 6 个此前零覆盖组件，全部复用已审计的真实共享类，没有新建任何未审计的视觉样式：

- **radio**：新增"客户来源"字段（直签/渠道推荐/存量转化），`gj-radio-group` + `gj-radio-label`。
- **switch**：新增"短信提醒"字段，`gj-switch`（Medium，On 态）。
- **input-number**：新增"首次预计入金金额"字段，`gj-number-input gj-number-input-unit`（单位"万"）。核实一个方案文档里的笔误：第一节缺口表把类名写成 `.gj-input-number`，实现里真正的类名前缀是 `.gj-number-input`（`references/components/input-number/rules.md` 早就写明，表格没抄对，这次顺手订正）。
- **time-picker**：新增"预约回访时间"字段，`gj-time-trigger gj-time-trigger-has-value`（静态填充态，展示选中时间；该组件目前只有 Figma 审计过的触发器视觉，没有配套的开合面板脚本，本轮不新增交互脚本，按静态真实态处理）。
- **cascader**：原来的"所属地区"已改为 Selector Trigger + `.gj-cascader` 浮层的组合。早期为补覆盖而把展开面板直接嵌入字段位置的做法已于 2026-09-15 纠正：弹层默认隐藏，触发后展开，选择后回填，并支持外部点击 / Escape 关闭。
- **upload**：新增"资质证明材料"字段，用真实的 `.gj-upload-dropzone` 拖拽上传区域。

新增一张"补充材料"卡片承载 input-number 和 upload；其余 4 项分布进原有"基本信息""联系与归属"两张卡片。验证：本地 Playwright 全页截图核实零 pageerror、零 404，6 个组件视觉与间距跟页面其余真实字段一致。已通过 SendUserFile→device_commit_files 管线推回设备并 diff 核对字节级一致。

**仍未开始：** 方案 A（详情页 4 项：avatar/timeline/drawer/divider）、方案 C（列表/工作台页 4 项：skeleton/carousel/image/popover 删除确认）。

## 八、方案 A 执行完成（2026-09-15）

`object-detail.html`（客户详情）补齐 4 个此前零覆盖组件，同样全部复用已审计的真实共享类：

- **avatar**："客户负责人"字段从纯文字"张明"改成 `gj-avatar gj-avatar-24 gj-avatar-letter` 姓氏头像 + 姓名，取自组件库真实的字母头像变体。
- **divider**：在"核心信息"（统一社会信用代码/客户负责人/归属部门/最近更新时间）和"详细资料"（客户全称/简称/类型/地区/联系方式/创建时间）两组信息之间插入 `gj-divider gj-divider-plain`，替代原来纯靠两个 `<dl>` 上下留白的隐式分隔。
- **timeline**：新增"变更记录"卡片，用真实的 `gj-timeline-v`（Checkmark 竖版节点）呈现 4 条客户变更历史（创建档案/补充联系方式/负责人变更/账户开立），全部 `is-finished` 态。**说明**：详情页顶部的"基本信息/关联账户/变更历史" Tab 目前是纯静态展示（点击不切换内容，`dashboard.html` 的 Tab 也是同样的静态用法，项目里还没有任何页面给 Tab 接过真实切换脚本），所以这次没有把 Timeline 塞进"变更历史" Tab 里假装是切换出来的内容，而是按方案里给出的另一个选项——放进详情页下方的独立卡片，内容和标题都是可信的"变更记录"，不构造一个不存在的交互。
- **drawer**："编辑客户"按钮现在会真正打开一个右侧 `gj-drawer`（Scrim 遮罩 + Header/Content/Footer 结构，内容是客户简称/联系人/联系电话/负责人的精简编辑表单），点击遮罩、关闭按钮、取消按钮或按 Esc 都能关闭，焦点在打开/关闭时正确转移。Drawer 组件本身没有配套的开合脚本，这次照抄了 `search-list.html` 里 Modal 已经用过的"外层 fixed 层 + hidden 属性切换"模式写了一小段页面内联脚本，没有新建共享运行时。

**Badge 未加**：按 Sally 的答复（详情页 Tab 默认不带未读数），这轮没有在 object-detail 上加 Badge，原方案里的这一项按之前商量的结论跳过。

验证：本地 Playwright 截图核实关闭态与 Drawer 打开态，Esc 键关闭生效，零 pageerror、零 404。已通过 SendUserFile→device_commit_files 推回设备并 diff 核对字节级一致（`object-detail.html` + `page-patterns.css` 里新增的 3 条页面级样式：头像+文字的行内对齐、变更记录卡片间距、drawer 层定位）。

**仍未开始：** 方案 C（列表/工作台页 4 项：skeleton/carousel/image/popover 删除确认）。

## 九、方案 C 执行完成（2026-09-15）

方案 C（列表页 `search-list.html` + 工作台页 `dashboard.html`）4 项全部完成，同样全部复用已审计的真实共享类：

- **popover（原计划的"弹出气泡"用例，按 Sally 的第 3 条答复调整为删除确认 Popconfirm）**：`search-list.html` 列表行尾"更多"菜单里的"删除"项，原来点开的是一个 `.gj-modal`/`.gj-modal-sm` 结构的确认弹窗——这其实是对已审计 Popover 组件的一次语义误用（真正的删除确认在组件库里就是 Popover，不是 Modal）。这次把 `#modalLayer` 内部结构整体换成真实的 `gj-popover` 标记（图标 + 标题 + 描述 + 取消/确认两个按钮），文案改成"确定删除这条记录？"，符合 Sally 描述的"一句短问句 + 两个按钮"。**发现的组件缺口**：Popover 的默认图标颜色写死为成功色（绿色），没有审计过的危险/红色态；这次沿用了原 Modal 版本已经在用的橙色警示 token（`--ds-feedback-warning`）做行内覆盖，而不是新造一个未审计的危险色变量。同时删除了 `search-list.js` 里绑定在已不存在的 `#modalClose` 关闭按钮上的一行监听（Popover 结构没有关闭图标，留着这行会在后续脚本初始化时抛 TypeError，提前发现并清理）。
- **skeleton**：复用 `search-list.js` 里查询按钮点击后本来就存在的约 320ms"查询中…"真实等待窗口，在这段时间里用 `gj-skeleton` 骨架条渲染表格行（按真实列宽比例做了 6 行骨架），替代原来查询期间的空白表格，没有额外发明一个假加载态。
- **carousel**：`dashboard.html` 页头新增一张 3 屏轮播 Banner 卡片，用真实的 `gj-carousel`/`gj-carousel-track`/`gj-carousel-indicator` 结构 + 圆点点击/自动跟随当前屏高亮，逻辑写进此前一直是空占位的 `page-patterns.js`（`// Page-pattern shared behavior belongs here` 那行注释下第一次真正落地内容）。**发现的组件缺口**：`references/components/carousel/rules.md` 明确记录"产品已于 2026-09-10 确认按 Figma 说明执行：箭头默认展示，不再是可选叠加件"，即左右箭头是硬性要求，但组件自己的审计 CSS/演示页里一直没有任何箭头样式类。这次没有跳过这个要求，而是复用了 Timeline 组件已经在用的同一套通用图标按钮类（`gj-icon-button` + `gj-icon gj-icon-16`）拼出箭头，新增的定位样式（`.carousel-arrow` 系列）是页面级的，不影响 Carousel 组件本身的共享样式表。
- **image**：`form-edit.html`"补充材料"卡片的"资质证明材料"上传框下方，新增 2 张已上传文件缩略图，用真实的 `gj-image-thumb`/`gj-image-thumb-img`（104×104，`object-fit:cover`）"已上传"态标记，图片用组件库自带的示例图（`assets/images/preview/image-component-sample.png`）。这是 Upload 组件审计说明里"Image 从文件被接受之后开始接管，渲染缩略图"这条交互关系第一次在模式页里落地。

验证：本地 Playwright 分别核实了 popover 删除确认的打开/取消流程、skeleton 骨架态截图、carousel 三屏切换（圆点点击 + 箭头）、image 缩略图渲染，全部零 pageerror、零 404。已通过 SendUserFile→device_commit_files 推回设备并逐文件 diff 核对字节级一致：`search-list.html`、`search-list.js`、`dashboard.html`、`page-patterns.js`（新增内容）、`form-edit.html`（本轮追加）、`page-patterns.css`（累计追加轮播箭头定位样式 + 缩略图行间距样式）。

**至此，`page-pattern-coverage-plan.md` 里方案 A/B/C 三个批次共 14 项零覆盖组件全部完成落地**（avatar / divider / timeline / drawer / cascader / radio / switch / time-picker / input-number(已更正为 gj-number-input) / upload-dropzone / popover / skeleton / carousel / image），且全部严格复用已审计的真实共享类，没有新造任何未审计的组件级样式或交互脚本；仅有的新增 CSS 都限定在页面私有作用域（`page-patterns.css` 里的页面级定位/间距类），不影响组件库本身。原方案里主动跳过的两项（Badge——按 Sally 答复"详情页 tab 默认不带未读数"跳过；对象详情页 Tab 切换交互——项目里目前没有任何页面给 Tab 接过真实切换脚本，属于超出本轮范围的新交互，未做）均已在方案 A 完成时记录并经确认。
