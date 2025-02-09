const I18nProcessor = require('./i18n-processor');
const {transformNavigation} = require("./utils");

class NavigationProcessor {
    constructor(config, pages) {
        this.config = config;
        this.pages = pages;
        this.navigationCache = new Map();
        this.i18nProcessor = new I18nProcessor(config, pages);
    }

    /**
     * 获取缓存的导航数据
     */
    getCachedNavigation(locale) {
        if (!this.navigationCache.has(locale)) {
            const navData = this.transformNavigation(this.config.nav, locale);
            this.navigationCache.set(locale, navData);
        }
        return this.navigationCache.get(locale);
    }

    /**
     * 转换导航数据，处理国际化
     */
    transformNavigation(navigation, locale) {
        if (!navigation) {
            return [];
        }

        const processItem = (item) => {
            if (typeof item === 'string') {
                const pageData = this.getLocalizedPage(item, locale);
                if (pageData) {
                    const title = pageData.title
                        ? this.i18nProcessor.getTranslation(pageData.title, locale)
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
                    title: this.i18nProcessor.getTranslation(title, locale),
                    href: this.appendHtml(items[0], locale),
                    items: Array.isArray(items) ? items.map(processItem) : []
                };
            }

            return item;
        };

        return navigation.map(processItem);
    }

    /**
     * 获取本地化的页面数据
     */
    getLocalizedPage(pagePath, locale) {
        const normalizedPath = pagePath.replace(/\.(md|html)$/, '');

        if (this.i18nProcessor.isEnabled() && locale !== this.i18nProcessor.getDefaultLocale()) {
            const localePath = `${normalizedPath}.${locale}`;
            const localizedData = this.pages.get(localePath);
            if (localizedData) {
                return localizedData;
            }
        }

        return this.pages.get(normalizedPath);
    }

    /**
     * 附加 HTML 扩展名并处理语言路径
     */
    appendHtml(pathStr, locale) {
        if (typeof pathStr === 'string') {
            if (this.i18nProcessor.isEnabled()) {
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
     * 清除导航缓存
     */
    clearCache() {
        this.navigationCache.clear();
    }
}

module.exports = NavigationProcessor;