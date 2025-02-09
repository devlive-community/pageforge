---
title: 版本设置
icon: history
status:
    type: new
---

PageForge 支持多版本管理，可以帮助你快速部署不同版本的网站。

!!! info "注意"

    PageForge 多版本管理是通过归档方式来实现的。

!!!

## 基本用法

---

```bash
pageforge archive 1.0.0
```

`1.0.0` 是你要归档的版本号，可以根据实际情况进行修改。

执行命令后，PageForge 会在输出目录下生成一个 `1.0.0` 的文件夹，里面包含了你的网站的所有文件，可以直接部署到 GitHub Pages、GitLab Pages、Vercel、Netlify 等服务上。

归档后会在 `pageforge.yaml` 文件中添加一个如下新的版本配置：

```yaml
versions:
  - 1.0.0
```

!!! danger "注意"

    多版本的情况下，不要删除 `pageforge.yaml` 文件中的 `versions` 配置。否则会导致多版本无效。

!!!