# Carousel Figma 审计

来源：Figma 页面 `2638:1007`（走马灯 Carousel），2026-09-09 通过 metadata、design context、变量定义与节点截图只读核验。未修改 Figma。

## 真实组件结构

| 组件集 | 节点 | variants | 说明 |
|---|---|---:|---|
| `Carousel` | `4775:19663` | 3 | position=bottom_center / bottom_right / bottom_left |
| `pageIndicator` | `3016:4641` | 2 | Direction=Horizontal / Direction3，实际对应 light / dark |
| `.dot` | `3016:4652` | 4 | ture=true/false × style=light/dark |

合计 **3 套 / 9 variants / 0 standalone**。旧 inventory 的 2/4/4 把带 variant 轴的结构误计为 standalone，已更正。

## 视觉证据

- Carousel 母版 385×160，底部 padding 12，overflow clip。
- position 只改变页码指示器的底部左/中/右对齐，不改变主体内容。
- 指示条高度约 3px、gap 3、圆角 4；active 宽 16，inactive 宽 8。
- Light：active=`Text/reversal`，inactive=`Background/WT_20`。
- Dark：active=`Text/blue`，inactive=`Background/MK_20`。
- 示例背景使用“极客蓝渐变”（Primitive/Blue/B05 → B07）；这是实例内容，不是 Carousel 容器的固定背景。

## 已关闭问题

| ID | 发现 | 处理结论 |
|---|---|---|
| CAR-001 | inventory 记录 2 套/4 variants/4 standalone，与真实组件树不符 | **已关闭**：按三个组件集直接子 variant 更正为 3/9/0，并同步 scope |
| CAR-002 | `.dot` 属性名写成 `ture` | **已关闭（映射层）**：公开 API 统一为 `active:boolean` |
| CAR-003 | pageIndicator 的 `Direction3` 不表达真实语义 | **已关闭（映射层）**：归一为 `indicatorTheme=dark`，Horizontal 归一为 light |
| CAR-004 | Figma 未规定自动播放、暂停、键盘、触屏和播报 | **已关闭（行业规则）**：默认不自动播放；补齐暂停条件、键盘/滑动、reduced-motion 与可访问语义 |
| CAR-005 | 385×160 容易被误当成所有业务场景固定宽度 | **已关闭（尺寸规则）**：宽度随容器、默认高 160；允许按内容覆盖高度但组内等高 |
| CAR-006 | Figma 母版只有渐变示例面与指示器，没有真实 slide 轨道和内容属性 | **已关闭（组合边界）**：渐变只作实例内容；运行时新增 items slot/track，但不把它冒充为 Figma variant |
| CAR-007 | 2026-09-09 审计时 Figma 无原生箭头组件；2026-09-10 复查发现 Figma 已发布 `Carousel_item_arrows`（4 variants） | **已关闭（2026-09-10）**：更正 schema/rules/mapping，箭头改为使用原生组件而非拼装 Button/Icon |

## 补充复查（2026-09-10）

用户提供了两个新的 Figma 节点：

1. **使用说明文档**（节点 `4806:20708`，独立说明画板，非组件节点）：通读典型构成、选用规则（含"何时不该用轮播"的具体数据：约 1% 用户点击轮播图且 84% 只点第一张；静态图 40% 点击率 vs 轮播 2%）、交互规则表和宽度适配表，已整理进 `rules.md` 新增的"使用规则补充"小节。
2. **新增原生箭头组件**（节点 `4806:20805`，`Carousel_item_arrows`）：`direction(left/right) × state(default/active)` = 4 个 variant，本轮全部用 `get_design_context` 核实：

| variant | 节点 | 容器 | 背景 | 图标 |
|---|---|---|---|---|
| left, default | `4806:20817` | 32×32 圆形，圆角 16，内边距 4，**50% 透明** | `Background/WT_30` | `icf_Arrow_left` ~24×24 |
| left, active | `4806:20804` | 同上，**100% 不透明** | 同上 | 同上 |
| right, default | `4806:20819` | 同上，**50% 透明** | 同上 | `icf_Arrow_right` ~24×24 |
| right, active | `4806:20803` | 同上，**100% 不透明** | 同上 | 同上 |

容器高度绑定尺寸 token `Components/Control-m`(32px)。`state=default` 是常态（半透明弱化），`state=active` 是交互态（hover/focus，完全不透明），不是"选中/未选中"的语义。

**这直接更正了 2026-09-09 审计时的结论**：原 CAR-006 关闭理由及 `constraints`/`rules.md` 里写的"Figma 未发布箭头视觉 variant，不得伪造为设计库原生变体"在当时是真实的，但 Figma 侧后续（2026-09-10 之前）新增了这个原生箭头组件，此前的"没有"已经不成立。已更新 `schema.json`（componentSets 3→4、variants 9→13，新增 `arrowButton` 尺寸规格，更新 constraints 措辞）、`rules.md`、`mapping.json`，并记为新条目 **CAR-007**。

Figma 的使用说明文档把"必须提供明确的左右箭头"列为导航控件硬性要求，与原有 rules.md"箭头是可选组合件"的表述方向不同。**产品已确认（2026-09-10）：走马灯默认展示左右箭头；箭头空闲态用 `state=default`（50% 透明），鼠标悬停/键盘聚焦切到 `state=active`（100% 不透明）。** 已同步更新 `schema.json`（`properties.showArrows` 默认 `true`，`behavior.navigation` 补充状态映射）、`mapping.json`（`interactionMap`/`runtimeMap` 补充 hover/focus 切态说明）与 `rules.md`。

## 结论

Carousel 已达到 `figma-audited`。Figma 现有四套母版、十三个 variants（含 2026-09-10 新增的原生箭头组件），尺寸和颜色绑定均已结构化；缺失的交互边界已用通用 UI/无障碍规则闭环。CAR-001~CAR-006 维持已关闭，新增 CAR-007（箭头组件发布）已随本轮复查一并关闭。

## 2026-09-15：原生箭头组件从文档落地为共享实现，并同步业务模式页（新增并关闭 CAR-008）

背景：用户提供 Figma 节点 `4806:20805`（`Carousel_item_arrows`）链接，要求「补充走马灯的左右切换箭头按钮」。

核对该节点与 CAR-007（2026-09-10）记录的规格完全一致：`direction=[left,right] × state=[default,active]` 4 个 variant，32×32 圆形按钮，圆角 16（`Components/Control-m`），内边距 4，背景 `Background/WT_30`（`rgba(255,255,255,.3)`），图标 `icf_Arrow_left`/`icf_Arrow_right` 约 24×24、颜色 `Text/reversal`（白色），`state=default` 时容器 50% 透明（空闲弱化），`state=active` 时 100% 不透明（hover/focus）。

排查发现一个关键缺口：CAR-007 当时只是**核实并写入了文档**（`schema.json` 的 `dimensions.arrowButton`、`rules.md`、`mapping.json` 的 `runtimeMap`/`interactionMap`），从未真正把这套规格落地成 `assets/styles/gj-b2b-components.css` 里的可用 CSS 类——`grep` 全项目找不到任何 `.gj-carousel-arrow` 的实现，`preview/carousel/index.html` 也没有展示这个组件。也就是说，"设计已审计"和"代码已实现"是两件事，CAR-007 完成的只是前者。

按项目惯例（沿用 TBL-006"没有同步修改模式页"的教训）在实现前先 `grep -rl "gj-carousel\b" preview/` 核对全项目实际使用情况：除组件自身预览页外，只有 `preview/patterns/dashboard.html`（机构业务工作台的公告轮播）一处业务页用到走马灯。查看后发现它已经有一套自己拼装的箭头按钮——`.gj-icon-button.carousel-arrow.carousel-arrow-prev/-next`（定义在 `preview/patterns/page-patterns.css`）：深色半透明底 `Background/MK_30`、16px 小图标、8px 内边距。这是业务页在 Figma 原生箭头组件发布之前写的临时实现，视觉与原生规格（白色半透明底、24px 图标、12px 内边距、明确的 default/active 两态透明度）完全不同，需要一并修复，而不能只改组件预览页。

**实现**：

1. `assets/styles/gj-b2b-tokens.css` 新增箭头专用 Token：
   - 几何：`--ds-component-carousel-arrow-size: 32px`、`-radius: 16px`、`-padding: 4px`
   - 状态：`--ds-component-carousel-arrow-idle-opacity: 0.5`、`-active-opacity: 1`、`-disabled-opacity: 0.35`（禁用态参考 Image 组件 `modal-nav` 同类导航按钮的 `--ds-component-image-icon-btn-disabled-opacity: 0.35` 量级，Figma 未发布禁用视觉，因此不复用 default/active 语义，另起一个独立 Token）
   - 颜色：`--ds-component-carousel-arrow-background: var(--ds-background-wt-30)`、`-icon-color: var(--ds-text-reversal)`、`-focus-ring: var(--ds-background-bt-b20)`（复用既有指示器 `:focus-visible` 用过的同一个聚焦环颜色变量）

2. `assets/styles/gj-b2b-components.css` 新增 `.gj-carousel-arrow` 共享类：
   - `position:absolute;top:50%;transform:translateY(-50%)`，`.is-left`/`.is-right` 分别用 `left`/`right: var(--ds-component-carousel-padding)`（12px，与指示器左右位置共用同一个内边距 Token，保证视觉边距基准一致）。
   - `>.gj-icon{width:100%;height:100%}` 让内部 24×24 的 `.gj-icon`（项目已有的通用 mask 图标基座，默认尺寸正好是 24px，不需要额外的尺寸修饰类）撑满按钮减去 4px 内边距后的可视区域。
   - 状态切换：`:hover:not(:disabled)`、`:focus-visible:not(:disabled)` 与显式类 `.is-active:not(:disabled)` 三者任一命中都把 `opacity` 切到 `--active-opacity`（100%）。`.is-active` 是专门给静态文档页强制展示"悬停/聚焦长什么样"用的**文档专用类**（参考 SEA-005 的 `.gj-search-focused`/`.gj-search-filled` 先例——真实组件的这类瞬时状态没法在静态截图里直接摆出来，需要一个可以写进 HTML class 的钩子）；真实交互场景完全靠原生 `:hover`/`:focus-visible` 自动生效，不需要任何 JS 手动加类。
   - `:disabled{opacity:var(--ds-component-carousel-arrow-disabled-opacity);cursor:not-allowed}`：到达边界（`loop=false`）时禁用，用独立的禁用态透明度，不借用 default（50%）或 active（100%）表达，因为 Figma 没有为箭头发布 disabled 视觉，这条是"通用按钮禁用规则"的延伸，不能伪造成设计库原生变体（这一点在 CAR-007 时的 `constraints`/`mapping.json#accessibility.arrow` 里已经写明，本次实现严格遵守）。

3. `preview/carousel/index.html`：
   - 新增「导航箭头」小节，三栏对照展示 Default（空闲）/Active（`.is-active` 强制类模拟悬停/聚焦）/Disabled（`disabled` 属性）三态，每栏用一个渐变卡片背景模拟"叠加在图片/渐变内容上方"的真实使用场景。
   - 原有「交互演示」的真实走马灯（`#carousel`）里新增一对可点击的箭头按钮（`#prevArrow`/`#nextArrow`），复用既有的 `go()` 切换函数；`go()` 内同步维护的 `previous.disabled`/`next.disabled`（原侧边栏"上一项/下一项"按钮）逻辑，现在也同步镜像到 `prevArrow.disabled`/`nextArrow.disabled`，保证两套入口在 `loop` 关闭并到达首尾边界时行为一致。
   - 「尺寸与 Token」表格补一行「导航箭头 32×32px」，写明圆角、内边距、图标尺寸与两态透明度。

4. `preview/patterns/dashboard.html`：把 `class="gj-icon-button carousel-arrow carousel-arrow-prev"` / `carousel-arrow-next` 换成原生 `class="gj-carousel-arrow is-left"` / `is-right`，内部图标从 `gj-icon gj-icon-16`（16px 修饰类）改成裸 `gj-icon`（默认 24px，匹配原生规格），保留原有 `data-carousel-prev`/`data-carousel-next` 属性不变，`page-patterns.js` 的点击绑定逻辑不需要任何改动（选择器按属性而非类名找按钮）。同步清理 `page-patterns.css` 里因此不再被引用的 `.carousel-arrow`/`.carousel-arrow:hover`/`.carousel-arrow-prev`/`.carousel-arrow-next` 四条死代码。

**验证**（Playwright，本地静态服务器 + 截图/`getComputedStyle`/交互双重核实）：

- 三态计算样式：Default `opacity:0.5`，Active（`.is-active`）`opacity:1`，Disabled `opacity:0.35`；三态尺寸均为 `32×32px`、`border-radius:16px`、背景 `rgba(255,255,255,0.3)`，与 Figma 规格一致。
- 对 Default 态按钮做真实的 Playwright `.hover()`，确认 `opacity` 自动变为 `1`（验证 `:hover` 伪类路径本身有效，不只是 `.is-active` 类路径）。
- 交互演示：点击 `#nextArrow` 两次，`#event` 文案正确从"第 1 项"依次前进到"第 3 项"，指示器同步；关闭 `loop` 并前进到末项后，`#nextArrow` 的 `disabled` 属性与 `opacity:0.35` 均正确生效（此时再点击会因原生 `disabled` 语义被浏览器直接拦截，不触发 `go()`）。
- 窄屏 960px/720px/480px 下「导航箭头」小节三栏对照正确纵向堆叠，`document.documentElement.scrollWidth` 在三个宽度下均未超出视口，无异常横向滚动。
- `dashboard.html`：切到原生箭头后计算样式与组件页一致（`32×32`、`opacity 0.5` 空闲、`hover` 后 `opacity 1`），点击右箭头正确切到第 2 项、指示器同步；页面既有的若干 404（无关的侧边栏导航图标与字体文件，验证沙箱未完整搬运全部资源，非本次改动引入）之外没有新增报错。
- 结构校验：`gj-b2b-components.css` 大括号计数 991/991 平衡；`gj-b2b-tokens.css` 大括号计数平衡；`preview/carousel/index.html`、`preview/patterns/dashboard.html` 的 `div`/`section`/`button` 标签计数改动前后均一致匹配；`preview/patterns/page-patterns.css` 删除死代码后大括号计数仍平衡。

同步更新 `schema.json`（`source.figmaAudit` 追加 `implemented-2026-09-15`；`componentSetNodes` 里 `Carousel_item_arrows` 的 `note` 补充"已落地为共享 CSS"）、`rules.md`（箭头段落补充"已实现为共享类 `.gj-carousel-arrow`，见 `preview/carousel/index.html` 导航箭头小节"）、`mapping.json`（`runtimeMap.arrowLeft/arrowRight` 更正为实际生效的选择器与状态触发方式：`:hover`/`:focus-visible` 自动生效 + `.is-active` 文档专用类，不是此前设想的"JS 手动加 `.is-active`"）。

结论：CAR-008 已关闭。Figma 原生箭头组件 `Carousel_item_arrows` 现在有对应的共享实现 `.gj-carousel-arrow`，组件预览页与唯一实际使用走马灯的业务模式页（`dashboard.html`）均已接入，视觉、状态透明度和边界禁用行为与 Figma 规格及既有文档记录一致。

> **2026-09-16 更正**：本条记录声称已在 `assets/styles/gj-b2b-tokens.css` 新增的 9 个 `--ds-component-carousel-arrow-*` Token，实际从未写入过项目真机上的该文件——当时的验证核对的是云端一份已经出现局部内容漂移的本地镜像副本，不是用户设备上的真实文件。此问题已在 CAR-011 中定位并修复，详见该条。

## 2026-09-16：「使用规则」表格缺失导航箭头一行，用户误以为箭头未接入共享基座（新增并关闭 CAR-009）

背景：用户提问「走马灯 Carousel 里的导航箭头是不是没有保存共享基座？现在规则页没有看到」。

排查：先核实 CSS/组件层——`.gj-carousel-arrow` 及配套 Token（`--ds-component-carousel-arrow-*`）确实已在 `assets/styles/gj-b2b-components.css`/`gj-b2b-tokens.css` 中定义（CAR-008 于 2026-09-15 完成），`preview/carousel/index.html` 的「导航箭头」小节与「尺寸与 Token」表格也都在正常展示，共享基座本身没有问题。

再核实用户所说的「规则页」——对照 `preview/carousel/index.html` 的「使用规则」表格（主题/推荐做法/边界与避免 三列）发现，表格只有播放方式、暂停条件、指示器、内容数量四行，唯独没有导航箭头这一行；而 `references/components/carousel/rules.md` 内部审计文档里其实早就记录了对应的使用规则（"导航控件：必须提供明确的左右箭头""切换方式：支持点击箭头和点击指示器切换"，产品已于 2026-09-10 确认）。也就是说共享基座和组件展示都已落地，唯独这份内部规则没有同步搬到预览页的可见表格里，才让用户误以为箭头没有正式纳入规范。

修复：`preview/carousel/index.html` 的「使用规则」表格里，在「指示器」和「内容数量」之间插入「导航箭头」一行，内容依据 `rules.md` 已确认的规则改写为表格惯用的「推荐做法/边界与避免」句式：默认展示左右箭头、空闲态半透明、悬停聚焦态切换为不透明、不支持 loop 时到达边界置为禁用态；边界与避免明确箭头是用户主动控制切换的主要方式不应隐藏，且禁用态不得复用空闲/激活两态语义（呼应 CAR-008 里禁用态用独立 Token、不借用 default/active 语义的实现）。未改动任何 CSS/Token/JS。

验证：Playwright 核实「使用规则」表格现为 5 行，新增行文案完整无缺漏；截图复核表格排版正常、无溢出；960px/680px/420px 三个窄屏下页面 `scrollWidth` 均未超出视口；零控制台报错、零 404。

结论：CAR-009 已关闭。共享基座（CSS/Token/组件展示）本身在 CAR-008 时已正确落地，本次修复的是预览页「使用规则」表格与内部 `rules.md` 之间的文档同步缺口。

## 2026-09-16：CAR-008 上线时漏改预览页缓存版本号，导致箭头按钮实际不可见（新增并关闭 CAR-010）

背景：用户反馈「当前走马灯页任何地方都看不到箭头按钮」。CAR-009 排查时确认过共享 CSS/Token/组件展示都已正常（用本地镜像验证），但用户看到的是自己浏览器里的真实页面，与本地一次性验证环境不是同一份缓存状态，需要单独排查。

排查：CAR-008（2026-09-15）把 `.gj-carousel-arrow` 相关规则写进了共享文件 `gj-b2b-components.css`，以及给 `gj-b2b-tokens.css` 新增了 `--ds-component-carousel-arrow-*` 一组 Token，但**当时改共享文件后忘了同步升级引用页面的缓存版本号**：`preview/carousel/index.html` 里这两个文件的链接从始至终都是 `?v=carousel-1`（在 CAR-008 之前就是这个值），没有跟着这次改动升级；`preview/patterns/dashboard.html`（CAR-008 提到的唯一实际用到走马灯箭头的业务页）虽然自己链接的是 `page-patterns.css?v=navbar-shared-1`，但真正的组件样式是通过 `page-patterns.css` 内部的 `@import url(gj-b2b-components.css?v=navbar-shared-1)` 间接引入的，这个内部 `@import` 的版本号同样没有跟着 CAR-008 升级；另外今天 TAB-008/SEA-006 两次改动 `gj-b2b-components.css` 时，`navbar-shared-1` 这个版本号也只在 `preview/navbar/index.html` 自己的 `<link>` 标签上升级到了 `navbar-shared-2`，没有同步改到 `page-patterns.css` 内部的 `@import`（`page-patterns.css` 本身及引用它的 `object-detail/dashboard/step-task/search-list/form-edit` 五个业务模式页当时都被漏改）。凡是在这些改动落地之前访问过这些页面、浏览器缓存了旧版 `gj-b2b-components.css` 的用户，因为请求 URL（含 query string）完全没变，浏览器会直接复用缓存，看不到任何新增/修改的样式——箭头按钮在没有 `.gj-carousel-arrow` 规则时会退化成无任何定位、透明度、遮罩图标的浏览器默认按钮，非常容易被当成「完全不可见」。

修复：
1. `preview/carousel/index.html`：`gj-b2b-tokens.css`、`gj-b2b-components.css` 的版本号统一由 `carousel-1` 升级为 `carousel-2`；
2. `preview/patterns/page-patterns.css`：内部 `@import` 引用的 `gj-b2b-components.css` 版本号由 `navbar-shared-1` 升级为 `navbar-shared-2`（与 SEA-006 时 `preview/navbar/index.html` 已升级的版本号对齐）；
3. 引用 `page-patterns.css` 的 5 个业务模式页（`object-detail.html`/`dashboard.html`/`step-task.html`/`search-list.html`/`form-edit.html`）自身的 `page-patterns.css?v=navbar-shared-1` 同步升级为 `navbar-shared-2`——因为浏览器按精确 URL 缓存，只改 `page-patterns.css` 文件内容、不升级引用它的外层版本号，缓存过该文件的浏览器仍会复用旧内容，间接 `@import` 的版本号也就不会生效。

验证：Playwright 核实 `preview/carousel/index.html` 与 `preview/patterns/dashboard.html` 里所有 `.gj-carousel-arrow` 计算样式均正确（32×32、圆角 16px、背景 `rgba(255,255,255,.3)`）；`object-detail/dashboard/step-task/search-list/form-edit` 五个业务模式页零控制台报错、零 404；全项目 grep 确认 `carousel-1`、`navbar-shared-1` 两个旧版本号已无残留引用。

结论：CAR-010 已关闭。用户看到的「箭头按钮不可见」是浏览器缓存了 CAR-008 之前的共享 CSS（未随组件改动同步升级引用页面的版本号）导致，不是共享基座本身缺失；已补齐 CAR-008 与今日 TAB-008/SEA-006 两批改动遗漏的全部缓存版本号，并建议用户强制刷新（如 Cmd+Shift+R）当前打开的走马灯页与相关业务模式页以获取最新样式。

## 2026-09-16：真正原因不是缓存，是 CAR-008 从未真正写入的 9 个箭头 Token（新增并关闭 CAR-011，更正 CAR-010 诊断）

背景：用户按 CAR-010 的建议强制刷新后回复「还是没有」，说明缓存不是全部原因，需要重新排查。CAR-010 的验证之所以显示"正常"，是因为当时核对用的是云端验证环境里的一份本地镜像文件，而不是直接读取用户设备上的真实文件——这是本项目一贯要求的"改动做在设备真机上、验证前必须重新从设备拉取镜像"的纪律这次没有严格执行到位。

排查：用户提供了一张实际截图——「导航箭头」小节的三个演示框内完全没有任何按钮痕迹（不是样式错误的按钮，是彻底不存在的视觉元素），且页面其余部分（标题、表格、交互演示侧栏按钮、下拉框等）样式全部正常。这说明 `gj-b2b-components.css`/`gj-b2b-tokens.css` 整体是能正常加载的，问题只出在箭头这一组规则上。用 `grep` 直接核对用户设备上的真实 `assets/styles/gj-b2b-tokens.css`（而不是云端镜像），发现 CAR-008 声称新增的 9 个 Token——`--ds-component-carousel-arrow-size/-radius/-padding/-idle-opacity/-active-opacity/-disabled-opacity/-background/-icon-color/-focus-ring`——**一个都不存在**，只有当初就有的 `--ds-component-carousel-padding` 一个。而 `.gj-carousel-arrow` 规则（`gj-b2b-components.css`）大量依赖这些未定义 Token 且都没有写 fallback 值（如 `width:var(--ds-component-carousel-arrow-size)`），未定义的自定义属性会让整条声明在计算值阶段失效，退回属性初始值——`width`/`height` 退回 `auto`、`position:absolute` 因为 `left`/`right`/`top` 同样失效而实际不生效、`background`/`opacity` 等同样无法计算——按钮内部只有一个不带文字的空 `<i>` 图标元素，最终整个按钮在页面上收缩成不可见的空标签，与用户截图的「完全看不到」完全吻合。进一步核对发现，云端验证用的本地镜像文件在这 9 个 Token 之外，还存在其他区域（Metric 色卡、Drawer 相关 Token）的漂移内容，与设备真机不一致，是更早某次会话验证时被意外写入镜像、却没有真正同步回设备的遗留问题（不在本次改动范围内，仅记录以便后续排查时留意，不代表这些区域本身有功能性错误）。

修复：直接在用户设备上的 `assets/styles/gj-b2b-tokens.css` 补齐这 9 个 Token（尺寸/圆角/内边距/三态透明度五个写在近旁的 `--ds-component-carousel-*` 尺寸区块，颜色引用三个写在近旁的 `--ds-component-carousel-lightactive-background` 等颜色区块，均取用 CAR-007/CAR-008 文档里早已确认过的规格：32px/16px/4px/0.5/1/0.35，背景引用 `--ds-background-wt-30`、图标色引用 `--ds-text-reversal`、聚焦环引用 `--ds-background-bt-b20`）；随后重新从设备拉取全部相关文件到云端验证镜像（而不是增量拷贝单个文件），确认镜像与设备逐字节一致后才继续验证；`preview/carousel/index.html` 的缓存版本号再升级一次（`carousel-2`→`carousel-3`），确保浏览器一并拿到这次真正补齐的 Token。

验证：Playwright 核实 `preview/carousel/index.html`「导航箭头」小节与「交互演示」区的全部 `.gj-carousel-arrow` 计算样式恢复正常（32×32、圆角 16px、背景 `rgba(255,255,255,.3)`、三态透明度 0.5/1/0.35 均生效）；`preview/patterns/dashboard.html`（共用同一份 `gj-b2b-tokens.css`，未单独改动）同步核实箭头样式正常；对全部 39 个组件规范页跑零报错/零 404 回归扫描，仅 metric 页一个既有的、与本次改动无关的图片 404；截图复核「导航箭头」小节三个演示框内箭头清晰可见。

结论：CAR-011 已关闭，CAR-010 的诊断需要更正——真正原因不是缓存版本号（那确实是一个真实存在、也值得修的独立问题，但不是用户这次看不到箭头的根本原因），而是 CAR-008 声称新增的 9 个共享 Token 从未真正落到用户设备的文件里，本次已直接在设备真机上补齐并逐字节核对镜像一致性后再验证。
