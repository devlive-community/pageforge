---
title: 特性设置
---

PageForge 支持众多的特性，可以帮助你快速构建和部署你的静态网站。下面是 PageForge 支持的特性列表。

所有的特性配置均在 `pageforge.yaml` 文件中进行配置，且支持嵌套配置。 格式为

```yaml
feature:
  xxx
```

## Lucide 图标

---

PageForge 默认支持 [Lucide](https://lucide.dev "Lucide" "_blank") 图标库，需要启用后才能使用 Lucide 图标。

```markdown
lucide:
    enable: true
    cdn: https://unpkg.com/lucide@latest/dist/umd/lucide.js
```

- `enable`: 是否启用 Lucide 图标
- `cdn`: Lucide CDN 链接，默认为 `https://unpkg.com/lucide@latest/dist/umd/lucide.js` ，可以根据自己的需求进行修改，这里要填写完整的 CDN 链接，例如 `https://unpkg.com/lucide@latest/dist/umd/lucide.js`
