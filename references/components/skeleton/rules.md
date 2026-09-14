# Skeleton 骨架屏

> 从 `references/design-system-rules.md` 拆分（2026-09-08）。跨组件的颜色/字体/布局/圆角等基础规范见该文件“基础规范”章节。

> 2026-09-09 已完成 local-contract 补充（未逐项做 Figma 节点核实，用户确认按通用骨架屏惯例即可）。

- 仅用于结构可预期的首次加载，类型包括文字段落、列表、内容卡片和表格；不表示 Empty 或 Error。
- 单行文字高 12px、圆角 4px（`Radius/Radius-XS`），多行宽度应变化且末行较短；头像与真实尺寸一致、圆形；图片保持真实宽高比和圆角；表格保留真实列宽、表头和行高。
  - **文字类占位必须是小圆角矩形，不能是大圆角条**：12px 行高若配 6px 圆角，两端会呈现完全半圆（视觉上等同胶囊/大圆角条）；改用 4px 能保留可辨识的直角过渡。2026-09-09 已把本文件与 schema.json 的记录从 6px 修正为 4px，与预览页 `preview/skeleton/index.html` 实际生效的 `.line{border-radius:4px!important}` 对齐（头像等本身即为圆形的元素不受此约束，仍用 999px 全圆）。
- 数量、层级、宽高比和间距应接近最终内容，避免加载完成时布局跳动。无法预估结构时使用通用 Loading，不编造骨架。
- 同一区域不同时显示 Skeleton、旋转 Loading 和“加载中”文字；局部刷新只替换对应区域，不遮挡已可用内容。
- 超时或失败后必须停止动效并切换到错误说明与重试；不能无限展示 Skeleton。
- 支持静态与加载动效；系统启用 reduced motion 时关闭流光，保留静态结构。


- 实现基座：`assets/styles/gj-b2b-components.css` 的 `.gj-skeleton*` 共享类（2026-09-09 从预览页内联样式提炼），对应结构/颜色 Token 见 `assets/styles/gj-b2b-tokens.css` 的 `--ds-component-skeleton-*`；`.is-reduced`/`.is-paused` 用于让外层容器手动强制关闭动效，独立于系统级 `prefers-reduced-motion`。
