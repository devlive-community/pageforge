const path = require('path');
const fs = require('fs');
const {promisify} = require('util');
const mkdirp = require('mkdirp');
const {spawnSync} = require('child_process');

const mkdir = promisify(fs.mkdir);

class CreateSiteCommand {
    async execute(sitePath) {
        try {
            // 规范化路径
            const targetPath = path.resolve(process.cwd(), sitePath);

            // 检查目录是否已存在
            if (fs.existsSync(targetPath)) {
                if (fs.readdirSync(targetPath).length > 0) {
                    throw new Error('Target directory is not empty');
                }
            }
            else {
                // 创建目标目录
                await mkdirp(targetPath);
            }

            // 切换到目标目录并执行 init 命令
            process.chdir(targetPath);
            const result = spawnSync('pageforge', ['init'], {
                stdio: 'inherit',
                shell: true
            });

            if (result.status !== 0) {
                throw new Error('Failed to initialize site');
            }

            console.log(`
Site created successfully at: ${targetPath}

Next steps:
1. cd ${sitePath}
2. pageforge serve   # Start development server
`);

        }
        catch (error) {
            throw new Error(`Failed to create site: ${error.message}`);
        }
    }
}

module.exports = CreateSiteCommand;