const {marked} = require("marked");
const {loadComponent} = require('../../component-loader');
const PageForgeImageExtension = require('./pageforge-image');
const PageForgeLinkExtension = require('./pageforge-link');
const PageForgeCodeBlockExtension = require('./pageforge-code-block');
const PageForgeQuoteInlineCodeExtension = require('./pageforge-quote-inline-code');
const PageForgeHeadingExtension = require('./pageforge-heading');
const PageForgeAlertExtension = require('./pageforge-alert');
const PageForgeTabExtension = require('./pageforge-tabs');
const PageForgeTableExtension = require('./pageforge-table');

const renderer = {
    paragraph({tokens}) {
        return `${this.parser.parseInline(tokens)}`;
    },

    space() {
        return loadComponent('space');
    },

    hr() {
        return loadComponent('hr');
    },

    text(item) {
        return 'tokens' in item && item.tokens
            ? this.parser.parseInline(item.tokens)
            : ('escaped' in item && item.escaped ? item.text : loadComponent('span', {text: item.text}));
    },

    link(item) {
        return loadComponent('a', {
            linkItem: {
                ...item,
                raw: item.raw  // 保留原始 markdown 文本
            }
        });
    },

    listitem(item) {
        item.text = this.parser.parse(item.tokens, !!item.loose)

        return loadComponent('list-item', item);
    },

    list(item) {
        let body = '';
        for (let j = 0; j < item.items.length; j++) {
            body += this.listitem(item.items[j]);
        }

        return loadComponent('list', {
            ordered: item.ordered,
            body: body
        });
    },

    image(item) {
        return loadComponent('image', {
            item
        });
    },

    codespan(item) {
        return loadComponent('span-code', {
            text: item.text
        });
    },

    checkbox(item) {
        return loadComponent('checkbox', {
            checked: item.checked,
            text: item.text
        });
    }
};

marked.use({
    extensions: [
        PageForgeImageExtension,
        PageForgeLinkExtension,
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