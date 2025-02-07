const {marked} = require("marked");
const {loadComponent} = require("../../component-loader");
const ConfigManager = require("../../config-manager");
const config = new ConfigManager(process.cwd()).getConfig();

const PageForgeTabExtension = {
    name: 'pageforgeTabs',
    level: 'block',

    start(src) {
        if (!config.feature?.tabs?.enable) {
            return -1;
        }
        const index = src.match(/^:::\s*tabs\s*$/m)?.index ?? -1;
        return index;
    },

    tokenizer(src, tokens) {
        if (!config.feature?.tabs?.enable) {
            return false;
        }

        const headerMatch = /^:::\s*tabs\s*\n/.exec(src);
        if (!headerMatch) {
            return false;
        }

        const endIndex = src.indexOf('\n:::');
        if (endIndex === -1) {
            return false;
        }

        const headerLength = headerMatch[0].length;
        const content = src.slice(headerLength, endIndex);
        const raw = src.slice(0, endIndex + 4);

        // 解析 tabs 内容
        const lines = content.split('\n');
        const tabs = [];
        let currentTab = null;
        let currentContent = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();

            // 检查新的 tab 定义
            const indentMatch = line.match(/^(\s+)/);
            const tabMatch = line.match(/^(\s+)===\s*"([^"]*)"$/);

            if (tabMatch) {
                // 检查缩进是否至少有 4 个空格
                if (!indentMatch || indentMatch[1].length < 4) {
                    return false;
                }

                if (currentTab) {
                    // 这里不直接解析，只存储内容
                    tabs.push({
                        title: currentTab,
                        content: currentContent.join('\n')
                    });
                }
                currentTab = tabMatch[2];
                currentContent = [];
                continue;
            }

            // 收集当前 tab 的内容
            if (currentTab) {
                // 空行允许不缩进
                if (trimmedLine === '') {
                    currentContent.push('');
                    continue;
                }

                // 检查内容的缩进
                const contentIndent = line.match(/^(\s+)/);
                // 内容必须要有比 tab 标题更多的缩进（至少 8 个空格）
                if (!contentIndent || contentIndent[1].length < 8) {
                    return false;
                }

                // 直接使用 trimmedLine，不保留任何缩进
                currentContent.push(trimmedLine);
            }
        }

        // 保存最后一个 tab
        if (currentTab) {
            tabs.push({
                title: currentTab,
                content: currentContent.join('\n')
            });
        }

        if (tabs.length === 0) {
            return false;
        }

        // 处理每个标签的内容
        const processedTabs = tabs.map(tab => {
            const tokens = this.lexer.blockTokens(tab.content);
            return {
                title: tab.title,
                tokens
            };
        });

        return {
            type: 'pageforgeTabs',
            raw,
            tabs: processedTabs,
            tokens: []
        };
    },

    renderer(token) {
        const tabsData = token.tabs.map(tab => ({
            title: tab.title,
            content: this.parser.parse(tab.tokens)
        }));

        return loadComponent('tabs', {
            tabs: tabsData,
            config: config.feature?.tabs?.options || {}
        });
    }
};

module.exports = PageForgeTabExtension;