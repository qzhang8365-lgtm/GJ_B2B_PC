# 术语与前缀速查表（GLOSSARY）

给同事只读接入本设计系统，或新开一个 AI 会话时，快速核对高频 Token 前缀、状态取值枚举和文件缩写的含义。本文件只做速查，不是规则正文——完整定义仍以 `references/design-system-rules.md`、各组件 `rules.md`、`references/library-index.json` 为准；本文件与它们冲突时，以那些文件为准，请提 Issue 或直接修正本文件。

## 一、Token 前缀与分层

- **两层色彩体系**：`Primitive/*` 只保存原始色值，供语义变量引用和颜色核对，不直接用于页面或组件；`Semantic` 层供页面和组件直接使用，包含 `Brand/*`、`Text/*`、`Button/*`、`Table/*`、`Feedback/*`、`Chart/*`、`Border/*`、`Background/*` 八类。写死 HEX 前，应先确认语义层是否已有对应变量。
- **`Radius/*`**：圆角尺寸阶梯，`Radius-XS`(4) / `Radius-SM`(6) / `Radius-MD`(8) / `Radius-LG`(12) / `Radius-XL`(16) / `Radius-2XL`(24) / `Radius-full`(999，全圆角)。
- **`Interval/space{1-10}`**：间距阶梯，`space1`(0) 起，按 4px 步进到 `space10`(48)。页面与组件间距必须落在这一阶梯上，不得使用阶梯外的任意数值。
- **`Components/control-{XXS..XL}`**：控件高度阶梯（`control-XXS`=20 起到 `control-XL`=48），用于 Input、Button、Selector 等可交互控件的统一高度档位。
- **字号体系 `中文/S1-S10-CN-*`、`数字/S*-NUM-*`**：中文字号从 `S1`（24/32，页面级大标题）到 `S10`（10/14，末级辅助信息）共 10 档，数字字号另成一套。完整字号-行高-字重对照见 `references/design-system-rules.md` 对应章节，本文件不重复贴数值，避免和真源脱节。
- **`GJType`**：国金版权数字字体，仅限 Metric、Gauge、Progress、Progress Ring 四类组件的核心指标数字使用；其余位置（表格数据、图表标签、日期时间、分页、Badge、正文数字）一律用当前 UI 字体配对，不因为内容是数字就调用 GJType。

## 二、组件契约文件速查

每个 `references/components/<name>/` 目录下最多出现以下几种文件，分工不重叠：

- **`schema.json`**：机器可读契约，记录尺寸、状态、Token 绑定、Figma 来源与置信度（`source.status`，见下），是 AI 发现组件结构的第一入口。
- **`mapping.json`**：Figma 原始属性/状态名到本地实现命名的映射表，包含历史命名和归一说明。
- **`rules.md`**：人类可读的叙述规则——用途、属性枚举、组合规则、使用边界。
- **`audit.md`**：该组件的审计留痕（发现了什么问题、何时以何种结论关闭），只记录证据细节，不做汇总。
- **`<name>.tokens.json`**（仅高频组件）：本地代码生成的组件级状态矩阵，是该组件状态值的权威入口，不允许被页面 CSS 或经验值覆盖。

## 三、状态取值枚举速查

- **`schema.json` 顶层 `source.status`**（组件契约成熟度）：
  - `figma-audited`：已完成真实 Figma 节点级审计。
  - `local-contract`：本地已有结构化契约，但未做 Figma 节点级审计。
  - `rules-derived`：门禁已有机器契约，但 Figma 全量抽取仍待完成。
  - `inventory-only`：只确认组件存在，属性均未核实，实施前必须先读 Figma，不得把空属性补成经验值。
- **`coverage.json` 的 `statusDefinitions`**（覆盖看板每格状态）：`complete`（产物存在且成熟度达标）/ `partial`（产物存在但抽取或配套文件不全）/ `missing`（应有但缺失）/ `not-required`（已有组件决策明确排除该产物）/ `pageMarkedComplete`（仅镜像 Figma 页面名里的 ✅，不代表工程完成）。
- **`library-index.json` 的 `audiencePolicy`**（文件消费者边界）：`ai-readable`（AI 选规则/Token/组件/图标时按需读取）/ `output-asset`（可在原型中加载复用，但不是指令文档或真实前端 API）/ `maintenance-script`（仅在对应来源更新、校验或迁移任务中运行，不作为规则来源读取）/ `human-preview-only`（仅供人工视觉与交互验收，不是设计真值）。

## 四、常用缩写与文件

- **BOM / 《本页用料清单》**：`SKILL.md`「实现前」第 1 步要求的强制中间产物——写代码前列出本页要用的每个组件/图标/关键色及其库内确切引用，查不到就标「⏳待补」，不得跳过。
- **`inventory.json`**：`references/components/` 的组件登记表，`schemaRegistry.executionOrder` 是 AI 发现组件的唯一入口；不在这里登记的组件目录，AI 永远读不到。
- **`coverage.json`**：由 `scripts/build-coverage.mjs` 生成的机器可读组件覆盖看板，`--check` 模式可校验它是否与实际文件同步。
- **`audit-tracker.md`**：全仓库审计问题的开放项/优先级/状态唯一汇总表，按组件代号或问题 ID（如 `AVT-`、`TBL-`）定点检索，不整份读取。
- **组件代号前缀**：审计问题 ID 通常取组件英文名缩写 + 三位序号，例如 `RAD-004`（Radio）、`STP-002`（Steps）、`TMP-002`（TimePicker）、`GNV-004`（GridNav）、`INP-004`（Input）、`UPL-002`（Upload）。

## 五、历史命名迁移映射

以下命名在设计或审计过程中发生过变更；读到旧名不代表文件写错，按迁移后的新名理解即可。完整前因后果见各自 `audit.md`。

| 旧名 | 新名 | 生效时间 | 范围/备注 |
| --- | --- | --- | --- |
| Figma 状态 `typing` | `focused` | 2026-09-10 | Input、Search 组件；Figma 侧已同步更名 |
| 状态名 `mouseon` | `focus` | 2026-09-08 | 仅 Radio 本地实现命名；Figma 源属性值仍为 `mouseon`，未要求 Figma 侧改名 |
| 文字样式 `Body_14px_regular` | `中文/S8-CN-R` | 2026-09-10 | Radio 标签文字 |
| 指示器命名 `Point`/`point` | `Dot`/`dot` | 2026-09-10 | Steps 组件，`point` 系列命名统一改为 `dot` |
| 母版节点名 `TiTime-Picker-dropdown` | `Time-Picker-dropdown` | 2026-09-09 | TimePicker，拼写修正（原名含拼写错误） |
| 属性名 `number badge`（含空格） | `number_badge` | 2026-09-09 | GridNav，Figma 侧已更名 |
| 属性 `label.toolip` | `label.tooltip` | — | Metric，Figma 侧已更名 |
| 取值 `metrictop`/`labletop` | `order=metric_first`/`lable_first` | — | Metric；`lable_first` 沿用 Figma 源文件拼写，未强行纠正 |
| 命名 `State6`/`State5` | `default`/`hover` | — | Upload，mapping 层归一，不把无语义原名暴露到组件 API |
| Image 组件下的拖拽上传容器 | 已移至 Upload 组件，更名为 `Upload_Dropzone` | — | 查阅拖拽上传相关规则时应看 `upload/schema.json` 与 `upload/audit.md`，Image 组件不再包含该内容 |
