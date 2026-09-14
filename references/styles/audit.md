# Figma Styles 资产审计

## 范围与规则

- 未改 Effect/Paint/Text Style 的参数。2026-09-10 STY-003 已把本地确认的使用边界写回 Effect Style description。
- Text、Paint、Effect Style 的 Figma 参数保存在 JSON 中。
- CSS 是派生产物，不替代 Figma 真值。
- Paint Style 渐变端点允许直接使用，不要求进入 Primitive 色盘。
- 渐变 CSS 角度由 Figma `gradientTransform` 反算，不靠视觉估计。

## 数量

| 类型 | 数量 |
|---|---:|
| Text Styles | 17 |
| Paint/Color Styles | 12 |
| Effect Styles（已编目） | 6 |
| Effect Styles（Figma 本地合计） | 7 |

## 字体映射

| Figma font style | CSS font-weight |
|---|---:|
| PingFang SC Regular | 400 |
| PingFang SC Semibold | 600 |
| GJType Regular | 400 |
| GJType Bold | 700 |

该映射是前端派生规则。正式交付组件前仍需确认 `GJType` 字体文件及实际支持字重。

## 字体强制约束

- 中文 UI 禁止直接使用 `GJType`。
- `GJType` 仅用于 Metric、Gauge、Progress、Progress Ring 的核心指标；表格、普通图表、日期时间、分页和角标禁止使用。
- UI 字体调用用户本机字体，并固定配对：苹方 + SF Pro、微软雅黑 + Arial、思源黑体 + Source Sans Pro。
- 前端运行时设置 `data-gj-os`，CSS 根据操作系统调整首选字体顺序。
- `GJType` 必须通过 `@font-face` 导入；加载失败时控制台告警，并使用数字样式内联的 DIN/系统字体回退。
- 不创建独立的 number fallback Token。
- `GJType-Regular.ttf`、`GJType-Medium.ttf`、`GJType-Bold.ttf` 已作为正式资产纳入，分别注册为 400、500、700。
- 当前 Text Styles 使用 400 与 700；500 已注册，但只有组件规则明确要求 Medium 时才可调用。

## Paint Styles

- 12 个 Paint Styles 均为单层线性渐变。
- 所有渐变均保留完整色标位置与 Figma 变换矩阵。
- `灰色渐变背景` 有 Figma description：“数据指标卡片，无线框的分隔效果”。
- 其余 11 个渐变使用说明为空，不做推导。
- `white_gradint_up` 疑似包含旧拼写。2026-09-10 设计确认修正为 `white_gradient_up`（STY-002 已关闭）；编译产物 `--ds-gradient-white-up` 本来就是手工映射的简写变量名，不含拼写问题，改名不影响任何已编译的 CSS 变量。
- 12 个渐变共 24 个色标中，18 个的字面色值与既有 Primitive/品牌 Token 完全一致，2026-09-10 已改绑为对应 `var(--ds-primitive-*)` / `var(--ds-brand-gj-violet)`（不新增 Primitive，只引用已有的）。
- `#FF7067`、`#A071FF`、`#FF7D00`、`#FF9B3B` 这 4 个色标，以及 `white_gradient_up`/`white_gradient_bottom` 里的 `#FFFFFF00`（全透明白，无对应 alpha Token）在现有调色板里找不到匹配值，按策略允许作为渐变端点直接使用，保留字面值。

## Effect Styles

- 已编目 6 个：原 5 个单层效果，加上 INP-004 的 `focused_outline`。
- `shadow-center`、`shadow-down`、`shadow_small` 引用 `Background/MK_10`。
- `Innershadow_small` 引用 `Background/MK_5`。
- `bottom border` 引用 `Primitive/Neutral/N04`。
- `focused_outline` 引用 `Background/BT_B10`。
- **STY-003（2026-09-10 已关闭）**：设计确认把本地使用边界回写 Figma description。已写入原 5 个，以及已有本地 usage 的 `focused_outline`。复查 7 个本地 Effect Style 均按名匹配；`glass` 未编目、无确认使用边界，description 仍空，本轮未写。

## CSS 产物说明

- 字体类名是本地稳定映射，Figma Style 原名保留在 `typography.json`。
- 渐变和 Effect 以 CSS Custom Properties 暴露。
- 阴影 CSS 使用 Figma 的 X、Y、Blur、Spread 与解析颜色直接转换。
- **STY-004（2026-09-10 已关闭）**：扫描 `references/styles/effects.json` 与 `gradients.json` 派生进 `assets/styles/gj-b2b-tokens.css` 的 CSS 字符串，把能绑定到既有变量的解析色都换成了 `var(...)` 引用：
  - 5 个 Effect Style 全部改绑：`shadow-center`/`shadow-down`/`shadow_small` 的 `#0000001A` → `var(--ds-background-mk-10)`；`Innershadow_small` 的 `#0000000D` → `var(--ds-background-mk-5)`；`bottom border` 的 `#EBEEF2` → `var(--ds-primitive-neutral-n04)`。这 3 个色值本来就在 Figma 里标注了对应的 `Background/MK_10`、`Background/MK_5`、`Primitive/Neutral/N04`，属于"能绑定现有变量"的典型情况。
  - 12 个 Paint Style 渐变里，24 个色标中 18 个改绑为既有 `var(--ds-primitive-*)` / `var(--ds-brand-gj-violet)`（原值恰好与调色板里已有的档位相同，只是引用，没有新建 Primitive）；`#FF7067`、`#A071FF`、`#FF7D00`、`#FF9B3B` 和两处 `#FFFFFF00` 因调色板里没有对应值，按策略保留字面量。
  - 只改了 `references/styles/effects.json`/`gradients.json` 里的 `css` 字段（`resolvedColor`/`stops` 等原始记录字段不变），再跑 `node scripts/build-tokens.mjs` 重新生成 `references/tokens/gj-b2b.tokens.json` 与 `assets/styles/gj-b2b-tokens.css`。用 Playwright 核实浏览器里 `getComputedStyle` 解析出的最终值（如 `--ds-effect-shadow-center` 解析为 `0 0 15px 0 #0000001A`、`--ds-gradient-gray-background` 解析为 `linear-gradient(180deg, #F5F7FA 0%, #FFFFFF 100%)`）与改动前完全一致，纯粹是把字面值换成间接引用，没有产生任何视觉差异。


## 2026-09-10：Paint Style 改名（关闭 STY-002）

用户确认：`white_gradint_up` 是旧拼写，修正为 `white_gradient_up`。

改动：

- `references/styles/gradients.json`：JSON key 从 `white_gradint_up` 改为 `white_gradient_up`（stops/`figmaTransform`/`css` 等字段内容不变）。
- `scripts/build-tokens.mjs` 的 `gradientNames` 映射表同步把 key 改成 `white_gradient_up`，value 仍是 `white-up`——编译出的 CSS 变量名 `--ds-gradient-white-up` 本来就是手工简写，不含拼写问题，改名前后完全一致，跑 `node scripts/build-tokens.mjs` 重新生成后确认 `gj-b2b.tokens.json`/`gj-b2b-tokens.css` 里的变量名、渐变数值都没有变化，只是 JSON 源文件里的 key 名和文档引用变干净了。
- `preview/color/index.html` 从 `gradients.json` 按 key 动态渲染，改名后会自动显示新名字，不需要改 HTML。

## 2026-09-10：回写 Effect Style description（关闭 STY-003）

用户确认：需要把已确认的本地使用边界同步到 Figma description。

`use_figma` 写入后再次 `getLocalEffectStylesAsync` 核对：

| Effect Style | Figma description（回写后） |
|---|---|
| `shadow-center` | 基础通用外阴影，用于需要四周均匀分层的浮层或容器 |
| `shadow-down` | 用于下拉菜单、悬浮按钮和具有悬浮交互的卡片 Hover 状态 |
| `bottom border` | 用于导航栏、列表项和表格行底部分隔，避免重复叠加独立 Divider |
| `shadow_small` | 轻量小阴影，用于按钮、小卡片和小型浮层 |
| `Innershadow_small` | 轻量内阴影，用于灰色背景的 Pill Tab 等切换型组件容器 |
| `focused_outline` | 输入框聚焦态外圈光晕。用于 Input（Outlined/Filled/Password）typing 状态；Error 态改用红色边框，不叠加此效果。 |

未改效果参数。文案与 `effects.json` 的 `usage` 一致（`focused_outline` 未把 INP-004 关闭说明写进 Figma）。

Figma 另有未编目样式 `glass`（BACKGROUND_BLUR 4 + INNER_SHADOW），无本地使用边界，description 保持为空。


## 2026-09-10：GJType 字重文件核验（关闭 STY-001）

只做代码侧核验，未回 Figma。直接读取三个真实字体文件的 `OS/2.usWeightClass` 与 `name` 表：

| 文件 | usWeightClass | name 表 Subfamily |
|---|---:|---|
| `assets/fonts/GJType-Regular.ttf` | 400 | Regular |
| `assets/fonts/GJType-Medium.ttf` | 500 | Medium |
| `assets/fonts/GJType-Bold.ttf` | 700 | Bold |

三个文件自带的字重元数据与注册值完全一致，不是三份同权重文件贴了不同标签。再核对 `assets/styles/gj-b2b-tokens.css` 的三条 `@font-face`：`400→GJType-Regular.ttf`、`500→GJType-Medium.ttf`、`700→GJType-Bold.ttf`，文件到 `font-weight` 的映射正确无误、无错位。

结合此前已确认的决策（500 已注册纳入资产，但当前 Text Styles 只启用 400/700，500 仅在未来组件规则明确要求 Medium 时才调用），"字体文件实际支持的字重"与"weight 映射"两项技术核验均已完成。浏览器渲染层面：由于字重元数据与 `@font-face` 声明本就一致，且加载失败已有控制台告警和系统字体回退（见上方「字体强制约束」），不存在需要额外浏览器截图验证的映射错误风险，本项按代码核验口径关闭。

## 2026-09-11：清理预览页残留旧 CSS（新增并关闭 STY-005）

背景：延续 MDL-010（见 `components/modal/audit.md`）建立的方法，对 `preview/typography/index.html` 做同样的死代码核查——用户明确的标准原则是预览页无论静态展示区还是交互区，都应该只用标准组件基座渲染，不应该残留旧 CSS。

排查方法：同 MDL-010，解析页面全部 `<style>` 块，提取每个选择器涉及的类名，逐个类名对照页面真实 `class="..."` 属性（含 JS 动态拼接的模板字符串）确认是否被引用；复合选择器按逗号拆分成分支逐项判断，只删除全部分支都确认无引用的规则，混有真实类的复合选择器保留但裁掉死亡分支。

整条规则删除（7 条）：`.download-arrow`、`.download-copy`、`.download-copy span`、`.download-copy strong`、`.download-icon`、`.font-download`、`.font-download:hover`。

验证：脚本二次扫描确认页面残留死选择器为 0；`<style>` 块大括号计数与逐字符深度校验均通过（与 button.html 同批次校验时一并发现并排除结构性错误）；本文件删除/裁剪的选择器均逐一比对过页面真实 `class="..."` 与 `classList` 调用，确认为未引用的旧代码，属于低风险清理，未单独截图复核。

结论：STY-005 已关闭。`preview/typography/index.html` 内嵌 CSS 现在只包含仍被页面实际使用的选择器。
