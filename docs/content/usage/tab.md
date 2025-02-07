---
title: 选项卡
icon: pill
---

PageForge 支持使用 Markdown 实现了选项卡相关信息。

!!! danger "注意"

    该功能需要在配置文件中启用，可以在 `pageforge.yaml` 中配置 `feature.tabs.enable: true`

!!!

### 基本语法

---

```markdown
::: tabs
    === "Tab 1"
        这是第一个标签页的内容
        可以包含多行内容

        也可以包含 Markdown 格式
        - 列表项 1
        - 列表项 2
        
    === "Tab 2"
        这是第二个标签页的内容
        
    === "Tab 3"
        第三个标签页的内容
:::
```

::: tabs
    === "Tab 1"
        这是第一个标签页的内容
        可以包含多行内容

        也可以包含 Markdown 格式
        - 列表项 1
        - 列表项 2
        
    === "Tab 2"
        这是第二个标签页的内容
        
        ### 可以使用标题
        
        ```javascript
        // 甚至可以包含代码块
        const x = 1;
        ```
        
    === "Tab 3"
        第三个标签页的内容
:::