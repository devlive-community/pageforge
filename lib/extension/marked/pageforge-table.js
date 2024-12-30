const {marked} = require("marked");
const {loadComponent} = require("../../component-loader");

const PageForgeTableExtension = {
    name: 'table',
    level: 'block',
    start(src) {
        // 检查是否以表格的分隔符开始（至少有一个 | 符号）
        return src.match(/^\|(.+)\|/)?.index;
    },
    tokenizer(src, tokens) {
        // 匹配整个表格结构
        // 第一行是表头，第二行是分隔符，后面是数据行
        const rule = /^((?:\|.+\|\r?\n){1})(?:\|[-:\|\s]+\|\r?\n)((?:\|.+\|\r?\n)*)$/;
        const match = rule.exec(src);

        if (!match) {
            return false;
        }

        return {
            type: 'table',
            raw: match[0],
            tokens: []
        };
    },
    renderer(token) {
        // 使用组件渲染表格
        return loadComponent('table', {
            headers: token.header,
            rows: token.rows
        });
    }
};

module.exports = PageForgeTableExtension;