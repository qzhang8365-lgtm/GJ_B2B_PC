# Modal Figma 审计

来源：用户提供画板 `4759:19935`（Modal），2026-09-09 只读检查。未修改 Figma。官方 MCP `get_design_context` / `get_variable_defs` / `get_metadata` 读取。

inventory 该页记 **1 套 / 12 variants / standalone 0**。画板可见 **3** 个 Modal symbol（Standard × 三档宽度）+ **4** 个 `modal_item/feedback-content` symbol，见 MDL-001。MCP 把 Modal 呈现为画板 frame `3553:11705` 内的 symbol，**没有**返回 COMPONENT_SET 根节点。

Figma 组件说明（绑在 `3553:11705`）仍写「Standard、Confirm、Destructive、Result」和「400/520/720」。与画板发布值不一致，见 MDL-002 / MDL-003。实现以画板为准。

## 已确认的组件集

### Modal（frame `3553:11705`，可见 3 variants）

| Size | 节点 | 画板宽×高 |
|---|---|---|
| Small-400 | `3553:11541` | 400×242 |
| Medium-600 | `3552:2` | 600×232 |
| Large-800 | `3553:11623` | 800×316 |

共用：

- 容器 `Background/Container`、圆角 `Radius/Radius-LG` **12**、效果 **`shadow-center`**（0 0 15 `Background/MK_10`）
- Header **64**，`px 20 / py 12`，标题 `中文/S4-CN-S` / `Text/Primary`
- 关闭 **20×20**，`Radius/Radius-SM` 6，色 `Text/Tertiary`，BOOLEAN `showClose` 默认 true
- 内容为 Slot，组件本身**没有**内边距；占位文案 `中文/S9-CN-R` / `Text/Secondary`
- Footer **72**，`gap 8`，`px 24`，生成代码 `pt 20 / pb 24`，按钮 Medium **32**（`Components/control-M`），右对齐
- 取消：Container + `Border/secondary` + `Text/Primary`
- 确认：`Button/Primary/Bg-default` + `Text/reversal`

Footer 高 72 与 `20+32+24` 对不上，见 MDL-004。Small / Large 生成代码 `items-end`；Medium 为 `items-center`。Small 样本实例按钮 `top=16`。

样本区 `4515:23456`：Small 确认/短表单、Medium 预约表单、Large 级联再分配。内容填充不进入 Modal chrome Token。Medium 表单生成代码为 `left:120`、`items-end`、`justify-center`，标签悬挂在控件栏左侧并右对齐；Small 短表单 `left:104` / `w:272`。这会把控件栏推到视觉中部。2026-09-09 用户确认 B 端弹窗内容必须左对齐撑满，见 MDL-007；实现不复制该样本的居中观感。确认提示 `modal_item/feedback-content` 本身已是 `items-start` + `px 24`。

### modal_item/feedback-content（`4515:22054`，4 variants）

宽 **408**（放入 Small 400 时实例约 379）、`px 24`、行内 `gap 12`、文案栈 `gap 8`、图标 **28** 圆。

| state | 标题 | 图标色 | 图标 |
|---|---|---|---|
| Default `4515:22051` | `中文/S5-CN-S` / `Text/Primary` | `Feedback/brand` | `3107:2148` → `icf_system_question-fill` |
| alert `4515:22052` | 同上 | `Feedback/warning` | `3107:2143` → `icf_system_warning-fill`（与 Toast info 同实例，不是 alert-fill） |
| success `4515:22053` | 同上 | `Feedback/success&decline` | `3107:2160` → `icf_system_check-circle-fill` |
| error `4515:22055` | 同上 | `Feedback/error&rise` | 独立读取未返回 iconfont 名；按 close-circle-fill 记录（MDL-006） |

说明文字一律 `中文/S9-CN-R` / `Text/Secondary`。

## 相对旧 rules-derived / 共享 CSS 的核对

1. 宽 400/600/800、Header 64、Footer 72、按钮 32、间距 8，与旧 rules 一致。
2. 共享 `.gj-modal` 曾默认 **400px**，Figma 默认 Medium **600**。
3. 投影是 **`shadow-center` 15px**，不是 `0 8 28`。
4. 关闭是 **20px**，不是共享 `gj-icon-button` 的 32/16。
5. 本画板没有 Mask。现有层用 `Background/MK_45`；Mask 契约默认是 MK_60。不把 MK_60 写成 Modal 真值。
6. Figma 说明里的 520/720 与四类 Type **未**出现在本画板发布 variant 上。

## 开放问题

1. **MDL-001 · P3 · 待 inventory 复查** — 页面 inventory 1/12/0；画板可见 Modal 3 + feedback 4。说明文案里的 4 场景 × 3 尺寸能凑出 12，但未作为 symbol 出现。
2. **MDL-005 · P3 · 已关闭（2026-09-10）** — Modal 关闭 20px，与 Button 规则里 `gj-icon-button` 32/16 不一致。设计确认：关闭按钮的 icon 就是 20px，Icon 组件尺寸阶梯（12/16/20/24/28/32/36）本来就有 20 这一档，不是临时凑出来的数值；Modal 关闭控件保持画板 20×20 真值，不套用 gj-icon-button 的 32/16 配方。
3. **MDL-006 · P3 · 待 Figma 复查** — error 反馈图标独立读取未返回 iconfont 节点名。
4. **MDL-007 · 已确认** — 内容区左对齐撑满。画板表单样本的悬挂右对齐标签与垂直居中不作为实现依据。

## 已关闭问题（2026-09-09，用户确认）

5. **MDL-002/003 · 已关闭** — 宽度采用画板发布值 **400/600/800**；Figma 组件说明里的「400/520/720」与「Standard/Confirm/Destructive/Result」四类 Type 判定为未同步的旧描述文案，不作为设计真值。与 Drawer 的三档宽度体系保持一致。
6. **MDL-004 · 已关闭** — Footer 计算依据用户明确给出：按钮组位于卡片右下角、页边距 24、距上方内容至少 20。据此 Footer 高度改为 **76px**（20 顶部间距 + 32 按钮 + 24 底部页边距），不再用「压缩顶部内边距到 16 去凑 Figma 标注的 72」这种反过来牺牲间距约束的实现。
7. **MDL-008 · 已关闭（本轮新发现，当场关闭）** — Header 水平内边距 20px 与 Footer/Feedback 原有的 24px 不一致；用户复核后确认统一为 **20px**（不是提到 24），Footer 底部内边距 24px 不受影响，只统一左右内边距。已同步进 `schema.json`/`mapping.json`/`rules.md`/`modal.tokens.json`/`assets/styles/gj-b2b-components.css`（CSS 变量回退值）/`preview/modal/index.html`（文字说明），并重新跑过 `build-tokens.mjs` 让规范示意页的实际渲染值同步生效。

## 结论

Modal 为 `figma-audited`。三档宽度、Header/Footer、关闭 20px、shadow-center、反馈四态色与 Default/alert/success 图标已抽样核实。MDL-002/003/004/005/008 已经用户确认关闭；剩余 MDL-001/006 为非阻断的低优先级差异，`pendingExtraction` 为空。


## 2026-09-10：关闭控件尺寸确认（关闭 MDL-005）

用户澄清：「关闭按钮的icon是20px，icon尺寸阶梯里是有20这个值的」。

只读复核 `get_design_context` 对 `3552:2`（Modal Medium）：`Close action` 容器（`3552:10`）与内部 `Close icon`（`3552:11`）均为 `size-[20px]`，即整个关闭控件的命中区就是图标本身的 20×20，没有额外的更大命中区包裹——与既有记录「关闭 20×20」一致。

对照 `references/tokens/components/icon.tokens.json` 的 `size.values`：`[12, 16, 20, 24, 28, 32, 36]`，20 是图标尺寸阶梯里的合法档位（`--ds-component-icon-size-20`），不是一个游离于阶梯之外、需要归一到 16 或凑整的数值。

结论：Modal 关闭按钮与共享 `gj-icon-button`（32 命中区 + 16 图标）确实是两种不同的规格，但这是画板的真实设计意图（更紧凑的关闭控件），不是拼写或取值错误。保持现状：`.gj-modal-close` 命中区与图标都是 20×20，不改用 `gj-icon-button` 的 32/16 组合，也不新增一档"20 命中区"的 icon-button 变体。


## 2026-09-10：关闭按钮补充无障碍热区（MDL-005 后续实现）

用户要求：给关闭按钮设置一个大一点的热区。

MDL-005 已确认关闭图标本身保持 Figma 真值 20×20，不改视觉尺寸；这次是在视觉不变的前提下单独扩大可点击/可悬停区域，两者不冲突。

实现：

- `references/tokens/components/modal.tokens.json` 新增 `close.hitSize`（32px，`--ds-component-modal-close-hit-size`），并把原有 `close.size` 的说明改清楚——它是图标可见尺寸，不是热区。跑 `node scripts/build-tokens.mjs` 重新生成。
- `assets/styles/gj-b2b-components.css` 的 `.gj-modal-close`：按钮盒子从 20×20 改为 32×32（`--ds-component-modal-close-hit-size`），用 `margin:calc((20px - 32px)/2) = -6px` 把多出来的 12px 从布局占位里"收回去"，让它在 Header 的 flex 布局里仍只占 20×20 的空间——图标视觉位置完全不变，只是可点击区域向四周各多出 6px，热区总尺寸对齐共享 `gj-icon-button` 的 32px 命中区。内部 `<span>` 图标从硬编码 20px 改为绑定 `--ds-component-modal-close-size` 变量，尺寸不变。同时补上了 hover 背景（`Background/Hover`）、active 背景（`Background/Hover_2`）和 `:focus-visible` 环，让更大的热区有对应的视觉反馈，不是一块看不见的死区。
- Playwright 核实（本地起 http.server 渲染真实 CSS）：图标 `<span>` 仍是 20×20，其右边缘/垂直中心与 Header 20px 内边距、64px 高度算出的位置一致，改动前后位置不变；按钮实际盒子确认为 32×32，热区居中包住图标，不溢出 Header 边界；hover 时能看到背景和图标颜色变化。
- `mapping.json` 补充 `close.hitSize` 说明；`schema.json` 暂不改（Figma 侧真值仍是 20×20，热区是代码侧无障碍补充，已经在 `confirmedDecisions.MDL-005` 里说明二者不矛盾，不需要重复记录）。

## 2026-09-11：gj-modal-close 取消 Hover 背景叠加（新增并关闭 MDL-009）

背景：用户先决定 `gj-icon-button`（BTN-006）的 Hover 取消背景色叠加、只变图标颜色；随后被问及 Notification 关闭是否也共用 `gj-icon-button` 基座（结论：不共用，各自独立命名空间），进一步讨论「功能类似的弹窗关闭按钮该不该统一」。结论方向：尺寸不统一（Modal 20px 有 MDL-005 的 Figma 真值支撑，Notification 16px 同理），但 Hover 的视觉语言统一——都改成「只变图标颜色，不叠加背景」。

现状排查：`.gj-modal-close:hover` 此前是 `background:var(--ds-background-hover);color:var(--ds-text-primary)`，与 `gj-icon-button` 改动前的写法完全一致（历史上是同一套语言）。本次只去掉 `background`，保留 `color:var(--ds-text-primary)`；`:active`（`Background/Hover_2`）与 `:focus-visible` 环不动——用户仅要求统一 Hover，未提及 Pressed/Focus。32px 无障碍热区（`--ds-component-modal-close-hit-size`，MDL-005 附带修复）与 20×20 视觉尺寸均不受影响。

文档同步：`modal/rules.md`、`modal/schema.json`（`confirmedDecisions`、`constraints`）、共享 CSS 顶部注释已更新；`audit-tracker.md` 新增 MDL-009 并直接关闭。

结论：MDL-009 已关闭。`gj-modal-close` Hover 仅变图标颜色；与 `gj-icon-button`（BTN-006）、Notification 关闭（NTF-005）现在共用同一套「只变图标颜色」的 Hover 语言，尺寸各自保持 20/32/16 不变。

## 2026-09-11：清理预览页残留旧 CSS（新增并关闭 MDL-010）

背景：讨论 Modal/Notification/`gj-icon-button` 关闭按钮 Hover 统一（MDL-009、NTF-005、BTN-006）时，发现 `preview/modal/index.html` 内嵌 `<style>` 里还留着一批未引用的旧版 mock CSS（早于该页迁移到真实 `gj-modal-*` 组件类之前的草稿）。用户明确原则：预览页无论静态展示区还是交互区，都应该只用标准组件基座渲染，不应该残留旧 CSS。

排查方法：解析页面全部 `<style>` 块，提取每个 CSS 选择器涉及的类名，逐个类名对照页面真实 `class="..."` 属性（含 JS 动态拼接的模板字符串）确认是否被引用；对复合选择器（如 `.a,.b{...}` 或 `.a>.b,.c>.d{...}`）按选择器列表逐项判断，只删除全部子选择器都确认无引用的规则，混有真实类的复合选择器保留但裁掉死亡的子选择器分支，避免误删仍在生效的规则。

确认删除/裁剪的内容：

- 整条规则删除：`.icon-button`、`.icon-button img`、`.modal-window`、`.modal-header`、`.modal-title`、`.modal-content`（两处：内嵌 `<style>` 顶部 anatomy 专用块和通用块各一处）、`.modal-footer`、`.btn`、`.btn.primary`、`.btn.danger`、`.feedback`、`.feedback strong`、`.feedback p`、`.form`、`.field`、`.field label`、`.field input,.field select,.field textarea`、`.field input,.field select`、`.field textarea`、`.tone-icon`、`.tone-icon.error`、`.tone-icon.warning`、`.tone-icon.success`、`.tone-icon svg`、`.size-list`、`.size-item`、`.size-meta`、`.size-meta b`、`.size-meta span`——这批都是早期草稿用普通 `<button>`/`<img>` 拼的 mock 弹窗遗留，页面早已换成真实的 `gj-modal`/`gj-modal-close`/`gj-btn`/`gj-modal-feedback`/`gj-form-*` 组件类，CSS 却没有跟着清掉。
- 复合选择器裁剪（保留真实部分，去掉死亡分支）：
  - `.modal-content>.feedback,.modal-content>.form,.modal-content>.slot,.gj-modal-content>.form,.gj-modal-content>.slot{width:100%;max-width:100%}` → 只保留 `.gj-modal-content>.slot{width:100%;max-width:100%}`（`.slot` 本身是真实类，但只有以 `.gj-modal-content` 为父级的写法才对应实际结构；`.modal-content` 系列父级本身已不存在）。
  - `.anatomy-item,.rule{...}`、`.anatomy-item b,.rule b{...}`、`.anatomy-item p,.rule p{...}` → 均去掉 `.anatomy-item`（该页用自定义的 `.modal-anatomy`/`.anatomy-note` 布局，没有用到通用文档模板的 `.anatomy-item` 卡片），只保留 `.rule` 系列。
  - 响应式媒体查询里的 `.anatomy,.rules,.control-grid{grid-template-columns:1fr}` → 去掉 `.anatomy`，保留 `.rules,.control-grid`。

保留未动：`.case`/`.case-grid`、`.slot`、`.rule`/`.rules`、`.control-grid` 等——逐一核实过页面真实 `class="..."` 属性里确有对应节点，不是死代码。

验证：Playwright 起本地 http.server 加载完整目录结构（含依赖的 CSS、字体脚本、图标 SVG）渲染整页并截图，静态「组件结构」示意图、「业务内容案例」（确认提示、表单）、「尺寸与结构」表格、「交互属性」演示区（含点击「打开 Modal」触发的真实交互 Demo）视觉和交互均与改动前一致，无回归；同时用脚本二次扫描确认页面里已不存在任何未被引用的 CSS 类选择器（0 残留）。

结论：MDL-010 已关闭。`preview/modal/index.html` 内嵌 CSS 现在只包含仍被页面实际使用的选择器（49 个类，逐一核实引用）。这是本项目第一次针对「预览页展示区/交互区只用标准组件基座」做系统性核查，后续其他预览页如需类似清理，应沿用这套「先核对 class 引用再删/裁剪复合选择器」的方法，避免误删仍生效的规则。
