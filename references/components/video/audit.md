# Video audit

来源：Figma 页 `3936:2570`（视频Video 🆕），2026-10-26 通过 `get_metadata` / `get_design_context` / `use_figma` 只读核实；inventory 归入 `business` 分组（原占位页 `Video` 0 套）。

## 首次审计母版计数（历史快照）

- 组件集 4 套 / 13 variants：`Video_item_button`（`5153:434`，type 7）、`Video_item_button`（`5377:303`，音量 state 3）、`Video_List_unit`（`5153:487`，state 2）、`Player_controller`（`5157:2016`，1）。
- 独立组件 5 个：`Video_item/thumbnail`（`5153:440`，BOOLEAN viewcount）、`Video_item/time_tag`（`5153:462`）、`Video_item/playcount_tag`（`5153:469`）、`Video_player/Default`（`5157:2015`）、`Volumeslider`（`5377:300`）。
- inventory 记 **4 套 / 13 variants / 5 standalone**。

## 首次审计节点实测（历史快照；当前变更见末节）

- 控制按钮：36 圆形，`Background/MK_30`，图标 inset 22.22%（20）。图标母版均在「Icon图标✅」页：play-triangle（= 本地 `icf_media_play-triangle-fill`，路径一致）、pause-fill、skip-previous-fill、skip-forward-fill、fullscreen-regular、fullscreen-exit-regular、volume-down-fill、volumeoff-fill、play。
- 音量 slider 态：80×36，padding 8，gap 4；滑块 40 宽，轨道 2 高 `Background/WT_20`，已选段 `Background/Container` 27 宽，圆点 6 `Background/Container` + `shadow_small`。
- 控制条：HORIZONTAL gap 14；进度轨道 h4 r2 `Background/MK_30`，已播放 `Brand/GJ_Blue` 282 宽；圆点 12 `Text/blue` + `shadow-center`，x=326；时间 12/18 白色 85%（未绑定）。
- 播放器：1168×648，`Radius/Radius-XL`，padding 20，VERTICAL 底对齐；填充为未绑定的三段线性渐变，另有「播放器光效」两层径向渐变。
- 封面：280×180，r8，p12，底部两端对齐；填充为未绑定线性渐变 #102A52 → #246BFE。时长标签 h18 px4 r4 `Background/MK_45`，中文/S10-CN-R 白字；播放量 gap 4，图标 16，12/18 白字。
- 列表卡：p8 r16；内容区 padding 绑定 Interval/space4 / space2，gap 16；标题 中文/S4-CN-S h48 两行；作者行 gap 12，S9 `Text/Secondary`。hover：`Background/Hover`、标题 `Text/blue`、36 播放按钮 `calc(50%+2px)` 居中偏移。

## 差异与默认处理

- **VID-001**（已关闭，2026-10-26）：音量组件集 5377:303 已命名 Video_item_volume。
- **VID-002**（已关闭，2026-10-26）：5153:434 type 枚举已修正为 volume。
- **VID-003**（已关闭，2026-10-26）：5157:2016 已补 State=Pause / Playing，两态首按钮分别为 play / pause。
- **VID-004**（已关闭，2026-10-26）：5157:1885 与 5387:3358 实测 itemSpacing=12，与本地 Token 一致。
- **VID-005**（已按惯例处理）：进度圆点 x=326（中心 332）与已播放宽 282 不一致，实现让圆点始终位于已播放末端。
- **VID-006**（部分解决，2026-11-03复核，P3）：播放器5157:2015已绑定「深蓝渐变」与DB09/DB06色标，Token已同步；时间文字5157:1890 / 5387:3362 / 5389:3395的节点及文字分段颜色绑定仍为空，白85%不变，仅此项继续开放。
- **VID-007**（已关闭，2026-10-26，再复核）：上一个 / 下一个已合并为 5389:3451（76×36 胶囊），控制条 List=True 时在播放按钮后显示。
- **VID-008**（已按惯例处理）：控制按钮无 hover / focus 态，补 hover `Background/MK_45` 与 focus-visible 焦点环。
- **VID-009**（已按惯例处理）：列表卡 hover 播放按钮的 +2px 偏移视为绘制误差，实现严格居中。
- **VID-010**（已按惯例处理）：视频卡网格间距未定义，默认 8（卡片自带 8 内边距）。
- **ICO-006**（首次发现阶段的记录，现已关闭）：`icf_media_volume-down-fill`、`icf_media_volumeoff-fill` 当时在 Figma 图标页存在但本地图标库缺失，后续已随 line / fill 字体和 SVG 全量更新补齐；本段只保留问题发现时的审计轨迹。

## 实现

- 组件 Token：`references/tokens/components/video.tokens.json` → `--ds-component-video-*`，已接入 `build-tokens.mjs` / `validate-tokens.mjs`。
- 共享基座：`assets/styles/gj-b2b-components.css` 的 `.gj-video-*` 段，尺寸 / 颜色 / 间距全部取自 Token。
- 运行时：`assets/scripts/gj-video.js` 初始化 `[data-gj-video]`：播放 / 暂停、进度点击拖动、音量展开 / 静音、全屏切换；有 `<video>` 时绑定真实媒体事件，无媒体时以计时器模拟（规范页）。已登记 `library-index.json#scripts.previewRuntimes.video`。
- 规范页：`preview/video/index.html`，接入导航「业务组件 → 视频 Video」；规格卡数值从 Token 实时读取。

## 结论

Video 为 `figma-audited`。当前开放项：VID-006；ICO-006 已于两端 line/fill 接入后关闭。

## 2026-10-26 修改后逐项复核

- 当次复核母版计数为 **5 套组件集 / 16 variants / 6 standalone**，保留为历史证据。新增Playlist_item（5377:1972，2 variants）与controller_slider（5387:3344）当时尚未工程化；当前播放列表进度及新母版计数见2026-10-29补充审计。
- VID-006 仍开放：5153:440 封面、5157:2015 播放器、5157:1854 光效的 fillStyleId 为空，渐变色标无变量绑定；5157:1890 / 5387:3362 时间文字 fills 亦无变量绑定，白色透明度仍为 0.85。
- ICO-006 在本阶段仍开放：当时本地新增 SVG 与清单存在，但字体文件尚未重建；后续完整字体接入后已关闭，见文末最终结论。
- 卡片 5153:485 / 5153:488 均为 296×294、cornerRadius=16，保留 Figma 值。
- VID-005 / 008 / 009 / 010 继续按已确认惯例关闭，不将其表述为 Figma 已修正。

## 本地验证结果

- `build-tokens`、`validate-tokens`、`build-coverage --check` 与 `embed-icons preview/video/index.html --check` 均通过。
- `verify-page` 在 1440 / 1280 宽度执行，pageErrors 均为空；4 条报告均为 colgroup × thead/tbody 的结构误报。实测 colgroup display=table-column-group、无文字，不绘制覆盖内容，未修改通用校验脚本。
- 浏览器实测控制条 gap=12px、按钮宽=36px、卡片圆角=16px；播放器已改为下一个；按钮类型展示区保留 skip-previous 与 skip-forward 两种类型；点击播放/暂停后图标分别为 pause/play。

## 2026-10-26 第二次修改复核（当前）

- Video_item_button 现为 6 variants；type=Video_item_listplaybutton（5389:3451）76×36、radius999、px12/py8、gap12，两图标20。已同步 Token / 共享基座 / 规范页。两个方向分别为键盘可访问的按钮。
- Player_controller 当前为 Pause/False（5157:1885）、Playing/False（5387:3358）、Pause/True（5389:3391），gap 均12。List 默认False；True 时合并胶囊位于播放按钮后、音量前。尚无 Playing/True 母版，不宣称四种组合均已设计。
- 计数仍为 5 套 / 16 variants / 6 standalone（按钮少1、控制条多1）。
- 封面5153:440 fillStyleId=S:ff6fadb6c68e0d7bb1864eee83ef52e93fbf7b14,，样式「深蓝渐变」；色标绑定 Primitive/DeepBlue/DB09、DB06；本地复用 --ds-gradient-deep-blue。
- 播放器5157:2015只保留控制条子节点，光效已删除，本地相应删除 glow Token 与背景叠层。
- VID-006剩余：播放器5157:2015 fillStyleId为空且三个渐变色标无绑定；三个控制条的时间文字5157:1890 / 5387:3362 / 5389:3395仍为未绑定白色85%。
- ICO-006 在本阶段按用户安排留待补充，当时未重建字体；后续完整字体接入后已关闭。

### 第二次复核的本地验证

- Token / coverage / 图标内嵌检查通过。1440 / 1280 渲染无页面错误，仍仅4条 colgroup 结构误报。
- List 默认隐藏；勾选后合并胶囊实测76×36、gap12、padding8px 12px，两按钮各20×20；上一个与下一个分别触发 prev / next 事件。播放后图标为pause。
- 封面实测为180deg #21367A → #4167D8；播放器背景仅一层线性渐变，已无径向光效。

- 2026-10-26 阶段记录：追加导出音量/静音 line SVG（5375:529 / 5375:528），当时与 fill 共 4 枚等待字体重建；后续完整字体接入后 ICO-006 已关闭。

## 2026-10-26 line 字体接入

用户确认的 icon-gjb2b-line 包已覆盖 PC 与移动端 240 枚 line 资源；两枚音量 line 图标已进入真实字体（含 WOFF2），保留原调用名。本阶段 ICO-006 仍开放，因为 fill 字体尚未更新；随后 fill 字体接入完成后已关闭。两端 line 既有 231 编码、旧类名与兼容别名均保留；图标页 HTTP 验收无资源错误。

## 2026-10-26 fill 字体接入与图标审计关闭

PC与移动端均已接入音量/静音的line与fill完整资源、四种字体格式与原名称映射，HTTP预览无加载错误。ICO-006已关闭；图标轮廓/重名覆盖问题ICO-007已关闭。VID-006仍按最近Figma复核保留开放，不随图标更新自动关闭。

## 2026-10-29 完整性检查

- **VID-011 已关闭**：真实媒体初始化原先会被原型默认音量覆盖，且未监听volumechange/ended。现读取媒体自身状态，同步系统音量/静音与结束反馈，支持动态根节点幂等初始化；Disabled按全局50%兜底，不响应Hover。
- **VID-012 已关闭**：mapping误把中央播放图标放到封面外，已修正为封面内部；补齐控制按钮/列表卡状态矩阵，更新内嵌图标数据。
- **VID-013 已关闭（2026-10-29 播放列表补充）**：先前旧Playlist_item `5377:1972`仅盘点；现按用户指定的新权威母版`5422:5202`和项目排列样板`5377:1520`完成规则、映射、Token、共享基座、运行时与预览。独立controller_slider仍按VID-014保留。
- **VID-014 已关闭（2026-11-03）**：controller_slider `5387:3344`已补独立共享入口、运行时、Token、状态矩阵与规范页演示，验收见下方追加记录。
- VID-006仍待Figma补齐播放器渐变及时间文字绑定，本轮不自动关闭。
- 验收：1440/1280无溢出和页面错误，检查器仅有colgroup与thead/tbody表格结构重叠提示；HTTP实操播放/暂停、静音、List显示通过，合并组gap实测12px。浏览器真实video元素验证保留初始25%音量、外部音量/静音同步、重复初始化只切换一次；内嵌资源门禁通过。

## 2026-10-29 播放列表真实审计

- 用户指定组件集`5422:5202`（音视频/播放列表项），两态Playing=`5422:5203` / Default=`5422:5210`；TEXT属性为序号、视频标题、播放状态、视频时长，State为VARIANT。旧`5377:1972`仍存在，保留历史盘点但不再用于新页面。页面当前共6套/18 variants/6 standalone。
- 单元320×72，padding12/8、gap8、r8；marker20，信息列gap8、右padding8；标题S5-CN-S 14/22，状态与时长S9-CN-R12/18；序号为数字/S6-NUM-S GJType Bold14/22，已登记精确字体例外。
- 新当前项填充明确绑定Background/Selected；旧母版Playing采用Background/Hover，不能混用。Default无填充，Text/Tiatery旧拼写按同值Text/Tertiary规范化；当前标题和状态Text/blue，时长始终Text/Secondary。当前圆形播放图标命中本地图标icf_media_play_fill，不重画或下载替代资产。
- 组合`5377:2202`宽336、高481、r12、Background/Background、Border/default1px；标题48、padding12、gap8、menu图标24、标题16/24、计数12/18；内容px8、gap0，6×72=432。父详情卡`5377:1737`的padding20、gap20，播放器Fill左侧、列表固定右侧。
- 样板标题计数3/4与实际6项不符，运行时按真实数量生成3/6；Playing示例默认文字“未播放”是可编辑属性占位，不用于真实状态。当前暂停保留选中视觉并显示已暂停；自然结束/切换与真实媒体事件同步。
- 交互扩展：唯一当前项，键盘焦点与当前项分离；上下/Home/End只移动焦点，Enter/Space选择播放；上下首、边界disabled、自然结束续播、计数与已访问记录统一由共享gj-video.js管理。未接真实媒体时仅模拟，有video媒体时每项须提供data-src，不播放错误的上一条资源。
- 最终验收：1440宽规范站内测列表336×481、单元320×72、标题栏48；1280宽组合列为588+20+336，列表无溢出；1024宽规范站内局部容器688时改为上下排列，列表占满688、单元仍高72、播放器无溢出。图标及当前标题/状态实测同为rgb(43,115,255)，时长保持rgb(71,84,103)，Icon已转为非空内联SVG。
- 实际操作通过：单元点击/Space切到4/6时唯一aria-current；Home只把焦点移到首项而计数仍4/6；Enter后变1/6且上一个disabled；下一首变2/6；倒数第二项拖到结束自动6/6，末项下一个disabled且opacity0.5；末项结束停止，暂停保持当前高亮。独立HTTP页无控制台错误。
- file://三宽（1440/1280/1024）渲染无页面错误或溢出；脚本保留的提示为colgroup表格结构重叠，以及把蓝色当前图标与灰色隐藏序号配对的色差提示，已按互斥显示结构人工排除。规范站测试中出现一次MutationObserver目标非Node的宿主日志，未在独立HTTP页或file://渲染复现；未将此宿主日志归为播放列表实现问题。
- 截图在当前交付对话提供，不作为Skill运行时资源。当次VID-013关闭、VID-014与VID-006继续保留；最新状态见下方2026-11-03记录。

## 2026-11-03 独立进度滑块与绑定复核

- 只读get_design_context（含截图）及use_figma读取5387:3344/3340/3341/3342：组件838×12、轨道838×4位于y4、radius2、MK_30，已播放282×4为Brand/GJ_Blue；圆点12×12、Text/blue、shadow-center（15px、MK_10）。圆点是几何图形，直接复用CSS基座，不引入临时SVG资源。
- 当前绘图圆点中心236与填充282不符，延续VID-005既定规则按真实值统一。基座使用原生range语义；填充终点按thumb有效行程补偿，在任意宽度与0/50/100%处与圆点中心对齐。
- 独立入口`.gj-video-progress[data-gj-video-progress]`，默认max-width838、高12；播放器内部高度36保持不变。新增GjVideo.initProgress/幂等initAll、程序更新setValue/refresh及gj-video-progresschange。data-player可选连接播放器，input/change→seek，timeupdate→回填，回填不重复派发变更。Hover不造新色、Focus沿用焦点环、Disabled原生禁止交互+一次50%兜底。
- 规范页新增独立/禁用/播放器联动演示；schema、mapping、rules、Token、inventory、library-index与Skill入口同步，coverage重建为Video implementation complete，无剩余工程化缺口。VID-014关闭。
- VID-006仅部分关闭：5157:2015 fillStyleId指向深蓝渐变，两个色标绑定DB09/DB06，player.background改为现有`--ds-gradient-deep-blue`。三个控制条时间文字的fills、boundVariables及getStyledTextSegments仍为未绑定白85%；文字样式S9绑定不等于颜色绑定，未将此部分虚报关闭。
- 验证：Token与覆盖看板检查通过；Chromium file:// 1440/1280/1024均pageErrors为空、无溢出。检查器非零退出来自既有colgroup/thead/tbody重叠和当前项图标与隐藏序号的误配对，已按结构复核，不是滑块缺陷。HTTP浏览器实测独立轨道点击50%、拖动75%、Home/End/方向键、禁用不变、独立→播放器及播放器→独立同步；三种宽度根/输入高度均12，随容器收缩，控制台无页面错误。
