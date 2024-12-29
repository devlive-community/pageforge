const {marked} = require("marked");
const {loadComponent} = require("../../component-loader");

// [链接文本](链接URL)                              // 基本语法
// [链接文本](链接URL "链接标题")                    // 带标题
// [链接文本](链接URL "链接标题" "_blank")           // 指定打开方式
const PageForgeLinkExtension = {
    name: 'pageforgeLink',
    level: 'inline',
    start(src) {
        return src.match(/^\[/)?.index;
    },
    tokenizer(src, tokens) {
        const rule = /^\[(.*?)\]\((.*?)(?:\s+"(.*?)")?(?:\s+"(.*?)")?\)/;
        const match = rule.exec(src);
        if (match) {
            return {
                type: 'pageforgeLink',
                raw: match[0],
                text: match[1],
                href: match[2],
                title: match[3] || null,
                target: match[4] || null,
                tokens: []
            };
        }
        return false;
    },
    renderer(item) {
        return loadComponent('a', {
            ...item
        });
    }
};

marked.use({
    extensions: [
        PageForgeLinkExtension
    ]
});

module.exports = PageForgeLinkExtension;