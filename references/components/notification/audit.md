# Notification Figma 审计

来源：用户提供画板 `3619:11945`（Notification），2026-09-09 只读检查。未修改 Figma。官方 MCP `get_design_context` / `get_variable_defs` / `get_metadata` 读取。

inventory 该页记 **1 套 / 4 variants / standalone 0**。画板可见 **4** 个独立 Status symbol，与 variant 计数一致。画板上**没有** Notification COMPONENT_SET，见已关闭的 NTF-004。

Figma 组件说明：全局非阻断通知；Status 仅 Info / Warning / Error / Success；Close 固定显示；确认按钮可显示或隐藏；不含尺寸、交互状态或双按钮变体。

## 已确认的组件集

### Notification（画板 frame `3619:11945`，4 个独立 symbol，无 COMPONENT_SET）

| Status | 节点 | 画板宽×高 |
|---|---|---|
| Info | `3610:9` | 384×182 |
| Warning | `3619:150` | 384×182 |
| Error | `3619:160` | 384×182 |
| Success | `3619:170` | 384×182 |

共用 chrome：

- 容器宽 **384**、`Background/Container`、圆角 `Radius/Radius-LG` **12**
- 内边距 `Interval/space6` **20**
- 列 `gap` `Interval/space4` **12**（主行与操作行）
- 主行 `gap` **16**（图标 / 文案 / 关闭；生成代码未绑 Interval，等价 space5）
- 文案栈 `Interval/space3` **8**
- 标题 `中文/S4-CN-S` / `Text/Primary`
- 说明 `中文/S8-CN-R` / `Text/Secondary`；生成代码说明宽 297
- 关闭 **16×16** `icf_system_close`；Info `variable_defs` 含 `Text/Primary`（关闭与标题同色，不是 Toast 的 `Background/MK_30`）
- 语义图标 **32**
- 确认：Primary、高 `Components/control-M` **32**、水平 `Interval/space4` **12**、圆角 `Radius/Radius-SM` **6**、`Brand/GJ_Blue` + `Text/reversal`、右对齐。这就是共享 Button Medium，实现直接用 `.gj-btn.gj-btn-primary`，不要再覆盖 padding。
- 画板样本效果样式曾是 `drop-shadow/0.12+0.8+0.5`。实现按 NTF-002 改用全局 `shadow-down`。
- BOOLEAN：`showIcon`、`showDescription`、`showButton`，画板样本均为 true
- 内容左对齐 `items-start`；操作行 `justify-end`

| Status | 图标色 | 图标 |
|---|---|---|
| Info | `Text/blue` | `3107:2143` → `icf_system_warning-fill`（与 Toast info 同实例） |
| Warning | `Feedback/warning` | `3107:2165` → `icf_system_alert-fill` |
| Error | `Feedback/error&rise` | `icf_system_close-circle-fill`（NTF-001 已确认） |
| Success | `Feedback/success&decline` | `3107:2160` → `icf_system_check-circle-fill` |

本画板**没有**视口位置、堆叠间距或自动消失时长。规范页在演示框内展示，不把 Notification 写成 `position:fixed`。

## 相对旧 rules-derived / 预览页的核对

1. 宽 384、内边距 20、圆角 12、图标 32、关闭 16、按钮 32、标题 16/24/600、说明 14/22/400，与旧 rules 一致。
2. 旧 rules 把「间距 12px」写成一条。画板是列 12 + 主行 16 + 文案 8。
3. 旧规则写 Info 走 Feedback 状态色。实测 Info 图标绑 `Text/blue`（与 `Feedback/brand` 同解析为 `#2B73FF`）。
4. 预览曾用内联 SVG hydrate；实现改为已登记 iconfont + `--gj-icon` mask。
5. 确认按钮高 32、水平 12，与共享 Button Medium 一致；原先对照的 Medium 水平 20 是误记。
6. 投影实现改为全局 `shadow-down`，不再跟画板三层 `drop-shadow/0.12+0.8+0.5`。
7. 2026-09-10 修复共享基座：容器严格保持 Figma 规定的 **384px** 固定宽度并禁止 flex 压缩；窄容器应调整展示布局或提供滚动，不得缩窄组件造成文字与操作区变形。同时清理了基座规则末尾的多余右花括号。

## 已关闭问题

1. **NTF-001 · P3 · 已关闭** — 2026-09-09 用户确认 Error 语义图标使用 `icf_system_close-circle-fill`。
2. **NTF-002 · P3 · 已关闭** — 2026-09-09 用户确认投影从全局 `effects.json` 取 `shadow-down`，不再实现画板三层阴影。
3. **NTF-003 · P3 · 已关闭** — 确认按钮就是共享 Button Medium（高 32、水平 12）。原先写的 Medium 水平 20 是误记，不存在冲突。
4. **NTF-004 · P3 · 已关闭** — 2026-09-09 用户确认画板没有 COMPONENT_SET，只有四个 Status 独立 symbol。schema 用画板 frame `3619:11945` 作集合锚点。

## 结论

Notification 为 `figma-audited`。四态宽度、内边距、字体、关闭 16px、Button Medium 确认按钮和 Info/Warning/Success 图标已抽样核实。Error 图标、投影、按钮尺寸和组件集口径已按用户确认收口。`pendingExtraction` 为空。

## 2026-09-11：gj-notification-close 补齐 Hover（新增并关闭 NTF-005）

背景同 MDL-009：讨论「Modal/Notification 关闭是否该统一」后，方向确定为尺寸各自保留（Modal 20/Notification 16/gj-icon-button 32，均有各自的 Figma 真值或既有确认支撑），但三者 Hover 的视觉语言统一为「只变图标颜色，不叠加背景」。

现状排查：`.gj-notification-close` 此前**完全没有定义 `:hover` 规则**——鼠标悬停在关闭按钮上没有任何反馈，这是遗漏而非设计选择。默认颜色已经是 `Text/Primary`（rules.md 明确「始终显示」用 Text/Primary，不是像 `gj-icon-button`/`gj-modal-close` 那样默认 Tertiary），所以无法复用「Tertiary→Primary 加深」的套路表达 Hover。改为复用本设计系统里同类场景（默认已是较深色、需要独立 Hover 反馈的可交互图标，如 `.gj-input-action`、`.gj-table-sort`、`.gj-table-head-icon`、`.gj-table-icon-action`、`.gj-table-expand`、`.gj-calendar-nav`、`.gj-upload-file-action`）统一采用的 `color:var(--ds-text-blue)` Hover 写法，不叠加背景，16px 尺寸不变。

文档同步：`notification/rules.md`、`notification/schema.json`（`confirmedDecisions`、`constraints`）、共享 CSS 顶部注释已更新；`audit-tracker.md` 新增 NTF-005 并直接关闭。

结论：NTF-005 已关闭。`gj-notification-close` 新增 Hover（Text/blue，无背景），与 `gj-icon-button`（BTN-006）、Modal 关闭（MDL-009）统一「只变图标颜色」的 Hover 语言，但因默认色阶不同，Hover 目标色沿用系统里同类「深色默认态可交互图标」的蓝色反馈惯例，而非直接复用 Text/primary。

## 2026-09-11：清理预览页残留旧 CSS（新增并关闭 NTF-006）

背景：延续 MDL-010（见 `components/modal/audit.md`）建立的方法，对 `preview/notification/index.html` 做同样的死代码核查——用户明确的标准原则是预览页无论静态展示区还是交互区，都应该只用标准组件基座渲染，不应该残留旧 CSS。

排查方法：同 MDL-010，解析页面全部 `<style>` 块，提取每个选择器涉及的类名，逐个类名对照页面真实 `class="..."` 属性（含 JS 动态拼接的模板字符串）确认是否被引用；复合选择器按逗号拆分成分支逐项判断，只删除全部分支都确认无引用的规则，混有真实类的复合选择器保留但裁掉死亡分支。

整条规则删除（2 条）：`.status-demo`、`.status-demo h3`。

验证：脚本二次扫描确认页面残留死选择器为 0；`<style>` 块大括号计数与逐字符深度校验均通过（与 button.html 同批次校验时一并发现并排除结构性错误）；本文件删除/裁剪的选择器均逐一比对过页面真实 `class="..."` 与 `classList` 调用，确认为未引用的旧代码，属于低风险清理，未单独截图复核。

结论：NTF-006 已关闭。`preview/notification/index.html` 内嵌 CSS 现在只包含仍被页面实际使用的选择器。
