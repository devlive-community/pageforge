const {marked} = require('marked');
const {loadComponent} = require('../../component-loader');

const PageForgeRestApiExtension = {
    name: 'pageforgeRestApi',
    level: 'block',

    start(src) {
        const match = src.match(/^:::\s*api/m);
        return match ? match.index : -1;
    },

    tokenizer(src) {
        const headerMatch = /^:::\s*api\s+(GET|POST|PUT|DELETE|PATCH)\s+([^\n]+)\n/.exec(src);
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

        const [_, method, path] = headerMatch;
        const lines = content.split('\n');

        let apiInfo = {
            method,
            path: path.trim(),
            description: null,
            sections: []
        };

        let currentSection = null;
        let currentContent = [];
        let baseIndent = 0;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();

            // 检查新的 section 定义
            const sectionMatch = line.match(/^(\s*)===\s*"([^"]*)"$/);

            if (sectionMatch) {
                if (currentSection) {
                    // 处理前一个 section，保留末尾的空行
                    while (currentContent.length > 0 && currentContent[currentContent.length - 1] === '') {
                        currentContent.pop();
                    }
                    apiInfo.sections.push({
                        title: currentSection,
                        content: currentContent.join('\n')
                    });
                }
                else if (currentContent.length > 0) {
                    // 如果是初始描述内容
                    apiInfo.description = currentContent.join('\n');
                }

                currentSection = sectionMatch[2];
                baseIndent = sectionMatch[1].length;
                currentContent = [];
                continue;
            }

            if (trimmedLine === '') {
                currentContent.push('');
                continue;
            }

            // 处理普通内容行
            if (currentSection) {
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

                currentContent.push(relativeIndent + trimmedLine);
            }
            else {
                currentContent.push(line);
            }
        }

        // 处理最后一个部分
        if (currentContent.length > 0) {
            if (currentSection) {
                while (currentContent.length > 0 && currentContent[currentContent.length - 1] === '') {
                    currentContent.pop();
                }
                apiInfo.sections.push({
                    title: currentSection,
                    content: currentContent.join('\n')
                });
            }
            else {
                apiInfo.description = currentContent.join('\n');
            }
        }

        // 处理每个部分的内容
        if (apiInfo.description) {
            apiInfo.description = this.lexer.blockTokens(apiInfo.description);
        }

        apiInfo.sections = apiInfo.sections.map(section => ({
            title: section.title,
            tokens: this.lexer.blockTokens(section.content)
        }));

        return {
            type: 'pageforgeRestApi',
            raw,
            apiInfo
        };
    },

    renderer(token) {
        const {apiInfo} = token;

        const description = apiInfo.description ? this.parser.parse(apiInfo.description) : '';
        const sections = apiInfo.sections.map(section => ({
            title: section.title,
            content: this.parser.parse(section.tokens)
        }));

        return loadComponent('restApi', {
            method: apiInfo.method,
            path: apiInfo.path,
            description,
            sections
        });
    }
};

module.exports = PageForgeRestApiExtension;