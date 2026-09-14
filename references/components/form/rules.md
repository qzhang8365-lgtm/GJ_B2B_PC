# Form 表单

> 从 `references/design-system-rules.md` 拆分（2026-09-08）。跨组件的颜色/字体/布局/圆角等基础规范见该文件“基础规范”章节。

- Form Item 由 Label、Input/其他控件、帮助或错误文字及可选前后缀组成；字段含义必须由稳定 Label 表达。
- `layout`：Vertical/Horizontal；`status`：Normal/Error；支持 Required、Tooltip、Help Text、Control Slot、Prefix/Suffix Addon。
- 纵向 Label 到输入框间距 **4px**（`Interval/space2`）。横向 Label 到输入框 **8px**（`Interval/space3`）。不要把项与项之间的 ≥12px / 两列 ≥40px 当成 Label 到控件的间距。
- Label 内部元素（必填 `*`、文案、Tooltip 图标、冒号）间距 **4px**；必填星号不再额外加 `margin-right`。冒号是独立元素，不要写成「名称：」紧贴。横向 Label **nowrap**、按内容 hug，与输入框相距 **8px**（Figma `3041:3355` `right: 8px`）。输入列占满 Label 右侧剩余宽度，不要给输入列写 `width:0`，否则整项会收成 Label 那么宽。同一 `.gj-form-stack` 内用共享列对齐输入框左边缘。
- `Input-Addon` 后缀 `type=label`（如 `.com`）与 `type=setting`（设置图标）互斥，同一输入框只出现其中一个。前缀 `prefix-label` / `prefix-select` 同样一次只用一种。
- 纵向适合长标签和窄容器；横向适合桌面紧凑表单，同一区域保持一种布局。纵向**表单项与表单项**间距至少 12px，两列表单横向间距至少 40px。横向标签长度不同时，以输入控件左边缘对齐；Addon 与控件必须使用同一 Small/Medium/Large 尺寸。
- 多列表单使用 `minmax(0, 1fr)` 等可收缩列，Form Item 及控件外层必须设置 `min-width: 0`；同一行 Input、Selector、Textarea 等控件默认占满各自列宽并按控件顶部对齐。
- 禁止在组件初始化时读取计算宽度并写回固定像素值。容器或浏览器缩放导致可用宽度变化时，控件必须随列宽同步收缩；达到断点后按三列→两列→单列降级。
- Help Text 或 Error Text 只增加当前 Form Item 的内容高度，不改变同一行其他字段的控件起始位置；跨列字段在降列时必须重新占满完整行。
- 表单操作按钮组不作为独立卡片，不设置容器背景、边框、阴影，也不默认 Sticky。多张填写卡片时放在最后一张卡片之后的右下侧；只有一张填写卡片时放在卡片内部右下侧。两种情况都使用透明布局容器和 Button 组件。
- 只标记必填项；错误说明紧邻字段并指出修正方法。失焦可局部校验，提交时整体校验并定位首个错误字段。
- Form Item 复用 Input 等实际控件 Token，不自行复制一套输入框视觉状态。
- 共享 Form 基座为 `gj-form-item`，配合 `gj-form-item-vertical / gj-form-item-horizontal`、`gj-form-label`、`gj-form-content`、`gj-form-help`；表单内实际输入控件必须继续组合 `gj-input-wrap`。前后缀使用 `gj-form-addon-row` + `gj-input-addon`，操作区使用 `gj-form-actions` + Button 基座，规范页与模式页均不得另建 `.input / .form-item / .btn` 私有实现。

