# 统一工程化 Token 契约

## 产物与职责

- `gj-b2b.tokens.json`：AI、构建脚本和代码生成器读取的统一机器包。
- `../../assets/styles/gj-b2b-tokens.css`：SKILL 工作流入口之一。可直接用于 HTML/CSS 原型的完整 CSS Variables、字体声明、`html/body` 与表单控件的 UI 字体、文字样式类和响应式容器类。必须与 `gj-b2b-components.css` 成对加载。分级清单见 `../../assets/styles/README.md`。
- `colors-primitive.json`、`colors-semantic.json`、`dimensions.json` 以及 `../styles/`、`../layout/` 下的来源文件仍是本地产物的权威输入。
- 统一 JSON 和 CSS 是派生产物，不手工修改。来源更新后运行构建脚本重新生成。

```bash
node scripts/build-tokens.mjs
node scripts/validate-tokens.mjs
```

## 代码生成规则

1. 组件和页面颜色优先调用 `color.semantic` 中记录的 `cssVariable`；`color.primitive` 只用于维护色盘、解析别名和确无语义变量可用的受控场景。
2. 尺寸、间距、圆角和控件高度使用 `dimension` 中记录的 `cssVariable`。设计稿实例明确覆盖组件默认值时，以实例为准。
3. UI 使用 `--ds-font-family-ui`，并在页面级固定选择苹方 + SF Pro、微软雅黑 + Arial、思源黑体 + Source Sans Pro 之一。仅 Metric、Gauge、Progress、Progress Ring 的核心指标可使用 `--ds-font-family-numeric`；其它数字继续使用 UI 字体。
4. 已存在的文字样式使用 `.gj-type-cn-*` 或 `.gj-type-num-*` 类，或读取同名 `--ds-type-*` 指标变量，不拆散字号、行高和字重组合。
5. 阴影使用 `--ds-effect-*`，渐变使用 `--ds-gradient-*`；不得根据视觉近似重新计算参数。
6. `--ds-breakpoint-*` 可供 JavaScript 和文档读取。CSS 的 `@media` 不能用自定义属性作为条件，必须使用生成文件中已经展开的固定断点。
7. 页面内容容器可使用 `.gj-page-content`：1440px 为设计基准，1280px 为最低支持宽度，2560px 起限制内容最大宽度为 1920px。
8. 生成 Button、Text Button、Input、Table、Selector、Dropdown、Checkbox、Radio 或 Switch 时，先读取统一包中对应的 `component.<name>`。属性枚举决定允许组合，`tokens` 决定尺寸和静态属性，`stateMatrix` 是 Default / Hover / Focused / Pressed / Selected / Disabled / Error 等适用状态的工程映射，`behavior` 和 `composition` 决定运行时与组合边界。
9. Button 的 `hover`、`pressed` 不作为业务常驻属性；`loading` 是运行时状态，`completed` 仅为按场景启用的短暂反馈。不得将展示站的强制状态开关照搬为生产 API。

## 命名与兼容

- Figma 路径保留在统一 JSON 的键中，例如 `Text/Primary`；对应 CSS 名统一为小写短横线格式，例如 `--ds-text-primary`。
- 每个颜色和尺寸条目都包含明确的 `cssVariable` 字段，调用方不得自行猜测或二次转换变量名。
- `--gj-font-family-ui` 与 `--gj-font-family-numeric` 暂作为现有规范页的兼容别名保留；新生成代码优先使用 `--ds-*`。
- `--docs-*` 只属于规范网站外壳和预览页布局，禁止复制到业务产品页面。

## 当前边界

- 当前只维护 PC light 一套变量，不生成未存在的暗色主题 Token。
- `site.docs` 收录规范站专用布局 Token，与业务设计 Token 隔离。
- 统一包已接入全部已审计组件的组件级 Token（含 2026-09-10 补齐的 InputNumber、Image、Badge、Timeline）。生成时读取对应 `component.<name>.tokens`；禁止从页面硬编码反推或虚构 Token。TOK-004 已关闭。
- 未单独建 Token 文件的组件仍须读取对应 schema 与 rules，不得根据组件名称自行虚构。
- Secondary Disabled 已于 2026-09-09 关闭（BTN-002）：视觉值不变（仍是 `Primitive/Blue/B04` / `#9CC0FF`），但不再借用 `Button/Primary/Bg-disable`，已改为 Secondary 专属语义 Token `Button/Secondary/Disable`（CSS `--ds-button-secondary-disable`）。
- Button 图标与文字的内部间距尚未在既有提取数据中保留逐尺寸数值，因此本轮不虚构对应 Token；重新读取 Figma 后再补齐。
- 真实组件 API、事件、无障碍、表单行为和发布版本仍由开发组件库维护；本包不把规范站中的展示代码伪装成生产源码。
