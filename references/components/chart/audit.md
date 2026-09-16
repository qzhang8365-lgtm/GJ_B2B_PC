# Chart audit

来源：`references/components/chart/rules.md`、已验收规范页 `preview/chart/index.html`、inventory 页面 `Chart✅`。2026-09-08 用户确认 Chart 变体过多，不走全量 Figma 上传审计，按现有规则补齐 mapping/audit，并按路 A 补组件 Token。本轮**没有**对 Figma 组件集做 `get_design_context`，不得把本文件写成 figma-audited。

## 契约范围

- 图种：折线、曲线、柱、饼/环、横向百分比、雷达、仪表、进度、环状进度、词云。
- 共享基础：Y 轴、X 轴刻度、图例、数据 Tooltip、数据指示器、卡片标题。预览属性表记录的名称是 `Chart_item/Y-axis`、`Chart_item/X-axis-label-group`、`Chart_item/Chart-legend`、`Chart_item/Data-indicator`、`Chart_item/Chart-title`。
- 系列色：`Chart/CH01–CH10` 连续取色，跨图映射稳定；涨跌平走 Feedback，不占用 CH 序列。组件层不复制一套色变量。
- Gauge / Progress / Progress Ring 核心数值用 `数字/S1-NUM-S`（GJType 36/44、700）；轴、标签、普通图表数字用 UI 字体。
- 组件 Token：`references/tokens/components/chart.tokens.json`，已接入构建。

## 实现对照

- 业务共享基座：`assets/styles/gj-b2b-components.css` 的 `gj-chart*`。
- 规范页全量图种使用 `preview/chart/index.html` 页面内样式；这是展示层，不是第二套 Token。
- dashboard 等业务页应继续组合 `gj-chart`，不要把规范页的 640×300 画布或气泡坐标写成产品真值。

## 2026-09-15：预览页一级卡片内部优化

- 保留按折线、曲线、柱状、饼/环、百分比、雷达、仪表盘、进度、环状进度、词云分别放置于一级卡片的页面结构，不合并图表类型。
- 一级卡片内部改为“灰色类型面板 + 白色绘图区”的稳定层级；标题、变体标签、图例、说明和规则区统一间距，双列示例等高，断点只负责换列。
- `Chart/CH01–CH10` 配色规则从“图表基础”末尾提升为页面首个一级卡片，并补齐连续取色、映射稳定、语义分离和不可只依赖颜色四条规则。
- 交互区的输入与选择控件统一采用 Medium 高度和 Selector 圆角 Token。本次只优化规范页展示层，不改变 Chart schema、mapping 或组件 Token 真值。

2026-09-15 根据页面复核进一步修正展示层：基础组件说明与示例间距固定为 16px；Chart title 的 Tooltip 恢复引用 `icf_system_info.svg`；基础双列卡片改为按内容高度排列，避免短卡片被强制拉伸；属性总览表移除额外灰色卡片背景；折线、曲线、柱状等实际图表类型的展示卡恢复 `Background/Container` 白底，并使用 `Border/default` 明确边界。

2026-09-16 修正横向柱状图坐标轴：Basic / Stacked / Grouped 横向柱共用的零值竖轴固定在柱体起点 `x=82`，使用 `axis-line` 实线；非零网格线继续使用 `axis-dash`。此前模板只绘制了非零虚线与底部横线，导致基础横向柱缺少零值基准轴。

2026-09-16 修正进度条示例的系列色顺序：指标进度列表由错误的 `CH01/CH09/CH06/CH05` 改为 `CH01–CH04`；单项多分段进度及其图例由 `CH01/CH09` 改为 `CH01/CH02`。进度图表与其它图种统一执行“从 CH01 连续取色、不跳号”的规则。

## 已关闭问题

2. **CHA-002 · 已关闭（2026-09-08 设计确认）** — 图例横向项间距采用 **16px**（`Interval/space5`），与共享 `.gj-chart-legend` 一致；旧规则/预览文案中的 12px 已改。纵向仍为 8px。共享 `.gj-chart-legend-dot` 是 8×8 圆角矩形，对应 Block 标记；Dot 仍为 8px 圆。

## 开放问题

无。CHA-001 已于 2026-09-10 关闭，见下方章节。

## 结论

Chart 为 `local-contract`：schema / mapping / audit / 组件 Token 已按规则、已验收预览和 CHA-001、CHA-002、CHA-003 收口，不再有开放问题。

## 2026-09-10：关闭 CHA-001（轴线与原子项分离确认；复合组件不上传）

用户提问：代码组件侧的图表构成是否把「轴线」「不同图表的原子项」单独存储？并说明 Figma 侧为设计师准备了「轴线+图表」复合组件，但不希望在 skill 内维护这些复合组件，决定不上传。

复核当前实现：

- CSS 层（`assets/styles/gj-b2b-components.css` 的 `.gj-chart*`）：`gj-chart-grid`/`gj-chart-zero`/`gj-chart-axis-text`（轴线与刻度文字）与 `gj-chart-bar-positive`/`gj-chart-bar-negative`（柱体）、`gj-chart-legend`/`gj-chart-legend-item`/`gj-chart-legend-dot`（图例）、`gj-chart-value`（数据标签）是各自独立的类，没有按图种耦合在一起。
- `schema.json` 的 `foundationFromPreview` 把 `Chart_item/Y-axis`、`Chart_item/X-axis-label-group`、`Chart_item/Chart-legend`、`Chart_item/Data-indicator`、`Chart_item/Chart-title` 记为 5 个独立原子，各自带自己的属性，与 `properties.type` 里的 10 个图种（line/curve/bar/pie…）是分开的两套概念。
- 需要说明：本 skill 只交付 Token / CSS / schema-mapping-rules 这一层规范，不包含实际框架组件代码（没有 React/Vue 组件实现）；`preview/chart/index.html` 只是规范页/演示页，每个图种在里面各自用一段 JS 生成 SVG，并不是一套真正跨图种复用的组件级 `<Axis>`/`<Legend>` 实现——如果要在业务框架里做成真正共享的子组件，是消费方代码库自己的工作，不在这个 skill 的维护范围内。

结论：Token/CSS/schema 这一层，轴线与不同图种的原子项本来就是分开维护的，没有耦合问题。用户确认 Figma 的「轴线+图表」复合组件不需要在 skill 内单独维护、不上传；inventory 记录的 5 套/39 variants/16 standalone 不再需要只读复查对齐，`local-contract` 的现有范围（原子项分离、系列色 CH01–CH10、CHA-002 已确认的图例间距）即为最终范围。

## 2026-09-10：新增 CHA-003（轴线与图表主体的整体比例搭配规则）

用户提出：此前的 Chart 规则只覆盖了柱体宽度范围、图例间距、圆角等局部数值，缺一套完整的「轴线 + 图表」整体比例规则（宽高、间距、柱体宽度如何随容器/类目数量变化），以生成视觉平衡合理的图表。用户明确不参考 Figma 的「轴线+图表」复合组件——业务场景差异大、需要灵活调整——委托 Claude 依据通用数据可视化原则拟定。

新增内容（写入 `rules.md`「整体比例与轴线搭配」小节 + `chart.tokens.json` 的 `layout.*` Token 系列）：

- Y/X 轴预留宽高：按内容实测 + 固定间距（`Interval/space3`/`space2`），不使用整页硬编码像素。
- 绘图区内边距：顶部 `Interval/space3`（开启 Data Label 时另加约 22px）、右侧 `Interval/space3`。
- 标题到绘图区 `Interval/space5`；图例到绘图区下方 `Interval/space4`、右侧 `Interval/space6`。
- 网格线：默认 3 条非零虚线 + 1 条零刻度实线，按整洁数字分档，不超过 5 条。
- 柱状图类目间距与柱宽公式：类目带宽计算式、分组柱宽公式（含 12–40px 钳制）、超过 40px 时的居中与类目间距分配处理、低于 12px 下限时的横向/滚动兜底。
- 默认高度预设：紧凑 200px / 标准 300px / 大尺寸 400px（矩形图表），绘图区最小高度 120px；圆形图表固定 1:1，直径默认 200px、下限 120px。
- 响应式收缩优先级：图例收纳到下方 → 类目间距压缩到 8px 下限 → 减少可见刻度密度 → 柱状图切横向/滚动。

来源标注为 local-contract 推导（非 Figma 逐值核对，未参考复合组件内部约束），已同步 `schema.json`（`confirmedDecisions`、`constraints`）与 `chart.tokens.json`（新增 18 个 `layout.*` Token，重新构建后 componentTokens 从 1030 增至 1048）。`preview/chart/index.html` 未改动——其画布尺寸本就标注为演示用，不是产品 Token；后续如需要，可按这套规则重做规范页演示，但不影响本次规则本身生效。

## 2026-09-11：清理预览页残留旧 CSS（新增并关闭 CHA-004）

背景：延续 MDL-010（见 `components/modal/audit.md`）建立的方法，对 `preview/chart/index.html` 做同样的死代码核查——用户明确的标准原则是预览页无论静态展示区还是交互区，都应该只用标准组件基座渲染，不应该残留旧 CSS。

排查方法：同 MDL-010，解析页面全部 `<style>` 块，提取每个选择器涉及的类名，逐个类名对照页面真实 `class="..."` 属性（含 JS 动态拼接的模板字符串）确认是否被引用；复合选择器按逗号拆分成分支逐项判断，只删除全部分支都确认无引用的规则，混有真实类的复合选择器保留但裁掉死亡分支。

整条规则删除（16 条）：`.area1`、`.axis-demo`、`.bar-value-label`、`.chart-title`、`.chart-title small`、`.chart-title strong`、`.display-caption`、`.hit`、`.hit circle`、`.hit:hover circle`、`.legend-card`、`.mini-axis-tick:before`、`.primitive-grid`、`.scale-row`、`.tooltip`、`.tooltip-static`。

复合选择器裁剪（2 处，保留真实分支/去掉死亡分支）：
- `.pie,.donut,.gauge,.ring` → `.pie,.donut`
- `.demo-grid,.demo-grid.three,.primitive-grid,.foundation-split,.axis-workbench,.radar-workbench` → `.demo-grid,.demo-grid.three,.foundation-split,.axis-workbench,.radar-workbench`

验证：脚本二次扫描确认页面残留死选择器为 0；`<style>` 块大括号计数与逐字符深度校验均通过；Playwright 起本地 http.server 渲染整页并截图，静态展示区与交互 Demo 区视觉、交互均与改动前一致，无回归。

结论：CHA-004 已关闭。`preview/chart/index.html` 内嵌 CSS 现在只包含仍被页面实际使用的选择器。

## 2026-09-16：图表基础四模块自适应布局修正

用户指出「图表卡片标题 / 图例 / 数据 Tooltip / 数据指示器」采用两行两列网格时，同一行会被内容较多的一侧撑高，导致较短卡片下方出现大块无效空白；同时灰色卡片中的白色示例容器存在固定宽度，未能随父容器伸缩。

本次调整：

- 四模块改为两条相互独立的纵向内容流：左列为「图表卡片标题 → 数据 Tooltip」，右列为「图例 → 数据指示器」。各卡片高度只由自身内容决定，不再被另一列同排卡片的高度连带撑开。
- 标题与图例内部的白色示例使用等高网格轨道并填满可用宽度；数据指示器示例明确使用父容器全宽。
- Tooltip 的三类白色示例改为等分自适应列，移除单指标示例的固定 131px 宽度；白色容器使用 `width/height: 100%` 适配灰色卡片，在 760px 以下转为单列。
- 清除已不再使用的 `.foundation-split` 旧布局规则，避免未来误引用。

验证结论：四个灰色模块不再因跨列等高产生底部空白，内部白色容器会随所在灰色卡片宽度变化，且响应式断点只改变列数，不引入固定页面宽度。

### 2026-09-16：Tooltip 预览比例收紧

根据实际预览反馈，三类 Tooltip 在宽卡片中满列铺开后显得过大、信息拥挤。本次仅调整规范页的展示比例，不修改 Tooltip 组件 Token：三张白色 Tooltip 示例统一使用所在列 88% 的宽度并居中，内边距、圆角、行间距、标记点及文字按约 86% 的比例同步缩小；示例名称保持原字号并与缩小后的卡片左边缘对齐。三类示例仍使用同一缩放口径，避免出现某一种类型被单独压缩而失真。

### 2026-09-16：系列色板固定单行顺序

CH01–CH10 在规范页中固定按从左到右的单行顺序展示，不再根据容器宽度折成两行。色块保持至少 76px 的可辨识宽度；当可用宽度不足时，色板区域横向滚动而不是换行或打乱顺序。该调整强化了“从 CH01 开始连续取色”的阅读方向，不改变图表色 Token。

### 2026-09-16：取消 Tooltip 示例等高拉伸

缩小 Tooltip 后复核发现，嵌套 Grid 仍可能按同排最高示例建立轨道，使内容较少的单指标白卡被拉高、日期与数值之间产生大块空白。现将 Tooltip 示例外壳与白卡内部改为内容驱动的纵向 Flex：每张白卡使用自身内容高度，三类 Tooltip 不再等高；灰色父卡也明确按内容高度结束。保留 88% 展示宽度和统一缩放比例，但取消所有 Tooltip 高度占位。

### 2026-09-16：配色规则改为上下结构

系列色板与映射原则由左右双栏改为上下单列。系列色板位于上方并使用一级卡片全部可用宽度，CH01–CH10 继续单行展示；映射原则位于其下方。两个子卡均按自身内容高度收缩，不再因左右等高产生额外空白。

### 2026-09-16：映射原则四条规则改为 2×2 网格（CHA-005）

`.chart-color-rules`（映射原则下的连续取色/映射稳定/语义分离/不只依赖颜色 4 条卡片）此前是 `display:grid` 但未指定列数，实际按单列纵向堆叠展示。按用户要求改为 `grid-template-columns:repeat(2,minmax(0,1fr))`，两行两列；沿用页面已有的 760px 断点回落规则，窄屏下继续回退单列，与页面其余多列区块（`demo-grid`、`foundation-columns` 等）保持一致的响应式处理方式。不影响本页当天早些时候刚完成的"配色规则改为上下结构"调整（色板与映射原则整体仍是上下单列，只是映射原则内部的 4 条规则卡片改为 2×2）。Playwright 截图核实四条规则呈 2 行 2 列排布，零控制台报错、零 404。
