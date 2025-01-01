---
title: 创建网站
icon: folder-plus
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

## 配置文件

---

默认会在当前目录下创建名为 `pageforge.yaml` 的配置文件，该文件包含了默认配置。

```yaml
site:
  title: PageForge
  description: PageForge 是一款现代化的静态页面生成与部署平台，旨在帮助用户快速创建精美的静态网站，并一键部署到 GitHub Pages。 无论是个人博客、项目文档还是企业官网，PageForge 都能让你轻松实现高效构建、智能部署和即时上线。

nav:
  - link: /
    text: 首页
```

如果您想要更改默认配置，可以在 `pageforge.yaml` 文件中进行修改。

## 预览您的修改

---

PageForge 包括一个实时预览服务器，因此您可以在编写文档时预览您的更改。服务器将在保存时自动重建站点。从以下内容开始：

```bash
pageforge serve
```

将浏览器指向 [localhost:3000](http://localhost:3000 "localhost:3000" "_blank")，您应该会看到：

![img.png](img.png)

## 编译你的项目

---

完成编辑后，您可以使用以下方法从 Markdown 文件构建静态网站：

```bash
pageforge build
```

此目录的内容构成了您的项目文档。无需操作数据库或服务器，因为它是完全独立的。该站点可以托管在 GitHub Pages、GitLab Pages、您选择的 CDN 或您的私有 Web 空间上。