module.exports = function template(item) {
    // 基础样式：仅应用于容器
    const baseContainerStyles = "inline-flex items-center";

    // 解析开关状态
    const isChecked = item.state === true;

    // 用户提供的所有样式类
    const allUserStyles = item.className || "";

    // 分离颜色相关类和其他样式类
    const bgColorRegex = /\bbg-[a-z]+-[0-9]+\b/g;
    const borderColorRegex = /\bborder-[a-z]+-[0-9]+\b/g;

    // 提取用户定义的背景色和边框色
    const userBgColors = allUserStyles.match(bgColorRegex) || [];
    const userBorderColors = allUserStyles.match(borderColorRegex) || [];

    // 将颜色类从用户样式中移除，剩下的应用于label
    let remainingUserStyles = allUserStyles;

    // 移除背景色类
    userBgColors.forEach(bgClass => {
        remainingUserStyles = remainingUserStyles.replace(bgClass, '');
    });

    // 移除边框色类
    userBorderColors.forEach(borderClass => {
        remainingUserStyles = remainingUserStyles.replace(borderClass, '');
    });

    // 整理样式，移除多余空格
    remainingUserStyles = remainingUserStyles.replace(/\s+/g, ' ').trim();

    // 轨道默认样式
    const defaultTrackOnStyles = "bg-blue-600 border-blue-600";
    const defaultTrackOffStyles = "bg-gray-200 border-gray-200";

    // 合并用户定义的颜色到轨道样式
    let trackOnStyles = defaultTrackOnStyles;
    let trackOffStyles = defaultTrackOffStyles;

    // 应用用户定义的背景色（如果有）
    if (userBgColors.length > 0) {
        trackOnStyles = trackOnStyles.replace(/\bbg-[a-z]+-[0-9]+\b/, userBgColors[0]);
    }

    // 应用用户定义的边框色（如果有）
    if (userBorderColors.length > 0) {
        trackOnStyles = trackOnStyles.replace(/\bborder-[a-z]+-[0-9]+\b/, userBorderColors[0]);
    }

    // 最终的轨道样式
    const trackStyles = isChecked ? trackOnStyles : trackOffStyles;

    // 开关按钮样式
    const toggleStyles = isChecked
        ? "translate-x-4 bg-white"
        : "translate-x-0 bg-white";

    // 焦点样式，应用于label
    const focusStyles = "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";

    // 生成唯一ID
    const switchId = `switch-${Math.random().toString(36).substring(2, 10)}`;

    return `
        <div class="${baseContainerStyles}">
            <label for="${switchId}" class="flex items-center cursor-pointer ${focusStyles} ${remainingUserStyles}">
                <div class="relative">
                    <input type="checkbox" id="${switchId}" class="sr-only" ${isChecked ? 'checked' : ''}>
                    <div class="block w-10 h-6 rounded-full border-2 transition ${trackStyles}"></div>
                    <div class="dot absolute left-1 top-1 w-4 h-4 rounded-full transition-transform ${toggleStyles}"></div>
                </div>
                ${item.text ? `<span class="ml-3 text-sm font-medium">${item.text}</span>` : ''}
            </label>
        </div>
    `;
};