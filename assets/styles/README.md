# `assets/styles/` 分级

同目录 CSS 不是并列可选项。`SKILL.md` 生成 HTML/CSS 原型时只加载下面两份。

## SKILL 工作流入口（必须加载）

| 文件 | 职责 |
|---|---|
| `gj-b2b-tokens.css` | 统一 Token 派生产物：CSS Variables、字体声明、文字样式类、断点、`.gj-page-content`，以及 `html/body` 与表单控件的 UI 字体。由 `scripts/build-tokens.mjs` 生成，不手工改数值。 |
| `gj-b2b-components.css` | 静态组件基座：页面必须优先使用其中的 `gj-*` 类。 |

组件规范预览页另可加载 `component-docs.css`。它只负责规范页的纵向阅读流、12/8/4 圆角层级和规则表格，不得进入业务页面，也不得覆盖 `gj-*` 组件内部样式。

加载顺序：先 tokens，后 components。

## 非工作流（禁止当作原型加载选项）

| 文件 | 级别 | 现况 |
|---|---|---|
| `data-table.css` | 旧预览表格壳 | `.ds-table` 演示样式。现行表格是 components 里的 `gj-table`。 |

`semantic-colors.css`、`design-styles.css`、`responsive.css`、`fonts.css`、`preview-lightweight.css` 已删除。字体规则已并入 tokens；工作台减阴影规则已内联到 `preview/index.html`，不进业务页。

`data-table.css` 可以继续给旧规范页规格表兜底，但新页面、页面模式和 SKILL 交付物都不要新增引用。
