# Timeline 时间轴

> 从 `references/design-system-rules.md` 拆分（2026-09-08）。跨组件的颜色/字体/布局/圆角等基础规范见该文件“基础规范”章节。

- 用于事件历史和阶段记录；方向为 Vertical/Horizontal，节点样式为 Dot/Checkmark，状态为 Finished/Waiting。
- 纵向节点容器 20×20px，Dot 10×10px，Checkmark 16px；标题 中文/S5-CN-S，纵向说明 中文/S9-CN-R，横向 cell 说明 中文/S8-CN-R。
- 连接线绑定 Border/hover；Waiting 只改节点色。
- 横向单元基准 155×112px；详情多或节点多时用纵向，横向只用于数量有限且阶段清晰的进程。
- 默认按真实时间正序；若使用倒序必须明确并在页面内一致。日期粒度和格式统一。
- Finished 节点连续，Waiting 不夹在已完成节点之间；Checkmark 只表示完成，不表示当前或异常。
- 标题可换行，详情建议 1–3 行，更多内容使用展开或详情入口。横向不足时切换或滚动，不缩窄文字。
- 默认不可点击；只有允许查看详情时让标题或整项可点击。无数据使用 Empty，加载保持稳定容器。


- 实现基座：`assets/styles/gj-b2b-components.css` 的 `.gj-timeline*` 共享类（2026-09-09 从预览页内联样式提炼），对应结构/颜色 Token 见 `assets/styles/gj-b2b-tokens.css` 的 `--ds-component-timeline-*`；横向翻页按钮复用 `.gj-icon-button` 基座（2026-09-10 起该基座 Hover 只变图标颜色、不叠加背景，见 BTN-006）。
