const {pinyin} = require('pinyin');

module.exports = function template(item) {
    const slug = pinyin(item.text.replace(/\s+/g, ''), {
        style: pinyin.STYLE_NORMAL,
        segment: true
    }).flat().join('-');

    return `
        <h3 class="text-2xl font-bold text-gray-900 mb-4">
            <div id="${slug}">${item.text}</div>
        </h3>
    `;
};