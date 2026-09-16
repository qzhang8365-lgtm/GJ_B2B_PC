---
name: gj-b2b-pc-design-system
description: 使用国金 PC 端 B 端设计系统的设计 Token、组件规则、图标资源与页面模式，生成、检查或说明 B 端页面及高保真原型。适用于页面结构设计、组件选择、设计还原和设计交付；不假定或虚构具体前端组件库 API。
---

# 国金 PC 端 B 端设计系统

## 目标

依据本地设计系统生成或检查 PC 端 B 端界面。优先复用现有设计 Token、组件和图标；不创造未经确认的视觉规则，也不把示意代码描述成真实组件库 API。

## 权威边界

- Figma 是视觉值、组件属性、状态和变量的设计真值。
- `references/` 保存已确认的本地规则和结构化数据；`assets/` 保存生成结果可直接引用或复制的资源。
- `preview/` 是人工浏览与交互验收站，不是生产组件源码。
- 真实组件实现、事件接口、无障碍能力和发布版本由前端组件库确定。
- 信息缺失或不同来源冲突时，标记为“待确认”，不得自行补造设计真值。

## 工作流

1. 明确页面目标、使用角色、核心任务和信息优先级。
2. 读取 `references/library-index.json`，只从 `aiWorkflow` 分支按需解析规则、页面模式、Token、组件和图标入口；不把 `humanPreviewSite` 或 `scripts.previewRuntimes` 当作设计真值。
3. 从 `aiWorkflow.core.pagePatterns` 选择最接近的页面骨架，并读取 `aiWorkflow.core.pagePatternMetadata` 中该模式的任务目标、布局骨架、必选/可选组件、状态、响应式、交互、数据口径和文案约束；再读取 `aiWorkflow.tokens.unified` 使用统一设计 Token。页面涉及已工程化组件时，按 `componentTokenPattern` 定位文件，并使用对应 `component.<name>.tokens` 和 `stateMatrix`，不得从文字规则临时猜测状态值。
4. 先从 `aiWorkflow.core.coverage` 查看目标组件的覆盖行，一次确认叙述规则、结构化契约、组件 Token 和预览页状态；再从 `aiWorkflow.components` 指向的组件子索引查询组件，由其 `schemaRegistry` 定位对应 `schema.json`，按需读取同目录资源。不在 `SKILL.md` 维护第二份组件路径或状态表。
5. 从 `aiWorkflow.icons` 指向的图标子索引先判断类型，再按其 catalog 打开对应 manifest 并解析资源路径。`library-index.json` 不重复图标清单。不得使用 Emoji、临时 Unicode 字符、CSS 手绘或清单外名称。
6. 检查层级、间距、状态、异常内容、响应式和组件组合关系。
7. 输出结果前按本文件的自检清单复核。

## 按需读取

- 颜色、字体、效果、栅格、断点、圆角等全局规范：读取 `references/design-system-rules.md` 中的相关章节。组件详细规则（用途、属性枚举、组合规则、边界）：读取 `references/components/<name>/rules.md`；design-system-rules.md 里的组件章节现在只是指向对应 rules.md 的重定向，不重复正文。
- 完整统一 Token：从 `references/library-index.json` 的 `aiWorkflow.tokens.unified` 定位，不另行猜测文件名。
- HTML/CSS 原型：按 `references/library-index.json` 的 `outputAssets.styles.loadOrder` 顺序加载工作流 CSS，页面基础组件必须优先使用其共享 `gj-*` 静态组件类。需要人工预览交互增强时，才按 `scripts.previewRuntimes` 登记加载脚本；这些脚本不是生产组件库源码。
- 规范站外壳：仅维护规范网页时读取 `references/tokens/docs-site.tokens.json`；其中 `--docs-*` 禁止用于业务产品页面。
- 页面结构与组合：从 `aiWorkflow.core.pagePatterns` 读取文字规则，并从 `aiWorkflow.core.pagePatternMetadata` 读取所选模式的结构化元信息。生成前必须逐项解析十个字段，未知业务信息标记“待确认”，不得留空后自行补造；只在需要人工视觉验收时打开 `humanPreviewSite.entryPoints.pagePatterns` 及对应页面。页面模式不得重新并入组件工作台。
- 图标查找：始终从 `aiWorkflow.icons` 指向的唯一图标索引进入；具体 catalog、manifest、资源根目录和 System 源 SVG 审计关系均由图标子索引维护，`SKILL.md` 不再复制该清单。
- 组件预览：在 `preview/` 查找对应组件页面，仅用于理解和验收。
- 术语与前缀速查：遇到不熟悉的 Token 前缀、状态取值枚举或文件缩写，先查 `GLOSSARY.md`，不在 `SKILL.md` 或各组件 `rules.md` 里重复解释；`GLOSSARY.md` 与正文冲突时以正文为准。
- 待确认项总览：读取 `references/audit-tracker.md`。各组件与 Token/Styles/Icon 的 `audit.md` 保存证据详情，跟踪表是开放项、优先级和状态的唯一汇总入口；处理或关闭审计问题时必须同步两处。禁止整份 Read 该文件；按组件代号或问题 ID（如 `AVT-`、`TBL-`）定点检索命中的行及其上下文，只加载命中条目。
- 组件覆盖度：从 `references/library-index.json#aiWorkflow.core.coverage` 读取可机读看板。它是每次补组件前的检查入口；组件产物变更后运行 `scripts.coverageBuild`，不手工修改其组件行。查询时按目标组件名过滤 `components` 数组中的对应条目（如用 `jq`/脚本检索），不得整份 Read `coverage.json`。
- 生成后一致性验证：从 `references/library-index.json#aiWorkflow.core.generationVerification` 读取 `generation-verification.md`。任何新生成或修改的页面模式、组件预览页或业务原型交付前，都必须按该文件的方法和检查清单核查内容溢出、尺寸准确性、Icon 颜色、间距四类高频问题，不得只凭读代码或肉眼看一次截图判断。

不要一次性读取全部参考文件。只加载当前页面和组件真正需要的部分。

## 组件实现与引用协议

本协议适用于 Button、Input、Selector、Checkbox、Radio、Switch、Tabs、Carousel、Pagination、Table、Dropdown、Cascader、Date/Time Picker、Upload、Modal、Popover、Drawer、Toast、Sidebar 等所有具有属性、状态或交互行为的组件。

### 实现前：建立组件契约

0. 先执行组件查询门禁，不得直接从页面截图开始写 CSS：
   - 先读取 `references/library-index.json` 的 `aiWorkflow.core.coverage`，检查目标组件的 `needs`；再从 `aiWorkflow.components` 进入组件子索引，查询组件类别；
   - 命中后按子索引的 `schemaRegistry.executionOrder[].path` 读取唯一 `schema.json`，再按需读取同目录 `rules.md`（用途、属性枚举、组合规则、边界）、`mapping.json`、`audit.md`、对应组件 Token；人工视觉验收时再根据 `humanPreviewSite.componentPagePattern` 打开预览页。不得再查询或新建扁平组件契约；
   - 高频组件 Button、Text Button、Input、Table、Selector、Dropdown、Checkbox、Radio、Switch 还必须读取 `references/tokens/components/<name>.tokens.json`；其 `stateMatrix` 是本地代码生成的状态值入口，不允许被页面 CSS 或经验值覆盖；
   - `schema.json` 的 `source.status=rules-derived` 表示门禁已有机器契约但 Figma 全量抽取仍待完成；`inventory-only` 只允许识别组件存在并阻止误推断，实施前必须读取 Figma，不得把空属性补成经验值；
   - 页面必须引用或组合全局组件基座中的实现，禁止在页面 CSS、页面脚本或业务组件内复制其结构、尺寸和状态；
   - 只有 inventory、contract、preview 与当前 Figma 组件节点均未查询到对应组件时，才允许基于语义 Token 新建实现，并明确记录“组件库未收录”及查询范围；新增的可复用实现进入全局组件基座，不留在单个页面中。
1. 产出《本页用料清单》，作为写 CSS/代码前的强制中间交付物：逐项列出当前页面实际使用的组件（含 `variant / size / state / icon / disabled / loading` 等属性）、需要引用的图标、以及需要点名到具体色阶的关键颜色；每一项标注库内确切引用——组件对应 `references/components/<name>/schema.json` 的组件名与命中状态，图标对应 `icons/index.json` 命中的图标 key，颜色对应命中的语义 Token 名。查不到确切引用的项标记「⏳待补」并注明已查询范围（inventory/contract/preview/Figma），不得以视觉近似代替枚举，也不得跳过未查到的项直接开始实现。清单里出现「⏳待补」，代表对应查库工作尚未完成，需先补齐查询或明确记录「组件库未收录」，才能进入下一步。
2. 按以下优先级读取依据，前者覆盖后者：
   - 当前业务设计稿中明确使用的 Figma 组件实例；
   - `references/tokens/components/` 中的组件 Token 与状态矩阵；
   - `references/components/` 中对应的 contract、schema 和 mapping；
   - `references/components/<name>/rules.md` 中对应组件规则；
   - `preview/<component>/` 中已经验收的视觉与交互表现。
3. 页面模式和业务样板优先选用已维护组件，并负责组件组合、顺序、间距和场景；不得覆盖所复用组件自身的尺寸、圆角、字体、颜色或状态定义。
4. 现有组件不能覆盖真实业务需求时，允许补充有明确语义的组合或扩展实现，并将可复用部分回收到共享组件层。某组件缺少结构化 contract 或状态值时，必须读取其 Figma 组件节点或标记“待确认”；不得从相似组件、组件名称或单张截图推测。
5. 一级背景卡片默认不使用描边，通过页面背景与 `Background/Container` 的明度差、间距和圆角建立层级，以减少页面束缚感。不得因为“卡片通常有边框”而自动添加 `Border/default`；只有同色背景无法分层、明确的可选择/交互状态，或具体设计稿明确要求时，才允许使用有语义的描边例外。二、三级模块卡片和组件容器仍按各自规则决定是否使用描边。

### 实现中：逐状态映射

- 先为每个交互组件形成状态矩阵，再写 CSS 或代码。至少核对适用的 Default、Hover、Focus-visible、Pressed、Selected/Checked、Indeterminate、Disabled、Loading、Error、Empty 和 Completed。
- 每个状态分别映射 background、text/icon、border、shadow、opacity、cursor 和 motion；未变化的属性也应确认是继承，而非遗漏。
- Disabled 必须先查询组件是否发布了对应 variant/state：已发布时完整使用其 background、text/icon、border、opacity 等定义，不得再叠加通用透明度；只有 Figma 与本地组件契约均未设置 Disabled 的情况下，才允许用“组件最外层 `opacity: 50%` + 禁止交互”作为统一兜底。组合组件只在最外层应用一次，禁止父子透明度叠乘。
- 尺寸必须引用对应 size Token。默认使用组件 contract 声明的默认尺寸；当前 PC 组件通常为 Medium，但不得用这一经验覆盖组件自己的默认值。
- Sidebar 栏宽全量使用组件母版 Token：展开 `--ds-component-sidebar-column-width`（200px）、收起 `--ds-component-sidebar-column-collapsed`（56px）。禁止按视口改成 208/240/288 或收起 64/80。SideBar 页标注表 `layout.sider`（Figma `3987:994`）不是设计真值，不得写入 layout Token 或页面壳。
- 页面壳中的 Sidebar 必须加载唯一共享运行时 `assets/scripts/gj-sidebar.js`：折叠按钮真实切换 200/56 两态并同步可访问属性，禁止只展示无行为的折叠图标或在各页面复制事件脚本。五个页面模式的切换入口统一放在 Sidebar，当前页保持选中；收起后仍保留带完整名称提示的图标入口。
- 同一视觉层级、同一操作组或同一表单行中的交互组件，默认必须使用同一尺寸档位，并保持可见控件高度一致。父级组合应先确定一次尺寸，再传递给其中的 Button、Input、Selector、DatePicker 等组件；不得为填补空间、容纳文字或局部排版方便而混用 Small、Medium、Large。只有组件 contract 明确规定的内嵌尺寸、明确的主次层级差异或具体设计稿实例可以例外，且例外不得造成同一行基线或高度失齐。
- 组件图标优先使用 `currentColor` 继承当前状态文字色；多色业务图标例外必须有明确设计依据。
- 组件基础类只实现一个明确层级或变体；Primary、Secondary、Tertiary 等修饰类必须覆盖各自完整状态，避免通用 `:hover` 或 `:active` 泄漏到其他变体。
- 页面 CSS 只负责布局、宽度、位置和组件之间的间距。禁止通过页面选择器修改 `gj-*` 组件内部的 height、padding、radius、font、color、background、border、shadow 或状态样式。
- 若必须实现设计稿中的实例级例外，使用单独且有语义的 override 类，注明 Figma 节点，并避免修改全局组件基座。
- Tabs 作为具有固定交互高度的组件时，必须区分“组件视觉/点击高度”和“页面布局占位高度”。当横向 Tabs 位于有内边距卡片的左上方、且上方没有标题或其他内容时，使用组件基座提供的卡片顶部布局变体（静态参考为 `gj-tabs-card-top`）压缩布局占位；不得直接缩小 Tab 项的高度、内边距或点击区域，也不得通过减少卡片上内边距补偿。
- 页面中的 Selector 必须引用共享 Selector Trigger，并由 Dropdown 规范提供展开面板；不得把浏览器原生 `<select>` 直接作为可见组件。原生控件可以保留为同步表单值或无脚本降级，但可见层必须覆盖组件库的尺寸、箭头资源、展开、选中、聚焦、禁用、关闭及键盘交互。
- Selector 的空值文案是 Trigger Placeholder，不是 Dropdown Option。空值 `<option>` 可以作为原生表单占位源，但生成可见菜单时必须过滤，且不得参与焦点移动、选中、勾选或选项计数；过滤后仍须使用原生索引映射同步真实值。
- 所有弹出式选择菜单必须直接组合全局 Dropdown 容器与 Dropdown Item（静态参考为 `gj-dropdown / gj-dropdown-item`）。Selector、Cascader、Tree Selector、Date/Time Picker 及其他选择类组件不得创建各自专用的菜单容器、选项尺寸或 Hover/Selected 状态；它们只负责触发器、数据模式和选择逻辑。
- 在表单或查询区中，Cascader 必须以 Selector Trigger 作为可见入口，展开面板必须默认隐藏并以浮层打开。禁止为增加组件覆盖而把 Cascader、Dropdown、Date/Time Panel 或其他弹层常驻在页面流中。选择后应回填触发器；点击外部和 `Escape` 必须关闭并恢复焦点。
- Dropdown 单选模式必须保证唯一 Selected，且只有唯一 Selected 可显示勾选图标；基础图标样式不得覆盖 `hidden`。Focus/Hover/Active descendant 只表示当前位置，禁止与 Selected 共用状态类、背景语义或选中图标。单选更新必须依次清除旧值、设置新值、同步触发器及表单值、发出 Change、关闭并恢复焦点。验收时分别检查鼠标选择、方向键/Home/End、Enter/Space、Esc、Tab、点击外部、外部值同步及重新打开后的焦点恢复。
- 每次更正组件实现前，必须先扫描该组件在页面脚本、共享运行时、内联脚本、旧样式文件和加载入口中的全部实现，识别重复初始化、遗留事件监听、旧状态类与缓存版本引用。修复时删除或迁移旧实现，只保留一个权威运行时；禁止在旧实现仍会执行时叠加第二套修复。完成后必须验证每个组件实例只初始化一次、DOM 只生成一套可见结构、旧脚本不再加载，并通过实际交互确认状态没有被旧 CSS 或旧监听器覆盖。
- 表单栅格必须使用 `minmax(0, 1fr)`，每个 Form Item 和控件容器必须允许收缩（`min-width: 0`）；Input、Selector、Textarea 等同列控件默认占满列宽，不得在初始化时把响应式宽度固化成像素值。同一行控件以控件顶部对齐，Help/Error 文本只能增加该字段自身高度，不得推移相邻控件。可用宽度不足时按已定义断点减少列数，禁止让组件溢出卡片。
- Input 的共享基座为 `gj-field` + `gj-input-wrap`，图标、动作和计数使用 `gj-input-icon / gj-input-action / gj-input-count`；Form 的共享基座为 `gj-form-item` 及其布局、Label、Content、Help、Addon、Actions 修饰类。Form 必须把共享 Input 作为依赖组合，不得在规范页、模式页或业务页用 `.input / .form-item / .btn` 等页面私有类重画同一组件。
- 顶部导航必须组合共享 `gj-navbar` 基座及其 `gj-navbar-actions / gj-navbar-icon-group / gj-navbar-user` 子结构；横向菜单和浮层分别使用 `gj-navbar-menu-*` 与 `gj-navbar-dropdown-*`。禁止在规范页或模式页保留 `.navbar / .menu-item / .dropdown` 等私有复制实现。与完整 Sidebar 同时使用时，Navbar 默认关闭重复的 Logo 和横向 Menu，只保留按需启用的 Search、IconGroup、Avatar 等全局功能；这属于标准 Navbar 的属性组合，不得另画“简化顶部栏”。Navbar Search 必须组合共享 `gj-search-icon` 并引用图标库的 `icf_system_search.svg`，不得只留下输入框或用文本符号代替。
- 表单底部按钮组不得自动生成独立白色卡片、背景色、阴影或 Sticky 操作栏。多卡片表单将透明按钮组放在最后一张填写卡片之后并右对齐；只有一张填写卡片时，将按钮组放入该卡片内部的右下方。按钮组与字段内容保持明确间距，按钮本身继续引用 Button 组件。
- Table 操作列的表头文字、正文单元格及其文字/图标操作组必须统一居中对齐，不得贴左或贴右；文字操作必须使用 Small Text Button，并以 `--ds-component-button-group-gap-medium` 保持8px相邻间距，避免无可见内边距的中文操作文字粘连；16px图标操作使用12px间距，两类规则不得混用。操作列页面样式不得把按钮间距压缩为0。
- 页面中的表格必须优先组合共享 Table 组件，不得在页面 CSS 中重画表头背景、行高、单元格、固定列或排序/筛选图标。Table 默认使用 Medium；只有用户明确要求更紧凑或更疏松，或具体设计稿有依据时，才切换整张表格为 Small 或 Large。表头与所有数据单元格必须使用同一 Table 尺寸变体，禁止表头、普通行、固定列分别混用尺寸。排序与筛选必须调用 Table contract 指定的图标和状态，不得从图标库挑选近似图标代替。
- Table 外框和内部结构线必须分别引用 `Table/border` 与 `Table/divider`；当前 PC 模式两者都解析为 `Primitive/Neutral/N04`（`#EBEEF2`）。禁止在页面层用 `Border/secondary`、硬编码颜色或近似灰色替代。
- 五个页面模式的根容器使用 `width:100%`、`max-width:1244px`、`margin-inline:auto` 和四边 20px 页面边距，形成最大 1204px 内容区。响应式断点只允许调整栅格列数、模块堆叠、筛选换行和局部滚动，不得改变页面边距或最大宽度。

### 页面生成组件门禁

- 页面 CSS 仅允许页面壳、栅格、区域顺序、组件宽度、定位和组件间距；凡是具有独立 Figma 组件集或出现在组件 inventory 中的元素，都不得用原生 CSS 重画。
- 禁止以“已经使用语义 Token”为由跳过组件库。Token 是组件内部实现依据，也是组件库确实缺失时的兜底，不是组件替代品。
- 原生 HTML 元素可以作为语义、表单提交或无脚本降级层，但可见视觉和交互必须由已查询到的全局组件承担。例如原生 Checkbox、Select、Button 不得仅靠页面 CSS 伪装成组件。
- 模式页扩展组件覆盖时，必须先验证业务语义和默认状态：危险或不可逆操作的二次确认使用 Modal，不得为覆盖 Popover 而替换；弹层、骨架、空状态只在对应业务状态中出现，不得与正常内容同时常驻。
- 组件覆盖数量不是页面质量目标。新增组件前先回答“它是否完成当前业务任务、是否处于正确状态、是否放在正确层级”；仅为展示组件而增加字段、浮层、分割线、状态卡片或重复入口，视为门禁失败。
- 触发器与浮层必须分离：Selector、Cascader、Dropdown、DatePicker、TimePicker 等只在页面流中保留触发器，Panel/Menu 由交互打开并默认隐藏。不得把下拉窗、级联面板或日期时间面板当作常驻内容，也不得用页面 CSS 覆盖 `[hidden]`、`aria-hidden` 或组件关闭状态。
- 页面接入组件时必须同时核对共享样式、权威运行时及其依赖；一个组件实例只能由一套运行时初始化。修复或替换前先删除旧初始化、旧监听、旧状态类和重复 DOM 生成逻辑，禁止在遗留实现上叠加补丁。
- 页面首次渲染只展示正常业务默认态。Loading、Empty、Error、无权限、批量操作栏、确认层等条件态必须互斥且按状态切换；不得为提高覆盖率与正常内容同时出现。
- 优先用留白和卡片层级组织信息。Divider 只表示真实结构边界，不能作为填空或装饰；固定高度、巨大 `min-height`、空白占位和为贴合单张截图设置的 spacer 均不得用来制造版式。
- 生成完成后，逐项扫描页面中的非 `gj-*` 视觉类、`appearance:none`、原生交互控件及页面级 Hover/Focus/Selected 样式，并再次对照 inventory。命中已有组件即视为验收失败，必须替换后才能交付。
- 允许 Token 兜底时，交付说明必须列出：未命中的组件名称、已查询的 inventory/contract/preview/Figma 范围、创建的全局复用类，以及仍待设计系统补录的事项。
- 生成完成后还必须按 `references/generation-verification.md` 的“模式页扩展经验教训”和验证清单，完成默认态、组件来源、单一运行时、内容溢出、尺寸准确性、Icon 与文字同色、间距阶梯、浮层开合与响应式检查（可用 `node scripts/verify-page.mjs` 辅助渲染实测，而不是只读代码或看一次静态截图）；全部通过才算门禁完成。

### 实现后：交互验收

- 对每个组件逐一触发并核对所有适用状态，不得只检查静态 Default 截图。
- 同时检查鼠标、键盘焦点、原生 disabled 行为和必要的 ARIA；交互控件不得只依靠颜色传达状态。
- 检查父子状态联动，例如 Checkbox 全选/反选/Indeterminate、Radio 互斥、Tabs 单一选中、分页边界禁用、表单错误与字段定位、弹层打开/关闭与焦点返回。
- 检查组合状态，例如图标与文字同步变色、Loading 阻止重复提交、Disabled 不触发 Hover/Pressed、选中项变化后批量操作同步启用或禁用。
- 验收时同时比较结构化 Token、组件预览和目标业务页面；三者冲突时停止扩散该实现，记录冲突并按权威优先级处理。

## 全局硬规则

- 优先使用语义 Token；已有语义变量时不直接写 HEX、随意尺寸或近似阴影。
- UI 字体只调用用户本机字体，并固定成对使用：苹方 + SF Pro、微软雅黑 + Arial、思源黑体 + Source Sans Pro；同一页面不得任意混搭。Figma 字体仅作视觉参考。
- GJType 仅允许用于 Metric、Gauge、Progress、Progress Ring 的核心指标；表格数据、普通图表标签、日期时间、分页、Badge 和正文即使包含数字也必须使用当前 UI 字体配对。
- 默认设计基准宽度为 1440px；最低支持视口暂定 1280px，按已有 PC 断点适配。
- 页面结构和内容布局以 4px 倍数为基础，主要间距优先使用 `8 / 12 / 16 / 20 / 24 / 32 / 40 / 48`。
- 页面与组件优先复用现有模式；具体设计稿中的已确认实例可覆盖默认规则。
- 必须考虑 default、hover、focus、pressed、disabled、loading、empty、error 和无权限等与任务相关的状态。
- 不输出不存在的组件名、属性名、导入路径或包名。技术栈未指定时，输出设计中立的结构、HTML/CSS 原型或清晰伪代码，并标注前端映射点。
- Button 内的 Icon 必须使用 `currentColor` 与按钮文字保持同色，并随 default、hover、pressed、disabled、loading 等状态同步变化；不得保留 SVG 资源自身的固定填充色或描边色。静态 HTML 优先使用 CSS mask，前端 SVG 使用 `fill="currentColor"` 或 `stroke="currentColor"`。
- 内联 SVG 图表/图形元素禁止使用 `preserveAspectRatio="none"` 等会让内部文字、图标等内容随容器宽高比非等比拉伸变形的缩放方式；`viewBox` 宽高比与实际渲染容器不一致时，使用默认或显式的 `xMidYMid meet`（允许留白），或让 `viewBox` 动态匹配容器实际像素尺寸，不得整体非等比拉伸。

## 默认交付内容

除非用户指定其他格式，交付应包含：

1. 页面目标和核心任务。
2. 所选页面模式与信息层级。
3. 页面区域及组件清单（复用实现前产出的《本页用料清单》，标注库内引用或「⏳待补」）。
4. 关键交互、反馈和边界状态。
5. 使用的语义 Token 和图标资源。
6. 可供前端映射的结构或原型；不虚构真实组件库 API。
7. 尚需产品、设计或前端确认的问题。

用户只要求代码、审查或局部组件时，应聚焦其请求，不强制输出完整文档。

## 自检

- 是否使用了最匹配的页面模式，而不是简单堆叠组件？
- 是否已读取所选模式的十项元信息，并把业务缺失的数据口径或文案要求明确标记为“待确认”？
- 是否优先使用现有语义 Token、组件和图标？
- 是否处理了与任务相关的加载、空、错误、禁用、无权限和长内容状态？
- 是否为页面内每个交互组件读取了对应 contract/Token，并逐项验证其状态矩阵？
- 页面级 CSS 是否只负责组合布局，没有覆盖 `gj-*` 组件的尺寸、圆角、字体、颜色、边框和交互态？
- 是否验证了全选/半选、互斥选择、边界禁用、焦点、弹层关闭等父子或组合交互？
- 首屏是否只显示正常业务默认态，所有 Panel/Menu、Loading、Empty、Error、批量操作栏与确认层都按条件互斥显示？
- 是否为每个组件只加载一套权威运行时，并清除了旧初始化、重复监听、重复 DOM 与覆盖隐藏状态的旧 CSS？
- 页面中的 Divider、固定高度和空白占位是否都有真实结构依据，而不是为了填满页面或贴合单张截图？
- 是否符合 PC 端宽度、层级、对齐、间距和滚动规则？
- 是否按 `references/generation-verification.md` 完成了内容溢出、尺寸、Icon 颜色、间距四类生成后验证，用渲染实测代替了单纯读代码或看一次截图？
- 页面内每一处 图标+文字 组合的颜色是否逐一核对一致，尤其是 Button 的 Icon 是否随 default/hover/pressed/disabled/loading 等状态与文字同步变色？
- 页面内相邻元素间距是否都落在 4px 倍数阶梯（4/8/12/16/20/24/32/40/48）上，同层级重复出现的间距是否保持一致？
- Sidebar 是否误用了标注表 `layout.sider` 或 208/240/288、收起 64/80，而不是母版 200/56？
- 是否把待确认事项与已确认规范明确区分？
- 是否避免虚构前端组件库、API、依赖和设计变量？

## 维护

- 用户提出组件修改意见或规则调整时，必须先落到该组件规范层：`references/components/<name>/rules.md`、`schema.json`（必要时 `mapping.json` / `audit.md` / 组件 Token），再改共享 `gj-*` 基座。禁止只改模式页、预览页或页面私有 CSS。页面模式只记录组合，不保存可复用组件规则。
- 修改源 Token 后，运行 `node scripts/build-tokens.mjs` 重新生成统一 JSON 和 CSS。
- 运行 `node scripts/validate-tokens.mjs` 检查 Token、别名和 CSS 变量一致性。
- 不直接手工修改标记为派生产物的文件。
- `preview/*/index.html` 里对共享文件（`gj-b2b-tokens.css`/`gj-b2b-components.css`/`component-docs.css`/`data-table.css`/`font-runtime.js`）的引用一律不带 `?v=` 版本号，全站共用同一份浏览器缓存。不要在修某个组件时顺手给这几个共享文件的引用加专属版本号——历史上曾经这样做（如 `carousel-1`→`carousel-2`），导致同一份共享文件在 40+ 个页面下被切成了几十份互不相认的缓存，浏览器完全无法复用，实测切页会多出几百毫秒到一秒的等待。共享文件内容变更后如需要强制浏览器重新拉取，应统一在 Netlify 缓存策略（`_headers`）层面处理，不要靠改单个页面的引用字符串。
- 仓库配置了本地提交门禁（`scripts/git-hooks/`，`npm run install-hooks` 安装，等价于 `git config core.hooksPath scripts/git-hooks`）：提交前自动检查 JSON/CSS/HTML 结构完整性、`audit.md` 与 `audit-tracker.md` 是否同一提交同步更新、预览页/共享样式改动是否已按 `generation-verification.md` 完成渲染实测（`scripts/verify-page.mjs`），以及三项静态一致性检查——组件覆盖看板是否与实际文件同步（自动跑 `scripts/build-coverage.mjs --check`）、`references/components/` 下是否存在建好了但未在 `inventory.json` 登记的“孤儿组件目录”、组件 `rules.md` 里形如“8px（Radius/Radius-MD）”的标注是否与 `references/tokens/dimensions.json` 里的真实数值一致。命中明确违规会阻断提交；命中历史上已确认的合理例外类型（详见该脚本文件头注释）只提示、不阻断。紧急情况可用 `git commit --no-verify` 跳过，但应在提交信息中注明原因。
