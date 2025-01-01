const fs = require('fs');
const path = require('path');
const FileProcessor = require('./file-processor');
const {getPagePath, getRelativeBasePath, isFeatureEnabled} = require("./utils");

class DirectoryProcessor {
    constructor(config, language, outputPath) {
        this.config = config;
        this.language = language;
        this.outputPath = outputPath;
        this.pages = new Map();

        this.fileProcessor = new FileProcessor(this.config, this.pages, config.sourcePath, config.outputPath);
    }

    async preloadPages(sourceDir, baseDir = '') {
        const files = fs.readdirSync(sourceDir);

        for (const file of files) {
            const sourcePath = path.join(sourceDir, file);
            const relativePath = path.join(baseDir, file);
            const stat = fs.statSync(sourcePath);

            if (stat.isDirectory()) {
                await this.preloadPages(sourcePath, relativePath);
            }
            else if (file.endsWith('.md')) {
                const {metadata} = this.fileProcessor.processMarkdown(sourcePath);
                const pageUrlPath = getPagePath(relativePath);
                this.pages.set(pageUrlPath, metadata);
            }
        }
    }

    isFeatureEnabled(featureName) {
        return this.config.feature?.[featureName]?.enable === true;
    }

    getAvailableLocales() {
        if (!this.isFeatureEnabled('i18n')) {
            return [];
        }

        const i18n = this.config.i18n || {};
        return Object.entries(i18n)
            .filter(([key]) => key !== 'default')
            .map(([key, value]) => ({
                key,
                name: value.name,
                flag: value.flag
            }));
    }

    createRootRedirect() {
        const root404Html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <script>
        var anchor = document.createElement("a");
        anchor.href = window.location.href;
        
        var path = anchor.pathname;
        if (path.indexOf(".html") === -1) {
            path = path.replace(/\/$/, "");
            path = path + ".html";
        }
        
        var lang = path.split("/")[1];
        var supportedLanguages = ${JSON.stringify(this.getAvailableLocales().map(l => l.key))};
        
        if (supportedLanguages.includes(lang)) {
            window.location.replace("/" + lang + "/404.html");
        } else {
            window.location.replace("/zh-CN/404.html");
        }
    </script>
</head>
<body></body>
</html>`;

        const root404Path = path.join(this.config.outputPath, '404.html');
        fs.writeFileSync(root404Path, root404Html);
        console.log('✓ 创建根目录 404 页面:', root404Path);

        const defaultLanguage = this.config.i18n?.default || 'zh-CN';

        // 创建一个极简的重定向页面
        const redirectHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="refresh" content="0;url=/${defaultLanguage}/">
    <script>window.location.replace('/${defaultLanguage}/');</script>
    <link rel="canonical" href="/${defaultLanguage}/" />
</head>
</html>`;

        const rootIndexPath = path.join(this.config.outputPath, 'index.html');
        fs.writeFileSync(rootIndexPath, redirectHtml);
        console.log('✓ 创建根目录重定向页面:', rootIndexPath);
    }

    async create404Pages() {
        if (this.isFeatureEnabled('i18n')) {
            for (const locale of this.getAvailableLocales()) {
                const metadata = {
                    config: {
                        toc: false,
                        sidebar: false
                    },
                    title: locale.key === 'zh-CN' ? '页面未找到' : 'Page Not Found',
                    message: locale.key === 'zh-CN'
                        ? '抱歉，您访问的页面不存在。'
                        : 'Sorry, the page you are looking for does not exist.',
                    backLink: locale.key === 'zh-CN' ? '返回首页' : 'Back to Home',
                    language: locale.key,
                    noLocalePath: `/404.html`,
                    layout: 'layouts/404'
                };

                const html = await this.fileProcessor.processLayoutFile(metadata, locale.key);
                const outputDir = path.join(this.outputPath, locale.key);
                const outputPath = path.join(outputDir, '404.html');

                if (!fs.existsSync(outputDir)) {
                    fs.mkdirSync(outputDir, {recursive: true});
                }
                fs.writeFileSync(outputPath, html);
                console.log(`✓ 创建 404 页面: ${outputPath}`);
            }
        }
        else {
            const metadata = {
                config: {
                    toc: false,
                    sidebar: false
                },
                title: '页面未找到',
                message: '抱歉，您访问的页面不存在。',
                backLink: '返回首页',
                noLocalePath: `/404.html`,
                layout: 'layouts/404'
            };

            const html = await this.fileProcessor.processLayoutFile(metadata, '');
            const outputDir = path.join(this.outputPath, '');
            const outputPath = path.join(outputDir, '404.html');

            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, {recursive: true});
            }
            fs.writeFileSync(outputPath, html);
            console.log(`✓ 创建 404 页面: ${outputPath}`);
        }
    }

    async processLanguageDirectory(sourceDir, baseDir = '') {
        // 预加载所有页面数据
        await this.preloadPages(this.config.sourcePath);

        // 创建 404 页面
        await this.create404Pages();

        if (this.isFeatureEnabled('i18n')) {
            console.log("\n📂  正在处理国际化");

            // 创建根目录重定向
            this.createRootRedirect();

            for (const locale of this.getAvailableLocales()) {
                console.log(`\n📂  处理语言: ${locale.key}`);

                // 创建语言目录
                const localeOutputDir = path.join(this.config.outputPath, locale.key);
                if (!fs.existsSync(localeOutputDir)) {
                    fs.mkdirSync(localeOutputDir, {recursive: true});
                }

                // 从源目录开始处理，保持相对路径结构
                const relativeToSource = path.relative(this.config.sourcePath, sourceDir);
                const initialBaseDir = path.join(locale.key, relativeToSource);
                await this.processDirectory(sourceDir, initialBaseDir, locale.key, this.config.sourcePath);
            }
        }
        else {
            await this.processDirectory(sourceDir, '', '', this.config.sourcePath);
        }
    }

    async processDirectory(sourceDir, baseDir = '', locale = '', rootSourceDir) {
        const files = fs.readdirSync(sourceDir);

        if (files.length === 0) {
            console.log(`📂  目录 ${sourceDir} 为空，忽略不做任何处理`);
            return;
        }

        console.log(`\n📂  处理目录: ${sourceDir}`);

        // 处理子目录
        for (const file of files) {
            const sourcePath = path.join(sourceDir, file);
            const stat = fs.statSync(sourcePath);

            if (stat.isDirectory()) {
                const relativeToSource = path.relative(rootSourceDir, sourcePath);
                const nextBaseDir = locale ? path.join(locale, relativeToSource) : relativeToSource;
                await this.processDirectory(sourcePath, nextBaseDir, locale, rootSourceDir);
            }
        }

        // 处理 Markdown 文件
        const markdownFiles = files.filter(file => file.endsWith('.md'));
        for (const file of markdownFiles) {
            const relativeSourceDir = path.relative(rootSourceDir, sourceDir);
            const relativeBaseDir = locale ? path.join(locale, relativeSourceDir) : relativeSourceDir;

            await this.fileProcessor.processMarkdownFile(
                sourceDir,
                relativeBaseDir,
                file,
                locale,
                rootSourceDir
            );
        }

        // 处理其他文件
        const otherFiles = files.filter(file =>
            !file.endsWith('.md') &&
            !fs.statSync(path.join(sourceDir, file)).isDirectory()
        );

        for (const file of otherFiles) {
            const sourcePath = path.join(sourceDir, file);
            const relativeSourceDir = path.relative(rootSourceDir, sourceDir);
            const outputPath = path.join(
                this.config.outputPath,
                locale ? path.join(locale, relativeSourceDir) : relativeSourceDir,
                file
            );

            // 确保输出目录存在
            const outputDir = path.dirname(outputPath);
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, {recursive: true});
            }

            fs.copyFileSync(sourcePath, outputPath);
            console.log(`✓ 复制文件 ${file} 到 ${outputPath} 完成`);
        }
    }
}

module.exports = DirectoryProcessor;