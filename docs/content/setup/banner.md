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

## 多个 Banner

---

```yaml
banner:
    content:
        - PageForge 2025.1.2
        - PageForge 2025.1.1
```

!!! note
    多个 Banner 的情况下，系统会自动加载依赖的外部 CSS 和 JS 文件。同时也可以在 `pageforge.yaml` 中配置自定义的 CSS 和 JS 文件的 CDN。
!!!