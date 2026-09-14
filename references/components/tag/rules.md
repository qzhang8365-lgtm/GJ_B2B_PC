# Tag 标签

> 从 `references/design-system-rules.md` 拆分（2026-09-08）。跨组件的颜色/字体/布局/圆角等基础规范见该文件“基础规范”章节。2026-09-08 已完成真 Figma 审计（`figma-audited`），细节见 `mapping.json`/`audit.md`/`tag.tokens.json`；发现的问题登记为 TAG-001~005。

#### 用途

- Tag 用于标识、分类或突出信息属性与状态，帮助用户快速扫描内容。
- Tag 不是普通按钮；只有可删除、可添加或明确可选择的标签才具有交互行为。
- 当普通文字已经能清楚表达信息时，不为了装饰额外添加 Tag。

#### 属性枚举

- `size`：`Regular / Small`，默认 `Regular`。
- `style`：`Filled / Light / Line`，默认根据信息强调程度和所在背景选择。
- `color`：Blue、Neutral、Red、Green、Orange、Yellow、Cyan、Sky、DeepBlue、Purple、Pink。颜色是否承载语义由具体标签内容和项目规则决定。
- `shape`：`Default / Pill`，默认 `Default`。
- `icon`：`None / Icon`；图标必须来自图标库。Small 不支持 Icon。
- 动态标签可选支持 Add、Remove 与输入状态；这些行为不能自动应用到普通展示标签。

#### 尺寸与间距

- Regular：高度 22px，最小宽度 40px，横向内边距 8px，默认圆角 4px，文字 12/18、600，图标 12px。
- Small：高度 18px，最小宽度 36px，横向内边距 8px，默认圆角 4px，文字 10/14、400，不使用图标。
- Default Shape 使用 4px 圆角；Pill Shape 统一使用 999px 圆角（2026-09-08 设计确认，见 TAG-005；Figma 对 Regular 22px/Small 18px 两种高度实测的字面绑定值是 12px，与 999px 视觉等价，999px 是为与其它组件写法保持一致的实现决定）。
- Regular 标签组默认间距 8px；紧凑 Small 标签组可使用 4px。
- Tag 文字保持单行，不换行。
- Tag 文案建议 2–6 个字，原则上不超过 10 个字；超过时优先精简，必要时截断并由外围信息补充完整含义。

#### 风格规则

- Filled：最高强调，使用实色背景和反色文字。
- Light：中低强调，使用浅色背景和对应深色文字。
- Line：轻量边界，使用浅色底、对应色文字和描边。
- 默认 B 端页面优先圆角矩形；轻量风格页面或多类别并列时可使用 Pill，但同一标签组不无理由混用两种形态。
- 图标颜色跟随 Tag 文字颜色，只有图标表达独立状态时才允许使用不同语义色。
- 静态组件基座中，颜色与风格是两组独立的类：颜色用 `gj-tag-blue / -neutral / -red / -green / -orange / -yellow / -cyan / -sky / -deepblue / -purple / -pink`，风格用 `gj-tag-filled / -light / -line`，不写时按 Light Blue 渲染。尺寸用 `gj-tag-small`，形态用 `gj-tag-pill`。前置图标用 `gj-tag-icon` 并通过 `--gj-icon` 传入地址；Small 隐藏图标。可删除标签在标签内放 `gj-tag-close`（热区 16px），新增入口用 `gj-tag-add`，输入态用 `gj-tag-input`。同一标签同时出现前置图标和关闭图标时，基座隐藏前置图标。颜色类只声明色阶档位，风格类决定哪一档成为背景、文字和描边，因此新增颜色只需补一行，不得为某个组合单独硬编码一个类。
- `gj-tag-success / -warning / -error` 是 green / orange / red 的语义别名，供状态标识复用，不额外定义配色。页面不得用内联 style 注入标签配色。

#### 动态标签

- 可删除标签显示关闭图标；关闭图标必须具有合理点击热区和 Hover 反馈，点击后立即删除该标签。
- Tag 的删除行为不内置二次确认；会删除重要业务数据的操作不得借用 Tag 关闭图标完成，应使用对应业务操作和确认流程。
- Add Tag 触发输入后，应明确呈现输入状态；提交后生成新标签，取消后恢复 Add 状态。
- 动态标签的数量上限、名称长度和重复值处理由具体业务场景定义，组件必须支持相应边界反馈。
- 同一个 Tag 不允许同时显示前置图标和删除图标，避免操作含义和视觉重心冲突。

#### 语义与交互

- Tag 不需要 hover/pressed 交互态（2026-09-08 设计确认，见 TAG-004）；`selected` 不是独立设计状态，通过外部逻辑切换 `style`/`color` 属性表达（例如未选中用 Line、选中用 Filled）。
- Filled + Neutral 组合的背景 2026-09-08 已从 N06 改为 N07（见 TAG-003），白字对比度由 1.83:1 提升到 2.99:1；仍未完全达到 WCAG AA 常规文本 4.5:1 的要求，需要保证可读性的场景仍建议改用 Light/Line 样式承载中性语义。
- 流程状态标签，例如“进行中”“完成”“退回”，承载明确语义，应按项目定义的状态语义选择颜色并保持一致。
- 资讯、项目或内容分类标签可以不承载状态语义，可根据分类体系选择便于区分的色系。
- AI 必须根据实际上传或输入的 Tag 内容判断它属于状态标签还是分类标签；无法判断时应询问，不得仅凭颜色推断含义。
- 普通 Tag 默认不可点击。
- Tag 可显式开启可点击或可选中状态；开启后必须具有点击热区、Hover、Pressed、Selected 中适用的交互反馈，且不能与普通展示标签混淆。
- 可选择 Tag 支持单选或多选，具体模式由业务场景决定；同一标签组内必须使用一致的选择模式。
- Tag 不提供 Disabled 状态；不可操作时使用普通展示 Tag，或由业务容器解释功能不可用原因。
- 标签数量较多时 PC 端允许自动换行，不使用横向滚动；超过页面设定行数后使用“展开/收起”控制完整列表。

#### 异形与边角标签（Tag_corner）

- 边角标签（Tag_corner，Figma 节点 `3217:9158`，24 variants）是与主 Tag 并列的独立组件，2026-09-08 已完成真 Figma 审计（见 `schema.json` 的 `cornerTag` 字段、`mapping.json`、`audit.md`），在文档和预览页中应与主 Tag 同层级展示，不是主组件的一个 shape 变体。
- 颜色：只提供 black/red/blue/green/grey/orange 6 色，绑定语义色（`Background/MK_45`、`Border/error`、`Feedback/brand`、`Feedback/success&decline`、`Feedback/plain`、`Feedback/warning`），不支持主组件的 11 色色阶；只有一种深底白字视觉，没有 Light/Line 样式。
- 尺寸：medium 复用主 Tag Regular 规格（高 22、minWidth 40），small 复用主 Tag Small 规格（高 18、minWidth 36），内边距 8，图标可选 12px。
- **圆角是非对称贴角造型**：`position=top_left` 时左上角与右下角为圆角（medium 8px / small 4px），其余两角为直角；`position=top_right` 时右上角与左下角为圆角，其余两角为直角。不是给整个标签统一加圆角，也不需要跟随卡片圆角联动。
- 使用场景：贴合卡片或媒体容器的左上/右上角，用于强调置顶、精选、热门等状态；`position` 必须与标签实际所在的角一致（不能把 top_left 变体放在右上角）。
- 边角标签不得遮挡标题、图片主体、按钮或其他可见信息，必须保留内容安全区。
- 当卡片圆角大于等于 12px 时，通常不建议使用边角标签；具体设计稿明确使用时除外。

