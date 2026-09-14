# 生成后一致性验证

本文件解决一个反复出现的问题：页面生成完成后，仅靠读代码、看 diff 或肉眼截图很难发现内容溢出、尺寸不准、图标颜色跑偏、间距不合理这类缺陷——`design-system-rules.md`「工程实现踩坑记录」里已经记录过多次这类回归，共同结论是必须用真实浏览器渲染 + 读计算样式实测，不能只读源码。本文件把这条结论固化成生成任一页面模式、组件预览页或业务原型后**必须执行**的验证协议，而不是留在个别事故的事后记录里。

## 何时必须执行

- 新生成或修改任何 `preview/patterns/*.html`、`preview/<component>/index.html`，或依据本 Skill 产出的业务页面原型，交付前必须跑完本文件的检查项。
- 修改共享样式（`gj-b2b-tokens.css`、`gj-b2b-components.css`）或任一组件的 Token/Schema 后，至少对该组件预览页和引用了它的所有页面模式重跑一遍。
- 仅做文案、Token 值等不影响布局的修改可以跳过，但必须在交付说明里注明跳过原因。

## 强制方法：渲染实测，不凭读码判断

- 必须用 Playwright（或等效的真实浏览器自动化）加载生成结果，读取 `getBoundingClientRect()` 与 `getComputedStyle()` 的实测值；选择器语法正确、代码"看起来对"不等于生效，`.gj-tabs` 跨列/`.field input` 误伤 checkbox 等历史案例都是选择器没写错但实际不生效或作用域错了。
- 断点覆盖规则如果写在 `@media` 里，必须在目标视口宽度下实测，不能只看规则是否存在；复制别的页面的 CSS 规则时必须连同其 `@media`/`@supports` 包裹一起复制，并在两个视口宽度下分别验证。
- 至少覆盖两个视口宽度：1440px（设计基准）与 1280px（最低承诺支持宽度）；页面模式还需按 `page-patterns.md` 里对应的降级规则加测 1024px 或更窄的应急宽度。
- 修完问题后必须重新渲染截图/重新实测，不能只 diff 代码确认"应该改对了"。

## 四类高频问题的判定标准与检查方式

### 1. 内容溢出

- 对每个不是刻意可滚动的叶子内容元素，断言 `scrollWidth <= clientWidth + 1` 且 `scrollHeight <= clientHeight + 1`（允许 1px 取整误差）。
- 刻意可滚动的容器（`overflow-x/y:auto|scroll`）必须有可感知的滚动线索（可见滚动条、渐隐遮罩、明确的横向滚动提示等），不能是"技术上能滚、视觉上看不出来"——`.ds-table` 在窄容器里因为没有可见滚动条被误判成"内容丢失"就是这一类问题，处理方式是让容器能在目标宽度下完整显示，而不是指望用户发现可以横向拖动。
- 同一父元素下的兄弟节点之间不应出现未预期的包围盒重叠；Modal、Drawer、Tooltip、Popover、Notification、Toast、Mask 等设计上就需要覆盖其它内容的浮层组件除外，这类组件按下方「交互态与浮层」单独验证。
- 任何用 `table-layout:fixed` 配合固定 `min-width` 的容器（例如共享的 `.ds-table`），必须核对其实际渲染容器在两个目标视口宽度下是否始终不小于该 `min-width`；如果容器可能更窄，要么去掉/降低 `min-width`，要么保证容器有足够宽度，不能留一个只在宽屏下成立的假设。

### 2. 尺寸不准确

- 页面内所有内联 SVG 图表/图形，若使用了显式 `preserveAspectRatio`，一律禁止 `"none"`；核对方式是量出容器实际渲染宽高比与 `viewBox` 宽高比是否一致，不一致时应看到留白（`meet`）而不是文字/图标被压扁或拉长。这类问题读代码看不出来，必须实际渲染截图或量取图内文字的实际宽高比才能发现。

- 每个可视化组件实例（Button、Input、Selector、Tag、DatePicker 触发器等）的实测高度必须与其引用的 `component.<name>.tokens` 中对应 size 档位的值逐位相等，不允许用"看着差不多"的近似值代替；不确定对应 Token 时先读 `references/tokens/components/<name>.tokens.json` 的 `stateMatrix`/尺寸字段，不得凭组件名称猜测。
- 同一视觉行、同一操作组或同一表单行内的交互控件，必须实测高度完全一致；发现混用 Small/Medium/Large 视为缺陷，除非该行为已被组件 contract 明确允许为例外（例如表格行内操作与外层筛选行本就是两个独立层级）。
- 圆角、内边距同理：用 `getComputedStyle` 实测 `border-radius`/`padding`，核对是否命中已注册的 Token 值；Token 本身是整数像素，出现非 Token 值即为缺陷。

### 3. Icon 颜色不一致

- 页面内每一处"图标 + 相邻文字"的组合（按钮、Text Button、Tag、Tab、Breadcrumb、Dropdown Item 等），必须实测图标的 `color`（mask 类图标读 `background-color`；内联 SVG 读 `fill`/`color`）与相邻文字节点的 `color` 计算值是否逐位相等（RGB 完全一致）。
- 不一致时先确认该图标是否已在对应组件 `rules.md`/`schema.json` 里被记录为"独立状态色"的例外（例如错误态感叹号图标、品牌色图标）；没有这类记录的不一致一律判定为缺陷——最常见的成因是图标资源自带固定 `fill`/`stroke`，没有按 `currentColor` 引用。

### 4. 间距不合理

- 抓取页面内所有相邻兄弟元素之间的实测间距（flex/grid 的 `gap` 计算值，退化情况读 margin 差值），核对是否命中 `4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48` 这条阶梯；任何阶梯外的值（例如 10px、14px、18px、22px 这类目测凑出来的数字）判定为需要修正。
- 同一层级重复出现的间距（同类卡片之间、同类表单项之间）必须在整页内保持同一个值；同层级出现两种不同间距且没有明确的设计依据，视为不一致。

## 交互态与浮层单独验证

- Modal、Drawer、Tooltip、Popover、Dropdown、Notification、Toast、Mask 等浮层组件，必须实际触发其打开状态后再做上述四类检查，不能只检查静态收起态；浮层的定位容器（`position:relative` 建立的包含块）必须实测确认浮层被限制在预期容器内，不能跑到页面外或盖住不相关区域——`preview/index.html` 通过 `appendChild` 重新注入共享样式表、把加载顺序排到页面局部覆盖规则之后，导致 `.anatomy-drawer` 的 `position:static` 覆盖失效、抽屉铺满整个 iframe，就是这一类问题的真实案例，根因排查同样是靠实测 `position` 计算值和包围盒几何关系确认的，不是靠读代码。
- 触发后必须实测过渡类属性是否生效（`transition-duration` 计算值不为 `0s`，除非该动效本就被设计为瞬时），不能只看动画代码是否存在——CSS 自定义属性缺失时相关声明会整条失效，代码存在不代表实际生效。

## 组件引用清晰度（补强 SKILL.md「页面生成组件门禁」为可执行步骤）

- 生成前列出页面计划使用的每个组件及其 `variant/size/state/icon/disabled/loading` 等属性，并逐条写明依据来自哪个文件（`schema.json`/`rules.md`/`<name>.tokens.json`），不得只凭组件名称直接开始写 CSS/HTML。
- 生成后提取页面 `<style>` 块内的全部选择器，排除页面壳/布局白名单（`.shell`/`.grid`/`.panel`/页面私有的区域容器类等），标记任何命中 `.gj-` 前缀的声明为可疑项，逐条核对是否越权覆盖了本应由共享组件负责的 `height`/`padding`/`border-radius`/`font`/`color`/`background`/`border`/`box-shadow` 或状态样式；命中即视为门禁失败，必须改为组合共享组件而不是页面私有覆盖。
- 扫描页面 DOM 中的原生表单控件（`<select>`/`<input type=checkbox>` 等裸控件）、`appearance:none`、非 `gj-*` 视觉类，逐个核对是否本应映射到已有组件；命中已有组件即视为验收失败，必须替换后才能交付。

## 最小验证脚本

`scripts/verify-page.mjs` 实现了上述内容溢出、包围盒重叠、间距阶梯、图标颜色一致性、同行尺寸一致性五类检查的可执行版本，输出结构化 JSON 报告。用法：

```bash
node scripts/verify-page.mjs <html文件路径> [--width=1440,1280]
```

依赖 Playwright（`npm install playwright` 后可用；本仓库当前未提交 `package.json`/`node_modules`，本机没有 Playwright 时可以在有权限安装依赖的分析环境里跑，例如 Claude 的沙箱环境）。脚本只覆盖可编码判定的部分（溢出、重叠、间距阶梯、图标/文字颜色、同行高度一致性），尺寸是否命中具体组件 Token、浮层是否被正确触发等仍需按上文流程人工核对或按需扩展脚本。

## 验证记录留痕

- 一次性生成任务：验证发现的问题和处理结果写进交付说明，不必落盘到 `references/`。
- 计入正式页面模式或组件共享基座的产出：结论写入对应组件的 `audit.md`（新增一条带日期的验证记录），涉及页面模式整体的写入 `page-patterns.md` 对应模式段落或另起记录；不得只在对话里说明、不落盘。
