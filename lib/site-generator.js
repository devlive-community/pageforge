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
                try {
                    // 处理 Markdown 文件
                    const {metadata, content} = this.fileProcessor.processMarkdown(sourcePath);

                    // 构建输出路径，保持目录结构
                    const outputDir = path.join(this.config.outputPath, baseDir);
                    if (!fs.existsSync(outputDir)) {
                        fs.mkdirSync(outputDir, {recursive: true});
                    }

                    // 准备页面数据
                    const pageData = {
                        title: metadata.title,
                        content: content,
                        site: this.config.site || {},
                        page: metadata,
                        nav: this.config.nav || this.defaultNav,
                        config: this.config,
                        // 计算当前页面相对于根目录的路径
                        basePath: this.getRelativeBasePath(baseDir),
                        // 从 metadata 中获取布局
                        layout: metadata.layout || 'layouts/page',
                        ...metadata,
                        ...this.config
                    };

                    // 渲染页面
                    const html = await this.templateEngine.renderWithLayout('layouts/page', pageData);

                    // 写入 HTML 文件
                    const outputFile = path.join(
                        outputDir,
                        file.replace('.md', '.html')
                    );
                    fs.writeFileSync(outputFile, html);

                    console.log(`✓ Generated ${relativePath}`);
                }
                catch (error) {
                    console.error(`✗ Error processing ${relativePath}: ${error.message}`);
                }
            }
        }
    }

    // 计算相对于根目录的路径
    getRelativeBasePath(baseDir) {
        if (!baseDir) {
            return '.';
        }
        const depth = baseDir.split(path.sep).length;
        return Array(depth).fill('..').join('/') || '.';
    }

    // 复制资源目录，保持原始目录结构
    async copyAssets() {
        if (!this.config.assetsPath || !fs.existsSync(this.config.assetsPath)) {
            return;
        }

        // 获取资源目录的基础名称
        const assetsBaseName = path.basename(this.config.assetsPath);

        // 在输出目录中创建同名资源目录
        const outputAssetsDir = path.join(this.config.outputPath, assetsBaseName);
        if (!fs.existsSync(outputAssetsDir)) {
            fs.mkdirSync(outputAssetsDir, {recursive: true});
        }

        // 定义递归复制函数
        const copyRecursively = (source, target) => {
            const items = fs.readdirSync(source);

            items.forEach(item => {
                const sourcePath = path.join(source, item);
                const targetPath = path.join(target, item);

                if (fs.statSync(sourcePath).isDirectory()) {
                    if (!fs.existsSync(targetPath)) {
                        fs.mkdirSync(targetPath, {recursive: true});
                    }
                    copyRecursively(sourcePath, targetPath);
                }
                else {
                    fs.copyFileSync(sourcePath, targetPath);
                }
            });
        };

        // 开始递归复制
        copyRecursively(this.config.assetsPath, outputAssetsDir);
    }

    // 生成站点
    async generate() {
        // 确保输出目录存在
        if (!fs.existsSync(this.config.outputPath)) {
            fs.mkdirSync(this.config.outputPath, {recursive: true});
        }

        // 先复制资源文件
        await this.copyAssets();

        // 处理所有 Markdown 文件
        await this.processDirectory(this.config.sourcePath);
    }
}

module.exports = SiteGenerator;