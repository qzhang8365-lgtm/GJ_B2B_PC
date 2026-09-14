# Search 搜索框

> 从 `references/design-system-rules.md` 拆分（2026-09-08）。跨组件的颜色/字体/布局/圆角等基础规范见该文件“基础规范”章节。

- 支持“搜索按钮确认”和“即时搜索联想”两种模式；查询成本高或条件复杂时使用确认搜索，可快速计算时使用联想结果。
- Small/Medium/Large 高度 24/32/40px，圆角 4/6/8px，图标 12/16/20px；默认参考宽度 233px，可按业务容器覆盖但不得因响应式任意拉伸变形。与搜索按钮组合时间距 8px，按钮尺寸必须一致。
- 状态包括 Default、Focused（2026-09-10 前 Figma 值为 Active/Typing）、Filled、Disabled；有输入时显示清除按钮。结果列表与输入框同宽，结果项高 32px，命中词使用 `Text/blue`。
- 支持上下键切换结果、Enter 选择、Esc 关闭；清空后恢复初始搜索状态。无结果使用明确 Empty，不保留误导性的旧结果。
- 搜索框不自动等同于筛选器；复杂多条件查询应组合 Form/Selector 并提供清除条件入口。
- 静态组件基座中，容器为 `gj-search`，尺寸用 `gj-search-small / gj-search-large`（不写按 Medium 渲染），子元素为 `gj-search-icon / gj-search-input / gj-search-clear`。三档尺寸必须引用 `--ds-component-search-*` 组件 Token；与同档 `gj-btn` 组合时天然等高，不得自绘搜索按钮或手写高度。
- 组合容器为 `gj-search-group`，8px 间距由基座固定；按钮必须使用与搜索框同档的 `gj-btn`。结果列表为 `gj-search-results`，结果项 `gj-search-result`（激活态 `gj-search-result-active`），命中词 `gj-search-highlight`。
- Focused、Filled 与 Disabled 由 `:focus-within` 和 `:has()` 自动生效，页面无需加类；`gj-search-focused / -filled / -disabled`（2026-09-10 前类名为 `gj-search-active`）只用于需要并列展示各状态的文档页。
- 2026-09-09 Figma 审计：placeholder 为 `Text/disable`；禁用边框保持 `Border/secondary`；Search-Box `focused`（2026-09-10 前为 `active`）有 2px `Background/BT_B10` ring；Small 字号为 `中文/S9-CN-R`；Small focused（2026-09-10 前为 active/typing）的内部 gap 为 8px，其他 Small 状态为 6px；结果项 `result_highlight` 只表示命中词颜色，不是选中行；结果列表的 197px 仅为画板实例宽度，实际宽度跟随搜索框。
- 2026-09-10：Figma 已将 Search-Box 与 Search-component 的状态完整统一为 `default / focused / filled / disabled`；`defalut / typing / disable` 仅作为旧文件兼容映射，不得进入新组件或页面代码。
