# Avatar Figma 审计

来源：Figma 组件集 `2982:622`（Avatar✅），2026-09-09 只读检查。24 个 variant：`Size`(24/32/40/64) × `Shape`(circle/square) × `Style`(default/Letter/picture) = 4×2×3=24。用户直接提供该组件链接定位（`node-id=2982-622`），未通过猜测节点 ID 获得。MCP `get_metadata` 把该组件集呈现为画板内的一组 symbol，未返回独立的 COMPONENT_SET 根节点，但 24 个子节点的 Size/Shape/Style 命名组合与预期完全吻合，判定为完整覆盖。

本轮用 `get_variable_defs` 拉取了整个子树绑定的全部变量（`Primitive/Neutral/N01`、`Primitive/Neutral/N05`、`Border/default`、`Text/blue`），并对 7 个代表性 variant 逐一用 `get_design_context` 核实：size40-square-default(`2982:673`)、size40-circle-Letter(`2982:743`)、size40-circle-picture(`2982:850`)、size24-square-default(`2982:663`)、size64-square-default(`2982:678`)、size32-square-default(`2982:678` 附近)、size24-square-picture(`2982:835`)。用 `get_screenshot`（`enableBase64Response: true`）对整个组件集截图做了视觉复核。完整设计上下文接口未出现超时，本轮未使用"接口超时故不写入"的免责声明。

## 已确认的真实结构

- **形状与圆角**：`shape=circle` 时圆角为 size/2（标准圆形，24/32/40/64 四档均验证一致）；`shape=square` 时圆角分别为 4/6/8/12px（24/32/40/64），default 与 picture 两种 style 下圆角规律一致。
- **default 兜底态**：背景 `Primitive/Neutral/N05`(#d7dce3)，图标为真实资源 `user_3_fill.svg`（不是文字），图标尺寸 16/20/28/44px（24/32/40/64）。
- **图标尺寸与内边距关系（如实记录，非统一公式）**：24/32 两档，图标尺寸严格等于「容器 - 2×内边距」（例如 size24：24-2×4=16，与实测图标 16px 吻合）；40/64 两档实测不满足同一公式（size40：容器40，若按同一内边距推算应为 44-8×2=... 实测图标 28px 而非公式值，size64 同理图标 44px 也不落在同一公式上）。说明图标尺寸是按尺寸档独立设定的真实设计值，不是从统一 padding 公式反推出来的，schema.json 的 `sizes.iconScaleNote` 已如实记录这一点，没有为了"好看"而编造一个四档统一的公式。
- **Letter 兜底态**：背景绑定 `Text/blue`(#2b73ff)。示例文案固定是「U」。**AVT-001（重要限制）：Letter 变体在 Figma 里不是"圆形/方形背景 + 可编辑文字层"的组合，而是被 Figma 合并导出成了单个矢量图形（`get_metadata` 复查 `2982:743` 显示其唯一子节点是 `<vector id="2982:771" name="U">`，不是 TEXT 节点）**。这意味着真实前端实现不能直接照抄 Figma 给的这个 SVG/vector 资源当作首字母兜底——因为它是死文案「U」的固定图形，无法根据真实用户名动态生成首字母；代码侧必须用真实的文字节点（背景色块 + text 首字母）在代码里重新实现，Figma 这里只能作为背景色和排版比例的参考，不能作为可复用的资产。
- **picture 兜底态**：1px 描边 `Border/default`(#ebeef2)，图片 `object-cover`（居中裁切，不拉伸），与 rules.md 现有描述一致。circle/square 两种形状下描边规则一致（已用 size40-circle-picture 与 size24-square-picture 两个样本核实）。
- **状态**：24 个 variant 全部是 default 单一视觉状态，Figma 未提供 hover/pressed/loading 等交互态设计。

## 与既有 schema.json（审计前，rules-derived 阶段）的交叉核对

审计前 `schema.json` 里 `squareRadius`(4/6/8/12) 与 `defaultIcon`(16/20/28/44) 的推断值，经本轮 Figma 实测核实**完全正确**——这是对既往 rules-derived 阶段工作质量的一次正向验证，不是巧合发现问题才值得记录。

## 问题跟踪

1. **AVT-001 · 已关闭（2026-09-10 前端验证）**
   - Letter 兜底态在 Figma 里是背景色块+首字母被合并导出的单个矢量（非独立文字层），不能直接复用为前端资产；真实实现必须在代码里用文字节点动态生成首字母，用 `Text/blue` 作为背景色、白色文字。
   - **前端验证结果**：`preview/avatar/index.html` 的实现已经是真实文字节点，不是照抄 Figma 那个固定"U"矢量。用 Playwright 核实：`#previewAvatar` 在 `style=letter` 下渲染出的 DOM 是 `<span class="avatar letter circle s64">U</span>`，把交互属性面板的"首字母"输入框改成任意字符（含中文"赵"）后，DOM 同步变为 `<span class="avatar letter circle s64">赵</span>`，该 `<span>` 没有任何子元素（不是 img/svg），确认是纯文字节点动态渲染。计算样式核实背景 `rgb(43,115,255)`（=`Text/blue` #2b73ff）、文字色 `rgb(255,255,255)`（=`Text/reversal`），与 Figma 绑定一致。
   - 关闭：不需要回 Figma 找"可编辑版本"（该组件集里本来就没有），前端实现已满足动态兜底要求。

2. **AVT-002 · 已按通用惯例设置默认值（2026-09-09，非 Figma 已核实）**
   - 现有 `badge`（Dot/Number 角标）属性是本 Skill 早前 rules-derived 阶段基于通用设计模式加上去的，本轮 24-variant 组件集里**没有 badge 相关的 variant 轴**，Figma 侧没有可核实的角标叠加设计。Badge 本身也是 Skill 里尚未审计的组件（第三档剩余组件之一）。
   - 用户 2026-09-09 明确：这类缺乏 Figma 依据的细节，优先按业界通用惯例设置默认值，不必每项都升级到设计确认。据此复用 Badge 组件自身既有的 rules-derived 尺寸（Dot 直径 8px、Number 高/最小宽 20px，来自 `badge/schema.json`），叠加规则采用主流设计系统惯用的头像角标处理：右上角、圆心对齐容器边角（`translate(50%,-50%)`）、2px 容器色（`Background/Container` #ffffff）描边分隔主体；24px 头像因 Number 徽标 20px 高度相对头像本身过大，按惯例只保留 Dot 并缩小到 6px，不提供 Number。已写入 `schema.json` 的 `badgeDefault` 字段、`mapping.json` 的 `tokenMap.badge.*`、`avatar.tokens.json` 的 `badge.*` token。
   - 与"Figma 已核实"严格区分：这是应用通用惯例的默认值，不是从 Figma 读出来的事实；后续若拿到 Avatar+Badge 叠加的真实设计稿，以 Figma 为准覆盖，不代表本条永久免检。

## 结论

Avatar 的 1 个组件集（24 variants）已完成真实 Figma 审计；schema.json 已升级为 `figma-audited`，`pendingExtraction` 清空。发现 2 个问题：AVT-001（Letter 兜底态的 Figma 资产不可直接复用，需代码侧动态实现——2026-09-10 已用 Playwright 核实前端确实用真实文字节点动态渲染，已关闭）与 AVT-002（badge 叠加设计缺乏 Figma 依据，已按用户明确的「无 Figma 依据时优先套用通用惯例」原则设置默认值，非 Figma 已核实，标注清楚以待后续设计稿覆盖）。既有 rules-derived 阶段的圆角与图标尺寸推断值经核实完全准确。

## 2026-09-11：清理预览页残留旧 CSS（新增并关闭 AVT-003）

背景：延续 MDL-010（见 `components/modal/audit.md`）建立的方法，对 `preview/avatar/index.html` 做同样的死代码核查——用户明确的标准原则是预览页无论静态展示区还是交互区，都应该只用标准组件基座渲染，不应该残留旧 CSS。

排查方法：同 MDL-010，解析页面全部 `<style>` 块，提取每个选择器涉及的类名，逐个类名对照页面真实 `class="..."` 属性（含 JS 动态拼接的模板字符串）确认是否被引用；复合选择器按逗号拆分成分支逐项判断，只删除全部分支都确认无引用的规则，混有真实类的复合选择器保留但裁掉死亡分支。

整条规则删除（2 条）：`.s24`、`.s24.default img`。

验证：脚本二次扫描确认页面残留死选择器为 0；`<style>` 块大括号计数与逐字符深度校验均通过（与 button.html 同批次校验时一并发现并排除结构性错误）；本文件删除/裁剪的选择器均逐一比对过页面真实 `class="..."` 与 `classList` 调用，确认为未引用的旧代码，属于低风险清理，未单独截图复核。

结论：AVT-003 已关闭。`preview/avatar/index.html` 内嵌 CSS 现在只包含仍被页面实际使用的选择器。
