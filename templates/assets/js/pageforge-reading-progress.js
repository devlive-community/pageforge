/**
 * 初始化高级阅读进度条
 * 包含顶部进度条和悬浮百分比显示
 */
function initAdvancedReadingProgress() {
    // 创建容器元素
    const progressContainer = document.createElement('div');
    progressContainer.id = 'reading-progress-container';

    // 创建进度条元素
    const progressBar = document.createElement('div');
    progressBar.id = 'reading-progress-bar';

    // 创建百分比显示元素
    const progressIndicator = document.createElement('div');
    progressIndicator.id = 'reading-progress-indicator';
    progressIndicator.className = 'fixed right-4 bottom-4 bg-gray-800 dark:bg-gray-700 text-white px-3 py-2 rounded-full text-sm font-medium opacity-80 hover:opacity-100 transition-opacity';
    progressIndicator.innerHTML = '0%';

    // 添加元素到页面
    progressContainer.appendChild(progressBar);
    document.body.appendChild(progressContainer);
    document.body.appendChild(progressIndicator);

    // 获取内容元素 - 假设文章内容在 .article-content 类的元素中
    const contentElement = document.querySelector('.article-content') || document.querySelector('main') || document.body;

    // 存储原始标题
    const originalTitle = document.title;

    // 计算内容区域的位置和高度
    const getContentHeight = () => {
        const contentRect = contentElement.getBoundingClientRect();
        const contentTop = contentRect.top + window.scrollY;
        const contentHeight = contentRect.height;

        // 考虑到页脚和其他元素的高度，我们通常只计算到页面底部前的一部分
        const visibleContentHeight = contentHeight - window.innerHeight;

        return {
            start: contentTop,
            height: visibleContentHeight
        };
    };

    // 创建节流函数以减少更新频率
    function throttle(callback, limit) {
        let waiting = false;
        return function () {
            if (!waiting) {
                callback.apply(this, arguments);
                waiting = true;
                setTimeout(function () {
                    waiting = false;
                }, limit);
            }
        };
    }

    // 更新进度条和指示器
    function updateProgress() {
        const content = getContentHeight();
        const scrolled = window.scrollY - content.start;

        // 计算阅读进度百分比
        let progressPercent = 0;
        if (scrolled > 0) {
            progressPercent = Math.min(100, Math.max(0, (scrolled / content.height) * 100));
        }

        // 舍入到整数用于显示
        const displayPercent = Math.round(progressPercent);

        // 更新进度条宽度
        progressBar.style.width = `${progressPercent}%`;

        // 更新百分比指示器
        progressIndicator.textContent = `${displayPercent}%`;

        // 根据进度显示或隐藏指示器
        if (displayPercent > 0 && displayPercent < 100) {
            progressIndicator.classList.remove('hidden');
        }
        else {
            progressIndicator.classList.add('hidden');
        }
    }

    // 使用节流函数减少更新频率，每100毫秒更新一次
    const throttledUpdateProgress = throttle(updateProgress, 100);

    // 添加事件监听器
    window.addEventListener('scroll', throttledUpdateProgress, {passive: true});
    window.addEventListener('resize', throttledUpdateProgress, {passive: true});

    // 初始调用一次以设置初始状态
    updateProgress();

    // 点击百分比指示器时滚动到顶部
    progressIndicator.addEventListener('click', function () {
        window.scrollTo({top: 0, behavior: 'smooth'});
    });
}

// 当页面加载完成后初始化进度条
if (document.readyState === 'complete') {
    initAdvancedReadingProgress();
}
else {
    window.addEventListener('load', initAdvancedReadingProgress);
}