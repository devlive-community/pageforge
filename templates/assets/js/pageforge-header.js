// Header 组件
const Header = {
    DarkMode: {
        observer: null,

        initObserver() {
            if (this.observer) {
                return;
            }

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
            }
            else {
                html.classList.remove('dark');
                html.setAttribute('data-theme', 'light');
            }

            window.matchMedia('(prefers-color-scheme: dark)')
                .addEventListener('change', e => {
                    if (!localStorage.theme) {
                        if (e.matches) {
                            html.classList.add('dark');
                            html.setAttribute('data-theme', 'dark');
                        }
                        else {
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

window.PageForge = window.PageForge || {};
window.PageForge.Header = Header;