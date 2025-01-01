// GitHub Stats 模块
const GitHubStats = {
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'm';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    },

    // 显示加载状态的辅助方法
    showLoading() {
        const loadingHTML = `
            <div class="stats-loading">
                <div class="tag-container">
                    <div class="skeleton-loader"></div>
                </div>
                <div class="stars-container">
                    <div class="skeleton-loader"></div>
                </div>
                <div class="forks-container">
                    <div class="skeleton-loader"></div>
                </div>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            .skeleton-loader {
                width: 60px;
                height: 16px;
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: loading 1.5s infinite;
                border-radius: 4px;
            }
            @keyframes loading {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
        `;
        document.head.appendChild(style);

        // 更新所有容器为加载状态
        ['.tag-container', '.stars-container', '.forks-container'].forEach(selector => {
            const containers = document.querySelectorAll(selector);
            containers.forEach(container => {
                container.innerHTML = '<div class="skeleton-loader"></div>';
            });
        });
    },

    async fetchStats(owner, repo) {
        const cacheKey = `github-stats-${owner}-${repo}`;
        const cachedData = localStorage.getItem(cacheKey);
        const cacheTime = localStorage.getItem(`${cacheKey}-time`);

        // 显示加载状态
        this.showLoading();

        if (cachedData && cacheTime && (Date.now() - parseInt(cacheTime)) < 3600000) {
            const stats = JSON.parse(cachedData);
            this.updateUI(stats);
            return stats;
        }

        const headers = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'PageForge-Docs'
        };

        try {
            const [repoResponse, tagsResponse] = await Promise.all([
                fetch(`https://api.github.com/repos/${owner}/${repo}`, {headers}),
                fetch(`https://api.github.com/repos/${owner}/${repo}/tags`, {headers})
            ]);

            if (!repoResponse.ok || !tagsResponse.ok) {
                throw new Error('GitHub API request failed');
            }

            const repoData = await repoResponse.json();
            const tagsData = await tagsResponse.json();

            const stats = {
                stars: this.formatNumber(repoData.stargazers_count || 0),
                forks: this.formatNumber(repoData.forks_count || 0),
                tag: tagsData[0]?.name || '-'
            };

            localStorage.setItem(cacheKey, JSON.stringify(stats));
            localStorage.setItem(`${cacheKey}-time`, Date.now().toString());

            this.updateUI(stats);
            return stats;
        }
        catch (error) {
            console.error('🤯 获取 GitHub Stats 失败', error);
            const fallbackStats = {
                stars: '-',
                forks: '-',
                tag: '-'
            };
            this.updateUI(fallbackStats);
            return fallbackStats;
        }
    },

    updateUI(stats) {
        if (!stats) {
            return;
        }

        // 修改为更新所有匹配的容器
        const tagContainers = document.querySelectorAll('.tag-container');
        const starsContainers = document.querySelectorAll('.stars-container');
        const forksContainers = document.querySelectorAll('.forks-container');

        tagContainers.forEach(container => {
            container.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
            <path d="M1 7.775V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 0 1 0 2.474l-5.026 5.026a1.75 1.75 0 0 1-2.474 0l-6.25-6.25A1.75 1.75 0 0 1 1 7.775Zm1.5 0c0 .066.026.13.073.177l6.25 6.25a.25.25 0 0 0 .354 0l5.025-5.025a.25.25 0 0 0 0-.354l-6.25-6.25a.25.25 0 0 0-.177-.073H2.75a.25.25 0 0 0-.25.25ZM6 5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"></path>
        </svg>
        ${stats.tag}`;
        });

        starsContainers.forEach(container => {
            container.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
            <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/>
        </svg>
        ${stats.stars}`;
        });

        forksContainers.forEach(container => {
            container.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
            <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/>
        </svg>
        ${stats.forks}`;
        });
    },

    init(owner, repo) {
        if (!owner || !repo) {
            return;
        }

        // 立即显示加载状态
        this.showLoading();

        const updateStats = async () => {
            await this.fetchStats(owner, repo);
        };

        // 初始更新
        updateStats();

        // 每小时更新一次
        setInterval(updateStats, 3600000);
    }
};

// 暴露到全局
window.PageForge = window.PageForge || {};
window.PageForge.GitHubStats = GitHubStats;