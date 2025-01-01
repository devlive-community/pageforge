const path = require('path');
const {language} = require("gray-matter");

// 从文件名中提取语言信息
// about.zh-CN.md -> zh-CN
// about.md -> 默认语言
function getFileLanguage(config, filename) {
    const match = filename.match(/\.([a-z]{2}(-[A-Z]{2})?)\.md$/);
    if (!match) {
        return config.i18n?.default || '';
    }
    return match[1];
}

// 获取输出文件名
// about.md -> about.html
// about.zh-CN.md -> about.html
function getOutputFilename(filename) {
    // 先处理可能存在的语言后缀
    let baseName = filename;

    // 如果有语言后缀，先移除 (.en.md, .zh-CN.md)
    const langMatch = baseName.match(/(.+)\.([a-z]{2}(-[A-Z]{2})?)\.md$/);
    if (langMatch) {
        baseName = langMatch[1];
    }

    // 移除 .md 后缀
    baseName = baseName.replace(/\.md$/, '');

    // 返回添加 .html 的文件名
    return `${baseName}.html`;
}

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

// 获取翻译的方法
function getTranslation(config, key, locale) {
    if (!isFeatureEnabled(config, 'i18n')) {
        return key;
    }

    const i18n = config.i18n || {};
    // 如果没有指定语言，使用默认语言
    const currentLocale = locale || i18n.default;

    // 直接从配置中获取对应语言的翻译
    const translations = i18n[currentLocale]?.translations;

    // 返回翻译，如果没有找到则返回原key
    return translations?.[key] || key;
}

// 获取所有配置的语言信息
function getAvailableLocales(config) {
    // 如果国际化功能未启用，返回空数组
    if (!isFeatureEnabled(config, 'i18n')) {
        return [];
    }

    const i18n = config.i18n || {};
    // 过滤掉 default 属性，只返回语言配置
    return Object.entries(i18n)
        .filter(([key]) => key !== 'default')
        .map(([key, value]) => ({
            key,                    // 语言代码 如 'en', 'zh-CN'
            name: value.name,       // 语言名称
            flag: value.flag        // 语言图标
        }));
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

// 递归转换导航
function transformNavigation(navigation, pages, config, language) {
    const processItem = (item) => {
        // 如果是字符串类型的链接（如 "/docs/get-started"）
        if (typeof item === 'string') {
            // 直接使用原始 URL 作为 href
            const pageData = pages.get(item);
            if (pageData) {
                const title = pageData.title
                    ? getTranslation(config, pageData.title, language)
                    : pageData.title;

                return {
                    ...pageData,
                    title,
                    href: appendHtml(item, config, language)
                };
            }
            // 如果在 pages 中找不到，使用路径最后一段作为标题
            return {
                title: item.split('/').pop(),
                href: appendHtml(item.replace(/\.(md|html)$/, ''), config, language)
            };
        }

        // 如果是对象（有子项的导航）
        if (typeof item === 'object') {
            const [[title, items]] = Object.entries(item);
            const translatedTitle = title ? getTranslation(config, title, language) : title;

            return {
                title: translatedTitle,
                href: appendHtml(items[0], config, language),
                items: Array.isArray(items) ? items.map(processItem) : []
            };
        }

        return item;
    };

    return navigation.map(processItem);
}

module.exports = {
    getFileLanguage,
    getOutputFilename,
    getPagePath,
    isFeatureEnabled,
    getTranslation,
    getAvailableLocales,
    appendHtml,
    getRelativeBasePath,
    transformNavigation
}