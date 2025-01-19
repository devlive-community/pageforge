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
        // 使用Grid布局来确保内容正确对齐
        listItemContent = `
            <li class="mb-2 grid grid-cols-[1em_1fr] gap-2 text-gray-700 leading-relaxed hover:text-gray-900">
                <span class="text-gray-600 text-xl select-none">•</span>
                <span>${item.text}</span>
            </li>`;
    }

    return listItemContent;
};