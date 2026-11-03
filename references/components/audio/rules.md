# Audio 音频

> 来源：Figma `5026:7599`「音频Audio🆕」，2026-10-27 完成全量复核。生成或检查页面时先读 `schema.json` 与 `audio.tokens.json`，不要只按名称猜测播放器结构。

## 变体选择

- `mini`：详情、记录、弹窗、抽屉等紧凑区域的播放条。默认宽度参考 587px，高 34px；可显示日期时间、进度、时长和关闭。
- `full`：独立音频详情或内容区播放器。宽度参考 656px，上方整行进度条，下方为音量、居中的上一首/播放/下一首、右侧时长。
- `list` / `list-item`：音频列表。列表项默认不显示播放图标，Hover 时出现 16px 播放图标并使用 `Background/Hover`；标题、日期和时间不能因图标出现而换行。
- `item-button`：28px 圆形播放/暂停按钮，用于列表项、卡片或 Full 控制器；不是通用 Icon Button 的替代品。

## 结构与尺寸

- Mini：587×34px，内边距 8/12px，顶层 gap 21px，圆角 8px；浅蓝背景、1px 品牌蓝描边。图标 16px，控制区 gap 18px。
- Mini 宽度跟随容器收缩，不固化为 587px。当组件自身宽度不足 520px 时隐藏录制时间，不足 340px 时再隐藏时长；优先保留播放控制和可操作进度条，不得溢出父容器。
- Audio Bar：独立基准为 400×16px；放入 Mini 或 Full 后应弹性适应剩余宽度，不锁死为 200px。轨道 4px、圆点 8px，白底蓝描边并使用小阴影。
- 进度条与音量条的圆点中心必须与可见轨道中心重合。WebKit 内核应使用 `(trackHeight - thumbSize) / 2` 作为圆点纵向偏移；不得依赖浏览器默认 Range 对齐。
- List Item：440×60px，内边距 8/12px，纵向 gap 4px；标题 14/22 Semibold，日期时间 12/18 Regular。
- Audio List：设计稿参考宽 357px，列表项宽度跟随容器；示例 5 行不构成数量上限。
- Full：656×52px，纵向 gap 8px。控制行 gap 16px；中间控制组 gap 26px，上一首/下一首图标 20px；播放按钮 28px、内部图标 16px。
- 音量：图标 20px，图标与滑块 gap 8px；滑块 80×6px、轨道 2px、圆点 6px，圆点为 `Brand/GJ_Blue` 实心蓝色，保留 small shadow；不得套用主进度条的白底蓝描边圆点。

## 状态与交互

- `paused` 与 `playing` 是同一组件位置的状态切换，不渲染两套控件。根节点使用 `.is-playing`；运行时同步 `aria-pressed` 和 `aria-label`。Item Button 与 Full 在图标伪元素上统一通过 `--gj-icon` 切换，不得用另一层 `mask-image` 覆盖基础 mask，也不得把变量放到带背景的按钮根节点上，避免本地/Figma 内嵌转换误把整颗按钮当成纯图标。
- 所有音频控制按钮必须提供默认 Hover 反馈，统一使用 `Background/MK_20`（黑色20%）加深。Full 与 Item Button 的圆形主播放/暂停按钮在原品牌蓝背景上叠加20%黑色，白色图标保持不变；上一首、Mini 播放/暂停、下一首及关闭只对 SVG 图形像素加深，透明部分保持透明，不出现矩形底色，关闭也不再切换成 Text/Primary。图标层使用等效亮度系数 `0.8` 以兼容 mask、内嵌 SVG 和 Figma 导入；不改变尺寸、描边或位置。Disabled 不响应 Hover。
- Mini 的暂停图标使用 `icf_media_pause-regular`；Full/Item Button 的暂停图标使用 `icf_media_pause-fill`，保持与 Figma 视觉重量一致。
- 上一首/下一首表示列表切换，不表示快进/快退；没有列表上下文时用 `disabled` 保留占位。
- Mini 的关闭只收起播放条，不删除音频数据；`closable=false` 时不渲染关闭按钮。共享基座必须显式支持根节点 `[hidden]`，避免 `display:flex` 覆盖浏览器默认隐藏规则；重新显示清除hidden即可。
- Full 才显示音量控件；不要把音量、倍速、下载挤入 Mini。
- 音量为0时，音量图标切换为图标库 `icf_media_volumeoff-fill`；调至大于0时恢复 `icf_media_volume-down-fill`。初始化为0、鼠标拖动、键盘调节和真实媒体 `volumechange` 均须同步图标、轨道与滑块值；媒体 `muted=true` 也显示静音图标，向上调节音量时解除静音。静音不等于暂停，不改变播放状态；共享运行时使用图标 `.is-muted`，range 的 `aria-valuetext` 同步为“静音”或音量百分比。
- 音量图标使用 `button.gj-audio-volume-icon[data-action="mute"]`，点击切换静音：静音时滑块与填充归0，再次点击恢复最近一次非零音量；初始即为0且无历史值时恢复默认30%。鼠标、Enter与Space均可操作，`aria-pressed` 表达静音状态、标签在“静音/取消静音”之间同步；Hover只加深图形，键盘聚焦显示焦点环。
- List Item 的 Hover 图标和背景属于同一个状态；触屏环境没有 Hover 时，业务必须提供可发现的播放入口（例如点击整行或常驻 Item Button）。
- 可交互的 Audio List 默认不固定任何条目的 Hover；仅鼠标当前悬停项显示 Hover，移出后恢复。`.is-hover` 仅供独立、明确标注的静态状态对照样例使用，不得混入同一交互列表，否则会与真实 `:hover` 叠成两条高亮。

## 复用与实现边界

- 使用共享 `.gj-audio-progress` 作为音频进度基座；不得嵌入 Figma 导出的静态进度图片。
- `assets/scripts/gj-audio.js` 是原型/预览运行时：有 `audio.gj-audio-media` 时控制真实媒体，没有时只模拟进度。真实前端代码应按项目技术栈实现同一状态契约。
- 任何允许操作的 Mini/Full 展示实例也必须在根节点挂载 `data-gj-audio`，控制按钮提供 `data-action="play/prev/next/close/mute"`。仅引用 CSS 不能视为接入完成；拖动进度时必须同步圆点、填充和时间，音量拖动必须同步填充；每个实例由共享运行时初始化一次。
- 进度与音量的可见轨道只由组件基座渲染，必须隐藏浏览器原生 range track，避免出现双轨、断裂或色差。整条进度轨道均可点击/拖拽，不能只让圆点响应。
- 图标必须取 PC Skill 图标库并继承组件颜色；禁止在页面中重画三角形、暂停线或音量图标。
- 预览页只用于人工验收，组件真值以本目录 schema/mapping/audit 与组件 Token 为准。

## 无障碍

- Figma 未发布 Disabled 变体时，控制按钮使用一次50%透明度兜底并设置原生 `disabled`；不叠加 Hover，不在父子两层重复降低透明度。
- 动态插入实例后调用 `GjAudio.initAll(容器或根节点)`；初始化必须幂等，控制器内主播放按钮不得再接一套独立 Item Button 监听。未给起始时间时从0开始；真实媒体以自身播放状态为准，结束时恢复播放入口。

- 播放、暂停、上一首、下一首、关闭都使用原生 `button`。
- 播放按钮必须维护 `aria-pressed` 和随状态变化的“播放/暂停”标签。
- 进度与音量使用 `input[type=range]`，分别提供“播放进度”“音量”标签。
- 列表项使用 `button` 或等价键盘语义，不允许只绑定不可聚焦的 `div`。
