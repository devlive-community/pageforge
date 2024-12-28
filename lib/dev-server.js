const express = require('express');
const chokidar = require('chokidar');
const path = require('path');
const SiteGenerator = require('./site-generator');

class DevServer {
    constructor(config) {
        this.config = config;
        this.app = express();
        this.generator = new SiteGenerator(config);
    }

    async start() {
        // 首先构建一次
        await this.generator.generate();

        // 设置静态文件服务
        this.app.use(express.static(this.config.outputPath));

        // 监听文件变化
        const watcher = chokidar.watch([
            path.join(this.config.sourcePath, '**/*.md'),
            path.join(this.config.templatePath, '**/*.ejs'),
            this.config.assetsPath
        ], {
            ignored: /(^|[\/\\])\../,
            persistent: true
        });

        watcher.on('change', async (path) => {
            console.log(`File ${path} has been changed`);
            await this.generator.generate();
            console.log('Site rebuilt');
        });

        // 启动服务器
        this.app.listen(3000);
    }
}

module.exports = DevServer;