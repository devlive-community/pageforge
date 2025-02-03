const {loadComponent} = require("../../component-loader");
const ConfigManager = require("../../config-manager");
const config = new ConfigManager(process.cwd()).getConfig();

const PageForgeMermaidExtension = {
    name: 'pageforgeMermaid',
    level: 'block',

    start(src) {
        if (!config.feature?.mermaid?.enable) {
            return -1;
        }

        // 匹配 :::mermaid 或 ::: mermaid 开头
        const match = src.match(/^:::\s*mermaid\n/m);
        return match ? match.index : -1;
    },

    tokenizer(src, tokens) {
        if (!config.feature?.mermaid?.enable) {
            return false;
        }

        // 匹配开头
        const match = src.match(/^:::\s*mermaid\n/);
        if (!match) {
            return false;
        }

        // 查找结束标记 :::
        const endIndex = src.indexOf('\n:::');
        if (endIndex === -1) {
            return false;
        }

        // 提取内容,注意开头长度现在需要用match[0].length
        const content = src.slice(match[0].length, endIndex).trim();
        const raw = src.slice(0, endIndex + 4);

        return {
            type: 'pageforgeMermaid',
            raw,
            content,
            tokens: []
        };
    },

    renderer(token) {
        return loadComponent('mermaid', {
            content: token.content,
            config: config.feature?.mermaid?.options || {}
        });
    }
};

module.exports = PageForgeMermaidExtension;