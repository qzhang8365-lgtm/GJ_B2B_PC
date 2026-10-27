# 图标使用与维护

始终从 [唯一图标入口](index.json) 选择资源类型，再读取对应manifest。普通图标的名称、分类、风格和文件以manifest为准；字体class、Unicode、codepoint以对应line/fill命名空间映射为准，禁止按名称后缀或扁平码表推断。兼容别名只用于解析旧调用，不重复计数。

预览网格使用真实iconfont；详情使用同名SVG，复制与下载取最新SVG原文，PNG由详情图导出。当前382枚均有有效字体字形；新版loading已不需要旧版SVG降级。

System旧SVG目录仅为派生审计镜像，不能作为选图的另一个入口。保留delete-fill F080兼容资源，其 Figma 来源已确认为节点 `5396:3700`。ICO-006、ICO-007、ICO-008 均已关闭，证据见system-audit.md。

维护移动端时运行 `python3 scripts/sync-icon-resources.py`、`python3 scripts/build-preview-data.py`，再用 `--check` 检查产物；需要同步PC副本时给前一个脚本传 `--root <PC目录>`。已有原型的内嵌块由各端embed-icons脚本重新生成。资源更新须同步字体二进制URL、CSS、catalog、源码缓存与Icon页引用版本，避免只更新文件而网页命中旧缓存。不得改写既有码位、class或别名。
