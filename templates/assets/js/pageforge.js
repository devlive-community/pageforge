// DOM 工具函数
const DOMUtils = {
    find: (selector, context = document) => context.querySelector(selector),
    findAll: (selector, context = document) => context.querySelectorAll(selector),
    toggleClass: (element, className) => element?.classList.toggle(className)
};

// GitHub Stats 模块
const GitHubStats = {
    formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'm';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num.toString();
    },

    showLoading() {
        if (!this.styleAdded) {
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
            this.styleAdded = true;
        }

        this.updateUI({
            tag: '<div class="skeleton-loader"></div>',
            stars: '<div class="skeleton-loader"></div>',
            forks: '<div class="skeleton-loader"></div>'
        });
    },

    async fetchStats(owner, repo) {
        const cacheKey = `github-stats-${owner}-${repo}`;
        const cachedData = localStorage.getItem(cacheKey);
        const cacheTime = localStorage.getItem(`${cacheKey}-time`);

        this.showLoading();

        if (cachedData && cacheTime && (Date.now() - parseInt(cacheTime)) < 3600000) {
            const stats = JSON.parse(cachedData);
            this.updateUI(stats);
            return stats;
        }

        try {
            const headers = {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'PageForge-Docs'
            };

            const [repoResponse, tagsResponse] = await Promise.all([
                fetch(`https://api.github.com/repos/${owner}/${repo}`, {headers}),
                fetch(`https://api.github.com/repos/${owner}/${repo}/tags`, {headers})
            ]);

            if (!repoResponse.ok || !tagsResponse.ok) throw new Error('GitHub API request failed');

            const [repoData, tagsData] = await Promise.all([
                repoResponse.json(),
                tagsResponse.json()
            ]);

            const stats = {
                stars: this.formatNumber(repoData.stargazers_count || 0),
                forks: this.formatNumber(repoData.forks_count || 0),
                tag: tagsData[0]?.name || '-'
            };

            localStorage.setItem(cacheKey, JSON.stringify(stats));
            localStorage.setItem(`${cacheKey}-time`, Date.now().toString());

            this.updateUI(stats);
            return stats;
        } catch (error) {
            console.error('🤯 获取 GitHub Stats 失败', error);
            const fallbackStats = { stars: '-', forks: '-', tag: '-' };
            this.updateUI(fallbackStats);
            return fallbackStats;
        }
    },

    updateUI(stats) {
        if (!stats) return;

        const { findAll } = DOMUtils;
        const containers = {
            tag: findAll('.tag-container'),
            stars: findAll('.stars-container'),
            forks: findAll('.forks-container')
        };

        const icons = {
            tag: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M1 7.775V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 0 1 0 2.474l-5.026 5.026a1.75 1.75 0 0 1-2.474 0l-6.25-6.25A1.75 1.75 0 0 1 1 7.775Zm1.5 0c0 .066.026.13.073.177l6.25 6.25a.25.25 0 0 0 .354 0l5.025-5.025a.25.25 0 0 0 0-.354l-6.25-6.25a.25.25 0 0 0-.177-.073H2.75a.25.25 0 0 0-.25.25ZM6 5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"></path></svg>',
            stars: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/></svg>',
            forks: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/></svg>'
        };

        Object.entries(containers).forEach(([key, elements]) => {
            elements.forEach(el => {
                el.innerHTML = `${icons[key]} ${stats[key]}`;
            });
        });
    },

    init(owner, repo) {
        if (!owner || !repo) return;
        this.showLoading();
        const updateStats = async () => await this.fetchStats(owner, repo);
        updateStats();
        setInterval(updateStats, 3600000);
    }
};

// 代码复制模块
const CodeCopy = {
    copy(button) {
        const { find, toggleClass } = DOMUtils;
        const codeBlock = find('code', button.closest('div'));
        if (!codeBlock) return;

        navigator.clipboard.writeText(codeBlock.textContent)
            .then(() => {
                const copyIcon = find('.copy-icon', button);
                const checkIcon = find('.check-icon', button);

                toggleClass(copyIcon, '!hidden');
                toggleClass(checkIcon, '!hidden');

                setTimeout(() => {
                    toggleClass(copyIcon, '!hidden');
                    toggleClass(checkIcon, '!hidden');
                }, 800);
            })
            .catch(err => console.error('Failed to copy text:', err));
    }
};

// Header 组件
const Header = {
    DarkMode: {
        observer: null,

        initObserver() {
            if (this.observer) return;

            this.observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.attributeName === 'class') {
                        const isDark = document.documentElement.classList.contains('dark');
                        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
                        localStorage.setItem('theme', isDark ? 'dark' : 'light');
                    }
                });
            });

            this.observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['class']
            });
        },

        init() {
            const isDark = localStorage.theme === 'dark' ||
                (!('theme' in localStorage) &&
                    window.matchMedia('(prefers-color-scheme: dark)').matches);

            const html = document.documentElement;
            if (isDark) {
                html.classList.add('dark');
                html.setAttribute('data-theme', 'dark');
            } else {
                html.classList.remove('dark');
                html.setAttribute('data-theme', 'light');
            }

            window.matchMedia('(prefers-color-scheme: dark)')
                .addEventListener('change', e => {
                    if (!localStorage.theme) {
                        if (e.matches) {
                            html.classList.add('dark');
                            html.setAttribute('data-theme', 'dark');
                        } else {
                            html.classList.remove('dark');
                            html.setAttribute('data-theme', 'light');
                        }
                        this.updateIcons(e.matches);
                    }
                });

            this.initObserver();
            this.updateIcons(isDark);
        },

        // 更新所有主题图标
        updateIcons(isDark) {
            const sunIcons = document.querySelectorAll('[data-theme-toggle] .sun-icon');
            const moonIcons = document.querySelectorAll('[data-theme-toggle] .moon-icon');

            sunIcons.forEach(icon => {
                icon.classList.toggle('hidden', !isDark);
            });

            moonIcons.forEach(icon => {
                icon.classList.toggle('hidden', isDark);
            });
        },

        toggle() {
            const html = document.documentElement;
            const isDark = html.classList.contains('dark');

            html.classList.toggle('dark');
            html.setAttribute('data-theme', isDark ? 'light' : 'dark');

            // 更新图标状态
            this.updateIcons(!isDark);
        }
    },

    MobileMenu: {
        toggle() {
            const menu = document.getElementById('mobile-menu');
            const button = document.querySelector('[data-menu-toggle]');

            if (menu && button) {
                menu.classList.toggle('hidden');
                const menuIcon = button.querySelector('.menu-icon');
                const closeIcon = button.querySelector('.close-icon');
                if (menuIcon && closeIcon) {
                    menuIcon.classList.toggle('hidden');
                    closeIcon.classList.toggle('hidden');
                }
            }
        }
    },

    initEventListeners() {
        // 主题切换按钮
        const themeButtons = document.querySelectorAll('[data-theme-toggle]');
        themeButtons.forEach(button => {
            button.onclick = () => this.DarkMode.toggle();
        });

        // 移动端菜单切换按钮
        const menuButton = document.querySelector('[data-menu-toggle]');
        if (menuButton) {
            menuButton.onclick = () => this.MobileMenu.toggle();
        }
    },

    init() {
        this.DarkMode.init();
        this.initEventListeners();

        const observer = new MutationObserver(() => {
            this.initEventListeners();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
};

// 暴露到全局
window.PageForge = {
    GitHubStats,
    CodeCopy,
    Header
};

// DOM 加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Header.init());
} else {
    Header.init();
}