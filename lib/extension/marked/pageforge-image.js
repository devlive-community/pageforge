const {marked} = require("marked");
const {loadComponent} = require("../../component-loader");

// ![alt文本](图片URL)                              // 基本语法
// ![alt文本](图片URL "图片标题")                    // 带标题
// ![alt文本](图片URL =100x200)                     // 指定宽高
// ![alt文本](图片URL "图片标题" =600x)              // 只指定宽度
// ![alt文本](图片URL "图片标题" =x600)              // 只指定高度
// ![alt文本](图片URL "图片标题" =100x200 left)      // 带对齐方式
const PageForgeImageExtension = {
    name: 'pageforgeImage',
    level: 'inline',
    start(src) {
        return src.match(/^!\[/)?.index;
    },
    tokenizer(src, tokens) {
        const rule = /^!\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\s*(?:=(\d+)?x(\d+)?)?(?:\s+(left|center|right))?\)/;
        const match = rule.exec(src);
        if (match) {
            return {
                type: 'pageforgeImage',
                raw: match[0],
                text: match[1],
                alt: match[1],
                href: match[2],
                title: match[3] || null,
                width: match[4] || null,
                height: match[5] || null,
                align: match[6] || null,
                tokens: []
            };
        }
        return false;
    },
    renderer(item) {
        return loadComponent('image', {...item});
    }
};

marked.use({
    extensions: [
        PageForgeImageExtension
    ]
});

module.exports = PageForgeImageExtension;