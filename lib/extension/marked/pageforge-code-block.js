const {marked} = require("marked");
const {loadComponent} = require("../../component-loader");

const PageForgeCodeBlockExtension = {
    name: 'pageforgeCodeBlock',
    level: 'block',
    start(src) {
        return src.match(/^```/)?.index;
    },
    tokenizer(src, tokens) {
        const rule = /^```(\w*)\n([\s\S]*?)\n```/;  // 匹配代码块语法
        const match = rule.exec(src);

        if (match) {
            return {
                type: 'pageforgeCodeBlock',
                raw: match[0],
                lang: match[1],         // 语言标识
                text: match[2].replace(/</g, '&lt;').replace(/>/g, '&gt;'), // 转义特殊字符
                tokens: []
            };
        }
        return false;
    },
    renderer(item) {
        return loadComponent('block-code', {
            language: item.lang,
            text: item.text
        });
    }
};

module.exports = PageForgeCodeBlockExtension;