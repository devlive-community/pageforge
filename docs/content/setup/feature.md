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

## 编辑源码

---

PageForge 支持编辑文档，需要启用后才能使用。

```yaml
feature:
  edit:
    enable: true
```

启用后，系统会根据 `pageforge.yaml` 中配置的 `repo.url` 和 `repo.branch` 生成编辑文档的链接，默认为 `main` 分支，可以在 `pageforge.yaml` 中配置 `repo.branch` 来更改分支。

## 查看源码

---

PageForge 支持查看源码，需要启用后才能使用。

```yaml
feature:
  view:
    enable: true
```

启用后，系统会根据 `pageforge.yaml` 中配置的 `repo.url` 和 `repo.branch` 生成查看源码的链接。默认为 `main` 分支，可以在 `pageforge.yaml` 中配置 `repo.branch` 来更改分支。

## Git 提交信息

---

PageForge 支持 Git 提交信息，需要启用后才能使用。

```yaml
feature:
  revision:
    enable: true
```

启用后，系统会根据 `pageforge.yaml` 中配置的 `repo.url` 和 `repo.branch` 生成 Git 提交信息的链接。

支持以下信息:

- 创建时间
- 最后修改时间
- 首次提交
- 末次提交

## Git 提交用户

---

PageForge 支持 Git 提交用户，需要启用后才能使用。

```yaml
feature:
  contributors:
    enable: true
```

启用后，系统会自动配置用户在 Github 中的头像。

## 返回顶部

---

PageForge 支持返回顶部，需要启用后才能使用。

```yaml
feature:
  backToTop:
    enable: true
```

## Mermaid 图表

---

PageForge 支持使用 [Mermaid](https://mermaid.js.org "Mermaid" "_blank") 图表语言，需要启用后才能使用。

```yaml
feature:
  mermaid:
    enable: true
    options:
      theme: dark
```

- `enable`: 是否启用 Mermaid 图表
- `options`: Mermaid 图表选项，可以根据自己的需求进行配置，例如 `theme: dark`，该选项是可选的，默认为 null

!!! danger "注意"

    如果需要使用自定义 CDN 加载 Mermaid 图表，可以在 `pageforge.yaml` 中配置 `cdn.mermaidJs` 的值。

!!!

## Diff 语法

---

PageForge 支持使用 Diff 语法，需要启用后才能使用。

```yaml
feature:
  diff:
    enable: true
```

## Dark 模式

---

PageForge 支持 Dark Mode，需要启用后才能使用。

```yaml
feature:
  darkMode:
    enable: true
```

## 搜索功能

---

PageForge 支持搜索功能，需要启用后才能使用。

```yaml
feature:
  search:
    enable: true
```