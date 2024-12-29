const {marked} = require("marked");
const {loadComponent} = require("../../component-loader");

const PageForgeCodeExtension = {
    name: 'pageforgeInlineCode',
    level: 'inline',
    start(src) {
        return src.match(/.*`/)?.index;  // 匹配任何以反引号结尾的内容
    },
    tokenizer(src, tokens) {
        // 匹配格式：任何文本 + `代码` + 任何文本，直到行尾或下一个反引号
        const rule = /(.*?)`([^`]+)`([^`\n]*)/;
        const match = rule.exec(src);

        if (match && !src.startsWith('```')) {
            return {
                type: 'pageforgeInlineCode',
                raw: match[0],
                prefix: match[1],     // 代码前的文本
                text: match[2],       // 代码内容
                suffix: match[3],     // 代码后的文本
                tokens: []
            };
        }
        return false;
    },
    renderer(item) {
        return `<span class="inline-block my-1">${item.prefix}${loadComponent('inline-code', {text: item.text})}${item.suffix}</span>`;
    }
};

marked.use({
    extensions: [
        PageForgeCodeExtension
    ],
    breaks: true
});

module.exports = PageForgeCodeExtension;