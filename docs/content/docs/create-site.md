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