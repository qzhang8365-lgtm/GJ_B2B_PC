# Steps 步骤条

> 从 `references/design-system-rules.md` 拆分（2026-09-08）。跨组件的颜色/字体/布局/圆角等基础规范见该文件“基础规范”章节。2026-09-08 已按画板 `4465:8293` 纠正标题、说明和间距。

- 用于明确先后顺序的多阶段任务；`style`：Dot/Serial（2026-09-10 前 Figma 值为 Point），状态：Wait/Process/Finished；同一时刻只能有一个 Process。
- Dot 指示器 20×20px，Serial 32×32px、序号 `中文/S4-CN-S`；单元基准宽 264px，四步组合宽 1056px。
- 标题 `中文/S4-CN-S` 16/24；说明 `中文/S9-CN-R` 12/18，由 `infovisible` 统一显示或隐藏。指示器到文字、标题到说明均为 4px。
- wait：指示器 `Background/Secondary`，文字 `Text/Tertiary`，连接线 `Border/secondary`。process / finished：指示器实心 `Text/blue`，文字 `Text/Primary`；Serial 序号 `Text/reversal`。finished 出向连接线 `Border/focused`。
- Serial finished 保持实心蓝圆和数字，不用描边空心圆，也不改成勾选图标。末项 process 与 finished 视觉相同：Serial 源文件只发布 `end+process`（原 end+finished），实现里最后一步 finished 用同一视觉。
- 状态必须连续：当前之前为 Finished，之后为 Wait；失败在步骤内容区说明并提供恢复，不只改成等待色。
- 默认只展示进度；只有业务允许回看或跳转时 Finished 可点击。建议 3–6 步。
- 静态基座为 `gj-steps` / `gj-step` / `gj-step-indicator`；Dot 加 `gj-steps-dot`（2026-09-10 前类名为 `gj-steps-point`）；说明为 `gj-step-desc`。当前步 `gj-step-process`，已完成 `gj-step-finished`。页面全宽使用时两侧各留 48px，首尾指示器不再贴边；Serial / Dot 与标题、说明必须同一条中轴线，不要把首尾改成左对齐或右对齐。组件规范页仍按 264 单元展示。
- 2026-09-10：Figma 把 `progress_point`/`progress_item/point`/`progress_item/point_cell` 统一改名为 `progress_dot`/`progress_item/dot`/`progress_item/dot_cell`；此前与 dot_cell 同名、实际内容是 Serial 单元格的 `4493:9059` 已正确改名为 `progress_item/serial_cell`（STP-002 已关闭）。
