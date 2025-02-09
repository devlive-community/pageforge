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
        return this.config.i18n?.default || '';
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
     * 构建国际化相关的页面数据
     */
    buildI18nPageData(pageData, metadata, locale, navigation) {
        const translatedTitle = metadata.title
            ? this.getTranslation(metadata.title, locale)
            : metadata.title;

        pageData.pageData.title = translatedTitle;
        pageData.pageData.language = locale;
        pageData.siteData.languages = this.getAvailableLocales();

        // 使用传入的导航数据
        if (navigation) {
            pageData.siteData.nav = navigation;
        }

        return pageData;
    }
}

module.exports = I18nProcessor;