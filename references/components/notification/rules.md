# Notification 通知

> 从 `references/design-system-rules.md` 拆分（2026-09-08）。2026-09-09 已按画板 `3619:11945` 核对 Standard 四态、关闭 16px 和确认按钮 Button Medium。投影按 NTF-002 使用全局 `shadow-down`。跨组件的颜色/字体/布局/圆角等基础规范见该文件“基础规范”章节。

- 用于非阻断但需要比 Toast 停留更久、信息更完整的单一主题；包含可选语义图标、标题、说明、固定关闭入口和最多一个确认操作。
- `status`：Info / Warning / Error / Success。容器宽 **384px**、内边距 **20px**、圆角 `Radius-LG` **12px**、`Background/Container`。
- 列间距 **12px**（主行与操作行）；主行间距 **16px**（图标、文案、关闭）；文案栈 **8px**。内容左对齐并撑满卡片，不要居中。
- 图标 **32px**。Info=`warning-fill`+`Text/blue`，Warning=`alert-fill`+`Feedback/warning`，Success=`check-circle-fill`+`Feedback/success&decline`，Error=`icf_system_close-circle-fill`+`Feedback/error&rise`。
- 标题 `中文/S4-CN-S` / `Text/Primary`；说明 `中文/S8-CN-R` / `Text/Secondary`。BOOLEAN `showIcon` / `showDescription` 可关。
- 关闭 **16px** `icf_system_close` / `Text/Primary`，始终显示，不要用 20px Modal 关闭或 32px `gj-icon-button` 替代。2026-09-11 新增 Hover：颜色变为 `Text/blue`（默认已是 Text/Primary，无法再靠加深表达反馈，改用与 `gj-input-action`/`gj-table-sort` 等既有交互图标一致的蓝色反馈），不叠加背景，与 Modal 关闭、`gj-icon-button` 保持同一套“只变图标颜色”的 Hover 语言；此前未定义 Hover，属于补齐缺口。
- 确认按钮可显示或隐藏；直接使用共享 **Button Medium**（高 **32px**、水平内边距 **12px**），右对齐；只能有一个，不提供双按钮、Loading、尺寸或交互状态变体，也不要再单独覆盖 padding。
- 投影使用全局效果 `shadow-down`（`0 8px 20px 0` / `Background/MK_10`），不要用 `shadow-center`，也不要实现画板样本上的 `drop-shadow/0.12+0.8+0.5`。
- 默认持续至用户关闭或业务状态失效；同类重复内容更新原通知，不无限堆叠。
- Notification 不锁定焦点、不要求立即决策；一旦需要明确决策或复杂输入，改用 Modal。轻量短结果用 Toast。
- 本画板未给视口锚点。静态基座为 `gj-notification`；Warning/Error/Success 加对应状态类。不要把规范页里嵌在演示框中的样本写成 `position:fixed`。
