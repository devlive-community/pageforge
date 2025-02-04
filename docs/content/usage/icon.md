---
title: Icon 图标
icon: feather
---

PageForge 提供了一系列图标,可以用于页面中的按钮、链接等元素。

!!! danger "注意"

    默认支持的是 Lucide 图标。相关图标库可以在 [Lucide](https://lucide.dev "Lucide" "_blank") 中找到    

    该功能需要在配置文件中启用，可以在 `pageforge.yaml` 中配置

    ```yml
    feature:
      lucide:
        enable: true
    ```

!!!

## 基本用法

---

```markdown
:user:
```

:user:

## 配置大小

---

!!! danger "注意"

    图标的大小配置是通过在图标名称后面添加 `{数字}` 的方式进行的，例如 `user{30}` 表示图标的尺寸为 30px。

!!!

```markdown
:user{30}:
```

:user{30}:

## 配置颜色

---

!!! danger "注意"

    图标的颜色配置是通过在图标名称后面添加 `{16,#ff0000}` 的方式进行的，例如 `user{16,#ff0000}` 表示图标的颜色为红色，尺寸为 16px。

    图标颜色必须要和尺寸配置一起使用。

!!!

```markdown
:user{16,#ff0000}:
```

:user{16,#ff0000}: