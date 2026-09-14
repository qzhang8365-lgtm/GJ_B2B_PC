# Divider audit

- Read-only extraction from Figma nodes `2378:1289` and `2394:888`.
- Component properties: Type, Dashed, Title, Position.
- `Position` is meaningful only for horizontal dividers with a title.
- Vertical + Title/Position combinations are treated as invalid in code instead of being exposed as usable combinations.
- Line color uses `Border/default`; title color uses `Text/Tertiary`.
- Divider title text is bound to `中文/S8-CN-R` (14px / 22px, Regular 400).
- The Figma documentation canvas is reference content only and is not reproduced as page layout.

## 2026-09-11：清理预览页残留旧 CSS（新增并关闭 DVD-001）

背景：延续 MDL-010（见 `components/modal/audit.md`）建立的方法，对 `preview/divider/index.html` 做同样的死代码核查——用户明确的标准原则是预览页无论静态展示区还是交互区，都应该只用标准组件基座渲染，不应该残留旧 CSS。

排查方法：同 MDL-010，解析页面全部 `<style>` 块，提取每个选择器涉及的类名，逐个类名对照页面真实 `class="..."` 属性（含 JS 动态拼接的模板字符串）确认是否被引用；复合选择器按逗号拆分成分支逐项判断，只删除全部分支都确认无引用的规则，混有真实类的复合选择器保留但裁掉死亡分支。

整条规则删除（1 条）：`.props`。

验证：脚本二次扫描确认页面残留死选择器为 0；`<style>` 块大括号计数与逐字符深度校验均通过（与 button.html 同批次校验时一并发现并排除结构性错误）；本文件删除/裁剪的选择器均逐一比对过页面真实 `class="..."` 与 `classList` 调用，确认为未引用的旧代码，属于低风险清理，未单独截图复核。

结论：DVD-001 已关闭。`preview/divider/index.html` 内嵌 CSS 现在只包含仍被页面实际使用的选择器。
