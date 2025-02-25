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
const PageForgeEJSExtension = require("./pageforge-ejs");
const PageForgeIssuesExtension = require("./pageforge-issues");
const PageForgeTooltipsExtension = require("./pageforge-tooltip");
const PageForgeMermaidExtension = require("./pageforge-mermaid");
const PageForgeDiffExtension = require("./pageforge-diff");
const PageForgeButtonExtension = require("./pageforge-button");
const PageForgeIconExtension = require("./pageforge-icon");
const PageForgeGridExtension = require('./pageforge-grid')
const PageForgeRestApiExtension = require('./pageforge-api')
const PageForgeKaTeXExtension = require('./pageforge-katex')
const PageForgeSwitchExtension = require('./pageforge-switch')
const {unescape} = require('./utils')

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

    listitem(item) {
        item.text = this.parser.parse(item.tokens, !!item.loose);
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
            text: unescape(item.text)
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
        PageForgeMermaidExtension,
        PageForgeCodeBlockExtension,
        PageForgeQuoteInlineCodeExtension,
        PageForgeHeadingExtension,
        PageForgeAlertExtension,
        PageForgeTabExtension,
        PageForgeTableExtension,
        PageForgeEJSExtension,
        PageForgeIssuesExtension,
        PageForgeTooltipsExtension,
        PageForgeDiffExtension,
        PageForgeButtonExtension,
        PageForgeIconExtension,
        PageForgeGridExtension,
        PageForgeRestApiExtension,
        PageForgeKaTeXExtension,
        PageForgeSwitchExtension
    ],
    renderer,
    breaks: false
});

module.exports = marked;