# Tabs 页签

> 从 `references/design-system-rules.md` 拆分（2026-09-08）。跨组件的颜色/字体/布局/圆角等基础规范见该文件“基础规范”章节。

#### 用途与类型枚举

- Tabs 用于同一页面或同一内容层级之间的分类、状态筛选、视图切换和多任务工作区，减少页面跳转并保持上下文。
- `Highlight`：常规内容分类、状态筛选和对象视图切换；可搭配图标和数量 Badge。
- `Card`：多任务工作区；可选关闭按钮，用于同时打开多个任务页面。
- `Pill`：紧凑的同层级选项切换，适合轻量筛选和局部视图。
- `Button`：分段按钮形态，使用选中块表达当前项。
- `Left`：容器内部的纵向分类，不替代全局 Sidebar。

#### 通用属性枚举

- `type`：`Highlight / Card / Pill / Button / Left`。
- `size`：横向类型为 `Small / Medium / Large`，默认 `Medium`。Figma 的 `3.Tabs-left` 组合当前只提供固定 Medium；不要把独立 `Left-item` 的 Small/Large 误当成已存在的 Left 组合变体。
- `count`：横向 Tabs 组件集支持 2–6 项；Left 支持 2–8 项。
- `activeIndex`：当前选中项，组内必须唯一。
- `icon`：可选，重点用于 Highlight；资源必须来自图标库。
- `badge`：可选数量徽标，重点用于 Highlight。
- `closable`：仅 Card 支持。
- `disabled`：可应用于不可选择的单项。

#### 状态枚举

- Default：未选中，可点击。
- Hover：鼠标悬停反馈，同组 Hover 只作用于当前项。
- Active：当前内容，组内互斥；存在可用内容时必须且只能有一个。
- Disabled：不可点击，不进入 Active；如当前内容失效，应先切换到有效项。
- Focus：键盘焦点，由代码侧补充清晰的 `:focus-visible`，不能用 Active 代替。
- Active 的字重按组件类型和尺寸使用已确认的 Figma 实例值，不统一强制成同一字重；尤其注意 Left 单项与 Left 组合存在实例覆盖。

#### 类型边界

- Highlight 支持 `icon / badge / disabled`；图标、文字、Badge 必须在各尺寸下保持垂直对齐。当前 Figma 母版只提供“图标”或“Badge”二选一的组合，不生成两者同时存在的样式。
- Card 的 Close Button 只用于可关闭多任务页签，普通内容分类不显示关闭图标。
- Pill 与 Button 是紧凑局部切换，不用于全局页面导航。
- Left 只用于容器内部的纵向分类；层级复杂时改用 Sidebar 或重组信息架构。
- 同一组 Tabs 的内容必须是平级关系，不把父子层级、不同任务权重或操作按钮混入。
- 静态组件基座中，五种类型分别对应 `gj-tabs-highlight / gj-tabs-card / gj-tabs-pill / gj-tabs-button / gj-tabs-left`，不写类型类时按 Highlight 渲染。尺寸档位使用 `gj-tabs-small / gj-tabs-large`，配色使用 `gj-tabs-theme-blue / gj-tabs-theme-neutral`（作用于 Pill 与 Card）。Tab 项为 `gj-tab`，选中态 `gj-tab-active`，附属元素为 `gj-tab-icon / gj-tab-badge / gj-tab-close`。分段控件必须复用 Button 类型，不得用 Text Button 或其他组件自行拼装选中块。
- Highlight 类型的 Tab 项间距为 24px。Pill 与 Button 类型的选项之间不留间距，由容器内边距和选中块自身表达分组关系。
- Highlight 类型的 Active 下划线是该类型专属视觉，不得泄漏到 Pill、Button 或其他类型。
- Highlight 的 Hover 只把文字改为 `Text/blue`，不加填充底。裸 `gj-tabs` 与显式 `gj-tabs-highlight` 必须同一套 hover。
- Hover 写在各类型上，不设全局 `.gj-tab:hover` 填充：Highlight 与 Left 只变为 `Text/blue`、背景不变；Card 保持 `Background/Background` 并改为 `Text/blue`；Pill 使用 `Background/Background + Text/Secondary`；Button 使用 `Background/Background + Text/Primary`。
- Pill 与 Button 的 Figma 默认灰底容器不带内阴影，选中块使用 `shadow_small`。仅在项目明确需要强化灰底内凹关系时，才通过 `gj-tabs-inset` 可选应用 `Innershadow_small`；所有 Effect 必须引用共享变量，不手写参数。
- Button Small 的独立 item 与组合实例统一为 24px，并使用同一 Small 高度 Token，不得再增加组合专属高度覆盖。Left 组合为 Medium、item 高 40px；代码基座使用 96px 宽，以在 16px 左右内边距下完整容纳常规四字标签。Active 只变为 `Text/blue` 和 600 字重，字号、行高及文字起始基线必须与 Default 一致；2px 左侧指示条从左内边距中扣除，不得把文字向右推移。更长标签保持单行并省略，不得穿出容器。Figma 原始 80px 与 S4 Active 作为来源差异留在审计记录，不用于页面生成。
- Figma 中尚未绑定 Dimension Token 的 Tabs 字面几何值当前允许保留；代码实现必须通过 Tabs 组件 Token 引用，禁止在业务页面重复散写。

#### 卡片顶部布局占位

- Tabs 的组件视觉高度、点击区域高度与页面布局占位高度是两个独立概念，不能为了修正布局距离而改变组件尺寸。
- 当横向 Tabs 是带内边距卡片中的第一个元素，且其上方没有标题、说明、工具栏等内容时，应启用“卡片顶部”布局变体：保持 Tab 项标准高度和点击区域，只缩减 Tabs 容器参与卡片内容流的占位高度。
- 静态组件基座使用 `gj-tabs-card-top` 表达该情境；业务代码应映射为等价的语义属性或布局变体，不复制一套新的 Tabs。
- Tabs 上方存在其他元素、位于页面主体而非卡片内，或需要按标准高度参与纵向排版时，不使用该变体。
- 不得通过减小卡片上内边距、负外边距、缩小 Tab 字号或压缩点击区域来模拟卡片顶部效果。

#### 背景与颜色

- 白色背景使用各类型默认样式。
- 灰色背景允许使用品牌蓝 Active 或白色中性 Active，以与背景清楚区分为准。
- 自定义颜色必须引用语义颜色，不直接使用 Primitive 或临时 HEX。
- 同一组 Tabs 保持统一配色逻辑，不让不同项使用不同 Active 颜色表达同一层级。

#### 内容与数量

- Tab 文案保持简短、单行和可区分，不使用完整句子；建议 2–6 个字。
- 不通过无限压缩间距或字号来容纳过多 Tab。
- 横向 Tabs 建议 2–6 项；Left 建议不超过 8 项。
- Badge 只承载简短数量或状态计数；数值过大时应使用上限形式或由具体组件规则处理。
- PC 端所有 Tabs 类型默认不使用横向滚动，避免鼠标滚动和拖动操作不友好。
- 空间不足时可让 Tab 项换行，或把低优先级项收入“更多…”Dropdown；选择方式应在同一产品内保持一致。
- Card Tab 关闭当前 Active 项后，默认选中相邻项并展示相邻页面；优先使用布局中自然相邻且可用的项。
- Card Tab 存在未保存内容时，关闭前必须二次确认。

#### 交互与无障碍

- 根节点使用 `role="tablist"`；每项使用 `role="tab"`、`aria-selected`、`aria-controls` 与 roving `tabindex`；内容使用 `role="tabpanel"` 和 `aria-labelledby`。
- 横向类型使用左右方向键，Left 使用上下方向键；同时支持 Home、End，Enter/Space 激活。
- Disabled 项跳过键盘焦点与选中；当前项失效时，先将 Active 移动到相邻可用项。
- Card 的关闭控件必须有可访问名称；点击关闭只执行关闭，不冒泡触发该 Tab。关闭 Active 项后默认选择相邻可用项；有未保存内容时先二次确认。
