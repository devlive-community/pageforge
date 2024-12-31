const {loadComponent} = require('../../lib/component-loader');

module.exports = function template(item) {
    // 确保 item.items 存在且能被处理
    if (item?.items) {
        // 处理所有列表项并拼接
        const listContent = item.items.map(listItem => {
            // 调用 loadComponent 来加载 list-item 组件
            return loadComponent('list-item', {
                ...listItem,
                // 确保传递任务列表相关的属性
                task: listItem.task,
                checked: listItem.checked,
                text: listItem.text
            });
        }).join('\n');

        const type = item.ordered ? 'ol' : 'ul';
        const listClasses = 'my-4 pl-4 list-inside ' + (item.ordered ? 'list-decimal' : 'list-disc');
        return `<${type} class="${listClasses}">${listContent}</${type}>`;
    }

    // 降级处理：如果没有 items，返回空列表
    const type = item.ordered ? 'ol' : 'ul';
    const listClasses = 'my-4 pl-4 list-inside ' + (item.ordered ? 'list-decimal' : 'list-disc');
    return `<${type} class="${listClasses}"></${type}>`;
};