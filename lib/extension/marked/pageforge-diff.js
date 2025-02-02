const {loadComponent} = require("../../component-loader");
const ConfigManager = require("../../config-manager");
const config = new ConfigManager(process.cwd()).getConfig();

const PageForgeDiffExtension = {
    name: 'pageforgeDiff',
    level: 'block',

    start(src) {
        if (!config.feature?.diff?.enable) {
            return -1;
        }
        const index = src.match(/^:::diff(?:\s+[+-][\d,-]+)*\s*\n/m)?.index ?? -1;
        return index;
    },

    tokenizer(src, tokens) {
        if (!config.feature?.diff?.enable) {
            return false;
        }

        const headerMatch = /^:::diff((?:\s+[+-][\d,-]+)*)\s*\n/.exec(src);
        if (!headerMatch) {
            return false;
        }

        const endIndex = src.indexOf('\n:::');
        if (endIndex === -1) {
            return false;
        }

        const addLines = new Set();
        const deleteLines = new Set();
        const options = headerMatch[1];

        if (options) {
            options.trim().split(/\s+/).forEach(opt => {
                const type = opt[0];
                if (type !== '+' && type !== '-') {
                    return;
                }

                const rangeStr = opt.slice(1);
                rangeStr.split(',').forEach(range => {
                    if (range.includes('-')) {
                        const [start, end] = range.split('-').map(Number);
                        for (let i = start; i <= end; i++) {
                            type === '+' ? addLines.add(i) : deleteLines.add(i);
                        }
                    }
                    else {
                        const num = Number(range);
                        type === '+' ? addLines.add(num) : deleteLines.add(num);
                    }
                });
            });
        }

        const headerLength = headerMatch[0].length;
        const content = src.slice(headerLength, endIndex);
        const raw = src.slice(0, endIndex + 4);

        // 保留原始格式，包括空行
        const lines = content.split('\n');
        // 只移除最后一行的回车
        if (lines[lines.length - 1] === '') {
            lines.pop();
        }

        const processedLines = lines.map((line, index) => {
            const lineNum = index + 1;
            let type = 'context';

            if (addLines.has(lineNum)) {
                type = 'addition';
            }
            else if (deleteLines.has(lineNum)) {
                type = 'deletion';
            }
            else if (line.startsWith('+')) {
                type = 'addition';
                line = line.slice(1);
            }
            else if (line.startsWith('-')) {
                type = 'deletion';
                line = line.slice(1);
            }

            return {
                type,
                content: escapeHtml(line),
                prefix: type === 'addition' ? '+' : type === 'deletion' ? '-' : ' '
            };
        });

        return {
            type: 'pageforgeDiff',
            raw,
            content: processedLines,
            tokens: []
        };
    },

    renderer(token) {
        return loadComponent('diff', {
            content: token.content,
            config: config.feature?.diff?.options || {}
        });
    }
};

function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .replace(/`/g, '&#96;')
        .replace(/\$/g, '&#36;');
}

module.exports = PageForgeDiffExtension;