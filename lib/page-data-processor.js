const {getPagePath, appendHtml, getRelativeBasePath} = require("./utils");

class PageDataProcessor {
    constructor(config, pages) {
        this.config = config;
        this.pages = pages;
    }

    /**
     * 构建基础页面数据
     * @param {Object} metadata - 页面元数据
     * @param {string} content - 页面内容
     * @param {string} relativePath - 相对路径
     * @param {string} locale - 语言代码
     * @param {Object} gitInfo - Git信息
     * @param readingTime - 阅读时间
     * @returns {Object} 处理后的页面数据
     */
    buildBasePageData(metadata, content, relativePath, locale, gitInfo, readingTime) {
        const forwardPath = this.getPath(relativePath, locale);

        return {
            pageData: {
                config: metadata.config,
                toc: metadata.toc,
                content: content,
                basePath: getRelativeBasePath(relativePath),
                layout: metadata.layout || 'layouts/content',
                version: this.config.version,
                gitInfo,
                ...metadata,
                ...forwardPath,
                readingTime
            },
            siteData: {
                nav: this.config.nav,
                ...this.config
            }
        };
    }

    /**
     * 构建布局页面数据
     * @param {Object} metadata - 页面元数据
     * @param {string} locale - 语言代码
     * @returns {Object} 处理后的布局页面数据
     */
    buildLayoutPageData(metadata, locale) {
        return {
            pageData: {
                config: metadata.config,
                basePath: getRelativeBasePath('/'),
                ...metadata
            },
            siteData: {
                nav: this.config.nav,
                ...this.config
            }
        };
    }

    /**
     * 获取页面路径信息
     * @private
     */
    getPath(relativePath, locale) {
        const pagePath = getPagePath(relativePath);
        const localPath = appendHtml(pagePath, this.config, locale);
        const noLocalePath = this.config.feature?.i18n?.enable
            ? localPath.replace(`/${locale}`, '')
            : localPath;

        return {
            localPath,
            noLocalePath,
            relativePath: relativePath.replace(locale, '')
        };
    }
}

module.exports = PageDataProcessor;