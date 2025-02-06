---
title: 评论设置
icon: message-circle
status:
    type: new
---

PageForge 支持将您选择的第三方评论系统添加到任何页面的页脚。例如，我们将集成 [Giscus](https://giscus.app "Giscus" "_blank")，它是开源的、免费的，并使用 GitHub 讨论作为后端。

PageForge 的评论系统需要启用才可以。

## 启用评论

---

```yaml
feature:
  comment:
    enable: true
    content: |
      第三方评论系统返回的代码
```

## Giscus 配置

---

在使用 [Giscus](https://giscus.app "Giscus" "_blank") 评论系统时，您需要完成以下步骤：

1. 安装 [Giscus GitHub 应用程序](https://github.com/apps/giscus) 并授予对应将评论作为 GitHub 讨论托管的存储库的访问权限。请注意，这可能是与您的文档不同的存储库。
2. 访问 [Giscus](https://giscus.app/) 并通过其配置工具生成代码段以加载评论系统。复制代码段以进行下一步。生成的代码段应类似于以下内容：

    ```js
    <script src="https://giscus.app/client.js"
        data-repo="<username>/<repository>"
        data-repo-id="..."
        data-category="..."
        data-category-id="..."
        data-mapping="pathname"
        data-reactions-enabled="1"
        data-emit-metadata="1"
        data-theme="light"
        data-lang="en"
        crossorigin="anonymous"
        async>
    </script>
    ```
   
3. 将返回的代码粘贴到 `feature.comment.content` 的值中。