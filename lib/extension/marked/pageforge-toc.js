const marked = require('./pageforge-marked');

function formatTOC(markdown) {
    // 创建一个新的 marked 解析器实例
    const parser = new marked.Parser();

    const tokens = marked.lexer(markdown);
    const headings = tokens.filter(token => token.type === 'pageforgeHeading')
        .map(token => ({
            level: token.level,
            slug: token.slug,
            text: parser.parseInline(token.tokens)  // 使用解析器实例来处理
        }));

    function buildTree(headings) {
        const result = [];
        let stack = [{level: 0, children: result}];

        headings.forEach(heading => {
            const node = {
                ...heading,
                children: []
            };

            while (stack[stack.length - 1].level >= heading.level) {
                stack.pop();
            }

            stack[stack.length - 1].children.push(node);
            stack.push(node);
        });

        return result;
    }

    return buildTree(headings);
}

module.exports = formatTOC;