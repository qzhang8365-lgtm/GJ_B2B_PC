# Checkbox Figma 审计

来源：Figma 页面 `2401:9`，2026-09-08 首次只读检查，2026-09-10 复核 Checked / Indeterminate 色彩绑定。三个组件集分别为 `checkbox item`（`2470:190`，7 variants）、`checkbox`（`2472:198`，7 variants）和 `Checkbox Group`（`2472:256`，6 variants），合计 20 variants，与 inventory 一致。

本轮使用节点元数据、变量定义和组件集截图交叉核对。完整设计上下文接口对单节点持续超时，因此未返回的 Prototype Reaction 不写成已确认事实。

## 已确认的真实状态矩阵

| 状态 | Figma 绑定 |
|---|---|
| Default | `Background/Container` + `Border/secondary` |
| Hover | `Background/Container` + 旧语义 `边框色/品牌`（#2B73FF） |
| Checked | `Brand/GJ_Blue` 填充 + `Text/reversal` 勾选 |
| Indeterminate | `Brand/GJ_Blue` 填充 + `Text/reversal` 横线 |
| Disabled | `Background/Background` + `Border/secondary` |
| Checked/Indeterminate Disabled | N03/N05 控件 + `Text/disable` 标记 |

- 控件 16 × 16，圆角 4；标签间距 8，标签行盒 22。
- Group 只提供 count=1–6 的水平组合；实例高度 32，实测相邻选项间距 24。
- Figma 没有 Pressed、Focus variant；本地 stateMatrix 的两项是代码补充。
- 标签文字绑定旧 `Body_14px_regular`，解析为 Microsoft YaHei / 14 / 22 / 400。

## 开放问题

1. **CHK-001 · 应修复：同一组件混用旧变量命名**
   - Hover 使用 `边框色/品牌`，部分 Disabled 标签使用 `文本色/disable`；其他状态使用当前 `Border/focused` / `Text/disable` 体系。
   - 当前解析值分别仍为 #2B73FF / #B8C0CC，但跨集合混用会造成主题与迁移风险。
   - 建议统一改绑当前正式语义变量。

2. **CHK-002 · 已关闭（2026-09-10）：Checked / Indeterminate 正式填充语义**
   - 设计确认控件填充统一使用 `Brand/GJ_Blue`，勾选和横线使用 `Text/reversal`。
   - Figma 节点 `2470:195`（Checked）与 `2470:204`（Indeterminate）变量复核均返回 `Brand/GJ_Blue = #2B73FF`；已与 componentToken 保持语义和值双重一致。

3. **CHK-003 · 已关闭（2026-09-08 设计确认）：Group 间距区间**
   - Figma `2472:259` 两个 66px 选项位于 x=0 和 x=90，实测 gap=24px；其余 count variant 延续相同节奏。
   - 设计确认：实现允许在 20-24px 区间内浮动，非固定单值；`checkbox.tokens.json` 的 `group.gap` 已改为默认 20px（`Interval/space6`），并登记 20-24px（`Interval/space6`–`Interval/space7`）的可选区间，不再使用旧值 16px。

4. **CHK-004 · 应修复：标签仍绑定旧文字样式**
   - 全部标签状态返回 `Body_14px_regular`（Microsoft YaHei / 14 / 22 / 400）。
   - 当前字体体系的等价样式为 `中文/S8-CN-R`。建议在 Figma 统一改绑，并复查 Disabled 状态没有局部覆盖。

5. **CHK-005 · 已关闭（2026-09-10 设计确认）：缺少 Pressed / Focus 设计状态**
   - 组件集仅含 Hover，没有 Pressed 与 Focus。
   - 设计确认：不需要这两个状态，现有 Hover（指针交互反馈）与 Checked（选中状态反馈）已可满足需求，不再补 Figma variant。
   - 代码侧的 `:focus-visible` 键盘焦点环（`assets/styles/gj-b2b-components.css` 第 504 行，3px / `Background/BT_B20`）继续保留，这是无障碍键盘导航的基本要求，与 Figma 是否有 Focus variant 无关，不受本次关闭影响。

## 结论

Checkbox 的 3 个组件集、20 个 variants、主要几何和全部可见状态变量已经完成真实 Figma 审计；schema/mapping 已升级为 `figma-audited`。CHK-002、CHK-003、CHK-005 已按设计确认关闭；CHK-001、CHK-004 仍待 Figma 复查。

## 2026-09-11：清理预览页残留旧 CSS（新增并关闭 CHK-006）

背景：延续 MDL-010（见 `components/modal/audit.md`）建立的方法，对 `preview/checkbox/index.html` 做同样的死代码核查——用户明确的标准原则是预览页无论静态展示区还是交互区，都应该只用标准组件基座渲染，不应该残留旧 CSS。

排查方法：同 MDL-010，解析页面全部 `<style>` 块，提取每个选择器涉及的类名，逐个类名对照页面真实 `class="..."` 属性（含 JS 动态拼接的模板字符串）确认是否被引用；复合选择器按逗号拆分成分支逐项判断，只删除全部分支都确认无引用的规则，混有真实类的复合选择器保留但裁掉死亡分支。

整条规则删除（2 条）：`.checkbox span`、`.code`。

验证：脚本二次扫描确认页面残留死选择器为 0；`<style>` 块大括号计数与逐字符深度校验均通过（与 button.html 同批次校验时一并发现并排除结构性错误）；本文件删除/裁剪的选择器均逐一比对过页面真实 `class="..."` 与 `classList` 调用，确认为未引用的旧代码，属于低风险清理，未单独截图复核。

结论：CHK-006 已关闭。`preview/checkbox/index.html` 内嵌 CSS 现在只包含仍被页面实际使用的选择器。

## 2026-09-11：预览页改用统一展示框架并精简结构（新增并关闭 CHK-007）

背景：其他 agent 按用户给出的展示背景规则（默认白色；组件自身白底/灰底填充时按需用灰色；深色或透明组件用专用对比背景；展示背景与组件默认填充至少保持一级明度差）陆续重构了 Button、Divider、Tabs、Sidebar、Navbar、GridNav 等预览页的布局与样式，统一迁移到共享的 `docs-shell/docs-page-head/docs-sheet/docs-section/docs-stage/docs-surface-*` 框架（`assets/styles/component-docs.css`）。Checkbox 页此前仍是旧版页面私有结构（`.shell/.intro/.component/.panel/.grid/.state-grid` 等自建类），且「多选组合」「全选与半选」的子项列表用的是裸 `.group`/`.children` div，没有使用组件已有的共享类 `gj-checkbox-group`。

决策与实现：
- 迁移到 `docs-shell` 框架，四段结构精简为「状态」「组合与全选」「交互演示」「选用规则」，去掉原来单独的「结构与尺寸」卡片区——16×16px、4px 圆角等关键尺寸信息合并进页首简介一句话带过，减少与其他章节重复的独立卡片。
- 状态展示、组合与全选两个静态展示区改用灰色背景（`docs-surface-gray`）：Checkbox 默认态是白底 + 描边（`.gj-checkbox{background:var(--ds-background-container)}`），直接放在同样是白色的 `docs-sheet` 画布上不满足「展示背景与组件默认填充至少保持一级明度差」，需要灰色画布制造对比；每个 state/combo 卡片内部再用白色卡片承载单个示例，形成灰底白卡的两级结构。交互演示区的属性控制面板固定使用白色（`docs-surface-white`），演示舞台 `.lab` 与静态展示区保持同样的灰色规则。
- 「多选组合」与「全选与半选」的子项列表改用共享 `gj-checkbox-group`（`display:flex;gap:16px`），不再用页面私有的 `.group`/`.children` 类反推间距，间距来源与组件规则里「不小于 16px」的要求一致。
- 「选用规则」从 3 张独立卡片收敛为统一的「主题 / 推荐做法 / 边界与避免」三列表格（`docs-spec-table`），并把原「结构与尺寸」区的组合间距规则并入表格新增一行，信息不丢失，展示更紧凑。

验证：本地起 http.server 用真实共享 CSS/Token 渲染整页，Playwright 截图确认状态矩阵、组合与全选、交互演示三处视觉正确；脚本操作多选（勾选基金+债券）、全选联动、半选状态均按预期同步，控制台无报错。

结论：CHK-007 已关闭。`preview/checkbox/index.html` 现在使用与 Button/Divider/Tabs 等页面一致的展示框架和背景规则，交互 Demo 区改用真实共享组件类承载子项列表。
