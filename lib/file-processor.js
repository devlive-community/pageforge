const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const marked = require('./extension/marked/pageforge-marked');
const formatTOC = require('./extension/marked/pageforge-toc');
const {getPagePath, getTranslation, getAvailableLocales, appendHtml, getRelativeBasePath, transformNavigation, getOutputFilename, getFileLanguage} = require("./utils");
const TemplateEngine = require("./template-engine");

class FileProcessor {
    constructor(config, pages, sourcePath, outputPath) {
        this.config = config;
        this.pages = pages;
        this.sourcePath = sourcePath;
        this.outputPath = outputPath;

        this.templateEngine = new TemplateEngine(config.templatePath);
    }

    // 读取并解析 Markdown 文件
    processMarkdown(filePath) {
        const content = fs.readFileSync(filePath, 'utf-8');

        const {data, content: markdownContent} = matter(content);

        const html = marked.parse(markdownContent);

        data.toc = formatTOC(markdownContent);

        return {metadata: data, content: html};
    }

    async processMarkdownFile(sourceDir, baseDir, filename, locale = '', originalFilePath = baseDir) {
        const sourcePath = path.join(sourceDir, filename);
        const relativePath = path.join(baseDir, filename);

        if (locale !== getFileLanguage(this.config, filename)) {
            console.log(`📄  正在跳过文件 ${filename}  不是当前语言文件`);
            return;
        }

        console.log("📄  正在处理文件", sourcePath, " 到 ", relativePath);
        try {
            // 处理 Markdown 文件
            const {metadata, content} = this.processMarkdown(sourcePath);
            const outputFilename = getOutputFilename(filename);
            const pageUrlPath = getPagePath(relativePath);
            this.pages.set(pageUrlPath, metadata);

            // 构建输出路径，保持目录结构
            const outputDir = path.join(this.config.outputPath, baseDir);
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, {recursive: true});
            }

            // 计算当前页面的路径
            const pagePath = getPagePath(relativePath);

            // 尝试翻译 metadata.title
            const translatedTitle = metadata.title
                ? getTranslation(this.config, metadata.title, locale)
                : metadata.title;
            metadata.title = translatedTitle;

            // 配置的国际化
            this.config.languages = getAvailableLocales(this.config)
            const localPath = appendHtml(pagePath, this.config, locale);

            // 准备页面数据
            const pageData = {
                title: translatedTitle,
                content: content,
                site: this.config.site || {},
                page: {
                    ...metadata,
                    // 添加路径信息
                    path: localPath,
                    // 移除语言前缀，只保留路径掉
                    noLocalePath: localPath.replace(`/${locale}`, ''),
                    // 原始文件路径
                    sourcePath: relativePath,
                    language: locale
                },
                nav: this.config.nav,
                config: this.config,
                // 计算当前页面相对于根目录的路径
                basePath: getRelativeBasePath(baseDir),
                // 从 metadata 中获取布局
                layout: metadata.layout || 'layouts/page',
                ...metadata,
                ...this.config
            };
            pageData.nav = transformNavigation(pageData.nav, this.pages, this.config, locale);
            console.log("这个具体lying神", localPath)

            // 渲染页面
            const html = await this.templateEngine.renderWithLayout('layouts/page', pageData);

            const outputFile = path.join(outputDir, outputFilename);
            console.log("源文件", sourcePath, " 输出文件", outputFile, " Origina 文件", originalFilePath);

            fs.writeFileSync(outputFile, html);

            console.log(`✓ 编译 ${relativePath} 文件完成`);
        }
        catch (error) {
            console.log(error)
            console.error(`✗ 编译 ${relativePath} 失败 ${error.message}`);
        }
    }
}

module.exports = FileProcessor