const {loadComponent} = require('../../lib/component-loader');

module.exports = function template(item) {
    let listItemContent;

    if (item.task) {
        // 处理任务列表项
        const text = item.text.replace(/\[([\sx])\]/g, '').trim();
        const checkbox = loadComponent('checkbox', {
            checked: item.checked,
            text: text
        });
        listItemContent = `<li class="mb-2 flex items-start">${checkbox}</li>`;
    }
    else {
        // 处理普通列表项
        listItemContent = `<li class="mb-2 text-gray-700 leading-relaxed hover:text-gray-900 pl-8 -indent-8">${item.text}</li>`;
    }

    return listItemContent;
};