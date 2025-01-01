const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const DirectoryProcessor = require('./directory-processor');
const AssetBundler = require('./asset-bundler');

class SiteGenerator {
    constructor(config) {
        this.configPath = path.join(process.cwd(), 'pageforge.yaml');
        this.initializeWithConfig(config);
    }

    initializeWithConfig(config) {
        this.config = config;
        this.directoryProcessor = new DirectoryProcessor(this.config, config.sourcePath, config.outputPath);

        this.config.templatePath = path.join(path.join(__dirname, '../templates'));
        this.assetBundler = new AssetBundler(this.config);
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

        // 处理数据
        await this.directoryProcessor.processLanguageDirectory(this.config.sourcePath);
    }
}

module.exports = SiteGenerator;