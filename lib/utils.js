const path = require('path');

// 获取页面路径（用于侧边栏激活状态判断）
function getPagePath(relativePath) {
    // 移除 .md 或 .html 扩展名
    const pathWithoutExt = relativePath.replace(/\.(md|html)$/, '');

    // 如果是 index 文件，特殊处理
    const normalizedPath = pathWithoutExt === 'index' ? '' : pathWithoutExt;

    // 转换为 URL 风格的路径（使用正斜杠）
    const urlPath = normalizedPath.split(path.sep).join('/');

    // 确保路径以 / 开头
    return urlPath.startsWith('/') ? urlPath : `/${urlPath}`;
}

// 判断特定功能是否启用
function isFeatureEnabled(config, featureName) {
    return config.feature?.[featureName]?.enable === true;
}

function isDraftMode(config) {
    return config.drafts === true || config.feature?.draft?.enable === true;
}

function appendHtml(path, config, locale) {
    // 如果是字符串，替换 .md 为 .html
    if (typeof path === 'string') {
        if (isFeatureEnabled(config, 'i18n')) {
            path = path.replace(`.${locale}`, '');
        }

        return path.endsWith('.md')
            ? path.replace('.md', '.html')  // 如果以 .md 结尾，替换为 .html
            : path.endsWith('.html')        // 如果已经是 .html 结尾，保持不变
                ? path
                : `${path}.html`;           // 其他情况，添加 .html
    }

    // 如果是数组，处理第一个元素
    if (Array.isArray(path)) {
        path = path[0];
        if (isFeatureEnabled(config, 'i18n')) {
            path = path.replace(`.${locale}`, '');
        }
        return appendHtml(path, config, locale);
    }

    // 如果是对象，处理第一个值
    if (typeof path === 'object' && path !== null) {
        const firstKey = Object.keys(path)[0];
        path = path[firstKey];
        if (isFeatureEnabled(config, 'i18n')) {
            path = path.replace(`.${locale}`, '');
        }
        return appendHtml(path, config, locale);
    }

    return path;
}

// 计算相对于根目录的路径
function getRelativeBasePath(baseDir) {
    if (!baseDir) {
        return '.';
    }
    const depth = baseDir.split(path.sep).length;
    return Array(depth).fill('..').join('/') || '.';
}

module.exports = {
    getPagePath,
    isFeatureEnabled,
    isDraftMode,
    appendHtml,
    getRelativeBasePath
}