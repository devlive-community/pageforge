---
title: 创建你的网站
---

安装 PageForge 后，你可以使用它来创建你的网站。您需要跳转到需要创建网站的文件夹，该文件夹必须是一个空文件夹。然后，您可以使用 PageForge 的命令行工具来创建网站。

我们假设您的文件夹是 `my-website`。

```bash
pageforge init
```

或者

```bash
pageforge create-site .
```

或者指定文件夹路径

```bash
pageforge create-site my-website
```

安装完成后，它将是如下目录结构：

```
├── content
│   └── index.md
└── pageforge.yaml
```

然后，您可以使用 `pageforge build` 命令来构建网站，或者使用 `pageforge serve` 命令来预览网站。

## 配置文件

默认会在当前目录下创建名为 `pageforge.yaml` 的配置文件，该文件包含了网站的配置信息。

```yaml
source_path: content
output_path: dist
template_path: templates  # 可选，不创建也能工作
assets_path: assets

site:
  title: PageForge
  description: PageForge 是一款现代化的静态页面生成与部署平台，旨在帮助用户快速创建精美的静态网站，并一键部署到 GitHub Pages。 无论是个人博客、项目文档还是企业官网，PageForge 都能让你轻松实现高效构建、智能部署和即时上线。
  logo: /assets/logo.svg
  favicon: /assets/favicon.ico

theme:
  extra_css:
    - /assets/extra.css

cdn:
  style: https://cdn.tailwindcss.com

repo:
  owner: devlive-community
  name: pageforge
  url: https://github.com/devlive-community/pageforge

nav:
  - link: /
    text: 首页

sidebar:
  default:
    - text: '我的第一个页面'
      link: '/'
```