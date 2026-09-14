# Popover 居中弹出框

> 从 `references/design-system-rules.md` 拆分（2026-09-08）。2026-09-09 已按组件集 `3630:3133`（`popover_basic`）核对 `button=1|2`、宽 360、圆角 16、`shadow-center` 和 Button Large 操作区。页面上只有这一套；`button=1/2` 是子变体。跨组件的颜色/字体/布局/圆角等基础规范见该文件“基础规范”章节。

- 本系统的 Popover 是无指向箭头的居中短结果 / 简单确认框，不等同于依附触发元素的常规气泡浮层。
- `button`：`1` 单主按钮（默认）/ `2` 取消＋主操作。没有 0 按钮变体，也没有 Status 变体轴。
- 固定结构为状态图形、标题、说明、操作区；内容居中。不承载表单、列表、级联选择或多步骤任务。
- 容器宽 **360px**、高随内容（两份样本均为 282）、圆角 `Radius-XL` **16px**、`Background/Container`、`shadow-center`。内边距上 **40px**、左右 **24px**、下 **24px**。列间距 **20px**。
- 状态图形 **48px**，是填充图标插槽，不是语义轴。画板样本：`button=1` 用 `icf_system_check-circle-fill` + `Feedback/success&decline`；`button=2` 用 `icf_system_safety1-fill` + `Feedback/brand`。
- 标题 `中文/S2-CN-S` / `Text/Primary`；说明 `中文/S8-CN-R` / `Text/Secondary`；文案间距 **16px**，文字区左右再内缩 **20px**，居中。
- 操作使用共享 **Button Large**（高 40、水平 16、圆角 8），不要再覆盖尺寸。单按钮铺满；双按钮等宽「取消（Tertiary）+ 唯一 Primary」，间距 **12px**。
- 无操作自动消失用 Toast；非阻断持久通知用 Notification；复杂决策或录入用 Modal。
- 本画板未给视口锚点或遮罩。静态基座为 `gj-popover`；权限样本加 `gj-popover-brand`。不要把规范页里嵌在演示框中的样本写成 `position:fixed`。
