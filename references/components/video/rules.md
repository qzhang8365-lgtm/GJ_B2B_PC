# Video 视频

> 一级分类【业务组件】下的视频组件。2026-10-26 对 Figma 页面 `3936:2570`（视频Video 🆕）完成真审计；结构化真值见 `schema.json`、`mapping.json` 与 `references/tokens/components/video.tokens.json`，差异与默认处理见 `audit.md`。

#### 用途

- 视频列表卡：展示视频封面、时长、播放量、标题与作者日期，用于视频栏目、路演回放、培训课程等列表，点击进入播放。
- 播放器：在详情页或弹层中播放单个视频，底部为统一控制条。
- 不用于音频（用 Audio），不用于图片轮播（用 Carousel）；动图或装饰性短循环不加控制条。

#### 组成

- `Video_List_unit`（state=Default / hover）= 封面 `Video_item/thumbnail` + 内容区（标题 + 作者 / 日期）。
- `Video_item/thumbnail`：封面底部左侧播放量 `playcount_tag`（可选，viewcount），右侧时长 `time_tag`。
- `Video_player/Default` = 画面 + `Player_controller`。控制条从左到右：播放 / 暂停 → 可选合并切换按钮（List=True）→ 音量 → 进度条（Fill）→ 时间「当前 / 总时长」→ 全屏。
- 控制按钮 `Video_item_button`：type = play / pause / full_screen / fullscreen_exit / volume / Video_item_listplaybutton；音量按钮 `Video_item_volume` 另有 state = default / slider / mute。

#### 尺寸与间距

- 控制按钮：36×36 圆形，`Background/MK_30` 底，图标 20、白色（`Text/reversal`）。hover 加深为 `Background/MK_45`，键盘聚焦显示 2px `Border/focused` 焦点环（VID-008）。
- 控制条：按钮、进度条、时间之间间距 12（Figma Pause / Playing 三种组合均为 12，VID-004 已关闭）；高度 36，宽度 Fill 播放器内容区。
- 进度条：高 4、圆角 2；轨道 `Background/MK_30`，已播放 `Brand/GJ_Blue`；圆点 12、`Text/blue`、`shadow-center`，始终位于已播放末端（VID-005）。时间文字 中文/S9-CN-R 12/18，白色 85%。
- 音量：默认态为 36 圆形按钮；悬停或聚焦时展开为 80×36 胶囊（slider 态）：左右内边距 8、图标与滑块间距 4，滑块宽 40、轨道高 2（`Background/WT_20`）、已选段白色、圆点 6 白色 `shadow_small`。静音态图标换为 volumeoff。
- 播放器：Figma 母版 1168×648、圆角 16、内边距 20，宽度随容器、保持比例；控制条贴底部内边距。无海报时显示默认深蓝渐变，不留空白；视频画面 `object-fit: contain`，不裁切画面。
- 封面：母版 280×180、圆角 8、内边距 12，宽度随列等分、保持比例；时长标签高 18、左右 4、圆角 4、`Background/MK_45`、中文/S10-CN-R 白字；播放量为 16px `icf_media_play` + 12/18 白字，间距 4。
- 列表卡：内边距 8、hover 背景圆角 16；内容区上 12 / 左右 4 / 下 4，标题与作者行间距 16；标题 中文/S4-CN-S 16/24，**固定两行高度**，超出省略；作者与日期 中文/S9-CN-R `Text/Secondary`，间距 12。多张卡网格排列时间距 8（VID-010）。

#### 交互与状态

- 播放 / 暂停是同一位置的切换按钮，图标随状态切换，读屏标签同步为「播放」/「暂停」。
- 进度条可点击跳转、可拖动；拖动时时间文字实时更新。时长统一 `mm:ss`，超过 1 小时用 `h:mm:ss`。
- 音量：点击音量图标切换静音，拖动滑块调节音量；音量调到 0 视为静音，显示静音图标。
- 全屏：点击切换进入 / 退出全屏，图标同步；浏览器拒绝全屏时保持页面内播放，不弹错误。
- 列表卡：整卡为一个点击热区；hover 显示 `Background/Hover` 背景、标题变为 `Text/blue`、封面中央出现 36 播放按钮（居中，VID-009）。Figma 无 pressed / disabled 态，不自行添加。
- 控制条在播放中可按业务需要自动隐藏，但暂停、拖动、键盘聚焦时必须常显。

#### 内容规则

- 封面优先使用视频海报图（`object-fit: cover`）；没有海报时使用组件默认渐变，不用纯色块或通用图标代替。
- 播放量与时长都可缺省：无播放量时关闭 viewcount，无时长时不显示时长标签；不显示 0 或「--」占位。
- 标题建议 30 字以内；作者行格式「作者：姓名」+ 日期 `YYYY-MM-DD`。
- 同一网格内卡片保持同一封面比例，不混用横竖封面。

#### 共享基座

- 独立进度条按下方「独立进度滑块」引用，不另外重画或复制播放器监听器。

- 动态插入播放器后调用 `GjVideo.initAll(容器或根节点)`，重复调用不重复绑定。接入真实媒体时以媒体自身的播放、音量、静音与结束事件同步控件；不把原型默认音量覆盖到真实媒体。
- Figma 未发布 Disabled 变体时，控制按钮以一次50%透明度和原生 `disabled` 兜底，禁用不响应 Hover；组合切换组只禁用实际不可用的方向按钮。

- 播放器 `gj-video-player`（`data-gj-video` 由 `assets/scripts/gj-video.js` 初始化）/ `gj-video-media` / `gj-video-controls` / `gj-video-btn`（`data-icon`）/ `gj-video-volume` / `gj-video-volume-slider` / `gj-video-progress` / `gj-video-time`。
- 列表 `gj-video-grid` / `gj-video-unit` / `gj-video-thumb` / `gj-video-playcount` / `gj-video-time-tag` / `gj-video-unit-play` / `gj-video-unit-body` / `gj-video-unit-title` / `gj-video-unit-meta`。不得在页面里重画控制按钮、进度条或封面标签。

## 播放列表与列表项（2026-10-29）

- 权威母版为用户指定的 `5422:5202`「音视频/播放列表项」，Default=`5422:5210`、Playing=`5422:5203`。旧 `5377:1972` 仍在画布，仅保留历史盘点，不作为新增页面引用入口。
- 单元参考320×72，宽度Fill；padding 12px 8px、gap8、radius8。左侧20px序号，当前项替换为20px `icf_media_play_fill`。信息列gap8、右内边距8；标题14/22/600单行省略，状态与时长12/18 UI、两端对齐。保留完整标题提示，不把长标题换行后撑破72px高度。
- Default背景透明、标题Text/Primary、序号Text/Tertiary、状态和时长Text/Secondary；当前项使用Background/Selected，标题/状态/播放图标Text/blue，时长仍Text/Secondary。Figma的Text/Tiatery按现有同色Text/Tertiary归一，不新增拼写错误Token。
- 序号严格复用Figma数字/S6-NUM-S（GJType Bold 14/22）；这是字体策略登记的精确局部例外。标题、状态、时长及标题栏计数仍使用UI字体，不推广到普通列表或其它数字。
- Playing视觉表示“当前媒体”，不是鼠标Hover。全列表最多一个`.is-current`并同步`aria-current=true`；暂停仍保留当前高亮，文案改为“已暂停”。播放时为“正在播放”，其它项按访问记录显示“已播放/未播放”；“已播放”不等于已完整观看。Default Hover可用Background/Hover提示点击，当前项Hover保持Selected；Focus-visible独立焦点环，Disabled按50%兜底。
- 列表外框来自项目组合样板`5377:2202`，宽336、radius12、Background/Background、Border/default 1px（属于有明确设计依据的二级容器）；标题栏高48、padding12、图标24 `icf_system_menu`、标题16/24/600、计数12/18，元素gap8。标题下复用共享Divider。内容左右padding8、项间gap0；默认超过6行（432px）独立滚动，标题不滚动。不得把6行当作总条目上限。
- 计数取“当前序号/真实条目总数”，无当前项为0/N；样板3/4与实际6项不一致，代码按实际数据生成，不复刻占位错误。
- 项目排列：左播放器自适应、右列表336、gap20、顶部对齐；局部容器不足800px时改为上下排列，列表占满容器。这里只改变组合列数，不改变单元规格。
- 根节点`[data-gj-video-playlist][data-player="#playerId"]`连接同页播放器；每项提供`data-duration`秒数、可选`data-src`真实媒体地址、`data-played=true`访问记录。只加载共享`gj-video.js`，不得复制页面私有选择逻辑。动态插入后调用`GjVideo.initAll(容器或根节点)`，保证每个实例只初始化一次。
- 点击/Enter/Space选择并播放，先清除旧当前项、更新唯一当前项和计数，再切换播放器；上下方向键/Home/End只移动焦点，Enter/Space才选择。共享上一首/下一首同步列表，无前项/后项时disabled；自然结束自动播放下一项，末项停止。切换保留各项已访问记录，进度从新媒体起点开始；媒体加载失败不显示虚假的播放状态。
- 基座：`.gj-video-playlist / -header / -heading / -count / -body / -item / -marker / -index / -current-icon / -info / -title / -meta / -status / -duration`。播放器仍引用现有`.gj-video-player`，标题栏图标与当前项图标复用Icon，标题分割线复用Divider。

#### 2026-10-26 复核边界

- 控制条有 Pause/False、Playing/False、Pause/True 三种 State/List 组合；List 默认 False。True 时播放按钮后显示 76×36 合并切换胶囊，左右内边距 12、上下 8、图标 20、间距 12。两个方向独立触发 gj-video-prev / gj-video-next，业务负责切换媒体。
- 封面与播放器均已绑定「深蓝渐变」（DB09 → DB06，2026-11-03复核）；播放器光效已删除。三个控制条时间文字仍是未绑定白85%，VID-006只保留这一部分。
- Figma 视频卡圆角仍为 16，继续保留；未将资讯卡的 12 套用到视频卡。
- 历史Playlist_item（2 variants）与controller_slider（独立组件）已计入盘点；播放列表按5422:5202、独立进度条按5387:3344均已完成工程化。

## 独立进度滑块 controller_slider（2026-11-03）

- Figma来源5387:3344，母版838×12；轨道5387:3341高4、radius2、Background/MK_30；已播放5387:3342使用Brand/GJ_Blue；圆点5387:3340为12px、Text/blue、shadow-center。圆点为几何形状，直接复用共享CSS，不生成图标或图片资源。
- 使用`.gj-video-progress[data-gj-video-progress] > input[type=range]`并加载`assets/scripts/gj-video.js`。宽100%、默认最大838，圆点/轨道尺寸固定。播放器内部仍用已有`.gj-video-progress`，不添加第二层初始化属性。
- input须有明确的aria-label；建议min=0、max=1000、step=1，value由业务提供。原生range保证范围收敛、步长和Arrow/Home/End键盘行为。点击轨道、拖动及键盘变化都同步填充；不拦截方向键另造一套算法。
- 单独使用无需媒体；可选`data-player="#playerId"`连接现有`[data-gj-video]`播放器，seek与播放器时间双向同步，切换播放列表重置进度。时长未知时同步为0，接真实媒体后以metadata/timeupdate为准。
- 独立初始化`GjVideo.initProgress(根节点)`，动态插入后`GjVideo.initAll(容器或根节点)`，重复调用幂等。程序化更新使用`根节点.__gjVideoProgress.setValue(value)`；变更事件`gj-video-progresschange`含value/min/max/ratio/type。初始化/媒体回填不触发变更事件，避免反馈循环。直接设置input.value后应派发input事件或调用refresh只更新视觉。
- Hover/Dragging保持原有颜色；Focus-visible显示Border/focused焦点环；Figma无Disabled，按原生disabled+根节点一次50%透明度兜底，禁止操作。这里补充的键盘/禁用行为是交付惯例，非Figma已发布变体。
- 当前Figma圆点中心236与已播放段282px不一致，延续VID-005已确认规则：运行时圆点中心与填充末端一致。原生thumb左右各预留半径，通过百分比+半径补偿计算填充位置，0/50/100%及缩窄后均保持对齐，不把绘制误差当作布局真值。

```html
<div class="gj-video-progress" data-gj-video-progress>
  <input type="range" min="0" max="1000" step="1" value="337" aria-label="视频播放进度">
</div>
```
