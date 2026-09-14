# Sidebar 侧边栏导航

> 从 `references/design-system-rules.md` 拆分（2026-09-08）。2026-09-10 按页 `2638:1003` 只读核对：4 套母版 / 26 variants / 0 standalone。跨组件基础规范见该文件“基础规范”章节。

## 组合容器 `Sidebar_menu_*`

用户确认：三套只有表面色差别，结构相同。不要按颜色分叉布局。

- 三套母版，每套 `state=expanded | collapsed` 两态，**计入 variants 列**（2+2+2=6），不是 6 套。默认 `expanded`。
- `expanded`：栏宽 **200**。`collapsed`：栏宽 **56**。样本高 420（品牌 56 + 菜单 364），高度随条目变化。整栏 `state` 与行级 `collapse` 不是同一轴。
- 结构：品牌区 + 菜单列表。品牌高 **56**，水平 **16**、垂直 **12**。展开时左 **110×24** 品牌槽、右折叠 `icf_Arrow_fold` **24**（实例 23.88）。收起时隐藏品牌图，只居中 `icf_Arrow_expand`。品牌槽是整槽图形，不是手写字标。
- 菜单：内边距 **8**，条目间距 **4**。条目用 `sidebar_item`，在栏内拉满（200−16=**184**），不要再锁 176。
- 表面：
  - `light`：`Background/Container`，行用 item light；折叠图标 `Text/Secondary`
  - `blue`：`Primitive/DeepBlue/DB10`，行用 item dark；折叠图标 `Text/reversal`
  - `background`：`Background/Background`，行用 item light
- 静态基座：`gj-sidebar`；blue 加 `gj-sidebar-blue`；background 加 `gj-sidebar-background`；整栏收起加 `is-collapsed`。
- 一级/二级同时展开的可见样本：浅色实例 `4156:958`、深色实例 `4769:3370`（均为 200×612）。Default 变体里同结构图层是 hidden，以这两个实例为准。
- 一级展开后，二级列表左侧加 **1px** 饰条。浅色表面（light / background）用 `Background/MK_10`；深色表面（blue）用 `Background/BT_DB20`（`4769:3370` 的 Divider Line 已绑定该变量）。不要两边都用 `Border/default`。子树容器 `pl-20`、饰条与列表间距 **4**。二级展开后的三级列表再左缩 **12**。子树内条目垂直贴齐（间距 0）。整栏收起时隐藏子树。
- 一级分支默认手风琴：同一时间只展开一个一级。展开的一级/二级为 Active（加粗、箭头朝上、无选中底）；当前页为 Selected。
- 栏宽**全量使用母版**：展开 **200**、收起 **56**。不随 1280–2560 视口改成 208/240/288，也不用收起 64/80。同页标注表 `3987:994` 的 `layout.sider.*` 不是 Token，不要写进 layout Token 或页面壳。

## 导航行 `sidebar_item`

- 属性：`mode=light|dark`（默认 light）、`Level=first|second|third`（默认 first）、`collapse`（默认 false）、`active`、`selected`、BOOLEAN `collapsebutton`（生成代码默认 true）、一级 `icon` 插槽。
- 发布了 **20** 个子变体，稀疏矩阵。second/third 没有收起态；third 没有「仅 active 未选」；first 收起没有「仅 active 未选」。
- 原子母版展开行宽 **176px**。放进 200 栏后拉满内容宽。收起仅一级 **40×40**。
- first / second 高 **40px**；third 高 **36px**。
- 水平 padding **12px**（third 只有左 12）。主行间距 **8px**。
- 圆角：first 默认 **4px**；first 的 active/selected 以及 second/third **8px**。
- Active：加粗、箭头朝上，**不加**选中底。Selected：加粗 + `Background/Hover`。祖先保持 Active。
- 结构：first = 16px 图标 + 文案 + 可选箭头；second = 4px 圆点 + 文案 + 可选箭头；third = 仅文案。二级点用 CSS 圆。
- Light：一级默认 `Text/Primary` + `S8`；强调 `Text/blue` + `S5`。一级图标跟随文案色（默认 Primary，Active/Selected 为 blue）。展开箭头仅在 light 默认态用 `Background/MK_20`，强调态跟随文案。Dark：一级文案与图标、箭头都是 `Text/reversal`；二/三级 `DB04`。不要把 MK_20 套到一级图标上。
- Figma 子组件未发布 Hover / Disabled 变体。代码规则（浅色、深色相同）：Hover 在当前默认外观上叠加 `Background/Hover`；Disabled 整项透明度 **50%**。不要另造 Hover-2。
- 基座：`gj-sidebar-item`，深色加 `-dark`，层级加 `-second` / `-third`，收起加 `-collapsed`，禁用加 `is-disabled` 或 `disabled`。

## 尚未核实

- 收起态 Hover 完整名称提示。
