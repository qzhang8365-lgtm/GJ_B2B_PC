# Dropdown 下拉菜单

> 从 `references/design-system-rules.md` 拆分（2026-09-08）。跨组件的颜色/字体/布局/圆角等基础规范见该文件“基础规范”章节。

- 是 Selector 等触发器的候选面板，支持 Single/Multiple；Placement：无箭头或 Top/Bottom 的 Left/Center/Right 六个方向。
- Dropdown 是全局共享浮层组件。Selector、Cascader、Tree Selector、Date/Time Picker 等只能组合该组件，不得复制专用的菜单容器或选项类；静态基座统一使用 `gj-dropdown`、`gj-dropdown-item` 和 `gj-dropdown-label`。
- 选中态由 `gj-dropdown-item` 的 `aria-selected` 单一驱动：单选的勾选图标用 `gj-dropdown-check`，多选的勾选框用 `gj-dropdown-checkbox`，两者都是纯视觉指示器（需标记 `aria-hidden`），不得改用裸 `input` 或页面自绘的假控件。
- 指向触发控件的箭头使用 `gj-dropdown-pointer`，方向与对齐由 `gj-dropdown-pointer-top / -bottom` 和 `-left / -center / -right` 组合表示。箭头必须是面板的兄弟节点并与面板一同包在 `gj-dropdown-shell` 内：面板自身要裁剪滚动内容，放在面板内部会被裁掉。
- 默认宽约 198px、高 240px，内边距 8px、圆角 8px；选项高 32px、圆角 4px。宽度默认与触发器一致，可因长内容扩展但不可窄于触发器。
- 单选完成后关闭；多选保持展开以连续选择；点击外部或 Esc 关闭并将焦点返回触发器，Tab 关闭后继续正常焦点顺序。
- 上下键移动焦点，Home/End 移至首尾可用项，Enter/Space 选择；Hover 只作用当前项。选项过长单行省略并提供完整名称提示。
- 单选模式在任何时刻只能有一个 `aria-selected=true`，且只有这个选项可以显示勾选图标。`hidden` 选中标记不得被基础 `display` 样式覆盖；Hover、Focus 或 Active descendant 都不能使未选项出现勾选图标。
- 键盘活动项属于 Focus，不得复用 Selected 类、选中背景语义或选中图标；当焦点移动到未选项时，原选项保持唯一 Selected，当前项仅显示焦点轮廓。重新打开菜单时聚焦当前选中项；未选择时聚焦第一个可用项。
- 组件更正必须先做旧实现清理审计：检查共享脚本、页面内联脚本、历史兼容脚本、样式入口与缓存版本，删除重复初始化入口和失效状态覆盖，再接入新实现。禁止保留两套同时运行的组件逻辑；验收时检查实例数量、生成 DOM 数量、加载资源和事件行为，确认页面只存在一个权威实现。
- 箭头只在需要明确指向关系时显示，并与触发控件对齐；选项按业务逻辑稳定排序。
- 状态优先级固定为 `Disabled > Selected > Focused > Hover > Default`。Disabled 不接受指针或键盘激活；Selected 是持久值状态；Focused 只表示当前键盘活动项，不改变值。
- 面板超出可用视口时优先翻转上下方向，再限制 `max-height` 并仅让选项区滚动；不得把触发器推离原位置或让面板被父容器裁切。
- 列表较长时支持键盘字符查找：在短时间内输入字符应将 Focus 移到下一个匹配的可用项，但不自动选中。需要真正过滤时组合可搜索 Selector，不在普通 Dropdown 里自由添加输入框。
- 异步选项必须有 Loading、Empty 和 Error/重试状态。请求返回时只能用稳定 value 恢复选中项，不能根据文案或临时索引猜测。
- 如果选项被动态删除：单选值变为空值并恢复 Placeholder；多选只移除失效值。这类外部同步必须发出可识别的变更，不静默显示旧文案。
