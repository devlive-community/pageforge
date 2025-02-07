const {marked} = require("marked");
const {loadComponent} = require("../../component-loader");

const PageForgeLinkExtension = {
    name: 'pageforgeLink',
    level: 'inline',
    start(src) {
        // 只查找链接的起始位置
        const match = /\[(?![^[\]]*\]\(.*?\).*?\[)/.exec(src);
        return match ? match.index : -1;
    },
    tokenizer(src) {
        // 只匹配单个链接部分
        const rule = /^\[(.*?)\]\((.*?)(?:\s+"(.*?)")?(?:\s+"(.*?)")?\)/;
        const match = rule.exec(src);

        if (match) {
            return {
                type: 'pageforgeLink',
                raw: match[0],
                text: match[1],        // 链接文本
                href: match[2],        // 链接URL
                title: match[3] || null,  // 可选标题
                target: match[4] || null, // 可选目标
                tokens: []
            };
        }
        return false;
    },
    renderer(token) {
        return loadComponent('a', {...token});
    }
};

module.exports = PageForgeLinkExtension;