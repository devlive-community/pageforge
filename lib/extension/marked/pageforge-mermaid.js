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

        // 匹配 :::mermaid 开头
        const index = src.indexOf(':::mermaid\n');
        return index;
    },

    tokenizer(src, tokens) {
        if (!config.feature?.mermaid?.enable) {
            return false;
        }

        // 确保以 :::mermaid\n 开头
        if (!src.startsWith(':::mermaid\n')) {
            return false;
        }

        // 查找结束标记 :::
        const endIndex = src.indexOf('\n:::');
        if (endIndex === -1) {
            return false;
        }

        // 提取内容
        const content = src.slice(11, endIndex).trim();
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