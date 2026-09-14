# Timeline audit

来源：`references/components/timeline/rules.md`、`schema.json`、已验收预览页 `preview/timeline/index.html`，inventory 页面 `Timeline✅`。2026-09-09 用户明确：已在组件预览页对照 Figma 原始组件确认呈现无差异，不需要走 Figma `get_design_context` 逐节点核实，按通用时间轴组件惯例补齐即可。走 `local-contract` 路径（与 Chart、Icon、Drawer、Skeleton、Badge 处理方式一致）。本轮**没有**对 Figma 组件做节点级核实，不得把本文件写成 `figma-audited`。

## 契约范围

- 方向 Vertical/Horizontal，节点样式 Dot/Checkmark，状态 finished/wait；finished 节点必须连续，wait 不夹在中间。
- 纵向：节点容器 20px 宽，圆点 10px 或勾选图标 16px；标题 14/22/600，说明 12/18；wait 态标题说明统一降级为 Text/tertiary。
- 横向：整体宽 684px（示例值，随容器收缩），左右各 32px 翻页箭头，单项 155px 宽；连接线与节点默认灰色，finished 后变蓝。

## 预览页实测记录（本轮补齐依据）

- 纵向连接线用 1px dashed `Border/secondary`，通过 `.v-head` 的 `:before`/`:after` 伪元素实现，首项自动隐藏上半段、末项自动隐藏下半段，不需要额外的“首尾特殊态”属性。
- 纵向 Checkmark 节点（`.v-check`）16×16px，本会话早前已按用户报告从手绘 SVG 改为组件库真实图标 `icf_system_check-circle-fill.svg`；圆点节点（`.v-dot`）10×10px。两者的 finished/wait 颜色都是 `Text/blue`/`Text/disable`。
- 横向左右箭头（`.arrow`）本会话早前已按用户报告从裸文字 `‹`/`›` 改为组件库真实图标（`icf_Arrow_left.svg`/`icf_Arrow_right.svg`，对应 iconfont 码点 `\f067`/`\f063`），复用 `.gj-icon-button` 32×32 基座，并与轴线对称对齐；本文件记录的是修正后的实现状态。
- 横向说明文字实测字号是 14/22（颜色 `Text/tertiary`），与纵向说明的 12/18 不同——如实记录为两种密度各自的真实值，未强行统一，列为 `TML-002`。
- 横向轨道（`.h-track`）连接线 2px 高、节点 8px 圆形，默认 `Border/secondary`/`Text/disable`，`finished` 态两者都切换为 `Text/blue`。

## 开放问题

- **TML-001**：`assets/styles/gj-b2b-components.css` 暂无共享 `.gj-timeline*` 组件基座，仅预览页有内联参考实现；与 Badge 的 BDG-001、Skeleton 的 SKE-001 属于同类差距，不阻断 `local-contract`。
- **TML-002**：横向说明文字字号（14/22）与纵向说明文字字号（12/18）不一致，是否应统一由设计侧决定，本轮如实记录两套真实值，未替业务做归一化假设。
- schema.json 的 `pendingExtraction` 里列的六套 Figma 组件集节点 id、32 变体组合、连接线 token 绑定，本轮仍未做逐节点核实（用户明确表示不需要），如未来要升级为 `figma-audited`，需要用户另外提供 Figma 链接。

## 结论

Timeline 为 `local-contract`：schema / mapping / audit / 组件 Token 已按用户确认、通用时间轴组件惯例与已验收预览页实测值补齐，箭头与勾选图标已是本会话修正后的真实组件库图标实现。覆盖看板不再缺 mapping、audit 与组件 Token。

## 2026-09-09：共享 CSS 基座提炼（关闭 TML-001）

`preview/timeline/index.html` 原本内联定义的纵向（`.timeline-v`/`.timeline-v-item`/`.v-head`/`.v-dot`/`.v-check`/`.v-copy`）与横向（`.timeline-h-shell`/`.arrow`/`.timeline-h-viewport`/`.timeline-h`/`.timeline-h-item`/`.h-track`）时间轴样式，已提炼为 `assets/styles/gj-b2b-components.css` 的共享类 `.gj-timeline-v`/`.gj-timeline-v-item`/`.gj-timeline-v-head`/`.gj-timeline-v-dot`/`.gj-timeline-v-check`/`.gj-timeline-v-copy`/`.gj-timeline-h-shell`/`.gj-timeline-arrow`/`.gj-timeline-h-viewport`/`.gj-timeline-h`/`.gj-timeline-h-item`/`.gj-timeline-h-track`，对应数值同步写成 `assets/styles/gj-b2b-tokens.css` 里的 `--ds-component-timeline-*` 变量，逐条对应预览页实测到的原始数值，未引入新数值。横向翻页按钮维持组合 `.gj-icon-button` 共享基座的方式，未重复造轮子。

命名调整（视觉行为不变）：`.wait`/`.finished` 状态修饰符按项目 `is-` 前缀惯例改为 `.is-wait`/`.is-finished`。

`preview/timeline/index.html` 的两个 `<style>` 块均已删除对应重复规则（含页面级 `.timeline-h-shell{align-items:start!important}` 覆盖也同步改名保留），标签配平（div 45/45、span 10/10、button 5/5 等）与内联脚本 `node --check` 均已验证通过。`mapping.json`/`timeline.tokens.json` 已同步更新 `implementation.status` 为 `shared-css-base` 并订正/补全 `cssVariable` 字段；`timeline.tokens.json` 的 `openItems.TML-001` 已移除，`TML-002`（横纵向说明文字字号不一致，属于设计决策问题而非提炼范畴）保留不变。

## 结论

Timeline 仍为 `local-contract`（未做 Figma 节点级审计，不受本次改动影响），但前端实现层面不再有"仅预览页内联参考实现"的缺口——TML-001 已解决。

## 2026-09-10：Figma 母版审计（关闭 TML-002）

页 `3655:7446`：**6 套 / 32 variants / 1 standalone**（`Timeline_horizontal` `3666:3072` 宽 676）。

- 标题 Text Style 为 `中文/S5-CN-S` + `Text/Primary`；纵向说明 `中文/S9-CN-R` + `Text/Secondary`；横向 cell 说明 `中文/S8-CN-R` + `Text/Tertiary`。两套密度是母版事实。
- 连接线 `Border/hover` 虚线，不是 Border/secondary。
- 圆点 finished `Brand/GJ_Blue`，勾选 `Feedback/brand`，waiting `Text/disable`。Waiting 不改标题/说明颜色。
- 横向轨道 waiting `Text/disable`，finished `Text/blue`。

## 结论

Timeline 升级为 `figma-audited`。TML-002 关闭。
