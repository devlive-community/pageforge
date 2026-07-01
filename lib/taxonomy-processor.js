const fs = require('fs');
const path = require('path');
const {isFeatureEnabled} = require('./utils');

class TaxonomyProcessor {
    constructor(config, pages, getNavigation) {
        this.config = config;
        this.pages = pages;
        this.getNavigation = getNavigation;
    }

    collectTags(locale) {
        const tagMap = new Map();
        const i18nEnabled = isFeatureEnabled(this.config, 'i18n');

        for (const [pagePath, metadata] of this.pages.entries()) {
            if (!metadata.tags || !Array.isArray(metadata.tags)) {
                continue;
            }
            if (metadata.draft) {
                continue;
            }

            for (const tag of metadata.tags) {
                if (!tagMap.has(tag)) {
                    tagMap.set(tag, []);
                }

                tagMap.get(tag).push({
                    title: metadata.title || pagePath,
                    path: pagePath,
                    description: metadata.description || '',
                    icon: metadata.icon || '',
                    date: metadata.date || metadata.gitInfo?.revision?.lastModifiedTime || ''
                });
            }
        }

        return tagMap;
    }

    getTitle(locale, fallback) {
        const translations = this.config.i18n?.[locale]?.translations;
        return translations?.[fallback] || fallback;
    }

    async generateTagPages(fileProcessor) {
        if (!isFeatureEnabled(this.config, 'tags')) {
            return;
        }

        const i18nEnabled = isFeatureEnabled(this.config, 'i18n');
        const locales = i18nEnabled
            ? this.config.languages || [this.config.i18n?.default || 'en']
            : [''];

        let totalTags = 0;

        for (const locale of locales) {
            const localeKey = typeof locale === 'object' ? locale.key : locale;
            const localePrefix = localeKey ? `/${localeKey}` : '';

            const tagMap = this.collectTags(localeKey);

            if (tagMap.size === 0) {
                continue;
            }

            totalTags = tagMap.size;

            await this.generateTagsIndexPage(fileProcessor, tagMap, localeKey, localePrefix);

            for (const [tag, pages] of tagMap.entries()) {
                await this.generateTagDetailPage(fileProcessor, tag, pages, localeKey, localePrefix);
            }
        }

        if (totalTags > 0) {
            console.log(`✓ 生成标签页完成 (${totalTags} 个标签)`);
        }
        else {
            console.log('📂 没有找到任何标签，跳过标签页生成');
        }
    }

    async generateTagsIndexPage(fileProcessor, tagMap, locale, localePrefix) {
        const tags = Array.from(tagMap.entries())
            .map(([name, pages]) => ({name, count: pages.length, pages}))
            .sort((a, b) => b.count - a.count);

        const title = this.getTitle(locale, 'Tags') || (locale === 'zh-CN' ? '标签' : 'Tags');

        const metadata = {
            config: {
                toc: false,
                sidebar: false
            },
            title,
            language: locale,
            version: this.config.version,
            noLocalePath: '/tags.html',
            template: 'tags',
            tags: tags
        };

        const pageData = fileProcessor.pageDataProcessor.buildLayoutPageData(metadata, locale);
        pageData.siteData.nav = fileProcessor.getCachedNavigation(locale);
        pageData.pageData.tags = tags;

        let html = await fileProcessor.templateEngine.renderWithLayout('layouts/page', pageData);

        const outputDir = path.join(this.config.outputPath, localePrefix.replace(/^\//, ''));
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, {recursive: true});
        }

        const outputPath = path.join(outputDir, 'tags.html');
        fs.writeFileSync(outputPath, html);
        console.log(`✓ 生成标签索引页: ${outputPath}`);
    }

    async generateTagDetailPage(fileProcessor, tag, pages, locale, localePrefix) {
        const slug = tag.toLowerCase().replace(/\s+/g, '-');
        const label = this.getTitle(locale, 'Tag') || (locale === 'zh-CN' ? '标签' : 'Tag');

        const metadata = {
            config: {
                toc: false,
                sidebar: false
            },
            title: `${label}: ${tag}`,
            language: locale,
            version: this.config.version,
            noLocalePath: `/tags/${slug}.html`,
            template: 'tag',
            tagName: tag,
            tagPages: pages
        };

        const pageData = fileProcessor.pageDataProcessor.buildLayoutPageData(metadata, locale);
        pageData.siteData.nav = fileProcessor.getCachedNavigation(locale);
        pageData.pageData.tagName = tag;
        pageData.pageData.tagPages = pages;

        let html = await fileProcessor.templateEngine.renderWithLayout('layouts/page', pageData);

        const outputDir = path.join(this.config.outputPath, localePrefix.replace(/^\//, ''), 'tags');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, {recursive: true});
        }

        const outputPath = path.join(outputDir, `${slug}.html`);
        fs.writeFileSync(outputPath, html);
        console.log(`✓ 生成标签详情页: ${tag} (${pages.length} 篇文章)`);
    }
}

module.exports = TaxonomyProcessor;
