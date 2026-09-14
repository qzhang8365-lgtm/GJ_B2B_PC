# Image 图片

> 从 `references/design-system-rules.md` 拆分（2026-09-08）。跨组件的颜色/字体/布局/圆角等基础规范见该文件"基础规范"章节。2026-09-09 已按用户提供的 Figma 链接（node-id=2638-2636）做真实节点核实，升级为 `figma-audited`，结构化证据见同目录 schema.json、mapping.json 与 audit.md。

- 覆盖 1:1 缩略图、普通大图预览和全屏画廊预览；复用 Upload 的类型、大小、数量、失败与重试规则。
- 拖拽/点击上传入口不再由 Image 自己定义：该组件已在 Figma 里移到 Upload 页面，改名 Upload_Dropzone（节点 `3536:11370`，figma-audited），具体尺寸、状态、token 见 `references/components/upload/schema.json` 的 `dropzone` 字段，本文件不重复维护。Image 从文件被接受之后开始接管，渲染缩略图与各自的上传状态。
- 缩略图 104×104px，圆角 6px（Radius/Radius-SM）；五态：Empty/Uploading/Uploaded/Uploaded-Hover/Error。**Empty、Uploading、Error 三态是虚线边框，Uploaded、Uploaded-Hover 两态是实线边框**——这是 2026-09-09 对照 Figma 发现并修正的真实实现差异，此前预览页对全部状态统一用了虚线边框，见 audit.md。
- Uploading 态只显示进度条（64×4px，圆角 2px）+ 百分比文字，**不显示图标**。2026-09-10 Figma 侧确认删除预览里多画的 `icf_file_image.svg`；共享基座 `.gj-image-thumb.is-uploading` 不渲染图标。
- Uploaded-Hover 态：黑色遮罩理论值是 `rgba(0,0,0,.4)`，本系统没有 MK_40 这一级，用最接近的 `Background/MK_45` 顶替，不是精确匹配；悬停操作条（查看/删除）位置偏向缩略图下方偏左（left:23px top:67px，不是正中央），Figma 节点未附带背景色属性，具体有没有背景未核实。
- 大图预览（Image_Preview）520×340px，圆角实测 9px（未绑定 Radius token，很可能是作图误差），建议实现仍用系统的 Radius/Radius-MD（8px）保持体系一致，记为已知的 1px 偏差而不是必须复刻的目标值。悬停/聚焦态从底部升起操作条：高 36px、水平内边距 12px、间距 12px、圆角 8px（Radius/Radius-MD）、背景 `Background/MK_60`、居中环绕阴影 `0 0 15px Background/MK_10`。
- 全屏画廊预览（Img_mask）遮罩色是 `Background/MK_45`，**不是** `Background/MK_60`——这是 2026-09-09 对照 Figma 节点 `3530:1855` 发现并修正的真实数值差异（此前 schema.json 的 `tokens.previewMask` 和 `mask/rules.md` 都误记成了 MK_60，两处均已同步订正）。画廊内图片同样是 9px 非 token 化圆角；控件为"上一张箭头 · 位置指示（如 1/5） · 下一张箭头"横向排列，间距 40px，箭头约 24×24px。
- 图片保持比例，禁止拉伸；是否允许裁切、压缩和重新排序由具体业务确定。

- 实现基座：`assets/styles/gj-b2b-components.css` 的 `.gj-image-*` 共享类（2026-09-09 从预览页内联样式提炼，含 `.gj-image-thumb*`、`.gj-image-preview*`、`.gj-image-scale-*`、`.gj-image-modal*` 与独立的 `.gj-image-icon-btn*` 图标按钮系列），对应结构/颜色 Token 见 `assets/styles/gj-b2b-tokens.css` 的 `--ds-component-image-*`；图标按钮因尺寸场景差异较大（20/24/28/36px）未复用已有 `.gj-icon-button`，保留独立命名空间。
