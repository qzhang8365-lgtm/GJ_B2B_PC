# System Icon 资产检查

- 来源目录：`/Users/gjzq_imac/Desktop/国金B端设计系统/iconfont/system`
- 读取方式：只读；工作区保留独立副本。
- SVG 数量：114（原始只读审计时）；2026-09-10 因 ICO-002 在工作区快照里补入 `link-line.svg` 后为 115，详见下方说明——原始 Desktop 目录本身未被改动。
- 114/114（原始审计范围）均为有效 SVG，均包含 `24 × 24` viewBox；补入的 `link-line.svg` 同样是 `24 × 24`，与编译版本（现名 `icf_file_link-line.svg`）SHA256 一致。
- 当前目录只包含 SVG 源资产，不包含 `.woff2`、`.woff`、`.ttf` 或 Icon Font CSS 映射文件；因此它是 Icon Font 的构建输入，而不是可直接引用的字体包。

## 与 iconfont System 分类的产物关系

`references/icons/system-manifest.json` 与 `references/icons/manifest.json` 中的 `System` 分类不是两套独立图标库，而是同一图标血缘的两个交付层：

- `system-manifest.json` 是源 SVG 审计清单，文件落在 `assets/icons/general/system/`，用于核对源文件、几何、命名、数量和后续重新编译。`assets/icons/general/` 是该源资产区的根目录；其中根级别的其他 SVG 不属于这 114 个 System 源图标。
- `manifest.json` 的 `System` 分类是 iconfont 交付清单，文件落在 `assets/icons/iconfont/`，名称采用 `icf_system_*`；字体字符码和 CSS class 映射见 `assets/icons/iconfont/font/iconfont-map.js`，字体样式见同目录的 `gj-icon-line.css` 与 `gj-icon-fill.css`。
- 页面与组件选图时以 `manifest.json` 的 iconfont 条目为调用入口；只有做源资产审计、图形比对或重新编译时才读取 `system-manifest.json`。禁止把两份清单合并后当成 228 个可选图标，也禁止在同一页面因为路径不同重复引入同一图标。

两侧数量此前均为 114（工作区快照，非重新读取 `/Users/gjzq_imac/Desktop/国金B端设计系统/iconfont/system` 原始目录），但数量相等不代表快照逐项完全相同。按 SVG 文件内容核对，最终确认 **2 个源文件编译时被归入了 File 分类而非 System**，二者都是 2026-09-10 由用户对照 Figma 节点确认的最终分类：

- **ICO-001（已关闭）**：源资产 `system/icon-attachment.svg` 编译归入 File，调用名 `icf_file_attachment`（Figma 节点 `4035:8655`）。用户确认这是最终分类，保留现状，不迁回 System；旧源名 `system/icon_attachment` 仅作兼容别名。
- **ICO-002（已关闭，含一次分类修正）**：`system/link-line.svg` 起初按"编译清单里有、源快照里没有"记录为缺口，2026-09-10 第一轮处理时先判定它是一个真实的 System 图标（Figma 节点 `4046:10356` 确认几何、`get_design_context` 截图与本地渲染的编译 SVG 视觉一致），因此把它作为 System 源文件补进了工作区快照（`assets/icons/general/system/link-line.svg`）。随后用户对照同一个 Figma 节点明确这枚图标的最终分类应为 **File**，不是 System。据此把编译侧全链路改名：`icf_system_link-line` → `icf_file_link-line`（`manifest.json` 条目、`assets/icons/iconfont/icf_file_link-line.svg` 文件、`icon-codepoints.js`、`all-icons.js`、`font/gj-icon-line.css`、`font/iconfont-map.js`、`icon-content.js` 全部同步改名，码点 `\F01E` 不变）。源快照侧的物理文件 `assets/icons/general/system/link-line.svg` **不迁移**，仍留在 `system/` 源目录下——这与 `icon_attachment` 的既有先例完全一致：源文件物理位置反映的是"当初从哪个目录扫描到的"，不代表最终编译分类，两者本来就允许不同。

因此现在的准确口径是：**115 个 System 源文件，113 个编译进 System 分类且逐字节一致，另外 2 个（`icon-attachment`、`link-line`）编译进了 File 分类**——这是两次独立确认过的最终分类，不是待定状态，也不能因为源文件路径含 `system/` 就误判为编译分类也是 System。

## 名称规范化

- **ICO-003（已关闭）**：4 个源文件已统一为 `icon-code-regular`、`icon-delete-back`、`icon-delete-back-fill`、`icon-attachment`；编译侧不规范的 `icf_system_delete_back-fill` 已同步为 `icf_system_delete-back-fill`，SVG、manifest、codepoints、catalog、内嵌内容和 iconfont mapping 使用同一规范名，码点与 SVG 几何不变。
- 旧下划线源名登记在 `system-manifest.json` 的 `aliases` 中；旧编译调用名登记在 `manifest.json` 与运行时 alias map 中。兼容别名只负责解析旧调用，不进入主清单、不参与数量统计，也不在图标页重复展示。
- 20 个文件使用无语义数字后缀：`download1`、`history1`、`list1`、`loading1`、`loading2`、`more1`、`notification1` / `-fill`、`question1`、`refresh1`、`refresh2`、`safety1` / `-fill`、`settings1` / `-fill`、`settings2` / `-fill`、`share1` / `-fill`、`upload1`。
- 2026-09-10 关闭 ICO-004：设计确认**暂不补充**可区分英文语义名和兼容别名。源文件、manifest、iconfont 调用名保持现状（如 `icf_system_loading1`）。页面继续按现名检索与引用，不改文件、不加 alias。

## 使用约束

- General/System SVG 是设计源资产；正式页面调用已编译的 iconfont 清单、字体文件、CSS class 和字符码映射。
- 不直接修改原 SVG 路径或几何数据。
- 图标页面当前通过 SVG 预览源资产，最终业务调用仍按规范使用 Icon Font。

## 2026-09-11：清理预览页残留旧 CSS（新增并关闭 ICO-005）

背景：延续 MDL-010（见 `components/modal/audit.md`）建立的方法，对 `preview/icons/index.html` 做同样的死代码核查——用户明确的标准原则是预览页无论静态展示区还是交互区，都应该只用标准组件基座渲染，不应该残留旧 CSS。

排查方法：同 MDL-010，解析页面全部 `<style>` 块，提取每个选择器涉及的类名，逐个类名对照页面真实 `class="..."` 属性（含 JS 动态拼接的模板字符串）确认是否被引用；复合选择器按逗号拆分成分支逐项判断，只删除全部分支都确认无引用的规则，混有真实类的复合选择器保留但裁掉死亡分支。

整条规则删除（2 条）：`.control`、`.icon-style-tag`。

验证：脚本二次扫描确认页面残留死选择器为 0；`<style>` 块大括号计数与逐字符深度校验均通过（与 button.html 同批次校验时一并发现并排除结构性错误）；本文件删除/裁剪的选择器均逐一比对过页面真实 `class="..."` 与 `classList` 调用，确认为未引用的旧代码，属于低风险清理，未单独截图复核。

结论：ICO-005 已关闭。`preview/icons/index.html` 内嵌 CSS 现在只包含仍被页面实际使用的选择器。
