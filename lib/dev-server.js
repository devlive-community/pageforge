const express = require('express');
const chokidar = require('chokidar');
const path = require('path');
const SiteGenerator = require('./site-generator');

class DevServer {
    constructor(config) {
        this.config = config;
        this.app = express();
        this.generator = new SiteGenerator(config);
        this.watcher = null;
    }

    async start() {
        // 首先构建一次
        const startTime = Date.now();
        await this.generator.generate();
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`🎉 项目编译完成，耗时: ${duration}s`);

        const home = this.config?.version ? this.config.outputPath.replace(this.config.version, '') : this.config.outputPath;
        // 设置静态文件服务
        this.app.use(express.static(home));

        // 监听文件变化
        const watchPaths = [
            this.config.sourcePath,       // 监听整个源文件目录
            this.config.templatePath,     // 监听整个模板目录
            this.config.assetsPath,        // 监听资源目录
            path.join(__dirname, '..', 'templates'),
            path.join(process.cwd(), 'pageforge.yaml')
        ].filter(Boolean);  // 过滤掉 undefined 或 null 的路径

        console.log('\n✨ 监听文件路径 ', watchPaths);

        this.watcher = chokidar.watch(watchPaths, {
            ignored: /(^|[\/\\])\../, // 忽略点文件
            persistent: true,
            ignoreInitial: true,      // 忽略初始扫描事件
            awaitWriteFinish: {       // 等待写入完成
                stabilityThreshold: 300,
                pollInterval: 100
            }
        });

        // 监听所有文件事件
        this.watcher
            .on('add', this.handleFileChange.bind(this))
            .on('change', this.handleFileChange.bind(this))
            .on('unlink', this.handleFileChange.bind(this))
            .on('error', error => console.error('🤯 监听文件变化失败 ', error));

        // 启动服务器
        const server = this.app.listen(this.config.port, () => {
            console.log(`🎉 服务已启动，访问 http://localhost:${this.config.port}`);
            console.log('\n✨ 监听文件变化 ...');
        });

        // 处理进程终止
        process.on('SIGINT', async () => {
            console.log('\n👋 服务已关闭');
            await this.watcher.close();
            server.close();
            process.exit(0);
        });
    }

    async handleFileChange(filepath) {
        try {
            const startTime = Date.now();

            // 配置文件或模板文件变化 - 全量编译
            if (filepath.endsWith('pageforge.yaml') ||
                filepath.includes('/templates/') ||
                filepath.includes('\\templates\\')) {
                console.log('📝 配置/模板文件已更新，全量重新编译...');
                if (filepath.endsWith('pageforge.yaml')) {
                    await this.generator.reloadConfig();
                }
                await this.generator.generate();
            }
            // Markdown 文件变化 - 增量编译
            else if (filepath.endsWith('.md')) {
                console.log(`📄 Markdown 文件已更新: ${filepath}`);
                await this.compileSingleMarkdown(filepath);
            }
            // 资源文件变化 - 复制资源
            else if (this.config.assetsPath && filepath.startsWith(this.config.assetsPath)) {
                console.log(`📦 资源文件已更新: ${filepath}`);
                await this.generator.copyAssets();
            }
            // 其他文件 - 全量编译
            else {
                console.log(`📄 文件已更新: ${filepath}，全量重新编译...`);
                await this.generator.generate();
            }

            const duration = ((Date.now() - startTime) / 1000).toFixed(2);
            console.log(`✓ 编译完成，耗时: ${duration}s`);
        }
        catch (error) {
            console.error('🤯 编译失败:', error);
        }
    }

    async compileSingleMarkdown(filepath) {
        const fs = require('fs');

        // 检查文件是否在源目录中
        if (!filepath.startsWith(this.config.sourcePath)) {
            console.log('文件不在源目录中，跳过编译');
            return;
        }

        // 计算相对路径
        const relativePath = path.relative(this.config.sourcePath, filepath);
        const sourceDir = path.dirname(filepath);
        const filename = path.basename(filepath);

        // 判断是否启用国际化
        if (this.config.feature?.i18n?.enable) {
            // 多语言模式 - 为每个语言编译
            const locales = Object.keys(this.config.i18n || {}).filter(key => key !== 'default');
            for (const locale of locales) {
                const relativeDir = path.relative(this.config.sourcePath, sourceDir);
                const baseDir = path.join(locale, relativeDir);
                await this.generator.directoryProcessor.fileProcessor.processMarkdownFile(
                    sourceDir,
                    baseDir,
                    filename,
                    locale,
                    this.config.sourcePath
                );
            }
        } else {
            // 单语言模式
            const relativeDir = path.relative(this.config.sourcePath, sourceDir);
            await this.generator.directoryProcessor.fileProcessor.processMarkdownFile(
                sourceDir,
                relativeDir,
                filename,
                '',
                this.config.sourcePath
            );
        }
    }
}

module.exports = DevServer;