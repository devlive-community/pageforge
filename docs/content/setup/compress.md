---
title: 压缩设置
icon: combine
---

PageForge 支持压缩文件，可以帮助你快速构建和部署你的静态网站。使用的是 [html-minifier](https://github.com/kangax/html-minifier "html-minifier") 模块，默认是禁用的，需要在 `pageforge.yaml` 配置文件中启用

## 启用压缩

---

```yaml
feature:
  compress:
    enable: true
```

- `enable`: 是否启用压缩

## 压缩设置

---

PageForge 支持使用 [html-minifier](https://github.com/kangax/html-minifier "html-minifier" "_blank") 模块的压缩配置，可以参考它来设置怎么压缩

```yaml
feature:
  compress:
    enable: true
    options:
      collapseWhitespace: true
      removeComments: true
      removeEmptyAttributes: true
```