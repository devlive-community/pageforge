const {loadComponent} = require('../../lib/component-loader');

module.exports = function template(item) {
    if (item.task) {
        const text = item.text.replace(/\[([\sx])\]/g, '').trim();
        const checkbox = loadComponent('checkbox', {
            checked: item.checked,
            text: text
        });
        return `<li class="mb-2 flex items-start">${checkbox}</li>`;
    }

    return `<li class="mb-2 text-gray-700">${item.text}</li>`;
};