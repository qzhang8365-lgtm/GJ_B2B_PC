# Table audit

- 本地契约已维护共享 `gj-table*` 基座、Small/Medium/Large 三档和固定操作列；可视化验收页为 `preview/table/index.html`。
- 默认 Medium；尺寸是整表原子属性，表头、普通行和固定列不得混用密度。
- 外框必须使用 `Table/border`，结构线使用 `Table/divider`；两者当前均解析到 N04。
- 排序使用 `icf_Arrow_caret.svg`，筛选使用 `icf_system_filter.svg`，不得挑选近似图标。
- 2026-09-09 已补齐生成所需的本地结构契约：列定义、宽度策略、单列排序、选择/展开/禁用状态分离、Loading/Empty/Error、固定列溢出和可访问性。`TBL-001` 的本地 P1 缺口关闭。
- 2026-09-10 按“inventory 只收录母组件结构”完成节点 `2943:3259` 的只读复查：3 个组件集母版为 `Table/title`（`2946:4360`，15 variants）、`Table/content`（`2946:6674`，36 variants）、`Table/Collapse`（`2956:8364`，6 variants），共 57 variants；另有 6 个不属于组件集的独立母组件：`Table/subcontent`（`2954:8073`）、`1.Table-small`（`2956:8473`）、`2.Table-Medium`（`2956:9420`）、`3.Table-Large`（`2956:9595`）、`4.subTable`（`2956:9596`）、`sub_table_item`（`4316:14921`）。规范说明画板和其中的 `<instance>` 均未计入。
- 组件集直接子变体计数已由旧值 45 更正为 57，独立母组件由旧值 5 更正为 6；`TBL-002` 的属性矩阵和变量使用已完成只读审计并关闭。几何值仍允许保留 Figma 字面值，不将“未绑定 Dimension Token”误报为问题。

## 2026-09-10 母组件只读审计摘要

| 母组件 | 属性 / 组合 | 已读取变量与 Text Style |
|---|---|---|
| `Table/title` | `size=Small/Medium/Large`、`sort icon`、`Checkbox`、`checked`、`filter`，并暴露 `questionicon` | `Table/head_bg`、`Table/border`、`Text/Secondary`、`中文/S5-CN-S`；Checkbox 依赖使用自身 `Background/Container`、`Border/secondary` |
| `Table/content` | 三档尺寸；普通文本、加粗、数据、趋势图、Tag、文字操作、图标操作、Input、Checkbox、序号组合 | `Table/table_bg1`、`Text/Primary`、`Text/Secondary`、`Text/Tertiary`、`中文/S8-CN-R`、`中文/S5-CN-S`、`中文/S6-CN-S`；嵌套控件保留自己的 Primitive/Radius/Interval 依赖 |
| `Table/Collapse` | `size=Small/Medium/Large`、`manage=Expand/Collapse` | `Table/table_bg1`；结构线当前引用 `Border/default` |
| 独立母组件 | Small/Medium/Large 整表、子表、子表行和子单元格组合 | 使用上述 Table 变量；子表背景使用 `Table/table_bg2` |

### 新发现的待修复项

- `TBL-003` 已关闭（2026-09-10）：只读复查 `Table/content`（`2946:6674`）、`Table/Collapse`（`2956:8364`）与 `Table/subcontent`（`2954:8073`），结构线均已改绑 `Table/divider`，不再出现 `Border/default`。
- `TBL-004` 已关闭（2026-09-10）：只读复查 `4.subTable`（`2956:9596`）与 `sub_table_item`（`4316:14921`），文字均已使用 `Text/Secondary`，不再出现旧变量 `文本色/副文`。
- 当前 Table 母组件审计无开放项；本地共享基座与 Figma 的 Table/Text 语义绑定一致。

## 2026-09-11：清理预览页残留旧 CSS（新增并关闭 TBL-005）

背景：延续 MDL-010（见 `components/modal/audit.md`）建立的方法，对 `preview/table/index.html` 做同样的死代码核查——用户明确的标准原则是预览页无论静态展示区还是交互区，都应该只用标准组件基座渲染，不应该残留旧 CSS。

排查方法：同 MDL-010，解析页面全部 `<style>` 块，提取每个选择器涉及的类名，逐个类名对照页面真实 `class="..."` 属性（含 JS 动态拼接的模板字符串）确认是否被引用；复合选择器按逗号拆分成分支逐项判断，只删除全部分支都确认无引用的规则，混有真实类的复合选择器保留但裁掉死亡分支。

整条规则删除（67 条）：`.actions`、`.cell-input`、`.content-matrix`、`.content-matrix-wrap`、`.content-matrix.medium-only`、`.content-matrix.medium-only .content-type-item`、`.content-type-label`、`.content-type-preview`、`.department-col .head-content`、`.department-col .head-icon`、`.expand`、`.head-content`、`.head-icon`、`.icon-action`、`.icon-action img`、`.matrix-cell`、`.matrix-cell.last-row`、`.matrix-cell:nth-child(4n)`、`.matrix-head`、`.matrix-l`、`.matrix-label`、`.matrix-m`、`.matrix-s`、`.matrix-serial`、`.sort-icon`、`.sort-icon.desc`、`.subrow td`、`.subrow>td`、`.subtable`、`.subtable th,.subtable td`、`.table-demo`、`.table-demo .action-col`、`.table-demo .department-col`、`.table-demo .head-content`、`.table-demo .head-icon,.table-demo .sort-icon`、`.table-demo .head-icon:hover,.table-demo .sort-icon:hover`、`.table-demo [data-extra-column]`、`.table-demo tbody tr`、`.table-demo tbody tr:hover td`、`.table-demo tbody tr:last-child td`、`.table-demo th,.table-demo td`、`.table-demo th,.table-demo td,.subtable th,.subtable td`、`.table-demo thead .action-col`、`.table-demo thead th`、`.table-demo thead th:not(:last-child)::after`、`.table-demo-wrap`、`.table-demo.size-large .cell-input`、`.table-demo.size-large th,.table-demo.size-large td`、`.table-demo.size-medium th,.table-demo.size-medium td`、`.table-demo.size-small th,.table-demo.size-small td`、`.table-icon-mask`、`.table-loading-state`、`.table-loading-state b`、`.table-loading-state p`、`.trend`、`.trend i`。

复合选择器裁剪（5 处，保留真实分支/去掉死亡分支）：
- `.text-button:hover,.icon-action:hover` → `.text-button:hover`
- `.table-demo .head-icon,.table-demo .sort-icon,.table-demo .icon-action,.cell-pattern-table .matrix-actions img` → `.cell-pattern-table .matrix-actions img`
- `.table-demo .icon-action:hover,.cell-pattern-table .matrix-actions img:hover` → `.cell-pattern-table .matrix-actions img:hover`
- `.table-demo .text-button,.table-demo .expand,.cell-pattern-table .matrix-text-actions button` → `.table-demo .text-button,.cell-pattern-table .matrix-text-actions button`
- `.table-demo .text-button:hover,.table-demo .expand:hover,.cell-pattern-table .matrix-text-actions button:hover` → `.table-demo .text-button:hover,.cell-pattern-table .matrix-text-actions button:hover`

验证：脚本二次扫描确认页面残留死选择器为 0；`<style>` 块大括号计数与逐字符深度校验均通过；Playwright 起本地 http.server 渲染整页并截图，静态展示区与交互 Demo 区视觉、交互均与改动前一致，无回归。

结论：TBL-005 已关闭。`preview/table/index.html` 内嵌 CSS 现在只包含仍被页面实际使用的选择器。

## 2026-09-14：操作列表头与内容改为居中对齐（新增并关闭 TBL-006）

用户直接给出约束规则：操作列（`gj-table-action`）的表头文字和单元格内容应该居中对齐，并附了一张业务页面截图作为参照（操作列的齿轮/编辑/删除三个图标居中排布，不贴右边缘）。

排查：共享组件 CSS 里 `.gj-table .gj-table-action` 原来是 `text-align:right`，图标操作组 `.gj-table-icon-actions` 是 `display:flex;justify-content:flex-end`，两者都让操作列的表头文字和内容整体贴着列的右侧对齐。

修复：
- `.gj-table .gj-table-action`：`text-align:right` → `text-align:center`。
- `.gj-table-icon-actions`：`justify-content:flex-end` → `justify-content:center`。
- 规则写入 `table/rules.md`：新增一条「操作列（`gj-table-action`）表头文字与单元格内容统一居中对齐，不使用左对齐或右对齐；文字操作组、图标操作组（`gj-table-icon-actions`）在列内也按居中布局，不贴右边缘。」
- `table/schema.json` 的 `columns` 下新增 `actionColumnAlignment: "center"`，把这条约束落到组件契约里，避免以后只改了 CSS、没同步契约文档。

这两个类只在 `preview/table/index.html` 里使用（全项目 grep 确认），页面本身没有改动结构，样式变化后自动生效在两处：主交互表格的图标操作组（齿轮/编辑/删除）和可展开子表格的单文字按钮操作列（"查看"）。「单元格内容类型」参考表里的 `.matrix-actions`/`.matrix-text-actions` 是页面私有的内容类型示意类（用来展示"图标操作""文字操作"这两种内容长什么样的通用单元格演示，不在真正的 `gj-table-action` 列里），未受影响，也不需要跟着居中。

验证：Playwright 截图核实主交互表格表头「操作」文字与三个图标（`text-align: center`、`justify-content: center` 均已生效）居中显示；可展开子表格的表头「操作」与「查看」按钮居中显示；点击展开按钮验证子表格展开/收起交互无回归；页面其余部分（尺寸切换、排序、筛选、行选择、单元格内容类型参考表）截图核对无视觉变化。

结论：TBL-006 已关闭。操作列的表头与内容现在统一居中对齐，规则已同步进 rules.md 与 schema.json。

## 2026-09-14（追加）：同步业务模式页的操作列对齐（TBL-006 补充）

用户指出："但是你没有同步修改模式页"——TBL-006 只改了 `assets/styles/gj-b2b-components.css` 的共享类和 `preview/table/index.html` 组件规范页，没有检查 `preview/patterns/` 下实际引用 Table 的业务模式页是否也需要同步。

排查了 4 个用到 `<table class="gj-table">` 的模式页：

- **search-list.html**：操作列本来就用 `<th class="gj-table-action">`/`<td class="gj-table-action">`，页面通过 `page-patterns.css` 顶部 `@import url("../../assets/styles/gj-b2b-components.css")` 引入共享样式，所以 TBL-006 的 CSS 改动已经自动生效，不需要改动。
- **object-detail.html**：操作列用页面私有类 `customer-action-cell{text-align:center!important}`，本来就是居中，不是这次要修的回归，未受影响。
- **dashboard.html** 和 **step-task.html**：操作列表头 `<th>操作</th>` 和单元格 `<td>` 都是不带任何类的裸标签，从来没有接入 `gj-table-action`，所以一直是表格默认的左对齐——这两个页面的问题不是"右对齐没改成居中"，而是从一开始就没有使用操作列的共享样式，是遗漏，不是 TBL-006 改动引入的新问题，但同样需要在这次一起修掉，否则整个设计系统里操作列的对齐方式会不一致。

修复：给 `dashboard.html`「异常提醒」表格和 `step-task.html`「材料」表格的操作列表头 `<th>` 和每一行对应的 `<td>` 都补上 `class="gj-table-action"`，让它们和 search-list.html 一样直接复用共享类，而不是各自维护一份对齐规则——这样以后共享样式再变化，四个模式页会一起自动更新，不会再出现今天这种遗漏。

验证：Playwright 核实四个模式页（dashboard / step-task / search-list / object-detail）操作列表头的 `getComputedStyle().textAlign` 均为 `center`；截图确认 dashboard 的「查看」文字按钮、step-task 的「删除」「编辑」两个文字按钮都居中显示；search-list 的三个文字按钮（查看/编辑/更多）和 object-detail 的「查看」按钮保持原有的居中效果不变；四个页面结构完整性（table/tr/td/th/button/div 标签计数）与其余功能（下拉筛选、批量选择、分页、展开等，仅做视觉核对未逐一交互回归，因改动只涉及两个 class 属性的新增）均未受影响。

结论：TBL-006 的操作列居中规则现已同步到全部 4 个实际使用 Table 的业务模式页，不再存在共享组件页面已改、模式页遗漏的不一致。
