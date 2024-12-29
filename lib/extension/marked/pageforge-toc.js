const {marked} = require('marked');
const {pinyin} = require('pinyin');

function formatTOC(markdown) {
    const tokens = marked.lexer(markdown);
    const headings = tokens.filter(token => token.type === 'heading');

    function buildTree(headings) {
        const result = [];
        let stack = [{level: 0, children: result}];

        headings.forEach(heading => {
            const node = {
                level: heading.depth,
                text: heading.text,
                slug: pinyin(heading.text.replace(/\s+/g, ''), {
                    style: pinyin.STYLE_NORMAL,
                    segment: true
                }).flat().join('-'),
                children: []
            };

            // 找到合适的父节点
            while (stack[stack.length - 1].level >= heading.depth) {
                stack.pop();
            }

            // 添加到父节点的children中
            stack[stack.length - 1].children.push(node);

            // 将当前节点加入stack
            stack.push(node);
        });

        return result;
    }

    return buildTree(headings);
}

module.exports = formatTOC;