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
