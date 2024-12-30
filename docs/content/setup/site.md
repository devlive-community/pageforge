---
title: 站点设置
---

```markdown
site:
  title: PageForge
  hiddenTitle: true
  description: PageForge 是一款现代化的静态页面生成与部署平台，旨在帮助用户快速创建精美的静态网站，并一键部署到 GitHub Pages。 无论是个人博客、项目文档还是企业官网，PageForge 都能让你轻松实现高效构建、智能部署和即时上线。
  logo: /assets/logo.svg
  favicon: /assets/logo.svg
```

> 请注意，这些设置只是一些示例，你可以根据自己的需求进行修改。

- `title`: 网站标题
- `hiddenTitle`: 是否隐藏标题，默认为 `false`，设置后 logo 右侧的标题将会隐藏
- `description`: 网站描述
- `logo`: 网站图标
- `favicon`: 网站图标

## 主题设置

---

```markdown
theme:
  extra_css:
    - /assets/extra.css
  extra_js:
    - /assets/extra.js
```

- `extra_css`: 附加的 CSS 文件路径
- `extra_js`: 附加的 JavaScript 文件路径

## CDN 设置

---

```markdown
cdn:
  style: https://cdn.tailwindcss.com
  script: https://cdn.tailwindcss.com
```

- `style`: Tailwind CSS CDN 地址
- `script`: Tailwind CSS CDN 地址

!!! info "提示"

    如果您的站点是其他的样式，比如 bootstrap，您可以在 `pageforge.yaml` 文件中指定自定义的 CSS 文件，以便覆盖默认的 CSS 样式。

!!!

## 仓库设置

---

```markdown
repo:
  owner: username
  name: pageforge
  url: https://github.com/username/pageforge
```

- `owner`: GitHub 用户名
- `name`: 仓库名称
- `url`: 仓库 URL

> 如果您的站点是私有的，可以在 `pageforge.yaml` 文件中指定自定义的仓库，以便覆盖默认的 GitHub 仓库。 

## 导航设置

---

```markdown
nav:
  - 快速开始:
      - /getting-started/get-started
      - /getting-started/create-site/index
      - /getting-started/publish-site
```

相关的内容全部都存放在 `content` 文件夹中。

比如你的快速开始文档是 `/get-started` 则该文件的位置为 `content/get-started.md`。

`/getting-started/get-started` 该文件的位置为 `content/getting-started/get-started.md`。