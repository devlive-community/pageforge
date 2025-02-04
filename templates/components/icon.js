module.exports = function template(item) {
    // 确保图标名称是小写的
    const iconName = item.iconName.toLowerCase();

    // 默认的样式类
    const baseStyles = "inline-flex items-center justify-center";

    return `
        <span class="${baseStyles}">
            <i data-lucide="${iconName}"
                style="width: ${item.size}px; height: ${item.size}px; color: ${item.color};">
            </i>
        </span>
    `;
};