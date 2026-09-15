# Cascader 级联选择

> 从 `references/design-system-rules.md` 拆分（2026-09-08）。跨组件的颜色/字体/布局/圆角等基础规范见该文件“基础规范”章节。

#### 用途与模式

- 用于从相互关联的多级数据中逐层定位一个或多个结果，例如省市区、组织层级和事物分类。
- `mode`：`single`（级联单选）、`multiple`（级联多选）、`tree`（树状）。
- 级联与树状的模式切换必须复用 Button Tab（`gj-tabs gj-tabs-button` + `gj-tab` / `gj-tab-active`），不得用文字按钮或 `.switch` 自绘分段控件。
- 规范页与业务页必须复用 `.gj-cascader`，不得只在页面 CSS 重画菜单行。
- 表单中的 Cascader 必须由 Selector 触发器打开：默认只展示触发器，`.gj-cascader` 作为浮层面板默认隐藏，禁止把展开面板常驻在表单布局中。
- 触发器与面板通过 `aria-expanded` 同步开关状态；选择叶子节点后回填完整路径并关闭，点击外部或按 `Escape` 也必须关闭。

#### Figma 母版与默认组合

- 页 `2638:2478` 按母版口径是 **2 套 / 21 variants / 3 standalone**。三个 Menu 是独立 COMPONENT，不是组件集。规范展示画板里的实例不计入套数。
- `Cascader-Menu/Item` `2896:313`：12 个 variant。轴 `checkbox=false|true` × `state=Default|hover|checked|disabled` × `arrow=true|false`。默认 **checkbox=false, state=Default, arrow=true**（`2896:312`）。`checkbox=true` 只与 `arrow=false` 组合。
- `Cascader-Menu/Item-tree` `4208:20044`：9 个 variant。轴 `state=default|active` × `level=first|second|third` × `hover=false|true`。默认 **state=active, level=first, hover=false**（`4208:20042`）。母版没有 `default × hover=true`。
- 独立件：`Cascader-Menu` `3271:6484` 单选三列；`Cascader-Menu_checkbox` `3271:6485` 多选组合示意；`Cascader-Menu-tree` `4208:20186` 树面板。
- 组件集与独立件 description 均为空。无 Prototype reaction，无 Focus 轴。

#### 尺寸与 Token

- 级联列宽 198px、规范高度 240px、列内边距 8px。外框圆角 12px。末列无右边框。选项不足时可随内容收缩；超出 240px 出现滚动条（4px，`Text/disable`）。
- Item 高 32px、内边距 8px、圆角 4px。级联行内间距 10px（标签与右箭头）；树行内间距 4px（展开箭头与标签）。
- 树面板宽 185px、高 240px、内边距 8px、圆角 12px、填充 `Background/Container`、无描边。
- 树缩进：一级 padding-left 8、二级 24、三级 44。三级为叶子，无展开箭头。
- 文字 `中文/S8-CN-R`：PingFang SC Regular 14/22。
- 列宽、高度、内边距、圆角、缩进均为字面值，Figma 未绑 Interval / Radius 变量。颜色与文字样式已绑定。
- `Cascader-Menu_checkbox` 组合稿行高 36、面板高 232，只作多选结构示意。实现按 Item 32px 与列高 240 组装，不把 36/232 写入组件 Token。

#### 状态色

- Default：无填充，文字 `Text/Primary`。
- Hover：背景 `Background/Hover`，文字仍 `Text/Primary`。折叠树节点母版未画 hover，实现仍提供这块底。
- 单选 checked（当前路径或已选叶子）：背景 `Background/Hover`，文字 `Text/blue`。叶子可加 `icf_system_check`（`Text/blue`）。
- 多选 checkbox 选中：背景 `Background/Hover`，勾选填充 `Text/blue`、勾 `Text/reversal`，**文字保持 `Text/Primary`**。蓝字只表示当前展开路径。
- Disabled：整行 opacity 40%，文字仍绑 `Text/Primary`，不是 `Text/disable`。
- 展开箭头固定 `Text/Tertiary`：级联 `icf_Arrow_right`；树折叠 `icf_Arrow_arrow-right-large`、展开 `icf_Arrow_arrow-down-large`。不随行 hover/选中变蓝。树选中叶子不加 check 图标。

#### 展开与选择

- 初始只显示第一级，点击含子项节点后逐级展开；切换上级立即清除后续旧路径，不同时展示无效下级。
- 单选到可选叶子后提交，并按产品配置决定是否关闭。多选显示 Checkbox 并保持展开。Tree 默认折叠，通过箭头逐层展开；折叠父级时同步隐藏全部后代。
- 非叶子节点点击/Enter 会立即提交为当前值，同时展开下一层（`changeOnSelect`）；用户可以停在该层，也可以继续往更深一层选更具体的值。选中某一层后再选择其祖先或兄弟节点，会用新路径整体替换旧值，不做多值累加（多选模式除外）。Disabled 节点不可选、不可展开。（2026-09-10 设计确认，CAS-001 已关闭）

#### 键盘（本地补充）

Figma 没有 Focus variant，也没有 Prototype。键盘由代码实现，不假装稿上有焦点态。`:focus-visible` 使用 3px `Background/BT_B20`，与 Button 同源，不写入 Cascader Token。

级联多列：

- `ArrowDown` / `ArrowUp`：当前列移动。
- `ArrowRight`：含子项则展开并进入下一列首项。
- `ArrowLeft`：回到上一列当前路径项。
- `Enter`：提交当前节点为值；含子项则同时展开并进入下一列首项，用户可继续选择更深层级（`changeOnSelect`，CAS-001 已关闭）。
- `Home` / `End`：当前列首/末项。
- `Escape`：关闭面板。

树：

- `ArrowDown` / `ArrowUp`：可见节点间移动。
- `ArrowRight`：折叠则展开；已展开则进入第一个子节点。
- `ArrowLeft`：展开则折叠；已折叠则回到父节点。
- `Enter`：提交当前节点为值；含子项则同时展开/进入下一层（`changeOnSelect`，CAS-001 已关闭）。
- `Home` / `End`：第一个 / 最后一个可见节点。
- `Escape`：关闭面板。
