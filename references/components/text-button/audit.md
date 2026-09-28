# Text_button Figma 审计

来源：Figma `3959:3750`，只读检查。组件集包含 36 个 Variant，完整覆盖 `3 Size × 4 State × 3 Icon`。

## 结构确认

- 所有 Variant 的四向 padding 均为 0；
- 组件容器没有 fill 和 stroke；
- 图标与文字的真实间距均为 4px；
- Large / Medium / Small 高度分别由文字行高形成：24 / 22 / 18px；
- 图标尺寸分别为 20 / 16 / 12px；
- 图标统一引用 `Directional/icon_caret_right`，支持 Instance Swap；
- 当前没有 Prototype Reaction；2026-09-10 用户确认暂不需要补 Hover/Pressed/Disabled 原型连接（TXT-006 已关闭）。状态 Variant 与代码交互仍保留。

## 应修复

1. **颜色变量仍引用旧/外部变量库**
   - 36 个文字节点分别引用外部集合中的 `Text/Secondary`、`Text/Primary`、`Text/blue`、`Text/disable`。
   - 名称虽与当前语义变量一致，但 collectionId 不是当前本地 `GJ_B2B`。
   - 建议全部改绑当前正式变量，避免库迁移或发布关系变化后失效。

2. **Text Style 仍使用旧命名体系**
   - Large：`Body_16px_regular`；
   - Medium：`Body_14px_regular`；
   - Small：`Body_12px_regular`。
   - 建议分别改绑当前 `中文/S7-CN-R`、`中文/S8-CN-R`、`中文/S9-CN-R`。

3. **内部 4px 图标间距未绑定变量**
   - 24 个带图标 Variant 的嵌套 Frame 使用直接数值 4px。
   - 建议绑定 `Interval/space2`。

4. **组件集 description 为空 · 已关闭（2026-09-10，比照 BTN-003 处理方式）**
   - 只在本地补充，不写入 Figma：`schema.json` 的 `behavior.paddingRule`（"Must remain zero in every size and state."）已覆盖零内边距特性；`usageScenarios` 字段（2026-09-10 随 TXT-006 一起补充）覆盖适用场景；本文件「建议优化」第 3 条（点击热区应通过外层布局/伪元素扩展，不得靠增加可见 padding）覆盖点击热区边界。三项均已有本地文档承接，Figma 组件集 description 本身保持为空，不视为缺陷。

## 建议优化

1. Figma 属性名混用大小写：`size/state/icon` 为小写，取值 `Large`、`Left_Icon` 等为首字母大写或下划线格式。建议后续统一命名规范。
2. 外层带图标 Variant 的 `itemSpacing` 存在 0/4 差异，但外层实际只有一个嵌套 Frame，不影响视觉。可统一为 0，避免开发读取时产生歧义。
3. 纯文字按钮的可见高度较小，前端如需满足最小点击热区，应通过外层布局或伪元素扩展命中区域，不得增加可见 padding 或改变容器排版高度。

## 已确认决策

- **TXT-006 · 已关闭（2026-09-10）**：当前不需要为 TextButton 补充 Hover / Pressed / Disabled 的 Figma Prototype Reaction。缺少原型连线不属于组件缺陷，也不影响 `default / hover / pressed / disabled` 四态作为正式状态契约；运行时仍必须实现对应反馈。

## 状态颜色（按当前 Figma 真值）

- Default：`Text/Secondary`
- Hover：`Text/Primary`
- Pressed：`Text/blue`
- Disabled：`Text/disable`

代码预览严格按以上状态实现，不自行改成传统链接按钮的蓝色默认态。

（2026-09-28 更新：业务明确要求新增一个并存的蓝色默认态变体 `gj-text-btn-blue` 后，上述限制收窄为“不得把标准 `gj-text-btn` 的默认态私自改成蓝色”；新增的 `gj-text-btn-blue` 是显式声明的独立变体，不是对默认契约的更改，两者并存。详见 `rules.md`「Text Button 颜色变体」与本文件下方「2026-09-28：新增 Blue 颜色变体」。）

## 复查更新（2026-09-10 · TXT-002 已关闭）

用户在 Figma 侧手动把 Large/Medium/Small 的 Text Style 绑定从旧命名体系改绑为当前语义样式。本轮用 `get_design_context` 对 3 个尺寸各取 1 个代表节点（`state=default, icon=None`）复查："styles contained in design" 返回：

| Size | 节点 | 当前绑定 |
|---|---|---|
| Large | `3959:3751` | `中文/S7-CN-R`（Regular 16/24） |
| Medium | `3959:3791` | `中文/S8-CN-R`（Regular 14/22） |
| Small | `3959:3831` | `中文/S9-CN-R`（Regular 12/18） |

不再出现旧的 `Body_16px_regular`/`Body_14px_regular`/`Body_12px_regular`，与本地 `schema.json` 里 `sizes.*.textStyle` 早先按目标契约填的 S7/S8/S9-CN-R 一致。TXT-002 关闭。未逐一核对全部 36 个 variant（3 Size × 4 State × 3 Icon），但 Text Style 绑定在同一 Size 下不随 State/Icon 变化（文字节点是共享子结构），按已核实的 3 个尺寸样本判定为全量生效。

**顺带发现（非 TXT-002 范围，未建 issue，仅记录）**：Small 变体容器的圆角写作 `var(--圆角/md, 6px)`（绑定了 token），而 Large/Medium 容器圆角是裸值 `8px`（未绑定 token）。三者容器均无 fill/stroke，圆角在视觉上不生效，暂不影响实现，仅记录供后续统一处理时参考。

## 2026-09-10：补充「Text Button 适用场景」

用户提供了一份关于纯文字按钮 / 文字+图标无外框按钮的完整使用场景说明（次要操作、低风险可逆操作、密集列表/表格行内操作、工具栏、导航跳转类、空间受限场景，以及不适用场景和纯文字 vs 文字+图标的选择原则）。这不是 Figma 审计发现，是设计侧补充的使用指导，已整理进 `rules.md` 的「Text Button 适用场景」小节，并在 `schema.json` 新增 `usageScenarios` 字段做结构化记录。

顺带在 `button/rules.md` 的 Ghost 级别说明后补了一句澄清：通用 UI 语境里「Ghost Button」常被泛指为这一类无外框按钮，但本 Skill 里 Button 的 Ghost 级别（保留容器高度/内边距）与独立的 Text Button（零内边距）是两个不同组件，避免后续照搬通用素材时把两者混为一谈。

## 2026-09-28：新增 Blue 颜色变体（业务需求，非 Figma 审计发现）

业务方（呼叫中心录音查询页表格行内操作）提出希望表格操作按钮默认就是蓝色。核对 Figma 节点 `2946:6671`（表格「文字操作」示例）确认其绑定的是 `Text/blue`，同时对照本文件已确认的 2026-09-10 状态色契约（Pressed 才是 `Text/blue`，Default 是 `Text/Secondary`）——两者存在冲突。与用户确认后，结论不是把标准 Text Button 的默认态改成蓝色，而是新增一个并存的蓝色默认态变体，两个变体都保留：

- 标准变体（`gj-text-btn`）：Default 灰色，契约不变，继续是全局默认。
- 新增变体（`gj-text-btn` + `gj-text-btn-blue`）：Default 直接用 `Text/blue`（`--ds-primitive-blue-b06`），Hover/Pressed 顺着蓝色主色阶继续加深（`-b07`/`-b08`），Disabled 复用统一的 `Text/disable`，不单独定义蓝色禁用态。

本次未在 Figma 侧新增对应的 Variant/组件集条目（只读访问，无法写入），本地 `schema.json`/`rules.md`/`gj-b2b-components.css`/`gj-b2b-tokens.css` 先落地代码实现；后续如需要在 Figma 组件库里正式补一个 Blue 变体，需要设计师在 Figma 侧新建，再由本 Skill 回读核实。

用户进一步确认：这条规则属于表格通用，不是只针对录音查询这一个页面——凡是表格行内可点击的操作控件（含表格内嵌的详情/弹窗子表格）都按同一套逻辑处理。据此已同步把 Blue 变体应用到录音查询页主表格的“听录音/下载”和音频详情弹窗子表格的文件名/下载按钮，并顺手把 `preview/table/index.html`「文字操作」示例（此前发现和真实组件不一致的那处手绘 CSS）改成直接复用真实的 `gj-text-btn`，同时新增一行展示 Blue 变体，两者并列对比。
