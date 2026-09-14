# Navbar 顶部导航栏

> 从 `references/design-system-rules.md` 拆分（2026-09-08）。跨组件的颜色/字体/布局/圆角等基础规范见该文件“基础规范”章节。

#### 用途与结构

- Navbar 位于页面顶部，承载全局搜索、消息通知、用户入口、登录或退出等跨页面通用能力。
- 平台型产品可以在 Navbar 中部使用横向 Menu 作为页面主导航，但不能与完整 Sidebar 重复承载同一信息层级。
- Navbar 的功能区从左至右按需包含：Logo、公告、横向菜单、弹性留白、搜索、通知图标、用户入口、退出按钮。
- 功能均为按需启用，不要求同时出现；优先保持信息密度和主要操作的清晰度。

#### Navbar 属性枚举

- `style`：`White / Background`，根据页面层级选择；Background 可降低顶部视觉权重。
- `Menu`：`false / true`。
- `Avatar`、`Bulletin`、`IconGroup`、`LogButton`、`SearchBox`：布尔属性，按产品需要组合。
- Figma 默认值：`style=White`、`Menu=false`、`Avatar=true`、`Bulletin=false`、`IconGroup=true`、`LogButton=false`、`SearchBox=true`。业务实例可以按需覆盖，但不得把覆盖值误写为组件默认值。
- Logo 为可选；顶部已显示系统或平台 Logo 时，Sidebar 不重复展示同一 Logo。

#### 尺寸与布局

- Navbar 默认高度 60px，上下内边距 12px，左右内边距 16px。
- 功能组横向间距 20px，图标按钮间距 12px。
- Search Box：必须复用 Medium 档 `gj-search`，高度 32px、圆角 6px；Navbar 内布局宽度参考 200px，不得再自绘 `.search-box`。宽度不足时由 Navbar 布局收起搜索，而不是改搜索框尺寸档。
- Avatar：32×32px，圆形。
- 操作图标 20px；Menu Item 图标 16px。
- 各功能分区应平均和弹性分配可用空间，不把所有内容紧凑堆在中间。

#### Menu Item

- 状态：`default / active`；可选 `collapseIcon=true / false`。
- 高度 36px，横向内边距 12px，圆角 8px。
- 默认箭头向下；打开下级菜单时切换为展开方向。
- Active 表达当前横向导航项，使用 `Background/Hover_2` 轻量背景；文字保持 `Text/Primary`，字重由 Regular 400 提升为 Semibold 600。不得改成蓝色文字。
- 带下级入口的 Menu Item 通过箭头打开 Menu Dropdown；点击其他 Menu 或用户区域时，已打开浮层关闭。

#### Menu Dropdown

- Figma 独立组件参考宽度 320px，圆角 12px、内边距 16px、标题与列表间距 8px；使用 `shadow-center`（阴影具体数值仍需人工核对 Effect Style）。
- Dropdown Item 高度 40px，横向内边距 8px，圆角 8px。
- 可带标题或不带标题；是否显示标题由菜单内容结构决定。
- Dropdown Item 默认无 Hover 背景，只有鼠标移动到具体项时显示 `Background/Hover_2`；同一列表中 Hover 状态互斥。
- 下拉浮层不预先让第一项保持 Hover，也不把 Hover 当作 Selected。
- 点击菜单项、点击浮层外部或切换到其他浮层时应关闭；是否保留选中态由目标页面导航规则决定。

#### 组合与响应式

> 以下为本地生成与适配策略，不是 Figma variant 属性；不得反向写成组件默认值。

- 同一产品内 Navbar 高度、对齐和核心入口位置保持稳定，不随普通页面切换改变。
- Navbar 是否使用普通、Sticky 或 Fixed 定位由具体页面与产品框架决定；同一产品内选定后保持一致。
- 搜索、消息、用户入口是较高优先级能力；公告、Logo、退出按钮和横向菜单按场景添加。
- 宽度不足时建议依次收起公告、搜索和横向菜单；通知与用户入口保持可访问。
- 公告内容或用户名称过长时应限制单行宽度并省略，不得挤压通知和用户操作区。
- 横向 Menu 建议不超过 6 项，6 项是数量上限而非任何宽度下的显示保证。
- 实际可见菜单数由扣除 Logo、搜索、通知和用户区后的剩余宽度决定；优先压缩或收起公告、将搜索降级为图标入口，再处理菜单溢出。
- 只有少量低优先级菜单溢出时，可收入“更多”Dropdown；若多项长期溢出、信息层级复杂或菜单总数超过 6 项，应改用 Sidebar。
- 主导航菜单不使用横向滚动，也不通过过度压缩间距或截断到无法识别来强行容纳。
