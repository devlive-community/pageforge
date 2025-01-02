const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
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
const TemplateEngine = require("./template-engine");
const {setContext} = require("./extension/marked/pageforge-ejs");

class FileProcessor {
    constructor(config, pages, sourcePath, outputPath) {
        this.config = config;
        this.pages = pages;
        this.sourcePath = sourcePath;
        this.outputPath = outputPath;

        this.templateEngine = new TemplateEngine(config.templatePath);
    }

    // 读取并解析 Markdown 文件
    processMarkdown(filePath, locale, relativePath) {
        const content = fs.readFileSync(filePath, 'utf-8');

        const {data, content: markdownContent} = matter(content);

        const forwardPath = this.getPath(relativePath, locale)
        const context = {
            pageData: {
                ...data,
                locale: locale,
                ...forwardPath
            },
            siteData: {
                nav: this.config.nav
            }
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

        return {localPath, noLocalePath};
    }

    async processMarkdownFile(sourceDir, baseDir, filename, locale = '', originalFilePath = baseDir) {
        const sourcePath = path.join(sourceDir, filename);
        const relativePath = path.join(baseDir, filename);

        if (locale !== getFileLanguage(this.config, filename)) {
            console.log(`📄  正在跳过文件 ${filename}  不是当前语言文件`);
            return;
        }

        try {
            // 处理 Markdown 文件
            const {metadata, content} = this.processMarkdown(sourcePath, locale, relativePath);
            const outputFilename = getOutputFilename(filename);
            const pageUrlPath = getPagePath(relativePath);
            this.pages.set(pageUrlPath, metadata);

            // 构建输出路径，保持目录结构
            const outputDir = path.join(this.config.outputPath, baseDir);
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, {recursive: true});
            }

            // 尝试翻译 metadata.title
            const translatedTitle = metadata.title
                ? getTranslation(this.config, metadata.title, locale)
                : metadata.title;
            metadata.title = translatedTitle;

            // 配置的国际化
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
                    ...forwardPath,
                    ...metadata
                },
                siteData: {
                    nav: this.config.nav,
                    ...this.config
                }
            }
            pageData.siteData.nav = transformNavigation(this.config.nav, this.pages, this.config, locale);

            // 渲染页面
            const html = await this.templateEngine.renderWithLayout('layouts/page', pageData);

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

        this.config.languages = getAvailableLocales(this.config)

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
        pageData.siteData.nav = transformNavigation(this.config.nav, this.pages, this.config, locale);

        return await this.templateEngine.renderWithLayout('layouts/page', pageData);
    }
}

module.exports = FileProcessor