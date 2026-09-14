# Sidebar Figma 审计

来源：页 `2638:1003`「侧边导航栏SideBar✅」。2026-09-10 只读。未修改 Figma。

inventory 更正为 **4 套 / 26 variants / 0 standalone**。旧 7/20 是误记。

MCP 把母版标成 `<frame>`、变体标成 `<symbol>`。按图层名 `属性=值` 认母版。Plugin API 确认这 4 个顶层节点的 `type` 就是 `COMPONENT_SET`。

## 2026-09-10 SNB-001 页级口径

页上 **7 个顶层节点**，只有 4 个是母版：

| 顶层 | 节点 | 类型 | 计 inventory |
|---|---|---|---|
| `sidebar_item` | `4148:17361` | COMPONENT_SET | 1 套 / 20 variants |
| `Sidebar_menu_light` | `4148:18584` | COMPONENT_SET | 1 套 / 2 variants |
| `Sidebar_menu_blue` | `4148:18773` | COMPONENT_SET | 1 套 / 2 variants |
| `Sidebar_menu_background` | `4148:19075` | COMPONENT_SET | 1 套 / 2 variants |
| `Sidebar_menu` | `3030:1065` | FRAME | 否。规范展示画板，内部是实例 |
| `Frame 1312324747` | `3134:1789` | FRAME | 否。旧壳标注 + `layout.sider` 表 |
| `Sidebar_menu_blue` | `4769:3370` | INSTANCE | 否。蓝底展开树样本，主组件 `4148:18772` |

三套菜单各 `state=expanded | collapsed` **计入 variants 列**（6），不是 6 套。默认 `expanded`。合计 20+2+2+2=**26**。独立件 0。

旧 7/20 的成因：把 7 个顶层都当成 `sets`，`variants` 只抄了 `sidebar_item` 的 20。这是「看见几个块去对套数」+「菜单两态没进 variants」。

### 其余 3 个顶层（已读，不是套）

1. **展示画板** `3030:1065` — 浅/深/背景色展开与收起、全部收起 / 展开一级 / 展开二级。实例指向已读三套菜单。文案确认：背景灰色侧栏可把视觉重心留给主界面；一级展开后二级左侧加浅色饰条；无操作=默认，触发=高亮加粗且不等于选中，选中=高亮+`Background/Hover`。
2. **标注框** `3134:1789` — 左侧是手搭旧壳（不是 `sidebar_item` 实例），标注 200 / 40 / 4 / 16 / 24 / 8。表 `3987:994` 原文：

   | 全屏 | 展开 | 收起 | 行高 | 行距 | Token |
   |---|---:|---:|---:|---:|---|
   | 1280 / 1366 / 1440 | 200 | 64 | 40 | 4 | `layout.sider.sm/md/lg` |
   | 1536 | 208 | 64 | 40 | 4 | `layout.sider.lgPlus` |
   | 1920 | 240 | 80 | 40 | 8 | `layout.sider.xl` |
   | 2560+ | 288 | 80 | 44 | 8 | `layout.sider.xxl` |

   与组件母版 **200 / 56 / 40 / 4** 冲突。**2026-09-10 用户确认全量使用母版宽度**，该表不是 Token（SNB-007 已关闭）。
3. **蓝底展开实例** `4769:3370` — `state=expanded`，200×612。结构与浅色 `4156:958` 相同：子树 `pl-20`、gap 4、饰条 1×188、三级再左缩 12。Divider Line 绑定 **`Background/BT_DB20`**（SNB-006 的深色样本）。表面 `Primitive/DeepBlue/DB10`，行用 item dark。该实例若干一级仍是 default 而非 Active；Active 规则仍以 `4156:958` 为准。

## 组合容器（3 套 × 2 态）

用户确认：整体只有样式差别，没有结构差别。

| 套 | 母版 | expanded | collapsed | 表面 | 行 mode |
|---|---|---|---|---|---|
| Sidebar_menu_light | `4148:18584` | `4148:18563` 200×420 | `4148:18585` 56×420 | `Background/Container` | light |
| Sidebar_menu_blue | `4148:18773` | `4148:18772` 200×420 | `4148:18774` 56×420 | `Primitive/DeepBlue/DB10` | dark |
| Sidebar_menu_background | `4148:19075` | `4148:19076` 200×420 | `4148:19098` 56×420 | `Background/Background` | light |

共用结构：

- 列：品牌 56 + 菜单。expanded 宽 **200**，collapsed 宽 **56**
- 品牌：`px-16 py-12`。展开：110×24 品牌槽 + `icf_Arrow_fold` 24（实例 23.88），图标 light 为 `Text/Secondary`、blue 为 `Text/reversal`。收起：隐藏品牌图，居中 `icf_Arrow_expand`
- 菜单：`p-8`、`gap-4`。展开条目宽 184（拉满）；收起条目 40×40
- 品牌槽 110×24：MCP 导出 2783×618 整图画布，Figma 用 overflow 裁进槽内。预览缩放到槽尺寸。blue 用白色反色层。

## 一级 / 二级同时展开

可见样本：浅色实例 `4156:958`，蓝底实例 `4769:3370`，均为 200×612。用户确认一级展开后，二级列表左侧加浅灰饰条。

- 展开的一级：Active，箭头朝上，无选中底（以 `4156:958` 为准）
- 子树 `Frame 1635095768`：宽 184；`pl-20`；与饰条间距 4
- 饰条：垂直 Divider **1×子树高**。浅色 `Background/MK_10`，深色 `Background/BT_DB20`。`4769:3370` 的 Line 已绑定 `BT_DB20`。
- 二级：宽 159，高 40，0 间距。展开的二级为 Active
- 三级组：再左缩 12，行高 36，0 间距。当前页 Selected = `Background/Hover` + 加粗
- Default 变体里同一子树 hidden。不以 hidden 图层当缺口

## 导航行 sidebar_item（1 套 / 20 子变体）

稀疏矩阵。展开母版宽 176；first/second 高 40；third 高 36；收起 40×40。选中底 `Background/Hover`。二级点 4px CSS 圆。默认变体 `4148:17357`：`mode=light, Level=first, collapse=false, active=false, selected=false`。

Light 强调 `Text/blue`；Dark 一级 `Text/reversal`，二/三级 `DB04`。

一级 **图标跟随文案**：默认 `Text/Primary`（`4148:17154`），不是 `Background/MK_20`。`MK_20` 只绑在 light 默认 **箭头**（`4148:17156`）。Active/Selected 图标与箭头均为 `Text/blue`。dark 图标与箭头均为 `Text/reversal`。

Hover / Disabled **未发布变体**。2026-09-09 用户确认代码规则：Hover = 默认态 + `Background/Hover`（浅色深色相同）；Disabled = 透明度 50%。SNB-002 关闭。

## 相对旧 rules 的核对

1. 组合栏宽全量用母版 **200 / 56**。标注表 208/240/288 与收起 64/80 已否决（SNB-007）。
2. 条目在栏内是 **184**，原子母版 176 仍成立，只是组合里被拉满。
3. `mode=Background` 对应 `Sidebar_menu_background`，不是 item 轴。SNB-003 关闭。
4. 一级展开饰条结构在 `4156:958` / `4769:3370` 核实为 1px 竖线。颜色：浅色 MK_10，深色 BT_DB20（SNB-006）。

## 开放项

1. **SNB-001 · P2 · 已关闭（2026-09-10）** — inventory 4/26/0。菜单 2 态计入 variants。其余 3 个顶层已读，不是套。
2. **SNB-002 · P2 · 已关闭** — Hover/Disabled 不补 Figma 变体；代码用 Background/Hover 与 50% 透明。
3. **SNB-003 · P2 · 已关闭** — 三套组合表面。
4. **SNB-004 · P3 · 已关闭（2026-09-10）** — Figma 已改为 `state=expanded | collapsed`。三套默认 expanded。节点 ID 未变。整栏 state 与行级 collapse 不是同一轴。
5. **SNB-007 · P3 · 已关闭（2026-09-10）** — 用户确认全量使用母版宽度：展开 200、收起 56。标注表 `3987:994` 的 `layout.sider.*` 不是 Token，不按视口改栏宽。

## 结论

页级母版已读完。Selector 同口径：showcase / 标注 / 实例不计套。`pendingExtraction` 为空。组件保持 `figma-audited`。栏宽 Token 锁定母版 200/56（SNB-007）。

## 2026-09-11：清理预览页残留旧 CSS（新增并关闭 SNB-008）

背景：延续 MDL-010（见 `components/modal/audit.md`）建立的方法，对 `preview/sidebar/index.html` 做同样的死代码核查——用户明确的标准原则是预览页无论静态展示区还是交互区，都应该只用标准组件基座渲染，不应该残留旧 CSS。

排查方法：同 MDL-010，解析页面全部 `<style>` 块，提取每个选择器涉及的类名，逐个类名对照页面真实 `class="..."` 属性（含 JS 动态拼接的模板字符串）确认是否被引用；复合选择器按逗号拆分成分支逐项判断，只删除全部分支都确认无引用的规则，混有真实类的复合选择器保留但裁掉死亡分支。

整条规则删除（4 条）：`.board-card`、`.board-card h3`、`.row`、`.row>span`。

验证：脚本二次扫描确认页面残留死选择器为 0；`<style>` 块大括号计数与逐字符深度校验均通过（与 button.html 同批次校验时一并发现并排除结构性错误）；本文件删除/裁剪的选择器均逐一比对过页面真实 `class="..."` 与 `classList` 调用，确认为未引用的旧代码，属于低风险清理，未单独截图复核。

结论：SNB-008 已关闭。`preview/sidebar/index.html` 内嵌 CSS 现在只包含仍被页面实际使用的选择器。
