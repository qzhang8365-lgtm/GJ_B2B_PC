# Tabs audit

审计日期：2026-09-10。只读来源：Figma 页面 `2638:1005`、说明节点 `3029:811`。

## 结论

- 已逐一读取 10 个组件集的节点结构、默认属性、代表性状态变量与 Text Style，并同步到 schema、mapping、component tokens 和共享 CSS 基座。
- 当前 Figma 实收 **10 个组件集、172 个 variants、0 个独立组件**。旧清单的 178 比逐节点计数多 6；本次按源文件实际结构更正。
- 说明画板推荐 Highlight、Card、Pill；Button 和 Left 仍是正式组件集，不因未列入推荐类型而删除。
- Figma 属性曾存在 `Size/size`、`Status/State`、`Small/small`、`Medium/medium/middle`、`hoverd` 等命名差异；2026-09-10 设计确认已在 Figma 侧统一修正（见下方「关闭 TAB-001」），mapping 仍对代码 API 归一为稳定值，并保留历史兼容 key。

## 组件集与数量

| 类型 | Item 节点 / variants | Group 节点 / variants | 默认组合 |
|---|---:|---:|---|
| Highlight | `2723:2808` / 36 | `2759:1582` / 15 | item: medium + active；group: 2 + middle |
| Card | `2787:1924` / 18 | `2836:1495` / 30 | item: Medium + Default + no close；group: 2 + middle + no close |
| Pill | `3025:1365` / 12 | `3025:1392` / 15 | item: Medium + Default；group: Default(=2) + Medium |
| Button | `3169:8454` / 12 | `3169:8535` / 15 | item: Medium + Default；group: 2 + Medium |
| Left | `2859:1645` / 12 | `2864:1707` / 7 | item: medium + Default；group: 2 |

合计：Item 90 + Group 82 = **172 variants**。页面上的 `Badge/Count` (`2723:2842`) 是 Highlight 的依赖组件，不计入 Tabs 组件集。

## 变量与 Text Style 核对

- Highlight：默认 `Text/Secondary + 中文/S8-CN-R`，Hover `Text/blue + S8`，Active `Text/blue + 中文/S5-CN-S`，Disabled `Text/disable + S8`；Small 使用 S9/S6，Large 使用 S7/S4。下划线 2px，item gap 24px，icon 16px，内容 gap 8px。
- Highlight Badge：20px 高、水平内边距 8px、`中文/S9-CN-R`；默认 `Background/Secondary + Text/Secondary`，Active `Background/BG_blue + Feedback/brand`，Disabled 以整 Badge 50% opacity 表达。
- Card：默认与 Hover 都保持 `Background/Background`，Hover 仅文字改 `Text/blue`；Active 为 `Button/Primary/Bg-default + Text/reversal`。Small/Medium 文字 14/22，Large 16/24；Close icon 14px，内容 gap 4px。
- Pill：默认透明 + Secondary；Hover 为 `Background/Background + Secondary`；Active 为 `Background/Container + Text/Primary + shadow_small`；Disabled 为 Text/disable。Small/Medium 14/22，Large 16/24。
- Button：默认透明 + Secondary；Hover 为 `Background/Background + Text/Primary`；Active 为 `Background/Container + Text/Primary + shadow_small`；Disabled为 Text/disable。Small/Medium 14/22，Large 16/24。
- Left item：默认/悬停/激活/禁用均为 `Background/Container`；Hover 与 Active 为 Text/blue，Disabled 为 Text/disable。组合根右边框使用 Border/default。

### Figma 绑定完整性

- 状态颜色：代表性 Default/Hover/Active/Disabled 节点均读到语义颜色变量；未用近似 HEX 代替。
- Text Style：五类三档尺寸均读到正式 `中文/S4–S9` Text Styles；Left 组合的嵌套 Active 覆盖也单独核实。
- Effect：Pill/Button Active 读到 `shadow_small`；默认组合根未读到 `Innershadow_small`，因此本地只把内阴影作为显式可选效果。
- 几何变量：Pill item 的 Small/Medium 高度明确读到 `Components/control-S` / `Components/control-M`；修复后的 Button item Small 高度也已绑定 `Components/control-s`（24px）。其余高度、24/8/4px gap、水平内边距、2px 指示器、圆角等仍由当前 Figma 节点返回为字面值。
- 设计确认：Tabs 中尚未绑定 Dimension Token 的 Figma 字面几何值当前可正式保留，暂不要求回绑。代码侧仍统一收敛到 `tabs.tokens.json`，避免业务页面重复写入散值；不得把本地 token 化描述成 Figma 已完成变量绑定。

## 组合实例一致性

- `Tabs_Button/Small` 已于 2026-09-10 修复并复核：组合实例与独立 `Button_item/Small` 均为 24px，原 24/28px 差异已消除；共享基座直接使用 Button Small 标准高度，不再保留组合专属覆盖。
- `3.Tabs-left` 的 Figma 来源只提供 Medium 组合：宽 80px、item 高 40px；2026-09-10 曾确认 Active 为 `中文/S4-CN-S`。该来源值在真实四字标签下暴露可用宽度不足，已由 2026-09-11 的 TAB-006 本地契约修正覆盖。

## 本地基座修正

- 修正 Highlight icon 14→16、Badge 16/10px→20/12px 及 Active 配色。
- 修正 Card Hover：不再用 Border/default 灰底，改为原背景 + 蓝字。
- 修正 Pill/Button Hover 的不同背景与文字状态；默认容器不强制内阴影，`gj-tabs-inset` 作为明确需求下的可选效果。
- Left Hover 不再填充灰底；TAB-006 进一步将代码基座宽度修正为 96px，并让 Active 保持 Default 字号/行高，仅使用蓝色与 600 字重。
- 所有尺寸、间距、圆角、状态色和阴影均通过 Tabs component token 或共享语义/字体 Token 引用。

## 仍需设计源文件处理


- TAB-003 已关闭：设计确认多数几何字面值当前无需绑定 Dimension Token；代码侧继续使用组件 Token 管理。
- TAB-004 的 Figma 一致性复核已关闭：Button Small 为 24px，Left 来源实例曾统一为 S4-CN-S；Left 在代码基座中的最终生成规则由后续 TAB-006 覆盖。
- Card 母版没有 Disabled variant；代码侧可提供不可交互保护，但不得冒充为已存在的 Figma 视觉 variant。
- Card 顶部使用场景继续用 `gj-tabs-card-top` 区分点击高度与布局占位，不缩小 Tab 点击区域。

## 2026-09-10：关闭 TAB-001（Figma 属性命名统一）

设计确认 Figma 侧已完成命名统一，复查节点 `2638:1005` 整页逐个组件集核实：

- **Tabs_item/Highlight-item**（`2723:2808`）：`hoverd` 拼写错误已改为 `hover`；Size 大小写（Small/Medium/Large）本就一致。
- **1.Tabs-Highlight**（`2759:1582`）：Size 由 `middle` 改为 `Medium`，与 Small/Large 大小写统一。
- **Tabs_item/Card_item**（`2787:1924`）：`Size`/`State` 属性名及取值本就规范（本轮复查确认）。
- **2.Tabs_Card**（`2836:1495`）：Size 由 `middle`（一度改为 `Middle`，非目标词）最终统一为 `Medium`；`closebutton`（无空格）改为 `close button`（有空格），与 item 层一致。
- **Tabs_item/Pill_item / Button_item / left-item**：`Size`/`State` 命名本轮复查均已规范，无需改动。

同步范围：
- `references/components/tabs/schema.json`：7 个组件集的 `figmaDefaults`/`properties` 按最新 Figma 命名更新（`hoverd`→`hover`，各处 `Size`/`State` 统一大写属性名，取值统一 `Small/Medium/Large`），并在受影响节点补充说明。
- `references/components/tabs/mapping.json`：`figmaToContract` 补充 `hover=true` 作为主映射，`hoverd`/`middle`/`closebutton` 保留为历史兼容 key（应对旧缓存或未刷新的本地副本）。
- 未涉及 CSS、Token 或 preview 页面 —— 这些实现层此前就是通过 mapping 归一化后的稳定值（`size=medium`/`interactionState=hover`），从未直接使用过 Figma 原始属性名，因此本次修正不影响任何已渲染的视觉或代码。

## 2026-09-11：清理预览页残留旧 CSS（新增并关闭 TAB-005）

背景：延续 MDL-010（见 `components/modal/audit.md`）建立的方法，对 `preview/tabs/index.html` 做同样的死代码核查——用户明确的标准原则是预览页无论静态展示区还是交互区，都应该只用标准组件基座渲染，不应该残留旧 CSS。

排查方法：同 MDL-010，解析页面全部 `<style>` 块，提取每个选择器涉及的类名，逐个类名对照页面真实 `class="..."` 属性（含 JS 动态拼接的模板字符串）确认是否被引用；复合选择器按逗号拆分成分支逐项判断，只删除全部分支都确认无引用的规则，混有真实类的复合选择器保留但裁掉死亡分支。

整条规则删除（1 条）：`.code`。

验证：脚本二次扫描确认页面残留死选择器为 0；`<style>` 块大括号计数与逐字符深度校验均通过（与 button.html 同批次校验时一并发现并排除结构性错误）；本文件删除/裁剪的选择器均逐一比对过页面真实 `class="..."` 与 `classList` 调用，确认为未引用的旧代码，属于低风险清理，未单独截图复核。

结论：TAB-005 已关闭。`preview/tabs/index.html` 内嵌 CSS 现在只包含仍被页面实际使用的选择器。

## 2026-09-11：`.gj-tabs-left` 组合 Active 字号溢出修复（新增并关闭 TAB-006）

背景：用户在预览页看到 Left Tab 组合基座里，选中项「联系方式」的文字超出了容器右侧边缘，并明确指出选中态字号不应该变化，只应该变蓝加粗。

排查：`.gj-tabs-left` 的 Figma 来源宽度为 80px，左右各 16px 内边距后理论可用文字宽度只有 48px。此前 Active 又被通用 `.gj-tab-active` / S4 指标放大至 16/24/600，四字中文标签会压线或越过右侧边缘。即使恢复 Default 的 14px，80px 也无法同时保留左右 16px 内边距和舒适的四字标签宽度。

决策：用户确认 Active 状态只变颜色（`Text/blue`）和 600 字重，字号、行高保持与 Default 完全一致。为保证正常四字标签不被省略，同时保留 16px 左右内边距，代码基座宽度使用 4px 梯度中的 96px；超长标签才进入单行省略。这是对 Figma 80px 来源规格的显式本地修正，不冒充源文件已同步。

实现：`left.group-width` Token 调整为 96px；`.gj-tabs-left .gj-tab-active` 显式复用当前尺寸 Default 的 `font-family`、`font-size` 与 `line-height`，只改变指示条、颜色和字重。这里必须显式声明字号指标，不能只删除 Left 原有的 S4 覆盖，否则更前面的通用 `.gj-tab-active` 仍会把字号改大。Active 的左内边距使用“默认内边距减去指示条宽度”，抵消 2px 左边框造成的文字右移。Small/Medium 使用 S8 的 14/22 指标，Large 使用 S7 的 16/24 指标；标签文本保留单行省略作为超长内容保护。

验证：以真实共享 CSS 重新渲染规范页；要求四字标签完整显示，Active 与 Default 字号一致，且文字右边缘不越过组合边界。缓存版本同步提升，避免浏览器继续读取旧基座。

结论：TAB-006 已关闭。`.gj-tabs-left` 组合 Active 与其余四种 Tabs 类型统一为「变色+加粗、字号不变」的实现方式；独立 Left-item 的 Figma 完整字号契约不受影响。
