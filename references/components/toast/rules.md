# Toast 轻提示

> 从 `references/design-system-rules.md` 拆分（2026-09-08）。2026-09-09 已按画板 `2638:3208` 核对三套外观、五态绑定和文档区行为。跨组件的颜色/字体/布局/圆角等基础规范见该文件“基础规范”章节。

- 用于非阻断的操作结果、系统状态和轻量提醒；`appearance`：Float / Transparent / Black，`status`：Info / Success / Error / Warning / Loading。Black 没有 status 轴。
- Float / Transparent 宽 365px、高 48px、圆角 8px、内边距 12×16px、图标与文案间距 12px；状态图标 24px，关闭 16px。Float：`Background/Container` + `Border/default` + `shadow-center`。Transparent：info/success/error/warning 用语义浅底 + 对应 15% 描边，无投影。**Transparent Loading 维持中性底**：`Background/Container` + `Border/default`，不加语义浅底（TST-002 已关闭）。
- Black 内容自适应、高 46px、圆角 `Radius-LG` 12px、内边距 12×20px、间距 8px；`Background/MK_80`、`Text/reversal`；可选 16px `icf_system_info`，无关闭入口。
- 文案 `中文/S8-CN-R`。Float / Transparent 为 `Text/Primary`；关闭图标 `Background/MK_30`。
- 状态图标必须来自图标库：Info=`icf_system_warning-fill`（`Feedback/brand`），Success=`check-circle-fill`，Error=`close-circle-fill`，Warning=`alert-fill`，Loading=`icf_system_loading`（`Brand/GJ_Blue`）。不得用手绘 SVG 或只靠颜色区分状态。
- Float / Transparent 默认顶部居中，距视口或固定导航下缘 24px。**Black 默认底部居中**，距视口底 24px。最多堆叠 3 条、间距 12px。同类重复优先更新或合并，不无限堆积。
- 建议时长：Success 2–3 秒，Info 3 秒，Warning/Error 4–5 秒；Loading 不自动消失，并在原位置更新为成功或失败，不另叠一条结果。
- 短 Success 可无关闭；较长 Info、Warning、Error 应可关闭。Hover 或键盘聚焦暂停关闭计时。关闭按钮可访问名称「关闭提示」。
- 文案公式：对象 + 结果 / 当前状态。需要决策用 Modal，持久信息或单一入口用 Notification，锚定解释用 Tooltip / Popover，字段错误用内联反馈。
- Info / Success / Loading：`role="status"` + `aria-live="polite"`；仅紧急 Error 用 `role="alert"`。不夺取焦点。减少动态偏好下关闭位移与旋转。
- 静态基座为 `gj-toast`；外观加 `gj-toast-float` / `gj-toast-transparent` / `gj-toast-black`；状态加 `gj-toast-info` 等。视口层叠加用 `gj-toast-fixed`：Float / Transparent 在顶部，`.gj-toast-fixed.gj-toast-black` 在底部。不要把规范页里的静态样本写成 `position:fixed`。
