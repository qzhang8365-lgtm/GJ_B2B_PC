# Avatar 头像

> 从 `references/design-system-rules.md` 拆分（2026-09-08）。跨组件的颜色/字体/布局/圆角等基础规范见该文件“基础规范”章节。

> 2026-09-09 已完成 Figma 真实审计（组件集 `2982:622`，24 variants）。方形圆角 4/6/8/12px、默认图标 16/20/28/44px 经实测核实与本文件一致；40/64 两档图标尺寸不满足与 24/32 相同的「容器-2×内边距」公式，是独立设定的真实值，不强行统一（结构化细节见 `avatar/schema.json` 与 `avatar/audit.md`）。

- 表示用户或实体身份；`size`：64/40/32/24px，`shape`：Circle/Square，`style`：Picture/Letter/Default。
- 方形圆角分别为 12/8/6/4px；默认人物图标约 44/28/20/16px。图片居中 cover，禁止拉伸。
- 兜底优先级：真实图片 → 一个可识别首字母 → 默认人物图标；不在头像内放完整姓名。
  - **AVT-001**：首字母兜底在 Figma 里是背景色块与文字被合并导出成的单个矢量图形（非独立可编辑文字层），不能直接复用 Figma 导出资源；前端必须用真实文字节点在代码里根据用户名动态生成首字母，Figma 仅作为背景色（`Text/blue`）与排版比例的参考。
- 可叠加 Dot 或 Number Badge，固定右上角并用容器色描边，不遮挡主体；同一头像不同时显示两种 Badge。
  - **AVT-002（已按通用惯例设置默认值，非 Figma 已核实）**：Avatar 组件集的 24 个 variant 里没有 badge 相关的 variant 轴，缺乏 Figma 依据。2026-09-09 已复用 Badge 组件自身既有尺寸（Dot 8px、Number 高/最小宽 20px）与主流设计系统惯用的头像角标叠加方式（右上角、圆心对齐边角、2px 容器色描边），24px 头像仅支持 Dot（缩小到 6px）不支持 Number。具体 token 见 `avatar.tokens.json` 的 `badge.*`；后续若有真实叠加设计稿以 Figma 为准覆盖，见 `avatar/audit.md` AVT-002。
- 头像组保持相同尺寸、形状和重叠间距；数量多时显示代表头像和末尾“+数量”，不无限延伸。

