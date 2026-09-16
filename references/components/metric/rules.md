# Metric 指标数据

> 从 `references/design-system-rules.md` 拆分，并于 2026-09-08 对 Figma 页面 `3143:5677` 完成真审计。结构化真值见 `schema.json`、`mapping.json` 与 `metric.tokens.json`；待确认差异见 `audit.md`。

- Metric 不是单一组件。Figma 有 15 个组件集：原子件（number / label / Trend Badge / Trend graph / list_item）和组合（vertical / horizontal / group / grid / card / list / dashboard / trend / colorstyle）。另有 4 个 Transparent_illustration 独立装饰组件。
- 数字尺寸按 `Metric_item/number` 的 Size：Xsmall 16/24、Small 20/32、Medium 24/32、Large 30/38，对应 `数字/S5`–`S2-NUM-S`。16/20 用于高密度，24 常用，30 只用于少量重点指标。横向组合 `Metric_horizontal` 的 Size 是 XS/S/M/L，不要和数字 Size 字面值混用。
- 核心数值使用 GJType；名称、单位和说明使用中文 UI 字体。单位弱化（`Text/Secondary`），与数字 gap 4px；同组单位相同可在组标题统一说明。
- 数字颜色属性是 `color=black/red/green/blue/grey`，分别绑 `Text/Primary`、`Feedback/error&rise`、`Feedback/success&decline`、`Feedback/brand`、`Feedback/plain`。不要再用旧规则里的 Base/Rise/Decline/Brand/Plain 当作 Figma 属性。涨跌平只能使用 Feedback 定义，不创建临时红绿灰。
- 缺失或尚未返回的数据，**统一显示 `--`**，色 `Feedback/plain`，不显示 0、空白、NaN 或单个 `-`。Figma nodata 变体若仍是 `-` / `Text/Primary`，不作为实现真值（MET-001 已关闭）。统一同组小数位、千分位和单位。
- 垂直布局用 `Metric_vertical`：`order=metric_first/lable_first` 控制数字与名称的上下顺序，`center` 控制对齐。列表、表格和连续指标组优先左对齐；网格/卡片格可用居中。横向布局用 `Metric_horizontal`，item gap 8px。
- Trend Badge 高 22px、`中文/S6-CN-S`、图标 14px；`style=fill` 圆角 **4px**（`Radius-XS`）且 px 8，`style=none` 无填充且圆角 **0**。只补充相对变化，不重复主数据。趋势图固定 60×60px，第三态是 `regular`，不替代完整 Chart。
- Label 组件属性只有 Size 与 `tooltip`（info 图标）。规范页上曾有的 Chevron、Question 示例均已于 2026-09-10 移除，Label Icon States 现仅保留 无图标/Tooltip 两例（MET-004 已关闭）。
- 分组 `Metric_group_basic` 的 item gap 为 40px（Count=2..6）。卡片 `Metric_card_withgraph` 使用 `Background/Container`、内边距 24/16、圆角 12、`shadow-center`。

## 彩色指标卡 Metric_card_colorstyle

- 用于视觉要求较高的重点指标区，不取代普通 Metric 卡片。通常 **2–4 张横向排布**；同组每张卡片必须使用不同的 Color，禁止同色重复。
- Color 共 7 个值：blue / purple / cyan / deepblue / sky / orange / pink。优先按前五个冷色选择；orange 和 pink 只在卡片数量较多、冷色不足或业务明确需要时作为备用。默认 blue。
- 单卡 Figma 母版为 **275×79px**；运行时宽度由父级网格等分，不固定 275px，但高度保持 79px。内边距 20px（横向）/16px（纵向），圆角 12px；标签用 中文/S9-CN-R 12/18，数据用 GJType Bold 20px / normal line-height（该节点未绑定旧 Metric 的数字 Text Style），两者间距 8px，文字统一 Text/reversal。
- 同组默认 gap **16px**，对应 L1 卡片组；可依据共同父容器层级在 **12–20px** 内调整。断点只负责 4→2→1 列换列，不改变卡片内部尺寸、字体、圆角或插图定位。
- 装饰插图从 `assets/images/metric/transparent-illustration-1.svg` 至 `-4.svg` 中配置，也可不显示。插图固定 **80×60px**，绝对定位于卡片右下角，`right:0; bottom:0`，没有边距；不得拉伸、改色、用 iconfont 替换或用 CSS 临摹。
- 插图仅为白色半透明装饰，必须 `alt=""` 且 `aria-hidden="true"`，不承载指标含义、不接收鼠标事件。名称和数值必须作为真实文本保留。
- 该卡片是展示组件，Figma 没有 hover / pressed / selected / disabled 状态；除非产品明确将整卡变为可操作控件，否则不得自行添加交互态。
