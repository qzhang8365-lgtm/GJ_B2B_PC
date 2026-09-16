# Figma 变量资产审计

## 审计范围

- Figma 文件：`8b01I1e3TzH1IhYlr3tJzd`
- 本地变量集合：`GJ_B2B`
- 当前模式：`PC`
- 语义说明节点：`2614:5953`
- 提取方式：只读；未修改 Figma
- 隐藏变量：纳入提取，不按发布状态过滤

## 数量核对

| 类型 | 数量 | 状态 |
|---|---:|---|
| 全部变量 | 265 | 已提取 |
| COLOR | 242 | 已提取 |
| FLOAT | 23 | 已提取 |
| Primitive 颜色 | 112 | 已写入纯值色盘 |
| Semantic 颜色 | 130 | 已写入语义映射与使用边界 |

数量关系：`112 + 130 + 23 = 265`。本地 `colors-semantic.json` 另含 `Button/Secondary/Disable`（BTN-002，像素同 `Primitive/Blue/B04`，不计入上表 Figma 130）。

## 工程化派生产物

- `gj-b2b.tokens.json` 已统一收录基础颜色、尺寸、字体、效果、渐变、栅格和断点。
- 高频交互控件 Token 已收录 Button、Text Button、Input、Table、Selector、Dropdown、Checkbox、Radio 与 Switch（含 stateMatrix）：117 个组件尺寸/行为 Token、259 个状态与意图 CSS Token。2026-09-08 另补齐 8 个结构性组件（无 stateMatrix）：Divider、Tooltip、Navbar、Breadcrumb、Pagination、Cascader、Form、Tabs，新增 93 个组件 Token（含 Tabs 未确认项，见其 tokens.json 的 pendingExtraction），随后接入 Tag/DatePicker，并于同日完成 Metric 真 Figma 审计并接入构建。同日 Chart 按 rules + 已验收预览（路 A）接入 `chart.tokens.json`，图例横向间距设计确认为 16px；系列色仍用全局 `Chart/CH01–CH10`，未从页面硬编码反推 Hex。同日 Search 完成真 Figma 审计并接入 `search.tokens.json`（Search-Box 三档四态、组合 8px、结果列表 shadow-down）。同日 Steps 完成真 Figma 审计并接入 `steps.tokens.json`（标题 S4、说明 S9、间距 4px；finished 指示器与 process 同为实心蓝）。2026-09-09 Toast 完成真 Figma 审计并接入 `toast.tokens.json`（Float/Transparent 365×48 + shadow-center / 语义浅底；Black hug 46、底部居中 24px；Loading 图标 Brand/GJ_Blue）。同日 Modal 完成真 Figma 审计并接入 `modal.tokens.json`（Standard 400/600/800、Header 64、关闭 20px、shadow-center；Footer 高 72 与生成 pt 20 冲突见 MDL-004）。同日 Notification 完成真 Figma 审计并接入 `notification.tokens.json`（384、padding 20、主行 gap 16、关闭 16px、`shadow-down`；Info 图标绑 Text/blue；确认按钮复用 Button Medium）。同日 Popover 完成真 Figma 审计并接入 `popover.tokens.json`（popover_basic button=1|2、360、圆角 16、`shadow-center`、Button Large）。同日 Sidebar 完成 `sidebar_item` 原子真审计并接入 `sidebar.tokens.json`（行宽 176 / 收起 40、一级默认圆角 4、强调与二三级 8、选中底 Background/Hover；容器栏宽未纳入）。同日 TimePicker 完成真 Figma 审计并接入 `time-picker.tokens.json`（触发器 260×24/32/40，Small 水平 padding 8、Large 图标 20；Time-Item 64×28 选中仅蓝字；面板 140 宽 + shadow-center；秒列非已发布变体）。同日 GridNav 完成真 Figma 审计并接入 `grid-nav.tokens.json`（项 68×70、图标 36 圆角 8、列距 12 / 行距 8、标题 `中文/S9-CN-R` + `Text/Secondary`；徽标图层缺失不写入 Token）。同日 Breadcrumb 完成 BCR-001 变量绑定复查并更新 `breadcrumb.tokens.json`（历史 Tertiary、当前 Primary、分隔符 MK_30、图标 16、图文距 4；inventory 更正 3 套/9 variants）。2026-09-10 InputNumber/Image/Badge/Timeline 按母版 paint 绑定写入组件 Token 并接入 `build-tokens.mjs`（InputNumber 2/52 含 swiper；Image 更正 2/7/1；Badge 3/34；Timeline 6/32/1）。禁止从页面硬编码反推。TOK-004 关闭。
- `assets/styles/gj-b2b-tokens.css` 为统一 CSS Variables 派生产物；构建与校验脚本位于 `skill/gj-b2b-design-system/scripts/`。
- 组件级 Token 不计入 Figma 变量总数 265；它们是对现有变量、Text Style、组件属性和已确认规则的工程映射。

## 数据权威规则

1. 当前 `GJ_B2B / PC` 本地变量负责名称、类型、数值和别名关系。
2. 节点 `2614:5953` 负责已有语义说明；本地 Skill 补充经设计侧确认或由既有组件规则归纳的选择边界，但不反向修改 Figma。
3. 页面中的旧变量名只用于匹配，不覆盖当前变量名。
4. 页面展示 Hex 与当前变量冲突时，以当前本地变量为准，并保留冲突记录。
5. Primitive 色盘只保存初始值，不承载 Hover、Pressed、背景或组件等语义。
6. `hiddenFromPublishing` 不影响提取；`Background/MK_20` 与 `Background/MK_30` 已纳入。

## 已确认的旧名称映射

| 页面名称 | 当前变量名称 |
|---|---|
| `文本色/Tiatery` | `Text/Tertiary` |
| `按钮色/Red/Bg-defalut` | `Button/Red/Bg-default` |
| `品牌色/*` | `Brand/*` |
| `文本色/*` | `Text/*` |
| `按钮色/*` | `Button/*` |
| `表格色/*` | `Table/*` |
| `功能色/*` | `Feedback/*` |
| `图表色/*` | `Chart/*` |
| `边框色/*` | `Border/*` |
| `背景色/*` | `Background/*` |

## 语义页与当前变量值的差异

以下差异 2026-09-10 已全部核实并处理；本地资产统一采用当前变量库的值（TOK-002 已关闭）：

| 变量 | 语义页展示 | 当前变量（2026-09-10 复核） | 处理 |
|---|---|---|---|
| `Table/head_bg` | `#EBEEF2` | `{Primitive/Neutral/N03}` → `#F5F7FA` | 使用当前变量，colors-semantic.json 本就一致，无需改动 |
| `Chart/CH04` | `#FB923C` | `{Primitive/Orange/O05}` → `#FB923C` | 只读复核 `get_variable_defs`（节点 2614:5953）确认当前变量已是 `#FB923C`，与语义页一致；colors-semantic.json 此前误记为 `{Primitive/Pink/PK05}`，已更正 |
| `Chart/CH10` | `#EC4899` | `{Primitive/Pink/PK06}` → `#EC4899` | 只读复核确认当前变量已是 `#EC4899`，与语义页一致；colors-semantic.json 此前误记为 `{Primitive/Pink/PK04}`，已更正 |
| `Background/Hover` | `#D7DCE3` | `{Background/BT_B5}` → `#2B73FF0D` | 使用当前变量，colors-semantic.json 本就一致，无需改动 |

## 结构性检查

- 2026-09-08 根据当前 PC 变量库复核：`Table/border` 与 `Table/divider` 均由原本地记录的 `Primitive/Neutral/N05`（`#D7DCE3`）更正为 `Primitive/Neutral/N04`（`#EBEEF2`）；表格外框与结构分隔线须使用各自 Table 语义变量，不以通用 Border 变量替代。
- 当前只有一个模式 `PC`，未建立深色模式资产。
- 所有已读取别名都可解析，未发现循环别名或缺失别名。
- `Brand/GJ_purple`、`Brand/GJ_violet` 当前是直接颜色值，没有引用 Primitive。
- `Background/BT_*` 与 `Background/MK_*` 当前为直接透明色值。
- `Background/Hover` 引用另一个 Semantic 变量 `Background/BT_B5`。
- `Background/MK_20`、`Background/MK_30` 当前标记为隐藏发布，但已完整收录。
- 当前 130 个语义颜色均已在 `colors-semantic.json` 中记录使用边界。
- Figma 原有说明与本地补充规则来源不同：变量值和别名仍以 Figma 为准；本地补充只帮助 AI 选用，不伪装成 Figma Description。
- Chart 色按系列顺位使用，不绑定固定业务含义；`BG_*` 与 `BT_*` 色盘工具也不得仅凭色相推导业务状态。

## 原始说明的隔离策略

Figma 中部分 Primitive 蓝色色阶带有 Hover、Pressed、背景等 description。为保证全局色盘无语义：

- `colors-primitive.json` 不保存这些说明；
- 原始文本仅保存在 `figma-descriptions.json` 供追溯；
- 组件生成与选色不能把 Primitive description 当作语义规则；
- 正式使用场景只从 `colors-semantic.json` 读取。

## 待确认项

无。TOK-001~TOK-004 均已关闭。

## 已关闭项

- `Background/BT_R*` 已在 Figma 变量库中改为以 `#F93838` 为基色。本地值已重新读取并同步：5%、8%、10%、15%、20%。
- `Brand/GJ_purple`、`Brand/GJ_violet` 设计确认不迁移到 Primitive 色阶，继续保留为独立直接颜色值（TOK-001 已关闭）。
- `Table/head_bg`、`Chart/CH04`、`Chart/CH10`、`Background/Hover` 四处语义页/变量差异已逐项核实处理，其中 CH04/CH10 是本地 `colors-semantic.json` 误记，已更正（TOK-002 已关闭）。
- `Button/Green/Bg-disable` 的 `usage` 说明「绿色按钮-不可以」为错别字，已于 2026-09-10 规范为「绿色按钮-不可用」（TOK-003 已关闭）。展示页若仍显示旧值，不影响当前变量真值。

## 2026-09-07 规范站 Token 绑定复查

- 全部组件规范页已统一引用 `assets/styles/gj-b2b-tokens.css`；旧 `semantic-colors.css` 已删除，不再保留兼容入口。
- Button、Text Button、Input、Table、Selector、Dropdown、Checkbox、Radio 与 Switch 的高频尺寸和适用状态已绑定组件级 Token；Radio 状态直接引用已验收 SVG，不从外观反推颜色。
- 公共 Checkbox、Radio、Switch、Table、Button、Text Button、Calendar 与 Chart 基础样式已改用统一语义／组件 Token；页面 CSS 不再作为这些全局组件的颜色真值。
- Calendar 的 Roboto 绑定已移除；规范站内未发现其它 Roboto 残留。
- UI 字体只调用用户本机字体，并强制使用苹方 + SF Pro、微软雅黑 + Arial、思源黑体 + Source Sans Pro 三组配对之一；规范站运行时按 macOS / Windows / 其它系统分别选择对应配对。
- GJType 仅保留在 Metric、Gauge、Progress、Progress Ring 核心指标；表格、普通图表标签、日期时间、分页、Badge 和正文数字已切回 UI 字体。
- 新增 16 个 `--docs-*` 规范站专用 Token，覆盖导航宽度、顶栏高度、页面最大宽度与内边距、区块/面板圆角及内边距、3:2 展示布局、列间距和交互区最小尺寸。这些变量与业务产品 Token 隔离。
- 图表页的 `--ds-chart-ch${index}` 属于对已存在 CH01–CH10 的运行时索引；`--gj-step-count` 与 `--gj-chart-color` 是组件实例输入，不是缺失的全局 Token。
- 仍允许的非全局 Token 值仅限：SVG/图表几何数据、规范站示例画布尺寸、响应式媒体查询字面量，以及未纳入高频组件 Token 集的已验收组件尺寸。这些值不是新的设计真值；后续必须随对应组件 contract 逐个提取，禁止从现有页面反推并批量生成。

## 2026-09-10：TOK-003 关闭（Bg-disable usage 文案规范化）

设计确认 `Button/Green/Bg-disable` 的说明文案应为「绿色按钮-不可用」（原「绿色按钮-不可以」为错别字）。

同步范围：
- `references/tokens/colors-semantic.json`：`Button/Green/Bg-disable.usage` 由 `绿色按钮-不可以` 改为 `绿色按钮-不可用`（源文件）。
- 运行 `node scripts/build-tokens.mjs` 重新编译，`references/tokens/gj-b2b.tokens.json` 中对应 `usage` 字段已同步更新。
- 未影响任何颜色值、CSS 变量或组件视觉，仅文案修正。
- 建议后续 Figma 侧同步把该颜色变量的 description 由「不可以」改为「不可用」，保持两端一致（本地已先行修正，不阻塞）。

## 2026-09-10：TOK-001 关闭（GJ_purple/GJ_violet 不迁移）

设计确认 `Brand/GJ_purple`、`Brand/GJ_violet` 不需要归入新的 Primitive 色阶，继续保持现状（直接颜色值，不引用 Primitive）。

不涉及 Figma 别名或本地 Token 结构改动，纯粹是决策确认，不阻塞生成。

## 2026-09-10：TOK-002 关闭（4 处差异逐项核实）

用户决定：都以当前变量库最新值为准，同步更新 CSS、预览页和 JSON。

只读复核 `get_variable_defs`（节点 `2614:5953`，语义色说明页）逐项核实：

- `Table/head_bg`、`Background/Hover`：当前变量与本地 `colors-semantic.json` 记录本就一致（`#F5F7FA`、`#2B73FF0D`），无需改动。
- `Chart/CH04`：当前变量实测为 `#FB923C`（`Primitive/Orange/O05`），与语义页展示值一致；本地 `colors-semantic.json` 此前误记为 `{Primitive/Pink/PK05}`（`#F472B6`），已更正。
- `Chart/CH10`：当前变量实测为 `#EC4899`（`Primitive/Pink/PK06`），与语义页展示值一致；本地 `colors-semantic.json` 此前误记为 `{Primitive/Pink/PK04}`（`#F9A8D4`），已更正。

同步范围：
- `references/tokens/colors-semantic.json`：`Chart/CH04`、`Chart/CH10` 的 `value`/`resolved` 已更正。
- 重新运行 `node scripts/build-tokens.mjs`：`references/tokens/gj-b2b.tokens.json` 与 `assets/styles/gj-b2b-tokens.css` 的 `--ds-chart-ch04`/`--ds-chart-ch10` 已同步更新为 `--ds-primitive-orange-o05`/`--ds-primitive-pink-pk06`。
- `preview/chart/index.html` 全部通过 `var(--ds-chart-ch04)` 等 CSS 变量引用颜色，未硬编码 Hex，构建后自动生效，无需单独改动。
- `references/tokens/components/chart.tokens.json` 本就只引用全局 `Chart/CH01–CH10`，未复制具体色值，无需改动。

## 2026-09-11：清理预览页残留旧 CSS（新增并关闭 TOK-005）

背景：延续 MDL-010（见 `components/modal/audit.md`）建立的方法，对 `preview/color/index.html` 做同样的死代码核查——用户明确的标准原则是预览页无论静态展示区还是交互区，都应该只用标准组件基座渲染，不应该残留旧 CSS。

排查方法：同 MDL-010，解析页面全部 `<style>` 块，提取每个选择器涉及的类名，逐个类名对照页面真实 `class="..."` 属性（含 JS 动态拼接的模板字符串）确认是否被引用；复合选择器按逗号拆分成分支逐项判断，只删除全部分支都确认无引用的规则，混有真实类的复合选择器保留但裁掉死亡分支。

整条规则删除（3 条）：`.quick-swatch`、`.quick-swatch,.table-swatch`、`.table-swatch`。

验证：脚本二次扫描确认页面残留死选择器为 0；`<style>` 块大括号计数与逐字符深度校验均通过（与 button.html 同批次校验时一并发现并排除结构性错误）；本文件删除/裁剪的选择器均逐一比对过页面真实 `class="..."` 与 `classList` 调用，确认为未引用的旧代码，属于低风险清理，未单独截图复核。

结论：TOK-005 已关闭。`preview/color/index.html` 内嵌 CSS 现在只包含仍被页面实际使用的选择器。

## 2026-09-11：清理预览页残留旧 CSS（新增并关闭 TOK-006）

背景：延续 MDL-010（见 `components/modal/audit.md`）建立的方法，对 `preview/radius/index.html` 做同样的死代码核查——用户明确的标准原则是预览页无论静态展示区还是交互区，都应该只用标准组件基座渲染，不应该残留旧 CSS。

排查方法：同 MDL-010，解析页面全部 `<style>` 块，提取每个选择器涉及的类名，逐个类名对照页面真实 `class="..."` 属性（含 JS 动态拼接的模板字符串）确认是否被引用；复合选择器按逗号拆分成分支逐项判断，只删除全部分支都确认无引用的规则，混有真实类的复合选择器保留但裁掉死亡分支。

整条规则删除（3 条）：`.size-l`、`.size-m`、`.size-s`。

验证：脚本二次扫描确认页面残留死选择器为 0；`<style>` 块大括号计数与逐字符深度校验均通过（与 button.html 同批次校验时一并发现并排除结构性错误）；本文件删除/裁剪的选择器均逐一比对过页面真实 `class="..."` 与 `classList` 调用，确认为未引用的旧代码，属于低风险清理，未单独截图复核。

结论：TOK-006 已关闭。`preview/radius/index.html` 内嵌 CSS 现在只包含仍被页面实际使用的选择器。

## 2026-09-16：修复 Color 色块背景丢失（新增并关闭 TOK-007）

现象：Color 规范页的 Token 名称与 Hex 文本仍正常显示，但全局色盘的色块背景消失；快捷色与语义色样本也存在尺寸坍缩风险。Token JSON、编译产物和页面数据均未丢失，问题仅发生在预览层。

根因：

- TOK-005 的静态死代码扫描只识别了 HTML 与部分 `classList` 中的显式类名，没有识别 `swatch(value, cls)` 运行时传入的 `quick-swatch`、`table-swatch`，因此误删了这两个动态类的尺寸与定位规则。
- Primitive 色盘将颜色写入原生 `<button>` 的内联 `background` 简写；Safari 的按钮原生外观／绘制路径下出现了文字色生效、背景色未绘制的兼容问题。

修复：

- 恢复 `.quick-swatch`、`.table-swatch` 的明确宽高、定位、边框与圆角；这些类属于运行时生成的有效组件结构，不再视为死代码。
- `.color-cell` 显式重置 `appearance`，通过 `--cell-bg`、`--cell-text` 实例变量分别绑定 `background-color` 与 `color`，避免依赖按钮原生外观及 `background` 简写。
- 规范站 Color 入口缓存版本更新为 `v=26`；同时修正 Color 父级导航行为：点击父项保持子目录展开，点击箭头才切换折叠，直接加载 `#color` 也会自动展开子目录。
- 未修改 Primitive、Semantic、Gradient 的任何 Token 真值或 JSON 数据。

验证：Color 页与规范站入口内联脚本语法通过；`validate-tokens.mjs`、`build-coverage.mjs --check` 与相关文件 `git diff --check` 均通过。

结论：TOK-007 已关闭。以后清理预览页 CSS 时，必须把模板字符串、函数参数和运行时生成类纳入引用扫描，不能仅凭静态 `class` 字面量判断为未使用。
