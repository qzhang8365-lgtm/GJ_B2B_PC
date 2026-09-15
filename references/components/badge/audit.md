# Badge audit

来源：`references/components/badge/rules.md`、`schema.json`、已验收预览页 `preview/badge/index.html`，inventory 页面 `Badge✅`。2026-09-09 用户明确：已在组件预览页对照 Figma 原始组件确认呈现无差异，不需要走 Figma `get_design_context` 逐节点核实，按通用徽标组件惯例补齐即可。走 `local-contract` 路径（与 Chart、Icon、Drawer、Skeleton 处理方式一致）。本轮**没有**对 Figma 组件做节点级核实，不得把本文件写成 `figma-audited`。

## 契约范围

- 三种类型：Dot（纯圆点，8px，无文字）、Number（数字徽标，M/S/XS 三档尺寸）、TextCount（依附文字的柔性数量标签）。
- Number 徽标细分单数字（正方形 1:1）与多数字（胶囊形，随位数横向扩展）两种形态，M/S/XS 对应高度 24/20/16px。
- 独立于依附场景之外，还有一套「状态圆点 + 文案」用法（error/brand/warning/success/plain 五种语义色），与 Number 的 red/blue/gray/lightblue 四色变体是两套并存但不同用途的枚举。

## 预览页实测记录（本轮补齐依据）

- `.badge-count`：贴边悬浮态高 20px、最小宽 20px、border 1px solid `Text/reversal`、圆角 999px、默认背景 `Feedback/error-rise`；`.compact` 修饰符（用于 99+/999+ 长数字）把高度降到 16px。
- `.badge-dot`：8×8px、border 1px solid `Text/reversal`、圆角 50%，颜色通过 `--dot` 自定义属性传入，默认取 `Feedback/error-rise`。
- 交互脚本里的「数字徽标完整变体」矩阵实测确认 24 个组合：Size（M/S/XS）× Color（red/blue/gray/lightblue）× Singledigit（true/false），尺寸为 24/20/16px，字体为 中文/S8-CN-R·S9-CN-R·S10-CN-R（14/22、12/18、10/14）。
- 「状态徽标」区块实测确认五种语义色圆点：`--ds-feedback-error-rise`（错误）、`--ds-feedback-brand`（进行中）、`--ds-feedback-warning`（告警）、`--ds-feedback-success-decline`（成功）、`--ds-feedback-plain`（暂停）。
- 「依附对象」区块确认 Badge 可依附图标（贴边悬浮）与文字（Dot 用 `.text-anchor` 微调定位；Count 用 `.text-with-count .soft-count` 改为非贴边的行内胶囊标签，20px 高、水平内边距 8px、灰底）。

## 开放问题

- **BDG-001**：`assets/styles/gj-b2b-components.css` 暂无共享 `.gj-badge*` 组件基座，仅预览页有内联参考实现；与 Drawer 的 DRW-001、Skeleton 的 SKE-001 属于同类差距，不阻断 `local-contract`，留给前端后续提炼共享基座时关闭。
- schema.json 的 `pendingExtraction` 里列的三套 Figma 组件集节点 id、34 变体组合、语义色矩阵，本轮仍未做逐节点核实（用户明确表示不需要），如未来要升级为 `figma-audited`，需要用户另外提供 Figma 链接。

## 结论

Badge 为 `local-contract`：schema / mapping / audit / 组件 Token 已按用户确认、通用徽标惯例与已验收预览页实测值补齐。覆盖看板不再缺 mapping、audit 与组件 Token。

## 2026-09-09：共享 CSS 基座提炼（关闭 BDG-001）

`preview/badge/index.html` 原本内联定义的 `.badge-dot`/`.badge-count`/`.text-anchor`/`.text-with-count`/`.soft-count`/`.status-dot`/`.variant-badge`（+ m/s/xs/single/red/blue/gray/lightblue 修饰符）已提炼为 `assets/styles/gj-b2b-components.css` 的共享类 `.gj-badge-dot`/`.gj-badge-count`/`.gj-badge-text-anchor`/`.gj-badge-text-with-count`/`.gj-badge-soft-count`/`.gj-badge-status-dot`/`.gj-badge`（+ `.gj-badge-m`/`-s`/`-xs`/`-single`/`-red`/`-blue`/`-gray`/`-lightblue`），对应结构与颜色数值同步写成 `assets/styles/gj-b2b-tokens.css` 里的 `--ds-component-badge-*` 变量，与预览页里实测到的原始数值逐条对应，没有引入新数值。

两处命名调整（视觉行为不变，仅为消除跨组件共享文件里的命名冲突风险）：
- 原来的祖先选择器写法 `.compact .badge-count` 改成直接加在元素自身的修饰符类 `.gj-badge-count.is-compact`。
- 状态圆点的颜色透传变量从预览页原来的通用名 `--dot` 改成组件专属的 `--gj-badge-status-color`（Dot 用法的颜色透传变量则用 `--gj-badge-dot-color`）。

`preview/badge/index.html` 的 `<style>` 块已删除对应的重复规则，标签配平（div 33/33、span 58/58、article 7/7 等）与内联脚本 `node --check` 均已验证通过。`mapping.json`/`badge.tokens.json` 已同步更新 `implementation.status` 为 `shared-css-base` 并补全缺失的 `cssVariable` 字段；`badge.tokens.json` 的 `openItems.BDG-001` 已清空。

## 结论

Badge 仍为 `local-contract`（未做 Figma 节点级审计，这一点不受本次改动影响），但前端实现层面不再有"仅预览页内联参考实现"的缺口——BDG-001 已解决。

## 2026-09-10：Figma 母版审计

页 `2963:11876`：**3 套 / 34 variants**，与 inventory 一致。

- `Badge_dot` 默认 red，8×8，无描边；五色绑定 Feedback/error&rise、brand、warning、success&decline、plain。
- `Badge_count` 默认 M/red/多数字；圆角字面 12/10/12，不是 Radius-full；无白边。lightblue 底 `Background/BG_blue`。
- `Badge_status` 默认 Error：圆点实例 + `中文/S8-CN-R` `Text/Primary`，gap 8。不是灰底胶囊。预览 `.gj-badge-soft-count` 不是母版，CSS 改用语义色字面尺寸，不写入组件 Token。

## 结论

Badge 升级为 `figma-audited`。

## 2026-09-15：规范页结构与视觉节奏优化

- 规范页接入统一 `component-docs.css` 迁移层，章节改为纵向平铺，移除旧的左右信息竞争。
- 首轮曾新增「组成结构」，复核后确认 Badge 属于结构直观的原子组件，该板块已删除，首屏直接进入基础用法。
- 继续复用共享 `.gj-badge*` 基座；完整变体、状态徽标、尺寸表与实时属性控制均保留。
- 使用规则由六张零散卡片收束为“主题／推荐做法／边界与避免”三列表格，补充 Badge 与 Tag 的边界、数量封顶和依附位置约束。

结论：本次仅优化规范页信息架构与展示节奏，未改变 Badge 的 Figma 审计结论或运行时契约。

## 2026-09-15：示例矩阵对齐修正

基础用法、数字封顶与依附对象原为内容宽度 Flex 排列，在宽展示面上全部挤在左侧。现按实际示例数量使用 2/3/4 列等宽 Grid，每个示例在自己的列中居中并保持统一最小展示高度；状态徽标同步使用五列等宽矩阵。820px 以下回落两列，520px 以下回落单列，避免通过放大不稳定间距填充页面。
