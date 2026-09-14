# Tag Figma 审计

来源：Figma 页面 `2946:6454`（标签Tag✅），2026-09-08 只读检查。主组件集 `Tag`（`2950:1080`，132 variants：Style×Size×Color×shape = 3×2×11×2）、`Tagclose`（`2969:4514`，2 variants：Default/add）与 `Tag_corner`（`3217:9158`，24 variants：position×size×color = 2×2×6，2026-09-08 补齐真审计）。用户直接提供该页面链接定位（`node-id=2946-6454`），未通过猜测节点 ID 获得。

本轮对 Blue、Neutral 两个色系逐 style（filled/light/line）、对 Tag_corner 的 black/blue/green 三色，均用 `get_design_context` 直接核实了背景/文字/边框的真实变量绑定，并对 Regular/Small 两种尺寸、Default/Pill 两种形态分别核实过至少一个样本；其余色系（Tag 主组件的 9 色、Tag_corner 的 red/grey/orange）通过 `get_variable_defs` 核对色阶/语义色集合与已验证样本一致后类推角色分配，未逐一用 `get_design_context` 复核。完整设计上下文接口未出现超时，本轮未使用"接口超时故不写入"的免责声明。5 个初次发现的问题（TAG-001~005）均已在用户澄清后于同日关闭，详见下方"已关闭问题"。

## 已确认的真实状态矩阵（以 Blue、Neutral 为样本）

| Style | Blue 绑定 | Neutral 绑定（2026-09-08 更新） |
|---|---|---|
| Filled | 背景 `Primitive/Blue/B06`(#2b73ff) + 白字 `Primitive/Neutral/N01` | 背景 `Primitive/Neutral/N07`(#8d96a3，原为 N06/#b8c0cc) + 白字 `Primitive/Neutral/N01` |
| Light | 背景 `Primitive/Blue/B02`(#e5f0ff) + 文字 `Primitive/Blue/B07`(#1f63f0) | 背景 `Primitive/Neutral/N04`(#ebeef2) + 文字 `Primitive/Neutral/N09`(#475467) |
| Line | 背景 `Primitive/Blue/B01`(#f2f7ff) + 边框 `Primitive/Blue/B04`(#9cc0ff) + 文字 `Primitive/Blue/B07` | 背景 `Primitive/Neutral/N02`(#fafbfc) + 边框 `Primitive/Neutral/N06` + 文字 `Primitive/Neutral/N09` |

- Regular：高度 22，内边距 8，圆角 4（Default）/ 999（Pill，实现统一值，Figma 字面为 12，见 TAG-005），图标 12px，图标与文字间距 4px，字体 `中文/S6-CN-S`（PingFang SC Semibold 12/18）。
- Small：高度 18，内边距 8，圆角同 Regular，无图标位，字体 `中文/S10-CN-R`（PingFang SC Regular 10/14）。
- 标签组默认间距 8px（Regular 实测 `Frame 1312315003` 相邻标签 gap=8），Small 紧凑间距 4px（`Frame 1312315004` 实测 gap=4）；与 rules.md 现有描述一致，无差异。
- `Tagclose`：Default（可删除）变体先文字后关闭图标（`icf_system_close-md`，16px），背景 `Background/Secondary`(#ebeef2)、文字 `Text/Secondary`(#475467)；add（新增入口）变体先加号图标（`icf_system_add`，16px）后文字，背景 `Background/Container`(白)。两者均已走语义色层。

## Tag_corner 真实审计（2026-09-08 补齐）

- 组件集 `3217:9158`，24 variants：`position`(top_left/top_right) × `size`(medium/small) × `color`(black/red/blue/green[Figma 属性值原文拼写为 grreen]/grey/orange)。
- 与主 Tag 组件完全独立：只有一种深底白字视觉（无 Filled/Light/Line 区分），不支持主组件的 11 色。
- 尺寸复用主 Tag 的 Regular/Small 规格：medium 高 22/minWidth 40，small 高 18/minWidth 36，内边距 8，图标 12px（可选，`icon` 布尔属性），字体同主组件对应尺寸。
- **圆角是非对称贴角造型，不是四角统一圆角**：`position=top_left` 时左上角与右下角为圆角（medium 8px / small 4px），其余两角为直角；`position=top_right` 时右上角与左下角为圆角，其余两角为直角。这一点已用 `get_design_context` 对 top_left/top_right 各核实一次，是真实 Tailwind 类名（`rounded-tl-[8px] rounded-br-[8px]` 等）读出来的，不是推测。
- 颜色绑定语义色而非 Primitive：black=`Background/MK_45`(#00000073 黑色半透明蒙层)、red=`Border/error`(#f93838)、blue=`Feedback/brand`(#2b73ff)、green=`Feedback/success&decline`(#12b76a)、grey=`Feedback/plain`(#667085)、orange=`Feedback/warning`(#f77c09)。black/blue/green 已用 `get_design_context` 逐 variant 核实；red/grey/orange 按 `get_variable_defs` 汇总类推。

## 已关闭问题

1. **TAG-001 · 已关闭（2026-09-08 设计确认为既定决策，非缺陷）**
   - 设计侧说明：要让 Tag 的 Filled/Light/Line 三种风格都走语义层，至少需要新增 4 套语义色（深底、浅底、浅底文字、边框）× 11 色，token 数量过多，当时评估后有意选择直接绑定 Primitive/* 色阶。
   - 已在 schema.json 的 `confirmedDecisions` 登记该决策，不再作为待修复项跟踪。

2. **TAG-002 · 已关闭（2026-09-08 已补齐 Tag_corner 真审计）**
   - 用户明确 Tag_corner 虽然和普通 Tag 不同，但应该在 Figma 和网页上与主 Tag 组件同层级展示；已在 rules.md「异形与边角标签」章节补充完整使用规范，并在本文件、schema.json（`cornerTag` 字段）、mapping.json、`tag.tokens.json` 中都补上了真实核实过的结构化数据（见上方"Tag_corner 真实审计"）。
   - 边角标签的预览展示（放入 `preview/tag/index.html` 与主 Tag 同层级）作为后续任务跟进，不影响本次契约层关闭。

3. **TAG-003 · 已关闭（2026-09-08，Figma 已改，已独立复核）**
   - 用户在 Figma 里把 Filled+Neutral 的背景从 N06 改成了 N07；没有直接采信，用 `get_variable_defs` 重新读取节点 `2950:960`，确认真实绑定确实已是 `Primitive/Neutral/N07`(#8d96a3)。
   - 重新计算对比度：白字在 #8d96a3 上为 **2.99:1**，比原来的 1.83:1 有明显提升，已过 3:1 的非文本/大字号门槛；但按 WCAG AA 对 12px 常规文本 4.5:1 的严格要求，仍未完全达标。已如实记录这一点，不夸大为"完全解决"。

4. **TAG-004 · 已关闭（2026-09-08 设计确认）**
   - 用户确认 Tag 不需要交互态。`schema.json` 的 `states` 从 `["default","hover","pressed","selected"]` 精简为 `["default","selected"]`，并明确 `selected` 不是独立设计出来的视觉状态，而是由外部逻辑切换 `style`/`color` 属性表达（例如未选中用 Line、选中用 Filled），与 Figma 132 个 variant 只有 default 单一状态的事实一致。

5. **TAG-005 · 已关闭（2026-09-08 设计确认）**
   - 用户确认从统一性角度可以直接用 999px 实现。`tag.tokens.json` 的 `size.regular.radiusPill` / `size.small.radiusPill` 已改为 999，并保留 Figma 实测字面值 12px 的说明（二者在当前两种高度下视觉等价）。

## 结论

Tag 的 1 个主组件集（132 variants）、1 个附属图标组件（2 variants）与 1 个边角标签组件（24 variants）已全部完成真实 Figma 审计；schema/mapping 已升级为 `figma-audited`，`pendingExtraction` 清空。首轮发现的 5 个问题（TAG-001~005）均已在用户澄清或调整 Figma 后于同日关闭，其中 TAG-003 的关闭附带"仍未完全达到 WCAG AA"的如实说明，不是无条件通过。

## 2026-09-11：清理预览页残留旧 CSS（新增并关闭 TAG-006）

背景：延续 MDL-010（见 `components/modal/audit.md`）建立的方法，对 `preview/tag/index.html` 做同样的死代码核查——用户明确的标准原则是预览页无论静态展示区还是交互区，都应该只用标准组件基座渲染，不应该残留旧 CSS。

排查方法：同 MDL-010，解析页面全部 `<style>` 块，提取每个选择器涉及的类名，逐个类名对照页面真实 `class="..."` 属性（含 JS 动态拼接的模板字符串）确认是否被引用；复合选择器按逗号拆分成分支逐项判断，只删除全部分支都确认无引用的规则，混有真实类的复合选择器保留但裁掉死亡分支。

整条规则删除（1 条）：`.props`。

验证：脚本二次扫描确认页面残留死选择器为 0；`<style>` 块大括号计数与逐字符深度校验均通过（与 button.html 同批次校验时一并发现并排除结构性错误）；本文件删除/裁剪的选择器均逐一比对过页面真实 `class="..."` 与 `classList` 调用，确认为未引用的旧代码，属于低风险清理，未单独截图复核。

结论：TAG-006 已关闭。`preview/tag/index.html` 内嵌 CSS 现在只包含仍被页面实际使用的选择器。
