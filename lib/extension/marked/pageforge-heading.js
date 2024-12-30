const {marked} = require("marked");
const {pinyin} = require('pinyin');
const {loadComponent} = require("../../component-loader");

const PageForgeHeadingExtension = {
    name: 'pageforgeHeading',
    level: 'block',
    start(src) {
        return src.match(/^#{1,6}\s/) ? 0 : -1;
    },
    tokenizer(src, tokens) {
        const rule = /^(#{1,6})\s+([^\n]+?)(?:\n|$)/;
        const match = rule.exec(src);

        if (!match) {
            return false;
        }

        const depth = match[1].length;
        const text = match[2].trim();

        return {
            type: 'pageforgeHeading',
            raw: match[0],
            level: depth,
            text: text,
            slug: pinyin(text.replace(/[^\w\s\u4e00-\u9fa5]/g, '').replace(/\s+/g, ''), {
                style: pinyin.STYLE_NORMAL,
                segment: true
            }).flat().join('-'),
            tokens: this.lexer.inlineTokens(text)
        };
    },
    renderer(token) {
        token.text = this.parser.parseInline(token.tokens)

        return loadComponent(`header`, {...token});
    }
};

module.exports = PageForgeHeadingExtension;