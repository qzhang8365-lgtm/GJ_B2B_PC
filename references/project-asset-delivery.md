# 项目资源归档与路径隔离

本规范适用于使用本 Skill 新建页面、覆盖既有页面或交付可运行原型。公共 Skill 目录是只读资源源，不是业务页面的运行时依赖。

## 强制结果

- 页面实际使用的设计系统 CSS、运行时、Icon、字体和图片，必须复制到目标项目根目录的 `assets/` 下，并改用项目内相对路径。
- 最终 HTML、CSS、JS 不得引用 `~/.codex/skills/`、`.claude/skills/`、其他 AI 工具的公共 Skill 目录、`file:///Users/...` 或作者电脑上的绝对路径。
- “复制到项目”是复制，不是移动或删除公共 Skill 中的源文件。公共 Skill 必须保持可供其他项目继续使用。
- HTTP 部署、本地服务器和 `file://` 交付都执行本规则；`file://` 还需继续执行 `local-file-delivery.md` 的 SVG Mask 内嵌规则。

## 只复制依赖闭包

禁止把整个 Skill、完整 `assets/` 或整套 Icon 库复制进业务项目。以页面入口为起点，只归档以下内容：

1. 页面直接引用的共享样式、运行时、Icon、图片和字体；
2. 已复制 CSS 通过 `url(...)` 或 `@import` 继续引用的文件；
3. 已复制运行时明确点名的静态资源；
4. 多个页面共同使用的同一文件只保留一份。

以下内容不进入业务项目：`SKILL.md`、`references/`、`preview/`、审计文件、schema、mapping、未使用组件的预览资源、未使用 Icon/图片，以及维护脚本本身。

共享 CSS 文件本身可以包含未命中的组件选择器；它作为页面直接依赖可以整体复制。但不得因此顺带复制 CSS 没有引用、页面也没有引用的整个资源目录。

## 目录与引用约定

保持 Skill 内 `assets/` 的相对分类，避免复制后再次改写依赖：

```text
<project>/
├── index.html
└── assets/
    ├── styles/
    ├── scripts/
    ├── icons/
    ├── images/
    └── fonts/
```

- 页面引用使用相对于当前 HTML 的路径，例如 `./assets/styles/gj-b2b-tokens.css`。
- CSS 内 `../icons/`、`../fonts/` 等相对路径保持原目录关系。
- 不得为了省事改成公共目录绝对路径、符号链接或运行时 `fetch()` Skill 文件。
- 项目已有同名资源且内容不同时，不得静默覆盖；先判断是项目定制还是旧版本，再决定合并或替换。

## 执行与门禁

从目标项目根目录运行：

```bash
node <skill目录>/scripts/stage-project-assets.mjs <页面HTML或页面目录> --write
node <skill目录>/scripts/stage-project-assets.mjs <页面HTML或页面目录> --check
```

可用 `--project-root=<项目根目录>` 显式指定根目录。脚本会：

- 找出指向公共 Skill `assets/` 的页面依赖；
- 只复制命中的文件及 CSS/运行时可静态确定的依赖；
- 把 HTML 中的公共路径改成项目内相对路径；
- 检查缺失的项目内资源、绝对本机路径和残留公共 Skill 路径。

脚本不能推断运行时拼接、接口返回或业务配置动态产生的任意路径。此类资源必须根据组件用料清单显式复制，并在浏览器 Network 面板与断网环境中复核。

## 交付阻断项

以下任一情况都不能交付：

- 页面运行时仍读取公共 Skill 目录；
- 项目 `assets/` 缺少 HTML/CSS/JS 已引用的本地文件；
- 为解决单个页面路径问题复制了整套 Skill 或完整 Icon 库；
- 使用符号链接把项目 `assets/` 指回公共 Skill；
- 项目换目录、换电脑或移除公共 Skill 后页面样式、图标、字体或交互失效。
