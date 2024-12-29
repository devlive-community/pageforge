const {marked} = require("marked");
const {loadComponent} = require('../../component-loader');
const PageForgeImageExtension = require('./pageforge-image');
const PageForgeLinkExtension = require('./pageforge-link');

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
    }
};

marked.use({
    extensions: [
        PageForgeImageExtension,
        PageForgeLinkExtension
    ],
    renderer
});

module.exports = marked;