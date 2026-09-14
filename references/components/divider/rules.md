# Divider 分割线

> 从 `references/design-system-rules.md` 拆分（2026-09-08）。跨组件的颜色/字体/布局/圆角等基础规范见该文件“基础规范”章节。

#### 用途

- Divider 用于分隔同一容器内的内容组、列表区段或并列信息，不用于代替卡片边框。
- 当留白已经能清楚表达层级时，不额外添加分割线，避免页面过度切割。

#### 属性枚举

- `type`：`horizontal / vertical`，默认使用水平分割线。
- `dashed`：`false / true`，默认实线。
- `title`：`false / true`，默认无标题。
- `position`：`left / center / right`，仅当水平分割线开启标题时有效。
- `inset`：`full / left / content`：
  - `full` 通栏，线条覆盖父容器的可用宽度。
  - `left` 左侧缩进，适用于左侧存在头像、封面图片或固定图形区域的列表。
  - `content` 内容缩进，左右两侧都与正文内容边界对齐。

#### 样式与尺寸

- 水平和垂直分割线厚度均为 1px。
- 线条颜色使用 `Border/default`。
- 深色背景不固定使用 `Border/default`，应切换为在该背景上具有合适对比度的浅色透明 Border 语义变量。
- 标题颜色使用 `Text/Tertiary`。
- 标题绑定 `中文/S8-CN-R`：14/22，400。
- 标题与两侧线条间距为 16px；标题侧的短线参考长度为 24px。
- 当前垂直分割线基准高度为 20px。
- 静态组件基座为 `gj-divider`。水平无标题用 `gj-divider-plain`（无子级 `span` 时也按通栏单线渲染），虚线 `gj-divider-dashed`，标题位置 `gj-divider-start / -end`（不写为居中），垂直用 `gj-divider-vertical`。缩进用 `gj-divider-inset-left`（左侧 48px，`--ds-space-10`，对齐 32px 头像 + 16px 间距）与 `gj-divider-inset-content`（左右各 16px）。线条颜色引用 `--ds-border-default`。页面不得把分割线样式写在私有 CSS 里。

#### 属性依赖与无效组合

- `position` 只对 `horizontal + title=true` 生效。
- Vertical Divider 不支持标题，因此 `vertical + title=true` 是无效组合。
- Vertical Divider 不使用标题位置属性。
- Divider 本身不携带固定外边距；它与上下或左右内容的距离由父容器和具体页面层级控制。
- Divider 的通栏或缩进边界必须跟随父容器和相邻内容对齐，不使用无依据的临时偏移值。

#### 边界规则

- 内容分隔优先使用留白；只有信息量复杂、仅靠留白无法清楚表达层级时，才使用线性 Divider。
- 实线用于主要内容层级分隔；在已经使用实线后，下级内容仍需进一步分割时，可使用虚线表达更弱的辅助层级。
- 分割线颜色较浅时，应在真实容器背景上判断，不得仅为预览清晰而修改正式 Token。
- 同一内容组保持线型一致，不在没有语义差异时混用实线和虚线。
- 表格行、列表项等已有 `bottom border` Effect 的场景，不重复叠加 Divider。
- Vertical Divider 的 20px 是默认值，允许根据两侧内容高度和具体设计稿调整。
- 带标题 Divider 只用于弱分组说明，不能代替正式模块标题；标题建议 2–8 个字、保持单行，过长时应改用正式标题结构。
- Divider 始终不可点击，也不承载展开、收起、跳转或选择行为；交互必须由对应标题、行项目或专用组件承担。

