# Audio 音频播放条

> 新增于 2026-09-28，来源 Figma `5026:7599`（页面「音频Audio」，文件 `8b01I1e3TzH1IhYlr3tJzd`）。生成代码或检查精确属性时，读取 `tokens/components/audio.tokens.json`；以下文字规则用于解释选择逻辑与组合边界。

#### Audio 属性枚举

- `state`：`paused / playing`，默认 `paused`；控制播放/暂停图标切换（对应 Figma 的 `State=Paused` / `State=Playing` 两个 Variant）。
- `recordedAt`：录音起始时间戳文案，默认示例 `2025-04-22 08:56:44`；内容由业务传入，不做格式约束。
- `progress`：播放进度，交由内部复用的 `.gj-slider`（0–100 或时间轴映射，由业务侧决定精度）。
- `elapsed` / `duration`：形如 `0:01/0:16` 的文案，固定摆放在进度条右侧、宽度锁定 60px（见下）。
- `closable`：是否显示右侧关闭按钮，默认 `true`；用于从容器（如详情弹窗、行内展开区）里移除该音频条。

#### Audio 尺寸与样式

- 容器：高度 34px（内容撑开，非固定行高裁切），左右内边距 12px、上下内边距 8px，圆角 `Radius/Radius-md`（8px），描边 1px `Brand/gj_blue`，背景 `Background/BG_blue`；容器整体 `max-width: 640px`（与 Figma 组件宽度一致），未设最小宽度时随父级收缩。
- 顶层子项横向间距（gap）21px：时间戳 → 控制区（上一首/播放暂停/下一首）→ 进度条 → 剩余时长 → 弹性留白 → 关闭按钮。
- 控制区（上一首/播放暂停/下一首）内部间距 18px，三个按钮均为 16×16px 的图标热区，无背景无描边（贴近 Icon Button 的「纯图标、无容器」用法，但本组件的三个控制按钮是 Audio 私有子元素，不复用独立的 `gj-icon-button`，因为它们的尺寸、间距、图标着色都被这一条播放条的场景锁死，没有必要额外抽出通用按钮语义）。
- 进度条直接复用 `.gj-slider`（`input-number` 组件的滑块基座），默认参考宽度 200px，与 Figma 里 `Audio_Bar` symbol 的 200×16px 规格完全一致；不重新实现滑块或用静态图片刻死进度条外观。
- 时间戳与剩余时长文案统一绑定 `中文/S9-CN-R`（12px/18px，Regular），颜色 `Text/Primary`；剩余时长文案宽度锁定 60px（Figma 实测值），避免时长位数变化（如从 `0:16` 变成 `59:59`）时把后面的关闭按钮挤动位置。
- 图标着色：播放控制区三个图标（上一首/播放-暂停/下一首）统一使用 `Brand/gj_blue`；关闭图标默认使用 `Text/Tertiary`，悬停加深为 `Text/Primary`（悬停仅换色，不做位移或缩放）。
- 播放/暂停为同一个按钮位置的状态切换：`state=paused` 显示三角形播放图标（`icf_media_play-triangle-fill`），`state=playing` 显示暂停图标（`icf_media_pause-regular`）；切换通过在根节点 `.gj-audio-bar` 上加/去 `.is-playing` 完成，运行时还需同步维护 `aria-pressed`/`aria-label`（见下方无障碍说明），CSS 本身不负责这部分。

#### Audio 静态基座与状态类

- 静态组件基座为 `gj-audio-bar`，语义子元素：`gj-audio-bar-time`（时间戳）、`gj-audio-bar-controls`（控制区容器）、`gj-audio-btn`（三个控制按钮的公共基座，配合 `gj-audio-btn-prev` / `gj-audio-btn-toggle` / `gj-audio-btn-next` 修饰符）、`.gj-slider`（进度条，直接复用已有组件不新起类名）、`gj-audio-bar-duration`（剩余时长）、`gj-audio-bar-spacer`（弹性留白，`flex:1 0 0`）、`gj-audio-close`（关闭按钮）。
- 播放态用根节点修饰符 `is-playing` 冻结（文档/预览页可用它固定展示某一状态，不依赖真实音频事件）。
- 关闭按钮默认存在；如业务场景不需要可关闭（`closable=false`），由使用方在渲染时不插入 `.gj-audio-close` 节点，组件本身不提供「隐藏但保留占位」的开关，避免多出不必要的留白判断逻辑。

#### Audio 适用场景

- 详情/记录类场景中展示一段可回放的音频（例如通话录音、语音留言）并提供基础播放控制（播放/暂停、上一段/下一段、进度拖拽、关闭）。
- 需要嵌入在弹窗、抽屉、展开行等容器内的轻量播放条，不是独立的全功能播放器页面；不承载音量、倍速、下载等扩展控制——这些如业务需要应在 `.gj-audio-bar` 外部另行放置对应控件（如 Text Button 的「下载」入口），不塞进本组件内部撑大宽度。
- 「上一首/下一首」用于同一列表内的音频切换（如同一通电话的多段录音、播放列表），不是音频内部的快进/快退；如业务只有单条音频、没有上一首/下一首的语义，仍建议保留两个按钮位以维持视觉节奏一致，运行时可将其置为 `disabled`，不建议直接从 DOM 移除（移除会破坏 21px 顶层间距的节奏和整体宽度预期）。

#### Audio 组合边界

- 不与 Modal/Drawer 的主操作按钮抢视觉权重：Audio 播放条是内容展示区的一部分，不是表单/弹窗的确认或取消入口。
- 进度条部分完全遵循 `.gj-slider` 自己的规则（轨道高度、滑块尺寸、激活色等），本组件不重复定义，只在放入 Audio 播放条时追加 `flex:none`，让其在横向 flex 布局里保持固定的参考宽度而不是被拉伸铺满。
