# Selector 选择器

> 从 `references/design-system-rules.md` 拆分（2026-09-08）。跨组件的颜色/字体/布局/圆角等基础规范见该文件“基础规范”章节。

#### 用途与模式

- 从已知候选项选择值。触发器展示当前值与展开入口；展开面板遵循 Dropdown。
- `mode`：`single` / `multiple` / `cascade` / `tree`。少量平级选项且空间允许时优先 Radio 或按钮组；行政区划用 Cascade，组织或权限层级用 Tree。
- 级联与树状的面板分别复用 Cascader，不在 Selector 页另开母版。规范展示画板里的实例不计套。
- 规范页与业务页必须复用 `.gj-selector`、`.gj-selector-item`，不得页面私有方块标签。

#### Figma 母版与默认组合

- 页 `2638:2419` 按母版口径是 **3 套 / 36 variants / 0 standalone**。旧 inventory `2 / 42` 把 `select_basic`+`select_multiselect` 的笛卡尔积当成 variant 数，并漏记 `Selection-Item`。
- `select_basic` `2889:3782`：15 个 variant。默认 **Size=Middle, State=Default, Disabled=false, Tags=false**（`2889:3781`）。缺 `focused + Disabled=true` 三档。`Tags` 只有 `false`。
- `select_multiselect` `4208:19225`：12 个 variant。默认 **size=Middle, state=defaut, focused=false**（`4208:19413`）。`defaut` 是拼写错误，本地归一为 `default`。`focused` 布尔轴与 `state=focused` 重复，只出现在 disable 三个 variant 上；实现忽略该布尔轴（SEL-001）。
- `Selection-Item` `2889:3999`：9 个 variant。默认 **Size=middle, Closeicon=true, disabled=false**（`2889:3998`）。缺 `Closeicon=true × disabled=true`：禁用标签不画关闭图标。
- 三套 description 均为空。无 Prototype reaction。无 Hover / Error 轴。

本地 API 继续使用 `size=small|medium|large`、`status=default|error`、独立 `disabled`。Figma 的 `Middle/middle`、`defaut`、`disable` 只做映射，不进入代码。

#### 尺寸与 Token

- Small 24×198、圆角 4、左右 8；Medium 32×198、圆角 6、左右 8；Large 40×198、圆角 8、左右 12。行内间距 10。箭头 `icf_Arrow_down` 16。
- 触发器 Small/Medium 用 `中文/S8-CN-R` 14/22；Large 用 `中文/S7-CN-R` 16/24。
- 高、圆角、内边距为字面值，与 `Components/control-S|M|L`、`Radius-XS|SM|MD`、`Interval/space3|4` 同值，节点未读到 Dimension 绑定。
- Selection Item：Small 高 16、Medium 24、Large 32。填充 `Background/Secondary`。Small/Medium 圆角 4（Small 绑 `Radius/Radius-XS`），Large 圆角 6。关闭图标 `icf_system_close-md`，Small/Medium 12、Large 16，色 `Text/Tertiary`。标签字 Small/Medium `中文/S9-CN-R` 12/18，Large `中文/S7-CN-R`。
- 产品宽度默认 160–240px，Figma 展示稿 198。极窄可到 120px。完整表单单列、移动断点或明确设计实例才可拉满容器。Dropdown 不窄于触发器。

#### 状态色

- Default（空）：`Background/Container` + `Border/secondary`，文字 `Text/disable`（Placeholder）。
- Selected：同底同边，文字 `Text/Primary`。
- Focused：边框 `Border/focused`。稿上无额外阴影；代码 `:focus-visible` / 展开态使用 2px `Background/BT_B8`，属本地补充。
- Disabled：填充 `Background/Background`，描边仍是 **`Border/secondary`**（不是 `Border/disabled`）。空值文字 `Text/disable`；**有值文字仍 `Text/Primary`**。箭头保持 `Text/Tertiary`。
- 缺 focused+Disabled：Disabled 优先，不画 Focus 环。
- 无 Hover variant：代码 Hover 边框 `Border/hover`，本地补充。
- 无 Error variant：`status=error` 用错误描边，本地补充。
- 芯片禁用：整颗 opacity 50%，无关闭图标，文字仍 Primary。

#### 选择与交互

- 空值时 Trigger 显示 Placeholder；Placeholder 不属于候选数据，不得生成 Dropdown Item，也不可获得 Focus、Selected 或勾选图标。
- 单选提交必须作为一次完整更新：清除旧选中项、设置新选中项、同步触发器文字与表单值、发出 Change，再关闭菜单并把焦点返回触发器。
- 多选以可删除 Selection Item 呈现，选择后保持面板展开。标签过多时折叠计数或限制可见项。Disabled 标签不可删除。
- 搜索只过滤候选项，不清空已选值。Clear 只在有值、可清除且未禁用时出现，不与展开箭头抢同一热区。
- 触发器 `role=combobox`。键盘：Enter / Space / ArrowDown 打开；ArrowUp/Down/Home/End 移动；Enter/Space 选中；Escape/Tab 关闭。Figma 无 Prototype，键盘为本地补充。
