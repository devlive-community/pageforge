const {pinyin} = require('pinyin');

module.exports = function template(item) {
    const slug = pinyin(item.text.replace(/\s+/g, ''), {
        style: pinyin.STYLE_NORMAL,
        segment: true
    }).flat().join('-');

    return `
        <h4 class="text-xl font-bold text-gray-900 my-3">
            <div id="${slug}">${item.text}</div>
        </h4>
    `;
};