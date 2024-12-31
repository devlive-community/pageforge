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
        return `<p>${this.parser.parseInline(tokens)}</p>\n`;
    },
    space(item) {
        return loadComponent('space');
    },
    hr(item) {
        return loadComponent('hr');
    },
    text(item) {
        if (item?.tokens) {
            item.text = this.parser.parseInline(item.tokens)
        }

        return loadComponent('span', {
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
    listitem(item) {
        console.log('list-item parse');
        item.text = this.parser.parseInline(item.tokens)
        return loadComponent('list-item', item);
    },
    list(item) {
        if (item?.items) {
            item.text = item.items
                .map(listItem => {
                    // 手动调用 listitem 处理
                    listItem.text = this.parser.parseInline(listItem.tokens);
                    return loadComponent('list-item', listItem);
                })
                .join('\n');
        }
        return loadComponent('list', item);
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