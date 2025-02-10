---
title: CodeBlock
icon: code
---

PageForge 支持使用代码块，用户可以自定义代码块的样式，以便更好地展示代码的语法和格式。

## 基本语法

---

以下是一个简单的示例：

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

## 配置行号

---

> 默认情况下，代码块不会显示行号，但可以通过配置 `showLineNumbers` 或者 `showLineNumbers=true` 参数来启用行号显示。格式为 
> **```java showLineNumbers** 
> 或者
> **```java showLineNumbers=true**

```java showLineNumbers
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

## 设置标题

---

!!! note
    添加标题只需要在语言后面添加 ` title="xxxx"`
!!!

``` vue title="正确示例"
export default defineComponent({
  name: 'RoleHome'
})

const showName = ref(false)
```