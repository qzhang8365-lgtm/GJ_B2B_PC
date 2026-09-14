# Button

> 从 `references/design-system-rules.md` 拆分（2026-09-08）。跨组件的颜色/字体/布局/圆角等基础规范见该文件“基础规范”章节。

生成代码或检查精确属性时，读取 `tokens/components/button.tokens.json` 与 `tokens/components/text-button.tokens.json`。其中属性枚举、状态矩阵、尺寸别名、运行时状态和组合边界已经进入统一 Token 包；以下文字规则用于解释选择逻辑。

#### Button 用途

- Button 用于触发操作、提交任务或进入下一流程。
- Button 具有容器高度、内边距和明确操作权重；仅需要轻量文字触发且不希望影响容器高度时使用 Text Button。
- 不要用 Button 表达导航路径、选项选择或状态；那些场景分别使用 Breadcrumb / Tabs / Sidebar、Checkbox / Radio / Selector、Tag / Badge。

#### Button 层级

- Primary：主操作，默认填充品牌色与反色文字；同一区块尽量只出现一个。
- Secondary：次操作，蓝色文字和蓝色边框，Hover 使用轻量背景。
- Tertiary：弱操作，主文本和中性边框。
- Ghost：最轻操作，无描边；不能因为存在 Stroke 颜色绑定就生成可见边框。
- 通用 UI 语境常把「Ghost Button」「Text Button」「Link Button」混用；在本 Skill 里两者不是同一个组件：Button 的 Ghost 级别保留容器高度/内边距/圆角，只是无描边、无背景色，仍按 Button 的尺寸档位参与按钮组排布；Text Button 完全没有容器和内边距，是更轻一级的独立组件，见 `text-button/rules.md` 的适用场景。需要与其它按钮同排等高对齐时用 Ghost；需要零高度影响、贴文字排布时用 Text Button。
- 两个按钮并排时避免相同视觉权重，通常采用 Primary + Secondary 或 Primary + Tertiary；弱操作也可以落到 Text Button。
- Danger 与 Success 不是 Level，只作为高强调填充意图，见下文「层级与状态」。

#### Button 属性枚举

- `label`：按钮文字，默认“按钮”。
- `level`：`Primary / Secondary / Tertiary / Ghost`，默认 `Primary`。
- `size`：`Large / Medium / Small`，默认 `Medium`。
- `state`：`default / hover / pressed / disabled`，默认 `default`。Hover 与 Pressed 是交互状态，不应作为业务人员手动选择的常驻状态。
- 运行时状态补充必需的 `loading`，并可选支持 `completed`。Completed 是按场景启用的短暂完成反馈，不是所有按钮的固定状态，也不是长期停留状态。
- `icon`：`none / left_icon / right_icon / icon_only`，默认 `none`。
- `intent`：`normal / danger / success`，默认 `normal`。Danger 与 Success 仅用于需要强信息确认的关键操作。
- `icon_only` 不显示文字，但必须具有可被识别的操作含义；语义不清时禁止只使用图标。详见「icon-only 边界」。

#### Button 尺寸枚举

- Large：高度 40px，横向内边距 16px，圆角 8px，文字 16/24，绑定 `中文/S7-CN-R`。
- Medium：高度 32px，横向内边距 12px，圆角 6px，文字 14/22，绑定 `中文/S8-CN-R`。
- Small：高度 24px，横向内边距 8px，圆角 4px，文字 12/18，绑定 `中文/S9-CN-R`。
- 尺寸按容器层级选择，不按业务名称选择；与输入框等控件并排时，按钮高度必须与主控件一致。
- 同一按钮组保持相同尺寸，除非具体设计稿明确区分主次尺寸。
- 多按钮并列时，Small 间距 4px、Medium 间距 8px、Large 间距 12px。
- Icon Only 热区为正方形，宽高等于对应档位高度：Large 40、Medium 32、Small 24。图标 20 / 16 / 12，随档位递减。

#### Button icon-only 边界

- 只用于含义明确、已有稳定认知的操作，例如搜索、筛选、更多、删除、关闭工具条动作。
- 语义不清、同一页面多个图标容易混淆、或动作需要解释对象时，禁止只用图标，应改用 `left_icon` / `right_icon` 加文字。
- 可见文字省略，代码必须提供 `aria-label`（或等效无障碍名称）；没有名称的 icon-only 不得生成。
- 含义明确时不强制 Hover Tooltip；不明确或易混淆时补充 Tooltip，而不是把说明写进按钮内部。
- 工具栏、表单和带级别的图标操作用 `gj-btn` + `gj-btn-icon-only`，继承 Primary / Secondary / Tertiary / Ghost。
- 弹窗关闭、卡片工具等轻量无填充入口使用 `gj-icon-button`（热区 32px、图标 16px），不要与 Button icon-only 混用。
- Text Button 没有 icon-only 轴，不得把 `gj-text-btn` 收成正方形图标按钮。
- Loading / Completed 需要文案表达进程，不以 icon-only 承载「保存中」「已保存」。
- Small icon-only 上下内边距与 Medium / Large 相同，绑定 `Interval/space1`（0）。不新增 5px 间距 Token；Interval 阶梯是 0 / 4 / 8 / 12，5px 不在阶梯上。实现 `.gj-btn-icon-only` 使用正方形热区、`padding: 0`。

#### Button 层级与状态

- Primary：主操作，默认使用 `Button/Primary/Bg-default` 与反色文字；Hover、Pressed、Disabled 使用对应 Primary 状态 Token。
- Secondary：次操作，使用蓝色文字和蓝色边框；Hover 使用轻量背景反馈。
- Tertiary：弱操作，使用主文本和中性边框；Hover 与 Pressed 使用中性背景反馈。
- Ghost：最轻操作，无描边；Default 与 Disabled 使用 `Background/Container`，Hover 使用 `Background/Background`，Pressed 使用 `Background/Secondary`。
- Ghost 所有状态均不出现描边，不能因为存在 Stroke 颜色绑定就生成可见边框。
- Danger 使用红色按钮 Token，适用于删除、终止、拒绝等需要强确认的危险操作。
- Success 使用绿色按钮 Token，适用于通过、确认成功等需要强确认的正向操作。
- Danger 与 Success 当前限定为高强调填充按钮，不扩展红色或绿色的 Secondary、Tertiary、Ghost 组合，除非后续 Figma 正式增加。
- Figma Button 组件目前只有 Primary / Secondary / Tertiary / Ghost 四级；Danger / Success 不是 Level。静态基座仍保留 `gj-btn-danger` / `gj-btn-success`，供模式页的破坏性或强确认操作复用，避免页面自绘红/绿按钮。Button 规范页在 Figma 补齐对应变体前，不把它们当作级别展示。
- Disabled 状态不得响应点击或按压动效。
- Loading 状态使用图标库中已上传的动态 Loading Icon，并配合具体场景文案，例如“保存中”“正在提交”。Loading Icon 的填充颜色必须跟随按钮文字颜色。
- Loading 期间保持按钮原有尺寸和操作意图，不响应重复点击。
- Loading 成功后默认恢复按钮、更新页面或进入下一流程；仅当页面不会立即变化、且需要在原位置明确确认成功时，才可短暂进入 Completed，显示完成图标与“已保存”“提交成功”等文案后恢复原按钮。
- 如果成功后页面立即跳转、弹窗关闭或内容直接切换，则无需额外显示 Completed。
- 操作失败时按钮恢复可操作状态，错误原因由 Toast、表单错误或页面消息承担，不建立长期 Button Error 状态。
- Focus 不是按钮设计态：Figma 不增加 Focus variant，不做 Prototype Reaction，稿上不制作 focused。2026-09-10 设计确认按钮暂不需要 focused 展示态。Hover / Pressed 已有 Variant，运行时用 `:hover` / `:active`。代码继续保留原生 `:focus-visible`（环 `Background/BT_B20`、3px，不改变布局），仅服务键盘可达，不进入规范页状态矩阵，也不用 `is-focus` 冻结示意。
- 2026-09-10 BTN-005：`GJ_B2B` 已按角色收窄 Scope，并回归绑定 Button 192 个 Variant。Fill=`FRAME_FILL`+`SHAPE_FILL`（Background / Button），Stroke=`STROKE_COLOR`（Border），Text Fill=`TEXT_FILL`+`SHAPE_FILL`（Text，SHAPE_FILL 覆盖图标矢量），Height=`WIDTH_HEIGHT`（Components/control），Radius=`CORNER_RADIUS`，Gap=`GAP`（Interval，含内边距）。Primitive / Brand / Table / Feedback / Chart 仍为 `ALL_SCOPES`。本地 CSS 继续按填充、描边、文字、高度、圆角、间距分属性消费。

#### Button 组合规则

- Button 内的 Icon 与按钮文字必须保持同色。Icon 继承 Button 当前文字色，并随 Default、Hover、Pressed、Disabled、Loading 和 Completed 状态同步变化；不得出现文字已经变色而 Icon 仍保留资源原色的情况。
- 静态 HTML/CSS 示例优先使用 `mask-image` 与 `background-color: currentColor`；前端封装 SVG 时使用 `fill="currentColor"` 或 `stroke="currentColor"`。只有不可替代的多色业务图标允许例外，并标记为待设计确认。

- 按钮按操作权重选择：主操作使用 Primary，同一区块尽量只出现一个；次操作使用 Secondary；弱操作使用 Tertiary 或 Text Button；最轻等级使用 Ghost。
- 两个按钮并排时避免使用相同权重，通常采用 Primary + Secondary 或 Primary + Tertiary。
- 按钮组的视觉顺序和操作优先级必须一致，不能让次操作比主操作更突出。
- 按压允许 `scale(0.98)` 的轻微缩放反馈，禁止向下位移。
- 按钮文案应短而明确。中文建议 2–6 个字，原则上不超过 8 个字；超过时优先精简动词与对象，不允许换行形成双行按钮。
- Button 保持单行；宽度可随合理长度的内容增长，但不能依赖无限增长容纳说明性句子。
- Loading 状态必须禁止重复触发，并保持按钮原有宽度稳定；Loading 图标或状态文案替换不得造成相邻布局跳动。
- Danger 操作按结果是否可恢复决定是否二次确认：删除、清空、撤销提交等不可恢复或高风险操作必须确认；可撤回、低风险且结果清楚的操作可以直接执行。
- Button 允许使用容器满宽，但只用于登录、表单提交、窄卡片等具有单一明确主操作的场景；普通桌面工具栏和多操作区不使用满宽按钮。
- 静态组件基座为 `gj-btn`，不写级别时按 Tertiary 渲染。级别用 `gj-btn-primary / -secondary / -tertiary / -ghost`，尺寸用 `gj-btn-small / -large`，纯图标用 `gj-btn-icon-only`，图标子元素为 `gj-btn-icon` 并通过 `--gj-icon` 传入地址。
- Hover 与 Pressed 必须写成 `:hover:not(:disabled)` / `:active:not(:disabled)`，不得依赖声明顺序压过 Disabled。表格内的 `gj-text-btn` 只覆盖尺寸与间距，不得覆盖颜色，以免 Disabled 失去 `Text/disable`。
- Loading 使用 `gj-btn-loading` 或 `aria-busy="true"`，旋转 `gj-btn-icon`（资源使用 `icf_system_loading1`，颜色跟随文字）。期间 `pointer-events: none`，保持原有高度，文案改为进行中语义如“保存中”。Completed 使用 `gj-btn-completed` 与完成图标，同样不响应点击。
- 轻量无填充图标入口（弹窗关闭、卡片工具）使用 `gj-icon-button`，热区 32px、图标 16px；具备 Hover / Pressed / Focus / Disabled，但 2026-09-10 起 Hover 仅改变图标颜色（`Text/primary`），热区不叠加背景色（设计确认背景色视觉效果不佳）——Pressed 仍保留 `Background/Hover_2` 背景与缩放，Focus 环与 Disabled 灰化均不变。工具栏、表单和带级别的操作用 `gj-btn gj-btn-icon-only`，不要把这两套混用。
- 意图色独立于级别：`gj-btn-danger`（`gj-btn-delete` 为其别名）与 `gj-btn-success` 只提供高强调填充，引用 `--ds-component-button-intent-*` Token。它们不进入 Button 规范页的级别矩阵，直到 Figma 增加对应变体。
- 文档页可用 `is-hover / is-pressed / is-disabled` 并列展示交互态；业务页面只使用 `:hover`、`:active` 和 `[disabled]`。页面不得再自绘 `.gj-button` 或手写按钮色值。
- 对话框底部按钮顺序遵循本 Skill 的 Modal 规则：次操作在左、唯一主操作在右；该顺序不自动扩展到普通页面工具栏。

