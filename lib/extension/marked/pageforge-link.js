const {marked} = require("marked");
const {loadComponent} = require("../../component-loader");

// [链接文本](链接URL)                              // 基本语法
// [链接文本](链接URL "链接标题")                    // 带标题
// [链接文本](链接URL "链接标题" "_blank")           // 指定打开方式
const PageForgeLinkExtension = {
    name: 'pageforgeLink',
    level: 'inline',
    start(src) {
        // 匹配不是以!开头的[
        const match = src.match(/(?<!!)\[/);
        return match?.index;
    },
    tokenizer(src, tokens) {
        // 匹配格式：前缀文本 + [链接文本](链接URL "可选标题" "可选目标") + 后缀文本
        const rule = /(.*?)(?<!!)\[(.*?)\]\((.*?)(?:\s+"(.*?)")?(?:\s+"(.*?)")?\)([^\[\n]*)/;
        const match = rule.exec(src);

        if (match) {
            return {
                type: 'pageforgeLink',
                raw: match[0],
                prefix: match[1],      // 链接前的文本
                text: match[2],        // 链接文本
                href: match[3],        // 链接URL
                title: match[4] || null,  // 可选标题
                target: match[5] || null, // 可选目标
                suffix: match[6],      // 链接后的文本
                tokens: []
            };
        }
        return false;
    },
    renderer(item) {
        const link = loadComponent('a', {...item});

        // 只在需要时添加包装
        if (item.prefix || item.suffix) {
            return `<span class="inline-block my-1 mx-auto">${item.prefix || ''}${link}${item.suffix || ''}</span>`;
        }

        return link;
    }
};

marked.use({
    extensions: [
        PageForgeLinkExtension
    ],
    breaks: true
});

module.exports = PageForgeLinkExtension;