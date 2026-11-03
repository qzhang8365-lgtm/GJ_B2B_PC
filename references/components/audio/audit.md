# Audio 音频 Figma 审计

来源：Figma `5026:7599`（页面「音频Audio🆕」，文件 `8b01I1e3TzH1IhYlr3tJzd`），2026-10-27 只读复核。

## 盘点结果

| 组件 | 节点 | Variant | 关键尺寸 |
|---|---|---:|---|
| Audio_controller_mini | 5026:7664 / 5026:7665 | Paused / Playing | 587×34 |
| Audio_Listitem | 5404:658 / 5404:660 | Default / hover | 440×60 |
| Audio_List | 5404:693 | Default | 357×300（示例 5 行） |
| Audio_controller_full | 5404:932 / 5404:957 | Default / Playing | 656×52 |
| Audio_item_button | 5404:1178 / 5404:1177 | play / pause | 28×28 |
| Audio_Bar | 5026:7663 | 独立组件 | 400×16 |

共 5 个组件集、9 个 Variant、1 个独立组件。此前本地审计只记录 Mini 的 2 个 Variant，已在本轮补齐。

## 视觉与变量核对

- Mini：浅蓝背景 `Background/BG_blue`、品牌蓝 1px 描边、Radius-md 8px；内边距 8/12px、顶层 gap 21px。
- Mini 控制区：上一首/播放或暂停/下一首，16px、gap 18px、品牌蓝。Paused 使用实心三角，Playing 使用 Regular 暂停图标。
- List Item：标题 14/22 Semibold，日期时间 12/18 Regular；Hover 为 `Background/Hover`，标题右侧新增 16px 品牌蓝播放图标。
- Full：上方为整行 Audio Bar；下方控制行 gap 16px。左侧音量图标 20px + 80×6px 滑块，中间控制组 gap 26px，中央 28px 圆形播放/暂停按钮，右侧 12/18 时长右对齐。
- Audio Bar：400×16px，轨道 4px；白色圆点、品牌蓝描边并带 small shadow。作为 Full/Mini 子元素时允许拉伸适配，不把导出图片作为实现。
- 音量滑块：80×6px、轨道2px；6px圆点为 `Brand/GJ_Blue` 实心填充并带 small shadow。2026-10-29 复核 `5404:933` 与圆点子节点 `5404:917`，与 Audio Bar 白底蓝描边圆点明确区分。

## 图标核对

全部命中 PC Skill 图标库：

- `icf_media_skip-previous-fill`
- `icf_media_skip-forward-fill`
- `icf_media_play-triangle-fill`
- `icf_media_play_fill`
- `icf_media_pause-regular`
- `icf_media_pause-fill`
- `icf_media_volume-down-fill`
- `icf_media_volumeoff-fill`（用户确认的音量0静音反馈）
- `icf_system_close-md`

图标采用 mask + `currentColor`，可继续被本地交付/Figma 导入脚本转换，不新增远程 Figma 资产依赖。

## 已关闭问题

- **AUD-001 已关闭**：旧审计仅覆盖 Mini Controller 的 2 个状态；现已补齐 5 个组件集、9 个 Variant 和 1 个独立 Audio Bar。
- **AUD-002 已关闭**：旧实现把 Mini 最大宽写成 640px、把进度锁为 200px；本轮按最新节点更正为 587px，并允许进度弹性伸缩。独立 Audio Bar 的参考宽度为 400px。
- **AUD-003 已关闭**：共享运行时 `assets/scripts/gj-audio.js` 统一处理状态、进度、音量与语义，不再由预览页分别手写。
- **AUD-004 已关闭**：播放三角形不再依赖名称猜测；Mini/Full 与画布截图一致使用已有实心播放图标。无需下载临时 Figma SVG，所有图标均命中本地图标库。
- **AUD-005 已关闭**：进度条圆点已按 8px 白底蓝描边 + `shadow_small` 实现；不再保留“2px 仅视觉估算”的开放项。
- **AUD-006 已关闭**：用户确认 Audio 属于业务组件，inventory、Schema、规范页与侧边导航统一归入 Business；其内部继续复用 Slider 与 Icon 等基础组件。
- **AUD-007 已关闭**：复核 Figma `5404:1177` 确认 Item Button 暂停态应使用 `icf_media_pause-fill`。问题来自网页以第二层 `mask-image` 覆盖播放态 mask，已改为与其他组件图标一致的 `--gj-icon` 状态切换，保留 Figma 的正确图标而不替换资源。
- **AUD-008 已关闭**：Mini 原先只根据 iframe 视口隐藏时间，在双列卡片中会先于视口断点溢出。现改为组件容器查询：520px 以下隐藏录制时间，340px 以下再隐藏时长，控制与进度保持可用。
- **AUD-009 已关闭**：进度与音量 range 曾叠加浏览器原生轨道，造成灰蓝轨道断裂，且主进度条只有圆点可操作。现已隐藏 WebKit/Firefox 原生 track，保留单一连续轨道，并让整条轨道可点击/拖拽；交互演示舞台同步改为白色容器。
- **AUD-010 已关闭**：WebKit 默认把 Range 圆点相对原生轨道定位，隐藏原生轨道后圆点与自绘轨道出现约 2px 垂直错位。进度与音量圆点现统一使用 `(trackHeight - thumbSize) / 2` 偏移，中心线与可见轨道严格重合；Firefox 保留原生居中逻辑。
- **AUD-011 已关闭（2026-10-29 更正）**：用户确认 Hover 使用 `Background/MK_20`（黑色20%）加深，以接近 Video 的明显反馈。圆形按钮叠加原品牌蓝底，独立控制与关闭图标使用等效亮度系数 `0.8` 仅加深 SVG 图形；移除先前的淡蓝矩形底、圆形按钮变浅和关闭图标跳色，并将过轻的 Hover2 替换为20%强度。该交互为用户确认规则；Disabled 排除 Hover。
- **AUD-012 已关闭（2026-10-29）**：组件族总览的 Full Controller 已引用共享 CSS，但缺少 `data-gj-audio` 和按钮 `data-action`，拖动只改变原生圆点，填充与时间不联动。现补齐同一共享运行时的接入标记；展示区和交互区使用一致的播放、进度与音量逻辑，不新增页面私有初始化。
- **AUD-013 已关闭（2026-10-29）**：音量圆点误绑 `Background/Container`，显示为白色。按 Figma `5404:933` / `5404:917` 更正 `volume.thumbBackground` 为 `Brand/GJ_Blue`；共享Token驱动展示区与交互区同时生效，主进度条圆点仍保持白底蓝描边。
- **AUD-014 已关闭（2026-10-29）**：用户要求音量调到0时显示 volume off。现由共享运行时同步 `.is-muted`，使用现有 `icf_media_volumeoff-fill`，音量调高恢复 volume-down-fill；初始化、键盘输入及媒体 volumechange 共用同一渲染路径，静音不影响播放状态，展示区与交互区同时生效。
- **AUD-015 已关闭（2026-10-29）**：列表预览的第二项曾预置 `.is-hover`，与鼠标真实悬停项同时显示背景和播放图标。已移除交互列表中的冻结态，默认全列表无 Hover，移入/移出仅由 `:hover` 驱动；静态冻结态保留给独立的状态对照样例。
- **AUD-016 已关闭（2026-10-29）**：用户要求直接点击音量图标静音。已将展示区和交互区图标改为20px原生按钮，由共享运行时处理点击、键盘与音量恢复；静音归0，再次操作恢复最近非零音量（无历史值回到30%），图标、填充和ARIA同步，播放状态不变。

## 实现与验收入口

- 契约：`references/components/audio/schema.json`
- Token：`references/tokens/components/audio.tokens.json`
- 共享基座：`assets/styles/gj-b2b-components.css` 的 `.gj-audio-*`
- 运行时：`assets/scripts/gj-audio.js`
- 展示页：`preview/audio/index.html`

## 2026-10-29 完整性检查

- **AUD-017 已关闭**：mapping 的旧680px视口说明与基座520/340px容器查询不符，已修正；Skill入口补齐Audio引用规则。未给起始时间现在从0开始，动态根节点支持幂等初始化，避免主播放按钮重复绑定；真实媒体监听ended恢复播放状态。
- Disabled无Figma变体，原先仅上一首/下一首40%透明度不符合全局兜底规则。控制按钮统一使用Token驱动的一次50%透明度、原生disabled和无Hover反馈。
- **AUD-018 已关闭**：浏览器实测关闭Mini后虽设置hidden，基座display:flex仍让其显示。已添加根节点[hidden]隐藏规则；关闭与重新显示均不删除音频数据。
- 预览页白色容器撑满和居中属于文档布局，去描边只修改预览容器，不改变组件尺寸、颜色或交互契约。
- 最终验收：1440/1280两宽渲染无异常；临时浏览器验收覆盖0起点、重复初始化只切一次、静音与恢复、Mini关闭和重新显示。与资讯/视频共13项交互断言通过，临时验收页已移除。

当前无待人工确认项。
