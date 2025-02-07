// Banner 和 Header 高度管理模块
const Banner = {
    updateHeaderHeight() {
        requestAnimationFrame(() => {
            const header = DOMUtils.find('header nav');
            if (header) {
                const height = header.offsetHeight;
                document.documentElement.style.setProperty('--header-height', height + 'px');

                // 更新 sidebar 和 toc 的 top 位置
                const sidebar = DOMUtils.find('#sidebar-menu nav');
                const toc = DOMUtils.find('#toc-container nav');

                if (sidebar) {
                    // 更新 sidebar 的 top 位置
                    sidebar.style.top = `calc(var(--header-height) + 1rem)`;
                }

                if (toc) {
                    // 更新 toc 的 top 位置
                    toc.style.top = `calc(var(--header-height) + 1rem)`;
                }
            }
        });
    },

    close(button) {
        const banner = button.closest('[data-banner]');
        if (!banner) {
            return;
        }

        // 移除之前的监听器
        if (window._bannerObserver) {
            window._bannerObserver.disconnect();
        }

        // 添加过渡效果
        banner.style.transition = 'height 0.2s ease-out, opacity 0.2s ease-out';
        banner.style.height = banner.offsetHeight + 'px';
        banner.style.opacity = '1';

        // 强制重绘
        banner.offsetHeight;

        // 开始动画
        banner.style.height = '0';
        banner.style.opacity = '0';
        banner.style.overflow = 'hidden';

        // 动画结束后移除元素并更新高度
        banner.addEventListener('transitionend', function handler() {
            banner.remove();
            Banner.updateHeaderHeight();
            banner.removeEventListener('transitionend', handler);
        });
    },

    init() {
        // 初始化 header 高度
        this.updateHeaderHeight();

        // 监听窗口大小变化
        window.addEventListener('resize', () => this.updateHeaderHeight());

        // 监听 banner 的变化
        const banner = DOMUtils.find('[data-banner]');
        if (banner) {
            window._bannerObserver = new MutationObserver(() => this.updateHeaderHeight());
            window._bannerObserver.observe(banner, {
                attributes: true,
                childList: true,
                subtree: true,
                characterData: true
            });

            // 绑定关闭按钮事件
            const closeButton = DOMUtils.find('[data-banner-close]', banner);
            if (closeButton) {
                closeButton.addEventListener('click', () => this.close(closeButton));
            }
        }
    }
};

window.PageForge = window.PageForge || {};
window.PageForge.Banner = Banner;