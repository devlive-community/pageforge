---
title: Tooltip
icon: figma
---

PageForge 支持解析 tooltip 的链接，您可以在 Markdown 中使用以下语法来插入 tooltip。

!!! danger "注意"

    该功能需要在配置文件中启用，可以在 `pageforge.yaml` 中配置 `feature.tooltip.enable: true`

!!!

## 基本语法

```markdown
!tip[提示文本](这是tooltip中显示的内容)
```

这是一个普通文本，这里有一个!tip[提示文本](这是tooltip中显示的内容)。

你可以用它来解释专业术语，比如：!tip[REST](Representational State Transfer 是一种软件架构风格，它允许应用程序与应用程序之间的数据通信，以及应用程序与外部世界的数据通信) 鼠标移向可以看到提示。