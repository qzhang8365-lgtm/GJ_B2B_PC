# Breadcrumb Figma 审计

来源：用户指定节点 `2638:2638`（页面 `面包屑Breadcrumb✅`），2026-09-09 通过 Figma Desktop `get_metadata`、`get_design_context` 与 `get_variable_defs` 只读复查。未修改 Figma。

BCR-001 要求核对历史项、当前项、分隔符、图标尺寸和 Text Style 绑定。本轮已逐节点读取。

inventory 原记 **2 套 / 16 variants / 0 standalone**。页上带 `属性=值` 子图层的母版是 **3 套 / 9 variants**：

| 套 | 母版节点 | variants | 轴 |
|---|---|---:|---|
| `Breadcrumb_item/nav_item` | `2718:976` | 4 | Current × icon |
| `Breadcrumb1` | `2718:1017` | 4 | Count=2\|3\|4\|4+ |
| `CoBreadcrumb_item` | `4176:18037` | 1 | Property 1=Separator |

旧 16 是把组合路径里的实例算进去了。说明画板 `2981:4127` 里的实例不是母版。2026-09-09 按母版口径更正 inventory 为 **3 / 9 / 0**。

## 绑定复查

### 历史项 `Current=false`

样本：无图标 `2718:1015`（39×22）、有图标 `2718:1002`（59×22）。

| 属性 | 绑定 |
|---|---|
| 文字色 | `Text/Tertiary` `#8D96A3` |
| Text Style | `中文/S8-CN-R` 14/22/400 PingFang SC |
| 高 | 22 |
| 图标 | 16×16，`y=3` 垂直居中 |
| 图标色 | 跟随 `Text/Tertiary`（icon 实例 `2718:1003`） |
| 图文间距 | 4px（生成 `gap-[4px]`，图标右缘到文字 x=20） |

### 当前项 `Current=true`

样本：无图标 `2718:1013`、有图标 `2718:999`。

| 属性 | 绑定 |
|---|---|
| 文字色 | `Text/Primary` `#101828` |
| Text Style | `中文/S8-CN-R` 14/22/400 |
| 高 | 22 |
| 图标 | 同 16×16，颜色跟随 `Text/Primary` |

无 Hover / Focus / Disabled 轴。代码历史项 Hover 使用 `Text/blue`（rules 的可点击高亮），已写入 Token，不是 Figma variant。

### 分隔符 `CoBreadcrumb_item`

节点 `4176:17976`，22×22。

| 属性 | 绑定 |
|---|---|
| 文案 | `/` |
| 颜色 | `Background/MK_30` `#0000004D` |
| 水平 padding | 8（生成 `px-[8px]`） |
| Text Style | 旧 `Body/regular` Roboto 14/22 |

实现分隔符保持 UI 字体 14/22/400，不引入 Roboto。度量与 Figma 一致。

### 组合 `Breadcrumb1` Count=4+

节点 `2718:1018`：`Home / Application Center / ... / Application List / An Application`。省略项是历史 `nav_item`，文案 `...`，仍为 `Text/Tertiary` + S8。末级 `Text/Primary`。

## 相对旧 Token

本地 `history.text` / `current.text` / `separator.color` / 图标 16 / 高 22 / 项 `中文/S8-CN-R` **与本轮绑定一致**。补记：图文间距 4、分隔符 Figma Text Style 为 Body/regular、历史 Hover `Text/blue`。

## 开放问题

1. **BCR-001 · P2 · 已关闭** — 2026-09-09 已核对历史项、当前项、分隔符、图标 16 与 Text Style。颜色与项文字样式与既有 Token 一致。

## 结论

Breadcrumb 升级为 `figma-audited`。3 套 / 9 variants 已读取。`pendingExtraction` 为空。

## 2026-09-11：清理预览页残留旧 CSS（新增并关闭 BCR-002）

背景：延续 MDL-010（见 `components/modal/audit.md`）建立的方法，对 `preview/breadcrumb/index.html` 做同样的死代码核查——用户明确的标准原则是预览页无论静态展示区还是交互区，都应该只用标准组件基座渲染，不应该残留旧 CSS。

排查方法：同 MDL-010，解析页面全部 `<style>` 块，提取每个选择器涉及的类名，逐个类名对照页面真实 `class="..."` 属性（含 JS 动态拼接的模板字符串）确认是否被引用；复合选择器按逗号拆分成分支逐项判断，只删除全部分支都确认无引用的规则，混有真实类的复合选择器保留但裁掉死亡分支。

整条规则删除（7 条）：`.breadcrumb`、`.code`、`.crumb-icon`、`.crumb-item`、`.crumb-item.current`、`.crumb-item:not(.current):hover`、`.separator`。

验证：脚本二次扫描确认页面残留死选择器为 0；`<style>` 块大括号计数与逐字符深度校验均通过（与 button.html 同批次校验时一并发现并排除结构性错误）；本文件删除/裁剪的选择器均逐一比对过页面真实 `class="..."` 与 `classList` 调用，确认为未引用的旧代码，属于低风险清理，未单独截图复核。

结论：BCR-002 已关闭。`preview/breadcrumb/index.html` 内嵌 CSS 现在只包含仍被页面实际使用的选择器。

## 2026-09-15：核查 5 个页面模式的面包屑是否为真实组件（新增并关闭 BCR-003）

用户提问：当前模式页（`preview/patterns/*.html`）的面包屑是真实共享组件还是页面私有一次性 CSS？

核查结论：**是真实共享组件，不是一次性 CSS。** `search-list.html`/`form-edit.html`/`object-detail.html`/`step-task.html` 四个页面（`dashboard.html` 作为顶层工作台页本就不需要面包屑，未使用属预期）用的 `.gj-breadcrumb`/`.gj-breadcrumb-item`/`.gj-breadcrumb-separator` 全部定义在共享基座 `assets/styles/gj-b2b-components.css`，并绑定真实 Token（`--ds-component-breadcrumb-*`）；`preview/patterns/page-patterns.css` 里唯一相关的一条规则 `.page>.gj-breadcrumb{margin-bottom:12px}` 只是页面级排版间距覆盖，不重新定义组件本身，属于合理的页面私有布局微调。

但逐字比对 `preview/breadcrumb/index.html` 规范页的真实渲染函数 `breadcrumb()` 后，发现 4 个模式页的面包屑标记和规范页存在两处细节偏差：

1. 当前页面项：规范页用的是 `<button class="gj-breadcrumb-item" aria-current="page" disabled>`（和历史项一样是按钮，只是加了 `disabled`），4 个模式页当时写的是 `<span class="gj-breadcrumb-item" aria-current="page">`——视觉效果因为都吃 `[aria-current="page"]` 选择器所以看不出差异，但标签语义和规范页不一致。
2. 分隔符：规范页的分隔符带 `aria-hidden="true"`（纯装饰、不应被屏幕阅读器读出），4 个模式页当时缺失这个属性。

处理：4 个文件的当前项改为 `<button type="button" aria-current="page" disabled>`，分隔符补上 `aria-hidden="true"`，与规范页的真实标记完全对齐。Playwright 逐页验证：`gj-breadcrumb-item` 均渲染为 `BUTTON`，当前项 `disabled=true` 且 `aria-current=page`，历史项可点击不禁用，分隔符 `aria-hidden=true`，4 页 HTML 标签计数（div/span/button/nav）配平，零控制台报错、零 404，视觉截图与规范页一致。

结论：BCR-003 已关闭——面包屑本身一直是真实组件，这次只是把模式页的标记里两处和规范页不一致的细节（当前项标签、分隔符可访问性属性）对齐，不是新引入交互或样式。
