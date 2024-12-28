const {loadComponent} = require('../component-loader');

module.exports = function h1(item) {
    const type = item.ordered ? 'ol' : 'ul';
    const listClasses = 'my-4 pl-4 list-inside ' + (item.ordered ? 'list-decimal' : 'list-disc');

    item = item.item
    const listItems = item.items.map(item => {
        if (item.task) {
            const text = item.text.replace(/\[([\sx])\]/g, '').trim();
            const checkbox = loadComponent('checkbox', {
                checked: item.checked,
                text: item.text
            });
            return `<li class="mb-2 flex items-start">${checkbox}</li>`;
        }

        // 普通列表项保持不变
        return `<li class="mb-2 text-gray-700 leading-relaxed hover:text-gray-900">${item.text}</li>`;
    }).join('');

    // 返回完整的列表HTML
    return `<${type} class="${listClasses}">${listItems}</${type}>`;
};