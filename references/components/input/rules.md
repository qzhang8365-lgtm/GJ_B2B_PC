# Input 输入框

> 从 `references/design-system-rules.md` 拆分，并于 2026-09-08 对用户提供的 Figma 画板 `4744:3963` 完成真审计。结构化真值见 `schema.json`、`mapping.json` 与 `input.tokens.json`；待确认差异见 `audit.md`。

- 用于单行文本、多行文本和密码。`type`：`text / textarea / password`；`appearance`：`outlined / filled`；`size`：`small / medium / large`。Figma 状态是 default / focused / filled / disabled（2026-09-10 前为 typing）；错误是独立布尔，且只与 focused 组合 published。
- 高度 24/32/40px，圆角 4/6/8px。Small/Medium 文字 `中文/S8-CN-R`，Large 用 `中文/S7-CN-R`。图标约 14/16/18px。Text Area 默认高 80px、内边距 12×8，圆角跟随当前尺寸档（默认 medium = 6px）。
- Outlined 默认白底 `Background/Container` + `Border/secondary`。Filled 默认灰底 `Background/Background` + **`Border/default`（不是透明边框）**。聚焦（State=focused，2026-09-10 前 Figma 值为 typing）边框 `Border/focused`；Filled 聚焦时背景回到 Container。
- Outlined 禁用：背景 `Background/Background`，文字 `Text/Tertiary`。Filled 禁用：背景 `Background/Background`（设计确认；Figma 源文件实测曾为 Tertiary，请改绑），文字 `Text/disable`。
- 支持左图标、右图标、清除、帮助文字、字数限制。密码框 `Filled` 表示已填写，不是灰底外观；眼睛图标切换可见性时不得清空内容或丢失焦点。Password 与主输入框共用同一尺寸档（small/medium/large 的 padding、gap、icon），不另开独立尺寸。Figma `Input_Password` 已与 outlined Input field 同档。
- Outlined 与 Filled 按背景选择，同一区域保持一致；与按钮并排时用同一尺寸档位。
- Label 必须稳定可见，不能只靠 Placeholder。错误同时使用 `Border/error` 与紧邻的 `Feedback/error&rise` 说明（`中文/S9-CN-R`）。
- 帮助文字 `input_item/hint`：`中文/S9-CN-R` 12/18、`Text/Tertiary`。Input 规范页用 `gj-field` 包控件和 hint，纵向控件到 hint **8px**。`1.Input_Basic` 是标签+控件+hint 组合（`align=vertical|horizontal`），不是第四套输入外观；BOOLEAN 为 `helperHint`、`informationicon`。纵向标题到控件 12px、横向标题列 80px 且标题到控件 12px。表单场景的 Label 间距仍走 Form Token，不要用这组 12px 覆盖 Form_item。
- 光标独立件 `input_item/cursor` 绑 `Text/blue`，内条 1×20、左右 4px。实现用原生 `caret-color`；框内 focused（2026-09-10 前为 typing）光标按 1×16 记录。
- hover 不在 Figma 组件集中；2026-09-08 设计确认保留现有状态矩阵，outlined hover 使用 `Border/hover`。2px `Background/BT_B10` 外圈只在 Password 已填可见变体核实过。
- 共享基座 `gj-field` + `gj-input-wrap`。页面不得用私有类重画边框、尺寸和状态。
