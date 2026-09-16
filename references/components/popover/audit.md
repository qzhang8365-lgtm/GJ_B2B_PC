# Popover Figma 审计

来源：用户提供画板 `3630:3133`（popover_basic），2026-09-09 只读检查。未修改 Figma。官方 MCP `get_design_context` / `get_variable_defs` / `get_metadata` 读取。库检索 `search_design_system` 用于核对其它套。

旧 inventory 曾记 **2 套 / 4 variants**。2026-09-09 用户确认：页面上只有一套 `popover_basic`；画板上看到的两个是子变体，不是第二套母版。inventory 已改为 **1 套 / 2 variants / standalone 0**。

Figma 组件说明：无箭头、内容居中的基础弹出框；用于短文本结果反馈和简单确认；`button=1` 单主按钮，`button=2` 取消＋主操作；内容结构固定，不承载复杂表单。

## 已确认的组件集

### popover_basic（组件集 `3630:3133`，2 个子变体）

| button | 节点 | 画板宽×高 | 样本图标 | 图标色 |
|---|---|---|---|---|
| 1 | `3630:3132` | 360×282 | `4518:23900` `icf_system_check-circle-fill` | `Feedback/success&decline` |
| 2 | `3630:3131` | 360×282 | `4518:23906` `icf_system_safety1-fill` | `Feedback/brand` |

共用 chrome：

- 容器宽 **360**、`Background/Container`、圆角 **16**（按 `Radius/Radius-XL`；生成代码未绑 Radius）
- 内边距上 **40** / 左右 **24** / 下 **24**（等价 space9 / space7 / space7）
- 列 `gap` **20**（图标 / 文案 / 操作；等价 space6）
- 文案栈 `gap` **16**、水平内缩 **20**、`items-center`、`text-center`
- 标题 `中文/S2-CN-S` / `Text/Primary`
- 说明 `中文/S8-CN-R` / `Text/Secondary`
- 语义图标 **48**（`Components/control-XL`）
- 投影 **`shadow-center`**（`Background/MK_10`，blur 15）
- 确认：Primary Large，高 `Components/control-L` **40**、水平 `Interval/space5` **16**、圆角 `Radius/Radius-MD` **8**、`Button/Primary/Bg-default` + `Text/reversal`、`中文/S7-CN-R`
- `button=1`：确认按钮铺满操作行
- `button=2`：操作行 `gap` **12**；取消为 Tertiary Large（`Background/Container` + `Border/secondary` + `Text/Primary`），与确认等宽。取消不是 Secondary（Secondary 是蓝字 + `Border/focused`）

没有 Status 变体轴。图标是内容插槽，两份样本分别用成功与权限图形。旧规则里的 error / warning 四态不在本画板。

本画板**没有**视口位置、遮罩或自动消失时长。规范页在演示框内展示，不把 Popover 写成 `position:fixed`。

## 相对旧 rules-derived / 预览页的核对

1. 宽 360、上 40 / 左右 24 / 下 24、图标 48、标题 20/30·600、说明 14/22·400、文案间距 16、文案左右内缩 20、双按钮间距 12、按钮高 40，与旧 rules 一致。
2. 旧 schema 把 `status` 和 `actions: [0,1,2]` 写成组件属性。画板只有 `button=1|2`；图标不是 Status 轴，也没有 0 按钮变体。
3. 旧预览私有 `.popover` 宽曾写 432，后又用第二段 CSS 压回 360；投影写成 `0 0 15px MK_10`，与 `shadow-center` 同形。实现改为共享 `.gj-popover*`。
4. 操作按钮对应共享 Button Large，不要再用页面私有 `.btn`。
5. 圆角 16 不是 `Radius-LG` 12。`dimensions.json` 里 Radius-LG 的 usage 仍写 Popover，以画板实例为准。

## 已关闭问题

1. **POP-001 · P3 · 已关闭** — 2026-09-09 用户确认页面只有一套。旧 inventory 2/4 是误记；已改为 1 套 / 2 variants。画板上两个是 `button=1/2` 子变体。
2. **POP-002 · P3 · 已关闭** — 2026-09-09 用户确认 `3630:3133` 就是 `popover_basic` 组件集母版。MCP 曾标成 frame，不影响；该 ID 继续作集合锚点。

## 结论

Popover 为 `figma-audited`。页面上只有 `popover_basic` 一套。两态宽度、内边距、居中结构、`shadow-center`、Button Large 操作区和两份样本图标已抽样核实。`pendingExtraction` 为空。

## 2026-09-11：清理预览页残留旧 CSS（新增并关闭 POP-003）

背景：延续 MDL-010（见 `components/modal/audit.md`）建立的方法，对 `preview/popover/index.html` 做同样的死代码核查——用户明确的标准原则是预览页无论静态展示区还是交互区，都应该只用标准组件基座渲染，不应该残留旧 CSS。

排查方法：同 MDL-010，解析页面全部 `<style>` 块，提取每个选择器涉及的类名，逐个类名对照页面真实 `class="..."` 属性（含 JS 动态拼接的模板字符串）确认是否被引用；复合选择器按逗号拆分成分支逐项判断，只删除全部分支都确认无引用的规则，混有真实类的复合选择器保留但裁掉死亡分支。

整条规则删除（2 条）：`.variant`、`.variant h3`。

验证：脚本二次扫描确认页面残留死选择器为 0；`<style>` 块大括号计数与逐字符深度校验均通过（与 button.html 同批次校验时一并发现并排除结构性错误）；本文件删除/裁剪的选择器均逐一比对过页面真实 `class="..."` 与 `classList` 调用，确认为未引用的旧代码，属于低风险清理，未单独截图复核。

结论：POP-003 已关闭。`preview/popover/index.html` 内嵌 CSS 现在只包含仍被页面实际使用的选择器。

## 2026-09-16：规范页结构优化（新增并关闭 POP-004）

- 预览页迁移到统一的 `component-docs.css` 文档骨架，重组为组件结构、操作形式、交互演示、结构规格、反馈边界五段，降低旧两栏页面的信息拥挤感。
- 静态样本与交互样本全部继续使用 `.gj-popover*`、共享 Button Large、Input 与 Select；未新增页面私有 Popover 外观。
- 两个真实变体继续严格对应 `button=1|2`；图形仍作为内容插槽，不增加 Status 变体，不增加 0 按钮或第三操作。
- 360px 组件真值在规范页中保持不变；窄文档容器通过外层横向滚动承载，响应式断点只改变规范页网格列数。
- 明确展示层边界：Figma 未定义的遮罩、视口锚点、打开方式和自动关闭行为均未写入组件演示。

结论：POP-004 已关闭，无新增待确认项。
