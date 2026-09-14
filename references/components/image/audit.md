# Image 变更记录

> 2026-09-09 更新：用户提供了 Image 组件的真实 Figma 链接（node-id=2638-2636），已升级为 `figma-audited`，见下方新增章节。本文件最早只记录过 dropzone 归属变化一件事（当时 Image 仍是 `rules-derived`），那段历史原样保留在下面，不重写。

## 2026-09-09：Upload_Dropzone 移出 Image

用户在 Figma 里把原来挂在 Image 组件下的拖拽上传容器移到了 Upload 组件页面，重命名为 `Upload_Dropzone`（节点 `3536:11370`）。用 `get_metadata` 确认该节点现在挂在 Upload 页面（`3099:2117`）下，用 `get_design_context`/`get_variable_defs` 逐状态（Default/Dragging/Uploading/Error）核实了真实结构、文案与 token 绑定——这些证据已经写进 `references/components/upload/schema.json` 的 `dropzone` 字段和 `upload/audit.md`，本文件不重复贴。

相应地：

- `schema.json` 的 `properties.mode` 去掉了 `"dropzone"`，`dimensions.dropzone` 也删掉了；`dependencies` 加了 `Upload_Dropzone`；`behavior.entry` 明确写清楚拖拽/点击入口现在完全由 Upload 一侧提供。
- `rules.md` 对应把"覆盖图片拖拽上传"改成了"入口不再由 Image 自己定义"，并指回 Upload 一侧的真实数据源。
- **尚未处理**：`preview/image/index.html` 里现成的 `.dropzone-grid` 演示区块（约 30 处 dropzone 相关引用，含 `.dropzone`/`.dropzone.blue`/`.dropzone.error`/`.mini-progress` 等 CSS 和对应 HTML/JS）还留在 Image 的预览页里，没有迁移到 `preview/upload/index.html`，也没有从 Image 预览页里去掉或替换成指向 Upload 的说明。这是文档和预览页不同步的已知缺口，需要后续处理，不在这次直接动这块 HTML。


## 2026-09-09：Figma 真实审计（node-id=2638-2636）

用户提供页面链接 `https://www.figma.com/design/8b01I1e3TzH1IhYlr3tJzd/...?node-id=2638-2636`，用 `get_metadata` 核对页面结构，再用 `get_design_context`/`get_variable_defs` 对三个真实节点做了逐一核实：`Image_Thumbnail`（`3533:11349`，5 variant：Empty/Uploading/Uploaded/Uploaded-Hover/Error）、`Image_Preview`（`3530:1791`，2 variant：Default/Controls）、`Img_mask`（`3530:1855`，全屏画廊示例节点，非独立发布的 variant 组件集）。结构化数据已写入 `schema.json`/`mapping.json`/`image.tokens.json`，本节只记录审计过程中发现的、对照当时 `preview/image/index.html` 真实实现后确认需要修正或需要标注的差异。

### 已确认并修正的真实 bug

- **缩略图边框样式**：Figma 显示 Empty/Uploading/Error 三态是虚线边框，Uploaded/Uploaded-Hover 两态是实线边框；`preview/image/index.html` 此前对全部状态统一用了 `border:1px dashed`，没有区分。已给 `.thumb` 补充 `.thumb.uploaded,.thumb:has(>img.preview-image){border-style:solid}` 规则修正。
- **全屏画廊遮罩颜色**：`Img_mask` 节点核实遮罩色是 `Background/MK_45`，不是 `Background/MK_60`。此前 `schema.json` 的 `tokens.previewMask`、`mask/schema.json` 的 `existingUsage`、`mask/rules.md` 的对应说明、以及 `preview/image/index.html` 里 `--mask` 这个 CSS 自定义属性全部指向的是 MK_60——这是一个从 Image 契约文件一路传导到 Mask 组件文档、再到实际预览页 CSS 的连锁错误，本轮一次性订正了全部四处，不是只改一处应付。

### 如实记录、未强行"修正"的差异

- **Uploading 态缩略图不该有图标**：Figma 该状态只有进度条和百分比文字，没有图标；`preview/image/index.html` 里这一态多画了一个 `icf_file_image.svg` 图标。这个多出来的图标不构成视觉误导，本轮没有直接删除，登记为 `IMG-001`，是否精简交给业务/设计侧决定。
- **悬停操作条背景色未知**：Uploaded-Hover 态的查看/删除操作条，Figma 节点数据里没有附带任何背景色/填充属性，无法确认真实设计是否有背景。预览页当前用的是 `Background/MK_30`，本轮既没有改动也没有假装核实过，登记为 `IMG-002`。
- **两处圆角是 9px 而非系统 token**：`Image_Preview` 容器和画廊内图片的圆角，Figma 实测都是 9px，不在 4/6/8/12 这套 Radius token 序列里，大概率是拖动圆角手柄时的作图误差。本轮没有把预览页现有的 8px（Radius/Radius-MD）强行改成 9px 去"完全匹配"——保持系统一致性优先于复刻一个疑似误差的数值，两处都在 schema.json 里如实记录了 9px 这个原始值和这个判断依据，供后续设计侧确认。
- **rgba(0,0,0,.4) 没有对应 token**：Uploaded-Hover 遮罩的 Figma 原始值是字面 40% 黑，本系统的 MK_* 透明度阶梯（3/5/10/20/30/45/60/80）里没有 40 这一档，预览页用最接近的 MK_45 顶替，记为近似值而非精确匹配。

## 结论

Image 已升级为 `figma-audited`：两套组件集（Thumbnail 5 variant、Preview 2 variant）加一个画廊示例节点均已节点级核实，`mapping.json`、`image.tokens.json` 已按本轮证据建立。预览页两处真实 bug（缩略图边框样式、画廊遮罩色）已同步修正；三项如实标注为未解决/未强行统一的差异（Uploading 图标、悬停操作条背景、9px 圆角）见 `IMG-001`~`IMG-003`，均不阻断 `figma-audited` 状态。
## 2026-09-09：共享 CSS 基座提炼（关闭 IMG-003）

`preview/image/index.html` 原本内联/局部定义的真实组件样式，已提炼为 `assets/styles/gj-b2b-components.css` 的共享类：

- 缩略图：`.gj-image-thumb`（含 `.is-uploading`/`.is-error`/`.is-uploaded`/`.is-hover` 状态修饰符，沿用项目 `is-` 前缀惯例，替换原来的裸类名 `.uploading`/`.error`/`.uploaded`/`.hover`）、`.gj-image-thumb-icon`、`.gj-image-thumb-img`、`.gj-image-thumb-overlay`、`.gj-image-thumb-actions`。
- 两套进度条各自独立提炼，未合并：`.gj-image-thumb-progress`（+`-fill`，五态展示区的静态 Uploading 示例）与 `.gj-image-thumb-progress-live`（+`-live-fill`，右侧「交互属性」真实上传队列里由 JS 动态设置宽度的绝对定位进度条）——两者视觉参数、定位方式和触发时机都不同，强行合并会丢失真实交互态的语义。
- 大图预览：`.gj-image-preview` + `.gj-image-preview-actions`。
- 全屏画廊：`.gj-image-scale-stage` + `.gj-image-scale-controls`（静态插图，展示画廊的视觉形态）与真实交互的 `.gj-image-modal` + `.gj-image-modal-img` + `.gj-image-modal-nav`（由 JS 控制 hidden/切换），两者遮罩色、间距数值相同但保留为独立的类和独立的 CSS 变量（`--ds-component-image-scale-stage-bg` / `--ds-component-image-modal-bg`），不合并成一个类，避免静态文档插图和真实弹层耦合。
- 图标按钮：新增独立命名空间 `.gj-image-icon-btn`（基础 20px，缩略图悬停操作与大图预览操作条共用）+ `.gj-image-icon-btn-scale`（24px，画廊插图箭头）+ `.gj-image-icon-btn-modal-nav`（28px，真实 modal 导航，含 `:disabled` 态 `opacity:.35`）+ `.gj-image-icon-btn-modal-close`（36px，真实 modal 关闭按钮，附带绝对定位）。核实过已有的共享 `.gj-icon-button`（32px、currentColor mask、带 hover/active/focus 态）与 Image 这里的图标按钮是两套不同的实现——Image 侧无 hover 态、四种尺寸随场景变化、用 `<img>` + `filter:brightness(0) invert(1)` 让图标反白，而不是 mask 技法——因此没有强行复用 `.gj-icon-button`，保留独立命名空间，避免不同语义的按钮被同一个类名污染。

对应尺寸/颜色/圆角数值同步写成 `assets/styles/gj-b2b-tokens.css` 里的 `--ds-component-image-*` 变量（共 47 个，含复用既有语义 token 的别名与少量保持字面量未变量化的项，如 `.gj-image-scale-stage` 的 `clamp(20px,12vw,141px)` 响应式内边距、画廊图片 `aspect-ratio:586/383`——这两处属于响应式表达式/宽高比，不适合拆成单一固定值变量，原样保留）。

`preview/image/index.html` 的静态 HTML、内联 `<style>` 与 `<script>`（`renderQueue`/`openPreview` 等函数里用模板字符串拼接的类名，含错误态分支里此前遗漏的 `.state-icon`）均已同步改为共享类名；随之失效的页面局部变量 `--blue5`/`--red5`/`--mask` 已一并删除，页面局部规则 `.queue .thumb{flex:none}` 改名为 `.queue .gj-image-thumb{flex:none}`。标签配平（div 56/56、button 11/11、table 1/1 等）与内联脚本 `node --check` 均已验证通过。

`mapping.json` 的 `structureMap`/`implementation` 已更新为共享基座版本（`status: shared-css-base`）；`image.tokens.json` 已给每个既有 token 补上 `cssVariable` 字段（无对应 CSS 变量的项如实标注原因），并新增了此前未单独记录的图标按钮/modal 专属 token 条目；`openItems.IMG-003` 已删除（关闭）。`IMG-001`（Uploading 态多余图标）与 `IMG-002`（悬停操作条背景色未核实）是独立的 Figma 待确认项，与本次 CSS 提炼无关，保持未关闭。

## 结论

Image 的 Figma 审计结论（`figma-audited`）不受本次改动影响。前端实现层面，`assets/styles/gj-b2b-components.css` 已不再缺少 Image 的共享基座——与 Badge/Timeline/InputNumber/Drawer/Skeleton 同批完成，IMG-003 已解决；IMG-001/IMG-002 仍待设计侧后续确认。

## 2026-09-10：接入 build-tokens（TOK-004）

inventory 更正为 **2 套 / 7 variants / 1 standalone**（Thumbnail 5 + Preview 2 + Img_mask）。描边 paint 绑定 `Border/secondary` / `Border/focused` / `Border/error`；Empty/Uploading/Error dash `[4,4]`。操作条无填充，遮罩字面 40% 黑。Token 已接入 `build-tokens.mjs`；CSS 变量名去重。IMG-002 按此关闭；IMG-001 仍开。

## 2026-09-10：关闭 IMG-001

Figma 侧确认：Thumbnail Uploading 不画图标，只保留进度条与百分比。已从 `preview/image/index.html` 静态 Uploading 示例删除 `icf_file_image.svg`；共享基座增加 `.gj-image-thumb.is-uploading .gj-image-thumb-icon{display:none}`。交互队列 Uploading 本来就叠原图+进度，没有该多余图标。IMG-001 关闭。
