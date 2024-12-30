const {marked} = require("marked");

const PageForgeQuoteCodeExtension = {
    name: 'pageforgeQuoteInlineCode',
    level: 'block',
    start(src) {
        return src.trimStart().startsWith('>') ? 0 : -1;
    },
    tokenizer(src, tokens) {
        if (!src.trimStart().startsWith('>')) {
            return false;
        }

        // 匹配单个引用块（到第一个非引用行为止）
        const blockRule = /^((?:>.*\n?)+?)(?:\n(?!>)|$)/;
        const blockMatch = blockRule.exec(src);

        if (!blockMatch) {
            return false;
        }

        // 分割成行并处理每一行
        const lines = blockMatch[1].split('\n');
        const processedLines = lines
            .filter(line => line.startsWith('>'))  // 只处理引用行
            .map(line => {
                // 移除开头的 > 但保留后面的空格
                const content = line.replace(/^>/, '');

                // 如果是空行（只有 > 的行）
                if (!content.trim()) {
                    return {
                        type: 'empty',
                        content: ''
                    };
                }

                // 使用 marked.lexer 来处理行内容，但不立即解析
                return {
                    type: 'content',
                    content: content.trimStart()
                };
            });

        // 移除末尾的空行
        while (processedLines.length > 0 && processedLines[processedLines.length - 1].type === 'empty') {
            processedLines.pop();
        }

        return {
            type: 'pageforgeQuoteInlineCode',
            raw: blockMatch[0],
            lines: processedLines,
            tokens: []
        };
    },
    renderer(token) {
        // 渲染每一行
        const renderedLines = token.lines.map(line => {
            switch (line.type) {
                case 'content': {
                    new marked.Lexer({gfm: true, breaks: true});
                    // 使用现有的 marked 实例来解析内容
                    const inlineContent = marked(line.content, {
                        gfm: true,
                        breaks: true
                    });

                    return `<div class="py-1">${inlineContent}</div>`;
                }

                case 'empty':
                    return `<div class="h-4"></div>`;

                default:
                    return '';
            }
        });

        // 使用 Tailwind CSS 实现 Markdown 引用块效果
        return `<div class="pl-4 my-2 border-l-4 border-gray-200 dark:border-gray-700">
            ${renderedLines.join('\n')}
        </div>`;
    }
};

module.exports = PageForgeQuoteCodeExtension;