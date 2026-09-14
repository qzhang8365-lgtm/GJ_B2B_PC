# 组件内部控件图形（非图标库资源）

`assets/icons/` 根目录下的以下文件不是通用图标库条目：它们不出现在 `references/icons/index.json` 的任何 catalog 里，也不应通过图标查找流程选用。它们是特定组件状态的固定视觉资产，由该组件的共享 CSS 或模板直接以相对路径引用，随组件实现一起维护，不随图标库扩充。

## 审计范围

`assets/styles/*.css`、`preview/**/*.html`、`assets/scripts/*.js`。

## 使用中（10 个，根目录现存文件与此表一一对应）

| 文件 | 所属组件 | 引用位置 |
|---|---|---|
| `radio-pc-default.svg` | Radio · Default | `assets/styles/gj-b2b-components.css` `.gj-radio` |
| `radio-pc-hover.svg` | Radio · Hover | 同上 `.gj-radio:hover` |
| `radio-pc-pressed.svg` | Radio · Checked（含内圈白点，已是合成后的单文件） | 同上 `.gj-radio:checked` |
| `radio-pc-disabled.svg` | Radio · Disabled | 同上 `.gj-radio:disabled` |
| `radio-pc-mouseon-dot.svg` | Radio · Checked+Disabled（内圆点） | 同上 `.gj-radio:checked:disabled` |
| `radio-pc-mouseon-ring.svg` | Radio · Checked+Disabled（外圈，与 disabled 同一视觉） | 同上 `.gj-radio:checked:disabled` |
| `radio-pc-press-ring.svg` | Radio · Active（按压外圈，20×20 半透明蓝） | 同上 `.gj-radio:active` |
| `switch-thumb-medium.svg` | Switch · Medium 滑块 | `preview/switch/index.html` `.gj-switch-thumb img` |
| `switch-thumb-small.svg` | Switch · Small 滑块 | 同上 |
| `avatar-user.svg` | Avatar · 默认人物图标兜底 | `preview/avatar/index.html` |

## 已清理（2026-09-08，10 个，设计侧核对后确认删除）

以下文件核实后无任何引用，且经可视化核对确认是被现有实现取代的旧资产，已从 `assets/icons/` 删除：

- `checkbox-check.svg` —— Checkbox 的勾选标记改由 CSS `clip-path` 绘制，未再使用该 SVG。
- `radio-check.svg`、`radio-check-disabled.svg`、`radio-checked-bg.svg`、`radio-default.svg`、`radio-disabled.svg`、`radio-hover.svg` —— 不带 `-pc-` 前缀的旧版 radio 资产，已被 `radio-pc-*` 系列取代。
- `radio-pc-checked-dot.svg`、`radio-pc-checked-ring.svg` —— 内容核对后确认是 `radio-pc-pressed.svg` 合成前的两层半成品：`checked-ring`（16×16 纯蓝色圆，内部 id `Ellipse 3`）+ `checked-dot`（6×6 白色圆，内部 id `Ellipse 4`）按 Checked+Disabled 同款叠图方式拼合后，与 `pressed.svg` 内部同名的 `Ellipse 3` / `Ellipse 4` 视觉完全一致；`pressed.svg` 已经是合成后的单文件，两层版本不再需要。
- `radio-pc-press-dot.svg` —— 与 `checked-dot.svg` 逐字节相同（同一个 `Ellipse 4`），判断为重复命名，一并清理。

## 与图标库的边界

Radio、Switch、Avatar 完成 `references/components/` 结构化契约后（见完善清单 Phase 2），这张表里"使用中"的条目应迁移为对应组件 `schema.json` 里的资产字段，此文件届时可以整体废弃。
