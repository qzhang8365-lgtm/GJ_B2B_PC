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

## 2026-09-14：补上 `.gj-table-wrap` 的 `has-overflow` 自动切换（新增并关闭 TBL-007）

背景：给 5 个模式页接入统一壳（`.gj-sidebar` 固定占宽约 200px）后，`search-list.html` 在 1280px 视口下第一次出现 `.gj-table.query-table`（`min-width:1100px`）超出 `.gj-table-wrap` 可用宽度（约 998px）的情况，sticky 定位的 `.gj-table-action` 操作列直接压在"最近修改"列上，没有任何视觉提示（1440px 视口不受影响，未溢出）。

排查：共享 CSS 里 `.gj-table-wrap.has-overflow .gj-table-action{box-shadow:-10px 0 14px var(--ds-background-mk-10)}` 这条"操作列悬浮阴影提示可横向滚动"的规则一直存在，说明组件设计本身已经预见了这种情况、也有视觉方案——缺的是没有任何 JS 真正去 toggle `has-overflow` 这个类。`grep -rl "has-overflow" --include="*.js" .` 和 `grep -rn "has-overflow" references/components/table/` 都是零匹配，确认全项目没有别的地方补过这段逻辑，不是这次改动引入的新缺陷，而是此前一直存在、从未被触发过的组件缺口。

但 `preview/table/index.html`（本组件已审计的规范页）自己的"交互属性"demo 其实一直有这段逻辑，只是用页面私有选择器实现：`function syncOverflow(){document.querySelectorAll('.showcase-wrap').forEach(wrap=>wrap.classList.toggle('has-overflow',wrap.scrollWidth>wrap.clientWidth+1))}`，在 `render()` 之后用 `requestAnimationFrame` 调用，并绑定了 `window.addEventListener('resize',syncOverflow)`。这套实现是对的，只是从未跳出这个 demo 被提炼成共享脚本——和 Navbar/Avatar 基座建设（NAV-004）是同一种"真实实现只存在于规范页、未回收进共享资产"的模式。

修复：把这段已验证正确的逻辑提炼成共享脚本 `assets/scripts/gj-table-overflow.js`，选择器从页面私有的 `.showcase-wrap` 泛化成真正的共享类 `.gj-table-wrap`；比规范页的原版更完整一些——除了 `window resize` 兜底，还用 `ResizeObserver` 分别监听每个 `wrap` 和它内部 `table` 的尺寸变化，用 `MutationObserver` 监听新增到页面里的 `.gj-table-wrap`（覆盖异步渲染出表格的场景），自动扫描并 toggle `has-overflow`，业务页面不需要手动调用任何函数，只要引入这一个 `<script>` 标签。接入了 `dashboard/object-detail/search-list/step-task.html` 四个实际用到 `.gj-table-wrap` 的模式页（`form-edit.html` 没有表格，不需要）。

验证：Playwright 核实 `search-list.html` 在 1280px 下 `.gj-table-wrap.clientWidth=998`、`scrollWidth=1100`，`has-overflow` 正确挂上，操作列 `box-shadow` 为 `-10px 0 14px`；1440px 下 `clientWidth===scrollWidth`，不挂类。对表头逐格测了 `getBoundingClientRect`，确认"操作"列确实以 sticky 方式压在"最近修改"列上方——这是设计本身就要的"冻结列覆盖被滚动内容"效果（类似 Excel 冻结列），阴影就是用来提示"这里还有更多内容、可以横向滚动"，不是要消除重叠本身。四个接入脚本的模式页跑 `verify-page.mjs` 与 Playwright 截图，零请求失败、零 pageerror，无新增视觉回归。

结论：TBL-007 已关闭。`.gj-table-wrap` 现在会自动感知自身是否溢出并给出滚动提示，不再需要每个业务页面各自实现或者干脆遗漏。


## 2026-09-16：规范页 Token/规则表格多行文字贴行边（新增并关闭 TBL-008）

**问题来源**：用户截图反馈"走马灯 Carousel"规范页「尺寸与 Token」表格中，"导航箭头"一行的说明文字（三行长文本）上下贴着单元格边框，没有留白；要求修复表格行高适配规则，但不能影响单行文字的行高表现。

**根因**：共享基座样式 `assets/styles/component-docs.css` 中 `.docs-spec-table th,.docs-spec-table td,.ds-table th,.ds-table td{height:var(--docs-table-row-height);padding:0 16px;...}` 只设置了左右内边距，上下内边距为 0。单行文字时行高够用（内容高度小于 `--docs-table-row-height`(48px) 这个最小高度约束，靠 `vertical-align:middle` 在 48px 内居中，视觉上有留白），但当说明文字换行到 2~3 行时，单元格内容自身高度（行数 × 22px 行高）已经超过 48px，没有上下内边距兜底，文字会精确撑满整个单元格，导致首尾行紧贴单元格上下边框。

**修复**：给该共享规则补上垂直内边距 `padding:var(--ds-space-3) 16px`（8px 上下 + 16px 左右）。由于 `--docs-table-row-height` 固定为 48px 且作为最小高度约束生效，单行文字（22px 内容 + 16px 上下内边距 = 38px < 48px）仍然按 48px 渲染、居中留白视觉不变；多行文字会撑高单元格到"内容高度 + 16px"，从而在文字上下各留出约 8~9px 的呼吸空间，不再贴边。

**影响范围说明**：`.docs-spec-table`/`.ds-table` 是横跨全站 28 个非 legacy 规范页共用的基座表格样式（`preview/**/index.html` 中引用 `component-docs.css` 的规范表格），本次是基座级修复，一次性覆盖所有页面的多行说明文字场景。另有 8 个标了 `.docs-legacy` 的旧版页面（Avatar、Badge、Table、Empty、Image、InputNumber、TimePicker、Upload）通过更高优先级的 `.docs-legacy .ds-table td{padding-top:0;padding-bottom:0}` 规则维持原有 0 内边距的紧凑表现，未受影响（这些页面本身设计上就是紧凑旧版风格，本次不在整改范围内）。此外，Chart/Drawer/Popover/Skeleton 四个页面的表格走的是另一套完全独立的旧版样式文件 `assets/styles/data-table.css`（该文件自身标注为 legacy 表格壳，与本次改动的 `component-docs.css` 无关联），也不受本次修复影响。

**验证结果**（Playwright，`preview/carousel/index.html` 及 `button`/`form`/`selector`/`table`(legacy)/`avatar`(legacy) 五个页面抽样回归）：
- Carousel 规范页"导航箭头"一行（3 行文字）单元格由贴边（原上下间距 0）变为上下各约 9px 留白，单元格自适应增高到约 82.5px；
- 所有单行文字行仍保持 48px 固定高度、视觉居中效果不变，无回归；
- `button`/`form`/`selector` 三个页面里此前同样存在但未被专门指出的多行说明文字行，同步获得了正确的上下留白（作为基座修复的自然收益）；
- `table`/`avatar` 两个 legacy 页面表格保持原有 0 内边距、48px 紧凑高度，未受影响；
- 全部测试页面 Playwright 零控制台报错、零 404。

**涉及文件**：`assets/styles/component-docs.css`

## 2026-09-16（续）：应用户要求扩大到全部规范页，含旧版 `.docs-legacy` 与独立 `data-table.css` 体系（TBL-008 补充）

**问题来源**：用户看到 TBL-008 的修复说明里提到"8 个 `.docs-legacy` 页面维持原样不受影响""4 个 `data-table.css` 独立页面不受影响"后，明确要求"整体全局规范页都要改"——不满足于只修复主流的 28 个页面，要求全站所有规范页的表格都统一获得这个修复。

**改动**：

1. `assets/styles/component-docs.css`：原本 `.docs-legacy .ds-table th,.docs-legacy .ds-table td{height:...;padding-top:0;padding-bottom:0}` 会强制把这 8 个旧版页面的表格垂直内边距重新清零，抵消掉刚加的修复。第一次尝试直接整条删除，但验证后发现这样会让这些页面的单元格 `height` 失去约束、意外回退到 `data-table.css` 里 `.ds-table tbody td{height:66px}` 这条优先级更高的规则（从 66px 变化，与站内其余页面统一使用的 48px 基准不一致，属于新引入的行高回归）。修正为只删掉 `padding-top:0;padding-bottom:0` 这两行，保留 `height:var(--docs-table-row-height)`，这样单行文字仍锁定在与全站一致的 48px，只是垂直内边距不再被清零，多行文字能正确获得留白。
2. `assets/styles/data-table.css`：这是 Chart/Drawer/Popover/Skeleton 四个页面独立使用、完全不依赖 `component-docs.css` 的另一套旧版表格样式，其 `.ds-table th,.ds-table td{padding:0 14px}` 同样只有左右内边距。补上 `padding:var(--ds-space-3, 8px) 14px`。这套体系的行高基准本来就是 66px（不是 48px），维持其自身原有单行行高不变，只解决多行文字贴边问题。

**验证结果**（Playwright，共抽样 15 个规范页，覆盖三类表格体系）：
- 当前基座体系（`component-docs.css` 非 legacy）：Carousel、Button、Modal、Tabs、Dropdown；
- 旧版 `.docs-legacy` 体系（同样吃 `component-docs.css`，但走精简布局分支）：Avatar、Table、Image、InputNumber、TimePicker、Upload；
- 独立旧版体系（仅 `data-table.css`，不依赖 `component-docs.css`）：Popover、Chart、Drawer、Skeleton。

全部 15 页的所有表格行逐行测量文字到单元格上下边框的距离，无一行小于 3px（即不再有贴边情况）；`.docs-legacy` 页面单行文字行高确认仍锁定在 48px（与非 legacy 页面一致，未回归）；独立体系页面单行文字行高确认仍是其原有的 66px（未被误改）；15 个页面 Playwright 加载均为零控制台报错、零 404。

**涉及文件**：`assets/styles/component-docs.css`、`assets/styles/data-table.css`

