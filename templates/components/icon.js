module.exports = function template(item) {
    // 确保图标名称是小写的
    const iconName = item.iconName.toLowerCase();

    // 默认的样式类
    const baseStyles = "inline-flex items-center justify-center relative top-[3px]";

    // 骨架屏样式 - 支持明暗模式
    const skeletonStyles = "absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded";

    return `
        <span class="${baseStyles}" style="width: ${item.size}px; height: ${item.size}px;">
            <span class="${skeletonStyles}"></span>
            <i data-lucide="${iconName}"
                class="relative"
                style="width: ${item.size}px; height: ${item.size}px; color: ${item.color};">
            </i>
        </span>
    `;
};