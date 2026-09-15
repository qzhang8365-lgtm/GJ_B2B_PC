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
