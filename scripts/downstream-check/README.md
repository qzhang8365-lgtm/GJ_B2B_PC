# 下游消费仓库校验包（最小可用版）

如果你在自己的项目仓库里，用国金 PC 端 B 端设计系统生成 B 端页面，可以把这个文件夹整体复制到你自己的仓库里，跑一次轻量检查，抓一部分最容易犯的低级问题——不需要装 Playwright，也不需要接入设计系统仓库本身。

## 怎么用

1. 把 `scripts/downstream-check/` 这整个文件夹（`check-page.mjs` + `known-tokens.json` + 本 README）复制到你自己项目仓库里的任意位置，例如同样放在 `scripts/downstream-check/`。
2. 在你的项目仓库根目录执行：

   ```bash
   node scripts/downstream-check/check-page.mjs path/to/page.html
   # 或者直接扫一整个目录
   node scripts/downstream-check/check-page.mjs path/to/pages/
   # 不传参数时，默认扫描当前目录下所有 .html / .css 文件
   node scripts/downstream-check/check-page.mjs
   ```

3. 输出分两类：
   - `[阻断]`：命中了明确的问题（裸十六进制颜色命中了设计系统已知 Token 值、或出现了 SKILL.md 明确禁止的私有类名如 `.btn`/`.input`/`.navbar` 等），退出码为 `1`。
   - `[提示]`：间距疑似不在设计系统的 4px 阶梯上、或文本里出现了 emoji 字符，误报率较高，只作为提示，不影响退出码。

你可以把它接到自己项目的 CI 或 pre-commit 里（用退出码判断是否阻断），也可以就手动跑跑看；这份最小可用版本身不附带 pre-commit/CI 模板，接入方式由你自己项目决定。

## 这份校验包做什么、不做什么

**做的事**：三类零依赖的静态文本扫描——裸 HEX 撞库、私有类名重画、间距/emoji 提示。这些都是纯正则扫描，任何装了 Node 的环境都能跑，不会因为没装浏览器就整个失效。

**不做的事**：不做真实渲染校验——看不出内容溢出、元素重叠、图标文字颜色不同步这类必须渲染后才能发现的问题。这类校验仍然需要设计系统仓库自己的 `scripts/verify-page.mjs`（依赖 Playwright），只能在设计系统仓库里跑，没有下游轻量版。

## 提醒：不要拿它扫这个设计系统仓库自己的 preview/

这个脚本是给同事扫**自己项目仓库里生成的业务页面**用的。如果你好奇拿它对着这个设计系统仓库自己的 `preview/` 目录跑一遍，会看到几条 `[阻断]`——那不是脚本的 bug，而是 `preview/` 里混杂了规范站外壳（`references/tokens/docs-site.tokens.json` 体系，允许出现脚本算出来的对比色等特例）和纯示意用途的标注元素，这些页面本身是 `human-preview-only`，不适用业务页面的门禁标准。检查对象应该是同事自己项目里、真正要交付的业务页面。

## 保持更新

`known-tokens.json` 是设计系统仓库在某个时间点生成的静态快照，不会自动跟着设计系统的 Token 更新。设计系统发布新版本后，找设计系统仓库要一份新生成的 `known-tokens.json`（在设计系统仓库里执行 `node scripts/downstream-check/build-package.mjs` 即可重新生成），替换掉你这边的旧文件就行，`check-page.mjs` 本身通常不需要跟着换。
