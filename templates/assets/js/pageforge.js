// DOM 加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.PageForge.Banner.init();
        window.PageForge.Header.init();
        window.PageForge.FontSizeControl.init();
        window.PageForge.TOC.init();
    });
}
else {
    window.PageForge.Banner.init();
    window.PageForge.Header.init();
    window.PageForge.FontSizeControl.init();
}