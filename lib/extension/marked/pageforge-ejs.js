const {loadComponent} = require("../../component-loader");

let contextData = {};

const PageForgeEJSExtension = {
    name: 'pageforgeEJS',
    level: 'inline',

    setContext(data) {
        contextData = data;
    },

    start(src) {
        const index = src.indexOf('<%');
        if (index === -1) {
            return -1;
        }

        // 检查前一个字符，避免在特殊语法中解析
        if (index > 0) {
            const prevChar = src[index - 1];
            // 如果前一个字符是特殊字符（如 `, *, _），则不解析
            if (['`', '*', '_', '~'].includes(prevChar)) {
                return -1;
            }
        }

        return index;
    },

    tokenizer(src, tokens) {
        const rule = /<%([=%]?)\s*([^%>]+?)\s*%>/;
        const match = rule.exec(src);

        if (!match) {
            return false;
        }

        const raw = match[0];
        const expressionType = match[1];
        const expression = match[2].trim();

        // 获取表达式之后的字符
        const afterExpr = src.slice(match.index + raw.length);
        // 如果表达式后紧跟特殊字符，也不解析
        if (afterExpr[0] && ['`', '*', '_', '~'].includes(afterExpr[0])) {
            return false;
        }

        return {
            type: 'pageforgeEJS',
            raw: raw,
            expressionType,
            expression,
            isOutput: expressionType === '=',
            tokens: []
        };
    },

    renderer(token) {
        return loadComponent('ejs', {
            expression: token.expression,
            isOutput: token.isOutput,
            context: contextData
        });
    }
};

module.exports = PageForgeEJSExtension;