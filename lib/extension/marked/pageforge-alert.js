const {marked} = require("marked");
const {loadComponent} = require("../../component-loader");

const VALID_TYPES = ['info', 'danger', 'success', 'warning', 'dark', 'note'];

const PageForgeAlertExtension = {
    name: 'pageforgeAlert',
    level: 'block',
    start(src) {
        // 匹配独立行的 !!!
        const match = src.match(/^(?:\s*)!!!\s/m);
        return match ? match.index : -1;
    },
    tokenizer(src, tokens) {
        // 分割成行来检查内容
        const lines = src.split('\n');

        // 1. 检查开始行格式
        const firstLine = lines[0];
        const startRule = /^(?:\s*)!!!\s+(\w+)(?:\s+"([^"]*)")?$/;
        const match = firstLine.match(startRule);

        if (!match) {
            return false;
        }

        const [_, type, title = undefined] = match;

        if (!VALID_TYPES.includes(type)) {
            return false;
        }

        // 2. 查找结束标记（必须是独立的 !!!）
        let endIndex = lines.findIndex((line, idx) =>
            idx > 0 && /^(?:\s*)!!!(?:\s*)$/.test(line)
        );
        if (endIndex === -1) {
            return false;
        }

        // 3. 获取内容行（去掉首尾行）
        let contentLines = lines.slice(1, endIndex);

        // 4. 检查内容有效性
        if (!contentLines.some(line => line.trim())) {
            return false;
        }

        // 5. 计算最小缩进
        const minIndent = contentLines
            .filter(line => line.trim().length > 0)
            .reduce((min, line) => {
                const indent = line.match(/^\s*/)[0].length;
                return Math.min(min, indent);
            }, Infinity);

        // 6. 处理内容（移除共同缩进但保持相对缩进和空行）
        const content = contentLines
            .map(line => {
                if (line.trim() === '') return '';
                return line.slice(minIndent);
            })
            .join('\n');

        // 7. 生成 tokens
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