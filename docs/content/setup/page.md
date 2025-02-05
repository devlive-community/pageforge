---
title: 页面设置
icon: book-open
status: 
  type: updated
---

PageForge 的材料包含许多强大的功能，使技术写作成为一项令人愉快的活动。文档的这一部分解释了如何设置页面，并展示了所有可以直接在 PageForge 文件中使用的可用样本。

### 基本用法

---

在 markdown 文件的顶部，你可以设置页面的标题和描述。这些信息将显示在浏览器的标题栏和搜索引擎中。

```yaml
---
title: 这里是标题
icon: feather
---
```

### 设置 `title`

---

每个页面都有一个指定的标题，该标题用于导航侧边栏、社交卡片和其他地方。PageForge 将自动为你的文档生成一个标题，但你可以在 markdown 文件的顶部覆盖它。

生成的标题为 `page.title - site.title` 的格式。

### 设置 `icon`

---

每个页面都有可以设置一个图标，该图标用于导航侧边栏。PageForge 将自动为你的文档生成一个图标，但你可以在 markdown 文件的顶部覆盖它。

目前支持 Lucide 图标，可以在 [Lucide](https://lucide.dev "Lucide" "_blank") 中找到更多图标。

### 设置 `header`

---

在 markdown 文件的顶部，你可以设置是否关闭页面的顶部的导航。

```yaml
---
config:
  header: false
---
```

默认情况下，页面的顶部导航将显示在每个页面的顶部，但你可以在 markdown 文件的顶部设置 `header: false` 以关闭它。

### 设置 `sidebar`

---

在 markdown 文件的顶部，你可以设置是否关闭页面的侧边栏。

```yaml
---
config:
  sidebar: false
---
```

默认情况下，页面的侧边栏将显示在每个页面的左侧，但你可以在 markdown 文件的顶部设置 `sidebar: false` 以关闭它。

### 设置 `footer`

---

在 markdown 文件的顶部，你可以设置是否关闭页面的底部。

```yaml
---
config:
  footer: false
---
```

默认情况下，页面的底部将显示在每个页面的底部，但你可以在 markdown 文件的顶部设置 `footer: false` 以关闭它。

### 设置 `toc`

---

在 markdown 文件的顶部，你可以设置是否关闭页面的目录。如果当前页面没有解析到 `toc`，页面的目录将不会显示。

```yaml
---
config:
  toc: false
---
```

默认情况下，页面的目录将显示在每个页面的右侧，但你可以在 markdown 文件的顶部设置 `toc: false` 以关闭它。

### 设置 `template`

---

在 markdown 文件的顶部，你可以设置页面的布局。默认情况下，页面的布局为 `content`，但你可以在 markdown 文件的顶部设置 `template: layout-name` 以更改它。

> 你可以在 `templates/layouts` 中找到所有可用的布局。
>
> 目前支持 `content` 和 `page` 布局。

如果是自定义的布局，可以直接在 `templates/layouts` 文件夹中创建自定义的布局文件，文件名便是模版名称。

比如模版名字是 `foo`，那么文件名就是 `foo.ejs`。在页面中使用以下代码配置模版:

```yaml
---
template: foo
---
```

### 设置 `status`

---

PageForge 支持设置当前页面的状态，当前支持以下状态：

- `draft`: 草稿
- `new`: 新添加
- `updated`: 更新
- `deprecated`: 已过期

通过配置 markdown 文件的元数据来支持，格式如下：

```markdown
---
status:
  type: updated
---
```

如果需要设置自定义提示的内容，可以修改为以下方式：

```markdown
---
status:
  type: updated
  text: 自定义提示
---
```