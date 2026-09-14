# Upload 文件上传

> Figma 真审计：页面 `3099:2117`，2026-09-09。结构化证据见同目录 schema、mapping 与 audit。

- 上传入口直接组合共享 `Button`：Primary + 左侧 `icf_file_upload`，默认 Medium；尺寸和 Hover/Pressed/Focus/Disabled 全部继承 Button，禁止另写 `.upload-button`。
- 触发方式有两种：按钮触发（组合共享 Button）与拖拽触发 Upload_Dropzone（节点 3536:11370，2026-09-09 从 Image 页面移入 Upload 页面并经 Figma 核实）。两者只是入口不同，选择、校验、队列、进度、重试、安全规则完全共用，不允许为 dropzone 另建一套逻辑。
- Dropzone 固定高 180px、圆角 6px（Radius/Radius-SM）、内容居中、间距 8px；Default 用 Border/hover + Background/Tertiary，Dragging 和 Uploading 都用 Border/focused + Background/BT_B5，Error 用 Border/error + Background/BT_R5。Uploading 态在区域内显示自身的迷你进度条（240×4，圆角 2），与文件行内的进度条是两处独立展示，不要共用同一 DOM。
- Dropzone 默认文案（如“点击或拖拽文件到此处上传”“支持DOC、TXT，单个文件不超过 10MB”）是 Figma 示例内容，须按真实 accept/maxSize/maxCount 生成，规则与按钮触发模式的示例文案一致。
- Dropzone 的 Default 与 Dragging 使用同一上传轮廓 `icf_file_upload.svg`，通过 `currentColor` 分别绑定 `Text/Tertiary` 与 `Text/blue`；Uploading 使用 `icf_file_image.svg`（28px），Error 使用 `icf_system_alert.svg`（32px）。Figma 为不同颜色生成不同导出 URL，不应被误判为两套业务图标。
- Dropzone 没有发布 Disabled variant：按 `design-system-rules.md`「基础规范 > 颜色 Color > 边界与禁止事项」的全局兜底规则（Figma/组件契约缺失 Disabled 时，组件最外层用 `opacity:50%` 并禁止交互）处理，同时阻止点击、键盘激活与 drag/drop；不得只让文案变灰，也不得在内部元素上重复叠加透明度。
- 组合共享 Form 的 label、必填标记、说明 tooltip 和 help text，并使用正常文档流。不得复制 `Upload_Form` 的负定位标签。
- 文件行默认 360×40、padding 8、gap 12、圆角 6；可用 `width:100%; max-width:360px` 适应容器。文件类型图标 20px，删除/重试图标 16px。
- Hover 使用 `Background/Background`；Error 行使用 `Background/BT_R5`，失败状态图标与错误文案使用 `Feedback/error&rise`。重试/刷新是操作入口，默认使用 `Text/Tertiary`，Hover 才切换为 `Text/blue`，不能继承错误红色。进度轨道为 `Background/Secondary`，完成部分为 `Brand/GJ_Blue`。
- `State6`/`State5` 仅归一为 `filesize=true` 的 Default/Hover。Success 复用 Default 视觉；Waiting/Cancelled 不新造视觉 variant。
- 进度为 0–100 数字、单调且不越界；无法获知总大小时使用不定进度。进度条按剩余空间自适应，207/273px 只作 Figma 证据。
- 多文件用稳定 item id，不以文件名作唯一键；每项独立显示结果，部分成功只重试失败项。
- 错误需说明具体原因并提供重试或重新选择。多文件错误项保留文件名；空间不足时至少在可访问名称中包含文件名。
- 单色状态与操作图标必须使用共享 mask 基元继承 `currentColor`；不得用外链 `<img>` 承载需随状态变化的颜色。文件类型图标可继续保留原色图片。
- `accept` 只是选择器提示。服务端仍须校验类型、签名、大小和权限，清理文件名、隔离存储并执行产品恶意文件扫描策略。
- 暂停/继续仅在真实支持时显示；上传中移除先取消请求；重试、取消均防重复提交。
- 可见 Button 关联原生 file input；状态变化 polite 播报；进度使用 progressbar 语义；图标按钮名称包含动作和文件名。
- 示例 “Recommended File Size less than 50M” 不是全局默认；根据真实 accept/maxSize/maxCount 生成本地化说明并明确 MB/MiB。
