const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const ejs = require('ejs');
const marked = require('./extension/marked/pageforge-marked');
const formatTOC = require('./extension/marked/pageforge-toc');
const {
    getPagePath,
    getTranslation,
    getAvailableLocales,
    appendHtml,
    getRelativeBasePath,
    transformNavigation,
    getOutputFilename,
    getFileLanguage,
    isFeatureEnabled
} = require("./utils");
const {execSync} = require('child_process');
const TemplateEngine = require("./template-engine");
const {setContext} = require("./extension/marked/pageforge-ejs");
const minify = require('html-minifier').minify;
const SitemapGenerator = require('./sitemap-generator');
const SearchIndexBuilder = require('./indexer-generator');
const HtmlMinifier = require('./html-minifier');
const GitInfoProvider = require('./git-info-provider');

class FileProcessor {
    constructor(config, pages, sourcePath, outputPath) {
        this.config = config;
        this.pages = pages;
        this.sourcePath = sourcePath;
        this.outputPath = outputPath;
        this.navigationCache = new Map();

        this.templateEngine = new TemplateEngine(config.templatePath);

        if (config.feature?.compress?.enable) {
            this.htmlMinifier = new HtmlMinifier(config);
        }
        this.gitInfoProvider = new GitInfoProvider(config);
    }

    // 获取缓存的导航数据
    getCachedNavigation(locale) {
        if (!this.navigationCache.has(locale)) {
            const navData = transformNavigation(this.config.nav, this.pages, this.config, locale);
            this.navigationCache.set(locale, navData);
        }
        return this.navigationCache.get(locale);
    }

    // 构建站点地图数据
    async generateSitemap() {
        const sitemapGenerator = new SitemapGenerator(
            this.config,
            this.pages,
            (locale) => this.getCachedNavigation(locale)
        );
        sitemapGenerator.generate();
    }

    // 构建站点索引
    async generateIndex() {
        const indexBuilder = new SearchIndexBuilder(
            this.config,
            this.pages,
            (locale) => this.getCachedNavigation(locale)
        );
        indexBuilder.generate();
    }

    // 解析元数据中的 EJS 模板
    parseMetadataTemplates(data, context) {
        const processed = {...data};

        // 检查字符串是否包含 EJS 模板语法
        const hasEjsTemplate = (str) => {
            return str.includes('<%') && str.includes('%>');
        };

        // 递归处理对象
        const processValue = (value) => {
            if (typeof value === 'string') {
                // 只有包含 EJS 语法的字符串才进行模板解析
                if (hasEjsTemplate(value)) {
                    try {
                        return ejs.render(value, context, {
                            async: false,
                            cache: false,
                            filename: context.filename
                        });
                    }
                    catch (error) {
                        console.warn(`Template parsing error for value "${value}":`, error);
                        return value;
                    }
                }
                // 普通字符串直接返回
                return value;
            }
            else if (Array.isArray(value)) {
                return value.map(item => processValue(item));
            }
            else if (typeof value === 'object' && value !== null) {
                const result = {};
                for (const [key, val] of Object.entries(value)) {
                    result[key] = processValue(val);
                }
                return result;
            }
            return value;
        };

        // 处理每个顶层属性
        for (const [key, value] of Object.entries(processed)) {
            processed[key] = processValue(value);
        }

        return processed;
    }

    // 读取并解析 Markdown 文件
    processMarkdown(filePath, locale, relativePath) {
        const content = fs.readFileSync(filePath, 'utf-8');

        const {data: rawData, content: markdownContent} = matter(content);

        const forwardPath = this.getPath(relativePath, locale)
        const context = {
            pageData: {
                ...rawData,
                language: locale,
                ...forwardPath
            },
            siteData: {
                nav: this.config.nav
            }
        };

        // 解析元数据中的模板
        const data = this.parseMetadataTemplates(rawData, context);

        // 更新上下文
        context.pageData = {
            ...context.pageData,
            ...data
        };

        setContext(context);

        const html = marked.parse(markdownContent);

        data.toc = formatTOC(markdownContent);

        return {metadata: data, content: html};
    }

    getPath(relativePath, locale) {
        // 计算当前页面的路径
        const pagePath = getPagePath(relativePath);
        const localPath = appendHtml(pagePath, this.config, locale);
        const noLocalePath = isFeatureEnabled(this.config, 'i18n')
            ? localPath.replace(`/${locale}`, '')
            : localPath;

        return {localPath, noLocalePath, relativePath: relativePath.replace(locale, '')};
    }

    async processMarkdownFile(sourceDir, baseDir, filename, locale = '', originalFilePath = baseDir) {
        const sourcePath = path.join(sourceDir, filename);
        const relativePath = path.join(baseDir, filename);
        const fileLanguage = getFileLanguage(this.config, filename);

        // 如果文件语言与当前处理的语言不匹配
        if (locale !== fileLanguage) {
            // 检查是否是默认语言文件
            const isDefaultLanguageFile = fileLanguage === this.config.i18n?.default || (!filename.includes('.') || filename.endsWith('.md'));
            // 检查是否存在当前语言的文件
            const currentLanguageFilename = filename.replace(/(\.[a-zA-Z-]+)?\.md$/, `.${locale}.md`);
            const hasLocaleFile = fs.existsSync(path.join(sourceDir, currentLanguageFilename));

            if (!hasLocaleFile && isFeatureEnabled(this.config, 'i18n') && isDefaultLanguageFile) {
                console.log(`📄 未找到 ${locale} 语言文件，使用默认语言(${this.config.i18n?.default})文件: ${filename}`);
            }
            else {
                console.log(`📄 正在跳过文件 ${filename} 不是当前语言文件`);
                return;
            }
        }

        try {
            const gitInfo = await this.gitInfoProvider.getGitInfo(sourcePath);
            const {metadata, content} = this.processMarkdown(sourcePath, locale, relativePath);
            const outputFilename = getOutputFilename(filename);
            const pageUrlPath = getPagePath(relativePath);
            this.pages.set(pageUrlPath, metadata);

            const outputDir = path.join(this.config.outputPath, baseDir);
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, {recursive: true});
            }

            const translatedTitle = metadata.title
                ? getTranslation(this.config, metadata.title, locale)
                : metadata.title;
            metadata.title = translatedTitle;

            this.config.languages = getAvailableLocales(this.config)
            const forwardPath = this.getPath(relativePath, locale)

            const pageData = {
                pageData: {
                    config: metadata.config,
                    toc: metadata.toc,
                    title: translatedTitle,
                    content: content,
                    language: locale,
                    basePath: getRelativeBasePath(baseDir),
                    layout: metadata.layout || 'layouts/content',
                    gitInfo,
                    ...forwardPath,
                    ...metadata
                },
                siteData: {
                    nav: this.config.nav,
                    ...this.config
                }
            }
            pageData.siteData.nav = this.getCachedNavigation(locale);

            // 渲染页面
            let html = await this.templateEngine.renderWithLayout('layouts/page', pageData);

            // 压缩 HTML
            if (this.config.feature?.compress?.enable) {
                html = this.htmlMinifier.compress(html, relativePath);
            }

            const outputFile = path.join(outputDir, outputFilename);
            fs.writeFileSync(outputFile, html);

            console.log(`✓ 编译 ${relativePath} 文件完成`);
        }
        catch (error) {
            console.log(error)
            console.error(`✗ 编译 ${relativePath} 失败 ${error.message}`);
        }
    }

    async processLayoutFile(metadata, locale) {
        const translatedTitle = metadata.title
            ? getTranslation(this.config, metadata.title, locale)
            : metadata.title;
        metadata.title = translatedTitle;

        this.config.languages = getAvailableLocales(this.config);

        const pageData = {
            pageData: {
                config: metadata.config,
                basePath: getRelativeBasePath('/'),
                ...metadata
            },
            siteData: {
                nav: this.config.nav,
                ...this.config
            }
        }
        pageData.siteData.nav = this.getCachedNavigation(locale);

        let html = await this.templateEngine.renderWithLayout('layouts/page', pageData);

        // 压缩布局 HTML
        if (this.config.minify !== false) {
            try {
                html = minify(html, this.minifyOptions);
            }
            catch (minifyError) {
                console.warn(`⚠️  压缩布局 HTML 失败: ${minifyError.message}`);
            }
        }

        return html;
    }
}

module.exports = FileProcessor