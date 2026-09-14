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
