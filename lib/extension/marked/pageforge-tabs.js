const {marked} = require("marked");
const {loadComponent} = require("../../component-loader");

const PageForgeTabExtension = {
    name: 'pageforgeTabs',
    level: 'block',
    start(src) {
        return src.match(/^:::\s*tabs\s*$/m) ? 0 : -1;
    },
    tokenizer(src, tokens) {
        const startRule = /^:::\s*tabs\s*$/m;
        const startMatch = src.match(startRule);

        if (!startMatch) {
            return false;
        }

        const lines = src.split('\n');
        const tabs = [];
        let currentTab = null;
        let currentContent = [];
        let endIndex = -1;

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();

            if (trimmedLine === ':::') {
                endIndex = i;
                if (currentTab) {
                    tabs.push({
                        title: currentTab,
                        content: currentContent
                    });
                }
                break;
            }

            // 检查基础缩进（4个空格）
            if (!line.startsWith('    ') && trimmedLine !== '') {
                return false;
            }

            // 移除第一层缩进（4个空格）
            const indentedLine = line.slice(4);
            const tabMatch = indentedLine.match(/^===\s*"([^"]*)"$/);

            if (tabMatch) {
                if (currentTab) {
                    tabs.push({
                        title: currentTab,
                        content: currentContent
                    });
                }
                currentTab = tabMatch[1];
                currentContent = [];
                continue;
            }

            if (currentTab) {
                // 对于标签内容，再去除一层缩进（如果存在）
                if (trimmedLine === '') {
                    currentContent.push('');
                }
                else if (indentedLine.startsWith('    ')) {
                    // 移除第二层缩进
                    currentContent.push(indentedLine.slice(4));
                }
                else {
                    // 如果没有第二层缩进，返回 false
                    return false;
                }
            }
        }

        if (endIndex === -1 || tabs.length === 0) {
            return false;
        }

        const raw = lines.slice(0, endIndex + 1).join('\n');

        // 处理每个标签的内容，确保每行都被独立处理
        const processedTabs = tabs.map(tab => {
            // 对内容进行预处理，确保每行都是独立的
            const processedContent = tab.content
                .map(line => line.trim())  // 移除每行首尾空格
                .filter(line => line !== '')  // 移除空行
                .join('\n\n');  // 用双换行连接以确保行的独立性

            // 使用 lexer 解析处理后的内容
            const tokens = this.lexer.blockTokens(processedContent);

            return {
                title: tab.title,
                content: processedContent,
                tokens: tokens
            };
        });

        return {
            type: 'pageforgeTabs',
            raw: raw,
            tabs: processedTabs
        };
    },
    renderer(token) {
        const tabsData = token.tabs.map(tab => ({
            title: tab.title,
            content: this.parser.parse(tab.tokens)
        }));

        return loadComponent('tabs', {
            tabs: tabsData
        });
    }
};

module.exports = PageForgeTabExtension;