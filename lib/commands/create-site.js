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
                    throw new Error('🤯  目标路径不为空，无法创建站点');
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
                throw new Error('🤯  创建站点失败');
            }

            console.log(`
🎉  项目创建完成 ${targetPath}

👉 接下来可以执行以下命令启动开发服务器:
      1. 进入目录 ${sitePath}
      2. pageforge serve   # 启动本地服务器
`);

        }
        catch (error) {
            throw new Error(`${error.message}`);
        }
    }
}

module.exports = CreateSiteCommand;