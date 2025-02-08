const {execSync} = require('child_process');

class GitInfoProvider {
    constructor(config) {
        this.config = config;
    }

    /**
     * 格式化日期字符串
     * @param {string} dateStr ISO 格式的日期字符串
     * @returns {string} 格式化后的日期字符串
     */
    formatDate(dateStr) {
        try {
            const date = new Date(dateStr);
            return date.getFullYear() + '/' +
                String(date.getMonth() + 1).padStart(2, '0') + '/' +
                String(date.getDate()).padStart(2, '0') + ' ' +
                String(date.getHours()).padStart(2, '0') + ':' +
                String(date.getMinutes()).padStart(2, '0');
        }
        catch (error) {
            console.warn('Date parsing error:', error);
            return dateStr;
        }
    }

    /**
     * 获取文件的修订信息
     * @param {string} filePath 文件路径
     * @returns {Object|null} 修订信息对象
     */
    async getRevisionInfo(filePath) {
        if (!this.config.feature?.revision?.enable) {
            return null;
        }

        try {
            // 获取第一次提交信息
            const firstCommitCommand = `git log --follow --format="%H|%an|%aI" -- "${filePath}" | tail -n 1`;
            const firstCommitInfo = execSync(firstCommitCommand, {encoding: 'utf-8'}).trim();

            // 获取最后一次修改信息
            const lastModifiedCommand = `git log -n 1 --format="%H|%aI" -- "${filePath}"`;
            const lastModifiedInfo = execSync(lastModifiedCommand, {encoding: 'utf-8'}).trim();

            if (!firstCommitInfo || !lastModifiedInfo) {
                return null;
            }

            const [commitHash, author, createTimeStr] = firstCommitInfo.split('|');
            const [lastCommitHash, lastModifiedTimeStr] = lastModifiedInfo.split('|');

            return {
                commitHash,
                createTime: this.formatDate(createTimeStr),
                lastModifiedTime: this.formatDate(lastModifiedTimeStr),
                lastCommitHash,
            };
        }
        catch (error) {
            console.warn(`Unable to get revision info for ${filePath}:`, error.message);
            return null;
        }
    }

    /**
     * 获取文件的贡献者信息
     * @param {string} filePath 文件路径
     * @returns {Object|null} 贡献者信息对象
     */
    async getContributorsInfo(filePath) {
        if (!this.config.feature?.contributors?.enable) {
            return null;
        }

        try {
            // 获取所有提交用户信息
            const contributorsCommand = `git log --follow --format="%an" -- "${filePath}" | sort | uniq`;
            const contributors = execSync(contributorsCommand, {encoding: 'utf-8'})
                .trim()
                .split('\n')
                .filter(Boolean);

            // 获取每个用户的提交次数
            const contributionStatsCommand = `git log --follow --format="%an" -- "${filePath}" | sort | uniq -c | sort -nr`;
            const contributionStats = execSync(contributionStatsCommand, {encoding: 'utf-8'})
                .trim()
                .split('\n')
                .filter(Boolean)
                .map(line => {
                    const [count, author] = line.trim().split(/\s+(.+)/);
                    return {
                        author,
                        commitCount: parseInt(count, 10)
                    };
                });

            return {
                list: contributors,
                stats: contributionStats
            };
        }
        catch (error) {
            console.warn(`Unable to get contributors info for ${filePath}:`, error.message);
            return null;
        }
    }

    /**
     * 获取文件的完整 Git 信息
     * @param {string} filePath 文件路径
     * @returns {Object|null} Git 信息对象
     */
    async getGitInfo(filePath) {
        try {
            const result = {};

            // 获取修订信息
            const revisionInfo = await this.getRevisionInfo(filePath);
            if (revisionInfo) {
                result.revision = revisionInfo;
            }

            // 获取贡献者信息
            const contributorsInfo = await this.getContributorsInfo(filePath);
            if (contributorsInfo) {
                result.contributors = contributorsInfo;
            }

            return Object.keys(result).length > 0 ? result : null;
        }
        catch (error) {
            console.warn(`Unable to get git info for ${filePath}:`, error.message);
            return null;
        }
    }
}

module.exports = GitInfoProvider;