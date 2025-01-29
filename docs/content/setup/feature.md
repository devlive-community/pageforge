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

```yaml
lucide:
    enable: true
    cdn: https://unpkg.com/lucide@latest/dist/umd/lucide.js
```

- `enable`: 是否启用 Lucide 图标
- `cdn`: Lucide CDN 链接，默认为 `https://unpkg.com/lucide@latest/dist/umd/lucide.js` ，可以根据自己的需求进行修改，这里要填写完整的 CDN 链接，例如 `https://unpkg.com/lucide@latest/dist/umd/lucide.js`

## 国际化设置

---

PageForge 支持用户自定义的国际化设置，需要启用后才能使用国际化。

```yaml
i18n:
    enable: true
```

启用国际化后，需要配置国际化语言

```yaml
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

```yaml
nav:
- GetStarted:
    - /getting-started/get-started
```

- `GetStarted`: 要翻译的 key，如果没有找到翻译，则会返回原 key

在页面中使用使用以下方式来获取翻译的结果

```yaml
---
title: GetStarted
icon: crosshair
---
```

只需要将 `title` 中替换为国际化的 key 就可以了

国际化的文档名格式为 `file.lang.md` ，比如我们的 `index.md` 如果要配置国际化文件名，可以这样写 `index.en.md`

## Issues 解析

---

PageForge 支持解析 GitHub Issues 的链接，需要启用后才能使用。

```yaml
feature:
  issues:
    enable: true
```

启用后，可以在 Markdown 中使用 `#123` 格式来引用 Issues，例如

```markdown
`#123`
```

## Tooltip

---

PageForge 支持解析 tooltip 的链接，需要启用后才能使用。

```yaml
feature:
  tooltip:
    enable: true
```

## 统计代码

---

PageForge 支持统计代码，需要启用后才能使用。

```yaml
feature:
  statistics:
    enable: true
    content: |
      服务商返回的统计代码
```

- `content`: 自定义统计代码，需要填写完整的统计代码。

## 编辑文档

---

PageForge 支持编辑文档，需要启用后才能使用。

```yaml
feature:
  edit:
    enable: true
```

启用后，系统会根据 `pageforge.yaml` 中配置的 `repo.url` 和 `repo.branch` 生成编辑文档的链接，默认为 `main` 分支，可以在 `pageforge.yaml` 中配置 `repo.branch` 来更改分支。