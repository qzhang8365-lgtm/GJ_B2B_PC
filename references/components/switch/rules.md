# Switch 开关

> 从 `references/design-system-rules.md` 拆分（2026-09-08）。跨组件的颜色/字体/布局/圆角等基础规范见该文件“基础规范”章节。

- 用于立即生效的布尔设置，不代替提交前的 Checkbox 或互斥选择 Radio。标签描述功能，例如“消息通知”，不写随状态变化的“开启/关闭通知”。
- `size`：Medium 44×24px、滑块 20px；Small 28×16px、滑块 12px。轨道内边距 2px、圆角 12px；开启背景使用 `Brand/GJ_Blue`，滑块使用 `shadow_small`。
- 状态包括 On、Off、On Disabled、Off Disabled；Disabled 参考 40% 弱化，不可切换。
- 切换后立即反馈结果；失败时恢复原状态并说明原因。删除、权限、资金或不可逆行为不只依赖一次 Switch，应增加确认或改用明确操作按钮。
- 滑块位置表达状态方向：Off 停在轨道左侧内边距处，On 移到右侧；Medium 为 2px → 22px，Small 为 2px → 14px。不得反向放置。
- 静态组件基座为 `gj-switch`，内部结构为 `gj-switch-track` + `gj-switch-thumb`，Small 档位使用 `gj-switch-small`。

