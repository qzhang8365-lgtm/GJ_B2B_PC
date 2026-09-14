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
