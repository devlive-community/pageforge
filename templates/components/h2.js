const {pinyin} = require('pinyin');

module.exports = function template(item) {
    const slug = pinyin(item.text.replace(/\s+/g, ''), {
        style: pinyin.STYLE_NORMAL,
        segment: true
    }).flat().join('-');

    return `
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl my-5">
            <div id="${slug}">${item.text}</div>
        </h2>
    `;
};