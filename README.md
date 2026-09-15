# 国金 PC 端 B 端设计系统 Skill

给 AI Agent 使用的国金证券 PC 端 B 端设计系统资源包：设计 Token、组件规则、图标资源与页面模式，用于生成、检查或说明 B 端页面及高保真原型。入口文件是根目录的 `SKILL.md`。

> **内部资料，请勿对外分享或转发。** 本仓库当前在 GitHub 上是公开仓库，但内容属于国金证券内部设计资产，仅供公司内部同事在自己的 Agent 里使用。

当前覆盖 42 个组件，其中 36 个已完成 Figma 属性/变量审计（其余 6 个为本地约定，标注为 `local-contract`），累计 201 项审计问题已定位、修复并留痕（见 `references/audit-tracker.md`），不是刚起步的半成品。

## 这是什么、不是什么

- 这是**给 Agent 读的资源**，不是一个前端组件库。生成的 HTML/CSS 原型用于设计表达和交付沟通，不能直接当作生产代码使用；真实组件实现、事件接口以业务前端组件库为准。
- Figma 是唯一设计真值（只读，本 Skill 从不写回 Figma）。`references/` 是已确认的本地规则和结构化数据，`assets/` 是可直接引用的产出资源。
- `preview/` 是人工浏览与交互验收站，不是 Agent 生成页面时的必读入口，也不包含在下面的精简获取方式里；组件规范预览页会另外发布到 Netlify，供人工在浏览器里直接查看，链接后续补充。

## 适用的 Agent 产品

`SKILL.md` 顶部的 YAML frontmatter（`name` / `description`）是 Claude 系产品（Claude Code、Claude Agent SDK、Cowork 等）的技能自动发现格式：把整个目录放进对应的 skills 目录（例如 Claude Code 的 `.claude/skills/<name>/`），这些产品会自动识别并按需读取。

如果同事用的是其他厂商的 Agent（不支持这套发现机制），仍然可以用，只是需要手动把 `SKILL.md` 的内容喂给它作为系统提示或前置上下文，而不会被自动识别——用之前确认一下自己的 Agent 是否支持 Claude 的 Skill 格式。

## 常用 Prompt 示例

以下都假设已经按上面的方式把这个目录接入了 Agent（对话里能读到 `gj-b2b-pc-design-system/SKILL.md`）。直接照抄改一下具体需求即可；关键是**点名 SKILL.md**、**指定页面模式或组件名**，让 Agent 走它自己的工作流，而不是凭经验直接开始写 CSS。

**1. 生成一个新页面**（选好五种页面模式之一：查询列表 / 新建或编辑表单 / 对象详情 / 概览与工作台 / 分步任务）：

> 参考 `gj-b2b-pc-design-system/SKILL.md` 里的设计系统，帮我生成一个「客户信息编辑」页面，用「新建或编辑表单」这个页面模式，需要包含基本信息、联系方式、风险等级三个分组。交付前按 SKILL.md「默认交付内容」给出结构化说明，业务口径不清楚的字段标「待确认」，不要自己编一个默认值。

**2. 检查一个已有页面是否符合规范**（把页面代码贴给 Agent 或指给它文件路径）：

> 这是我们已有的一个页面代码，请对照 `gj-b2b-pc-design-system/SKILL.md` 的「页面生成组件门禁」和 `generation-verification.md` 的验证清单检查一遍，找出所有跟这套设计系统冲突的地方（比如原生控件冒充组件、页面私有 CSS 覆盖了组件基座、状态没覆盖完整等），列出具体问题和修改建议，先不用直接改代码。

**3. 只做组件选型咨询，不生成代码**：

> 我要在一个查询列表页里让用户选省市区三级联动，这套设计系统里应该用哪个组件？给我它的适用场景、状态矩阵和使用边界，先不用写代码。

**4. 明确要求做生成后渲染验证**（Agent 需要有代码执行/浏览器能力才能真的跑，比如 Claude Code；纯对话型 Agent 做不到这步，只能靠人工在预览页里核对）：

> 页面生成完之后，按 `generation-verification.md` 的方法做一次真实渲染验证（内容溢出、尺寸、图标颜色、间距四类），不要只靠读代码或看一次截图判断，把验证结果也一起给我。

## 给同事：如何在自己的 Agent 里接入

**只读使用**：这份资源目前按只读方式分发。如果发现规则有问题或需要调整，请通过企业内部群反馈给维护方（具体群由维护方另行同步）——不要在自己本地直接改这份资源再各自维护一份副本，分叉的规则会导致同一个组件在不同人手上出现不一致的版本。

仓库只有 `main` 一个分支，随时是最新状态，不需要关心其它分支。

> 需要 Git 2.25 及以上版本（`sparse-checkout --cone` 模式依赖这个版本起的功能）。版本更老的话用下面的「方式二：完整获取」。

### 方式一：精简获取（推荐，不含 20MB 的 preview/ 预览页）

Agent 生成页面只需要 `SKILL.md`、`references/`、`assets/`、`scripts/`，用 Git 的 sparse-checkout 只拉这些内容：

```bash
git clone --no-checkout https://github.com/qzhang8365-lgtm/GJ_B2B_PC.git gj-b2b-pc-design-system
cd gj-b2b-pc-design-system
git sparse-checkout init --cone
git sparse-checkout set references assets scripts
git checkout main
```

`git sparse-checkout` 的 cone 模式会自动带上仓库根目录下的文件（`SKILL.md`、`package.json` 等），只是不会拉取 `preview/` 这个大目录。

以后要同步最新版本，在这个目录里执行：

```bash
git pull
```

### 方式二：完整获取（含预览页，用于同时想在本地浏览组件规范页的情况，或 Git 版本较旧不支持 sparse-checkout）

```bash
git clone https://github.com/qzhang8365-lgtm/GJ_B2B_PC.git gj-b2b-pc-design-system
```

### 接入到 Agent

克隆下来的目录名建议保持为 `gj-b2b-pc-design-system`（跟 `SKILL.md` frontmatter 里的 `name` 字段一致），这样各类支持 Skill 目录发现机制的 Agent（例如把技能放进 `.claude/skills/<name>/` 的用法）能正确识别。具体接入方式取决于同事用的 Agent 产品，不确定的话可以直接把这个目录路径告诉 Agent，并指向 `SKILL.md` 作为入口文件。

## 给维护方（改动这份 Skill 的人）

- 改动前先读根目录 `SKILL.md`「工作流」与「组件实现与引用协议」两节。
- 提交前建议启用本地提交门禁（一次性）：

```bash
npm install
npm run install-hooks
```

门禁细节见 `scripts/git-hooks/pre-commit-checks.mjs` 文件头注释，以及 `references/generation-verification.md`。

- 组件规则、Token、审计记录的维护流程见 `SKILL.md`「维护」一节。
- 每次改动的具体内容和原因，优先看 `git log` 和 `references/audit-tracker.md`；后者按组件/问题记了根因、修复方案和验证过程，是比 commit message 更详细的变更记录。
