module.exports = function template(item) {
    const baseStyles = "inline-flex items-center justify-center px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors";
    const defaultStyles = "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";

    // 判断按钮类型：无链接、外部链接、内部链接
    const hasLink = item.link && item.link.length > 0;
    const isExternalLink = hasLink && (item.link.startsWith('http') || item.link.startsWith('https'));
    const userStyles = item.className || defaultStyles;

    // 根据不同类型返回不同的标签和属性
    if (!hasLink) {
        // 无链接时使用普通按钮
        return `
            <button class="${baseStyles} ${userStyles}">
                <span class="inline-flex items-center">
                    ${item.text}
                </span>
            </button>
        `;
    }
    else if (isExternalLink) {
        // 外部链接
        return `
            <a href="${item.link}"
                target="_blank"
                rel="noopener noreferrer"
                class="${baseStyles} ${userStyles}">
                <span class="inline-flex items-center">
                    ${item.text}
                    <svg class="ml-2 h-4 w-4" 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20" 
                        fill="currentColor">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                </span>
            </a>
        `;
    }
    else {
        // 内部链接
        return `
            <a href="${item.link}"
                class="${baseStyles} ${userStyles}">
                <span class="inline-flex items-center">
                    ${item.text}
                </span>
            </a>
        `;
    }
};