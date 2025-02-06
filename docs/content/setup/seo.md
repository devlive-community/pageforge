---
title: SEO 设置
icon: search
status:
    type: new
---

PageForge 支持 SEO 设置，可以帮助你优化网站的搜索引擎优化（SEO）。

## 基本用法

---

PageForge 支持 SEO 设置，可以帮助你优化网站的搜索引擎优化（SEO），包括标题、关键字和描述等。

```yaml
site:
  description: PageForge 是一个简单的静态网站生成器，可以将 Markdown 文档转换为静态 HTML 页面。
  keywords: PageForge, Markdown, Static Site Generator
  author: devlive-community
```

- `description`: 网站描述
- `keywords`: 网站关键字
- `author`: 网站作者，默认为 PageForge

> PageForge 支持的 SEO 设置包括标题、关键字和描述等，可以帮助你优化网站的搜索引擎优化（SEO），提高网站的排名。

## 页面配置

---

PageForge 支持设置页面的 SEO 设置，可方便为不同的页面设置不同的 SEO 设置。只需要设置 markdown 文件的元数据即可。

```yaml
---
description: PageForge 是一个简单的静态网站生成器，可以将 Markdown 文档转换为静态 HTML 页面。
keywords: PageForge, Markdown, Static Site Generator
---
```

!!! danger "注意"

    页面配置文件的元数据会覆盖全局的 SEO 设置，即使你设置了全局的 SEO 设置，也会被覆盖，页面 SEO 无法设置 `author`。

!!!