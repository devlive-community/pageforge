---
title: Diff
icon: code
---

PageForge 支持 diff 语法。

!!! danger "注意"

    该功能需要在配置文件中启用，可以在 `pageforge.yaml` 中配置 `feature.diff.enable: true`

!!!

## 基本语法

---

- 源代码

```markdown
:::diff
+ 这是第1行（添加）
- 这是第2行（删除）
:::
```

- 显示效果

:::diff
+ 这是第1行（添加）
- 这是第2行（删除）
:::

## 多行显示

---

- 源代码

```markdown
:::diff +1,3-5 -2,6
这是第1行（会显示为绿色添加）
这是第2行（会显示为红色删除）
这是第3行（会显示为绿色添加）
这是第4行（会显示为绿色添加）
这是第5行（会显示为绿色添加）
这是第6行（会显示为红色删除）
这是第7行（会显示为普通上下文）
:::
```

- 显示效果

:::diff +1,3-5 -2,6
这是第1行（会显示为绿色添加）
这是第2行（会显示为红色删除）
这是第3行（会显示为绿色添加）
这是第4行（会显示为绿色添加）
这是第5行（会显示为绿色添加）
这是第6行（会显示为红色删除）
这是第7行（会显示为普通上下文）
:::

## 代码显示

---

- 源代码

```markdown
:::diff +1,3-5 -2,10-11
module.exports = function template(value) {
    return `
        <div class="bg-gray-50 rounded-lg overflow-x-auto">
            <div class="min-w-full w-max">
                ${value.content.map(item => `
                    <div class="text-gray-900 font-mono px-2 py-0.5 ${item.type === 'addition' ? 'bg-green-50' : item.type === 'deletion' ? 'bg-red-50' : 'bg-transparent'}">
                        <span class="inline-block w-4 text-gray-500 select-none">${item.prefix}</span>${item.content}
                    </div>
                `).join('')}
        </div>
    </div>`;
};
:::
```

- 显示效果

:::diff +1,3-5 -2,10-11
module.exports = function template(value) {
    return `
        <div class="bg-gray-50 rounded-lg overflow-x-auto">
            <div class="min-w-full w-max">
                ${value.content.map(item => `
                    <div class="text-gray-900 font-mono px-2 py-0.5 ${item.type === 'addition' ? 'bg-green-50' : item.type === 'deletion' ? 'bg-red-50' : 'bg-transparent'}">
                        <span class="inline-block w-4 text-gray-500 select-none">${item.prefix}</span>${item.content}
                    </div>
            `).join('')}
        </div>
    </div>`;
};
:::