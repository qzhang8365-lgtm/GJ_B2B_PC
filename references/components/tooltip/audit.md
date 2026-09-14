# Tooltip Figma 审计

来源：文档页 `3623:2`（信息提示Tooltip✅ 画布），组件集 `toolip`（`3582:1816`，dark）与 `toolip_fill`（`3630:3385`，light），只读检查。

## 发现问题（均已由设计侧确认关闭，2026-09-08，见 references/audit-tracker.md TLT-001~005）

1. **`已确认`：圆角与内边距为固定值**
   - 两个组件集的圆角（8px）和内边距（16px）在 Figma 节点上均为硬编码数值。
   - 结论：设计侧确认这是有意的固定值，不追加圆角/间距变量绑定。（TLT-001，已关闭）

2. **`已确认`：dark / light 两种风格在契约层合并，Figma 源文件暂不合并**
   - `toolip`（8 个 position 变体）与 `toolip_fill`（8 个 position 变体）是两个平行的组件集，合计 16 个变体。
   - 结论：本 Skill 与规范页在 schema.json / rules.md / preview 页里用 `style` 属性把两者抽象为同一组件的两种取值，便于查询和维护；Figma 源文件本身维持两个独立组件集，暂不合并。两种表达并存、互不替代，不得据此反过来推断 Figma 已合并。（TLT-002，已关闭）

3. **`已确认`：文字颜色与箭头颜色绑定**
   - `dark` 风格文字颜色绑定语义变量 `Text/reversal`（不是硬编码白色）。
   - 箭头三角形颜色跟随所在风格的背景色（dark 用 `Background/MK_80`，light 用 `Background/Container`）。（TLT-003，已关闭）

4. **`已确认`：三个文档章节内容已补齐**
   - 文档页 `04 Content`、`05 Accessibility`、`06 Boundary & DoDont` 三个章节此前为占位文本，设计侧已提供实际内容（内容与文案字数/文案规则、可访问性的键盘与对比度要求、Tooltip/Popover/Toast 边界与推荐/避免清单），已并入 `rules.md` 对应章节。（TLT-004，已关闭）

5. **`已确认`：dark 与 light 的适用场景**
   - dark 为通用默认场景使用；light 一般不使用。（TLT-005，已关闭）

6. **`已确认`：position 精简为仅 top_center**
   - 设计侧明确指示：Skill 契约层（schema.json / rules.md / mapping.json）与预览页的 `position` 属性从 8 个方向精简为仅 `top_center`。
   - 重要说明：Figma 源文件抽取时（2026-09-08）仍含 8 个 position 变体，本次未修改 Figma 设计稿，由设计侧后续手动同步简化。在设计侧完成 Figma 同步前，Skill 契约层与 Figma 源文件在 position 取值范围上存在暂时性差异，属已知、经确认的过渡状态，不代表核查遗漏。（TLT-007，已关闭）

## 结论

Tooltip 已完成 Figma 读取和四件套产出（schema.json / rules.md / mapping.json / audit.md），状态为 `figma-audited`。上述 6 项问题已全部由设计侧确认并关闭，无遗留待确认项。`preview/tooltip/index.html` 已同步更新为确认后的内容、Token 绑定与精简后的 position（仅 top_center），并修正了此前箭头未精确对齐触发元素的问题。Figma 源文件的 position 变体尚未同步精简，待设计侧手动调整。
