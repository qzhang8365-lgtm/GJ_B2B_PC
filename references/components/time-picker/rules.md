# TimePicker 时间选择器

> 从 `references/design-system-rules.md` 拆分，并于 2026-09-09 对 Figma 页面 `3042:5339` 完成真审计。结构化真值见 `schema.json`、`mapping.json` 与 `time-picker.tokens.json`；待确认差异见 `audit.md`。

- 三种形态对应三套母版：单时间 `Time-Picker`、范围 `Time-Picker-Range`、分段组 `Time-Picker-group`。范围不是单时间套上的 Range 轴。
- 单时间 / 范围触发器宽 260px；Small/Medium/Large 高 24/32/40、圆角 4/6/8。Small 水平内边距 **8**，Medium/Large **12**；垂直均为 4。Small/Medium 时钟 16px，**Large 20px**。Small/Medium 用 `中文/S8-CN-R`，Large 用 `中文/S7-CN-R`。
- Default 占位 `Text/disable`、边框 `Border/secondary`、底 `Background/Container`；filled 文案 `Text/Primary`。Hover 使用 `Border/focused`；focus-visible / 展开另加 2px `BT_B10` ring。触发器已有 Disabled variant，必须使用其 `Background/Background` 等发布值，不叠半透明。
- 范围触发器内部：起止段 Medium/Small 宽 88、Large 92，中间复用 DatePicker 的 `Input-Seperator/Picker-Separator`（源拼写 Seperator），右箭头 `icf_Arrow_enter-right-regular`。不要复制 Figma 生成代码里的负 margin。
- 列选项是 `Time-Picker/Time-Item`：64×28、圆角 4、`中文/S8-CN-R`。default 透明底 + `Text/Primary`；hover `Background/Hover`；selected **只改 `Text/blue`，不加选中底**。Figma 无 Disabled 变体；运行时不可选项整项透明度 50%，保持当前 default/selected 表面，不从 hover/selected 另猜禁用底。行高不是 Dropdown Item 的 32。
- 面板是专用 `Time-Picker-dropdown`，不是 Dropdown 实例。`style=time` 为 140×242，两列时/分并带清空/确认 Medium Button。`style=AM-PM` 为 **73×72**，只有 AM/PM 两项且无底栏。暂不补充秒列。
- 140px 是时间面板内容的母版宽度。当面板直接锚定在更宽的单值触发器下方时，外层浮层应至少与触发器同宽，内部 64px 时间列保持原宽并居中，不得将列宽拉伸；底部操作按钮均分浮层可用宽度。独立 AM/PM 紧凑面板仍保持 73px。
- `Time-Picker-group` 为 `[时] : [分] [AM/PM]`：段间距 4，段组与 AM/PM 间距 8。冒号即使用 Medium 组也是 `中文/S7-CN-R`。12 小时制的 AM/PM 选择走 `Time-Picker-dropdown` 的 `style=AM-PM`，不要在 group 上另开「关闭 AM/PM」轴。Figma group 无 Disabled 轴；运行时整组透明度 50%，段内不要再叠一层透明度。分段控件来自 `Time-Picker/item`，箭头 `icf_Arrow_down`。
- 页面内不得混用 24 小时与 12 小时格式。分钟步长、键盘方向键 / Enter / Esc、跨日范围显示日期或「次日」，属于规则补充，不是本页 Figma 变体。秒列暂不补充。
- 营业、交易或过期时段可禁用并说明限制；不可选 Time-Item / 禁用 group 均为 50% 透明度。范围结束不得早于开始。
- 若允许键盘输入，应同步校验格式、范围和步长，并与选择面板当前值一致。
- 共享实现使用 `.gj-time-*` 基座。选中项只改 `Text/blue`。触发器与 segment 使用已发布 Disabled variant；只有未发布 Disabled 的 Time-Item/group 使用 `opacity:50%`，且只在最外层应用一次。
- 需要让浮层与触发器对齐时使用 `.gj-time-panel-match-trigger`，不要在业务页面重复写面板宽度。
