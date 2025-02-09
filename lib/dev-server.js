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
        await this.generator.generate();
        console.log('🎉 项目编译完成');

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
            if (filepath.endsWith('pageforge.yaml')) {
                console.log('📝 配置文件已更新，重新加载配置并重新编译...');
                await this.generator.reloadConfig();
            }
            else {
                console.log(`📄 文件 ${filepath} 已更新，正在重新编译...`);
            }

            await this.generator.generate();
            console.log('✓ 项目重新编译完成');
        }
        catch (error) {
            console.error('🤯 项目文件重新编译失败 ', error);
        }
    }
}

module.exports = DevServer;