const {loadComponent} = require("../../component-loader");
const ConfigManager = require("../../config-manager");
const config = new ConfigManager(process.cwd()).getConfig();

const PageForgeGitHubIssuesExtension = {
    name: 'pageforgeGithubIssues',
    level: 'inline',
    start(src) {
        if (!config.feature?.issues?.enable) return -1;

        // 匹配两种可能的开始模式：仓库引用(xxx/xxx#数字) 或者 简单引用(#数字)
        const repoPattern = /[a-zA-Z0-9-]+\/[a-zA-Z0-9-_.]+#\d/;
        const simplePattern = /#\d/;

        // 先检查是否是仓库引用格式
        const repoMatch = src.match(repoPattern);
        if (repoMatch) {
            return repoMatch.index;
        }

        // 如果不是仓库引用，检查简单的 #数字 格式
        const simpleMatch = src.match(simplePattern);
        if (simpleMatch) {
            // 检查当前字符串是否在行内代码中
            const beforeText = src.substring(0, simpleMatch.index);
            const matches = beforeText.match(/`/g);
            if (matches && matches.length % 2 === 1) return -1;

            return simpleMatch.index;
        }

        return -1;
    },
    tokenizer(src, tokens) {
        if (!config.feature?.issues?.enable) return false;

        // 检查当前字符串是否在行内代码中
        if (src.startsWith('`') || src.indexOf('`') > -1) return false;

        const rule = /^(?:(?:([a-zA-Z0-9-]+)\/([a-zA-Z0-9-_.]+))?#(\d+))/;
        const match = rule.exec(src);

        if (match) {
            const [fullMatch, owner, repo, issueNumber] = match;
            const baseUrl = 'https://github.com/';
            const defaultOwner = config.repo?.owner || 'devlive-community';
            const defaultRepo = config.repo?.name || 'pageforge';

            const href = owner && repo
                ? `${baseUrl}${owner}/${repo}/issues/${issueNumber}`
                : `${baseUrl}${defaultOwner}/${defaultRepo}/issues/${issueNumber}`;

            // 修改这里，不管是否有仓库路径，都只显示 #number
            const text = `#${issueNumber}`;

            return {
                type: 'pageforgeGithubIssues',
                raw: fullMatch,
                text: text,
                href: href,
                tokens: []
            };
        }
        return false;
    },
    renderer(item) {
        const link = loadComponent('issues', {...item});
        return item.prefix || item.suffix
            ? `${item.prefix || ''}${link}${item.suffix || ''}`
            : link;
    }
};

module.exports = PageForgeGitHubIssuesExtension;