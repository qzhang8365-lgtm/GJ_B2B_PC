# 组件提取计划

## 提取目标

将 Figma 组件库转换成 AI 和前端可执行的组件契约，而不是只保存组件截图或名称。每个组件至少提取：

1. 组件名称与用途；
2. 组成结构与插槽；
3. variant 属性及允许值；
4. 默认属性组合；
5. 尺寸、间距、圆角、颜色、文字和效果的 Token 引用；
6. 状态及交互规则；
7. 内容约束、禁用方式和设计稿例外；
8. 开发映射建议与待确认项。

## 执行顺序

1. 通用原子组件：Button、Divider、Icon、Tag；
2. 导航组件：GridNav、SideBar、Navbar、Tabs、Breadcrumb、Carousel、Pagination；
3. 数据录入组件：Input、Form、Select、Switch、Checkbox、RadioButton、DatePicker、Searchbar、TimePicker、Dropdown、Cascader、Input Number、Image、Upload；
4. 数据展示组件：Table、Avatar、Badge、Chart、Metric、Empty、Timeline、Steps；
5. 反馈组件：Toast、Modal、Notification、Tooltip、Popover、Mask、Skeleton、Drawer；
6. 业务与历史资产：Video 页面和“组件”历史页面单独审计，不默认并入正式资产。

## 单组件产物

每个组件生成以下本地资产：

- `schema.json`：机器可读的属性、状态、默认值和 Token 引用；
- `rules.md`：使用场景、组合规则、禁用项和例外；
- `mapping.json`：Figma 属性到前端 props/CSS 的映射建议。
- `audit.md`：组件属性、命名、Token/变量绑定、文字样式绑定及其他实现问题；
- `references/audit-tracker.md`：全部开放审计项的总览。单组件 `audit.md` 增加、关闭或拆分待确认项时，必须同步更新跟踪表并保留稳定 ID；详细证据仍留在组件 audit 中。
- `references/coverage.json`：由 `scripts/build-coverage.mjs` 生成的组件覆盖看板，合并叙述规则、结构化契约、组件 Token 和预览页状态；不手工编辑组件行。
- 可交互代码预览：覆盖主要 variant、状态与交互，供设计侧点击验收。

> **rules.md 状态说明（2026-09-08）**：此前 rules 内容被合并写入 `references/design-system-rules.md`，未按组件单独生成文件。现已拆分：每个组件的用途、属性枚举、组合规则、边界规则单独存放于 `references/components/<组件目录>/rules.md`，与 schema.json/mapping.json/audit.md 同级同目录；跨组件的颜色、字体、布局、圆角等全局基础规范仍保留在 `references/design-system-rules.md`（拆分前的完整版本备份为同目录下 `design-system-rules.pre-split-2026-09-08.bak.md`）。`references/layout/radius-rules.json` 是圆角这一跨组件维度的独立机器可读规则表，覆盖卡片层级与组件默认值判定，不属于本计划定义的单组件 rules.md 产物，两者并存、互不替代。Tooltip、Mask 两个组件当时缺少 rules 内容的问题已分别处理（2026-09-08）：Tooltip 已通过官方 Figma 连接器完成实际组件读取（节点 `3582:1816` dark、`3630:3385` light，文档页 `3623:2`），补齐 schema.json/rules.md/mapping.json/audit.md 四件套，状态更新为 `figma-audited`，发现的 5 个问题（TLT-001~005）已登记进 `references/audit-tracker.md`；Mask 则由需求方确认不再走 Figma 提取流程（无预览页需求），采用设计系统已有的蒙层 Token（`Background/MK_60` 默认蒙层）作为通用原生实现，只保留 schema.json 与 rules.md 记录该决定，不生成 mapping.json/audit.md，状态为 `local-contract`。

## 母版、子变体与 inventory 计数

`inventory.json` 的 `sets / variants / standalone` 必须按 Figma 组件结构数，不能按规范画板上「看见几个块」数。

| 口径 | 计什么 | 不计什么 |
|---|---|---|
| `sets` | 组件集母版（COMPONENT_SET） | 母版里的子变体、画板上的实例 |
| `variants` | 该母版下的 variant 子组件 | 第二套母版 |
| `standalone` | 不属于任何组件集的独立组件 | 组件集里的 variant |

inventory **只收录母组件结构**：`sets` 记录组件集母版，`standalone` 记录不属于组件集的独立母组件；只有母组件集的直接子组件才进入 `variants`。规范说明画板、业务组合示例、母组件实例及实例内部节点均不得进入 inventory。

识别规则：

1. 子图层名是 `属性=值`（如 `button=1`、`Status=Info`）→ 父节点是**一套母版**，子节点是这套的变体。
2. MCP `get_metadata` 常把组件集写成 `<frame>`、把变体写成 `<symbol>`。这是工具类型，**不能**据此说「没有 COMPONENT_SET 根」。用户指定的该父节点就是集合锚点。
3. 因此：**1 个父 + 2 个 `button=*` 子 = 1 套 / 2 variants**。禁止把 2 个子变体记成 2 套，也禁止另开「根 ID 未返回」。
4. 规范展示画板里摆的若是实例（不是 variant 轴命名的子组件），那是文档，不是第二套母版。
5. 只有页上母版个数或某套的子变体个数与 inventory 不符，才开 inventory 不一致项。子变体已挂在母版下却去对 `sets`，属于数错层级。
6. **2026-09-09 用户明确的成因（比第 4 点更具体，务必先排查）**：部分 Figma 页面除了母版组件集之外，会额外加一个「规则说明」画板（常见于页面左侧），用图文/标注讲解该组件的使用规范，并在画板里插入了子组件的**实例**做示意。这块画板不是母版的一部分，里面的子组件实例也不是新 variant，纯粹是给设计师看的文档配图。识别方法：看该 symbol 的父节点是不是母版组件集自身的直接子节点（`属性=值` 命名）——是才计入 variant；如果父节点是一个独立的、带说明文字或标注箭头的画板/frame，且这个 frame 不属于母版 COMPONENT_SET 的子树，里面的实例一律不计入这套的 variant 数，也不算 standalone。**遇到「画板可见 symbol 数」明显多于 inventory 登记数时，先检查是不是踩到这个模式，不要默认成 inventory 少登记或 Figma 有隐藏 variant**——这是用户在与多个并行 agent 协作后总结出的、目前已知会反复出现的根因，不是一次性个案。

已发生的反例：Popover `3630:3133`（`popover_basic`）下 `button=1` / `button=2` 是一套两态；曾误开 POP-001（拿看见的两个 symbol 去对 2 套 / 4 variants）和 POP-002（MCP 标成 frame 就说没有母版）。2026-09-09 已按用户确认关闭。同类问题不要再对 Toast / Modal / Notification / Search 用「可见 symbol 数 vs sets」开新项。

尚未逐一回 Figma 复核、但应优先用第 6 点排查的现存待确认项：INP-008、MET-005、SEA-001、STP-001、TST-001、MDL-001（见 `references/audit-tracker.md`）。这些当时都是以「画板/页面 symbol 数」与 inventory 数字对不上开的项，方向不完全一致（有的是画板数少于 inventory，不一定是本条成因），下次核对时先用本条的识别方法定位是否存在说明画板，而不是继续假设 Figma 缺失或 inventory 记错。

## 单组件固定流程

1. 读取指定组件集（母版）、所有 variant（子组件）、组件说明及必要的展示画板；先数母版再数变体，不要把两者混成 inventory `sets`；
2. 提取属性、允许值、默认值、层级结构、尺寸和状态；
3. 追踪颜色、数值、圆角、间距、文字和效果引用；
4. 审计并列出问题，不修改 Figma；
5. 生成代码组件和可交互预览页；
6. 对照 Figma 检查视觉与行为；
7. 由设计侧操作预览页并确认或提出修订。
8. 运行 `node scripts/build-coverage.mjs`，更新该组件的覆盖行并执行校验。

## Figma 审计范围

每个问题必须记录具体组件/variant、节点或属性、当前值、问题类型和修改建议。至少检查：

- 组件名、属性名、属性值及图层名的中英文拼写和命名一致性；
- 同一语义是否出现重复、大小写不一致或近似属性；
- 应使用变量的颜色、尺寸、间距、圆角等是否存在硬编码；
- 已绑定变量是否引用了错误层级或错误语义；
- 文本是否绑定正确的 Figma Text Style；
- 字号、字重、行高、字体是否与文字规范一致；
- effect/color style 是否缺失、误用或被局部覆盖；
- variant 属性组合是否重复、缺失或存在不可达状态；
- 实例中的设计稿例外是否有明确依据。

### 视觉属性判定规则

禁止仅根据颜色变量绑定推断某个视觉属性“存在”。必须组合读取并判断：

- 描边：`strokes`、`strokeWeight`/四边宽度、`strokeAlign`、paint `visible`、节点可见性与 opacity；
- 填充：`fills`、paint `visible`、opacity、混合模式；
- 效果：effect style/变量、effect `visible`、类型和各项数值；
- 文字：Text Style、局部覆盖、文字 fill 及可见性。

例如：节点可以绑定描边颜色变量，但描边宽度为 0 或 paint 不可见。此时代码不得生成可见 border。

审计结论按严重程度分为：

- `阻断`：会造成组件代码结构或交互判断错误；
- `应修复`：Token、样式或命名不符合规范；
- `建议优化`：不阻断实现，但影响维护性或一致性；
- `已确认例外`：与默认规范不同，但设计稿明确要求保留。

## 可交互预览要求

预览页不是静态截图，至少提供：

- 组件属性控制区，可切换尺寸、类型、状态等 props；
- 默认、Hover、Active、Focus、Disabled 等适用状态；
- 点击、输入、选择、展开、关闭等组件实际行为；
- 主要 variant 总览和单组件交互试验区；
- 当前 props、Token/CSS 变量和事件结果显示；
- 与 Figma 不一致或仍待确认的内容提示。

### 状态矩阵回归检查

交付预览前，应对每个 `类型 × 状态` 组合检查浏览器计算样式，而不只检查页面是否能加载。至少核对：

- background-color；
- color；
- border width/style/color；
- opacity；
- border-radius；
- 尺寸与 padding；
- disabled、focus、hover、pressed 的事件行为。

共享 CSS 选择器必须逐项确认语义相同。不得因两个类型视觉接近，就把其 Disabled、Hover 或 Pressed 规则合并。

预览代码以提取出的本地 Token 和组件契约为依据；Figma 仍是唯一设计真值。

## 当前优先项

首批从 Button 开始。Button 有 2 个组件集、228 个 variant，适合用来验证整套组件提取模板是否足够表达：尺寸、类型、状态、图标、文字、圆角以及设计稿覆盖默认规范的例外。

## 边界

- Figma 始终为唯一真值，仅做读取。
- 页面名称带 `✅` 不代表无需核验内部属性。
- 历史页面不得与当前组件同名合并，除非后续确认其继承关系。
- 变量库圆角阶梯以 `4 / 6 / 8 / 12` 为准；组件遇到明确设计稿例外时，以设计稿实例为准并记录覆盖原因。
