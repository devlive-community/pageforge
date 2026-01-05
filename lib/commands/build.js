const path = require('path');
const fs = require('fs');
const SiteGenerator = require('../site-generator');

class BuildCommand {
    constructor(configManager) {
        this.configManager = configManager;
        this.cwd = process.cwd();
    }

    async execute(options = {}) {
        const startTime = Date.now();

        try {
            let config = this.configManager.getConfig();

            // 检查是否存在自定义配置文件
            const customConfigPath = path.join(this.cwd, 'pageforge.config.js');
            if (fs.existsSync(customConfigPath)) {
                const customConfig = require(customConfigPath);
                config = {...config, ...customConfig};
            }

            // 合并命令行选项
            config = {
                ...config,
                ...options
            };

            // 如果配置中有 versions 且当前不是在构建特定版本
            // 则将输出路径修改为 current 目录
            if (config.versions && !config.version) {
                config.outputPath = path.join(config.outputPath, 'current');
                config.version = 'current';
                this.configManager.updateConfig(config);
            }
            else if (config.version) {
                config.outputPath = path.join(config.outputPath, config.version);
                this.configManager.updateConfig(config);
            }

            const generator = new SiteGenerator(config);
            await generator.generate();

            const duration = ((Date.now() - startTime) / 1000).toFixed(2);
            console.log(`🎉 项目编译完成，耗时: ${duration}s`);
        }
        catch (error) {
            throw new Error(`Build failed: ${error.message}`);
        }
    }
}

module.exports = BuildCommand;