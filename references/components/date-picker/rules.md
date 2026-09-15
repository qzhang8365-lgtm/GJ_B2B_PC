# DatePicker 日期选择器

> 从 `references/design-system-rules.md` 拆分，并于 2026-09-08 对 Figma 页面 `2401:13` 完成真审计。结构化真值见 `schema.json`、`mapping.json` 与 `date-picker.tokens.json`；待确认差异见 `audit.md`。

- 模式：单日期、日期范围、月份、年份；触发器尺寸为 24/32/40px。根据任务精度选模式，不用完整日期面板选择只需要月份或年份的数据。
- 面板不能共用一个固定高度：普通日期为 280×274px，带提醒为 280×354px；单月范围为 280×322px，双月范围为 560×322px；月份/年份均为 280×318px。Header 48px；日期格 32×32px、圆角 6px；月份/年份项 80×32px、三列。范围操作区高 48px、按钮间距 12px、无顶部分割线，按钮使用 Medium（32px）。
- 日期状态包括 Default、Hover、Selected、Today、Disabled、Notification；范围状态包括 Start、In Range、End，起止使用品牌蓝，中间使用连续浅蓝背景。Disabled 优先级最高，运行时不得响应 Hover；Figma 中现存 Disabled+Hover 视觉属于 `DTP-005` 待修问题，不能照抄。
- 先选择开始再选择结束；第二次日期早于起点时自动交换起止值。Notification 点只表达附加日程，不改变可选状态。
- 单日期可选择后直接关闭；复杂范围可使用 Clear/OK 确认。输入值、表格和详情中的日期格式必须统一。
- 禁用过去日期、节假日或业务范围外日期时应能解释原因；快捷 Today/Clear 不得预填会产生业务后果的日期。
- Calendar 是全局共享组件，DatePicker 只能组合它：面板用 `gj-calendar`，双月用 `gj-calendar-group` 包两个 `gj-calendar`，底部操作区 `gj-calendar-footer` 与双月容器同级、按钮使用 `gj-btn`。工作台等处独立展示日历时用同一套类，配 `gj-calendar-fluid` 自适应宽度。页面和脚本不得再复制一份日历。
- 日期格为 `gj-calendar-day`，状态类 `-other / -today / -notice / -selected / -range / -start / -end`；月份与年份用 `gj-calendar-grid` + `gj-calendar-cell`（选中 `gj-calendar-cell-selected`），三列 80×32。
- 紧凑日期网格宽 256px，横向间距为 Figma 实测 5.2px、纵向间距 4px。范围态若只给中间日期铺底色会断开，范围桥宽为 44px；实现可用伪元素或等价方式跨越横向间距，但不得硬套旧的 4px 补偿。Today/Notification 标记使用 `currentColor`，以便与选中态同时出现时仍可见。
- 触发器为 `gj-date-trigger`，三档 `gj-date-trigger-small / -large` 对应 24/32/40px，`-has-value`、`-disabled`、`-range` 分别表示已填写、禁用与范围模式；日历图标使用 `gj-date-icon` 并通过 `--gj-icon` 传入图标地址，不得直接放 `img`。
- 2026-09-10 DTP-002：Figma `Date-Picker`（`3042:4720`）已补触发器态，现为 60 个 variant。Status=`default / filled / hover / focus / error / filled-hover / filled-focus / filled-error`；Disable 只与 default/filled 组合。Hover 描边 `Border/hover`；Focus 描边 `Border/focused` 1.5px，外发光为未绑定的 4px / `#2B73FF40`；Error 描边 `Border/error`、无发光。优先级仍是 `Disabled > Error > Open/Focus > Hover > Filled/Default`。没有 Open、Clear 轴：展开时与 Focus 同视觉（`aria-expanded` / `:focus-visible`）；Clear 只出现在面板 footer，不在触发器上做清除图标。规范页可用 `is-hover / is-focus / is-error` 冻结示意。
- Large 触发器使用 `中文/S7-CN-R`；Medium 与 Small 都使用 `中文/S8-CN-R`，Small 不得降成 12/18。图标与按钮内图标统一使用 System 资源并通过 `currentColor` 跟随文字色。
- 上述面板高度是审计参考尺寸，不是裁剪约束。真实月份需要 6 行日期或内容扩展时高度必须随内容增长，不得用固定高度加 `overflow:hidden` 裁掉最后一行。
- 触发器状态优先级为 `Disabled > Error > Open/Focus > Hover > Filled/Default`；日期格为 `Disabled > Selected/Range edge > In range > Today/Notification > Focus/Hover > Default`。Disabled 日期不得因标记类、选中类或伪类再获得背景、范围桥或按压反馈。
- 日期格键盘交互使用单一活动焦点：左/右移动 1 天，上/下移动 7 天，Home/End 到当周边界，PageUp/PageDown 移动月份，加 Shift 移动年份，Enter/Space 选择，Esc 关闭并返回触发器。焦点移动不等于选择。
- 解析和格式化是显式契约：界面显示、提交值和时区必须分开声明；不根据本机地区猜测含糊文本日期。范围值必须同时验证起止值、先后顺序和可用边界。
- `min/max`、禁用日期、已占用日期与业务时区均由外部数据驱动。已打开面板时这些条件发生变化，必须重新计算可选状态；既有值失效时显示明确 Error，不静默提交。
- 范围选择的 Clear 只清空待确认值，Cancel/Esc 恢复打开前值，OK 才提交完整范围；单日期直接提交与范围待确认模式不得共用一个含糊状态。
- Calendar 日期单元格中的 Today / Notice 圆点必须相对 32px 日期单元格水平居中，使用 `left:50%` + `translateX(-50%)`；不能用固定左边距，也不能依赖伪元素的静态位置。圆点垂直位置分别沿用状态定义，复合状态下仍以日期文字中心线对齐。
