# 本地 HTML 交付与跨浏览器兼容

本规范只在页面需要通过双击 HTML、邮件附件、共享盘或离线包以 `file://` 打开时读取。通过正式前端工程或 HTTP/HTTPS 部署的页面仍按正常资源管线处理。

## 为什么浏览器结果会不同

`file://` 没有普通网站的 HTTP origin。不同浏览器对本地文件的安全边界、同源判断、CSS URL 基准和 SVG 子资源加载采取不同策略：

- CSS 自定义属性中的 `url(...)` 会在真正消费它的样式声明处解析。`--gj-icon:url(...)` 写在 HTML 中，但 `mask:var(--gj-icon)` 写在外部 CSS 中时，路径可能按 CSS 文件目录而不是 HTML 目录解析。
- Chrome/Edge 对 `file://` 页面从 CSS mask 引用另一个本地 SVG 更严格，常见结果是元素尺寸和颜色都存在，但 `mask-image` 加载失败，Icon 完全透明。
- Safari 对部分本地 SVG mask 更宽松，因此“Safari 正常”不能作为 Chromium 兼容证据。
- `<img src="relative.svg">`、`background-image`、`mask-image`、Web Font 和脚本并不共享完全相同的本地资源策略，不能用图片加载成功推断 mask 或字体也会成功。

这属于交付环境差异，不是 Figma、Token 或 Icon 文件本身的视觉错误。

## 先确定交付模式

生成页面前明确以下一种模式：

1. **HTTP/HTTPS 或前端工程**：可以保留可由构建工具解析的外部 SVG mask；路径按项目工具链管理。
2. **本地文件夹**：HTML、CSS、JS、字体和图片都随目录交付；原型/验证页仍需通过 `embed-icons.cjs` 把导入工具不识别的 Icon、图片和描边载体写入页面。
3. **单 HTML 文件**：除普通业务图片有明确例外外，CSS、JS、字体和 Icon 都应内嵌；不得依赖绝对本机路径、CDN 或开发服务器。`embed-icons.cjs` 负责本 Skill 的 Icon、图片与转换运行时，业务方其它依赖仍需由项目构建或交付流程处理。

用户未说明但明确要求“发给同事”“直接打开”或“只有一个 HTML”时，按第 2 或第 3 种处理，不按开发服务器预览处理。

## Icon 传输协议

先从 `references/icons/index.json` 和对应 manifest 确认 Icon key，再决定载体。载体变化不改变图标来源。

复制资源时必须保留 manifest 的相对目录，例如 `iconfont/icf_system_search.svg` 不能被随意拍平为另一个目录结构；共享 CSS 中的 fallback URL 也按该目录解析。若最终采用数据内嵌，仍以保留目录结构的源文件作为构建输入。

### 需要随状态变色

Button、Sidebar、Navbar、Search、Pagination、Tag 等依赖 `currentColor` 的 Icon：

- HTTP 页面：允许 `--gj-icon:url(relative.svg)` + CSS mask。
- `file://` 页面：使用 `--gj-icon:url(data:image/svg+xml;base64,...)`，或使用 `fill="currentColor" / stroke="currentColor"` 的内联 SVG。
- 禁止用固定颜色 `<img>` 替换会随 hover、selected、disabled 变色的图标。

### 不需要随状态变色

品牌 Logo、多色业务图、封面与固定色插图在源页面中可使用普通 `<img src="...">`，仍须使用相对路径并随交付包复制，不得引用原作者电脑的绝对路径。原型/验证页运行 `embed-icons.cjs` 后，属于 Skill 的本地图片会以内嵌数据交给导入工具；源页面的组件写法无需改变。

### 禁止做法

- 不要在页面 CSS 中为某个组件重复一套 mask 视觉规则来掩盖路径问题。
- 不要因为 Safari 能显示就保留外部 SVG mask。
- 不要把图标改成 Emoji、Unicode 字符、CSS 手绘图形或 manifest 外的近似资源。
- 不要在生成 HTML 后用运行时 `fetch()` 读取本地 SVG；Chrome 的 `file://` 安全策略同样可能阻止它。

## 交付流程

1. 先按正常组件规范组合 `gj-*` 组件并确认图标 key。
2. 先按 `project-asset-delivery.md` 只把页面实际依赖及依赖闭包复制到项目 `assets/`。
3. 页面生成完成后执行内嵌转换：

   ```bash
   node <skill目录>/scripts/embed-icons.cjs path/to/index.html
   node <skill目录>/scripts/embed-icons.cjs path/to/index.html --check
   ```

   脚本原位写入固定标记块，重复运行会替换旧块；`--check` 检测未内嵌、依赖集合变化或数据过期并以退出码 1 阻断交付。旧的 `prepare-file-delivery.mjs` 只会把外部 SVG mask URL 改为 `data:`，不能处理伪元素、普通图片、CSS 背景图或 inset 描边，因此不能替代本步骤。

4. 直接用 Chrome 或 Edge 打开 `file://.../index.html`，再用 Safari/WebKit 复核；不要只启动 localhost。
5. 在 1440px、1280px 和页面规定的窄屏断点检查 Default、Hover、Selected、Disabled，以及 Search 有值时的清除按钮；还要实际打开 Dropdown、Modal、Popover 等动态层。
6. 断开网络或禁用缓存后复开页面，确认没有 CDN、开发服务器或绝对本机路径依赖，控制台没有 CORS、404 或 `Not allowed to load local resource`。
7. 将同一份 HTML 用 HTTP 打开复核，确认 `file://` 与 HTTP 的 Icon、图片、描边、布局和交互一致。

## 验收结论

以下任一情况均为阻断：

- `embed-icons.cjs --check` 未通过，或内嵌标记块与页面当前依赖不一致。
- Chromium 与 WebKit 任一内核出现透明 Icon、固定色不随状态变化、路径 404 或 CORS/Not allowed to load local resource。
- Search 只剩输入框，缺少规范要求的搜索 Icon、清除按钮或同尺寸确认 Button。
- 页面只能通过 localhost 打开，直接双击不可用，但交付说明宣称可离线使用。
- 转换后仍有使用 mask 的可见 Icon、仍引用本地文件的 Skill `<img>` / CSS 背景图，或仍用 inset shadow 充当 1px 描边/分割线。
