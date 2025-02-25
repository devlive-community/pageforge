---
title: 开关
icon: toggle-left
---

PageForge 支持开关组件，您可以创建基于 Tailwind CSS 的开关控件。

!!! danger "注意"

    该功能需要在配置文件中启用，可以在 `pageforge.yaml` 中配置

    ```yml
    feature:
        switch:
            enable: true
    ```

!!!

## 基本语法

---

```markdown
!switch[开关选项]
```

!switch[开关选项]

## 设置状态

---

```markdown
!switch[默认打开的开关](true)
```

!switch[默认打开的开关](true)

```markdown
!switch[默认关闭的开关](false)
```

!switch[默认关闭的开关](false)

## 自定义样式

---

!!! info "提示"

    支持所有的 Tailwind CSS 的样式，可以使用自定义样式，例如 `focus:ring-green-500`，只需要写类名即可，不需要加类名前面的 `.`，多个类名之间用空格分隔

!!!

```markdown
!switch[自定义开关]{focus:ring-green-500 focus:ring-offset-green-200}
```

!switch[自定义开关]{focus:ring-green-500 focus:ring-offset-green-200}

## 自定义颜色

---

您可以通过添加背景颜色类来自定义开关的颜色：

```markdown
!switch[红色开关](true){bg-red-500 border-red-500}
```

!switch[红色开关](true){bg-red-500 border-red-500}

```markdown
!switch[绿色开关](true){bg-green-500 border-green-500}
```

!switch[绿色开关](true){bg-green-500 border-green-500}

```markdown
!switch[紫色开关](true){bg-purple-500 border-purple-500}
```

!switch[紫色开关](true){bg-purple-500 border-purple-500}

## 组合使用

---

```markdown
前置内容!switch[带状态的自定义开关](on){focus:ring-green-500 focus:ring-offset-green-200}后置内容
```

前置内容!switch[带状态的自定义开关](on){focus:ring-green-500 focus:ring-offset-green-200}后置内容

## 状态值说明

---

开关的状态支持多种形式的表示：

| 开启状态 | 关闭状态  |
|------|-------|
| true | false |
| on   | off   |
| 1    | 0     |
| yes  | no    |

例如以下写法都表示开关为开启状态：

```markdown
!switch[示例1](true)
!switch[示例2](on)
!switch[示例3](1)
!switch[示例4](yes)
```

不提供状态值时，开关默认为关闭状态。