# Text Button

> 从 `references/design-system-rules.md` 拆分（2026-09-08）。跨组件的颜色/字体/布局/圆角等基础规范见该文件“基础规范”章节。

生成代码或检查精确属性时，读取 `tokens/components/button.tokens.json` 与 `tokens/components/text-button.tokens.json`。其中属性枚举、状态矩阵、尺寸别名、运行时状态和组合边界已经进入统一 Token 包；以下文字规则用于解释选择逻辑。

#### Text Button 属性枚举

- `label`：文字内容，默认“按钮”。
- `size`：`Large / Medium / Small`，默认 `Large`。
- `state`：`default / hover / pressed / disabled`，默认 `default`。
- `iconPlacement`：`none / left / right`，默认 `none`；不提供 Icon Only。
- Icon 支持替换，但必须引用设计系统图标资源。

#### Text Button 尺寸与样式

- Large：高度 24px，文字 16/24，图标 20px，绑定 `中文/S7-CN-R`。
- Medium：高度 22px，文字 14/22，图标 16px，绑定 `中文/S8-CN-R`。
- Small：高度 18px，文字 12/18，图标 12px，绑定 `中文/S9-CN-R`。
- 所有尺寸和状态的可见内边距均为 0，图标与文字间距固定为 4px。
- Default 使用 `Text/Secondary`；Hover 使用 `Text/Primary`；Pressed 使用 `Text/blue`；Disabled 使用 `Text/disable`。
- Text Button 没有背景和描边，不得通过添加可见 Padding 把它改造成普通 Button。
- Text Button 无内边距，用于进入下级页面、查看更多、筛选触发和需要避免按钮高度影响容器的场景。
- 需要更大点击范围时，应由外层命中区域提供，不改变 Text Button 的视觉尺寸和页面排版。
- Text Button 按压同样允许轻微缩放，不使用向下位移动效。
- 当前不要求在 Figma 中为 Hover / Pressed / Disabled 建立 Prototype Reaction；这些仍是正式状态，代码必须依据状态契约实现，不能把“没有原型连线”理解为“不需要交互态”。
- 静态组件基座为 `gj-text-btn`，不写尺寸按 Medium 渲染，`gj-text-btn-large / -small` 对应 24/18px。图标子元素为 `gj-text-btn-icon`。文档页可用 `is-hover / is-pressed / is-disabled` 冻结交互态。页面不得再自绘 `.gj-text-button`。 需要蓝色默认态时在此基础上叠加 `gj-text-btn-blue`（见下方「颜色变体」）。

#### Text Button 颜色变体（Blue，2026-09-28 新增）

- 灰色默认态是 Text Button 的标准契约（Default=`Text/Secondary`，Hover=`Text/Primary`，Pressed=`Text/blue`，Disabled=`Text/disable`），绝大多数场景直接用 `gj-text-btn`，不改动默认态颜色。
- 2026-09-28 起新增一个并存的蓝色默认态变体：在 `gj-text-btn` 基础上叠加 `gj-text-btn-blue`（`class="gj-text-btn gj-text-btn-blue"`），用于业务明确要求“操作类按钮默认就是蓝色”的场景（例如表格行内操作需要更强的可操作性提示）。这不是把标准 Text Button 的默认态改成蓝色，是新增一个可选变体，两者并存，默认仍是灰色。
- Blue 变体状态色：Default 用 `--ds-text-blue`（即 `--ds-primitive-blue-b06`）；Hover 用 `--ds-primitive-blue-b07`（比 Default 深一档，方向与灰色变体“悬停加深”一致）；Pressed 用 `--ds-primitive-blue-b08`（再深一档）；Disabled 复用同一个 `Text/disable`，不单独定义蓝色禁用态。
- 是否使用 Blue 变体由业务场景决定，不是尺寸/图标之外的必选属性；未显式声明 `gj-text-btn-blue` 时一律按灰色默认态渲染。
- 这是表格通用规则，不是针对某一个具体页面的特例：凡是表格行内可点击的交互操作控件都算数，包括主表格行内操作，也包括表格内嵌的详情/弹窗子表格（例如详情弹窗里的文件名、下载）；同一张表里所有这类控件要么都用灰色默认态，要么都用 Blue 变体，不要在同一张表里混用两种默认色。

#### Text Button 适用场景

- 次要 / 辅助操作：页面或弹窗已有 Primary（或 Secondary/Tertiary）承担主操作时，次要动作用 Text Button，避免和主操作抢视觉权重。典型如 Modal 内的取消入口、表单的重置入口、卡片上的查看详情/编辑/删除入口。
- 低风险、可逆操作：展开/收起、刷新、复制、返回等点错代价低的操作，Text Button 的轻视觉重量正好传达"可撤销、不严重"。
- 密集列表 / 表格行内操作：表格每行或列表项都需要操作入口（编辑、删除、更多、回复、转发、收藏）时用 Text Button，不用实心 Button，避免大片色块造成视觉噪音——这也是表格行内固定使用 `gj-text-btn` 的原因（见「Button 组合规则」关于表格内 `gj-text-btn` 的说明）。
- 工具栏 / 操作条：一排功能需要密集并列展示（编辑器加粗/斜体/对齐、顶部操作条）时，Text Button 或图标按钮能紧凑排列而不产生大片色块。
- 导航 / 跳转类：本质是页面跳转但需要和按钮交互语言保持一致时（查看更多、了解详情、前往设置），用 Text Button；如果是纯粹的内容内超链接，应使用下划线的链接样式而不是按钮样式，避免用户混淆"跳转"与"操作"。
- 空间受限场景：卡片角落、弹窗标题栏、侧栏等横向空间紧张的位置，用 Text Button 省去容器和边框。但如果场景要求纯图标、不带文字，不能用 Text Button（无 icon-only 轴，见上）；应改用 `gj-icon-button`（弹窗关闭、卡片工具等轻量入口）或带级别的 `gj-btn-icon-only`（工具栏、表单场景），并按 Button 的 icon-only 边界规则提供 `aria-label` 或 Tooltip。
- 纯文字 vs 文字 + 图标：操作含义明确、用户熟悉（如"取消""编辑"）用纯文字；操作需要快速识别或语义较弱（如"新建""刷新"）用文字 + 图标增强识别；图标含义有歧义时必须保留文字或补充 Tooltip——图标不能替代文字，只能是文字已经足够清楚时的可选增强。
- 不适用场景：页面或弹窗的主操作应使用 Primary Button，Text Button 视觉太轻，用户可能找不到；不可恢复的高风险操作（如永久删除）需要更强的视觉警示和二次确认，不能让弱视觉的 Text Button 承担确认动作；表单最终提交需要明确的 Primary 确认按钮；首次使用需要强引导、用户还不熟悉的场景，Text Button 容易被忽略，应改用更醒目的按钮层级。
