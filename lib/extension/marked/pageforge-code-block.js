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
                text: match[2],         // 代码内容
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

marked.use({
    extensions: [
        PageForgeCodeBlockExtension
    ],
    breaks: true
});

module.exports = PageForgeCodeBlockExtension;