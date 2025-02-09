const fs = require('fs');
const path = require('path');
const {isFeatureEnabled} = require('./utils');

class SearchIndexBuilder {
    constructor(config, pages, getNavigation) {
        this.config = config;
        this.pages = pages;
        this.getNavigation = getNavigation;
        this.baseUrl = config?.site?.baseUrl || '';
        this.searchIndex = new Map(); // 使用 Map 存储，键为 langCode:url
    }

    // 获取语言代码
    getLanguageCode(lang) {
        return typeof lang === 'object' ? lang.key : lang;
    }

    // 处理导航项
    processNavItem(item, lang) {
        if (!item) {
            return;
        }

        if (item.href) {
            // 将 /.html 转换为 /index.html
            const normalizedHref = item.href === '/.html' ? '/index.html' : item.href;
            const metadata = this.pages.get(normalizedHref) || {};

            const langCode = this.getLanguageCode(lang);
            const key = `${langCode}:${normalizedHref}`;

            // 处理文件内容
            const filePath = this.getFilePath(normalizedHref);
            if (filePath && fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf-8');
                const {title, processedContent} = this.parseContent(content, filePath);

                // 构建搜索项
                const searchItem = {
                    title,
                    content: processedContent,
                    url: this.buildUrl(normalizedHref, lang),
                    lang: langCode,
                    lastModified: metadata?.gitInfo?.revision?.lastModifiedTime
                };

                this.searchIndex.set(key, searchItem);
            }
        }

        // 递归处理子项
        if (Array.isArray(item.items)) {
            item.items.forEach(subItem => this.processNavItem(subItem, lang));
        }
    }

    // 从 URL 获取文件路径
    getFilePath(url) {
        // 移除开头的斜杠并将 .html 转换为 .md
        const relativePath = url.replace(/^\//, '').replace(/\.html$/, '.md');
        return path.join(this.config.sourcePath, relativePath);
    }

    // 构建完整的 URL
// 构建完整的 URL
    buildUrl(url, lang) {
        const isI18nEnabled = isFeatureEnabled(this.config, 'i18n');
        const langCode = this.getLanguageCode(lang);
        const normalizedUrl = url.startsWith('/') ? url.substring(1) : url;

        // 构建完整的 URL，考虑版本和国际化
        let fullUrl = normalizedUrl;

        // 当启用国际化时添加语言前缀
        if (isI18nEnabled && langCode) {
            fullUrl = `${langCode}/${fullUrl}`;
        }

        // 添加版本前缀
        if (this.config.version) {
            fullUrl = `${this.config.version}/${fullUrl}`;
        }

        return this.baseUrl
            ? `${this.baseUrl}/${fullUrl}`
            : `/${fullUrl}`;
    }

    // 解析文件内容
    parseContent(content, filePath) {
        // 解析 frontmatter
        const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        let title = '';
        let processedContent = content;

        if (frontMatterMatch) {
            const frontMatter = frontMatterMatch[1];
            const titleMatch = frontMatter.match(/title:\s*(.+)/);
            if (titleMatch) {
                title = titleMatch[1].trim();
            }
            processedContent = content.slice(frontMatterMatch[0].length).trim();
        }

        // 如果没有在 frontmatter 中找到标题，尝试从内容中提取
        if (!title) {
            const titleMatch = processedContent.match(/^#\s+(.*)$/m);
            title = titleMatch ? titleMatch[1] : path.basename(filePath, '.md');
        }

        // 清理 Markdown 语法
        processedContent = this.cleanMarkdown(processedContent);

        return {title, processedContent};
    }

    // 清理 Markdown 语法
    cleanMarkdown(content) {
        return content
            .replace(/^#.*$/gm, '') // 移除标题
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 转换链接为纯文本
            .replace(/[*_~`]/g, '') // 移除强调语法
            .replace(/```[\s\S]*?```/g, '') // 移除代码块
            .replace(/^\s*[-+*]\s+/gm, '') // 移除列表标记
            .replace(/^\s*\d+\.\s+/gm, '') // 移除有序列表标记
            .replace(/\n{2,}/g, '\n') // 合并多个换行
            .replace(/\s+/g, ' ') // 合并多个空格
            .trim();
    }

    // 生成搜索索引
    generate() {
        const isI18nEnabled = isFeatureEnabled(this.config, 'i18n');
        const languages = isI18nEnabled
            ? (this.config.languages || [this.config.i18n?.default || 'en'])
            : [''];  // 空字符串表示没有语言前缀

        // 收集每种语言的内容
        for (const lang of languages) {
            const navItems = this.getNavigation(lang) || [];
            navItems.forEach(item => this.processNavItem(item, lang));
        }

        // 转换为数组并写入文件
        const searchData = Array.from(this.searchIndex.values());
        const outputPath = path.join(this.config.outputPath, 'search-index.json');
        fs.writeFileSync(outputPath, JSON.stringify(searchData, null, 2), 'utf8');
        console.log('✓ 生成搜索索引完成');

        return searchData;
    }
}

module.exports = SearchIndexBuilder;