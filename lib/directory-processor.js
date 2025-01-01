const fs = require('fs');
const path = require('path');
const FileProcessor = require('./file-processor');
const {getPagePath} = require("./utils");

class DirectoryProcessor {
    constructor(config, language, outputPath) {
        this.config = config;
        this.language = language;
        this.outputPath = outputPath;
        this.pages = new Map();
        this.fileProcessor = new FileProcessor(this.config, this.pages, config.sourcePath, config.outputPath);
    }

    // 预加载所有页面数据
    async preloadPages(sourceDir, baseDir = '') {
        const files = fs.readdirSync(sourceDir);

        for (const file of files) {
            const sourcePath = path.join(sourceDir, file);
            const relativePath = path.join(baseDir, file);
            const stat = fs.statSync(sourcePath);

            if (stat.isDirectory()) {
                // 递归处理子目录
                await this.preloadPages(sourcePath, relativePath);
            }
            else if (file.endsWith('.md')) {
                // 处理 Markdown 文件
                const {metadata} = this.fileProcessor.processMarkdown(sourcePath);
                const pageUrlPath = getPagePath(relativePath);
                this.pages.set(pageUrlPath, metadata);
            }
        }
    }

    // 判断特定功能是否启用
    isFeatureEnabled(featureName) {
        return this.config.feature?.[featureName]?.enable === true;
    }

    // 获取所有配置的语言信息
    getAvailableLocales() {
        // 如果国际化功能未启用，返回空数组
        if (!this.isFeatureEnabled('i18n')) {
            return [];
        }

        const i18n = this.config.i18n || {};
        // 过滤掉 default 属性，只返回语言配置
        return Object.entries(i18n)
            .filter(([key]) => key !== 'default')
            .map(([key, value]) => ({
                key,                    // 语言代码 如 'en', 'zh-CN'
                name: value.name,       // 语言名称
                flag: value.flag        // 语言图标
            }));
    }

    async processLanguageDirectory(sourceDir, baseDir = '') {
        await this.preloadPages(this.config.sourcePath);

        // 根据国际化处理目录
        if (this.isFeatureEnabled('i18n')) {
            console.log("\n📂  正在处理国际化");
            for (const locale of this.getAvailableLocales()) {
                const outputDir = path.join(this.config.outputPath, locale.key);
                if (!fs.existsSync(outputDir)) {
                    fs.mkdirSync(outputDir, {recursive: true});
                }

                await this.processDirectory(sourceDir, baseDir, locale.key);
            }
        }
        else {
            await this.processDirectory(this.config.sourcePath);
        }
    }

    async processDirectory(sourceDir, baseDir = '', locale = '') {
        console.log("📂  正在处理目录", sourceDir);
        console.log(`📂  正在处理语言 ${locale}`);
        const files = fs.readdirSync(sourceDir);

        if (files.length === 0) {
            console.log(`📂  目录 ${sourceDir} 为空，忽略不做任何处理`);
            return;
        }


        // 如果有国际化配置，则根据国际化配置构建相关目录
        for (const file of files) {
            const sourcePath = path.join(sourceDir, file);
            if (fs.statSync(sourcePath).isDirectory()) {
                await this.processDirectory(sourcePath, path.join(baseDir, locale, file), locale);
            }
        }

        // 处理 Markdown 文件
        const markdownFiles = files.filter(file => file.endsWith('.md'));
        for (const file of markdownFiles) {
            await this.fileProcessor.processMarkdownFile(sourceDir, baseDir, file, locale);
        }

        // 最后复制其他文件
        const otherFiles = files.filter(file =>
            !file.endsWith('.md') &&
            !fs.statSync(path.join(sourceDir, file)).isDirectory()
        );

        for (const file of otherFiles) {
            const sourcePath = path.join(sourceDir, file);
            const outputPath = path.join(this.config.outputPath, baseDir, file);

            console.log("这里的资源有问题", outputPath)
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