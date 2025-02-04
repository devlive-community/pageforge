---
title: 按钮
icon: circle-arrow-up
---

PageForge 支持按钮，您可以创建基于 Tailwind CSS 的按钮。

!!! danger "注意"

    该功能需要在配置文件中启用，可以在 `pageforge.yaml` 中配置

    ```yml
    feature:
        button:
            enable: true
    ```

!!!

## 基本语法

---

```markdown
!btn[点击我]
```

!btn[点击我]

## 内部链接

---

```markdown
!btn[点击我跳转到首页](/)
```

!btn[点击我跳转到首页](/)

## 外部链接

---

```markdown
!btn[访问外部](https://example.com)
```

!btn[访问外部](https://example.com)

## 自定义样式

---

!!! info "提示"

    支持所有的 Tailwind CSS 的样式，可以使用自定义样式，例如 `bg-green-500 hover:bg-green-600`，只需要写类名即可，不需要加类名前面的 `.`，多个类名之间用空格分隔

!!!

```markdown
!btn[自定义按钮]{bg-green-500 hover:bg-green-600}
```

!btn[自定义按钮]{bg-green-500 hover:bg-green-600 text-white}

## 组合使用

---

```markdown
前置内容!btn[点击我跳转到首页](/){bg-green-500 hover:bg-green-600 text-white}后置内容
```

前置内容!btn[点击我跳转到首页](/){bg-green-500 hover:bg-green-600 text-white}后置内容