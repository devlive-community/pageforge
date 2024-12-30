---
title: 图片
---

PageForge 支持 Markdown 的默认图片语法。您可以使用 `![](图片URL)` 格式来插入图片，例如 `![](图片URL)`。

PageForge 实现了更多的语义，支持更多的图片格式。

## 基本语法

---

```
![](图片URL)
```

## 带标题

---

```
![](图片URL "可选标题")
```

## 宽高格式

---

设置宽高的时候必须以 `=` 开始

```
![](图片URL "可选标题" =100x200)
```

![alt文本](https://github.com/devlive-community/pageforge/raw/dev/docs/assets/logo.svg "可选标题" =100x200)

只设置宽度

```
![](图片URL "可选标题" =100x)
```

![alt文本](https://github.com/devlive-community/pageforge/raw/dev/docs/assets/logo.svg "可选标题" =100x)

只设置高度

```
![](图片URL "可选标题" =x200)
```

![alt文本](https://github.com/devlive-community/pageforge/raw/dev/docs/assets/logo.svg "可选标题" =x200)

## 对齐方式

---

设置对齐方式的时候必须要设置宽高，支持的值有 `left` `center` `right`

左对齐

```
![](图片URL "可选标题" =100x200 left)
```

![alt文本](https://github.com/devlive-community/pageforge/raw/dev/docs/assets/logo.svg "可选标题" =100x200 left)

中对齐

```
![](图片URL "可选标题" =100x200 center)
```

![alt文本](https://github.com/devlive-community/pageforge/raw/dev/docs/assets/logo.svg "可选标题" =100x200 center)

右对齐

```
![](图片URL "可选标题" =100x200 right)
```

![alt文本](https://github.com/devlive-community/pageforge/raw/dev/docs/assets/logo.svg "可选标题" =100x200 right)