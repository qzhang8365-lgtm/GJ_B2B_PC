# 国金 PC 端 B 端设计系统详细规则

本文件保存基础规范与组件细则。执行任务时从根目录 `SKILL.md` 进入，并只读取与当前页面或组件相关的章节。

## 目标

根据国金 B 端设计系统选择并组合组件，输出符合设计规范的页面结构或组件调用方案。优先复用现有组件和语义变量，不自由创造新的视觉规则。

## 权威来源与边界

- Figma 是视觉、组件属性、设计状态和变量值的唯一设计真值。
- 本 Skill 记录经过确认的使用规则、选择逻辑、枚举和边界状态。
- 本地规范站用于人工查看和交互验收，不等同于生产组件源码。
- 组件调用示例只表达预期 API；真实组件实现、事件接口、无障碍和发布版本以开发组件库为准。
- 不修改 Figma。发现拼写、变量绑定、组件属性或规则冲突时，应报告问题并等待设计侧调整。
- 未确认的信息必须标记为“待确认”，不得把推测写成强制规范。

## AI 执行顺序

1. 判断页面目标和信息层级。
2. 选择最匹配的页面模式和组件，不用相似组件随意替代。
3. 读取相关基础规范与组件规则。
4. 使用语义 Token；只有查找别名或核对初始色值时读取 Primitive 色盘。
5. 检查组件枚举、默认值、属性依赖、互斥关系和边界状态。
6. 检查组件组合权重、间距、对齐、响应式和异常内容。
7. 若规则缺失或冲突，明确列出问题，不自行补造设计真值。

## 工程化 Token 入口

- 生成页面或代码前，先读取 `library-index.json`，再从 `aiWorkflow.tokens.unified` 定位统一 Token 包。它统一汇总颜色、尺寸、字体、效果、渐变、栅格、断点和卡片布局，并为可代码化条目提供确定的 CSS Variable 名。
- 生成 HTML/CSS 原型时只加载 `../assets/styles/gj-b2b-tokens.css` 和 `../assets/styles/gj-b2b-components.css`。同目录其余 CSS 不是工作流入口，分级见 `../assets/styles/README.md`。详细调用约束读取 `tokens/token-contract.md`。
- 统一 JSON 与 CSS 是派生产物，不手工修改。Figma 提取来源或本地确认规则更新后，运行 `node scripts/build-tokens.mjs`（以本 Skill 目录为当前目录）重新生成。
- 当前统一包已包含已审计组件的组件级 Token（含 InputNumber、Image、Badge、Timeline）。生成这些组件时读取对应 `component.<name>.tokens` 和 `stateMatrix`；禁止从页面硬编码反推。未单独建 Token 文件的组件仍须读取对应 schema 与 rules，不得根据组件名称自行虚构。

## 组件覆盖状态入口

- `coverage.json` 是组件覆盖状态的唯一可机读看板，按组件合并 Figma inventory、叙述规则、结构化契约、组件 Token 和预览页。
- 本文件不再维护另一份“完成/未完成”状态表。组件产物或 inventory 变更后，运行 `node scripts/build-coverage.mjs`，再执行统一校验。
- `coverage.json`（及 `references/audit-tracker.md`）按组件名或问题 ID 定点检索对应条目，禁止整份 Read；这两个文件设计为按需查行，不是按需通读。

## 全局硬规则

### 颜色

- 页面和组件优先使用 `Text/*`、`Background/*`、`Border/*`、`Button/*` 等语义颜色。
- `Primitive/*` 只保存初始色值，不承载组件或业务语义。
- 禁止在已有语义变量可用时直接写 HEX。
- 当前只维护一套 PC 主题变量，不生成不存在的深色模式变量。
- 隐藏发布不等于不用：设计确认需要维护的变量仍须保留，例如 `Background/MK_20`、`Background/MK_30`。
- 透明色必须保留 alpha；不得在白底预览中误判为纯白或无颜色。

### 字体

- UI 字体只调用用户操作系统已安装字体；Figma 中的字体名称只作为视觉参考，不要求为还原设计而下载或打包 UI 字体。
- 中西文字体必须按完整配对使用：macOS 使用“苹方 + SF Pro”，Windows 使用“微软雅黑 + Arial”，跨平台开源回退使用“思源黑体 + Source Sans Pro”。同一页面或产品表面不得任意交叉混搭。
- GJType 仅允许用于 Metric、Gauge、Progress、Progress Ring 的核心指标。表格数据、柱状图标签、折线/饼图等普通图表标签、Calendar 日期、Time Picker 时间、Pagination、Badge 和正文中的数字均使用当前 UI 字体配对。
- GJType 必须通过字体资源导入；加载失败时提示或回退 DIN 系列，不单独建立 number fallback Token。
- 中文字重：正文、列表项、说明文字 400；标题、Tab、按钮、标签 500；大标题和强调 600。
- GJType 字重只在上述白名单组件内选择：小型指标 400、中小型指标 500、大型核心指标 700。

### 布局、间距与圆角

- 1440px 是默认设计基准宽度，其余尺寸按已定义断点与内容规则适配。
- 页面结构与内容布局的标准间距以 8 为基线，使用 `4 / 8 / 16 / 20 / 24 / 32 ...` 阶梯。
- 卡片自外向内分为：一级背景卡片 → 二级模块卡片 → 三级内容卡片 → 四级字段内容；逐级选择相应间距。
- 一级卡片常规内边距为 20px；具体组件或已确认页面规则可覆盖。
- 一级背景卡片默认无描边，通过背景明度差、间距与圆角建立页面层级，避免形成过强的框线束缚感。只有同色背景无法分层、明确的可选择/交互状态，或具体设计稿明确要求时才允许加描边。
- 权威圆角阶梯包含 `4 / 6 / 8 / 12 / 16 / 24 / 999`。
- 常规一级卡片默认 12px，内部卡片通常逐级递减。
- 组件规范页统一采用纵向阅读流：一级白色内容容器为 12px 圆角且不加描边；文档内的示例画板、规则表等二级容器为 8px；更内层的文档标签或局部容器为 4px。该层级只约束规范网站的承载容器，不得覆盖真实组件自身的圆角 Token。
- 组件规范页中的纯文字规则和说明优先整理为表格。规范表格的表头与普通单行单元格统一为 48px 高；内容换行时仅对应行自适应增高。所有示例区必须设置 `min-width:0`、`max-width:100%` 与必要的容器内滚动，禁止示例越界遮挡相邻内容。
- 组件规范页的演示背景必须按组件自身底色选择，不得把灰色作为无条件默认值：自身含灰色填充的 Tabs、Selector、Input、卡片等优先放在白色承载面；白色组件、阴影或悬浮卡片可使用灰色承载面；Ghost、白色透明色与 Glass 等需要专用深色或对比背景。承载面与组件默认填充至少保持一级可辨识的明度差，且背景只用于提高辨识度，不代表组件必须运行于该业务背景。
- 16px 是 PC 网页中用于增强风格化的大圆角，可按需求偶尔使用。
- 弹窗、Banner 和特殊组件可根据设计需求灵活调整。
- 设计稿中的组件实例与默认组件集不一致时，以该设计稿实例真值为准。

### 图标

- 图标必须来自已维护的图标资源库，不使用 Emoji、Unicode 临时符号、CSS 手绘或近似替代图标。
- 普通 General 图标采用 Icon Font 或对应资源调用；复杂渐变 Effect 图标采用 SVG；动效图标采用 SVG + CSS 或外部 Lottie 资源。
- System 图标只有一套图标血缘、两种交付形态：`references/icons/system-manifest.json` + `assets/icons/general/system/` 是 115 个源 SVG 的审计层；`references/icons/manifest.json` 的 System 分类 + `assets/icons/iconfont/` 是编译调用层。页面和组件选图使用后者，源图审计或重新编译才使用前者；不得将两边合并或因路径不同重复使用。115 个源文件中 113 个编译进 System 分类且逐字节一致，另外 2 个（`icon-attachment`、`link-line`）已由用户对照 Figma 节点确认最终编译分类为 File（`icf_file_attachment`、`icf_file_link-line`），不是 System；源文件物理路径含 `system/` 不代表编译分类必然是 System。详见 `references/icons/system-audit.md`。
- 默认画布 24×24px；标准线宽 2px并轮廓化；圆角和边缘半径原则上保持 2px。
- 尺寸使用 `12 / 16 / 20 / 24 / 28 / 32 / 36 ...` 的 4px 梯度，并随文字大小适配。
- 图标默认继承周围文字颜色；仅在表达独立状态时使用状态语义色。
- 图标渲染的具体实现踩坑（`mask` 简写、Glass Icon 的 `backdrop-filter`）见下文「工程实现踩坑记录 > 图标渲染」。

## 规范完善顺序与状态

状态说明：`已整理` 表示规则已写入但仍可继续修订；`待整理` 表示尚未进行本轮完整核对。

1. 基础规范
   - 颜色 Color：已整理
   - 样式效果 Effects：已整理
   - 字体 Typography：已整理
   - 布局 Layout：已整理
   - 圆角 Radius：已整理
2. 通用组件
   - 按钮 Button / Text Button：已整理
   - 分割线 Divider：已整理
   - 图标 Icon：已整理
   - 标签 Tag：已整理
3. 导航组件
   - 侧边栏导航 Sidebar：已整理
   - 顶部导航栏 Navbar：已整理
   - 页签 Tabs：已整理
   - 面包屑 Breadcrumb：已整理
   - 走马灯 Carousel：已整理
   - 分页 Pagination：已整理
   - 宫格导航 GridNav：已整理
4. 信息录入组件
   - Input、Checkbox、Radio、Switch、DatePicker、Form：已整理
   - Selector、Dropdown、Cascader、Search、TimePicker、Input Number：已整理
   - Upload、Image：已整理
5. 信息展示组件
   - Table、Avatar、Badge、Empty、Steps、Timeline、Metric、Chart：已整理
6. 操作反馈组件
   - Toast、Modal、Notification、Popover、Drawer、Skeleton：已整理

## 基础规范

### 颜色 Color

生成或检查页面颜色时，读取 `tokens/colors-semantic.json` 获取完整语义变量、别名、解析值和使用边界；只有核对底层色值时读取 `tokens/colors-primitive.json`。变量值和别名以 Figma 为准，本地补充的 `usage` 只约束 AI 选用，不视为已回写 Figma 的 Description。

#### 层级

- Primitive：只保存原始色值，供语义变量引用和颜色核对。
- Semantic：供页面和组件直接使用，包括 Brand、Text、Button、Table、Feedback、Chart、Border、Background。
- Gradient：使用已维护的渐变样式，不自行拼接近似渐变。

#### 选择规则

- 主文本使用 `Text/Primary`；次文本使用 `Text/Secondary`；辅助信息和占位使用 `Text/Tertiary`；禁用文字使用 `Text/disable`；深色背景反色文字使用 `Text/reversal`；链接与蓝色文字按钮使用 `Text/blue`。
- 一级背景卡片默认不使用边框；需要描边的二、三级模块卡片及组件容器使用 `Border/default`。输入框、灰色描边按钮等较强边界使用 `Border/secondary`；悬停、聚焦、错误和禁用状态使用相应 Border 语义变量。
- 全局灰背景使用 `Background/Background`；白色卡片背景使用 `Background/Container`；辅助灰背景使用 `Background/Secondary`。
- 涨红使用 `Feedback/error&rise`；跌绿使用 `Feedback/success&decline`；平盘使用 `Feedback/plain`。交易动作颜色不得与涨跌语义互相替代。
- B 端品牌主色使用 `Brand/GJ_Blue`；品牌蓝紫使用 `Brand/GJ_purple`。
- `Brand/GJ_violet` 与品牌红同属国金 C 端项目主题色。在 B 端仅允许作为少量点缀，通常不使用，不得替代 B 端品牌主色。
- `Chart/CH01–CH10` 是有序的数据系列色：单系列默认使用 CH01，多系列按顺位取色；这些颜色不绑定固定业务含义，同一指标跨图必须保持映射一致。
- `Background/BG_*` 是低强调色相背景，只有业务语义已经明确时才与对应前景色配对；不得仅因背景是红、绿、橙等色相就推导错误、成功或警告。
- `Background/BT_*` 是带透明度的色相叠加阶梯，不是独立业务状态。优先通过组件或已定义语义变量引用；直接使用时必须有明确的色相体系和交互层级依据。

#### 透明背景枚举

- 蓝色透明：`Background/BT_B5 / B8 / B10 / B15 / B20`。
- 红、绿、橙、黄、青、天蓝、深蓝、紫、粉透明色沿用对应 `BT_*` 的 `5 / 8 / 10 / 15 / 20` 透明度阶梯。
- 黑色透明：`Background/MK_3 / MK_5 / MK_10 / MK_20 / MK_30 / MK_45 / MK_60 / MK_80`。
- 白色透明：`Background/WT_10 / WT_20 / WT_30 / WT_40 / WT_45 / WT_60 / WT_80`。
- `Background/Hover` 引用蓝色 5% 透明背景；`Background/Hover_2` 引用黑色 3% 透明背景。
- `Background/WT_*` 主要用于深色背景上的白色半透明按钮填充、配合 Glass Effect 的毛玻璃填充，以及个性化半透明卡片和深色背景上的部分 Hover 状态。
- `Background/MK_3` 是极轻量 Hover 背景变量。除 `Background/Hover_2` 引用外，也允许在其他轻量 Hover 场景直接使用。

#### 边界与禁止事项

- 组件 Disabled 状态遵循“已定义优先、缺失才兜底”：Figma/组件契约已有 Disabled 时完整使用其状态值，不额外叠透明度；两处均未定义时，才在组件最外层使用 `opacity:50%` 并禁止交互。组合组件不得父子重复应用透明度。
- 透明变量不能因视觉过淡而替换成更深色；应通过合适的预览底色检查。
- 状态颜色必须服从业务语义。例如红色既可能表达涨，也可能表达错误，必须结合变量路径选择，不能只按 HEX 判断。
- 不把 Color Style、渐变 Paint Style 和颜色变量混为同一种资产。
- Figma 中空白的 Description 不得仅根据变量名编造；只有设计侧确认或现有组件规则能够支持时，才可在本地 Token 中补充使用边界，并保留其本地规则属性。
- 本地 Token 文件中由既有组件规则补充的使用边界可以用于生成页面，但不得声称它们已经成为 Figma Description；与后续 Figma 更新冲突时重新核对并以 Figma 当前变量为准。

### 样式效果 Effects

需要生成阴影、内阴影或底部分隔效果时，读取 `styles/effects.json` 获取原始参数、颜色别名和已确认使用边界；不得根据视觉近似重算一套参数。

#### 资产类型

- 样式效果包含外阴影、内阴影、边缘或分割线效果，以及 Glass 毛玻璃效果。
- 优先引用已有 Effect Style，不根据视觉近似自行创建新的阴影参数。
- 阴影颜色应引用 Background 透明变量，不把透明黑色写成不透明灰色。

#### 已提取效果

- `shadow-center`：基础通用外阴影，四周均匀扩散；参数为 `0 0 15px 0`，颜色引用 `Background/MK_10`。
- `shadow-down`：向下投射的层级阴影，参数为 `0 8px 20px 0`，颜色引用 `Background/MK_10`。适用于下拉菜单、悬浮按钮，以及卡片 Hover 等网页交互动效。
- `bottom border`：底部 1px 内阴影边界，参数为 `inset 0 -1px 0 0`，颜色引用 `Primitive/Neutral/N04`。适用于导航栏、列表项和表格行的底部内容分隔，可避免额外增加独立分割线图层。
- `shadow_small`：轻量小阴影，参数为 `0 0 8px 0`，颜色引用 `Background/MK_10`。适用于按钮和小卡片。
- `Innershadow_small`：轻量内阴影，参数为 `inset 0 0 2px 0`，颜色引用 `Background/MK_5`。适用于带灰色背景的 Pill Tab 等切换型组件容器，用于表现轻微内凹和容器边界。
- Glass 效果必须与具有透明度的背景填充共同使用；仅添加模糊、但使用完全不透明填充时，不视为完整毛玻璃效果。
- 设计系统提供的 Glass 参数是默认强度，不是唯一固定值。允许根据设计稿、背景内容复杂度和毛玻璃效果需求调整模糊与透明强弱。

#### 通用边界

- 阴影用于表达层级、悬浮关系或边缘分离，不作为装饰性描边替代品。
- 卡片 Hover 可按交互需求使用 `shadow-down` 作为动态反馈，但不是所有卡片的默认必备效果。
- 同一容器不叠加多个未定义阴影效果。
- Glass 效果必须确保内容文字和图标仍具备足够对比度；复杂底图上优先提高填充不透明度，而不是随意改变文字语义色。
- 在性能敏感、内容密集或大面积滚动区域，不默认使用大面积实时毛玻璃；是否使用由具体设计稿决定。

### 字体 Typography

#### 字体家族与内容边界

- UI 字体从用户本机读取，并在页面级选择一套完整配对：苹方 + SF Pro、微软雅黑 + Arial、思源黑体 + Source Sans Pro。不得只替换中文或西文字体中的一方。
- GJType 是国金版权数字字体，但属于受限组件字体，不是所有金融数字的默认字体。
- 仅 Metric、Gauge、Progress、Progress Ring 的核心指标允许使用 GJType；其它位置只因内容是金额、百分比或时间也不得调用。

#### 中文 Text Style 枚举

- `中文/S1-CN-S`：24/32，600；头部 Banner 级标题。
- `中文/S2-CN-S`：20/30，600；页面大标题。
- `中文/S3-CN-S`：18/26，600；重要模块标题、分组标题、区块标题。
- `中文/S4-CN-S`：16/24，600；模块标题、弹窗正文、卡片说明文字。
- `中文/S5-CN-S`：14/22，600；表格关键字段、列表重点信息、局部强调。
- `中文/S6-CN-S`：12/18，600；提示文字强调、加粗状态标签。
- `中文/S7-CN-R`：16/24，400；段落标题、弹窗正文。
- `中文/S8-CN-R`：14/22，400；默认正文、表格内容、表单内容、普通说明。
- `中文/S9-CN-R`：12/18，400；辅助说明、次要信息、提示文案、表格备注、标签。
- `中文/S10-CN-R`：10/14，400；最末级辅助信息、提示文案、备注。

#### 数字 Text Style 枚举

- `数字/S1-NUM-S`：36/44，700。
- `数字/S2-NUM-S`：30/38，700。
- `数字/S3-NUM-S`：24/32，700。
- `数字/S4-NUM-S`：20/32，700。
- `数字/S5-NUM-S`：16/24，700。
- `数字/S6-NUM-S`：14/22，700。
- `数字/S6-NUM-R`：12/22，400。
- 上述数字 Text Style 只供 Metric、Gauge、Progress、Progress Ring 按指标层级选用；存在样式不代表可在表格或普通图表中调用。

#### 使用与边界

- 优先绑定已存在的 Figma Text Style；不得仅凭视觉近似重命名字号等级。
- 字号、行高和字重作为一组使用，不任意拆开混搭。
- 中文标题、Tab、按钮和标签可按组件规范使用 500 Medium。即使当前通用 Text Style 枚举只有 400 与 600，组件已定义的 500 仍是合法字重。
- 同一信息层级保持统一 Text Style；颜色变化不等于文字层级变化。
- 大号数字只用于真正需要优先感知的核心指标，不能把普通表格数字放大成数据大屏风格。
- 白名单组件中的货币符号、正负号、小数点、百分号与核心指标作为整体使用相同 GJType 与字重；白名单之外整体使用 UI 字体。

- Text Style 是默认文字阶梯；具体设计稿明确出现例外时，以设计稿实例为准，但不得把单次例外扩展成新的全局等级。

### 布局 Layout

需要精确使用圆角、控件高度或间距变量时，读取 `tokens/dimensions.json`；其中 `usage` 用于选择档位，实际组合仍服从下述卡片层级和页面布局规则。

#### 屏幕宽度与断点

- 1440px 是默认设计基准，不是固定页面宽度。
- 最小支持视口暂定为 1280px。
- `pc.sm`：1280–1359，页面横向边距 16px；筛选项允许换行，数据表格允许横向滚动。
- `pc.md`：1360–1439，页面横向边距 24px；保持核心布局，可减少非核心列。
- `pc.lg`：1440–1919，页面横向边距 24px；使用默认完整布局，1536 只作为验证尺寸，不单设断点。
- `pc.xl`：1920–2559，页面横向边距 32px；优先增加有价值的信息或列，不无限拉伸组件。
- `pc.xxl`：2560 及以上，页面横向边距 40px；内容最大宽度 1920px并居中。
- 优先使用弹性布局；只有布局结构确实发生变化时才使用视口断点。

#### Grid Style 枚举

- `column-L0`：页面级，10 列，列间距 20px，边距 16px。
- `column-L1`：一级卡片，8 列，列间距 16px，边距 20px。
- `column-L2`：二级卡片，6 列，列间距 12px，边距 16px。
- `column-L3`：三级卡片，4 列，列间距 12px，边距 12px。
- Grid 的层级名称表达容器层级，不等同于组件尺寸等级。

#### 内容间距阶梯

- 页面结构、卡片间距、容器内边距和内容间距使用 4px 倍数。
- 标准阶梯：`4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48`。
- `2 / 6 / 10 / 14 / 18` 仅用于视觉校准、紧凑控件、图标文字对齐、描边补偿或受限组件尺寸，不用于主要页面结构。
- 1px 只用于描边和分割线，不作为布局间距。
- 4px 通常只用于最小内部关系，不作为常规大段垂直间距。

#### 卡片层级枚举

- L1：间距 16px，内边距 20px，默认无描边；页面主要内容区、核心业务模块。
- L2：间距 12px，内边距 16px；一级卡片内的功能分区。
- L3：间距 8px，内边距 12px；信息分组、列表模块、小型内容区。
- L4：间距 8px，内边距 8px；局部信息块、轻量嵌套区域。

#### 组合与边界

- 卡片层级由信息层级决定，不按视觉外观或嵌套次数机械判断。
- L1 不得仅为强化“卡片感”而添加浅灰描边；优先用页面灰背景与白色容器、留白和圆角完成分层。描边例外必须能说明具体的识别、选择、交互或背景对比需求。
- 同一视觉层级、同一操作组或同一表单行中的 Button、Input、Selector、DatePicker 等交互组件，默认使用同一 Small、Medium 或 Large 尺寸档位，并保持可见控件高度一致。尺寸由父级组合或场景层级统一决定，不由每个子组件分别猜测。
- 不得为了填满容器、容纳局部文案或修补布局而在同一组内混用尺寸；空间不足时应先换行、调整宽度或优化信息结构。
- 表格行级操作、分页紧凑控件等具有独立组件层级时，可按自身 contract 使用不同尺寸，不视为与页面级操作混用。具体设计稿明确区分主次尺寸时可以保留，但必须确保同一行的基线、热区和视觉节奏合理。
- 同一组卡片默认保持横向和纵向间距一致；强纵向阅读场景可让纵向间距大一个阶梯，但模块内必须一致。
- 不同层级卡片相邻时，间距由共同父容器或较高层级决定，禁止双方外边距叠加。
- 标题到内容的距离独立设置，不通过放大整张卡片内边距来制造距离。
- 列表、表格和图片可按组件需求局部贴边，但标题和主要文字仍与内容基线对齐。
- 嵌套卡片内边距通常应小于外层，且不得小于 8px。
- 空间不足时先调整信息结构、换行或列展示，再考虑压缩间距。
- 弹窗、抽屉、浮层和表格容器优先服从自身组件规则。

- 小于 1280px 时不承诺完整响应式重排，但必须保证核心内容和关键操作可访问。允许按需要使用局部或整页横向滚动，不得直接裁切、遮挡或隐藏关键内容。

### 圆角 Radius

#### 变量枚举

- 常规圆角变量：4px、6px、8px、12px、16px、24px、999px。
- 4px、6px、8px、12px 构成常规组件与卡片层级的主要阶梯。
- 16px 是 PC 网页中用于增强风格化的大圆角，可在有明确设计需求时少量使用。
- 24px 主要用于大型弹窗、Banner、营销模块或强风格化容器，通常不用于常规 B 端卡片。
- 999px 用于 Pill、胶囊按钮、圆形标签等需要完全圆角化的组件。

#### 卡片层级默认值

- L1：12px，`Radius/Radius-LG`；页面级容器、核心内容区或视觉权重最高的大型卡片。
- L2：8px，`Radius/Radius-MD`；一级卡片内的功能分区、主要模块或常规业务卡片。
- L3：6px，`Radius/Radius-SM`；信息分组、小型内容卡片、列表项或局部操作区。
- L4：4px，`Radius/Radius-XS`；尺寸较小、层级较深的容器或最小常规元素。

#### 组件默认值

- Large Button：8px。
- Medium Button：6px。
- Small Button：4px。
- 组件尺寸名称不能单独决定圆角；若具体设计稿实例不同，以实例为准。

#### 优先级与边界

1. 具体设计稿实例。
2. 组件自身规则。
3. 卡片层级默认值。
4. 通用圆角变量建议。

- 同一页面中，相同层级和功能的卡片应保持圆角一致。
- 嵌套卡片圆角不应大于外层，通常逐级减小。
- 弹窗、抽屉、Popover、Banner、品牌模块、营销模块和强调型特殊组件不机械套用卡片层级，以具体设计需求灵活调整。
- 设计稿实例出现 Small 组件使用 8px 等情况时，必须保留实例圆角，不强制改回默认 4px。

## 工程实现踩坑记录

以下是在构建组件工作台（可交互代码预览站点）过程中实际踩过的坑，此前只记录在本地 AI 协作工具（WorkBuddy）的会话记忆里，没有进入本文件；为避免换一个不共享该记忆的 AI 会话重新踩同样的坑，统一迁移收录于此（2026-09-08）。

### 图标渲染

- **`mask` 简写会重置 `mask-image`**：在已绑定 `mask-image:url(...)` 的图标元素上，若再用 `mask:center/contain no-repeat` 之类的简写补充位置、尺寸或重复模式，会把前面设置的 `mask-image` 一并重置为 `none`，图标退化成一个纯色色块（通常表现为 16×16 的 `currentColor` 实心方块）。需要在已有 `mask-image` 的元素上追加位置/尺寸/重复模式时，只用 longhand（`mask-position` / `mask-size` / `mask-repeat`，并各带一份 `-webkit-*` 前缀），禁止在同一元素或更具体的子规则里再写 `mask:` 简写覆盖。
- **Glass Icon 的 `backdrop-filter` 经 `<img>` 加载 SVG 会丢失**：Figma 的 Glass Icon 用 `foreignObject` 实现毛玻璃效果，但 Chrome/Safari 通过 `<img>` 标签加载这类 SVG 时会丢弃其中的 `backdrop-filter`，只剩下纯色背景。Glass Icon 必须**烘焙成 PNG** 后再使用（可用 Chrome headless 批量截图 + PIL 切图批量处理），不能以 SVG 形式通过 `<img>` 引入。（2026-09-09 补充）用 Playwright/Chromium 141 实测过：把同一份 SVG 原始标签直接内联进页面 DOM（而不是通过 `src=` 引用外部文件），`backdrop-filter` 是能生效的——内联渲染下"玻璃盖子"能正确透出下方色块的颜色，效果接近烘焙好的 PNG；只有经 `<img src>`/`background-image`/`mask-image` 这类"外部资源"方式加载时才会必然丢失，因为浏览器会把外部引用的 SVG 当作已栅格化的静态图片处理，内部读不到"背后"的内容。但内联方案最终没有采用，原因：这批 Glass Icon 的实际使用场景固定是干净的白色背景（宫格导航、入口卡片），需要的是可预测、跨页面一致的固定视觉效果，而不是"透出背后真实内容"的动态玻璃；内联 backdrop-filter 还依赖较新的浏览器支持、且效果会被祖先节点的 `transform`/`filter`/`contain`/`overflow:hidden` 等建立层叠上下文的样式意外裁断，稳定性不如烘焙好的 PNG。综合评估后维持现状结论：Glass Icon 继续用 PNG 展示、SVG 仅留作源文件，不改造成内联方案。


### 组件交互预览页的卡片层级

以下约定针对「单组件产物」里可交互代码预览页（组件工作台/preview 站点）的 DOM 视觉层级，与「基础规范 > 布局 Layout > 卡片层级枚举」描述的 L1–L4 生产页面卡片体系是两套规则，不要混用：前者限制预览页容器嵌套的视觉层数，后者是设计系统本身面向生产页面的信息层级间距规范。

- 预览页的视觉层级（按可见边框/背景计）最多 3 层，超过就是"套盒"，必须拍平。
- 第二级区块（如 `.panel`、`.demo-card`，对应"基础用法""规格"等分区）才是带边框的卡；其内部的"次级容器"算作第三级。
- 第三级区块一律从"卡片"框架中释放：不加 `border` / `border-radius` / `background` / `padding`，除非该组件页面特别指定。典型例子：`.variant-box`、`.scene`、`.tabs-card`。
- 夹在二级卡和三级内容之间的通用包裹层（如 `.demo-stage`）同样不加边框/圆角/背景，只保留 `padding` 和 `overflow`，否则会多套出一层假卡片。
- 例外：交互面板的画布（例如 `.lab` 虚线预览框）属于功能性"画板"，可以保留一层边框；其上下不再叠加额外的"卡片容器"。

### 交互属性面板的 CSS Grid / 选择器踩坑（2026-09-08）

在一次"更新全局组件引用规则"后，多个 preview 页面出现了控件重叠、tab 溢出容器、checkbox 尺寸异常等视觉回归；逐一用 Playwright 实际渲染 + 计算样式定位后，发现是同一类根因反复出现，记录如下，便于以后新增/重构 preview 页时预先规避：

- **`grid-column` 只对 Grid 容器的直接子元素生效**：若给某个非直接子元素（如嵌套在 `.field` 里的 `.gj-tabs`）写 `.control-fields .gj-tabs{grid-column:1/-1}`，选择器语法不会报错，但完全不会生效——因为 `.gj-tabs` 是 `.control-fields` 的孙子节点而非子节点。表现为该元素仍按原网格列宽渲染，内容过宽时会直接溢出并盖住相邻单元格。正确做法是让"要跨列"的那个直接子元素自己携带一个如 `full` 的标记类，样式写在 `.control-fields .field.full{grid-column:1/-1}` 上，并在 HTML 里给对应的 `.field` 补上 `full` class（本项目已有的可复用约定，`preview/steps`、`preview/empty` 等页面一直是这样写的）。**但要注意：CSS Grid 的 `justify-items` 默认值是 `stretch`，给 `.field` 补上 `full` 后，`.field` 内部本身也是一个（隐式单列）Grid 容器，它的子元素默认也会被拉伸到和 `.field` 一样宽**——像 `<select>`/`<input>` 这类本来就该 `width:100%` 的控件没问题，但像 `.gj-tabs`（分段控件，自带背景/圆角/阴影）这种应该按内容自适应宽度的控件，被拉伸后会出现"胶囊背景撑满一整行、后面一大截空白"的视觉问题。**这个坑后来发现不止出现在 Grid 场景**：同一个 `.gj-tabs-button`（分段控件）在 `preview/cascader`、`preview/date-picker` 里分别是被塞进纯 `block` 容器、`grid` 容器，表现同样是"撑满"，说明根因是控件自己没有声明宽度，而不是某一种布局方式特有的问题。**最终的正确修法是直接在共享组件库 `assets/styles/gj-b2b-components.css` 的 `.gj-tabs-button`（含 `.gj-tabs-pill`）规则上补一条 `width:fit-content`，而不是在每个 preview 页面的局部 `<style>` 里各自加 `justify-self:start` 之类的覆盖**——因为每个 preview 页面的 `<control-fields>`/`.field` 等布局类都是页面各自独立手写的，同一个 bug 在不同页面的父容器可能是 grid、flex 或普通 block，页面级修法只能堵住当次遇到的那种布局，堵不住其余页面；只有把宽度声明写在 `.gj-tabs-button` 自己身上才能一次性覆盖全站所有引用点。给 `.gj-tabs`（基础/下划线样式）另外加了 `justify-self:start` 作为兜底，防止它意外出现在别的 Grid 容器里被拉伸，但基础样式没有加 `width:fit-content`，因为不确定是否存在需要撑满容器的下划线式页面级 Tab 导航用法，留待真的出现类似问题时再确认。
- **响应式断点里的覆盖规则，在桌面宽度下不会生效**：同样是"跨列不生效"的变体——如果这条 `grid-column` 规则被误写在了 `@media(max-width:900px)` 里，那么它只在窄屏下才会应用，桌面宽度（如 1440px）下这条规则根本不会被求值，问题会一直存在。跨列这类"结构性"修复要写成无条件规则，不要放进响应式断点。
- **通用的 `.field input{width:100%;height:36px;...}` 选择器会连带覆盖被套进 `.field` 容器里的 checkbox**：一些页面为了复用 `grid-column:1/-1` 的跨列能力，把 checkbox 的外层 `<label>` 也加上了 `field`（或 `field full`）class（例如 `<label class="switch field full">` / `<label class="check field full">`）。这样一来 `.gj-checkbox`（本身定义为 16×16）就变成了 `.field` 的后代，会被更高特异性的 `.field input{width:100%;height:36px;...}` 规则覆盖，渲染成又宽又高的方块。修复方式是把该通用规则改成 `.field select,.field input:not(.gj-checkbox){...}`，明确排除 checkbox；不要靠调整 HTML 结构去绕开，因为跨列需求可能还会继续复用 `field` class。
- **照抄别的页面的 CSS 规则时，必须连同它所在的 `@media` 包裹一起抄，否则会在不该生效的宽度下意外生效（2026-09-09）**：给 `preview/button`、`preview/divider` 补页面头部（`.intro`）时，发现这两个页面的 `.shell` 只有一条 `padding:0`／无 padding 的规则，和站内其余页面统一使用的 `.shell{padding:var(--docs-page-padding)}` + `.shell{padding:var(--docs-page-padding-compact)}` 两段式写法不一致，于是照着 `preview/cascader`、`preview/date-picker` 把这两条规则原样搬了过去。但第一次搬运时只搬了这两条声明本身，漏看了源页面里第二条（compact）规则其实是包在 `@media(max-width:650px){...}` 里的——也就是说桌面宽度下页面应该始终是 32px（`--docs-page-padding`）的大边距，只有窄屏才收紧到 16px（`--docs-page-padding-compact`）。规则搬到 button/divider 后因为没带上这层 `@media` 包裹，变成在任何宽度下都无条件用 16px 覆盖 32px，导致这两页在桌面宽度下的左右页边距比其余页面明显更窄，是用户直接肉眼对比发现的。修复方法是把 compact 规则重新包回 `@media(max-width:650px){...}` 里，和源页面保持完全一致。**教训**：复制一条 CSS 规则时，不能只看规则本身的选择器和声明，还要往上追溯它是否处在某个 `@media`/`@supports` 等条件块内；条件块决定了规则的实际生效范围，漏抄或错抄都会造成"选择器本身没写错、但生效条件变了"的隐蔽回归，必须在目标视口宽度下用 Playwright 实测（而不是只 diff 文本）才能发现。
- **排查方法**：这类问题仅靠读 CSS/grep 很容易漏判（选择器语法本身没有错，只是不生效或作用域不对），必须用 Playwright 之类工具实际渲染页面、读取 `getBoundingClientRect()` / `getComputedStyle()` 实测尺寸和位置，才能确认根因；修完后也要重新截图/测量验证，不能只看 diff。

这条结论已经固化成生成任一页面模式、组件预览页或业务原型后**必须执行**的验证协议，见 `generation-verification.md`（`library-index.json#aiWorkflow.core.generationVerification`），不再只留在这里的事后记录里；其中内容溢出、包围盒重叠、间距阶梯、Icon 与文字同色、同行控件高度一致性五类可以用 `scripts/verify-page.mjs` 自动化辅助检查。

## 通用组件规则

### 组件优先门禁

- 页面生成前从 `library-index.json#aiWorkflow.components` 进入组件子索引；命中组件后继续读取对应 contract 和组件 Token，并引用全局组件实现。组件预览仅在人工验收时按 `humanPreviewSite.componentPagePattern` 打开。
- 已有组件不得在页面 CSS 中重新实现，即使重写结果使用了完全相同的语义 Token。
- 只有 inventory、contract、preview 和当前 Figma 节点均未找到对应组件时，才允许按 Token 实现兜底；可复用实现必须进入全局组件层，并记录组件库缺口。
- 页面验收必须扫描原生表单控件、`appearance:none`、非组件视觉类和页面级交互状态，发现可映射到已有组件时退回整改。

> 各组件专属规则已拆分至 `references/components/<组件目录>/rules.md`：Button、Text Button、Divider、Icon、Tag。

## 导航组件规则

> 各组件专属规则已拆分至 `references/components/<组件目录>/rules.md`：Sidebar、Navbar、Tabs、Breadcrumb、Carousel、Pagination、GridNav。

## 信息录入组件规则

> 各组件专属规则已拆分至 `references/components/<组件目录>/rules.md`：Input、Checkbox、Radio、Switch、DatePicker、Form、Selector、Dropdown、Cascader、Search、TimePicker、Input Number、Upload、Image。

## 信息展示组件规则

> 各组件专属规则已拆分至 `references/components/<组件目录>/rules.md`：Table、Avatar、Badge、Empty、Steps、Timeline、Metric、Chart。

## 操作反馈组件规则

> 各组件专属规则已拆分至 `references/components/<组件目录>/rules.md`：Toast、Modal、Notification、Popover、Drawer、Skeleton。

## 规则记录模板

后续每个组件统一补充以下内容，但只记录影响设计判断的信息：

- 用途与不适用场景
- 属性枚举与默认值
- 尺寸枚举
- 状态枚举
- Token 与文字样式引用
- 属性依赖与互斥
- 内容边界与异常状态
- 组合规则
- 设计稿实例覆盖规则
- 待确认问题
