const {pinyin} = require('pinyin');

module.exports = function template(item) {
    const slug = pinyin(item.text.replace(/\s+/g, ''), {
        style: pinyin.STYLE_NORMAL,
        segment: true
    }).flat().join('-');

    return `
        <h1 class="text-4xl font-bold tracking-tight text-gray-900">
            <div id="${slug}">${item.text}</div>
        </h1>
    `;
};