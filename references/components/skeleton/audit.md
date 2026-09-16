# Skeleton audit

来源：`references/components/skeleton/rules.md`、已验收预览页 `preview/skeleton/index.html`、inventory 页面 `Skeleton✅`。2026-09-09 用户明确：骨架屏也没问题，按通用骨架屏惯例补充即可，不需要走 Figma `get_design_context` 逐项核实。走 `local-contract` 路径（与 Chart、Icon、Drawer 处理方式一致）。本轮**没有**对 Figma 组件做节点级核实，不得把本文件写成 figma-audited。

## 契约范围

- 类型：文字段落、列表、内容卡片、表格；仅用于结构可预期的首次加载，不表示 Empty/Error。
- 单行文字高 12px；头像与真实尺寸/形状一致（圆形）；图片保持真实宽高比；表格保留真实列宽、表头、行高。
- 数量、层级、宽高比、间距应接近最终内容，避免加载完成时布局跳动。
- 组件 Token：`references/tokens/components/skeleton.tokens.json`，本轮新增并接入构建。

## 修正：文字类圆角（本轮唯一实质性改动）

- 用户此前在上传组件时明确提过：文字类骨架应该是「圆角矩形」而不是「大圆角条」，边角不能太圆。
- 核对预览页 `preview/skeleton/index.html` 发现：页面顶部有一条 `.line{border-radius:4px!important}` 的覆盖规则，把文字行圆角强制改成了 4px；但主样式块里 `.line{height:12px;border-radius:6px}` 和 `schema.json` 的 `dimensions.textRadius` 仍然写的是 6px，两处不一致——`!important` 覆盖说明 4px 才是修正后生效的真实值，6px 是没同步更新的旧记录。
- 用数值验证这个问题为什么重要：文字行高 12px，若圆角取一半（6px），两端会呈现完全的半圆——视觉上就是「大圆角条/胶囊」，正是用户提到要避免的形态；改成 4px（小于半高）才能保留可见的直角过渡，呈现「圆角矩形」而不是「胶囊」。
- 4px 正好对应本 Skill 现有的 `Radius/Radius-XS` token（"Tag、小徽标，小号按钮和控件圆角"），本轮直接引用该 token 而不是写死字面值，与其余组件的圆角引用方式保持一致。
- 已同步修正：`schema.json` 的 `dimensions.textRadius` 6→4，`rules.md` 的对应描述、`mapping.json`、`skeleton.tokens.json` 均已按 4px 记录，并写明修正原因。

## 开放问题

无新增待确认项。文字圆角修正是补齐既有但未同步的用户决定，不是本轮新发现的设计缺口；`assets/styles/gj-b2b-components.css` 暂无共享 `.gj-skeleton*` 基座这一点与 Drawer 的 DRW-001 属于同类情况，一并登记为 **SKE-001**（P3，不阻断），见 audit-tracker。

## 结论

Skeleton 为 `local-contract`：schema / mapping / audit / 组件 Token 已按用户确认、通用骨架屏惯例与已验收预览页补齐。覆盖看板不再缺 structuredContract 与 componentToken。文字类圆角的 6px→4px 修正已同步到全部契约文件，避免与预览页实际生效样式不一致。

## 2026-09-09：共享 CSS 基座提炼（关闭 SKE-001）

`preview/skeleton/index.html` 原本内联定义的 `.skeleton`/`.line`/`.avatar`/`.thumb`/`.card-cover`/`.w100`/`.w86`/`.w72`/`.w54` 样式，已提炼为 `assets/styles/gj-b2b-components.css` 的共享类 `.gj-skeleton`（基础闪烁形状）+ `.gj-skeleton-line`/`-avatar`/`-thumb`/`-card-cover`（形状修饰符）+ `.gj-skeleton-w100`/`-w86`/`-w72`/`-w54`（宽度修饰符），对应尺寸/圆角/动效数值同步写成 `assets/styles/gj-b2b-tokens.css` 里的 `--ds-component-skeleton-*` 变量。

顺带清理了一个此前记录过的遗留问题：预览页顶部原本有一条 `.line{border-radius:4px!important}` 覆盖规则，是 2026-09-09 早些时候用来把文字条圆角从错误的 6px 修正为 4px 的临时手段（详见 audit.md 更早的修正记录）。这次共享基座提炼把正确的 4px 直接写进了 `.gj-skeleton-line`，不再需要 `!important` 覆盖，因此这条规则已删除；`.table-row .line{margin-top:0;align-self:center}` 这条真正的页面级布局覆盖予以保留，改名为 `.table-row .gj-skeleton-line`。

命名调整（视觉行为不变，按项目 `is-` 前缀惯例统一状态修饰符）：`.reduced`→`.is-reduced`、`.paused`→`.is-paused`（交互面板的"启用加载动效"开关驱动 `.is-paused`；`.is-reduced` 在预览页没有实际触发点，随共享基座一起保留，供业务代码需要手动强制关闭动效时使用）。

`preview/skeleton/index.html` 的 `<style>` 块已删除对应重复规则，标签配平（div 89/89、table/thead/tbody 各 1/1 等）与内联脚本 `node --check` 均已验证通过。`mapping.json`/`skeleton.tokens.json` 已同步更新 `implementation.status` 为 `shared-css-base` 并订正/补全 `cssVariable` 字段；`skeleton.tokens.json` 的 `openItems.SKE-001` 已清空。

## 结论

Skeleton 仍为 `local-contract`（未做 Figma 节点级审计，不受本次改动影响），但前端实现层面不再有"仅预览页内联参考实现"的缺口，且此前记录的圆角遗留问题也已经彻底清理——SKE-001 已解决。

## 2026-09-10：修复共享 CSS token 损坏（相邻骨架行无间距）

用户反馈组件预览页出现“布局变化、内容溢出/覆盖、间距/内边距丢失”，进一步指出骨架屏的问题不在页面下方的规则表格上，而是共享基座渲染时每一行圆角矩形之间没有间距——即同一段落内相邻的 `.gj-skeleton-line` 紧贴在一起。核查后发现 `assets/styles/gj-b2b-tokens.css` 的 Skeleton token 区块与 Drawer 同批受损：

- `--ds-component-skeleton-line-gap`：`.gj-skeleton-line+.gj-skeleton-line{margin-top:var(--ds-component-skeleton-line-gap)}` 所引用的这个 token 从未被定义过（不是写坏，是完全没写），因此相邻行间距失效为 0，即用户截图里看到的现象。
- `--ds-component-skeleton-thumb-radius` 与 `--ds-component-skeleton-card-cover-radius`：两个独立 token 被一次损坏的同步误合并成一条以说明文字为“变量名”的无效声明，导致头像/缩略图、卡片封面占位块的圆角一并失效为 0（直角），与真实组件的圆角外观不符。

修复：补上 `--ds-component-skeleton-line-gap: var(--ds-space-3)`（8px，与 12px 行高搭配出接近正文行距的节奏），把 thumb-radius / card-cover-radius 拆回两条各自合法的声明（均为 `var(--ds-radius-md)`），并把纯说明性文字改回真正的 CSS 注释。已用 Playwright 渲染截图 + `getComputedStyle` 核对：相邻骨架行间距恢复为 8px，thumb/card-cover 圆角恢复为 8px；页面其余部分（基础形态、组合骨架、表格骨架、交互 demo、使用规则）未受影响。`skeleton.tokens.json` 已新增 `line.gap` 条目并同步更新受影响 token 的 `cssVariable` 字段。

（本次同一根因也影响了 Drawer 组件的共享 token 区块，一并修复，见 `references/components/drawer/audit.md` 对应记录。）

## 2026-09-10：关闭 SKE-002（头像/卡片封面/缩略图占位块 0 尺寸）

用户反馈预览页「头像与文字」示例缺失头像的骨架占位块，要求检查预览页展示部分并补齐。

排查：`.gj-skeleton-avatar{width:var(--ds-component-skeleton-avatar-size);height:var(--ds-component-skeleton-avatar-size);...}` 引用的 `--ds-component-skeleton-avatar-size` 从未在 `gj-b2b-tokens.css` 中定义过（不是本轮之前修复的『合并成无效声明』问题，是 `skeleton.tokens.json` 里这个条目从建立起就只写了设计意图「match-final，不固定字面值」，没有给共享基座一个可用的默认值）。同一根因也影响 `.gj-skeleton-card-cover` 的高度（`--ds-component-skeleton-card-cover-height` 从未定义）和 `.gj-skeleton-thumb` 的宽高（`--ds-component-skeleton-thumb-width/height` 从未定义，当前预览页未使用该类，但同一共享类会复现同样的问题）。三者在没有业务页覆盖同名 CSS 变量的默认情况下都会渲染为 0 尺寸、直接消失。

修复：
- `references/tokens/components/skeleton.tokens.json`：`avatar.size` 补默认值 40px（与 Avatar 组件自身 `defaults.size=40` 对齐）；原来把 thumb/card-cover 圆角挤在一起的 `image.radius` 条目拆分为独立的 `thumb.radius`/`cardCover.radius`（值不变，仍是 8px）；新增 `thumb.width`/`thumb.height`（64px）与 `cardCover.height`（160px）。
- 重新运行 `node scripts/build-tokens.mjs`：`gj-b2b-tokens.css` 新增 `--ds-component-skeleton-avatar-size: 40px`、`--ds-component-skeleton-thumb-width/height: 64px`、`--ds-component-skeleton-card-cover-height: 160px`。
- 用 Playwright 渲染 `preview/skeleton/index.html` 截图核对：「头像与文字」示例的头像圆形占位块、「内容卡片」示例的封面占位块均已正常显示并带流光动效；「组合骨架」列表里的 3 个头像同样恢复正常。
- 这些默认值是共享基座的兜底，不是产品真值——业务页应按真实头像/封面/缩略图尺寸覆盖同名 CSS 变量，符合 schema 里「match final」的设计意图；本次只是补上"没有覆盖时不至于 0 尺寸消失"的默认表现。
- 未涉及圆角、颜色、动效相关 token，此前 2026-09-10 修复的 `line.gap`、thumb/card-cover 圆角声明保持不变。

## 2026-09-11：清理预览页残留旧 CSS（新增并关闭 SKE-003）

背景：延续 MDL-010（见 `components/modal/audit.md`）建立的方法，对 `preview/skeleton/index.html` 做同样的死代码核查——用户明确的标准原则是预览页无论静态展示区还是交互区，都应该只用标准组件基座渲染，不应该残留旧 CSS。

排查方法：同 MDL-010，解析页面全部 `<style>` 块，提取每个选择器涉及的类名，逐个类名对照页面真实 `class="..."` 属性（含 JS 动态拼接的模板字符串）确认是否被引用；复合选择器按逗号拆分成分支逐项判断，只删除全部分支都确认无引用的规则，混有真实类的复合选择器保留但裁掉死亡分支。

整条规则删除（1 条）：`.card-meta`。

验证：脚本二次扫描确认页面残留死选择器为 0；`<style>` 块大括号计数与逐字符深度校验均通过（与 button.html 同批次校验时一并发现并排除结构性错误）；本文件删除/裁剪的选择器均逐一比对过页面真实 `class="..."` 与 `classList` 调用，确认为未引用的旧代码，属于低风险清理，未单独截图复核。

结论：SKE-003 已关闭。`preview/skeleton/index.html` 内嵌 CSS 现在只包含仍被页面实际使用的选择器。

## 2026-09-16：规范页展示层优化

预览页迁移到统一 `component-docs.css` 结构，阅读顺序调整为“结构与组合形态 → 交互演示 → 尺寸与结构 → 状态边界与选用规则”。四种契约类型 Text / List / Card / Table 均继续使用 `.gj-skeleton*` 共享基座；交互演示补齐 Table，并增加加载完成/重新加载切换，用于核对骨架与终态结构是否接近。

展示层同步修正旧表格残留的文字圆角 6px 描述为已确认的 4px，并将六条重复卡片式规则收敛为状态边界对照表与三张关键规则卡。底层 `rules.md`、schema、mapping 与 componentToken 未删减，组件仍保持 `local-contract`。
