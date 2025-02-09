// i18n-processor.js
const path = require('path');

class I18nProcessor {
    constructor(config, pages) {
        this.config = config;
        this.pages = pages;
        this.navigationCache = new Map();
    }

    /**
     * 检查国际化功能是否启用
     */
    isEnabled() {
        return this.config.feature?.i18n?.enable === true;
    }

    /**
     * 获取默认语言
     */
    getDefaultLocale() {
        return this.config.feature?.i18n?.default || '';
    }

    /**
     * 获取可用的语言列表
     */
    getAvailableLocales() {
        // 如果国际化功能未启用，返回空数组
        if (!this.isEnabled()) {
            return [];
        }

        const i18n = this.config.i18n || {};
        // 过滤掉 default 属性，只返回语言配置
        return Object.entries(i18n)
            .filter(([key]) => key !== 'default')
            .map(([key, value]) => ({
                key,                    // 语言代码 如 'en', 'zh-CN'
                name: value.name,       // 语言名称
                flag: value.flag        // 语言图标
            }));
    }

    /**
     * 获取文件的语言信息
     * @param {string} filename - 文件名
     * @returns {string} 语言代码
     */
    getFileLanguage(filename) {
        const match = filename.match(/\.([a-z]{2}(-[A-Z]{2})?)\.md$/);
        if (!match) {
            return this.getDefaultLocale();
        }
        return match[1];
    }

    /**
     * 获取翻译
     * @param {string} key - 翻译键
     * @param {string} locale - 语言代码
     */
    getTranslation(key, locale) {
        if (!this.isEnabled() || !key) {
            return key;
        }

        const translations = this.config.i18n?.[locale]?.translations;
        return translations?.[key] || key;
    }

    /**
     * 获取输出文件名（移除语言后缀）
     */
    getOutputFilename(filename) {
        let baseName = filename;
        const langMatch = baseName.match(/(.+)\.([a-z]{2}(-[A-Z]{2})?)\.md$/);

        if (langMatch) {
            baseName = langMatch[1];
        }

        return `${baseName.replace(/\.md$/, '')}.html`;
    }

    /**
     * 附加 HTML 扩展名并处理语言路径
     */
    appendHtml(pathStr, locale) {
        if (typeof pathStr === 'string') {
            if (this.isEnabled()) {
                pathStr = pathStr.replace(`.${locale}`, '');
            }

            return pathStr.endsWith('.md')
                ? pathStr.replace('.md', '.html')
                : pathStr.endsWith('.html')
                    ? pathStr
                    : `${pathStr}.html`;
        }

        if (Array.isArray(pathStr)) {
            return this.appendHtml(pathStr[0], locale);
        }

        if (typeof pathStr === 'object' && pathStr !== null) {
            const firstKey = Object.keys(pathStr)[0];
            return this.appendHtml(pathStr[firstKey], locale);
        }

        return pathStr;
    }

    /**
     * 转换导航数据，处理国际化
     */
    transformNavigation(navigation, locale) {
        if (this.navigationCache.has(locale)) {
            return this.navigationCache.get(locale);
        }

        const processItem = (item) => {
            if (typeof item === 'string') {
                const pageData = this.getLocalizedPage(item, locale);
                if (pageData) {
                    const title = pageData.title
                        ? this.getTranslation(pageData.title, locale)
                        : pageData.title;

                    return {
                        ...pageData,
                        title,
                        href: this.appendHtml(item, locale)
                    };
                }
                return {
                    title: item.split('/').pop(),
                    href: this.appendHtml(item, locale)
                };
            }

            if (typeof item === 'object') {
                const [[title, items]] = Object.entries(item);
                return {
                    title: this.getTranslation(title, locale),
                    href: this.appendHtml(items[0], locale),
                    items: Array.isArray(items) ? items.map(processItem) : []
                };
            }

            return item;
        };

        const transformed = navigation.map(processItem);
        this.navigationCache.set(locale, transformed);
        return transformed;
    }

    /**
     * 获取本地化的页面数据
     */
    getLocalizedPage(pagePath, locale) {
        const normalizedPath = pagePath.replace(/\.(md|html)$/, '');

        if (this.isEnabled() && locale !== this.getDefaultLocale()) {
            const localePath = `${normalizedPath}.${locale}`;
            const localizedData = this.pages.get(localePath);
            if (localizedData) {
                return localizedData;
            }
        }

        return this.pages.get(normalizedPath);
    }

    /**
     * 构建国际化相关的页面数据
     */
    buildI18nPageData(pageData, metadata, locale) {
        // 处理标题翻译
        const translatedTitle = metadata.title
            ? this.getTranslation(metadata.title, locale)
            : metadata.title;

        // 更新页面数据
        pageData.pageData.title = translatedTitle;
        pageData.pageData.language = locale;

        // 添加语言列表
        pageData.siteData.languages = this.getAvailableLocales();

        // 处理导航数据
        if (pageData.siteData.nav) {
            pageData.siteData.nav = this.transformNavigation(pageData.siteData.nav, locale);
        }

        return pageData;
    }
}

module.exports = I18nProcessor;