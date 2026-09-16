# Steps Figma 审计

来源：用户提供画板 `4465:8293`（步骤条Steps），2026-09-08 只读检查。未修改 Figma。inventory 页名仍是 `Steps✅`；旧值记 9 套 / 78 variants，2026-09-10 设计确认正确数量为 **8 套 / 42 variants**（STP-001 已关闭）；本轮以用户链接为准。

MCP metadata 把各集呈现为画板内 symbol，未返回 COMPONENT_SET 根节点。本页点到 **8 个画板、42 个 symbol**，2026-09-10 设计确认这就是正确数量（STP-001 已关闭）。

## 已确认的组件集

| 画板 | 名称 | variants | 角色 |
|---|---|---|---|
| `4493:9559` | progress_item/indicator_dot | 2 | Point 指示器 20px：active / wait |
| `4465:8298` | progress_item/indicator_serial | 2 | Serial 指示器 32px：wait / progress |
| `4493:8534` | progress_item/point | 8 | Point 轨道；末项仍是 end+finished |
| `4493:9007` | progress_item/serial | 8 | Serial 轨道；末项为 end+process（原 end+finished 4493:9032 已改名） |
| `4493:8732` | progress_item/point_cell | 7 | Point 单元格，高 70 |
| `4493:9059` | progress_item/point_cell → **progress_item/serial_cell**（2026-09-10 已改名） | 7 | 此前与 4493:8732 **同名**，实际是 Serial 单元格，高 82（STP-002 已关闭） |
| `4493:8772` | progress_point | 4 | 四步 Point 组合 1056×70 |
| `4493:9205` | progress_serial | 4 | 四步 Serial 组合 1056×82 |

样本：dot wait `4493:9557`；serial wait `4465:8330`、progress `4465:8332`；Point cell process `4493:8731`、wait `4493:8729`；Point 组合 step2 `4493:8804`；Serial 组合 step2 `4493:9354`；finished 连接线 `4493:9016`；wait 连接线 `4493:9018`；Serial 末项 process `4493:9032`。

### 指示器

| 样式 | wait | process / finished |
|---|---|---|
| Point 20px | `Background/Secondary` | 实心 `Text/blue`（dot 无独立 finished，复用 active） |
| Serial 32px | `Background/Secondary` + 序号 `Text/Tertiary` | 实心 `Text/blue` + 序号 `Text/reversal`；finished **仍用数字，不是勾，也不是描边空心圆**。源文件指示器只发布 wait/progress（STP-004 已关闭）。 |

序号 Text Style：`中文/S4-CN-S` 16/24/600。圆角 999。

### 单元格与文字

BOOLEAN：`infovisible`。单元宽 **264**。轨道到文字 gap **4px**，标题与说明 gap **4px**。

| 元素 | Text Style | process / finished | wait |
|---|---|---|---|
| 标题 | `中文/S4-CN-S` 16/24 | `Text/Primary` | `Text/Tertiary` |
| 说明 | `中文/S9-CN-R` 12/18 | `Text/Primary` | `Text/Tertiary` |

旧规则写标题 18/26、说明 14/22、指示器与文字 12px，**与 Figma 不符**，本轮按 Figma 改契约和预览。

### 连接线

Serial 中段：左线 108 + gap 8 + 指示器 32 + gap 8 + 右线 108 = 264。线高 0（stroke），生成代码 inset 1.4px；实现用 **1px**。

| 线段 | 绑定 |
|---|---|
| wait / process 出向 | `Border/secondary` |
| finished 出向 | `Border/focused` |

因此 finished → process 之间为蓝线，process → wait 之间为灰线。末项无出向；`end+process`（`4493:9032`）入线 `Border/focused`、指示器实心蓝。2026-09-08 设计确认：末项 process 与 finished 视觉相同，Serial 只保留 process。

## 相对旧契约 / 实现的修正

1. 标题/说明/间距按上表改，不再用 18/26、14/22、12px。
2. 共享 `.gj-step-finished` 指示器改为与 process 相同的实心蓝，去掉描边空心圆。
3. 等待连接线从 `Border/default` 改为实测 `Border/secondary`。
5. Serial 末项：源文件把 end+finished 改名为 end+process；实现最后一步 finished 继续用同一视觉（无出向 + 实心蓝）。

## 已关闭问题

1. **STP-001 · 已关闭（2026-09-10 设计确认）** — inventory 记 9/78/0；正确数量确认为 8 个组件集 / 42 个 variants，与用户画板只读复查一致。`inventory.json` 已更新。
2. **STP-002 · 已关闭（2026-09-10）** — `4493:9059` 此前与 Point 单元格同名，内容是 Serial；已由 Figma 改名为 `progress_item/serial_cell`，歧义消除。
3. **STP-003 · 已关闭（2026-09-08 设计确认）** — Serial 末项只保留 process。原 `4493:9032` end+finished 已改名。末项无出向，process 与 finished 视觉相同。Point 轨道末项 published 名仍是 finished，实现同样归一。
4. **STP-004 · 已关闭（2026-09-08 设计确认）** — `indicator_serial` 只发布 wait/progress；finished 指示器复用 progress。

## 开放问题

无。STP-001、STP-002 均已关闭，见下方「已关闭问题」。

## 结论

Steps 为 `figma-audited`。Dot（2026-09-10 前为 Point）/Serial 指示器、三态文字、连接线颜色和 264 单元宽已抽样核实。末项 process/finished 按设计确认只保留一态。旧 18/26 标题规则已作废。页面全宽边距与指示器/文字居中见 STP-005（组合规则，不是 Figma 264 单元格）。2026-09-10 起 point 系列命名统一改为 dot（STP-002 已关闭），inventory 数量确认为 8 套/42 variants（STP-001 已关闭）。Steps 组件审计问题已全部关闭。

## 2026-09-10：point 统一改名为 dot（关闭 STP-002）

用户告知：point 统一为 dot，Serial 单元格已更名。

复查节点 `4465:8293`（Steps 整页）：

- `4493:8772` `progress_point` → **`progress_dot`**
- `4493:8534` `progress_item/point` → **`progress_item/dot`**
- `4493:8732` `progress_item/point_cell` → **`progress_item/dot_cell`**
- `4493:9059`（此前与上一条同名、实际内容是 Serial 单元格）→ **`progress_item/serial_cell`**，歧义消除，STP-002 关闭
- `4493:9559` `progress_item/indicator_dot`、`4465:8298` `progress_item/indicator_serial`、`4493:9007` `progress_item/serial`、`4493:9205` `progress_serial` 均未受影响（本来就不含 point 命名）

代码契约同步：
- `schema.json`：`implementation.pointClass`、`figma.componentSets` 名称/说明、`properties.style`/`defaults.style`、`sizes.point.*`、相关 constraints/partialMeasurements 全部由 point 改为 dot。
- `mapping.json`：`figmaComponent`、`propertyMap.step`、`normalization`（`point_cell.82` → `serial_cell.82`）、`runtimeMap.point` → `runtimeMap.dot` 同步改名。
- `references/tokens/components/steps.tokens.json`：`properties.style` 的 `point`→`dot`，`point.indicator` 改名为 `dot.indicator`（`--ds-component-steps-point-indicator`→`--ds-component-steps-dot-indicator`），`openItems.STP-002` 移除；已重新执行 `node scripts/build-tokens.mjs`。
- `assets/styles/gj-b2b-components.css`：`.gj-steps-point` 类改名为 `.gj-steps-dot`。
- `preview/steps/index.html`：演示页的 CSS 类、JS 状态值、按钮/表格文案里的 Point/point 全部同步改为 Dot/dot（`cursor:pointer` 等无关词未受影响）。

## 2026-09-10：inventory 数量确认为 8/42（关闭 STP-001）

用户确认：数量有 8 个母组件（组件集），共 42 个变体。与 2026-09-08 只读复查用户画板 `4465:8293` 得到的「8 个画板、42 个 symbol」完全一致，`inventory.json` 里 `Steps✅` 记录的 9 套 / 78 variants 是旧值/有误。

`references/components/inventory.json` 的 `Steps✅` 条目已更新为 `sets: 8, variants: 42`，并补充说明字段记录旧值和修正原因。

## 2026-09-11：清理预览页残留旧 CSS（新增并关闭 STP-005）

背景：延续 MDL-010（见 `components/modal/audit.md`）建立的方法，对 `preview/steps/index.html` 做同样的死代码核查——用户明确的标准原则是预览页无论静态展示区还是交互区，都应该只用标准组件基座渲染，不应该残留旧 CSS。

排查方法：同 MDL-010，解析页面全部 `<style>` 块，提取每个选择器涉及的类名，逐个类名对照页面真实 `class="..."` 属性（含 JS 动态拼接的模板字符串）确认是否被引用；复合选择器按逗号拆分成分支逐项判断，只删除全部分支都确认无引用的规则，混有真实类的复合选择器保留但裁掉死亡分支。

整条规则删除（1 条）：`.desc`。

验证：脚本二次扫描确认页面残留死选择器为 0；`<style>` 块大括号计数与逐字符深度校验均通过（与 button.html 同批次校验时一并发现并排除结构性错误）；本文件删除/裁剪的选择器均逐一比对过页面真实 `class="..."` 与 `classList` 调用，确认为未引用的旧代码，属于低风险清理，未单独截图复核。

结论：STP-005 已关闭。`preview/steps/index.html` 内嵌 CSS 现在只包含仍被页面实际使用的选择器。

## 2026-09-15：规范页迁移至共享基座

- Dot、Serial 与实时交互预览统一由 `.gj-steps` / `.gj-step` / `.gj-step-indicator` 共享基座渲染，页面不再以私有步骤节点作为最终输出。
- 上一步、下一步改用共享 Secondary / Primary Button；当前步骤仍保持唯一，前后状态连续。
- 复核后取消独立的「组成结构」大区块，将 Indicator + Connector + Copy 并入尺寸与属性表；示例舞台、属性区采用统一 3:2 布局并保留窄屏单列回退。
- 尺寸章节调整到交互演示之前；使用规则由九张卡片收束为三列表格，保留步骤数量、点击能力、异常恢复和窄宽度边界。

结论：本次没有改变 STP-001～STP-005 的关闭状态；规范页输出已对齐共享 Steps 基座。
# 2026-09-15 规范页优化复核

- 移除非必要的顶部「组成结构」大图，将 `Indicator + Connector + Copy` 并入「结构与规格」表格。
- Wait / Process / Finished 改为在同一条步骤链上展示，禁止拆成失去连续关系的孤立节点。
- 规范页按 264px 单元宽度展示，窄容器在局部横向滚动，不再压缩到文字相互覆盖。
- 可回看的 Finished 步骤使用共享 `.gj-step-button` 交互修饰类，避免原生 `button` 默认内边距、边框或字体污染组件几何。
