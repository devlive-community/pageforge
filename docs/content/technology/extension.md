---
title: 掌握 PageForge 扩展：从基础应用到深度开发
---

在现代网页设计中，交互元素是提升用户体验的关键。开关（Switch）作为一种直观的交互控件，广泛应用于设置项、特性切换和状态控制等场景。本教程将详细介绍如何在PageForge中使用开关组件，帮助您打造更具交互性的文档和网站。

!!! note
    这里我们使用开关组件来讲解。
!!!

## 1. 开关组件简介

PageForge的开关组件基于Tailwind CSS构建，提供了美观且可高度自定义的UI控件。与传统的复选框相比，开关组件提供了更直观的视觉反馈，特别适合表示开/关、是/否等二元状态。

### 主要特性

- **简洁的语法**：使用类似Markdown的语法轻松添加开关
- **状态控制**：支持预设开关的默认状态（开启/关闭）
- **高度可定制**：完全兼容Tailwind CSS，支持自定义颜色和样式
- **无缝集成**：可与文本内容自然融合，支持内联使用

## 2. 开始使用前的准备

在使用开关组件前，需要在PageForge配置文件中启用该功能。

1. 打开您的 `pageforge.yaml` 配置文件
2. 添加或修改以下配置：

```yaml
feature:
  switch:
    enable: true
```

## 3. 基本用法

### 3.1 添加一个简单的开关

最基本的开关只需一行代码：

```markdown
!switch[开关文本]
```

这将创建一个默认状态为"关闭"的开关，右侧显示"开关文本"。

### 3.2 设置默认状态

您可以通过在括号中指定状态值来设置开关的默认状态：

```markdown
!switch[默认开启的开关](true)
!switch[默认关闭的开关](false)
```

PageForge支持多种状态值表示法：

| 开启状态 | 关闭状态 |
|---------|---------|
| true    | false   |
| on      | off     |
| 1       | 0       |
| yes     | no      |

## 4. 样式定制

### 4.1 使用Tailwind类自定义样式

您可以使用花括号添加Tailwind CSS类来自定义开关样式：

```markdown
!switch[自定义开关]{focus:ring-purple-500 focus:ring-offset-2}
```

### 4.2 自定义颜色

开关组件最常见的自定义需求是更改颜色。您可以通过添加背景色和边框色类来实现：

```markdown
!switch[红色开关](true){bg-red-500 border-red-500}
!switch[绿色开关](true){bg-green-500 border-green-500}
!switch[紫色开关](true){bg-purple-500 border-purple-500}
```

色彩选择遵循Tailwind的命名规则，例如：
- `bg-blue-500`：中等亮度的蓝色
- `bg-green-600`：稍深的绿色
- `bg-yellow-300`：浅黄色

### 4.3 自定义焦点样式

开关在获得焦点时会显示环形轮廓。您可以自定义这个轮廓的颜色：

```markdown
!switch[焦点样式](true){focus:ring-green-500 focus:ring-offset-green-200}
```

## 5. 高级用法

### 5.1 组合使用

开关组件可以与其他文本内容组合使用：

```markdown
前置文本!switch[内联开关](on)后置文本
```

这种用法特别适合在句子中添加交互元素。

### 5.2 完整定制示例

下面是一个结合状态设置和样式定制的完整示例：

```markdown
!switch[夜间模式](true){bg-indigo-600 border-indigo-600 focus:ring-indigo-400}
```

这将创建一个标题为"夜间模式"、默认开启、使用靛蓝色调的开关。

### 5.3 在不同场景中的应用

开关组件适用于多种场景：

- **设置页面**：控制用户偏好
```markdown
## 用户设置

!switch[接收电子邮件通知](true)
!switch[启用双因素认证]
!switch[夜间模式]{bg-gray-700 border-gray-700}
```

- **功能展示**：突出显示可选功能
```markdown
## 高级功能

基础版：!switch[实时预览] !switch[自动保存]
专业版：!switch[实时预览](on) !switch[自动保存](on)
```

- **交互式文档**：增强阅读体验
```markdown
点击开关查看更多信息：!switch[详细内容]
```

## 6. 最佳实践

使用PageForge开关组件时，请记住以下最佳实践：

1. **保持文本简洁**：开关文本应清晰明了，避免过长
2. **配色一致性**：在同一文档中保持一致的颜色主题
3. **使用适当的默认值**：根据用户期望设置合理的默认状态
4. **考虑无障碍性**：确保颜色对比度足够，方便所有用户识别状态

## 7. 技术实现详解

### 7.1 架构概览

PageForge开关组件的实现分为两个主要部分：
1. **扩展模块** (`PageForgeSwitchExtension.js`): 负责解析Markdown中的特殊语法并转换为数据结构
2. **模板文件** (`switch.js`): 将数据结构渲染为HTML和CSS

这种分离设计使开关组件具有良好的可维护性和可扩展性。

### 7.2 扩展模块实现

扩展模块主要处理Markdown中的开关语法解析，其核心代码如下：

```javascript
const PageForgeSwitchExtension = {
    name: 'pageforgeSwitch',
    level: 'inline',

    start(src) {
        if (!config.feature?.switch?.enable) {
            return -1;
        }

        // 匹配 !switch[ 格式
        const pattern = /!switch\[/;
        const match = src.match(pattern);

        if (match) {
            // 检查是否在代码块内
            const beforeText = src.substring(0, match.index);
            const matches = beforeText.match(/`/g);
            if (matches && matches.length % 2 === 1) {
                return -1;
            }

            return match.index;
        }

        return -1;
    },

    tokenizer(src, tokens) {
        // 解析语法并生成token对象
        const rule = /^!switch\[(.*?)\](?:\((.*?)\))?(?:{(.*?)})?/;
        const match = rule.exec(src);

        if (match) {
            const [fullMatch, text, state, className] = match;
            const isChecked = state ? ['true', 'on', '1', 'yes'].includes(state.toLowerCase()) : false;

            return {
                type: 'pageforgeSwitch',
                raw: fullMatch,
                text: text,
                state: isChecked,
                className: className || '',
                tokens: []
            };
        }
        return false;
    },

    renderer(item) {
        // 调用模板渲染组件
        const switchComponent = loadComponent('switch', item);
        return item.prefix || item.suffix
            ? `${item.prefix || ''}${switchComponent}${item.suffix || ''}`
            : switchComponent;
    }
};
```

该模块实现了三个关键方法：
- **start**: 快速检测Markdown内容中是否包含开关语法
- **tokenizer**: 详细解析语法并提取参数（文本、状态、样式类）
- **renderer**: 调用模板渲染最终的HTML

### 7.3 模板文件实现

模板文件负责将数据转换为HTML和CSS，处理样式分离和应用：

```javascript
module.exports = function template(item) {
    // 基础样式：仅应用于容器
    const baseContainerStyles = "inline-flex items-center";
    
    // 解析开关状态
    const isChecked = item.state === true;
    
    // 用户提供的所有样式类
    const allUserStyles = item.className || "";
    
    // 分离颜色相关类和其他样式类
    const bgColorRegex = /\bbg-[a-z]+-[0-9]+\b/g;
    const borderColorRegex = /\bborder-[a-z]+-[0-9]+\b/g;
    
    // 提取用户定义的背景色和边框色
    const userBgColors = allUserStyles.match(bgColorRegex) || [];
    const userBorderColors = allUserStyles.match(borderColorRegex) || [];
    
    // 将颜色类从用户样式中移除，剩下的应用于label
    let remainingUserStyles = allUserStyles;
    
    // 移除背景色类和边框色类
    [...userBgColors, ...userBorderColors].forEach(colorClass => {
        remainingUserStyles = remainingUserStyles.replace(colorClass, '');
    });
    
    // 整理样式，移除多余空格
    remainingUserStyles = remainingUserStyles.replace(/\s+/g, ' ').trim();
    
    // 轨道默认样式和自定义样式处理
    // ...（样式处理代码）
    
    // HTML生成
    return `
        <div class="${baseContainerStyles}">
            <label for="${switchId}" class="flex items-center cursor-pointer ${focusStyles} ${remainingUserStyles}">
                <!-- 开关轨道和按钮结构 -->
                <div class="relative">
                    <input type="checkbox" id="${switchId}" class="sr-only" ${isChecked ? 'checked' : ''}>
                    <div class="block w-10 h-6 rounded-full border-2 transition ${trackStyles}"></div>
                    <div class="dot absolute left-1 top-1 w-4 h-4 rounded-full transition-transform ${toggleStyles}"></div>
                </div>
                ${item.text ? `<span class="ml-3 text-sm font-medium">${item.text}</span>` : ''}
            </label>
        </div>
    `;
};
```

模板实现中的关键技术点：
1. **样式分离**: 将用户提供的样式分为轨道颜色类和其他样式类
2. **正则表达式处理**: 使用精确的正则表达式匹配确保样式类正确提取
3. **条件渲染**: 根据开关状态应用不同的样式
4. **无障碍支持**: 使用适当的HTML结构确保无障碍性

### 7.4 HTML结构说明

生成的HTML结构具有以下特点：

```html
<div class="inline-flex items-center">
  <label for="switch-xyz123" class="flex items-center cursor-pointer focus:outline-none focus:ring-2 ...">
    <div class="relative">
      <!-- 真实的复选框，通过sr-only隐藏但保持可访问性 -->
      <input type="checkbox" id="switch-xyz123" class="sr-only" checked>
      <!-- 开关轨道 -->
      <div class="block w-10 h-6 rounded-full border-2 transition bg-blue-600 border-blue-600"></div>
      <!-- 开关按钮 -->
      <div class="dot absolute left-1 top-1 w-4 h-4 rounded-full transition-transform translate-x-4 bg-white"></div>
    </div>
    <!-- 开关文本 -->
    <span class="ml-3 text-sm font-medium">开关文本</span>
  </label>
</div>
```

这种结构确保了:
- **语义正确性**: 使用适当的HTML元素表达组件含义
- **无障碍支持**: 通过label和input关联，确保屏幕阅读器可以理解
- **样式隔离**: 将不同样式应用到正确的元素上

### 7.5 实现中的技术挑战与解决方案

在实现过程中解决了几个关键技术挑战：

1. **样式冲突问题**:
    - **挑战**: 用户提供的背景色类可能错误地应用到整个组件而不仅是轨道部分
    - **解决方案**: 实现样式分离逻辑，使用正则表达式精确提取颜色类并仅应用于轨道元素

2. **位置对齐问题**:
    - **挑战**: 开关按钮在开启状态下位置偏移过大，视觉效果不佳
    - **解决方案**: 将`translate-x-5`调整为`translate-x-4`，实现更平衡的视觉效果

3. **语法解析的健壮性**:
    - **挑战**: 需要支持多种语法格式，同时避免在代码块中错误解析
    - **解决方案**: 实现代码块检测逻辑，并使用灵活的正则表达式解析多种语法形式

### 7.6 故障排除指南

遇到问题时可参考以下排查步骤：

- **开关不显示**：
    - 检查配置文件中是否正确启用了switch功能
    - 确认语法格式是否正确，特别是括号和花括号的匹配

- **颜色不生效**：
    - 确保使用了正确的Tailwind类名格式（如`bg-red-500`而非`.bg-red-500`）
    - 检查类名拼写是否正确，Tailwind使用美式拼写（如`gray`而非`grey`）

- **状态设置不起作用**：
    - 检查状态值拼写是否正确（例如`true`而非`True`）
    - 确认使用的是支持的状态值（`true/on/1/yes`或`false/off/0/no`）

## 8. 扩展开发指南

如果您想基于现有的PageForgeSwitchExtension开发自己的扩展组件，以下是一些关键步骤和最佳实践：

### 8.1 创建新扩展的步骤

1. **定义扩展结构**：复制并修改PageForgeSwitchExtension的基本结构
   ```javascript
   const PageForgeYourExtension = {
       name: 'pageforgeYourComponent',
       level: 'inline', // 或 'block'，取决于您的组件类型
       // 实现必要的方法...
   };
   ```

2. **设计语法**：为您的组件设计一个直观的Markdown语法
   ```
   !yourcomponent[内容](参数1){样式}
   ```

3. **实现解析逻辑**：编写正则表达式来解析您的语法
   ```javascript
   tokenizer(src, tokens) {
       const rule = /^!yourcomponent\[(.*?)\](?:\((.*?)\))?(?:{(.*?)})?/;
       // 解析并返回token...
   }
   ```

4. **创建模板**：在`templates`目录创建组件模板文件
   ```javascript
   module.exports = function template(item) {
       // 生成HTML...
   };
   ```

5. **添加配置选项**：在配置文件中添加对应的功能开关
   ```yaml
   feature:
     yourcomponent:
       enable: true
   ```

### 8.2 开发最佳实践

1. **样式分离**：将固定样式和用户自定义样式分开处理
2. **无障碍设计**：确保生成的HTML符合无障碍标准
3. **错误处理**：添加适当的错误检查和回退机制
4. **性能考虑**：优化正则表达式和渲染逻辑
5. **文档完善**：为新组件编写清晰的使用文档

### 8.3 测试扩展组件

开发新扩展时，应测试以下场景：

- 基本功能测试：组件是否正确渲染
- 边界情况：特殊字符、空值等
- 样式覆盖：自定义样式是否正确应用
- 嵌套使用：在不同上下文中的表现
- 配置控制：启用/禁用功能的效果

## 9. 总结

PageForge的开关组件为您的文档增添了交互性和现代感。通过本教程，您已经掌握了从基础用法到高级定制的全部技巧，同时深入了解了其技术实现原理。现在，您不仅可以使用这一强大工具创建出更具吸引力的页面，还可以基于相同的架构开发自己的扩展组件。

开始在您的PageForge项目中尝试开关组件吧，您会发现它不仅提升了用户体验，还为您的内容增添了专业气息。

---

## 附录：语法速查表

| 功能 | 语法 | 示例 |
|-----|-----|-----|
| 基本开关 | `!switch[文本]` | `!switch[通知]` |
| 设置状态 | `!switch[文本](状态)` | `!switch[自动保存](on)` |
| 自定义样式 | `!switch[文本]{样式类}` | `!switch[主题]{focus:ring-teal-500}` |
| 完整语法 | `!switch[文本](状态){样式类}` | `!switch[夜间模式](true){bg-gray-800}` |