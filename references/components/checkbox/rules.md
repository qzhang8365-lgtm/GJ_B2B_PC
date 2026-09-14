# Checkbox 多选框

> 从 `references/design-system-rules.md` 拆分（2026-09-08）。跨组件的颜色/字体/布局/圆角等基础规范见该文件“基础规范”章节。

- 用于一组独立选项中选择零项、一项或多项；只能选择唯一结果时改用 Radio。
- 状态包括 Default、Hover、Mouse Down、Checked、Indeterminate、Disabled；Indeterminate 只表示部分子项选中，不是第三种业务值。
- Checked 与 Indeterminate 的控件填充正式使用 `Brand/GJ_Blue`，勾选和横线使用 `Text/reversal`；不得以同色的 `Text/blue` 替代品牌填充语义。
- 方框 16×16px、圆角 4px；控件与文字间距 8px，文字 14/22；多个选项间距不小于 16px。
- 点击方框或完整标签文字均切换状态；Disabled 不响应操作。全选与子项双向同步，部分选中显示 Indeterminate，全部选中显示 Checked。
- 选项文案保持并列、清楚和单行；长说明放在选项外部，不把 Checkbox 当作长段落容器。
- 静态组件基座为 `gj-checkbox`（作用于原生 `input`，保留表单语义与 `indeterminate` 行为），配合 `gj-checkbox-label` 和 `gj-checkbox-group`。页面不得使用无组件类的裸 `input[type=checkbox]`，也不得靠全局元素选择器给原生控件套样式。
