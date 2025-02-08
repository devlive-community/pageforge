module.exports = function template(item) {
    // 构建样式类
    let classes = ['max-w-full', 'h-auto', 'my-1'];

    // 添加对齐方式的类
    if (item.align) {
        switch (item.align) {
            case 'left':
                classes.push('float-left', 'mr-4');
                break;
            case 'right':
                classes.push('float-right', 'ml-4');
                break;
            case 'center':
                classes.push('mx-auto', 'block');
                break;
        }
    }

    // 构建style属性
    let styles = [];
    if (item.width) {
        styles.push(`width: ${item.width}px`);
    }
    if (item.height) {
        styles.push(`height: ${item.height}px`);
    }

    // 组合HTML属性
    const styleAttr = styles.length > 0 ? ` style="${styles.join(';')}"` : '';
    const classAttr = ` class="${classes.join(' ')}"`;
    const titleAttr = item.title ? ` title="${item.title}"` : '';

    // 返回包含加载状态的img标签
    return `
        <div class="w-full h-full relative">
            <style>
                @keyframes loading-spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .loading-flower {
                    width: 20px;
                    height: 20px;
                    border: 2px solid #e5e7eb;
                    border-top-color: #6b7280;
                    border-radius: 50%;
                    animation: loading-spin 0.8s linear infinite;
                }
                .dark .loading-flower {
                    border-color: #4b5563;
                    border-top-color: #9ca3af;
                }
            </style>
            
            <!-- 加载动画 -->
            <div class="loading-indicator absolute inset-0 flex items-center justify-center">
                <div class="loading-flower"></div>
            </div>
            
            <!-- 图片 -->
            <img src="${item.href}" 
                 alt="${item.alt}"${titleAttr}${styleAttr}${classAttr}
                 style="opacity: 0; ${styles.join(';')}"
                 onload="this.style.opacity = 1; this.previousElementSibling.style.display = 'none'"
                 onerror="this.parentElement.innerHTML = '<div class=\'text-red-500 dark:text-red-400\'>图片加载失败</div>'"
                 class="transition-opacity duration-300 ${classes.join(' ')}"/>
        </div>
    `;
};