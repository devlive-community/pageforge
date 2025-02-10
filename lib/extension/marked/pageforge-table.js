const {marked} = require("marked");
const {loadComponent} = require("../../component-loader");

const PageForgeTableExtension = {
    name: 'table',
    level: 'block',
    start(src) {
        return src.match(/^\|(.+)\|/)?.index;
    },
    tokenizer(src, tokens) {
        // 匹配表格结构
        const lines = src.split('\n');
        let currentLine = 0;

        // 检查第一行（表头）
        const headerMatch = lines[currentLine].match(/^\|(.+)\|$/);
        if (!headerMatch) return false;

        // 检查第二行（对齐语法）
        currentLine++;
        const alignmentLine = lines[currentLine];
        const alignmentMatch = alignmentLine.match(/^\|((?:[:]-+[:]\|)+)$/);
        if (!alignmentMatch) return false;

        // 收集后续的数据行
        let tableRows = [];
        currentLine++;
        while (currentLine < lines.length && lines[currentLine].match(/^\|(.+)\|$/)) {
            tableRows.push(lines[currentLine]);
            currentLine++;
        }

        // 解析表格内容
        const headerRow = parseRow(headerMatch[0]);
        const alignments = parseAlignments(alignmentLine);
        const rows = tableRows.map(row => parseRow(row));

        return {
            type: 'table',
            raw: lines.slice(0, currentLine).join('\n'),
            header: headerRow.map((cell, i) => ({
                text: cell.trim(),
                align: alignments[i]
            })),
            rows: rows.map(row =>
                row.map((cell, i) => ({
                    text: cell.trim(),
                    align: alignments[i]
                }))
            ),
            tokens: []
        };
    },
    renderer(token) {
        const headers = token.header.map(cell => ({
            ...cell,
            text: marked(cell.text)
        }));

        const rows = token.rows.map(row =>
            row.map(cell => ({
                ...cell,
                text: marked(cell.text)
            }))
        );

        return loadComponent('table', {
            headers,
            rows
        });
    }
};

// 辅助函数：解析行内容
function parseRow(row) {
    return row
        .slice(1, -1)  // 移除首尾的 |
        .split('|')
        .map(cell => cell.trim());
}

// 辅助函数：解析对齐方式，专门处理 :-----: 这样的语法
function parseAlignments(delimiter) {
    return delimiter
        .slice(1, -1)  // 移除首尾的 |
        .split('|')
        .map(col => {
            const colTrim = col.trim();
            const hasColonLeft = colTrim.startsWith(':');
            const hasColonRight = colTrim.endsWith(':');

            if (hasColonLeft && hasColonRight) return 'center';
            if (hasColonRight) return 'right';
            if (hasColonLeft) return 'left';
            return '';
        });
}

module.exports = PageForgeTableExtension;