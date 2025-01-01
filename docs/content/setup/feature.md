---
title: 特性设置
icon: feather
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

## 国际化设置

---

PageForge 支持用户自定义的国际化设置，需要启用后才能使用国际化。

```markdown
i18n:
    enable: true
```

启用国际化后，需要配置国际化语言

```markdown
i18n:
  default: zh-CN
  en:
    name: English
    flag: 🇬🇧
    translations:
      GetStarted: Getting Started
      Setup: Setup
      Usage: Usage Docs
  zh-CN:
    name: 中文
    flag: 🇨🇳
    translations:
      GetStarted: 快速开始
      Setup: 设置
      Usage: 使用文档
```

- `default`: 默认语言
- `en`、`zh-CN`: 自定义语言
- `translations`: 对应语言的翻译，格式为 `key: value`

系统会通过 `pageforge.yaml` 中配置的语言来自动加载对应的翻译，如果没有找到翻译，则会返回原 key

在 `pageforge.yaml` 中配置国际化后，可以在 `nav` 中使用以下方式来获取翻译的结果。

```markdown
nav:
- GetStarted:
    - /getting-started/get-started
```

- `GetStarted`: 要翻译的 key，如果没有找到翻译，则会返回原 key

在页面中使用使用以下方式来获取翻译的结果

```markdown
---
title: GetStarted
icon: crosshair
---
```

只需要将 `title` 中替换为国际化的 key 就可以了