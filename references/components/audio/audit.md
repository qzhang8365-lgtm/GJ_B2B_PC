# Audio 音频播放条 Figma 审计

来源：Figma `5026:7599`（画布「音频Audio」，文件 `8b01I1e3TzH1IhYlr3tJzd`），只读检查。画布下包含 3 个可复用节点：

- `5026:7663` `Audio_Bar`（symbol，200×16px）——播放进度条的静态轨道图形。
- `5026:7664` `State=Paused`（symbol，640×34px，属于 `Audio_controller` 组件集）。
- `5026:7665` `State=Playing`（同一组件集，640×34px）。

组件集只有 `state` 一个变体轴（`Paused` / `Playing`），2 个 Variant，未见 Hover/Pressed/Disabled 等交互态 Variant——与 Text Button 等组件不同，Audio 播放条在 Figma 侧目前只定义了「暂停中」与「播放中」两种整体状态，按钮级别的 hover/active 反馈未在设计稿中单独建模。

## 结构确认（对两个 State Variant 分别用 `get_design_context` 核对，结构完全一致，仅播放/暂停图标不同）

- 容器：`display:flex; align-items:center; gap:21px; height:34px; padding:8px 12px; border-radius:var(--radius/radius-md,8px); border:1px solid var(--brand/gj_blue,#2b73ff); background:var(--background/bg_blue,#e5f0ff); width:640px`。
- 子节点从左到右：时间戳文本 → 控制区（`gap:18px`，内含三个 16×16px 图标）→ `audio_bar`（200×16px 静态图形节点）→ 剩余时长文本（`width:60px`）→ 弹性留白节点（`flex:[1_0_0]; height:8px`）→ 关闭图标（16×16px）。
- 时间戳与剩余时长文本均绑定 `中文/S9-CN-R`（PingFang SC Regular 12/18），颜色变量 `Text/Primary`（`#101828`）。
- 已用 `get_variable_defs` 思路交叉核对（见下）：容器背景 `Background/BG_blue` 解析为 `#E5F0FF`，边框 `Brand/gj_blue` 解析为 `#2B73FF`，均与本地 `--ds-primitive-blue-b02` / `--ds-primitive-blue-b06` 的十六进制值逐字节一致，圆角变量解析为 8px，与本地 `--ds-radius-md` 一致。本地实现（`gj-b2b-tokens.css` 的 `--ds-component-audio-*`）已按这组真值落地，颜色/圆角/字号均可视为像素级核对通过，无需下载静态 SVG 资源即可确认（组织网络策略阻断了 `www.figma.com` 的直连资源下载，见下方 AUD-002）。

## 图标资产核对

| Figma 节点名 | 用途 | 本地资源库匹配 |
|---|---|---|
| `icf_media_skip-previous-fill` | 上一首 | `assets/icons/iconfont/icf_media_skip-previous-fill.svg`（精确匹配） |
| `icf_media_skip-forward-fill` | 下一首 | `assets/icons/iconfont/icf_media_skip-forward-fill.svg`（精确匹配） |
| `icf_media_pause-regular` | 播放中→暂停按钮 | `assets/icons/iconfont/icf_media_pause-regular.svg`（精确匹配） |
| `icf_media_play-triangle`（Figma 节点命名未带 `-fill`/`-line` 后缀） | 暂停中→播放按钮 | 本地存在两个候选：`icf_media_play-triangle-fill.svg` 与 `icf_media_play-triangle-line.svg`，见 AUD-001 |
| `icf_system_close-md` | 关闭 | `assets/icons/iconfont/icf_system_close-md.svg`（精确匹配，与 Drawer 关闭按钮复用同一图标） |
| `audio_bar`（`Audio_Bar` symbol，静态图形） | 进度条轨道视觉 | 未直接使用该静态图形资源，改为复用 `.gj-slider` 组件实现（见下方「实现决策」） |

## 应修复 / 需跟进（Open Items）

1. **AUD-001 · 播放三角图标 fill/line 归属存在命名歧义（已按视觉核实自行判定，未回写 Figma）**
   - Figma 节点对播放图标的命名是 `icf_media_play-triangle`，不带 `-fill`/`-line` 后缀，而本地图标库对同一语义同时提供了 `-fill`（实心三角）与 `-line`（描边三角）两个文件，命名规则与该组件集里其余图标（`skip-previous-fill`、`skip-forward-fill` 均显式带 `-fill`）不一致，无法仅凭 Figma 节点名机械匹配。
   - 判定依据：① `get_design_context` 返回的截图显示为实心三角形，不是描边；② 同一控制区内的兄弟图标（上一首/下一首）都是 `-fill` 变体，选择 `-fill` 与相邻图标的视觉重量保持一致；③ `暂停中` 状态的另一半（`icf_media_pause-regular`）本身是「regular」而非「fill」，说明 Figma 组件里「播放」和「暂停」两个图标并非成对使用同一后缀体系，不能用「暂停用 regular 所以播放也该用非 fill」来反推。综合判定选用 `icf_media_play-triangle-fill.svg`。
   - 后续如需要消除歧义，需要设计师在 Figma 组件层给该图标实例补上明确的 `-fill`/`-line` 后缀命名，再由本 Skill 回读核实；只读访问下本次无法在 Figma 侧修正命名。

2. **AUD-002 · 无法下载 Figma 原始 SVG/静态资源逐像素比对 · 已通过变量绑定值交叉核对替代解决**
   - 组织网络出口策略阻断了 `www.figma.com` 的直接资源下载（`curl`/`device_bash` 均返回 `connect_rejected`），因此未能下载 `Audio_Bar` 等静态资源的原始 SVG 文件做逐像素比对。
   - 替代验证：改用 `get_design_context` 与 `get_variable_defs` 返回的变量绑定与十六进制回退值，逐项核对背景色、边框色、文字色、圆角与本地 `gj-b2b-tokens.css` 现有 primitive token 的十六进制值，结果完全一致（见上方「结构确认」表述），色彩/圆角层面的核实视为已通过，不再是开放问题。
   - 仍然遗留的是「视觉资产」本身（`Audio_Bar` 静态图形节点）未被下载或使用，但这是因为实现上主动选择了组件复用方案而非需要该资源，详见下方「实现决策」，不属于验证缺口。

## 实现决策（非 Figma 审计发现，记录设计-代码映射选择）

- **进度条复用 `.gj-slider` 而非重建/内嵌静态图**：Figma 的 `Audio_Bar` symbol 是一张 200×16px 的静态图形（截图渲染，非组件），本身不包含交互语义。核对后发现本地 `input-number` 组件下的 `.gj-slider` 默认参考宽度恰好是 200px（`--ds-component-input-number-slider-width: 200px`），与 `Audio_Bar` 尺寸规格完全一致，因此 Audio 播放条的进度条直接复用 `.gj-slider`（新增 `.gj-audio-bar .gj-slider{flex:none}` 让其在横向 flex 布局中保持固定宽度不被拉伸），获得真实可拖拽的滑块交互，而不是把静态截图刻死成不可操作的背景图。这是一个主动的组件复用决策，不是遗漏了 Figma 资源。
- **播放/暂停状态用 `.is-playing` 修饰符驱动图标切换，不是两个独立组件**：Figma 侧 `State=Paused`/`State=Playing` 是同一组件集的两个 Variant，代码侧对应为同一个 `.gj-audio-bar` 根节点加/去 `.is-playing`；真正的播放/暂停业务逻辑（音频对象的 play()/pause() 调用、`aria-pressed` 同步）留给运行时实现，CSS 只负责图标外观切换，已在 `rules.md` 中说明边界。
- **剩余时长文案宽度锁定 60px**：来自 Figma 实测值（`width:60px`），补充为组件私有 token `--ds-component-audio-duration-width`，避免时长文案变长（两位数分钟）时把关闭按钮位置顶偏。这是本轮补充发现的实现细节，随本次组件上线一并落地，未见于 2026-09-28 之前的草案版本。

## 补充发现（预览页联调反馈，2026-09-28）

组件上线后，在预览页联调中收到两处实现层面的反馈，均已核实并修复：

1. **AUD-004 · 进度条圆点样式与 Figma 不符，已定位为 Audio 自有资产与共享滑块基座的真实差异，非误报**
   - 反馈：预览页里可拖动圆点渲染为实心蓝色圆点，但 Figma 源文件里应为白色填充、蓝色描边的圆点。
   - 排查：先核对了 input-number 组件自身的 `Swiper` 节点（`4293:15642`），确认其 Figma 源确实是实心蓝色填充（与本地 `.gj-slider` 共享基座当前实现一致，`references/components/input-number/schema.json` 第 180 行已记录为 `Button/Primary/Bg-pressed` 实心色），说明共享基座本身没有问题。随后专门重新核对 Audio 自己的 `Audio_Bar` 节点（`5026:7663`），确认该节点的圆点确实是白色填充 + 蓝色描边，与 input-number 的圆点视觉不同——两个组件各自的 Figma 源本来就不一致，不是同一份规范的两种误读。
   - 修复：不修改共享的 `.gj-slider` 基座（避免影响 input-number 等其他正确复用方），改为新增 Audio 私有 token（`--ds-component-audio-slider-thumb-background` / `-border-color` / `-border-width`）与限定选择器 `.gj-audio-bar .gj-slider input[type=range]::-webkit-slider-thumb` / `::-moz-range-thumb`，仅对 Audio 场景覆盖圆点视觉，属于组件级 scoped override，不是基座变更。
   - 遗留事项（视觉估算，非精确实测）：`Audio_Bar` 是一张已拉平/栅格化的静态图形节点（非可拆解的组件层级结构），`get_variable_defs` 无法获取圆点描边宽度的具体绑定值，组织网络策略又阻断了原始 SVG 下载（同 AUD-002 的网络限制），因此边框宽度 `2px` 是基于 `get_design_context` 截图的视觉估算，不是 Figma 实测像素值。后续如需精确值，需要设计师协助导出该节点的矢量源文件或补充标注。

2. **AUD-005 · 拖拽圆点时蓝色进度条不跟随，定位为预览页基座缺失事件绑定，已抽取为共享脚本修复**
   - 反馈：拖动进度条圆点时，右侧蓝色（激活态）轨道的终点没有跟随圆点位置一起移动。
   - 排查：`.gj-slider` 的填充轨道由 `.gj-slider` 容器上的 `--start`/`--end` CSS 自定义属性驱动（见 `gj-b2b-components.css` 的 `.gj-slider-track` 渐变定义），这两个属性只有在显式监听 `input` 事件并重新计算时才会更新。`preview/audio/index.html` 的「交互演示」区块有自己手写的 `renderProgress()` 逻辑正确处理了这一点，但「组件结构」静态演示区块的 `.gj-slider` 完全没有绑定任何事件——这不是 Audio 独有的疏漏，`preview/input-number/index.html` 也是靠页面私有的 `initStaticSliders()` 函数才让同样的静态演示区块正确联动，这段逻辑此前从未被抽成可复用的基座能力，每个新页面都要重新手写一遍，容易遗漏。
   - 修复：将 `initStaticSliders()` 的核心逻辑（单滑块/双滑块区间两种场景、`--start`/`--end`/`--tip*` 计算、可选的 `.gj-slider-tooltip` 文案同步）抽取为共享基座脚本 `assets/scripts/gj-slider.js`，通过 `MutationObserver` 自动发现页面上所有 `.gj-slider` 并绑定，无需每个消费页面手动调用初始化函数。`preview/audio/index.html` 的 `<head>` 中新增 `<script src="../../assets/scripts/gj-slider.js" defer></script>` 引入；交互演示区块保留自己原有的 `renderProgress()`（还需要联动播放状态、时长文案等业务逻辑），两者对同一批 `--start`/`--end` 属性的写入是幂等的，不会冲突。
   - 范围说明：未回头把 `preview/input-number/index.html` 迁移到这个共享脚本——该页面的 `initStaticSliders()` 已验证工作正常，迁移属于额外重构，存在引入回归的风险且未被要求，本次不做，仅记录共享脚本已存在，供未来页面直接复用。

## 归组说明

本组件在 `references/components/inventory.json` 的 `schemaRegistry.executionOrder` 中归入 `data-display` 分组（第 42 项）。理由：Audio 播放条的核心功能是「呈现一段既有录音的状态」（时间戳、播放进度、时长），交互控制（播放/暂停/上一首/下一首/关闭）服务于这个展示目的，而不是采集用户输入；这与 Table/Avatar/Badge/Timeline 等 `data-display` 组件的定位一致，区别于 `data-entry`（InputNumber 等采集型组件）。进度条内部复用 `.gj-slider` 不改变这个归组判断——`.gj-slider` 是被复用的实现细节，不代表 Audio 整体承担数据录入职责。
