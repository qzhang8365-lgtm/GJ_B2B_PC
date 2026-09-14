# Selector audit

- 只读来源：页面 `2638:2419`（`选择器select`）。未修改 Figma。
- SEL-001（`defaut` / 尺寸大小写 / 重复 Focus）本地 API 已关闭，Figma 命名未改。本轮不重开。

## 2026-09-10 SEL-002 逐 variant 只读审计

用户要求核对「2 个主组件集、42 个 variant」的完整组合和变量绑定。本轮使用 Desktop `get_metadata`、`get_variable_defs` 与 Plugin `use_figma`（仅 `return`）。MCP 把母版标成 `<frame>` + `<symbol>`，子图层名是 `属性=值`，按母版口径计数。规范展示画板 `4208:19226` 是实例（含 Cascader 面板），不计套。

| 套 | 节点 | variants | 轴 | 默认 |
|---|---|---:|---|---|
| `select_basic` | `2889:3782` | 15 | Size × State × Disabled × Tags=false | Middle / Default / false `2889:3781` |
| `select_multiselect` | `4208:19225` | 12 | size × state × focused | Middle / defaut / false `4208:19413` |
| `Selection-Item` | `2889:3999` | 9 | Size × Closeicon × disabled | middle / true / false `2889:3998` |

15+12+9=**36**。旧 inventory **2 / 42 / 0**：42 = 单选笛卡尔 3×3×2 + 多选笛卡尔 3×4×2，不是实收 variant；且漏记 Selection-Item。本轮更正为 **3 / 36 / 0**。

三套 description 为空，`reactions: 0`。无 Hover、Error、Focus 阴影轴。

### `select_basic` 15/18

缺 `State=focused, Disabled=true` 三档。`Tags` 只有 `false`。

| State / Disabled | 背景 | 描边 | 文字 | 箭头 |
|---|---|---|---|---|
| Default / false | Container | secondary | **disable**（Placeholder） | Tertiary |
| selected / false | Container | secondary | Primary | Tertiary |
| focused / false | Container | **focused** | Primary | Tertiary |
| Default / true | Background | **secondary**（不是 disabled） | disable | Tertiary |
| selected / true | Background | secondary | **Primary** | Tertiary |

尺寸：small 24 圆角 4 pad 8；Middle 32 圆角 6 pad 8；Large 40 圆角 8 pad 12。gap 10。展示宽 198。字 Small/Middle `中文/S8-CN-R`，Large `中文/S7-CN-R`。高/圆角/内边距未绑 Interval/Radius。

### `select_multiselect` 12/24

`state=defaut` 即 Default。空值稿（defaut）结构与单选 Default 相同：Placeholder 14/16 + 箭头，无芯片。selected / focused / disable 内嵌 Selection-Item。

`focused=true` 只出现在三个 `state=disable` variant 上，描边仍是 `Border/secondary`，视觉上就是 Disabled，不是 Focus。实现忽略该布尔轴。

有芯片时左内边距 4；空值 defaut 左右仍 8/12。芯片填充 `Background/Secondary`。disable 芯片无关闭图标（对应 Item 母版缺 close+disabled）。

### `Selection-Item` 9/12

缺 `Closeicon=true, disabled=true` 三档。

| Size | 高 | 圆角 | 字 | 关闭图标 |
|---|---:|---:|---|---|
| Small | 16 | 4（绑 Radius-XS） | S9 12/18 | 12 `icf_system_close-md` Tertiary |
| middle | 24 | 4 | S9 12/18 | 12 |
| Large | 32 | 6（未绑） | S7 16/24 | 16 |

填充一律 `Background/Secondary`。`disabled=true` 且无关闭：opacity **0.5**，文字仍 Primary。

### 相对旧 local-contract

1. Disabled 描边是 `Border/secondary`，旧 Token/CSS 写成 `Border/disabled`。已改。
2. 有值 Disabled 文字是 Primary，不是整段 disable 灰。已改 CSS，不再给 disabled 触发器设 `color: Text/disable`。
3. 触发器 gap 稿上 10，旧 CSS 6。已改。
4. 芯片底是 `Background/Secondary`，预览页 `.tag` 曾用 `Border/default`。已改到 `.gj-selector-item`。
5. 42 不是实收 variant 数。inventory 改为 3/36。

## 开放问题

1. **SEL-001 · P1 · 本地已关闭** — Figma 仍保留 `defaut` / `Middle|middle` / 重复 focused；本地映射继续归一。
2. **SEL-002 · P2 · 已关闭（2026-09-10）** — 3 套 36 variants 已逐轴核对绑定。inventory 更正为 3/36/0。

## 结论

Selector 升级为 `figma-audited`。生成时：Disabled 描边 secondary、有值禁用字 Primary、芯片 Secondary、gap 10。Hover/Error/Focus 环仍是本地补充。`pendingExtraction` 为空。

## 2026-09-11：清理预览页残留旧 CSS（新增并关闭 SEL-003）

背景：延续 MDL-010（见 `components/modal/audit.md`）建立的方法，对 `preview/selector/index.html` 做同样的死代码核查——用户明确的标准原则是预览页无论静态展示区还是交互区，都应该只用标准组件基座渲染，不应该残留旧 CSS。

排查方法：同 MDL-010，解析页面全部 `<style>` 块，提取每个选择器涉及的类名，逐个类名对照页面真实 `class="..."` 属性（含 JS 动态拼接的模板字符串）确认是否被引用；复合选择器按逗号拆分成分支逐项判断，只删除全部分支都确认无引用的规则，混有真实类的复合选择器保留但裁掉死亡分支。

整条规则删除（1 条）：`.code`。

验证：脚本二次扫描确认页面残留死选择器为 0；`<style>` 块大括号计数与逐字符深度校验均通过（与 button.html 同批次校验时一并发现并排除结构性错误）；本文件删除/裁剪的选择器均逐一比对过页面真实 `class="..."` 与 `classList` 调用，确认为未引用的旧代码，属于低风险清理，未单独截图复核。

结论：SEL-003 已关闭。`preview/selector/index.html` 内嵌 CSS 现在只包含仍被页面实际使用的选择器。


## 2026-09-14：Trigger 图标—内容间距改为 8px（重开 SEL-002 的 gap 结论）

`scripts/verify-page.mjs` 对 5 个页面模式做生成后一致性验证时发现 `.gj-selector-trigger` 的 `--ds-component-selector-trigger-gap` 是 10px，不在 4px 间距阶梯上；该值在 SEL-002（2026-09-10）里已按 Figma 稿上 itemSpacing=10 确认过（旧 CSS 是 6）。这次用户明确要求把 Button、Selector 两处间距都改到阶梯值上，优先级高于之前 SEL-002 记录的 Figma 原稿数值，因此重新调整。

修复：改为 8px（`{Interval/space3}`），与站内其它同类图标/内容间距（`--ds-component-tooltip-trigger-gap`、`.toolbar`/`.actions` 等）保持一致。`selector.tokens.json` 的 `trigger.gap` 更新为 `{Interval/space3}`/`resolved:8`，并在 note 里记录本次改动与 SEL-002 的关系；`node scripts/build-tokens.mjs` 重新生成；`assets/styles/gj-b2b-components.css` 里 `.gj-selector-trigger` 的 var() 兜底值同步改成 8px。`node scripts/validate-tokens.mjs` 通过；`scripts/verify-page.mjs` 重新跑 search-list/form-edit 两个用到 Selector 的页面模式确认相关 `spacing-off-ladder` 发现清零。
