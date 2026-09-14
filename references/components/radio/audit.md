# Radio Figma 审计

来源：Figma 页面 `2982:4462`，2026-09-08 只读检查。三个组件集分别为 `Radio button item`（`2982:3997`，7 variants）、`Radio button`（`2982:4003`，7 variants）和 `Radiobutton Group`（`2982:4176`，10 variants），合计 24 variants，与 inventory 一致。

本轮使用节点元数据、变量定义、组件集截图及现有 SVG 资源交叉核对。完整设计上下文接口对单节点持续超时，因此未返回的 Prototype Reaction 不写成已确认事实。

## 已确认的真实状态矩阵

| Figma 状态 | 视觉与变量 | 代码映射 |
|---|---|---|
| default | 白底 + `Border/secondary` | default |
| hover | 白底 + `Border/focused` | `:hover` |
| mouseon | 20px `Background/BT_B15` halo + 蓝色描边 | `:focus-visible` |
| checked | `Border/focused` 控件 + `Text/reversal` 白点 | checked |
| mousedown | checked 控件 + BT_B15 halo | checked + `:active` |
| disabled | N03 + N05，文字 `Text/disable` | disabled |
| checked-disabled | N03/N05 + `Text/disable` 点 | checked + disabled |

- 控件 16 × 16；mouseon/mousedown halo 为 20 × 20，向四周各扩 2px。
- 标签与控件间距 8；Group 横向/纵向间距均为 12。
- Figma 状态视觉与现有 `radio-pc-*.svg` 资源的颜色和构成一致，代码应继续引用资源，不用原生 CSS 猜画。
- 标签文字绑定 `Body_14px_regular`，解析为 Microsoft YaHei / 14 / 22 / 400。

## 开放问题

1. **RAD-001 · 已关闭（2026-09-10 设计确认）：标签文字样式已改绑**
   - 此前全部 Radio label variant 使用旧样式 `Body_14px_regular`。
   - 2026-09-10 复查节点 `2982:4003` 下 `2982:4002`（default）与 `2982:4016`（disabled=true）两个样本，均确认已改绑为当前字体体系的 `中文/S8-CN-R`（PingFang SC / 14 / 22 / 400）。

2. **RAD-002 · 已关闭（2026-09-10 设计确认 + Figma 复查）：Group 的 vertical 拼写错误**
   - 原 5 个纵向 variant 的属性值均为 `align=verticle`。
   - 2026-09-10 复查节点 `2982:4176`：5 个纵向 variant（`2982:4260/4263/4267/4272/4278`，count=2~6）属性值均已确认为 `align=vertical`，Figma 侧拼写已修正。
   - `mapping.json` 中 `align.verticle→vertical` 的兼容归一化暂保留（按需求"暂保留兼容归一化"），作为历史缓存/未刷新实例的兼容层，同时新增 `align.vertical→vertical` 作为直接映射。

3. **RAD-003 · 已关闭（2026-09-08 设计确认）：mousedown 是按下瞬间的动态过渡效果**
   - `state=mousedown`（`2982:3990`）及 label 对应 variant `2982:4046` 的静态截图是 checked 控件叠加 halo，只是该动效落定后的一帧。
   - 设计确认：mousedown 表示按下瞬间的一个短暂动态样式效果（transient press animation），不是需要单独设计的持久静态态；它在按下的选项上短暂播放，并在松开后过渡为该选项最终的选中/未选中外观。
   - 因此不需要为“未选中项按下”单独设计一套静态资源；代码侧按 `:active` 的瞬时过渡动画实现即可，沿用现有 `radio-pc-pressed.svg` + `radio-pc-press-ring.svg` 作为过渡终点的视觉参考。

4. **RAD-004 · 已关闭（2026-09-08 设计确认）：状态命名不表达交互语义**
   - `mouseon` 的实际视觉是键盘 focus-visible 光晕，与鼠标 hover 触发方式不同；`mousedown` 的实际视觉是按下瞬间的过渡动效（RAD-003 已确认）。
   - 设计确认：`mouseon` 的 20px 光晕作为独立的键盘焦点提示予以保留，不与 hover 合并（避免键盘用户失去独立、高辨识度的焦点提示）；本地状态名由 `mouseon` 重命名为 `focus` 以准确表达语义。Figma 源属性值本身仍为 `mouseon`，不需要 Figma 侧改名。
   - `mousedown` 语义已随 RAD-003 澄清为按下过渡动效，命名沿用现状，不再单独跟踪。

## 结论

Radio 的 3 个组件集、24 个 variants、状态变量、几何和 SVG 资源引用已经完成真实 Figma 审计；schema/mapping 已升级为 `figma-audited`。RAD-001/RAD-002/RAD-003/RAD-004 均已关闭：RAD-001 于 2026-09-10 确认标签文字样式已改绑 `中文/S8-CN-R`；RAD-002 于 2026-09-10 确认 Figma 侧纵向 Group 拼写已修正为 vertical（mapping 兼容映射暂保留）；RAD-003/RAD-004 已按 2026-09-08 设计确认关闭（mousedown 澄清为按下过渡动效，mouseon 保留独立键盘焦点光晕并重命名为 focus）。Radio 组件全部审计问题已关闭。现有 Token 与构建脚本本轮未修改。

## 2026-09-10：Group 纵向拼写修正（关闭 RAD-002）

- Figma 节点 `2982:4176`（Radiobutton Group）复查：5 个纵向 variant 的 `align` 属性值均已由 `verticle` 修正为 `vertical`。2026-09-10 用户提供同一节点后再次 `get_metadata`：10 个子变体图层名无 `verticle`，纵向 5 个均为 `align=vertical`。

| 节点 | count | align（复查值） |
|---|---|---|
| `2982:4260` | 2 | vertical |
| `2982:4263` | 3 | vertical |
| `2982:4267` | 4 | vertical |
| `2982:4272` | 5 | vertical |
| `2982:4278` | 6 | vertical |

- `schema.json`：`figma.rawProperties.group.align` 由 `["horizontal","verticle"]` 更新为 `["horizontal","vertical"]`；`properties.align`（代码侧规范值）本就是 `["horizontal","vertical"]`，无需改动。
- `mapping.json`：新增 `align.vertical → vertical` 作为直接映射；保留 `align.verticle → vertical` 作为兼容归一化，覆盖历史缓存或未刷新的旧实例（按用户要求"mapping 暂保留兼容归一化"，不删除）。
- 代码侧 `direction`/`GjRadioGroup` 逻辑无需改动，因为规范化目标值本就是 `vertical`。

## 2026-09-10：标签文字样式改绑（关闭 RAD-001）

- Figma 节点 `2982:4003`（Radio button）复查：`2982:4002`（disabled=false, checked=false）与 `2982:4016`（disabled=true）两个样本的 label 文字样式均已由旧样式 `Body_14px_regular` 改绑为 `中文/S8-CN-R`（Font: PingFang SC, Regular, 14, weight 400, lineHeight 22, letterSpacing 0）。
- `schema.json` 的 `typography` 字段已更新：`figmaTextStyle` 由 `Body_14px_regular` 改为 `中文/S8-CN-R`，`resolved` 由 `Microsoft YaHei / 14 / 22 / 400` 更新为 `PingFang SC / 14 / 22 / 400`，`status` 由 `legacy-binding-pending-confirmation` 改为 `confirmed-2026-09-10`。
- `mapping.json` 的 `tokenMap.typography.figma` / `typography.currentEquivalent` 同步更新说明。
- 代码侧字体映射本就以 `中文/S8-CN-R`（当前系统等价样式）为准，无需改动实现。

## 2026-09-11：清理预览页残留旧 CSS（新增并关闭 RAD-005）

背景：延续 MDL-010（见 `components/modal/audit.md`）建立的方法，对 `preview/radio/index.html` 做同样的死代码核查——用户明确的标准原则是预览页无论静态展示区还是交互区，都应该只用标准组件基座渲染，不应该残留旧 CSS。

排查方法：同 MDL-010，解析页面全部 `<style>` 块，提取每个选择器涉及的类名，逐个类名对照页面真实 `class="..."` 属性（含 JS 动态拼接的模板字符串）确认是否被引用；复合选择器按逗号拆分成分支逐项判断，只删除全部分支都确认无引用的规则，混有真实类的复合选择器保留但裁掉死亡分支。

整条规则删除（1 条）：`.code`。

验证：脚本二次扫描确认页面残留死选择器为 0；`<style>` 块大括号计数与逐字符深度校验均通过（与 button.html 同批次校验时一并发现并排除结构性错误）；本文件删除/裁剪的选择器均逐一比对过页面真实 `class="..."` 与 `classList` 调用，确认为未引用的旧代码，属于低风险清理，未单独截图复核。

结论：RAD-005 已关闭。`preview/radio/index.html` 内嵌 CSS 现在只包含仍被页面实际使用的选择器。

## 2026-09-11：预览页改用统一展示框架并精简结构（新增并关闭 RAD-006）

背景：同 Checkbox（见 [checkbox/audit.md](../checkbox/audit.md) CHK-007）——其他 agent 已按统一的展示背景规则重构了多个预览页，Radio 页此前仍是旧版页面私有结构，需要按同一规则迁移。Radio 页原本已经在使用共享的 `gj-radio-group`/`gj-radio-group-vertical`（横向/纵向排列示例），这部分不需要改动。

决策与实现：
- 迁移到 `docs-shell` 框架，四段结构精简为「状态」「排列方式」「交互演示」「选用规则」，去掉原来单独的「结构与尺寸」卡片区，16×16px、8px 间距等关键尺寸信息合并进页首简介。
- 状态展示、排列方式两个静态展示区改用灰色背景（`docs-surface-gray`）：Radio 未选中态视觉上也是浅色圆环（`radio-pc-default.svg`），与 Checkbox 同理需要灰色画布制造明度差；交互演示区的控制面板固定使用白色（`docs-surface-white`）。
- 「选用规则」从 4 张独立卡片收敛为统一的「主题 / 推荐做法 / 边界与避免」三列表格，信息不丢失。

验证：本地起 http.server 用真实共享 CSS/Token（含 `radio-pc-*.svg` 状态图标）渲染整页，Playwright 截图确认状态矩阵、排列方式、交互演示三处视觉正确；脚本操作互斥选择（切到「基金」）确认事件文案联动正确，控制台无报错。

结论：RAD-006 已关闭。`preview/radio/index.html` 现在使用与 Checkbox 等页面一致的展示框架和背景规则。
