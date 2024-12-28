const fs = require('fs');
const path = require('path');
const FileProcessor = require('./file-processor');
const TemplateEngine = require('./template-engine');

class SiteGenerator {
    constructor(config) {
        this.config = config;
        this.fileProcessor = new FileProcessor(config.sourcePath, config.outputPath);
        this.templateEngine = new TemplateEngine(config.templatePath);

        this.defaultNav = [
            {url: '/', text: '首页'},
            {url: '/about.html', text: '关于'}
        ];
    }

    // 递归处理目录
    async processDirectory(sourceDir, baseDir = '') {
        const files = fs.readdirSync(sourceDir);

        for (const file of files) {
            const sourcePath = path.join(sourceDir, file);
            const relativePath = path.join(baseDir, file);
            const stat = fs.statSync(sourcePath);

            if (stat.isDirectory()) {
                // 递归处理子目录
                await this.processDirectory(sourcePath, relativePath);
            }
            else if (file.endsWith('.md')) {
                // 处理 Markdown 文件
                const {metadata, content} = this.fileProcessor.processMarkdown(sourcePath);

                // 构建输出路径，保持目录结构
                const outputDir = path.join(this.config.outputPath, baseDir);
                if (!fs.existsSync(outputDir)) {
                    fs.mkdirSync(outputDir, {recursive: true});
                }

                // 渲染页面
                const html = await this.templateEngine.renderWithLayout('page', {
                    title: metadata.title,
                    content: content,
                    site: this.config.site || {},
                    page: metadata,
                    nav: this.config.nav || this.defaultNav, // 使用配置中的导航或默认导航
                    ...metadata
                });

                // 写入 HTML 文件
                const outputFile = path.join(
                    outputDir,
                    file.replace('.md', '.html')
                );
                fs.writeFileSync(outputFile, html);
            }
        }
    }

    // 复制资源目录
    async copyAssets(sourceDir, baseDir = '') {
        if (!fs.existsSync(sourceDir)) {
            return;
        }

        const files = fs.readdirSync(sourceDir);
        for (const file of files) {
            const sourcePath = path.join(sourceDir, file);
            const stat = fs.statSync(sourcePath);

            if (stat.isDirectory()) {
                // 递归复制子目录
                await this.copyAssets(sourcePath, path.join(baseDir, file));
            }
            else {
                const outputPath = path.join(this.config.outputPath, baseDir, file);
                const outputDir = path.dirname(outputPath);

                if (!fs.existsSync(outputDir)) {
                    fs.mkdirSync(outputDir, {recursive: true});
                }

                this.fileProcessor.copyAssets(sourcePath, outputPath);
            }
        }
    }

    // 生成站点
    async generate() {
        // 创建输出目录
        if (!fs.existsSync(this.config.outputPath)) {
            fs.mkdirSync(this.config.outputPath, {recursive: true});
        }

        // 处理所有 Markdown 文件（包括子目录）
        await this.processDirectory(this.config.sourcePath);

        // 复制静态资源（包括子目录）
        if (this.config.assetsPath) {
            await this.copyAssets(this.config.assetsPath);
        }
    }
}

module.exports = SiteGenerator;