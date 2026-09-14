# Metric Figma 审计

来源：Figma 页面 `3143:5677`（指标Metric✅），文档画板 `3372:4534`（指标 Metric），2026-09-08 只读检查。用户直接提供页面链接（`node-id=3143-5677`），未通过猜测节点 ID 获得。本轮未修改 Figma。

14 个组件集全部在页面上点名。按母版口径 **14 套 / 77 variants / 0 standalone**（MET-005 已关闭；旧 inventory 85 把嵌套子组件算进去了）。原子件（number / label / Trend Badge / Trend graph / list_item）和主要组合（vertical / horizontal / group_basic / trend / card_withgraph）已用 `get_design_context` 或 `get_variable_defs` 核对绑定；`Metric_grid` 与 `Metric_card_grid` 各抽了 `2*2` 样本，其余 count 变体未逐个拆 token。

旧 `schema.json` 把 Metric 写成单一组件、`status=Base/Rise/Decline/Brand/Plain`、`size=XSmall`、`trend=none/badge/sparkline`。这些是规则推断，不是 Figma 属性。真值是 14 个组件集，数字色轴为 `color=black/red/green/blue/grey`。

## 已确认的真实结构

### Metric_item/number（`3238:1407`，24 variants）

| Size（Figma 原文） | Text Style | 字号/行高 |
|---|---|---|
| Xsmall | `数字/S5-NUM-S` | GJType Bold 16/24 |
| Small | `数字/S4-NUM-S` | GJType Bold 20/32 |
| Medium | `数字/S3-NUM-S` | GJType Bold 24/32 |
| Large | `数字/S2-NUM-S` | GJType Bold 30/38 |

| color | Token | 解析色 |
|---|---|---|
| black | `Text/Primary` | #101828 |
| red | `Feedback/error&rise` | #f93838 |
| green | `Feedback/success&decline` | #12b76a |
| blue | `Feedback/brand` | #2b73ff |
| grey | `Feedback/plain` | #667085 |

- `unit` 为 BOOLEAN，与数字 gap **4px**；单位色 `Text/Secondary`。Medium 及以下单位 `中文/S10-CN-R` 10/14；Large 为 12/18（`中文/S9-CN-R`）。
- `nodata=true` 只出现在 `color=grey` 的 4 个 Size 上，不是 5 色全开。
- 节点 `3283:10077`（nodata=true, grey, Medium）Figma 文案是单个 `-`、绑 `Text/Primary`。2026-09-10 设计确认运行时按 **`--`** 记，色 `Feedback/plain`。不得把该 variant 的 `-` / Primary 当实现真值（MET-001 已关闭）。

### Metric_item/label（`3209:8691`，4 variants）

- small：`中文/S9-CN-R` 12/18，`Text/Secondary`
- medium：`中文/S8-CN-R` 14/22，`Text/Secondary`
- `tooltip=true`：`icf_system_info` **16px**，与文字 gap **4px**（2026-09-10 已由 `toolip` 更名为 `tooltip`）
- 规范页此前另有 Chevron（`icf_Arrow_right` 14px）和 Question（`icf_system_question` 16px）实例，**不是**这 4 个 variant 的属性。2026-09-10：设计已先后从规范页移除 Chevron、Question 两个示例，Label Icon States 现仅保留 无图标/Tooltip 两例。见 MET-004（已关闭）。

### Metric_item/Trend Badge（`3241:2347`，6 variants）

高 22、minH 22、minW 40；文字 `中文/S6-CN-S` 12/18/600；图标 14px。

| trend | fill 背景 | 文字/图标 | none |
|---|---|---|---|
| Rise | `Background/BT_R8`，圆角 8，px 8 | `Feedback/error&rise`，`icf_Arrow_arrow-up-large` | 无填充、无 px，圆角 **4** |
| Decline | `Background/BT_G10`，圆角 8，px 8 | `Feedback/success&decline`，`icf_Arrow_arrow-down-large` | 同上 |
| Flat | `Background/MK_5`，圆角 8，px 8 | `Feedback/plain`，`icf_Arrow_flat` | 同上 |

2026-09-10：fill 圆角绑 `Radius/Radius-XS` **4**（原 8）；none 圆角 **0**（原 4）。仍按 style 分支，不是 pill（MET-006 已关闭）。

### Metric_item/Trend graph（`3241:2958`，3 variants）

固定 **60×60**。`Trend=Rise/Decline/regular`。Rise/Decline 为独立 SVG 资产，不是 gj-icon。

### Metric_vertical（`3238:1538`，4 variants）

column；`order=metric_first` 数字在上，`lable_first` 名称在上；`center` 控制对齐。样本中间距接近 0（label 紧贴 number）。2026-09-10 轴名由 `align=metrictop/labletop` 改为 `order`（MET-002 已关闭）。`lable_first` 仍是 Figma 拼写。

### Metric_horizontal（`3241:2873`，4 variants）

row，**gap 8px**。变体高度 XS 24 / S 32 / M 32 / L 38，与数字行高一致。M 档已核实：medium label + Medium number + `unit=true`。XS/S/L 的 label Size 与是否显示 unit 未逐档复核。

### Metric_group_basic（`3241:2592`，5 variants）

`Count=2..6`。Count=2（`3241:2591`）生成代码 **gap 40px**，子项为左对齐 `Metric_vertical`。

### Metric_trend（`3276:8147`，2 variants）

2026-09-10 已改为 `trend=Rise/Decline`（MET-003 已关闭）。两者都是「环比」（small label）+ gap 8 + Trend Badge `style=none`。

### Metric_grid（`3285:10543`，3 variants）

`count=2*2/3*2/4*2`。2*2（`3285:10540`）：**gap-x 44 / gap-y 24**，高 124，单元格为 `Metric_vertical`（生成代码 `center=true`）。

### Metric_card_grid（`3285:10544`，6 variants）

count 已统一为 `2*2/3*2/4*2`（原 `count4/count5/count6` 已去掉）。`style=gradient/grey/gray`：2*2 与 3*2 用 `grey`，4*2 用 `gray`。2*2 gradient（`3285:10561`）：**gap-x 16 / gap-y 12**，单元格 px 24 / py 16，圆角 **8**，背景 paint style **`蓝色渐变背景`**。见 MET-007（已关闭）。

### Metric_card_withgraph（`3241:2976`，2 variants）

`Background/Container`，px 24 / py 16，圆角 12，`shadow-center`。左列 label medium / Large number / badge none；右 60 趋势图。

### Metric_item/list_item 与 Metric_list

list_item medium+trend：宽 320，`py 12`，底边 `Border/default`；右侧 badge none + Small number，组内 gap 8，右栏宽 160。`Metric_list` 8 variants 按 Size 分面：medium `count=3..6` 等于条数；small `count8/count7/count6/count5` 实测分别为 3/4/5/6 条。实现按实际条目数，不把 `count8` 解析成 8。见 MET-007（已关闭）。

### Metric_dashboard（`3290:12231`，2 variants）

`count=3/4`。count=3 为三张 `Metric_card_withgraph` + 竖 Divider（`Border/default`）。count=4 未逐卡片量宽。

## 开放问题

1. **MET-001 · P1 · 已关闭（2026-09-10）**
   - 设计确认：缺失数据按 `--` 记，色 `Feedback/plain`。
   - Figma nodata 变体仍可能是单个 `-` + `Text/Primary`，那是源文件示意，不是运行时契约。

2. **MET-002 · P3 · 已关闭（2026-09-10）**
   - Figma 已改：`toolip`→`tooltip`；`align=metrictop/labletop`→`order=metric_first/lable_first`。
   - `lable_first` 仍是源文件拼写，mapping 按原文保留。

3. **MET-003 · P3 · 已关闭（2026-09-10）**
   - `Metric_trend` 已改为 `trend=Rise/Decline`，不再使用 `Property 1`。

4. **MET-004 · P2 · 已关闭（2026-09-10）**
   - 规范页 Label 的 Chevron / Question 不是 `Metric_item/label` 的 4-variant 属性。生成页面时不要把它们当成组件属性枚举。
   - 设计确认：不补组件属性；Chevron 示例先从规范页移除，随后 Question 示例也一并删除。Label Icon States 现仅保留 无图标/Tooltip 两例，以组件真实属性（Size × tooltip）为准。

5. **MET-005 · P2 · 已关闭（2026-09-10）**
   - 按组件集母版计数，不算嵌套子组件。该页 **14 套** 母版，variants 合计 **77**。
   - 旧 inventory 85 是把组合里的子组件算进去的误记，已改为 14/77/0。

6. **MET-006 · P3 · 已关闭（2026-09-10）**
   - fill 圆角改为绑 `Radius/Radius-XS` 4px；none 圆角 0。继续按 style 分支。

7. **MET-007 · P3 · 已关闭（2026-09-10）**
   - `Metric_card_grid` count 已统一为 `2*2/3*2/4*2`。
   - `Metric_list` 确认按 Size 分面：medium `3..6`；small `count8..count5` 实测 3..6 条。实现仍按实际条目数。

## 预览页（非本轮修改）

`preview/metric/index.html` 仍按旧推断契约展示（status 下拉 Rise/Decline/Brand、nodata 显示 `--`、Badge 图标用 trending-up/down）。与本轮 Figma 真值有差，但不阻塞契约升级；预览同步作为后续任务。

## 结论

Metric 已从 `rules-derived` 升级为 `figma-audited`。生成页面时必须优先读取本目录三件套与 `metric.tokens.json`；Figma 没有提供的交互态不得编造；nodata 运行时显示 `--`。`pendingExtraction` 已清空；网格/卡片网格/横向档位/仪表盘的未逐档测量项记在 `schema.json` 的 `partialMeasurements` 与本文件对应段落，不把未量过的 gap 编成真值。


## 2026-09-10：Chevron 示例移除（关闭 MET-004）

用户反馈「已去除chevron属性变体」，并给出 `Metric_item/label`（`3209:8691`）的节点链接。

只读复核：

- `get_metadata` 重新拉取 `3209:8691`：仍是 4 个 variant（`Size=small/medium × toolip=true/false`），属性数量和取值没有变化，本来就不存在 Chevron 属性轴。
- `get_metadata` 拉取整页 `3143:5677`：确认全页只有一个 `Metric_item/label` 组件集，不存在带 Chevron 的第二个隐藏组件。文档区块 `Label Icon States`（`3398:1155`）目前只剩 3 个示例卡片——无图标、Tooltip、Question——原来的 Chevron 示例卡片已经从规范页整体移除，不再具有误导性。
- `get_design_context` 复核 Question 示例（`3402:10575`）：仍是实例换图标（`icf_system_question` 16px），确认它是 `toolip=true` 变体的图标覆盖，不是独立属性。

结论：MET-004 的两条候选方案（补属性 / 保持实例换图标）里，设计选择了更彻底的第三种处理——不补属性，同时把容易引起误解的 Chevron 示例直接从规范页删除；Question 保留为实例换图标模式，与 Tooltip 一致。生成页面时继续按「Size × toolip 两个真实属性，Question/Tooltip 属于实例换图标」处理，不把 Chevron 当成任何形式的枚举值。

`schema.json`、`mapping.json`、`rules.md` 已同步移除/更新 Chevron 相关描述。

## 2026-09-10：关闭 MET-002 / 003 / 006 / 007

用户给出页面 `3143:5677`，确认这四项已在 Figma 更新。只读复核（`use_figma` 读 COMPONENT_SET 属性定义与 Trend Badge 圆角绑定）：

| 项 | 旧值 | 现状 |
|---|---|---|
| MET-002 Label | `toolip` | `tooltip`（仍 4 variants：Size × tooltip） |
| MET-002 Vertical | `align=metrictop/labletop` | `order=metric_first/lable_first`（`lable_first` 仍是源文件拼写） |
| MET-003 Trend | `Property 1=Default/Variant2` | `trend=Rise/Decline` |
| MET-006 Badge fill | 圆角 8 | 绑 `Radius/Radius-XS` **4** |
| MET-006 Badge none | 圆角 4 | **0**（未绑变量） |
| MET-007 card_grid count | `2*2/3*2/4*2` 与 `count4/5/6` 混用 | 仅 `2*2/3*2/4*2`；style 现为 gradient + grey/gray |
| MET-007 list count | medium `3..6`，small `count8..count5` | 字面值未改；small 实测条数 3/4/5/6，实现按子节点数 |

结论：四项按设计改稿关闭。契约改跟新属性名；list 的 `count8` 不得当 8 解析；Badge 圆角继续按 fill/none 分支，token 改为 4 / 0。

## 2026-09-10：关闭 MET-001 / MET-005

- **MET-001**：设计确认缺失数据按 `--` 记，色 `Feedback/plain`。Figma nodata 变体的单个 `-` / `Text/Primary` 不写入运行时。规范页与交互预览已是 `--`。
- **MET-005**：设计确认按组件集母版计数，不算嵌套子组件。该页 14 套母版，variants 合计 77。`inventory.json` 由 14/85/0 改为 14/77/0，`scope.variants` 1698→1690。

## 2026-09-10：Question 示例删除（MET-004 补充关闭）

用户反馈「以组件为准，已在示例画板上删除了 Question」。

只读复核：
- `get_metadata` 重新拉取 `3209:8691`：仍是 4 个 variant（`Size=small/medium × tooltip=true/false`），组件本身未变化。
- `get_metadata` 重新拉取文档区块 `Label Icon States`（`3398:1155`）：原来的 3 个示例卡片（无图标/Tooltip/Question）现在只剩 2 个——`Question` 卡片（`3402:10573`）已整体删除，不再存在于规范页。

结论：Label Icon States 现在只展示 无图标、Tooltip 两种真实状态，与组件的 Size × tooltip 两个属性完全对应，不再有容易引起误解的 Question 示例。`schema.json`、`mapping.json`、`rules.md` 已同步移除 Question 相关描述。
