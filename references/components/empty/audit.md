# Empty Figma 审计

来源：Figma 页面 `3143:5678`（空状态 Empty✅），2026-09-09 只读检查。完整页面 design context 首次因 Figma 当前停留在 Recents 而阻塞；切回用户提供的设计文件后，对代表 variant、插图资源、metadata 和变量定义完成交叉核验。

## 真实组件结构

- 主组件集 `Empty`（`3489:11019`）：12 variants，`Type` 为 TextOnly / Empty / NotFound / Disconnected / NoPermission / Error，`Action` 为 None / Button。
- 插图组件集 `Empty_item/img`（`3143:5853`）：6 variants，包含 Empty / notfound / disconnected / noPermission / error / no chart。
- 独立组件 `Empty_Basic`（`3143:5844`）：100×120，旧式 `No Data` 英文文案；当前统一 Empty 已覆盖其能力。
- 当前合计为 **2 个组件集、18 个 variants、1 个独立组件**。旧 inventory 的“2 个独立组件”在当前页面 metadata 中无法复现，已按现状更正为 1。

## 尺寸、字体与组合

- 根内容宽度固定 240px；文字内容内部间距 4px；插图与文字间距 12px；内容与操作按钮间距 16px。
- 插图统一宽 100px；Empty/NoPermission/Error/NoChart 高 89px，NotFound/Disconnected 高 91px。
- Title 使用 `中文/S5-CN-S`：PingFang SC Semibold 14/22、`Text/Primary`。
- Description 使用 `中文/S9-CN-R`：PingFang SC Regular 12/18、`Text/Secondary`。
- Action 是真实 Button 实例：Primary、Medium、32px 高、左右内边距 12px、圆角 6px。Empty 不拥有自己的按钮交互态。
- 无操作时高度：TextOnly 44；89px 插图类型 145；91px 插图类型 147。带按钮时分别为 92 / 193 / 195。长文案必须让高度自然增长，不能裁切。

## 已关闭问题与规则补充

| ID | 原问题 | 处理结论 |
|---|---|---|
| EMP-001 | inventory 写 2 个独立组件，但当前 metadata 只能定位 1 个 | **已关闭**：以当前页面全量 metadata 为准，更正 inventory 为 1 |
| EMP-002 | `no chart` 插图存在，但主 Empty 的 Type 不包含 NoChart | **已关闭（Skill 层）**：增加 `NoChart` 类型并映射真实 Figma 节点 `3912:1180`；无需新增或猜测插图 |
| EMP-003 | 六种主 Type 共用“暂无数据/当前暂无可展示内容”默认文案，容易产生错误语义 | **已关闭**：schema 增加按原因区分的 semanticDefaults；实例仍允许业务文案覆盖 |
| EMP-004 | Action 只有 None/Button，按钮文案未暴露属性，无法适配真实恢复动作 | **已关闭**：增加 `actionLabel` 本地契约；默认文案按类型给出，业务流程可覆盖 |
| EMP-005 | `Empty_Basic` 使用英文 `No Data`，字体和内容结构与新组件不一致 | **已关闭**：标记为 deprecated，仅保留旧稿兼容映射，新页面禁止使用 |
| EMP-006 | 本地 Empty 预览把 Action 写成独立 `.action` 按钮样式 | **已关闭**：预览改为共享 `gj-btn gj-btn-primary`，状态完全继承 Button 契约 |
| EMP-007 | Figma 没有说明 Loading 与 Empty 的切换时机、局部失败和重试上下文 | **已关闭（行业规则）**：首次请求完成前用 Loading/Skeleton；局部失败只替换局部；重试保留输入和筛选并防重复提交 |
| EMP-008 | Figma 未定义动态空结果的播报和焦点规则 | **已关闭（行业规则）**：静态空状态不设 live region；用户操作后出现时使用 polite/status；不聚焦装饰插图，保留触发控件或恢复动作焦点 |
| EMP-009 | Figma 的插图组件 description 漏写实际存在的 `no chart` | **已关闭（文档层）**：mapping 与 schema 已完整登记 6 种插图；不依赖遗漏的 description 做枚举 |

## 语义边界

- `Empty`：确实尚无业务记录；`NotFound`：数据可能存在，但筛选或搜索没有匹配；二者不得混用。
- `Disconnected`：网络不可用；`Error`：请求或渲染失败。不要把服务端错误伪装成“暂无数据”。
- `NoPermission` 不泄露受保护数据是否存在。只有真实申请/联系路径存在时才显示按钮。
- `NoChart` 用于没有可绘制序列的图表区域；如果坐标轴或图例仍能帮助解释范围，可保留框架并在绘图区居中 Empty。
- Empty 不是 Loading、成功反馈、风险警告或表单校验；同一区域也不再叠加相同内容的 Toast/Alert/Notification。

## 结论

Empty 的 18 个 variants、插图集合和唯一独立旧组件已完成真实审计。所有发现均通过清单纠正、兼容映射或明确的行业规则在 Skill 层关闭，目前没有需要用户人工判断的开放项。

## 2026-09-11：清理预览页残留旧 CSS（新增并关闭 EMP-010）

背景：延续 MDL-010（见 `components/modal/audit.md`）建立的方法，对 `preview/empty/index.html` 做同样的死代码核查——用户明确的标准原则是预览页无论静态展示区还是交互区，都应该只用标准组件基座渲染，不应该残留旧 CSS。

排查方法：同 MDL-010，解析页面全部 `<style>` 块，提取每个选择器涉及的类名，逐个类名对照页面真实 `class="..."` 属性（含 JS 动态拼接的模板字符串）确认是否被引用；复合选择器按逗号拆分成分支逐项判断，只删除全部分支都确认无引用的规则，混有真实类的复合选择器保留但裁掉死亡分支。

整条规则删除（1 条）：`.desc`。

验证：脚本二次扫描确认页面残留死选择器为 0；`<style>` 块大括号计数与逐字符深度校验均通过（与 button.html 同批次校验时一并发现并排除结构性错误）；本文件删除/裁剪的选择器均逐一比对过页面真实 `class="..."` 与 `classList` 调用，确认为未引用的旧代码，属于低风险清理，未单独截图复核。

结论：EMP-010 已关闭。`preview/empty/index.html` 内嵌 CSS 现在只包含仍被页面实际使用的选择器。


## 2026-09-14：EMP-011 真实插图资源缺失 / EMP-012 runtimeMap 类名与实现不符

用户反馈 search-list.html 的空状态「不要自行插入图标」，排查 `.gj-empty-icon` 用的 `icf_file_file-search-line.svg` 后发现：这是页面自己从通用 iconfont 里挑的一个文件图标，不是 Empty 组件的真实插图。`mapping.json#assetMap` 明确要求插图必须复用 `Empty_item/img`（NotFound 对应 Figma 节点 3143:5866），但 `assets/images` 目录下完全没有任何 Empty 相关的导出文件——真实插图资源从未进入过代码库，`.gj-empty-icon` 目前只是一个 48px 单色 mask 图标的兜底实现，并不是设计稿要求的插图。

排查过程中还发现 `mapping.json#runtimeMap` 记录的类名（`.gj-empty-state`、`.gj-empty-state__illustration` 等）在 `gj-b2b-components.css` 里完全不存在，实际实现是 `.gj-empty`/`.gj-empty-icon`——文档描述的运行时契约和真实代码不是同一套。

处理：EMP-011（插图缺失）按用户「有插图/没插图都行，但不要自己插图标」的要求，把 search-list.html 的空状态改成 TextOnly（无插图），去掉手写的通用图标；真正的带插图变体要等 Figma 插图资源导出后才能启用，暂列为「待资产补齐」。EMP-012（类名与实现不符）只记录未处理，需要设计侧决定是改文档还是改代码。

## 2026-09-14（更正）：EMP-011/EMP-012 此前判断有误，已重新排查并关闭

用户指出上一条记录的判断错误：「查询列表空状态-但是组件页面显示出插图了，是正确的插图。EMP-012改文档。」

重新排查后确认两处此前的结论都不成立：

- **EMP-011 的「插图资源从未进入代码库」不成立**：`preview/empty/index.html` 自己的预览页一直用内嵌 `<script>` 里的 `const assets={...}` 存着 6 个真实插图（Empty/NotFound/Disconnected/NoPermission/Error/NoChart）的 base64 PNG，页面渲染出来的插图就是真图，不是占位。此前只搜索了 `assets/images` 目录下是否存在独立图片文件，没有检查页面内嵌的 base64，因此误判为「资源不存在」。
- **EMP-012 的「mapping.json#runtimeMap 记录的类名在实现里完全不存在」不成立**：`assets/styles/gj-b2b-components.css` 里其实真实存在完整的 `.gj-empty-state` / `.gj-empty-state__illustration` / `.gj-empty-state__copy` / `.gj-empty-state__title` / `.gj-empty-state__description` / `.gj-empty-state--text-only`，并配了一整套 `--ds-component-empty-*` tokens（内容宽度、各类高度、间距等），与 mapping.json 文档记录逐字匹配。此前只 grep 到了另一个更早、更简单的平行实现 `.gj-empty`/`.gj-empty-icon`（48px 单色 mask 图标，search-list.html 曾经用的就是这个），没有再往下翻就得出了「文档记录的类名不存在」的错误结论。

真实存在的差距只有一个：`.gj-empty-state__illustration` 这个插图槽位虽然 CSS 和 tokens 都齐备，但在这次修复之前，全站没有任何页面真正给它传过一张图——`preview/table/index.html` 只用了 `.gj-empty-state--text-only`（无插图）。真实的插图资源，只存在于 `preview/empty/index.html` 自己的页面私有 base64 里，从未被导出为独立文件、也从未接入过 `.gj-empty-state__illustration`。

处理：

1. 从 `preview/empty/index.html` 的内嵌 base64 逐一解码导出为 6 个真实 PNG 文件，提交到 `assets/images/empty/`（empty.png / notfound.png / disconnected.png / no-permission.png / error.png / no-chart.png）。解码后量得的实际像素尺寸与 rules.md 文档基本一致（100×89 或 100×91），仅 disconnected（102×97）、error（103×96）有小幅出入，不影响 `object-fit:contain` 下的视觉效果，已记录在 mapping.json#assetMap.committedAssetPath 的 note 里供后续核对。
2. `preview/patterns/search-list.html` 的 `#queryEmpty` 从旧的 `.gj-empty`/`.gj-empty-icon`（曾经手动挑了一个不相关的通用图标 `icf_file_file-search-line.svg`）改为真正的共享组件结构：`.gj-empty-state` + `.gj-empty-state__main > img.gj-empty-state__illustration`（引用 `assets/images/empty/notfound.png`）+ `.gj-empty-state__copy`（`__title`/`__description`）+ 操作按钮。这是全站第一处真正启用带插图变体的地方。
3. Playwright 通过本地 HTTP 服务器（避免 file:// 的 mask/image CORS 干扰）渲染验证：插图正确加载（`naturalWidth/Height` 与文件一致），控制台无请求失败，视觉截图确认与 NotFound 语义相符。
4. `mapping.json#runtimeMap` 和 `#assetMap` 分别补充了 note，说明真实实现位置、此前误判已更正，并登记了新提交的资源路径，避免以后重复排查同一个问题。

结论：EMP-011、EMP-012 均已关闭（见 audit-tracker.md 更正记录），不再是「待资产补齐」或「待设计确认」。

## 2026-09-15：规范页迁移至共享基座

- 规范页的七类语义示例与实时预览已改用 `.gj-empty-state` 共享契约，不再由页面私有 `.empty` 结构负责渲染。
- 插图统一引用 `assets/images/empty/` 已导出的正式资源；装饰插图保持空 `alt`，搜索无结果使用状态语义容器。
- 语义场景改为双列卡片，白色演示舞台承载 Empty，避免浅色插图与页面灰底融合；窄宽度回落单列。
- 复核后删除不必要的「组成结构」，首屏直接展示七类语义场景；原有规则区原位替换为三列表格，明确加载切换、局部反馈、恢复操作和可访问性边界。

结论：EMP-011/EMP-012 保持关闭，规范页已与共享 Empty 基座及正式资源路径一致。

## 2026-09-15：六个插图 PNG 一直是不透明白底，非任何容器都能正确融合（EMP-013）

用户反馈：Empty 插图后面能看到一块突兀的白色背景。核查 `assets/images/empty/` 下的 6 个真实 PNG（EMP-011 导出的那批），确认问题真实存在且此前从未被发现：

- 逐文件用 PIL 读取像素，确认全部 6 张图都是 `RGBA` 但 alpha 通道从头到尾恒为 255（完全不透明），画布四角像素精确等于 `(255,255,255,255)`；插图本体之外的留白区域并非透明，而是 Figma 导出时把画板底色一起拍平进了 PNG。
- 把原图合成到浅灰 `#F5F7FA`（即 `--ds-background-background`，页面级背景色）和深色背景上做对照，两种背景下都能清楚看到一块与画布等大的矩形白块，与用户描述完全一致。
- 复核当前两处真实引用（`preview/empty/index.html` 的 `.stage` 舞台、`preview/patterns/search-list.html` 的 `#queryEmpty`）都刻意包在白色 `--ds-background-container` 容器里，才让问题一直没有在这两处露出来——本质是「用白色容器兜住不透明的白底插图」这种此前就存在的规避写法（见 2026-09-15 更早的"规范页迁移至共享基座"记录：「避免浅色插图与页面灰底融合」），而不是修好了插图资源本身。只要以后有任何页面把 Empty 直接放在非白色容器（灰底页面、深色卡片等）上，白块就会重新出现。

处理（按用户给的第一个方案：去除插图本身的白色背景，而不是再叠一层容器兜底）：

1. 用脚本对 6 张 PNG 做精确的纯白抠图：仅当像素严格等于 `(255,255,255)` 时才置为完全透明（alpha=0），其余像素原样保留，不做任何颜色混合或整体 alpha 缩放——插图本体的浅灰蓝色实心填充（例如信封面板色、阴影色）都明显偏离纯白，不会被误伤；抠图后逐张人工核对，阴影椭圆、高光圆点等浅色但非纯白的设计元素都完整保留。
2. 6 张图分别在浅灰背景、深色背景下重新合成核对：矩形白块完全消失，插图能在任意背景色下正确融合；`disconnected`/`error`/`no-chart` 三张图背后原本就有的柔和径向光晕（设计本身的效果，非本次引入）依然保留，形状是圆形柔光而不是硬边矩形，不是新的视觉缺陷。
3. Playwright 验证：`preview/empty/index.html` 规范页整页截图正常；额外构造了一个「插图直接放在灰底、不套白色卡片」的探测场景（模拟用户描述的场景），6 张插图全部干净融合，零控制台报错、零 404。
4. 6 个文件通过 SendUserFile → device_commit_files（每次提交前重新 `device_stage_files` 核对 mtime，确认未被并发编辑覆盖）推回设备，逐文件 `cmp` 核对字节级一致。

结论：这是资产层面的真实缺陷（导出时未带透明通道），不是使用方式的问题，因此按根因修复，而不是继续加白色容器兜底；此前两处引用点的白色 `.stage`/`.gj-empty-state` 容器包装继续保留（本身没有坏处，也符合浅色内容需要衬底的常见做法），但不再是"必须依赖"的兜底，插图资源本身现在在任何背景下都是正确的。EMP-013 已关闭，见 audit-tracker.md。
