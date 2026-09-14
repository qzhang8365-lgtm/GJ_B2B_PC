# InputNumber 契约说明（rules-derived，非 Figma 审计）

来源：`references/design-system-rules.md` 第 1070–1076 行「Input Number 数字输入」原文；`references/tokens/dimensions.json` 中的 Radius 系列；`references/components/input.json` 中已核实的 Input 真实 Figma token 绑定。

本轮**没有**收到 Figma 链接或节点 ID，因此没有调用 `get_design_context` 做逐 variant 核实，项目里也没有 `preview/input-number/index.html` 规范页可读。这一点需要特别说明：本会话早前的 scratchpad 里有一批 Skeleton/Drawer 等组件的契约文件，其中 Drawer 那份引用了一个实际并不存在的 `preview/drawer/index.html`，并给出了一些看起来像"实测"的具体数值——核对后发现那是编造的。这份 InputNumber 文档不重复那个问题：凡是没有真实来源的数据一律留空或标注缺失，不假装读到。

## 契约范围（直接摘自 design-system-rules.md，未改写数值）

- 用于数量、金额、比例等可计算数值；账号、证件号等数字字符串仍用 Input。
- 六种模式：基础输入、左右加减、固定单位/币种、右侧步进、单值 Slider、Range Slider。
- 三档尺寸 100×24 / 112×32 / 133×40（Small/Medium/Large），圆角 4/6/8px。
- 必须定义 Min/Max/Step；越界、空值、非法格式需及时反馈。
- 到达边界时对应增减操作不可继续；Slider 精确确认时显示 Tooltip；Range 两端不得交叉。
- Disabled 必要时说明原因；输入值用当前 UI 字体；遵守千分位和小数精度规则（原文未给出具体分隔符或小数位数，不在此臆造，需按业务实现时明确）。

## 圆角与 Input 复用的交叉核对

design-system-rules.md 给出的圆角 4/6/8px 与本仓库 `dimensions.json` 中 `Radius-XS(4)/Radius-SM(6)/Radius-MD(8)` 完全对应，且与已核实的 Input 三档圆角（`references/components/input.json` 的 `dimensions.small/medium/large.radius` = 4/6/8）一致。InputNumber 的三档宽高（100×24/112×32/133×40）与 Input 不同（Input 只定义高度 24/32/40，没有固定宽度），但圆角、字体与基础态颜色沿用同一套 Input 已核实 token，依据是 design-system-rules.md 第 1072 行「数字字符串仍用 Input」这句原文——这是有文字依据的复用，不是凭空指定新颜色。

## 明确未核实/未覆盖的部分

1. **INN-001**：`assets/styles/gj-b2b-components.css` 没有 stepper 按钮、unit 后缀、slider 轨道/滑块的共享类；也没有 `preview/input-number/index.html`。六种模式的具体像素间距（按钮宽度、滑块直径、轨道高度等）design-system-rules.md 没有给出，本轮没有编造这些数字，留空由后续设计稿或前端实现补齐。
2. 千分位分隔符与小数精度的具体规则（例如是否统一用逗号分组、默认小数位数）不在 design-system-rules.md 这一节内，也没有在其他章节找到更细的规则，同样留空。
3. `size` 的默认档位（Medium）是与 Input/Button 等尺寸体系类比得出的推断惯例，design-system-rules.md 没有明确指定，schema.json 里已如实标注为推断而非事实。
4. 未做 Figma 节点级核实（本轮没有链接/节点 ID）。如需升级为 figma-audited，需要用户提供 Input-Number 页面的 Figma 链接，再用 `get_design_context`/`get_screenshot` 逐 variant 核实。

## 构建流程说明

- `scripts/build-tokens.mjs` 目前只硬编码接入了 Button 与 Text Button 两个组件（脚本第 23–24 行），Divider、Input 等其余组件的 token 都还没有进入自动构建管线；InputNumber 同样如此——`references/tokens/components/input-number.tokens.json` 是按同一 JSON 结构手写的参考文件，还没有被 `build-tokens.mjs`/`validate-tokens.mjs` 读取或校验。这与此前 checklist 里"接入构建、三个脚本全部通过"的表述不是一回事，如实说明，不重复那个说法。
- 实际执行过 `node scripts/validate-tokens.mjs` 和 `node scripts/build-tokens.mjs`：两者都能正常跑完，因为脚本本身按固定路径列表读取文件、不会主动扫描 `references/components/input-number/` 或新的 token 文件，所以新增文件不会让脚本报错——但这只说明"没有破坏现有校验"，不等于"InputNumber 已经过校验"，两者是不同的结论，这里如实区分，不混为一谈。
