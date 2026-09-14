# TimePicker Figma 审计

来源：用户指定节点 `3042:5339`（页面 `TimePicker时间选择器✅`），2026-09-09 通过 Figma Desktop `get_metadata`、`get_design_context` 与 `get_variable_defs` 只读检查。未修改 Figma。

inventory 页面原记 **5 套 / 51 variants / 1 standalone**。页上直接子节点是 **6 个带 `属性=值` 子图层的母版**，合计 **53 variants / 0 standalone**。MCP 把母版标成 `<frame>`、变体标成 `<symbol>`，仍按 COMPONENT_SET 计。第 6 套 `Time-Picker-dropdown`（节点 `4287:15403`，原名 `TiTime-Picker-dropdown`，2026-09-09 已更正）子图层是 `style=time|AM-PM`，是母版不是独立组件。2026-09-09 用户确认后，inventory 已改为 **6 套 / 53 variants / 0 standalone**（TMP-001 关闭）。

## 已确认的组件集

| 套 | 母版节点 | variants | 轴 |
|---|---|---:|---|
| `Time-Picker` | `3042:5340` | 12 | Size × status × Disabled = 3×2×2 |
| `Time-Picker-Range` | `3042:5870` | 12 | Size × Status × disabled = 3×2×2 |
| `Time-Picker/Time-Item` | `3042:5597` | 3 | status=default / hover / selected |
| `Time-Picker/item` | `3042:5655` | 18 | status × AM-PM × Size = 3×2×3 |
| `Time-Picker-group` | `3042:5932` | 6 | status × Size = 2×3 |
| `Time-Picker-dropdown` | `4287:15403` | 2 | style=time / AM-PM |

前 5 套合计 51 variants，对上 inventory 的 5/51。第 6 套多 2 variants。Range 是**另一套母版**，不是 `Time-Picker` 上的 Range 轴（DatePicker 触发器才是同一套上的 Range 属性）。

### 1. `Time-Picker` 单时间触发器

样本：Default `3042:5437`、filled `3042:5447`、Disabled `3042:5442`、Small `3042:5457`、Large `3042:5477`。filled+Disabled `3042:5452` 背景仍是 `Background/Background`。

| Size | 宽×高 | 水平 padding | 垂直 padding | 圆角 | 图标 | 字 |
|---|---|---|---|---|---|---|
| small | 260×24 | **8** | 4 | 4 | 16 | `中文/S8-CN-R` |
| medium | 260×32 | 12 | 4 | 6 | 16 | `中文/S8-CN-R` |
| Large | 260×40 | 12 | 4 | 8 | **20** | `中文/S7-CN-R` |

图标右槽 `pl-4`。图标 `icf_system_time`。

| 态 | 背景 | 边框 | 文案 | 图标 |
|---|---|---|---|---|
| Default | `Background/Container` | `Border/secondary` | placeholder `Text/disable` | `Text/Tertiary` |
| filled | `Background/Container` | `Border/secondary` | `Text/Primary` | `Text/Tertiary` |
| Disabled | `Background/Background` | `Border/secondary` | `Text/disable` | 使用已发布 Disabled variant，不叠半透明 |

无 Hover / Focus / Open / Error / Clear 变体。2026-09-09 确认：Hover 使用 `Border/focused`；focus-visible / 展开另加 2px `BT_B10` ring；Disabled 整项透明度 50%。

相对旧 rules-derived：高度与圆角一致；**Small 水平 padding 是 8 不是 12**；**Large 图标 20，不是 16**。

### 2. `Time-Picker-Range`

样本：Medium Default `3042:5341`、filled `3042:5357`、Large Default `3042:5373`。

- 外壳同单时间：260 宽，档位高 / 圆角 / padding 相同。
- 结构：start 段 + `Input-Seperator/Picker-Separator`（`3042:4592`，与 DatePicker 共用，源拼写 Seperator）+ end 段 + 时钟。
- 分隔：高 24、px-8 py-2、箭头 `icf_Arrow_enter-right-regular` 16。
- 段宽：Medium/Small **88**；Large **92**（生成代码有 `mr-[-1.333px]` 挤宽，实现按 88/92，不抄负 margin）。
- Large 时钟 **20**。placeholder「Start Time / End Time」。filled 示例 `10:03:56` → `10:10:50`。

### 3. `Time-Picker/Time-Item`（列选项）

样本：default `3042:5596`、hover `3042:5594`、selected `3042:5595`。

- **64×28**，px-16 py-4，圆角 4，`中文/S8-CN-R`。
- default：透明底 + `Text/Primary`
- hover：`Background/Hover`
- selected：**只改文字 `Text/blue`，不加选中底**
- Figma **没有 Disabled 变体**。2026-09-09 确认：不可选项整项 **opacity 50%**，保持当前 default/selected 表面，不从 hover/selected 另猜禁用底（TMP-004 关闭）。AM/PM 面板里的项同样适用。

预览页私有 CSS 把 selected 写成底 + 蓝字（另有一处蓝底反白），与 Figma 不符，不能当 Figma 真值。

### 4. `Time-Picker-dropdown`

- `style=time` `3042:6299`：宽约 **140**、高 **242**。`Background/Container`，圆角 **8**，px-4 py-8，列区与底栏 gap **12**，`shadow-center`（MK_10 / blur 15）。两列时/分，列宽 64，列区高 182、列间距 4。底栏 Medium Button 实例：清空（描边次级）+ 确认（Primary），gap 8、px-4。
- `style=AM-PM` `4287:15404`：**73×72**，py-8，仅有两项 AM/PM，无底部按钮。

画板只有 **两列**（时/分），没有秒列变体。2026-09-09 确认 **暂不补充秒列**（TMP-007 关闭）。filled 触发器可以显示 `10:03:56`，那是文案精度，不是三列面板。

这是专用面板，不是 Dropdown 实例。Time-Item 高 28 ≠ Dropdown Item 32。契约：面板结构以本套为准；清空 / 确认用真实 Medium Button；不要为了 SKILL「选择类组合 Dropdown」去套错行高。

### 5. `Time-Picker/item`（分组触发段）

样本：Default `3042:5654`、filled `3042:5668`、disabled `3042:5794`、Small `3042:5704`。

- Medium：高 32，px-8 py-4，圆角 6，箭头 16，宽约 57（AM-PM=true 约 62）
- Small：高 24，**p-4**，圆角 4，箭头 16，宽约 49/54
- Large：高 40，宽约 68/73（metadata；本轮未再拉 Large 生成代码）
- Default：placeholder `Text/disable`，箭头 Tertiary
- filled：`Text/Primary`
- disabled（Figma 变体）：`Background/Background` + `Border/secondary` + `Text/disable`；严格使用已发布 variant，不叠透明度
- 箭头 `icf_Arrow_down`

### 6. `Time-Picker-group`

样本：Medium Default `3042:5931`。结构 `[时] : [分] [AM/PM]`。段间距 4，段组与 AM/PM 间距 **8**。冒号是 `中文/S7-CN-R` 16/24、`Text/Primary`（Medium 组也用 S7 冒号）。画板宽：Small 173 / Medium 197 / Large 230（hug 结果，不是强制 min-width）。轴只有 status×Size，**没有 Disabled 轴**。12 小时制的 AM/PM 选择在 `Time-Picker-dropdown` 的 `style=AM-PM`，不要在 group 上另开「关闭 AM/PM」轴。2026-09-09 确认：运行时整组 **opacity 50%**，段内不再叠加透明度（TMP-005 关闭）。

## 相对旧 rules-derived 的核对

1. 格式 HH:mm / HH:mm:ss / 12h、minuteStep、键盘、跨日——**Figma 本页没有这些变体**，可留行为规则但必须标「非 Figma 变体」。秒列已确认暂不补充。
2. 列宽 64、项高 28：与 Time-Item **一致**。
3. 触发器 260×24/32/40、圆角 4/6/8：**高度圆角一致**。
4. Small 触发器 padding 实际 **8**；Large 图标实际 **20**。
5. selected 项无底、仅蓝字。
6. 面板 140 宽 + 底栏双按钮，不是旧预览那种无底栏 / 选中带底。
7. 共享 CSS 已落地 `.gj-time-*`；预览改为引用基座。selected 只改蓝字、不加选中底（TMP-006 关闭）。

## 开放问题

1. **TMP-001 · P2 · 已关闭** — 2026-09-09 用户确认 inventory 为 6 套 / 53 variants / 0 standalone。`Time-Picker-dropdown` 按母版计。
2. **TMP-002 · P3 · 已关闭** — 2026-09-09 用户确认，且 metadata 已读到节点 `4287:15403` 名为 `Time-Picker-dropdown`。属性大小写与 `Input-Seperator` 继续 mapping 归一。
3. **TMP-003 · P2 · 已关闭** — Hover 用 `Border/focused` 作为未发布交互态补充；触发器已有 Disabled variant，使用 `Background/Background` 等发布值。
4. **TMP-004 · P2 · 已关闭** — 2026-09-09 用户明确：Figma 未设置 Disabled 时使用整项 50% 透明度。Time-Item 无 Disabled 轴，故采用该兜底。
5. **TMP-005 · P2 · 已关闭** — AM/PM 使用 `style=AM-PM` 专用 73×72 面板；group 无 Disabled 轴，按用户规则使用整组 50% 透明度。
6. **TMP-006 · P2 · 已关闭** — 2026-09-09 已落地 `.gj-time-*`；selected 只改 `Text/blue`；预览不再用私有 `.time-*`。
7. **TMP-007 · P3 · 已关闭** — 2026-09-09 用户确认暂不补充秒列。`style=time` 保持时/分两列；秒级只可作为触发器文案。

## 结论

TimePicker 已升级为 `figma-audited`。6 套/53 variants/0 standalone 均已读取；触发器和 segment 使用已发布 Disabled，只有缺失 Disabled 轴的 Time-Item/group 使用 50% 透明度。AM-PM 面板已按 73×72、无底栏修正。`pendingExtraction` 为空。
