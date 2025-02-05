---
title: 分享设置
icon: share
---

PageForge 的分享设置包含了一些用于在网站上分享文档的选项。您可以在文档的顶部设置是否启用分享，以及选择要分享的平台。

PageForge 的分享功能是使用 [social-share.js](https://github.com/overtrue/share.js "social-share.js" "_blank") 进行实现的。

## 启用分享

---

```yaml
feature:
    share:
        enable: true
```

- `enable`: 是否启用分享

## 分享设置

---

可以配置分享平台的选项，可以参考它来设置怎么分享

```yaml
feature:
    share:
        enable: true
        options:
            facebook: true
            weibo: true
            linkedin: true
```

支持的分享平台可参考 [social-share.js](https://github.com/overtrue/share.js "social-share.js" "_blank") 

## 配置 CDN

---

```yaml
feature:
    share:
        enable: true
        cdn: https://cdnjs.cloudflare.com/ajax/libs/social-share.js/1.0.16/
```

- `cdn`: CDN 链接，可以根据自己的需求进行配置，这里要填写完整的 CDN 链接，例如 `https://cdnjs.cloudflare.com/ajax/libs/social-share.js/1.0.16`，这里要填写前面部分，会自动拼接后面的 js 和 css。