# Upload Figma 审计

来源：Figma 页面 `3099:2117`（上传 Upload✅），2026-09-09 通过 metadata、design context、变量定义与节点截图只读核验。未修改 Figma。

## 真实组件结构

| 组件集 | 节点 | variants | 说明 |
|---|---|---:|---|
| `Upload/File_list_Item` | `3509:53` | 8 | Default/Hover/Uploading/Error × filesize；true 的默认/悬停名为 State6/State5 |
| `Upload_Form` | `3314:12323` | 1 | `Property 1=Default`；Form 标签 + Primary Medium Button + help |
| `upload_item/progress_bar` | `4297:16746` | 3 | before / inprogress / finished |
| `Upload_Dropzone` | `3536:11370` | 4 | Default / Dragging / Uploading / Error；大面积点击或拖拽入口 |

合计 **4 套 / 16 variants / 0 standalone**。说明画板 `3495:3772` 内的 Button 与状态流程均为实例，不计为 Upload 新母版。

## 视觉与组合

- 上传入口是共享 Button 实例：Small 24、Medium 32、Large 40；Primary；左图标 `icf_file_upload`。
- 文件行 360×40、padding 8、gap 12、圆角 6。名称为 PingFang SC Regular 14/22、`Text/Primary`；大小为 12/18、`Text/Tertiary`。
- 文件类型图标资源名虽含 24px，在行内实际显示 **20px**；尾部删除/重试图标 16px。
- Hover 背景 `Background/Background`。Error 背景 `Background/BT_R5`，错误图标与文案 `Feedback/error&rise`。
- 进度轨道高 4、圆角 2、`Background/Secondary`；完成部分 `Brand/GJ_Blue`。母版宽 207，实例可覆盖到 273，运行时应自适应剩余空间。
- `Upload_Form` help 使用 12/18、`Text/Tertiary`；按钮复用 Primary Medium。示例 “Recommanded File Size less than 50M” 有拼写及单位歧义，只是实例文案。

## 已关闭问题

| ID | 发现 | 处理结论 |
|---|---|---|
| UPL-001 | inventory 2 套/11 variants，漏计 progress_bar | **已关闭**：更正为 3/12/0 |
| UPL-002 | `State5`/`State6` 无业务语义 | **已关闭（映射层）**：分别归一为 filesize=true 的 hover/default |
| UPL-003 | `Upload_Form` 以零高容器和负 top 放 label，易错位、溢出 | **已关闭（组合规则）**：实现用共享 Form 正常流，Figma 节点只作视觉参考 |
| UPL-004 | 按钮图层名残留 `icf_system_search`，实际是上传图标 | **已关闭（资源映射）**：固定 `icf_file_upload.svg` |
| UPL-005 | 无独立 Success variant | **已关闭（状态机）**：完成后复用 Default/State6 视觉；成功是语义状态 |
| UPL-006 | 未发布 waiting/cancelled/paused/retrying 文件行 | **已关闭（行业规则）**：waiting 复用 Default，cancelled 退出活动队列；pause/retry 只作为真实能力的行为态 |
| UPL-007 | Error 示例替换文件名，多文件时可能无法识别失败对象 | **已关闭（行业规则）**：队列错误项保留可见文件名；至少在 accessible name 中包含文件名 |
| UPL-008 | 未覆盖安全校验、重复、超限和服务端验证 | **已关闭（行业规则）**：补服务端复验、文件名清理、隔离存储、扫描、稳定 id 与部分重试 |
| UPL-009 | 旧预览私有 CSS 重画 Upload，文件图标显示成 24px | **已关闭**：共享 `.gj-upload-*` + `.gj-btn`，图标按 Figma 20px |
| UPL-010 | 进度宽度在母版/实例为 207/273，固定任一值都会失真 | **已关闭**：token 留证，运行时按剩余空间自适应 |
| UPL-011 | Dropzone 迁入 Upload 后未计入 inventory、Token、共享 CSS 与验收页 | **已关闭**：更正为 4/16/0，并补齐四态 Token、`.gj-upload-dropzone` 与交互示例 |
| UPL-012 | Figma 为 Default/Dragging 输出不同资源 URL，容易误判为两套图标 | **已关闭（资源映射）**：轮廓相同，统一映射 `icf_file_upload.svg` + `currentColor`；Uploading/Error 分别映射 Image/Alert 资源 |

## 交互、安全与无障碍补充

- `accept` 是选择器提示，不是安全边界；服务端校验实际内容、类型、大小、权限并执行产品安全策略。
- 文件用稳定 id 管理；多文件部分成功只重试失败项。
- 进度 0–100 且单调；无法获得总量时使用不定进度。
- 删除/重试名称包含文件名；进度使用 progressbar；动态状态 polite 播报一次。
- 上传中移除先取消；暂停/继续只在协议和后端真实支持时显示。

## 结论

Upload 已升级为 `figma-audited`。四套母版、16 个 variants、资源映射与说明实例边界均已核验；问题已通过清单纠正、映射、共享组件组合或行业规则关闭，无需人工确认。


## 2026-09-09 补充：Upload_Dropzone 从 Image 移入 Upload 后的核实

用户告知已经在 Figma 里把 dropzone 组件从 Image 组件移到了 Upload 组件，命名为 Upload_Dropzone。用 `get_metadata` 核对了 Upload 页面（`3099:2117`）的节点树，确认新增了一个真实组件集 `3536:11370`（Upload_Dropzone），4 个 variant：Default（`3535:30`）、Dragging（`3535:35`）、Uploading（`3536:27`）、Error（`3536:11361`），母版尺寸 520×180。随后用 `get_design_context` 和 `get_variable_defs` 逐状态核实了真实结构、文案与 token 绑定，结果已写入 `schema.json` 的 `dropzone` 字段，不重复贴在这里。

补充结论：

- **组件描述文字残留旧归属痕迹**：Figma 组件说明写的是"用于大面积点击或拖拽上传图片"，但默认文案示例是"支持DOC、TXT"——这是从 Image 组件挪过来时说明文字没同步改的残留，不代表这个 dropzone 只能用于图片。本次按通用文件上传对待，具体以真实业务 accept 为准。
- **Uploading 态图标 data-name 是"image icon"**：与 Figma 画面及本地图标轮廓一致，映射为 `icf_file_image.svg`；它表达当前上传对象/文件预览，不限制 Dropzone 只能上传图片。
- **Default 与 Dragging 的资源 URL 不同但轮廓相同**：差异来自颜色；实现统一使用 `icf_file_upload.svg` 的 mask + `currentColor`，分别绑定 `Text/Tertiary` 与 `Text/blue`，不会重复维护两份 SVG。
- **进度条区分**：确认了 dropzone 内 Uploading 态的迷你进度条（240×4px，圆角 2px）和文件行内每行的进度条（母版 207px/实例 273px，UPL-010 已记录为按剩余空间自适应）是两处独立但同语义的展示，不能合并实现。
- `references/components/image/` 只保留组合引用，Dropzone 的定义权归 Upload；Upload 验收页已增加四态与真实点击/拖拽交互。

## 2026-09-11：清理预览页残留旧 CSS（新增并关闭 UPL-013）

背景：延续 MDL-010（见 `components/modal/audit.md`）建立的方法，对 `preview/upload/index.html` 做同样的死代码核查——用户明确的标准原则是预览页无论静态展示区还是交互区，都应该只用标准组件基座渲染，不应该残留旧 CSS。

排查方法：同 MDL-010，解析页面全部 `<style>` 块，提取每个选择器涉及的类名，逐个类名对照页面真实 `class="..."` 属性（含 JS 动态拼接的模板字符串）确认是否被引用；复合选择器按逗号拆分成分支逐项判断，只删除全部分支都确认无引用的规则，混有真实类的复合选择器保留但裁掉死亡分支。

整条规则删除（1 条）：`.code`。

验证：脚本二次扫描确认页面残留死选择器为 0；`<style>` 块大括号计数与逐字符深度校验均通过（与 button.html 同批次校验时一并发现并排除结构性错误）；本文件删除/裁剪的选择器均逐一比对过页面真实 `class="..."` 与 `classList` 调用，确认为未引用的旧代码，属于低风险清理，未单独截图复核。

结论：UPL-013 已关闭。`preview/upload/index.html` 内嵌 CSS 现在只包含仍被页面实际使用的选择器。
