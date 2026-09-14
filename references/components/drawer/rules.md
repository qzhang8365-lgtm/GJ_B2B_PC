# Drawer 抽屉

> 从 `references/design-system-rules.md` 拆分（2026-09-08）。跨组件的颜色/字体/布局/圆角等基础规范见该文件“基础规范”章节。

- 从右侧进入并保留当前页面上下文，适合关联详情、筛选和支线表单；长期独立流程应跳转页面。
- `size`：Small 400px、Medium 600px、Large 800px；优先满足内容的最小尺寸，不为留白升级档位。
- Header 高 64px、标题 16/24、600；Content 内边距 20px并独立滚动；Footer 内边距 20px，按钮高 40px、间距 8px、右对齐且最多一个 Primary。
- 只读详情可隐藏 Footer；表单提供 Cancel 与明确 Submit。Header/Footer 固定，内容超过视口只滚动 Content。
- 禁止 Drawer 内再次打开 Drawer；必要二次确认可用轻量 Modal，但避免复杂多层叠加。
- 支持 Close、Cancel、Esc；未保存时关闭或点击遮罩必须确认。打开后焦点进入并限制内部，关闭返回触发元素。
- 动效建议 240–300ms ease-out，从右向左进入、反向退出；不叠加弹跳或额外位移动画。


- 实现基座：`assets/styles/gj-b2b-components.css` 的 `.gj-drawer*` 共享类（2026-09-09 从预览页内联样式提炼，对齐 Modal 已有的 `.gj-modal-*` 模式），对应结构/颜色 Token 见 `assets/styles/gj-b2b-tokens.css` 的 `--ds-component-drawer-*`；共享基座默认即右侧覆盖面板形态，静态文档展示场景需页面局部覆盖定位属性。
