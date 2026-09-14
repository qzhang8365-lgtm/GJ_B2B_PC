# Radio 单选框

> 从 `references/design-system-rules.md` 拆分（2026-09-08）。跨组件的颜色/字体/布局/圆角等基础规范见该文件“基础规范”章节。

- 用于从同一维度的一组互斥选项中选择唯一结果；同组只能存在一个 Checked。
- 状态包括 Default、Hover、Mouse Down、Checked、Disabled；选择新项自动取消原选项。
- 圆形控件 16×16px，控件与标签间距 8px，文字 14/22；横向或纵向组间距默认 12px。
- Radiobutton Group 的 `align` 规范值为 `horizontal` / `vertical`（代码映射 `direction`）。Figma 已修正拼写；历史值 `verticle` 只在 mapping 里归一化为 `vertical`，生成层不得再输出错误拼写。
- 全部选项通常同时可见，便于比较；选项过多或空间不足时改用 Selector。
- 仅在存在安全、常用或明确推荐值时预选，不替用户完成高风险决定；Disabled 项必要时说明解除限制的条件。
- 静态组件基座为 `gj-radio`（作用于原生 `input`），配合 `gj-radio-label` 和 `gj-radio-group`。

