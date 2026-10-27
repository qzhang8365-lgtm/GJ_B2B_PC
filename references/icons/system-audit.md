# System 图标审计与兼容记录

## 当前结论（2026-10-26）

普通图标共 **382 枚：line 240、fill 142**，唯一查找入口是 `index.json` → `manifest.json`；字符码、CSS类与字体命名空间以 `assets/icons/iconfont/font/iconfont-map.js` 为准。不根据名称中是否含 line/fill 猜测分类，不重命名已有文件或调用。

`system-manifest.json` 与 `assets/icons/general/system/` 是当前canonical SVG的派生审计镜像，不是第二套图标库，也不代表重新从Figma导出的原始文件。现有源文件名及兼容别名保留；每项 compiledName 指向正式清单。当前117份镜像中115项归System、2项归File（attachment、link-line）；不将镜像数量叠加到382。

## 已关闭项

- **ICO-001**：attachment最终归File，旧system位置与别名保留。
- **ICO-002**：link-line最终归File；源镜像原路径保留，不据目录反推分类。
- **ICO-003**：code_regular、delete_back等历史调用由已有alias表兼容；不重复展示或统计。
- **ICO-004**：数字后缀命名沿用设计方确认的现名，不增补猜测语义名。
- **ICO-005**：预览页旧样式清理已关闭。
- **ICO-006 已关闭（2026-10-26）**：音量/静音line与fill四枚已接入SVG、字体、CSS和映射。
- **ICO-007 已关闭（2026-10-26）**：line/fill同名导出已恢复独立资源，压缩文件空心与拉链已由新版字体保留。
- **ICO-008 已关闭（2026-10-27）**：用户提供 Figma 节点 [`5396:3700`](https://www.figma.com/design/8b01I1e3TzH1IhYlr3tJzd/?node-id=5396-3700)，节点名为 `icf_system_delete-fill`，母节点约 24×23.905，内部 `Subtract` 图形位于 x=3、y≈1.992，尺寸 18×19.920；与本地 24×24 画布中保留的 F080 图形为同一规范化轮廓。确认该节点就是旧兼容资源的设计来源，无需更换现有 SVG、字形、Unicode 或 CSS 类。

## 待确认

- 当前图标审计无待确认项。

## 本轮维护

最新240枚line、142枚fill及已有font映射作为输入。更新旧System镜像、catalog、复制/下载源码缓存、字体文件URL版本及网页引用版本；既有兼容别名不进入主清单。当前382枚均使用真实字体映射；新版loading已移除旧SVG降级。PC与移动端Icon页的Chromium交互、字体、资源请求、搜索、复制、下载及重点图形视觉验收均已通过；完整结果见移动端 `planning/icon-refresh-20261026/REPORT.md`。
