# InputNumber audit

来源：`references/components/input-number/rules.md`、`schema.json`、已验收预览页 `preview/input-number/index.html`（inventory 记录 1 套/48 变体），inventory 页面 `Input-Number✅`。2026-09-09 用户明确：已在组件预览页对照 Figma 原始组件确认呈现无差异，不需要走 Figma `get_design_context` 逐节点核实，按通用数字输入组件惯例补齐即可。走 `local-contract` 路径（与 Chart、Icon、Drawer、Skeleton、Badge、Timeline 处理方式一致）。本轮**没有**对 Figma 组件做节点级核实，不得把本文件写成 `figma-audited`。

## 契约范围

- 六种模式：基础输入、左右加减（stepper）、固定单位（unit）、右侧步进（right-step）、单值 Slider、Range Slider。
- 三档尺寸 Small/Medium/Large：100×24 / 112×32 / 133×40px，圆角 4/6/8px，仅 Large 额外把字号升到 16px。
- 必须定义 Min/Max/Step；到达边界时对应增减操作禁用；Range 两端不得交叉。

## 预览页实测记录（本轮补齐依据）

- `.number-input` 用 `--h`/`--radius`/`--px` 三个 CSS 自定义属性驱动三档尺寸，Medium 为默认值（32/6px/12px），`.small`/`.large` 修饰符覆盖为 24/4px/8px 与 40/8px/12px（Large 额外把 `font-size` 升到 16px，是三档里唯一字号变化的档位）。
- 聚焦态用 `.active` 修饰符实现（不是原生 `:focus` 伪类），边框变 `Text/blue`，外加 2px `Background/BT_B8` 发光；禁用态背景和文字统一切到 `Background/Background`/`Text/disable`。
- `stepper`（左右各一个 32px 按钮）、`unit`（右侧 32px 固定单位标签）、`right-step`（右侧 24px 宽、上下堆叠两个按钮、中间 1px 分隔线）三种模式的结构、宽度、图标尺寸均已从预览页真实 CSS 逐项记录。
- Slider/Range Slider：轨道 200px 示例宽、4px 高、圆角 11px 胶囊；滑块 16px 圆形，颜色取 `Button/primary-bg-pressed`（“按下态”品牌色 token，不是更常见的 `Feedback/brand`，预览页实测确实如此，未做“更合理”的替换）；精确值 Tooltip 深色胶囊、8px 圆角、下方三角指示，Range 模式用 `--tip`/`--tip-end` 两个自定义属性各自定位两个 Tooltip。

## 明确未覆盖 / 按惯例补齐（不是实测）的部分

- **INN-003**：schema.json 把 `error` 列为一个状态，但预览页里没有找到 `.number-input.error` 或等价的可见实现——组件本身并未真的做出错误态视觉。本文件的 `field.border.error`/`field.text.error` 是按同项目里 Input 组件已核实的 outlined 错误态惯例（`Border/error`、`Feedback/error&rise`）补的，不是从 InputNumber 自己的预览页量出来的，如实标注为"按惯例"而非"实测"。
- **INN-004**：本会话更早的一轮里，因为组件名称一度被误传为"TimePicker"又更正为"InputNumber"，我在 `/mnt/user-data/uploads` 这个不完整的云端快照目录里手写过一份更粗略、完全没有对照预览页、纯靠 design-system-rules.md 文字推导的旧版契约（schema/mapping/audit/token 四个文件）。那份和这次在真实项目里、依据已确认过 Figma 的 `preview/input-number/index.html` 重新建立的版本不是同一份，本轮没有触碰或删除那份旧文件，如果需要清理/标记废弃需要用户确认，因为那份旧快照目录本身是否还在使用也未确认。

## 开放问题

- **INN-002**：`assets/styles/gj-b2b-components.css` 暂无共享 `.gj-input-number*` 组件基座，仅预览页有内联参考实现；与 Badge 的 BDG-001、Timeline 的 TML-001、Skeleton 的 SKE-001 同类，不阻断 `local-contract`。
- schema.json 的 `pendingExtraction` 里列的 Figma 组件集节点 id、48 个 variant 属性组合、精确属性名、状态与边界 token 绑定、滑块几何与 Tooltip 绑定，本轮仍未做逐节点核实（用户明确表示不需要），如未来要升级为 `figma-audited`，需要用户另外提供 Figma 链接。

## 结论

InputNumber 为 `local-contract`：schema / mapping / audit / 组件 Token 已按用户确认、通用数字输入组件惯例与已验收预览页实测值补齐；错误态是按同项目 Input 组件惯例补的、非实测，已如实标注。覆盖看板不再缺 mapping、audit 与组件 Token。

## 2026-09-09：共享 CSS 基座提炼（关闭 INN-002）+ 清理 stale 快照（关闭 INN-004）

`preview/input-number/index.html` 原本内联定义的字段（`.number-input` + `.small`/`.large`/`.active`/`.disabled`）、步进（`.step-button`）、单位（`.unit-label`）、右侧步进（`.right-controls`）与滑块（`.slider`/`.slider-track`/`.tooltip`）样式，已提炼为 `assets/styles/gj-b2b-components.css` 的共享类 `.gj-number-input`（+ `.gj-number-input-small`/`-large`/`-stepper`/`-unit`/`-right-step`/`.is-active`/`.is-disabled`）、`.gj-number-input-step-btn`/`-unit-label`/`-right-controls`、`.gj-slider`（+ `.is-with-tooltip`/`.is-range`）/`.gj-slider-track`/`.gj-slider-tooltip`，对应结构/颜色数值同步写成 `assets/styles/gj-b2b-tokens.css` 里的 `--ds-component-input-number-*` 变量，逐条对应预览页实测到的原始数值（含 `--h`/`--radius`/`--px` 三个尺寸自定义属性驱动 Small/Medium/Large 三档的做法，未改变实现方式，只是把硬编码数值换成了共享 token 引用）。

命名调整（视觉行为不变，按项目 `is-` 前缀惯例统一状态修饰符）：`.active`→`.is-active`、`.disabled`→`.is-disabled`、`.with-tooltip`→`.is-with-tooltip`、`.range-tooltips`→`.is-range`。

`preview/input-number/index.html` 的 `<style>` 块已删除对应重复规则，标签配平（div 80/80、button 8/8、label 18/18、input 23 个自闭合等）与内联脚本 `node --check` 均已验证通过。`mapping.json`/`input-number.tokens.json` 已同步更新 `implementation.status` 为 `shared-css-base` 并补全 `cssVariable` 字段；`input-number.tokens.json` 的 `openItems.INN-002` 已移除，`INN-003`（错误态视觉未在预览页实现，按 Input 组件惯例补齐）保留不变。

另外，`INN-004` 提到的、留在 `/mnt/user-data/uploads` 那个过期云端快照目录里的更早期粗糙契约文件（schema/mapping/audit.md + token 文件共 4 个）已按用户确认删除，不再有两份不一致的 InputNumber 契约并存。

## 结论

InputNumber 仍为 `local-contract`（未做 Figma 节点级审计，不受本次改动影响），但前端实现层面不再有"仅预览页内联参考实现"的缺口——INN-002 已解决；重复的旧快照文件也已清理。

## 2026-09-10：Figma 母版审计（关闭 TOK-004 / INN-003）

页 `2638:2479` 只读核实：**2 套 / 52 variants / 0 standalone**（旧 inventory 1/48 漏记 `swiper` `4293:15642` 共 4 态）。

- `Input-Number` `3482:1480` 默认 `size=small, state=filled, numberhandle=false, unit=false, Addon=false`。轴：size Large/small/medium，state Default/filled/active/disabled，boolean 三轴 numberhandle/unit/Addon。无 error。
- 颜色均为 paint 绑定：底 `Background/Container`，描边 `Border/secondary`，active `Border/focused`（无 effect），disabled 底 `Background/Background`，占位/禁用字 `Text/disable`，填入字 `Text/Primary`。
- Addon 按钮宽 = 档位高（24/32/40），不是固定 32。Large 图标 16，其余 14。
- `swiper`：轨道未激活 `Background/Secondary`，激活 `Brand/GJ_Blue`，滑块 `Button/Primary/Bg-pressed` + `Background/MK_10` 投影；Tooltip `Background/MK_80` + 文字 `Background/Container`。

已写入 `input-number.tokens.json` 并接入 `build-tokens.mjs`。预览外发光、错误态 Token、固定 32px 步进宽已从 Figma 真值中剔除。产品默认尺寸仍为 Medium。

## 结论

InputNumber 升级为 `figma-audited`。INN-003 关闭。

## 2026-09-11：清理预览页残留旧 CSS（新增并关闭 INN-004）

背景：延续 MDL-010（见 `components/modal/audit.md`）建立的方法，对 `preview/input-number/index.html` 做同样的死代码核查——用户明确的标准原则是预览页无论静态展示区还是交互区，都应该只用标准组件基座渲染，不应该残留旧 CSS。

排查方法：同 MDL-010，解析页面全部 `<style>` 块，提取每个选择器涉及的类名，逐个类名对照页面真实 `class="..."` 属性（含 JS 动态拼接的模板字符串）确认是否被引用；复合选择器按逗号拆分成分支逐项判断，只删除全部分支都确认无引用的规则，混有真实类的复合选择器保留但裁掉死亡分支。

整条规则删除（1 条）：`.code`。

验证：脚本二次扫描确认页面残留死选择器为 0；`<style>` 块大括号计数与逐字符深度校验均通过（与 button.html 同批次校验时一并发现并排除结构性错误）；本文件删除/裁剪的选择器均逐一比对过页面真实 `class="..."` 与 `classList` 调用，确认为未引用的旧代码，属于低风险清理，未单独截图复核。

结论：INN-004 已关闭。`preview/input-number/index.html` 内嵌 CSS 现在只包含仍被页面实际使用的选择器。
