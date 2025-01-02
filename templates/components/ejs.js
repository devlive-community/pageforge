const {VM} = require('vm2');

function validateExpression(expression) {
    const blacklist = [
        'process',
        'require',
        'global',
        '__dirname',
        '__filename',
        'Buffer',
        'setTimeout',
        'setInterval'
    ];

    return !blacklist.some(keyword =>
        expression.includes(keyword) ||
        expression.match(new RegExp(`\\b${keyword}\\b`))
    );
}

module.exports = function template({expression, isOutput, context}) {
    if (!isOutput) {
        return `<!-- EJS Control: ${expression} -->`;
    }

    try {
        // 验证表达式
        if (!validateExpression(expression)) {
            console.error(`[Security Warning] Unsafe expression detected: ${expression}`);
            return '<span class="text-red-500">Invalid expression</span>';
        }

        // 创建安全的上下文
        // 使用 vm2 安全执行表达式
        const vm = new VM({
            timeout: 1000,
            sandbox: context
        });

        const result = vm.run(`(() => {
            with (pageData) {
                return ${expression};
            }
        })()`);

        return `<span class="ejs-expression">${result}</span>`;
    }
    catch (error) {
        console.error(`[Error] Failed to evaluate expression: ${expression}`, error);
        return '<span class="text-red-500">Expression evaluation failed</span>';
    }
};