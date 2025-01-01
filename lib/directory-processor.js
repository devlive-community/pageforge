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
            // 计算相对于源目录的路径
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

    async processLanguageDirectory(sourceDir, baseDir = '') {
        // 预加载所有页面数据
        await this.preloadPages(this.config.sourcePath);

        if (this.isFeatureEnabled('i18n')) {
            console.log("\n📂  正在处理国际化");
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
                // 计算相对于源根目录的路径
                const relativeToSource = path.relative(rootSourceDir, sourcePath);
                // 构建下一级目录的基础路径
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

module.exports = DirectoryProcessor