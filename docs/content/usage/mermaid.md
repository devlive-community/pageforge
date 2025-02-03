---
title: Mermaid
icon: merge
---

PageForge 支持使用 [Mermaid](https://mermaid.js.org "Mermaid" "_blank") 图表语言。

!!! danger "注意"

    该功能需要在配置文件中启用，可以在 `pageforge.yaml` 中配置 `feature.mermaid.enable: true`

!!!

## 基本语法

---

```markdown
:::mermaid
sequenceDiagram
    Alice->>John: Hello John, how are you?
    John-->>Alice: Great!
:::
```

## Flowchart 图表

---

:::mermaid
flowchart LR
    id
:::

## Sequence 图表

---

:::mermaid
sequenceDiagram
    Alice->>John: Hello John, how are you?
    John-->>Alice: Great!
:::

## Minimap 图表

---

::: mermaid
mindmap
  root((mindmap))
    Origins
      Long history
      ::icon(fa fa-book)
      Popularisation
        British popular psychology author Tony Buzan
    Research
      On effectiveness<br/>and features
      On Automatic creation
        Uses
            Creative techniques
            Strategic planning
            Argument mapping
    Tools
      Pen and paper
      Mermaid
:::