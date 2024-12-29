const https = require('https');

class GitHubStats {
    constructor(token = null) {
        this.token = token; // GitHub Personal Access Token (可选，但建议使用以避免API限制)
    }

    async getRepoStats(owner, repo) {
        const result = {
            latestTag: '-',
            stars: 0,
            forks: 0
        };

        try {
            // 获取仓库基本信息
            const repoData = await this._makeRequest(`/repos/${owner}/${repo}`);
            if (repoData) {
                result.stars = this.formatNumber(repoData.stargazers_count) || 0;
                result.forks = this.formatNumber(repoData.forks_count) || 0;
            }

            // 获取最新tag
            const tagsData = await this._makeRequest(`/repos/${owner}/${repo}/tags`);
            if (tagsData && tagsData.length > 0) {
                result.latestTag = tagsData[0].name;
            }
        }
        catch (error) {
            console.error('Error fetching repo stats:', error.message);
        }

        return result;
    }

    async _makeRequest(path) {
        const options = {
            hostname: 'api.github.com',
            path: path,
            method: 'GET',
            headers: {
                'User-Agent': 'GitHub-Repo-Stats',
                'Accept': 'application/vnd.github.v3+json'
            }
        };

        if (this.token) {
            options.headers['Authorization'] = `token ${this.token}`;
        }

        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    if (res.statusCode === 200) {
                        try {
                            resolve(JSON.parse(data));
                        }
                        catch (error) {
                            reject(new Error('Failed to parse response'));
                        }
                    }
                    else {
                        resolve(null);
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            req.end();
        });
    }

    // 将数字转换为带k/m格式的字符串
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'm';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    }
}

module.exports = GitHubStats;