const {marked} = require("marked");
const {loadComponent} = require('../../component-loader');
const PageForgeImageExtension = require('./pageforge-image');
const PageForgeLinkExtension = require('./pageforge-link');
const PageForgeInlineCodeExtension = require('./pageforge-inline-code');
const PageForgeCodeBlockExtension = require('./pageforge-code-block');
const PageForgeQuoteInlineCodeExtension = require('./pageforge-quote-inline-code');

const renderer = {
    paragraph({tokens}) {
        return `<p>${this.parser.parseInline(tokens)}</p>\n`;
    },
    heading(item) {
        return loadComponent(`h${item.depth}`, {
            text: item.text
        });
    },
    space(item) {
        return loadComponent('space');
    },
    hr(item) {
        return loadComponent('hr');
    },
    text(item) {
        return loadComponent('p', {
            text: item.text
        });
    },
    link(item) {
        return loadComponent('a', {
            linkItem: {
                ...item,
                raw: item.raw  // 保留原始 markdown 文本
            }
        });
    },
    list(item) {
        return loadComponent('list', {
            item
        });
    },
    image(item) {
        return loadComponent('image', {
            item
        });
    },
    codespan(item) {
        return loadComponent('code', {
            text: item.text
        });
    }
};

marked.use({
    extensions: [
        PageForgeImageExtension,
        PageForgeLinkExtension,
        PageForgeInlineCodeExtension,
        PageForgeCodeBlockExtension,
        PageForgeQuoteInlineCodeExtension
    ],
    renderer,
    breaks: false
});

module.exports = marked;