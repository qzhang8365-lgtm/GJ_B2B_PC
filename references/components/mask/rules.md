# Mask 遮罩

> 2026-09-08 决定：不生成 Mask 的可交互预览页与 mapping.json/audit.md，采用通用原生遮罩实现，不走 Figma 单组件提取流程。详见 schema.json 的 decision 字段。

## 用途

- Mask 用于 Modal、Drawer、图片预览等浮层组件打开时，压暗背后的内容，建立层级焦点并阻止对下层内容的操作。
- Mask 不作为独立可交互组件维护状态机、动效或点击行为契约；这些由宿主组件（Modal、Drawer 等）各自的 rules.md 定义。

## 实现约定

- 使用设计系统已有的黑色半透明蒙层 Token，不新增或硬编码颜色值：`Background/MK_45`（浅色蒙层）、`Background/MK_60`（默认蒙层，黑色 60%，即 `#00000099`）、`Background/MK_80`（深色蒙层）。
- 未特别指定时默认使用 `Background/MK_60`；Image 组件的全屏画廊预览蒙层是例外，实测为 `Background/MK_45`（2026-09-09 经 Figma 节点 3530:1855/Img_mask 核实，此前 `components/image/schema.json` 的 `tokens.previewMask` 误记为 MK_60，已订正）。
- Mask 铺满宿主区域：全屏浮层用 `position: fixed`，局部容器浮层用 `position: absolute`，不单独定义尺寸或圆角。

## 边界

- Mask 是否可点击关闭、是否需要确认、动效时长等交互行为，属于 Modal、Drawer 等宿主组件的规则范围，不在本文件中重复定义。
- 如未来出现独立于宿主组件之外的 Mask 交互需求（例如全局 loading 遮罩、可点击穿透的蒙层），需要重新走 Figma 提取流程，当前不做假设。
