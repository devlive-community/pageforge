---
title: 提示
---

PageForge 支持使用 markdown 实现了提示相关信息。

!!! danger "注意"

    需要注意的是必须要使用 `!!!` 包裹，且后面的内容需要缩进。

!!!

支持的类型有:

- `info`
- `danger`
- `success`
- `warning`
- `dark`

## Info

---

`info` 类型的提示信息可以使用如下的语法：

```markdown
!!! info "标题"

    这是一个提示信息

!!!
```

!!! info "一行"

    这是一个提示信息

!!!

## Danger

---

`danger` 类型的提示信息可以使用如下的语法：

```markdown
!!! danger "标题"

    这是一个提示信息

!!!
```

!!! danger "标题"

    这是一个提示信息

!!!

## Success

---

`success` 类型的提示信息可以使用如下的语法：

```markdown
!!! success "标题"

    这是一个提示信息

!!!
```

!!! success "标题"

    这是一个提示信息

!!!

## Warning

---

`warning` 类型的提示信息可以使用如下的语法。

```markdown
!!! warning "标题"

    这是一个提示信息

!!!
```

!!! warning "标题"

    这是一个提示信息

!!!

## Dark

---

`dark` 类型的提示信息可以使用如下的语法。

```markdown
!!! dark "标题"

    这是一个提示信息

!!!
```

!!! dark "标题"

    这是一个提示信息

!!!

## 不设置标题

---

如果不设置标题，可将 `""` 内容设置为空字符串。

```markdown
!!! info ""

    这是一个提示信息

!!!
```

!!! info ""

    这是一个提示信息

!!!