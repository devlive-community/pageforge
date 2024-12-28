const path = require('path');
const fs = require('fs');
const SiteGenerator = require('../site-generator');

class BuildCommand {
    constructor(configManager) {
        this.configManager = configManager;
        this.cwd = process.cwd();
    }

    async execute(options = {}) {
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

            const generator = new SiteGenerator(config);
            await generator.generate();

            console.log('🎉 项目编译完成');
        }
        catch (error) {
            throw new Error(`Build failed: ${error.message}`);
        }
    }
}

module.exports = BuildCommand;