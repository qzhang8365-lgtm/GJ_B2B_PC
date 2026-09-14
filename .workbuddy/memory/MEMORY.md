# 国金B端设计系统 · 组件工作台（preview 站点）长期记忆

## 语义色盘（全局）
- `--page:#f5f7fa` 全局背景灰；`--surface:#fff` 卡片白；`--blue-pale:#f2f7ff`/`--blue-soft:#e5f0ff` 顶部/选中浅蓝；`--blue:#2b73ff` 主色。
- 页面大背景用 `var(--page)`，卡片/控件用白。**禁止大面积纯 `#fff` 做背景**。

## CSS/HTML 验证铁律
- 禁 grep 子串验证——会假阳性（`....selector{...}` 也匹上）。正确：逐字节 diff + DevTools 计算样式 + 实际渲染。**渲染问题先看页面**，别猜缓存。
- Edit 按字面 `old_string` 替换；垃圾字符混在选择器前缀会让旧串永远匹不到，错误"继承"。`old_string` 带前后唯一锚点。
- 预览服务 `localhost:8765`（`/tmp/nocache_server.py` 自定义 server，`Cache-Control: no-store`），普通刷新即拉最新。

## iconfont 渲染两坑（2026-08-19）
- **坑① `mask:` 简写重置 mask-image**：`mask:center/contain no-repeat` 不带 `mask-image` 会把前面 `mask-image:url(...)` 全部重置为 `none`，图标退化成 16×16 实心 currentColor 色块。要在已有 `mask-image` 元素上再加位置/尺寸/重复模式，用 longhand `mask-position`/`mask-size`/`mask-repeat`（带 `-webkit-*` 各一份），**不要在子集规则里再写 `mask:` 简写**。
- **坑② SVG 内 `foreignObject/backdrop-filter` 不稳**：Figma Glass Icon 用 `foreignObject` 做毛玻璃，`<img>` 加载 SVG 时 Chrome/Safari 会丢 `backdrop-filter`，只剩纯色。Glass Icon 必须**烘焙成 PNG**（批量：Chrome headless 一次性截图 + PIL 切图）。

## 卡片层级与三档约定（2026-08-19，GridNav 模板已固化）
- **最多 3 层卡片**（按视觉边框/背景计），再深即"套盒"必须拍平。
- **第二级区块（`.panel` / `.demo-card`，如"基础用法""宫格规格"）才是带边框的卡**；其内部"次级容器"是第三级。
- **第三级区块一律从"卡片"框架释放**：不加 `border`/`border-radius`/`background`/`padding`——除非用户在该组件页**特别指定**。典型：`.variant-box`、`.scene`、`.tabs-card`。
- 夹在二级卡和三级内容之间的"通用包裹层"（如 `.demo-stage`）也**不加边框/圆角/背景**，只保留 `padding + overflow`，否则多套一层假卡。
- 例外：交互面板的画布（`.lab` 虚线预览框）属功能性"画板"，可保留一层；其上下不再叠加"卡片容器"。
