const {marked} = require("marked");
const {loadComponent} = require("../../component-loader");

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

                // 检查该行是否包含内联代码
                const codeMatch = content.match(/^\s*(.*?)`([^`]+)`(.*)$/);

                if (codeMatch) {
                    return {
                        type: 'code',
                        prefix: codeMatch[1]?.trim() || '',
                        code: codeMatch[2],
                        suffix: codeMatch[3]?.trim() || ''
                    };
                }
                else {
                    return {
                        type: 'text',
                        content: content.trimStart()
                    };
                }
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
                case 'code':
                    let content = [];
                    if (line.prefix) {
                        content.push(`<span class="mr-1">${line.prefix}</span>`);
                    }
                    content.push(loadComponent('inline-code', {text: line.code}));
                    if (line.suffix) {
                        content.push(`<span class="ml-1">${line.suffix}</span>`);
                    }
                    return `<div class="inline-flex items-center flex-wrap py-1">
                        ${content.join('')}
                    </div>`;

                case 'text':
                    return `<div class="py-1">${line.content}</div>`;

                case 'empty':
                    return `<div class="h-4"></div>`; // 空行使用固定高度
            }
        });

        return `<div class="pl-4 my-2 border-l-4 border-gray-200 dark:border-gray-700">
            ${renderedLines.join('\n')}
        </div>`;
    }
};

marked.use({
    extensions: [
        PageForgeQuoteCodeExtension
    ],
    breaks: true
});

module.exports = PageForgeQuoteCodeExtension;