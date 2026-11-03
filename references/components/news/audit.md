# News audit

来源：Figma 页 `5153:14`（资讯News🆕），2026-10-26 通过 `get_metadata` / `get_design_context` / `get_variable_defs` 逐节点只读核实；inventory 归入 `business` 分组（一级分类【业务组件】）。

## 母版计数

- 组件集 1 套：`News_List`（`5153:183`）`state=Default`（`5153:122`）/ `state=hover`（`5153:204`），**2 variants**。BOOLEAN author / date / view / 摘要 不增加 symbol。
- 独立组件 6 个：`News_item/Title`（`5153:89`）、`News_item/thumbnail`（`5153:115`）、`News_item/thumbnail_large`（`5153:182`）、`News_item/news_time`（`5153:70`）、`News_item/news_view`（`5153:71`）、`News_item/author`（`5377:145`）。
- 页面无「规则说明」画板，不存在示意实例误计问题。inventory 记 **1 套 / 2 variants / 6 standalone**。

## 节点实测

- News_List：`flex gap-20 p-12`；hover 增加 `Background/Hover`（#2B73FF0D）与 `rounded-16`，其余不变。
- 内容列：`flex-col gap-12`；Title `gap-8`；摘要 14/22 `Text/Secondary`，`max-h-44`（实测 h-43）；Meta 行 `pt-8 gap-16`，单项 `gap-6`、图标 16、文本 `中文/S9-CN-R` `Text/Secondary`。
- Title 前置 Tag：22px、px 8、radius 4、`Primitive/Blue/B02` 底 / `Primitive/Blue/B07` 12/18 Semibold，等同 Tag Light Blue Regular。后置 Tag：18px、px 8、radius 12（Pill）、`Primitive/Red/R06` 底 / 白色 10/14 Regular，等同 Tag Filled Red Small Pill（Pill 实现用 999px，见 TAG-005）。
- thumbnail：180×120、radius 8；角标 22px、px 8、`rounded-tl-8 rounded-br-8`、`Background/MK_45`、白色 12/18 Semibold，即 Tag_corner black/medium/top_left。
- thumbnail_large：310×207、radius 12、`overflow-clip`；底部蒙层 `bg-gradient-to-b` `Background/MK_3 → Background/MK_80`，`pt-12 pb-16 px-16 gap-8`；标题 `中文/S4-CN-S` `Text/reversal` 单行省略；Meta 两端对齐：author（白色图标 + 文本）与日期纯文本 `2026-09-17`。
- 图标：`icf_user_user`、`icf_system_calendar`、`icf_system_eye`，均已存在于 `assets/icons/iconfont/`。

## 差异与默认处理

- **NEWS-001**（已按惯例处理）：列表内封面是 `aspect-[180/120] self-stretch`，高度跟随文字列（实测 117），宽度随之变成 175.5；摘要 h-43 也与 2×22 不符。实现固定封面 180×120、摘要 44，文字列顶部对齐，避免摘要关闭时封面缩小。
- **NEWS-002**（待 Figma 复查，P3）：摘要显隐布尔与摘要文本属性在 MCP 返回中是匿名 `propValue1` / `propValue`，Figma 侧属性名未知。代码命名 `summary` / `summaryText`，Figma 补名后同步 mapping。
- **NEWS-003**（已按惯例处理）：News_List 只有 Default/hover。补 `cursor:pointer` 与 `:focus-visible` 2px `Border/focused` 焦点环，不新增 pressed/selected 视觉。
- **NEWS-004**（已按惯例处理）：thumbnail_large 运行时按父级网格等分、保持 310:207 比例；推荐 3–4 列、gap 16。
- **NEWS-005**（已按惯例处理）：阅读量≥10000 建议显示为 `x.x万`；列表日期带星期、大卡日期不带。仅为内容格式建议，不改变组件视觉。
- **NEWS-006**（待设计确认，P2）：报告/研报列表常无封面，Figma 未提供无封面变体或 thumbnail 布尔。确认前不在基座里提供隐藏封面的修饰类，纯文字公告列表不套用 News_List。
- **TAG-007**（待前端验证，P3）：本组件需要的 Tag_corner 此前只有 `preview/tag` 页面私有 `.corner-tag` 实现，已在 `gj-b2b-components.css` 新增共享 `.gj-tag-corner` 基座（取值现有 `--ds-component-tag-corner-*`）；Tag 规范页尚未迁移到共享类。

## 实现

- 组件 Token：`references/tokens/components/news.tokens.json` → `--ds-component-news-*`（32 个变量），已接入 `build-tokens.mjs` / `validate-tokens.mjs`。
- 共享基座：`assets/styles/gj-b2b-components.css` 的 `.gj-news-*` 段，所有尺寸、颜色、间距均取自上述变量；`.gj-tag-corner` 取自 Tag 组件 Token。
- 规范页：`preview/news/index.html`，展示区与交互演示只使用共享类；「规格」区数值由脚本从 `--ds-component-news-*` 实时读取，不在页面里手写。

## 校验记录（2026-10-26）

- `node scripts/build-tokens.mjs`、`validate-tokens.mjs`、`build-coverage.mjs --check` 全部通过；coverage 中 News 四项均为 complete。
- Playwright 1280/760 宽实测：列表项 封面 180×120、标题行 24、摘要 44（2 行截断）、Meta 26、Hover 背景 rgba(43,115,255,.05)；无横向溢出、无控制台报错与 404。
- `verify-page.mjs` 曾报 `.gj-news-meta-item` gap 6px 不在间距阶梯，已随 NEWS-008 改为 4 解决。其余为封面角标/大卡蒙层叠放、图标与相邻标签颜色不同等预期的人工确认项。

## 结论

News 为 `figma-audited`。开放项见文末追加记录：NEWS-007（P3 待设计确认）、TAG-007（P3 待前端验证）。

## 2026-10-26 追加：无图片占位封面、属性真名与元信息间距

- 用户提供节点 `5377:358`：原独立组件 `News_item/thumbnail` 已升级为组件集 **News_item**，`Property 1=thumbnail`（`5153:115`，有图）/ `Property 1=Variant2`（`5377:359`，无图片占位封面），BOOLEAN `Cornertag#5377:9`。两态均 180×120、圆角 8，占位态仍带 Tag_corner 实例。
- 占位图为图片填充（imageHash `1589e52e…`，360×240，54,437 bytes）。通过 `use_figma` 只读方式按原始像素导出，落地为 `assets/images/news/thumbnail-placeholder.png`，与 Figma 原图字节数一致；`.gj-news-thumb`、`.gj-news-card` 以该图作背景，无 `<img>` 或加载失败时自动显示。
- inventory 更正为 **2 套 / 4 variants / 5 standalone**。
- **NEWS-002 关闭**：`use_figma` 只读读取 `componentPropertyDefinitions`，属性真名为 News_List `摘要`（BOOLEAN `摘要#5376:1` + TEXT `摘要#5153:3`）、`author#5377:0`、`date#5377:3`、`view#5377:6`；Title `LeftTag#5376:4`、`RightTag#5153:0`、`Text#5153:1`。mapping.json 已同步。
- **NEWS-006 关闭**：无封面条目使用 Variant2 占位封面，列表结构不变。
- **NEWS-007**（待设计确认，P3）：`Property 1` / `Variant2` 为 Figma 默认命名，建议改为 `type=image / placeholder`；改名后同步 mapping/tokens。
- **NEWS-008 关闭**：元信息图标与文字间距按用户指示由 6 改为 4，只读复核 author / news_time / news_view 的 itemSpacing 均为 4；Token 改为 `Interval/space2`，原 `verify-page` 6px 阶梯告警随之消失。
- 规范页示例封面改用 Figma 原示例图（`assets/images/preview/news-sample.jpg`，同法导出），不再借用 Image 组件样例图。

## 2026-10-26 追加：封面随内容缩放、列表间距与分割线

- **NEWS-007 关闭**：Figma 已改为 `type=image / placeholder`，只读复核 `5377:358` 属性定义一致；mapping、schema、Token 同步改名。
- **NEWS-001 修订**：用户在规范站发现无摘要时右侧大块空白。只读复核 News_List 内封面实例 `5153:116`：`layoutAlign=STRETCH`、`targetAspectRatio 180:120`，即封面高度跟随内容、宽度等比。原「固定 180×120」默认处理撤回。实现：`.gj-news-item` 用 `:has()` 判断摘要 / Meta 是否存在，算出内容列高度（24 + 12+44 + 12+8+18）赋给封面高度，`aspect-ratio:180/120` 推宽；`img` 改为绝对定位，避免原图尺寸撑开。实测：有摘要 177×118、无摘要 93×62。摘要区固定两行高 44（对应 Figma 固定高文本框）。
- **NEWS-009 关闭**：列表项之间上下间距改为 0（`--ds-component-news-list-gap` → `Interval/space1`）。
- **NEWS-010 关闭**：新增分割线列表 `.gj-news-list-divided`。Figma 无专门画板，按 Divider 规则 inset=content 处理：`Border/default` 1px，左右缩进 12 与内容对齐，末项无线；悬停/聚焦项自身与上一项的线隐藏（`:has()`），避免压在浅蓝背景边缘。
- 规范页：「资讯列表」并排展示默认列表与分割线列表；交互演示新增「展示方式：单条 / 列表 / 列表 + 分割线」，配合摘要开关可直接看到封面缩放与列表节奏；规格表新增分割线与宽高比行，仍从 Token 实时读取。
- 校验脚本：`verify-page.mjs` 原把 News 标题单行省略、摘要两行截断判为阻断性 overflow。已补充豁免——元素自身声明 `text-overflow:ellipsis`（横向）或 `-webkit-line-clamp`（纵向）时，该方向的裁切视为组件规则内的省略；其余裁切判定不变。News 页复跑后无阻断项。

## 2026-10-26 追加：规范页结构调整与分割线留白

- **NEWS-011 关闭**：用户指出分割线紧贴上下条目显得拥挤。新增 `--ds-component-news-list-divider-spacing`（Interval/space2 4px），`.gj-news-list-divided` 的项间距改为 4 + 1 + 4 = 9px，分割线画在间隙正中；悬停隐藏规则不变。同时写入规则：同一列表摘要统一显示或隐藏，不混排。
- **NEWS-012 关闭（规范页）**：按用户意见重排 `preview/news/index.html`：资讯列表左右并排「有摘要 / 无摘要」两列，不再混排；分割线列表单独一节只展示一种；状态 Default / Hover 左右排；组成部件改为一行三卡（封面 image/placeholder、Title、Meta）；图片大卡只展示有图 / 无图占位两种，并以 `.gj-news-card.is-authored` 按 Figma 母版 310×207 展示（此前按网格等分渲染为约 365×243，比母版大）；交互演示直接以列表展示，展示方式选项收敛为「分割线」开关，摘要与元信息开关作用于整列；结构与规格由 28 行表格改为与 Metric / Timeline 一致的 6 张规格卡，数值仍从 Token 实时读取。
- **NEWS-013 关闭**：按用户指示，元信息（作者 / 日期 / 阅读量）文字与图标由 `Text/Secondary` 改为 `Text/Tertiary`（`--ds-component-news-meta-color`），与摘要拉开层级；大卡元信息仍为 `Text/reversal`。
- **NEWS-014 已关闭（2026-11-03只读复核）**：Figma `5153:204`「state=hover」圆角及四角均已为12，与本地`Radius-LG`、共享基座一致。
- **NEWS-015 关闭**：按用户指示确立 LeftTag 与 Cornertag 默认互斥，只有业务需求明确两者承载不同标签类型（如分类 + 来源栏目）时才允许同时显示。已写入 rules（标签使用）、schema `constraints`、mapping `dependencyRules`；Token 中 cornertag 生成默认改为 false（Figma 母版默认仍为 true，属于展示默认，不是组合规则）。规范页：有摘要 / 无摘要列表只用前置标签，分割线列表只用封面角标，状态示例只用前置标签；交互区两者联动互斥，并提供「承载不同标签类型」例外开关。

## 2026-10-26 追加：列表统计栏（筛选结果条）

- 用户提供 `5377:383`：独立组件「列表统计栏」，784×22，HORIZONTAL / SPACE_BETWEEN / 居中；左组 gap 4：「已为您筛选」中文/S9-CN-R Text/Secondary、「9999+」中文/S5-CN-S Text/Primary、「篇资讯」S9 Secondary；右侧「按发布时间排序」S9 Secondary。无组件属性。inventory 独立组件 5 → 6。
- 使用场景（用户说明）：只用于筛选或搜索后的列表统计，不筛选、不搜索时不显示。写入 rules / schema `behavior.stats`。
- **NEWS-016 关闭**：实现细节按惯例默认：左右缩进 12 与列表项内容对齐，与列表间距 4；单位文本框固定宽 159、排序文本框 91 为 Figma 排版占位，运行时按内容；数量 >9999 显示 `9999+`；0 结果保留统计栏并配 Empty；右侧排序为说明文字。新增 `--ds-component-news-stats-*` Token 与 `.gj-news-stats*` 基座，规范页新增「筛选结果条」一节，交互区新增开关。

## 2026-10-26 追加：资讯详情页模板（页面间距规则）

- 用户提供 `5377:980`「模板」，要求只沉淀详情页间距 / 边距规则，不做组件、不进预览站。use_figma 只读读取各层 auto-layout：模板 VERTICAL gap 16；Title 卡 padding 20 / gap 12 / radius 12 / Background/Container；详情主栏 → 报告标题卡片 padding 20 / gap 20 / radius 12；PDF 全文入口 padding 16 / gap 12 / radius 10 / Background/Background，文件信息 gap 2；正文组 gap 16，组内 gap 8；免责声明 padding 16/0 / gap 16，标题行 gap 4，评级说明 gap 8。文字样式与颜色变量见 rules.md。写入 rules.md「资讯详情页模板」与 schema `pageTemplates.detail`；未新增 Token、CSS 或预览内容。
- 结构说明：「详情主栏」与「报告标题卡片」为同底色同圆角的双层嵌套，规则中注明实现合并为一张卡；「标题元信息」与「免责声明标题」帧填充为未绑定变量的纯白，与白色卡片同色，不影响视觉，按无填充处理。
- **NEWS-017**（待设计确认，P3）：PDF 全文入口圆角为 10，不在 4 / 6 / 8 / 12 圆角阶梯内，按圆角规则嵌套在 L1（12）内的分区通常用 L2 8。规则暂按模板记 10，设计确认改 8 或保留 10 后关闭。
- **NEWS-018**（待 Figma 复查，P3）：「查看免责声明」文字绑定的颜色变量名为 `Text/Tiatery`，本地语义色库无此变量，疑为 `Text/Tertiary` 的拼写重复变量。规则按 `Text/Tertiary` 记录；Figma 改绑或确认变量后关闭。
- **NEWS-017 关闭**：用户确认按 8；只读复核 `5377:917` 圆角已为 8 并绑定 `Radius/Radius-MD`，rules / schema 同步。
- **NEWS-018 关闭**：用户已在 Figma 修正误绑；只读复核 `5377:933` 文字颜色绑定 `Text/Tertiary`。

## 2026-10-29 完整性检查

- **NEWS-019 已关闭**：契约声明图片失败露出占位背景，但此前无共享失败处理。新增 `assets/scripts/gj-news.js`，捕获初始及动态封面error/load，失败隐藏图片、恢复后显示；保留占位背景和原生链接，已登记library-index与mapping。
- Default/Hover/Focus状态补入组件Token状态矩阵；规范页移除共享CSS专属查询参数并更新图标/图片内嵌数据。
- 当次NEWS-014仍待Figma复核；2026-11-03已复核为12并关闭，见上文。
- 验收：1440/1280无溢出和页面错误；检查器提示的角标叠图、封面叠字为设计结构，colgroup与thead/tbody为表格结构误报；元信息图标实测与文字同为Text/Tertiary，检查器与不相关Tag配对产生的色差提示已排除。HTTP实操摘要显隐、前置标签与角标互斥、动态坏图及图片恢复通过；内嵌资源门禁通过。
