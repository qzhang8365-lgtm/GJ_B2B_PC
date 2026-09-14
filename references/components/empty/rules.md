# Empty 空状态

> 2026-09-09 已对 Figma 页面 `3143:5678` 完成真审计。结构化真值见 `schema.json`、`mapping.json`、`empty.tokens.json`，证据与关闭项见 `audit.md`。

- `type`：TextOnly / Empty / NotFound / Disconnected / NoPermission / Error / NoChart；`action`：None / Button。NoChart 使用 Figma 已有 `no chart` 插图，是 Skill 对主 Type 的有源扩展。
- 默认宽 240px。标题为 `中文/S5-CN-S`（14/22/600、Text/Primary）；说明为 `中文/S9-CN-R`（12/18/400、Text/Secondary）。文字间距 4px、插图与文字 12px、内容与按钮 16px。
- 插图必须复用 `Empty_item/img` 的真实资源，宽 100px、高 89px 或 91px；不得用通用图标、CSS 图形或临时 SVG 重画。已有标题和说明时插图属于装饰，使用空 alt 并从读屏顺序隐藏。
- 操作按钮必须复用 Primary Medium Button；Empty 不维护第二套按钮 CSS。只有存在真实且当前可执行的恢复路径时才显示，默认文案可按业务通过 `actionLabel` 覆盖。

## 类型选择

- TextOnly：表格单元、小卡片和窄区域；空间不足或插图会干扰信息密度时使用。
- Empty：系统或当前区域尚无记录；可提供“创建内容”等首次操作。
- NotFound：数据可能存在，但当前搜索或筛选没有匹配；通常提供“清空筛选”或“调整条件”。
- Disconnected：网络不可用；提供“重新加载”前保留用户输入和筛选。
- NoPermission：访问控制阻止查看；不得暗示受保护数据是否存在。没有真实申请/联系流程时不显示按钮。
- Error：请求或渲染失败且可恢复；使用“重试”，重试中阻止重复提交。
- NoChart：图表没有可绘制序列；若坐标轴、时间范围或图例仍有解释价值，可保留图表框架并在绘图区居中空状态。

## 状态切换与边界

- 首次请求完成前显示 Loading 或 Skeleton，不能先闪现 Empty。请求成功且结果确实为空后才切换为空状态。
- 局部区域失败只替换该区域，不因单个卡片或图表失败清空整页。已有旧数据时优先保留可识别的旧数据并标明刷新失败。
- Empty 不用于加载中、成功确认、破坏性警告或表单校验；同一区域不叠加相同内容的 Toast、Alert 或 Notification。
- 标题直接说明状态，说明补充原因或下一步，避免重复。长文案在 240px 内换行并让高度自然增长，不得固定高度裁切。
- 切换筛选、分页或标签时，先确认请求结果再替换内容；需要防抖的搜索应在请求稳定后呈现 NotFound，避免频繁闪烁。

## 交互与无障碍

- Empty 自身无 hover/pressed；只有嵌套 Button 使用 Button 的 hover、pressed、focus-visible、loading、disabled 状态。
- 静态初始空状态无需 live region。由用户操作产生的新空结果使用 `role=status` 或 `aria-live=polite`，不要再用 Toast 重复播报。
- 普通可重试错误也使用 polite；只有必须立即处理的阻断错误才使用 `role=alert`。
- 不把焦点移到插图或纯文案。结果变化后保留在发起操作的控件；若该控件消失，可把焦点移到唯一恢复按钮或合适的区域标题。
- Action 触发时保持当前查询条件、表单输入和上下文；成功后把焦点恢复到新内容或合理的首个操作点。

`Empty_Basic`（`3143:5844`）是旧的英文 `No Data` 独立组件，已标记 deprecated。新页面一律使用统一 Empty，不得把它当成第二套空状态。
