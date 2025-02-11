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
        let isCollectingContent = false;
        let baseIndent = 0;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();

            // 检查新的 tab 定义
            const tabMatch = line.match(/^(\s*)===\s*"([^"]*)"$/);

            if (tabMatch) {
                if (currentTab) {
                    // 处理前一个 tab，保留末尾的空行
                    while (currentContent.length > 0 && currentContent[currentContent.length - 1] === '') {
                        currentContent.pop();
                    }
                    tabs.push({
                        title: currentTab,
                        content: currentContent.join('\n')
                    });
                }
                currentTab = tabMatch[2];
                baseIndent = tabMatch[1].length;
                currentContent = [];
                isCollectingContent = false;
                continue;
            }

            if (currentTab) {
                if (trimmedLine === '') {
                    currentContent.push('');
                    continue;
                }

                // 检查内容是否有足够的缩进
                const indentMatch = line.match(/^(\s+)/);
                if (!indentMatch || indentMatch[1].length <= baseIndent) {
                    return false;
                }

                // 保持相对缩进
                let relativeIndent = '';
                if (indentMatch[1].length > baseIndent + 4) {
                    relativeIndent = ' '.repeat(indentMatch[1].length - (baseIndent + 4));
                }

                // 处理内容
                currentContent.push(relativeIndent + trimmedLine);
                isCollectingContent = true;
            }
        }

        // 保存最后一个 tab
        if (currentTab) {
            // 处理最后一个 tab 的内容
            while (currentContent.length > 0 && currentContent[currentContent.length - 1] === '') {
                currentContent.pop();
            }
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