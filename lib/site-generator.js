const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const FileProcessor = require('./file-processor');
const TemplateEngine = require('./template-engine');
const AssetBundler = require('./asset-bundler');

class SiteGenerator {
    constructor(config) {
        this.configPath = path.join(process.cwd(), 'pageforge.yaml');
        this.initializeWithConfig(config);
    }

    initializeWithConfig(config) {
        this.config = config;
        this.fileProcessor = new FileProcessor(config.sourcePath, config.outputPath);
        this.templateEngine = new TemplateEngine(config.templatePath);

        this.config.templatePath = path.join(path.join(__dirname, '../templates'));
        this.assetBundler = new AssetBundler(this.config);

        this.defaultNav = [
            {url: '/', text: '首页'},
            {url: '/about', text: '关于'}
        ];
    }

    // 重新加载配置
    async reloadConfig() {
        try {
            // 读取配置文件
            const configFile = await fs.promises.readFile(this.configPath, 'utf8');
            const newConfig = yaml.load(configFile);

            // 合并配置，保留一些运行时状态
            const mergedConfig = {
                ...this.config,           // 保留原配置
                ...newConfig,             // 使用新配置覆盖

                // 确保关键路径被正确处理
                templatePath: path.join(path.join(__dirname, '../templates')), // 保持模板路径不变

                // 更新其他路径
                sourcePath: this.resolvePath(newConfig.sourcePath || this.config.sourcePath),
                outputPath: this.resolvePath(newConfig.outputPath || this.config.outputPath),
                assetsPath: this.resolvePath(newConfig.assetsPath || this.config.assetsPath)
            };

            // 使用新配置重新初始化所有组件
            this.initializeWithConfig(mergedConfig);

            console.log('✓ 配置已重新加载');
            return true;
        }
        catch (error) {
            console.error('🤯 重新加载配置失败:', error);
            return false;
        }
    }

    // 解析相对路径为绝对路径
    resolvePath(relativePath) {
        if (!relativePath) {
            return null;
        }
        return path.isAbsolute(relativePath)
            ? relativePath
            : path.resolve(process.cwd(), relativePath);
    }

    // 递归处理目录
    async processDirectory(sourceDir, baseDir = '') {
        const files = fs.readdirSync(sourceDir);

        console.log('\n📂  正在处理目录', sourceDir);
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

                    // 计算当前页面的路径
                    const pagePath = this.getPagePath(relativePath);

                    // 准备页面数据
                    const pageData = {
                        title: metadata.title,
                        content: content,
                        site: this.config.site || {},
                        page: {
                            ...metadata,
                            // 添加路径信息
                            path: pagePath,
                            // 原始文件路径
                            sourcePath: relativePath,
                            // 输出路径
                            outputPath: path.join(baseDir, file.replace('.md', '.html'))
                        },
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

                    console.log(`✓ 编译 ${relativePath} 文件完成`);
                }
                catch (error) {
                    console.error(`✗ 编译 ${relativePath} 失败 ${error.message}`);
                }
            }
            else {
                // 复制非 Markdown 文件到对应输出目录
                const outputDir = path.join(this.config.outputPath, baseDir);
                if (!fs.existsSync(outputDir)) {
                    fs.mkdirSync(outputDir, {recursive: true});
                }
                const outputPath = path.join(outputDir, file);
                fs.copyFileSync(sourcePath, outputPath);
                console.log(`✓ 复制 ${relativePath} 文件完成`);
            }
        }
    }

    // 获取页面路径（用于侧边栏激活状态判断）
    getPagePath(relativePath) {
        // 移除 .md 或 .html 扩展名
        const pathWithoutExt = relativePath.replace(/\.(md|html)$/, '');

        // 如果是 index 文件，特殊处理
        const normalizedPath = pathWithoutExt === 'index' ? '' : pathWithoutExt;

        // 转换为 URL 风格的路径（使用正斜杠）
        const urlPath = normalizedPath.split(path.sep).join('/');

        // 确保路径以 / 开头
        return urlPath.startsWith('/') ? urlPath : `/${urlPath}`;
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
        // 先执行资源打包
        await this.assetBundler.bundle();

        if (!this.config.assetsPath || !fs.existsSync(this.config.assetsPath)) {
            return;
        }

        const assetsBaseName = path.basename(this.config.assetsPath);
        const outputAssetsDir = path.join(this.config.outputPath, assetsBaseName);

        if (!fs.existsSync(outputAssetsDir)) {
            fs.mkdirSync(outputAssetsDir, {recursive: true});
        }

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

        copyRecursively(this.config.assetsPath, outputAssetsDir);
    }

    // 生成站点
    async generate() {
        // 确保输出目录存在
        if (!fs.existsSync(this.config.outputPath)) {
            fs.mkdirSync(this.config.outputPath, {recursive: true});
        }

        // 先处理资源打包和复制
        await this.copyAssets();

        // 处理所有 Markdown 文件
        await this.processDirectory(this.config.sourcePath);
    }
}

module.exports = SiteGenerator;