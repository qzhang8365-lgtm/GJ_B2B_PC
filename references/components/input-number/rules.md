# Input Number 数字输入

> 从 `references/design-system-rules.md` 拆分（2026-09-08）。跨组件的颜色/字体/布局/圆角等基础规范见该文件“基础规范”章节。

- 用于数量、金额、比例等可计算数值；账号、证件号等数字字符串仍使用普通 Input。
- 模式包括基础输入、左右加减、固定单位/币种、右侧步进、单值 Slider、Range Slider。Small/Medium/Large 为 100×24、112×32、133×40px，圆角 4/6/8px；Addon 与单位条宽度等于档位高度。
- Figma 母版默认 size=small、state=filled；产品默认仍用 Medium。无 error 视觉轴。active 仅 Border/focused 1px 描边。
- 必须定义 Min、Max、Step；越界、空值和非法格式及时反馈。单位固定展示，不要求用户重复输入。
- 用户可直接输入或步进；到达边界时对应增减操作不可继续。Slider 用于快速调整，精确确认时显示 Tooltip；Range 两端不得交叉产生非法区间。
- Disabled 必要时说明原因。输入值使用当前 UI 字体；继续遵守千分位和小数精度规则。


- 实现基座：`assets/styles/gj-b2b-components.css` 的 `.gj-number-input*`/`.gj-slider*` 共享类（2026-09-09 从预览页内联样式提炼），对应结构/颜色 Token 见 `assets/styles/gj-b2b-tokens.css` 的 `--ds-component-input-number-*`。
