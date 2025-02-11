---
title: Api
icon: webhook
---

PageForge 支持渲染 Restful API 的语法。

## 基本语法

---

```markdown
::: api GET /api/users

这里是API的描述文本，支持Markdown格式。

=== "请求参数"
    这里是请求参数的详细说明
    支持多行内容

=== "响应示例"
    这里是响应示例的内容

:::
```

- 显示效果

::: api GET /api/users

这里是API的描述文本，支持Markdown格式。我是 **粗体** 文本。

=== "请求参数"
    这里是请求参数的详细说明
    支持多行内容
    也支持代码块：
    ```json
    {
      "name": "example"
    }
    ```

=== "响应示例"
    这里是响应示例的内容

:::