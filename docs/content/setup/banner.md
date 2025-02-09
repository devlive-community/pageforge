---
title: Banner 设置
icon: circle-alert
---

PageForge 支持设置顶部 Banner，可以帮助你快速创建高质量的 Banner。默认是禁用的，需要在 `pageforge.yaml` 配置文件中启用。

## 基本用法

---

```yaml
banner:
    content: PageForge 2025.1.2
```

## 使用 HTML

---

```yaml
banner:
    content: |
        <h1>PageForge 2025.1.2</h1>
```