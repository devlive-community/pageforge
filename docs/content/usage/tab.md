---
title: 选项卡
---

PageForge 支持使用 markdown 实现了选项卡相关信息。

### 基本语法

---

```markdown
::: tabs

    === "Tab 1"
        这是第一个 Tab 的内容
        支持多行内容
    
    === "Tab 2"

        这是第二个 Tab 的内容
        也支持 **Markdown** 语法
    
    === "Tab 3"

        第三个 Tab 的内容

        - 支持列表
        - 支持其他 Markdown 内容

:::
```

::: tabs

    === "Tab 1"
        这是第一个 Tab 的内容
        
        支持多行内容

        这是 `dd` 哈哈

    === "Tab 2"
        这是第二个 Tab 的内容

        也支持 **Markdown** 语法
    
    === "Tab 3"
        第三个 Tab 的内容

        - 支持列表
        - 支持其他 Markdown 内容

:::