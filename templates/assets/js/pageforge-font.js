// 字体大小控制
const FontSizeControl = {
    init() {
        const allContent = document.querySelectorAll('.prose *:not(h1):not(.text-3xl)');
        const proseContent = Array.from(allContent).filter(el => !el.closest('.not-prose'));

        if (!proseContent.length) {
            return;
        }

        const sizes = ['text-sm', 'text-base', 'text-lg', 'text-xl'];
        let currentSizeIndex = 1;

        const savedSize = localStorage.getItem('content-font-size');
        if (savedSize) {
            proseContent.forEach(el => {
                el.classList.remove(...sizes);
                el.classList.add(savedSize);
            });
            currentSizeIndex = sizes.indexOf(savedSize);
        }

        const updateFontSize = (newIndex) => {
            if (newIndex >= 0 && newIndex < sizes.length) {
                proseContent.forEach(el => {
                    el.classList.remove(...sizes);
                    el.classList.add(sizes[newIndex]);
                });
                localStorage.setItem('content-font-size', sizes[newIndex]);
                currentSizeIndex = newIndex;
            }
        };

        document.getElementById('increase-font')?.addEventListener('click', () => updateFontSize(currentSizeIndex + 1));
        document.getElementById('decrease-font')?.addEventListener('click', () => updateFontSize(currentSizeIndex - 1));
        document.getElementById('reset-font')?.addEventListener('click', () => updateFontSize(1));
    }
};

window.PageForge = window.PageForge || {};
window.PageForge.FontSizeControl = FontSizeControl;