const fs = require('fs');
const path = require('path');
const {isFeatureEnabled} = require('./utils');

class SitemapGenerator {
    constructor(config, pages, getNavigation) {
        this.config = config;
        this.pages = pages;
        this.getNavigation = getNavigation;
        this.baseUrl = config?.site?.baseUrl || '';
    }

    // 获取语言代码
    getLanguageCode(lang) {
        return typeof lang === 'object' ? lang.key : lang;
    }

    // 生成单个 URL 节点
    generateUrlNode(url, lang, metadata) {
        const langCode = this.getLanguageCode(lang);
        const normalizedUrl = url.startsWith('/') ? url.substring(1) : url;
        const fullUrl = `${langCode}/${normalizedUrl}`;

        return `    <url>
        <loc>${this.baseUrl}/${fullUrl}</loc>${metadata?.gitInfo?.revision?.lastModifiedTime ? `
        <lastmod>${metadata.gitInfo.revision.lastModifiedTime}</lastmod>` : ''}
        <changefreq>${metadata.changefreq || 'weekly'}</changefreq>
        <priority>${metadata.priority || '0.5'}</priority>
    </url>`;
    }

    // 处理导航项
    processNavItem(item, lang, urls) {
        if (!item) {
            return;
        }

        if (item.href) {
            const metadata = this.pages.get(item.href) || {};

            const langCode = this.getLanguageCode(lang);
            const key = `${langCode}:${item.href}`;
            urls.set(key, {
                lang: langCode,
                url: item.href,
                metadata
            });
        }

        // 递归处理子项
        if (Array.isArray(item.items)) {
            item.items.forEach(subItem => this.processNavItem(subItem, lang, urls));
        }
    }

    // 收集所有 URL
    collectNavigationUrls() {
        const urls = new Map();
        const isI18nEnabled = isFeatureEnabled(this.config, 'i18n');
        const languages = isI18nEnabled
            ? (this.config.languages || [this.config.i18n?.default || 'en'])
            : ['en'];

        // 收集每种语言的 URL
        for (const lang of languages) {
            const navItems = this.getNavigation(lang) || [];
            navItems.forEach(item => this.processNavItem(item, lang, urls));
        }

        return urls;
    }

    // 生成站点地图
    generate() {
        const urls = this.collectNavigationUrls();

        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
        // 为每个语言版本生成独立的 URL 条目
        for (const [key, {lang, url, metadata}] of urls.entries()) {
            sitemap += this.generateUrlNode(url, lang, metadata);
            sitemap += '\n';
        }

        sitemap += '</urlset>';

        const outputPath = path.join(this.config.outputPath, 'sitemap.xml');
        fs.writeFileSync(outputPath, sitemap, 'utf8');
        console.log('✓ 生成站点地图完成');

        return sitemap;
    }
}

module.exports = SitemapGenerator;