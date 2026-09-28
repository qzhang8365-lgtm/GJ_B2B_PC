# Modal 弹窗

> 从 `references/design-system-rules.md` 拆分（2026-09-08）。2026-09-09 已按画板 `4759:19935` 核对 Standard 三档宽度、关闭 20px、shadow-center 和反馈内容子件。跨组件的颜色/字体/布局/圆角等基础规范见该文件“基础规范”章节。 同日已按用户显式计算修正 Footer 高度（76px）并统一 Header/Footer/Feedback 水平内边距（20px）。

- 用于需要集中处理或确认的单一任务；由 Header、Close、Content Slot、Footer Action Group 组成，不在 Modal 中堆叠复杂导航或再次打开另一个 Modal。
- `size`：Small **400px**（简短确认/结果）、Medium **600px**（默认表单）、Large **800px**（复杂选择或高密度内容）。以满足内容的最小档位为准。Figma 组件说明里的 520/720 不是本画板发布值。
- 画板发布 Type 只有 **Standard**。确认、危险、结果是内容插槽配方（可插入 `modal_item/feedback-content`），不要再发明一套 Modal Type 类名。
- 容器：`Background/Container`、圆角 `Radius-LG` 12px、`shadow-center`。
- Header 高 64px，水平 20px、垂直 12px；标题 `中文/S4-CN-S`。关闭 **20px** `icf_system_close` / `Text/Tertiary`，不要用 32px `gj-icon-button` 替代；无障碍热区仍是代码侧扩展到 32px（视觉不变）。2026-09-11 起 Hover 仅改变图标颜色（Text/primary），取消背景叠加，与 `gj-icon-button`、Notification 关闭保持一致的 Hover 语言；Pressed（`Background/Hover_2`）与 Focus 环不变。
- 内容区是插槽，长内容固定 Header/Footer，只滚 Content。**2026-09-28 起 `.gj-modal-content` 默认内边距为上下 12px、左右 20px**：垂直使用 `--ds-component-modal-content-padding-block`（`Interval/space4`），水平使用 `--ds-component-modal-content-padding-inline`（`Interval/space6`，与 Header 水平内边距对齐）。此前组件本身无内边距，由各插槽自行定义；业务中出现了无 Footer、直接放表格的弹窗忘记补内边距、内容贴边的问题，因此把基础留白收进组件默认值。`gj-modal-body`（原 16px/20px）与 `gj-modal-feedback`（原 0/20px）不再单独设置 padding，避免与 Content 默认值叠加。极少数明确需要贴边的满宽表格或图片，可通过有语义的实例级覆盖调整 `.gj-modal-content`，不得改回全局默认。插槽内的表单、确认提示和业务内容一律**从左侧起排、左对齐、宽度撑满内容槽**，不要把内容块在弹窗里水平或垂直居中。Header 标题左对齐，Footer 按钮仍右对齐。弹窗内横向表单标签也靠左。反馈文案用 `gj-modal-feedback`：水平对齐 Header/Footer，图标 28px、图标与文字 12px。Default=`question-fill`+`Feedback/brand`，alert=`warning-fill`+`Feedback/warning`，success=`check-circle-fill`，error=`close-circle-fill`。
- Footer 高 **76px**，按钮 Medium 32px、间距 8px、右对齐。内边距 **20×20×24**（顶 20 / 左右 20 / 底 24）：顶部 20 是与上方内容的最小间距，底部 24 是页边距，左右 20 与 Header 水平内边距统一。2026-09-09 用户明确按钮组需位于卡片右下角、页边距 24、距上方内容至少 20，据此把 Figma 标注的 72 高（需要压缩顶部内边距到 16 才能凑够）修正为 76 高，不再压缩顶部间距。次操作在左、唯一 Primary 在右；Danger 用明确危险动词与错误色，不用含糊「确定」。
- 默认支持 Close、Cancel 与 Esc；包含未保存内容时，关闭、Esc 或遮罩关闭都必须先确认。遮罩点击不建议直接关闭有编辑内容的弹窗。本画板未画 Mask，层叠使用 `Background/MK_45`。
- 打开后焦点进入弹窗并限制在内部，关闭后返回触发元素。高度不得超过视口。
- 一个 Modal 只处理一个任务；轻量结果用 Toast，非阻断长期信息用 Notification。不可逆操作需说明后果。
- 静态基座为 `gj-modal`，默认 Medium 600；Small 加 `gj-modal-sm`，Large 加 `gj-modal-lg`。视口层用 `gj-modal-layer`。不要把规范页里嵌在演示框中的样本写成 `position:fixed`。
