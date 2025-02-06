---
title: 站点地图设置
icon: map
---

PageForge 支持站点地图，可以帮助你快速找到你的网站。默认是禁用的，需要在 `pageforge.yaml` 配置文件中启用。

## 启用站点地图

---

```yaml
feature:
    sitemap:
        enable: true
```

> 启用站点地图后，将在底部出现站点地图链接。

!!! danger "注意"

    启用站点地图，必须要在 `pageforge.yaml` 文件中添加以下配置

    ```yaml
    site:
        baseUrl: https://pageforge.devlive.org
    ```

!!!