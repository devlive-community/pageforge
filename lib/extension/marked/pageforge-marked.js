const {marked} = require("marked");
const {loadComponent} = require('../../component-loader');
const PageForgeImageExtension = require('./pageforge-image');
const PageForgeLinkExtension = require('./pageforge-link');
const PageForgeInlineCodeExtension = require('./pageforge-inline-code');
const PageForgeCodeBlockExtension = require('./pageforge-code-block');
const PageForgeQuoteInlineCodeExtension = require('./pageforge-quote-inline-code');
const PageForgeHeadingExtension = require('./pageforge-heading');
const PageForgeAlertExtension = require('./pageforge-alert');
const PageForgeTabExtension = require('./pageforge-tabs');
const PageForgeTableExtension = require('./pageforge-table');

const renderer = {
    paragraph({tokens}) {
        return `<p>${this.parser.parseInline(tokens)}</p>\n`;
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
        PageForgeQuoteInlineCodeExtension,
        PageForgeHeadingExtension,
        PageForgeAlertExtension,
        PageForgeTabExtension,
        PageForgeTableExtension
    ],
    renderer,
    breaks: false
});

module.exports = marked;