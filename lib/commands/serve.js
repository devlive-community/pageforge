const path = require('path');
const DevServer = require('../dev-server');

class ServeCommand {
    constructor(configManager) {
        this.configManager = configManager;
    }

    async execute(options = {}) {
        try {
            const config = this.configManager.getConfig();

            // 如果配置中有 versions 且当前不是在构建特定版本
            // 则将输出路径修改为 current 目录
            if (config.versions && !config.version) {
                config.outputPath = path.join(config.outputPath, 'current');
                config.version = 'current';
                this.configManager.updateConfig(config);
            }

            // 合并命令行参数到配置
            const serverConfig = {
                ...config,
                port: options.port || config.port || 3000
            };

            const server = new DevServer(serverConfig);
            await server.start();
        }
        catch (error) {
            console.error(error);
            throw new Error(`🤯 启动服务失败 ${error.message}`);
        }
    }
}

module.exports = ServeCommand;