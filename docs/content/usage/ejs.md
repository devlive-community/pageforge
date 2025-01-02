---
title: EjsTemplate
icon: code
---

PageForge 支持使用 [EJS](https://www.ejs.co/ "EJS" "_blank") 模版语言。默认我们提供两种数据:

- `pageData`: 当前页面的数据
- `siteData`: 当前站点的数据

EJS 模版语言的用法请参考 [EJS 文档](https://www.ejs.co/ "EJS" "_blank")

!!! danger "注意"

    我们只支持 `<% %>` 和 `<%= %>` 语法

!!!

## 基本语法

---

只需要在 markdown 文件中添加类似以下代码：

```
<%= pageData.title %>
```

将渲染出来

```
PageForge
```