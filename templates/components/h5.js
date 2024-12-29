const {pinyin} = require('pinyin');

module.exports = function template(item) {
    const slug = pinyin(item.text.replace(/\s+/g, ''), {
        style: pinyin.STYLE_NORMAL,
        segment: true
    }).flat().join('-');

    return `
        <h5 class="text-lg font-bold text-gray-900 my-2">
            <div id="${slug}">${item.text}</div>
        </h5>
    `;
};