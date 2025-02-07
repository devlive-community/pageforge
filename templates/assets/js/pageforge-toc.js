// TOC 模块
const TOC = {
    init() {
        // 添加样式
        if (!document.getElementById('toc-styles')) {
            const style = document.createElement('style');
            style.id = 'toc-styles';
            style.textContent = `
                .toc-link.active-toc-item {
                    background-color: rgb(239 246 255);
                    color: rgb(37 99 235);
                    position: relative;
                }
                .dark .toc-link.active-toc-item {
                    background-color: rgba(30 58 138 / 0.2);
                    color: rgb(96 165 250);
                }
                .toc-link.active-toc-item::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 3px;
                    height: 16px;
                    background-color: rgb(37 99 235);
                    border-top-right-radius: 2px;
                    border-bottom-right-radius: 2px;
                }
                .dark .toc-link.active-toc-item::before {
                    background-color: rgb(96 165 250);
                }
            `;
            document.head.appendChild(style);
        }

        // 获取所有 TOC 链接
        const tocLinks = document.querySelectorAll('.toc-link');

        // 处理点击事件
        tocLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                // 移除所有活跃状态
                tocLinks.forEach(l => l.classList.remove('active-toc-item'));

                // 添加当前项的活跃状态
                link.classList.add('active-toc-item');

                // 获取目标元素和滚动位置
                const targetId = link.getAttribute('data-slug');
                const target = document.getElementById(targetId);
                const header = document.querySelector('header nav');
                const offset = header ? header.offsetHeight + 10 : 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

                // 滚动到目标位置
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // 如果是移动端，关闭 TOC 面板
                const tocMobile = document.getElementById('toc-mobile');
                if (tocMobile) {
                    tocMobile.classList.add('translate-y-full');
                }
            });
        });

        // 监听滚动，更新当前活跃项
        const updateActiveItem = () => {
            const header = document.querySelector('header nav');
            const headerHeight = header ? header.offsetHeight : 0;

            // 查找所有带 slug 的容器
            const headings = Array.from(document.querySelectorAll('[id].inline-flex'));

            // 找到当前视窗中最靠上的标题
            let current = null;
            let minDistance = Infinity;

            headings.forEach(heading => {
                const rect = heading.getBoundingClientRect();
                const top = rect.top - headerHeight - 20;

                // 计算到视窗顶部的距离
                const distance = Math.abs(top);

                // 如果元素在视窗上方或接近顶部，且距离比当前最小距离更小
                if (top <= 10 && distance < minDistance) {
                    minDistance = distance;
                    current = heading;
                }
            });

            // 更新 TOC 活跃状态
            if (current) {
                const slug = current.id;
                const tocLinks = document.querySelectorAll('.toc-link');

                tocLinks.forEach(link => {
                    if (link.getAttribute('data-slug') === slug) {
                        link.classList.add('active-toc-item');

                        // 确保活跃项在滚动区域内可见
                        const nav = link.closest('.overflow-y-auto');
                        if (nav) {
                            const navRect = nav.getBoundingClientRect();
                            const linkRect = link.getBoundingClientRect();

                            if (linkRect.top < navRect.top || linkRect.bottom > navRect.bottom) {
                                link.scrollIntoView({behavior: 'smooth', block: 'center'});
                            }
                        }
                    }
                    else {
                        link.classList.remove('active-toc-item');
                    }
                });
            }
        };

        // 使用 IntersectionObserver 来优化滚动监听
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(() => {
                requestAnimationFrame(updateActiveItem);
            });
        }, {
            rootMargin: '-20% 0px -80% 0px',
            threshold: [0, 1]
        });

        // 观察所有标题元素
        document.querySelectorAll('[id].inline-flex').forEach(heading => {
            observer.observe(heading);
        });

        // 仍然保留滚动监听作为备份
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                window.cancelAnimationFrame(scrollTimeout);
            }
            scrollTimeout = window.requestAnimationFrame(updateActiveItem);
        }, {passive: true});

        // 初始调用一次
        updateActiveItem();
    }
};

window.PageForge = window.PageForge || {};
window.PageForge.TOC = TOC;