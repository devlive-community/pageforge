const {marked} = require("marked");
const {loadComponent} = require("../../component-loader");

const PageForgeLinkExtension = {
    name: 'pageforgeLink',
    level: 'inline',
    start(src) {
        // 查找第一个可能的链接起始位置
        const index = src.indexOf('[');
        if (index === -1) return -1;

        // 检查是否是图片语法
        if (index > 0 && src[index - 1] === '!') {
            return -1;
        }

        // 检查是否在代码块内
        const beforeText = src.slice(0, index);
        const backquotes = beforeText.split('`').length - 1;
        // 如果反引号数量是奇数，说明在代码块内
        if (backquotes % 2 === 1) {
            return -1;
        }

        return index;
    },
    tokenizer(src, tokens) {
        // 如果以 ! 开头，说明是图片语法，不处理
        if (src.startsWith('!')) {
            return false;
        }

        // 检查是否在代码块内
        const backquotes = src.split('`').length - 1;
        if (backquotes % 2 === 1) {
            return false;
        }

        // 匹配格式：前缀文本 + [链接文本](链接URL "可选标题" "可选目标") + 后缀文本
        const rule = /^(.*?)\[(.*?)\]\((.*?)(?:\s+"(.*?)")?(?:\s+"(.*?)")?\)([^\[\n]*)/;
        const match = rule.exec(src);

        if (match) {
            // 确保匹配到的内容不是图片语法的一部分
            const fullPrefix = match[1];
            if (fullPrefix.includes('!')) {
                return false;
            }

            // 再次确认匹配的文本不在代码块内
            const fullText = match[0];
            if (fullText.includes('`')) {
                const textBackquotes = fullText.split('`').length - 1;
                if (textBackquotes > 0) {
                    return false;
                }
            }

            return {
                type: 'pageforgeLink',
                raw: match[0],
                prefix: fullPrefix,    // 链接前的文本
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

module.exports = PageForgeLinkExtension;