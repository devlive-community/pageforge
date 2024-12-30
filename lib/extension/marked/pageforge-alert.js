const {marked} = require("marked");
const {loadComponent} = require("../../component-loader");

const VALID_TYPES = ['info', 'danger', 'success', 'warning', 'dark'];

const PageForgeAlertExtension = {
    name: 'pageforgeAlert',
    level: 'block',
    start(src) {
        return src.match(/^!!!\s/) ? 0 : -1;
    },
    tokenizer(src, tokens) {
        // 分割成行来检查空行要求
        const lines = src.split('\n');

        // 1. 检查开始行格式
        const firstLine = lines[0];
        const startRule = /^!!!\s+(\w+)\s+"([^"]*)"$/;
        const match = firstLine.match(startRule);

        if (!match) {
            return false;
        }

        const [_, type, title] = match;

        if (!VALID_TYPES.includes(type)) {
            return false;
        }

        // 2. 查找结束标记
        let endIndex = lines.findIndex((line, idx) => idx > 0 && line.trim() === '!!!');
        if (endIndex === -1) {
            return false;
        }

        // 3. 验证格式要求
        // 标题行后必须有空行
        if (lines[1]?.trim() !== '') {
            return false;
        }

        // 结束标记前必须有空行
        if (lines[endIndex - 1]?.trim() !== '') {
            return false;
        }

        // 4. 获取内容行（排除首尾空行）
        const contentLines = lines.slice(2, endIndex - 1);

        // 检查是否有内容及缩进
        if (!contentLines.some(line => line.trim())) {
            return false;
        }

        // 检查所有非空行是否都有足够的缩进
        if (!contentLines.every(line => line.trim() === '' || line.startsWith('    '))) {
            return false;
        }

        // 5. 处理内容（移除缩进）
        const content = contentLines
            .map(line => line.startsWith('    ') ? line.slice(4) : line)
            .join('\n')
            .trim();

        // 6. 生成 tokens
        const contentTokens = this.lexer.blockTokens(content);

        return {
            type: 'pageforgeAlert',
            raw: lines.slice(0, endIndex + 1).join('\n'),
            alertType: type,
            title: title,
            content: content,
            tokens: contentTokens
        };
    },
    renderer(token) {
        const content = this.parser.parse(token.tokens);

        return loadComponent(`alert`, {
            type: token.alertType,
            title: token.title,
            content: content
        });
    }
};

module.exports = PageForgeAlertExtension;