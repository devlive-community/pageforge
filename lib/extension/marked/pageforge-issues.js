const {loadComponent} = require("../../component-loader");
const ConfigManager = require("../../config-manager");
const config = new ConfigManager(process.cwd()).getConfig();

const PageForgeGitHubIssuesExtension = {
    name: 'pageforgeGithubIssues',
    level: 'inline',
    start(src) {
        if (!config.feature?.issues?.enable) return -1;

        const index = src.indexOf('#');
        if (index === -1) return -1;

        // 检查当前字符串是否在行内代码中
        const beforeText = src.substring(0, index);
        const matches = beforeText.match(/`/g);
        if (matches && matches.length % 2 === 1) return -1;

        return index;
    },
    tokenizer(src, tokens) {
        if (!config.feature?.issues?.enable) return false;

        // 检查当前字符串是否在行内代码中
        if (src.startsWith('`') || src.indexOf('`') > -1) return false;

        const rule = /^(.*?)(?:([a-zA-Z0-9-]+\/[a-zA-Z0-9-_.]+)?#(\d+))([^\n]*)/;
        const match = rule.exec(src);

        if (match) {
            const fullPrefix = match[1];
            const repoPath = match[2] || '';
            const issueNumber = match[3];
            const suffix = match[4];

            const baseUrl = 'https://github.com/';
            const owner = config.repo?.owner || 'devlive-community';
            const repo = config.repo?.name || 'pageforge';

            const href = repoPath
                ? `${baseUrl}${repoPath}/issues/${issueNumber}`
                : `${baseUrl}${owner}/${repo}/issues/${issueNumber}`;

            return {
                type: 'pageforgeGithubIssues',
                raw: match[0],
                prefix: fullPrefix,
                text: `#${issueNumber}`,
                href: href,
                suffix: suffix,
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