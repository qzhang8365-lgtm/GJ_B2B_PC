# Icon audit

来源：`references/components/icon/rules.md`、已验收预览页 `preview/icons/index.html`、inventory 页面 `Icon✅`。2026-09-09 用户明确：Icon 组件规范页与 Figma 呈现的结构，她本人已多次核对确认基本一致；图标库规模太大（inventory 记 1 个组件集/3 variants + 267 个 standalone 图标资源），不再逐个走 `get_design_context` 的 Figma 真值复核，按现有规则直接补齐 mapping/组件 Token，走 `local-contract` 路径（与 Chart 的处理方式一致）。本轮**没有**对 Figma 图标资源做逐项核实，不得把本文件写成 figma-audited。

## 契约范围

- 四种资源类型：General（Icon Font / 已上传 SVG）、Effect/Glass（渐变或毛玻璃，独立 SVG+配套 PNG）、File（文件类型专用）、Motion（Lottie JSON）。清单分别为 `icons/manifest.json`、`icons/glass-manifest.json`、`icons/file-manifest.json`、`icons/motion-manifest.json`，统一入口 `icons/index.json`。
- 尺寸梯度：12/16/20/24/28/32/36px，默认 24px；标准描边 2px，转角原则 2px 半径。
- 颜色：General/File 图标默认跟随 `currentColor`（相邻文字或语义色）；Effect Icon 保留自身渐变，不强制继承文字颜色。
- 命名：`icf_图标分类_图标名称`，line/fill 成对，fill 版追加 `-fill`。
- 组件 Token：`references/tokens/components/icon.tokens.json`，本轮新增并接入构建。

## 实现对照

- 代码基座：`assets/styles/gj-b2b-components.css` 已有 `.gj-icon` 与七档尺寸类（`.gj-icon-12` … `.gj-icon-36`），走 `mask` + `currentColor`，`--gj-icon` 逐实例设置资源地址。General/File Icon 复用该基座；Effect/Motion Icon 保持独立渲染路径，不套进 mask 管线（与 rules.md 的既有约束一致）。
- 规范/检索页：`preview/icons/index.html`，用于图标查找与预览，不是第二套设计真值；实际尺寸、颜色、间距以 rules.md 与本 mapping/token 为准。

## 2026-09-10：数字后缀命名（关闭 ICO-004）

System 源清单中 20 个文件带无语义数字后缀：`download1`、`history1`、`list1`、`loading1`、`loading2`、`more1`、`notification1`（含 fill）、`question1`、`refresh1`、`refresh2`、`safety1`（含 fill）、`settings1`（含 fill）、`settings2`（含 fill）、`share1`（含 fill）、`upload1`。

下一步原是「为每项补充可区分的英文语义名和兼容别名」。用户确认 **暂不补充**。不改源文件、manifest、iconfont 调用名，不加 alias。页面与组件继续用现名（如 `icf_system_loading1`）。

## 开放问题

无。本组件走 `local-contract` 是用户主动确认结构一致后的决定，不是审计中断，因此不登记新的待确认项；若后续对具体图标资源（而非组件契约本身）有疑问，按现有 `icons/index.json` 缺失项流程单独处理，不影响本文件的 local-contract 状态。

## 结论

Icon 为 `local-contract`：schema / mapping / audit / 组件 Token 已按用户确认与现有规则补齐，`preview/icons/index.html` 已验收。覆盖看板不再缺 structuredContract 与 componentToken；如未来需要逐图标或逐 variant 的 Figma 真值核实，需用户另行发起，不在本轮范围内。
