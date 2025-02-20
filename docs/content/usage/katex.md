---
title: KaTeX
icon: square-function
---

PageForge 支持使用 [KaTeX](https://katex.org "KaTeX" "_blank") 数学公式渲染引擎。

!!! danger "注意"
    该功能需要在配置文件中启用，可以在 `pageforge.yaml` 中配置

    ```yaml
    feature:
      katex:
        enable: true
    ```

    如果要传递自定义配置可以在 `pageforge.yaml` 中添加自定义配置

    ```yaml
    feature:
      katex:
        enable: true
        options:
          throwOnError: true
    ```
!!!

## CDN 配置

---

PageForge 默认使用的是以下 CDN

```js
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@latest/dist/katex.min.css">
<script src="https://cdn.jsdelivr.net/npm/katex@latest/dist/katex.min.js"></script>
```

可以修改 `pageforge.yaml` 中的 `cdn` 配置来配置自定义 CDN

```yaml
cdn:
  katexJs: "https://cdn.jsdelivr.net/npm/katex@latest/dist/katex.min.js"
  katexCss: "https://cdn.jsdelivr.net/npm/katex@latest/dist/katex.min.css"
```

## 基本语法

---

```markdown
:::katex
\sum_{i=1}^n i = \frac{n(n+1)}{2}
:::
```

## 化学方程式

---

:::katex
\ce{CO2 + C -> 2 CO}
:::

## 带编号的公式

---

:::katex
\tag{1} E = mc^2
:::