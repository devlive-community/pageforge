const path = require('path');
const DevServer = require('../dev-server');

class ServeCommand {
    constructor(configManager) {
        this.configManager = configManager;
    }

    async execute(options = {}) {
        try {
            const config = this.configManager.getConfig();

            // 合并命令行参数到配置
            const serverConfig = {
                ...config,
                port: options.port || config.port || 3000
            };

            const server = new DevServer(serverConfig);
            await server.start();
        }
        catch (error) {
            throw new Error(`🤯 启动服务失败 ${error.message}`);
        }
    }
}

module.exports = ServeCommand;