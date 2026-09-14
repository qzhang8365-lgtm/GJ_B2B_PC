# Metric 指标数据

> 从 `references/design-system-rules.md` 拆分，并于 2026-09-08 对 Figma 页面 `3143:5677` 完成真审计。结构化真值见 `schema.json`、`mapping.json` 与 `metric.tokens.json`；待确认差异见 `audit.md`。

- Metric 不是单一组件。Figma 有 14 个组件集：原子件（number / label / Trend Badge / Trend graph / list_item）和组合（vertical / horizontal / group / grid / card / list / dashboard / trend）。
- 数字尺寸按 `Metric_item/number` 的 Size：Xsmall 16/24、Small 20/32、Medium 24/32、Large 30/38，对应 `数字/S5`–`S2-NUM-S`。16/20 用于高密度，24 常用，30 只用于少量重点指标。横向组合 `Metric_horizontal` 的 Size 是 XS/S/M/L，不要和数字 Size 字面值混用。
- 核心数值使用 GJType；名称、单位和说明使用中文 UI 字体。单位弱化（`Text/Secondary`），与数字 gap 4px；同组单位相同可在组标题统一说明。
- 数字颜色属性是 `color=black/red/green/blue/grey`，分别绑 `Text/Primary`、`Feedback/error&rise`、`Feedback/success&decline`、`Feedback/brand`、`Feedback/plain`。不要再用旧规则里的 Base/Rise/Decline/Brand/Plain 当作 Figma 属性。涨跌平只能使用 Feedback 定义，不创建临时红绿灰。
- 缺失或尚未返回的数据，**统一显示 `--`**，色 `Feedback/plain`，不显示 0、空白、NaN 或单个 `-`。Figma nodata 变体若仍是 `-` / `Text/Primary`，不作为实现真值（MET-001 已关闭）。统一同组小数位、千分位和单位。
- 垂直布局用 `Metric_vertical`：`order=metric_first/lable_first` 控制数字与名称的上下顺序，`center` 控制对齐。列表、表格和连续指标组优先左对齐；网格/卡片格可用居中。横向布局用 `Metric_horizontal`，item gap 8px。
- Trend Badge 高 22px、`中文/S6-CN-S`、图标 14px；`style=fill` 圆角 **4px**（`Radius-XS`）且 px 8，`style=none` 无填充且圆角 **0**。只补充相对变化，不重复主数据。趋势图固定 60×60px，第三态是 `regular`，不替代完整 Chart。
- Label 组件属性只有 Size 与 `tooltip`（info 图标）。规范页上曾有的 Chevron、Question 示例均已于 2026-09-10 移除，Label Icon States 现仅保留 无图标/Tooltip 两例（MET-004 已关闭）。
- 分组 `Metric_group_basic` 的 item gap 为 40px（Count=2..6）。卡片 `Metric_card_withgraph` 使用 `Background/Container`、内边距 24/16、圆角 12、`shadow-center`。
