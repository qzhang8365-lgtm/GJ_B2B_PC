# Toast Figma 审计

来源：用户提供画板 `2638:3208`（轻提示Toast✅），2026-09-09 只读检查。未修改 Figma。官方 MCP `get_design_context` / `get_variable_defs` / `get_metadata` 读取；文档区 `3586:40` 一并核对。

inventory 该页原记 **3 套 / 13 variants / standalone 0**，画板可见 symbol **12**（Float 5 + Transparent 5 + Black 2）；2026-09-10 复查确认旧值 13 有误，正确数量为 3 套/12，见 TST-001（已关闭）。同日再次读取页面 metadata，已返回三套组件的根容器 ID：`3107:2600`、`3107:2688`、`3112:2995`，TST-004 已关闭。

## 已确认的组件集

### Toast_float（组件集根容器 `3107:2600`，5 variants）

样本：info `3107:2599`、success `3107:2597`、error `3107:2596`、warning `3107:2598`、loading `3107:2595`。

共用：宽 **365**、高按 **48** 实现（部分 variant 画板 47.90）、`px 16 / py 12`、`gap 12`、圆角 **8**、`Background/Container`、`Border/default`、效果 **`shadow-center`**（0 0 15 `Background/MK_10`）、文案 `中文/S8-CN-R` / `Text/Primary`、关闭 16px `icf_system_close` / `Background/MK_30`。生成代码有 BOOLEAN `closeButton`，画板样本均为 true。

| type | 状态图标 | 图标色 |
|---|---|---|
| info | `icf_system_warning-fill` 24 | `Feedback/brand` |
| success | `icf_system_check-circle-fill` 24 | `Feedback/success&decline` |
| error | `icf_system_close-circle-fill` 24 | `Feedback/error&rise` |
| warning | `icf_system_alert-fill` 24 | `Feedback/warning` |
| loading | `icf_system_loading` 24 | **`Brand/GJ_Blue`**（不是 Feedback/brand） |

### Toast_transparent（组件集根容器 `3107:2688`，5 variants）

布局与 Float 相同，**无投影**。info/success/error/warning 换语义浅底 + 15% 描边：

| type | 背景 | 描边 |
|---|---|---|
| info | `Background/BG_blue` | `Background/BT_B15` |
| success | `Background/BG_green` | `Background/BT_G15` |
| error | `Background/BG_red` | `Background/BT_R15` |
| warning | `Background/BG_orange` | `Background/BT_O15` |
| loading | **`Background/Container`** | **`Border/default`** |

Transparent loading 维持 Container + Border/default，不加语义浅底（TST-002 已关闭）。

### Toast_black（组件集根容器 `3112:2995`，2 variants）

- `icon=true` `3112:2994`：106×46，16px `icf_system_info` +「已提交」
- `icon=false` `3112:3008`：82×46，仅文字
- `Background/MK_80`、`Text/reversal`、`中文/S8-CN-R`
- 水平 `Interval/space6` **20px**，垂直 **12px**（生成代码绑到 `Radius/Radius-LG`），`gap 8`，圆角 `Radius/Radius-LG` **12**
- 无 status 轴，无关闭入口

## 文档区已核对（`3586:40`）

- 位置：文档区只写「PC 顶部居中，距顶或固定导航下缘 **24px**」，未按外观区分。2026-09-09 设计确认 **Black 改为底部居中 24px**（TST-005）
- 时长：Success 2–3s；Info 3s；Warning/Error 4–5s；Loading 不自动消失
- 堆叠：最多 3 条、间距 12px；同类优先更新或合并
- 关闭：短成功可隐藏；长时、警告、错误建议保留
- Loading 原位替换为 Success/Error，不叠新结果条
- 文案：对象 + 结果/状态；单句可扫；错误含对象；Loading 用进行时
- 无障碍：Info/Success/Loading 用 `status` + `polite`；仅紧急 Error 用 `alert`；悬停/聚焦暂停计时；关闭名称「关闭提示」；支持减少动态
- 边界：决策 → Modal；持久/多动作 → Notification；锚定解释 → Tooltip/Popover；字段校验 → 就地错误

## 相对旧 rules-derived / 共享 CSS 的核对

1. 尺寸 365×48 / Black 46、12×16 与 12×20、圆角 8/12、行为时长与堆叠，与旧 rules 一致。
2. 共享 `.gj-toast` 曾是底部固定、单一 `MK_80` 黑条，**不是** Figma 三套外观。现为视觉基座 + `.gj-toast-fixed`：Float/Transparent 顶部，Black 底部。
3. 规范页本地 `.toast` 已接近 Figma，但 Loading 图标曾用 `Text/Primary`；Figma 是 **`Brand/GJ_Blue`**。
4. Float 投影是 **`shadow-center` 15px**，不是 `0 8 20`。
5. Info 图标是 **`warning-fill`**，不是 `info-fill`（Black 才用 `icf_system_info`）。

## 开放问题

1. **TST-001 · P3 · 已关闭（2026-09-10）** — 页面 inventory 旧值 3/13/0 有误，复查确认正确数量为 3/12/0（Float 5 + Transparent 5 + Black 2）；inventory.json 与 schema 已更新。
2. **TST-002 · P3 · 已关闭（2026-09-10 设计确认）** — Transparent `loading` 已改回，且不补语义浅底。loading 语义中性，继续用 Container + Border/default。已核 `3107:2705`：`Background/Container`、`Border/default`、图标 `Brand/GJ_Blue`。
3. **TST-003 · 已关闭（2026-09-10 设计确认）** — Float/Transparent 的 info 使用 `icf_system_warning-fill`，与 Black 的 `icf_system_info` 不是同一枚图标。设计确认：两套外观本就使用不同图标语义，保持现状，不需要统一。
4. **TST-004 · P3 · 已关闭（2026-09-10）** — 页面 metadata 已返回 `Toast_float` `3107:2600`、`Toast_transparent` `3107:2688`、`Toast_black` `3112:2995` 三个集合根容器。schema 与 Token 以 `3107:2600` 为主 `figmaNode`，`2638:3208` 仅保留为页面锚点。
5. **TST-005 · P2 · 已关闭** — 文档区未区分 Black 位置。2026-09-09 设计确认：Black 视口叠加默认底部居中 24px；Float / Transparent 仍顶部居中。

## 结论

Toast 为 `figma-audited`。三套外观、五态图标与色、Black 两态、文档区行为/文案/无障碍已抽样核实。Black 底部定位按 TST-005 写入规范，不是画板实测。Transparent loading 按 TST-002 维持中性底，不加语义浅底。三个集合根容器已按 TST-004 写入 schema 与 Token，组件 Token 已接入构建；不回写非空 `pendingExtraction`。

## 2026-09-10：关闭 TST-002

用户确认：刚才删除的 loading 态已改回，不需要为 Transparent loading 加语义浅底。

- `Toast_transparent` `3107:2688`：1 套 / 5 variants，含 `type=loading` `3107:2705`。
- loading 绑定仍是 `Background/Container` + `Border/default` + 图标 `Brand/GJ_Blue`。
- 实现保持 `.gj-toast-transparent.gj-toast-loading` 白底默认描边，不改成 BG_blue 一类浅底。

## 2026-09-10：关闭 TST-003

用户确认：Float/Transparent 的 info 图标（`icf_system_warning-fill`）与 Black 的 info 图标（`icf_system_info`）保持现状，不需要统一——两套外观本就使用不同图标语义。

无需改动 `mapping.json` 的 `assetMap`（`info`/`black.icon` 两条已经各自正确记录对应图标），也无需改动实现，纯粹是设计决策确认。

## 2026-09-10：关闭 TST-001（inventory 数量确认为 3/12）

复查节点 `2638:3208` 整页（轻提示Toast✅），确认页面内 3 个 frame：

- `Toast_float`（`3107:2600`）：5 个 symbol（info/success/error/warning/loading）
- `Toast_transparent`（`3107:2688`）：5 个 symbol（info/success/error/warning/loading）
- `Toast_black`（`3112:2995`）：2 个 symbol（icon=true/icon=false）

合计 3 套 / 12 symbol，与画板逐一实测一致；inventory.json 原记 3 套/13 variants 有误。

同步：
- `references/components/inventory.json`：`Toast✅` 条目 `variants` 由 13 改为 12，并附说明注记。
- `references/components/toast/schema.json`：`figma.inventoryListed` 同步为 `{sets:3, variants:12, standalone:0}`；`knownFigmaIssues` 移除 `TST-001`；`confirmedDecisions` 追加记录。
- 未涉及组件实现、CSS 或 Token，仅数量记录修正。
