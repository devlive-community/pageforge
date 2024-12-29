const {marked} = require("marked");
const {loadComponent} = require('../../component-loader');
const PageForgeImageExtension = require('./pageforge-image');

const renderer = {
    paragraph({tokens, raw, type}) {
        // 修改图片正则表达式，使其更准确地匹配所有情况
        const linkRegex = /\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\s*(?:"(.*?)")?\)/g;

        // 获取所有匹配
        let linkMatches = [...raw.matchAll(linkRegex)];

        tokens = tokens.map(token => {
            token.raw = raw;

            const isPartOfLink = linkMatches.some(match =>
                match[0].includes(token.raw)
            );

            if (isPartOfLink) {
                token.isLink = true;
            }

            return token;
        });

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
        console.log('=========', item)
        return loadComponent('image', {
            imageItem: {item}
        });
    }
};

marked.use({
    extensions: [
        PageForgeImageExtension
    ],
    renderer
});

module.exports = marked;