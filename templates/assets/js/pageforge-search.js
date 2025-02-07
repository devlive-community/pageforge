const Search = {
    searchIndex: null,
    searchTimeout: null,
    isOpen: false,

    // DOM 元素引用
    els: {},

    // 初始化搜索功能
    init() {
        // 获取 DOM 元素
        this.els.searchTrigger = document.querySelector('#search-trigger');
        this.els.searchDialog = document.querySelector('#search-dialog');
        this.els.searchInput = document.querySelector('#site-search');
        this.els.searchClose = document.querySelector('#search-close');
        this.els.searchResults = document.querySelector('#search-results');

        if (!this.els.searchDialog || !this.els.searchInput || !this.els.searchResults) {
            console.error('Required search elements not found');
            return;
        }

        this.bindEvents();
    },

    // 绑定事件
    bindEvents() {
        // 快捷键监听
        document.addEventListener('keydown', (e) => {
            // ⌘K 或 Ctrl+K 打开搜索
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                this.toggleSearch();
            }

            // ESC 关闭搜索
            if (e.key === 'Escape' && this.isOpen) {
                this.closeSearch();
            }
        });

        // 点击搜索按钮
        if (this.els.searchTrigger) {
            this.els.searchTrigger.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleSearch();
            });
        }

        // 点击关闭按钮
        if (this.els.searchClose) {
            this.els.searchClose.addEventListener('click', () => {
                this.closeSearch();
            });
        }

        // 点击遮罩层关闭
        this.els.searchDialog.addEventListener('click', (e) => {
            if (e.target === this.els.searchDialog) {
                this.closeSearch();
            }
        });

        // 监听搜索输入
        this.els.searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();

            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout);
            }

            if (query.length < 2) {
                this.showEmptyState();
                return;
            }

            this.searchTimeout = setTimeout(() => {
                this.performSearch(query);
            }, 300);
        });
    },

    // 切换搜索弹窗
    toggleSearch() {
        if (!this.isOpen) {
            this.els.searchDialog.classList.remove('hidden');
            this.els.searchDialog.classList.add('flex');
            this.els.searchInput.focus();
            this.isOpen = true;
            document.body.style.overflow = 'hidden';
        }
        else {
            this.closeSearch();
        }
    },

    // 关闭搜索
    closeSearch() {
        this.els.searchDialog.classList.add('hidden');
        this.els.searchDialog.classList.remove('flex');
        this.els.searchInput.value = '';
        this.isOpen = false;
        document.body.style.overflow = '';
        this.showEmptyState();
    },

    // 显示空状态
    showEmptyState() {
        this.els.searchResults.innerHTML = `
            <div class="search-empty-state px-6 py-14 text-center text-sm sm:px-14">
                <svg class="mx-auto h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <p class="mt-4 text-gray-500 dark:text-gray-400">搜索文档内容...</p>
                <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">按 ESC 关闭</p>
            </div>
        `;
    },

    // 加载搜索索引
    async loadSearchIndex() {
        if (this.searchIndex) {
            return;
        }

        try {
            const response = await fetch('/search-index.json');
            this.searchIndex = await response.json();
        }
        catch (error) {
            console.error('Failed to load search index:', error);
        }
    },

    // 高亮文本
    highlightText(text, query) {
        if (!text || !query) {
            return text;
        }

        // 转义正则表达式特殊字符
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedQuery})`, 'gi');

        return text.replace(regex, `<mark class="bg-yellow-200 dark:bg-yellow-800 dark:text-gray-100">$1</mark>`);
    },

    // 获取包含匹配内容的摘要
    getContentExcerpt(content, query, maxLength = 160) {
        if (!content || !query) {
            return content;
        }

        const lowerContent = content.toLowerCase();
        const lowerQuery = query.toLowerCase();
        const matchIndex = lowerContent.indexOf(lowerQuery);

        if (matchIndex === -1) {
            return content.substring(0, maxLength);
        }

        // 确定摘要的起始和结束位置
        let start = Math.max(0, matchIndex - 60);
        let end = Math.min(content.length, matchIndex + 100);

        // 如果摘要不是从开头开始，添加省略号
        let excerpt = (start > 0 ? '...' : '') +
            content.substring(start, end) +
            (end < content.length ? '...' : '');

        return excerpt;
    },

    // 执行搜索
    async performSearch(query) {
        // 确保索引已加载
        await this.loadSearchIndex();
        if (!this.searchIndex) {
            return;
        }

        // 执行搜索
        const results = this.searchIndex
            .filter(item => {
                const titleMatch = item.title.toLowerCase().includes(query.toLowerCase());
                const contentMatch = item.content.toLowerCase().includes(query.toLowerCase());
                return titleMatch || contentMatch;
            })
            .slice(0, 8);

        // 渲染结果
        if (results.length === 0) {
            this.els.searchResults.innerHTML = `
                <div class="px-6 py-14 text-center text-sm sm:px-14">
                    <svg class="mx-auto h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                    <p class="mt-4 text-gray-500 dark:text-gray-400">未找到相关结果</p>
                </div>
            `;
            return;
        }

        this.els.searchResults.innerHTML = `
            <div class="divide-y divide-gray-100 dark:divide-gray-800">
                ${results.map(result => {
            const highlightedTitle = this.highlightText(result.title, query);
            const contentExcerpt = this.getContentExcerpt(result.content, query);
            const highlightedContent = this.highlightText(contentExcerpt, query);

            return `
                        <a href="${result.url}" 
                           class="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                                ${highlightedTitle}
                            </div>
                            <div class="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                ${highlightedContent}
                            </div>
                        </a>
                    `;
        }).join('')}
            </div>
        `;
    }
};

// 初始化搜索
window.addEventListener('load', () => {
    Search.init();
});