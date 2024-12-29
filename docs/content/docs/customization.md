---
title: 自定义您的网站
---

PageForge 提供了一些可选的自定义选项，以满足不同的需求。

## 自定义 CSS

---

您可以在 `pageforge.yaml` 文件中指定自定义的 CSS 文件，以便覆盖默认的 CSS 样式。

```yaml
theme:
    extra_css:
        - /assets/extra.css
```

## 自定义 JavaScript

---

您可以在 `pageforge.yaml` 文件中指定自定义的 JavaScript 文件，以便覆盖默认的 JavaScript 脚本。

```yaml
theme:
    extra_js:
        - /assets/extra.js
```

## 自定义模板

---

您可以在项目根目录创建 `templates` 文件夹，并在其中创建自定义的模板文件，以便覆盖默认的模板文件。

```bash
templates
├── components
│   ├── a.js
│   ├── block-code.js
│   ├── checkbox.js
│   ├── h1.js
│   ├── h2.js
│   ├── h3.js
│   ├── h4.js
│   ├── h5.js
│   ├── h6.js
│   ├── hr.js
│   ├── image.js
│   ├── inline-code.js
│   ├── list.js
│   ├── p.js
│   └── space.js
├── includes
│   ├── footer.ejs
│   ├── header.ejs
│   ├── nav.ejs
│   ├── sidebar.ejs
│   └── toc.ejs
└── layouts
    ├── base.ejs
    ├── content.ejs
    └── page.ejs
```

按照文件的路径，您可以覆盖默认的模板文件。

如果自定义模版，可以直接在 `templates/layouts` 文件夹中创建自定义的布局文件，文件名便是模版名称。
