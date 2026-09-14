# Form audit

- 只读来源：页面 `2638:2418`；组件节点 `3041:3366`、`3097:1674`、`3036:981`、`3037:982`。
- Figma 属性 `toolip` 拼写错误；本地契约统一为 `tooltip`。
- Figma 值 `preffix-label`、`preffix-select` 拼写错误；本地统一为 `prefix-label`、`prefix-select`。
- Form 只负责 Label、反馈、布局和 Addon 组合；控件视觉继续来自 Input、Selector 等组件。
- 2026-09-09 预览纠正（对照 Figma，未编造）：
  - 纵向 Label→控件 `gap 4px`（`3097:1656`），不是 8px。
  - 横向 Label→控件 `8px`（`3041:3355` `right: 8px`）。
  - Label 内部 `*` / 文案 / Tooltip / 冒号 `gap 4px`；必填 `*` 用 Semibold，不再额外 `margin-right`。
  - 横向 8px 是 Label 与输入框的 column-gap（Figma `right: 8px`）。输入列 `flex:1; min-width:0` 占满 Label 右侧剩余空间，不要写 `width:0` 把整项收成 Label 宽度。
  - `Input-Addon` `type=label`（`.com`）与 `type=setting`（设置）是同一套的互斥变体，预览不得叠在同一输入框。
- 仍待核对 5 个组件集、54 个 variant 的全部组合、默认值和变量/Text Style 绑定。

## 2026-09-11：清理预览页残留旧 CSS（新增并关闭 FRM-002）

背景：延续 MDL-010（见 `components/modal/audit.md`）建立的方法，对 `preview/form/index.html` 做同样的死代码核查——用户明确的标准原则是预览页无论静态展示区还是交互区，都应该只用标准组件基座渲染，不应该残留旧 CSS。

排查方法：同 MDL-010，解析页面全部 `<style>` 块，提取每个选择器涉及的类名，逐个类名对照页面真实 `class="..."` 属性（含 JS 动态拼接的模板字符串）确认是否被引用；复合选择器按逗号拆分成分支逐项判断，只删除全部分支都确认无引用的规则，混有真实类的复合选择器保留但裁掉死亡分支。

整条规则删除（5 条）：`.anatomy`、`.code`、`.part`、`.part b`、`.part span`。

复合选择器裁剪（1 处，保留真实分支/去掉死亡分支）：
- `.anatomy,.states` → `.states`

验证：脚本二次扫描确认页面残留死选择器为 0；`<style>` 块大括号计数与逐字符深度校验均通过（与 button.html 同批次校验时一并发现并排除结构性错误）；本文件删除/裁剪的选择器均逐一比对过页面真实 `class="..."` 与 `classList` 调用，确认为未引用的旧代码，属于低风险清理，未单独截图复核。

结论：FRM-002 已关闭。`preview/form/index.html` 内嵌 CSS 现在只包含仍被页面实际使用的选择器。
