const path = require('path');
const fs = require('fs');
const {spawnSync} = require('child_process');

class DeployGithubCommand {
    constructor(configManager) {
        this.configManager = configManager;
    }

    async execute() {
        try {
            const config = this.configManager.getConfig();

            // 检查必要的配置
            if (!config.deploy || !config.deploy.github) {
                throw new Error('🤯 在 pageforge.yaml 中未找到 GitHub 部署配置');
            }

            const {
                repository,
                branch = 'gh-pages',
                cname,
                buildDir = 'dist',
                version
            } = config.deploy.github;

            if (!repository) {
                throw new Error('🤯 配置中需要 GitHub 存储库 URL');
            }

            // 确保构建目录存在
            const buildPath = path.resolve(process.cwd(), buildDir);
            if (!fs.existsSync(buildPath)) {
                throw new Error(`🤯 找不到生成目录 '${buildDir}'。请先运行 'pageforge build'。`);
            }

            // 如果指定了版本，检查之前的版本是否存在
            if (version) {
                // 克隆已有的 gh-pages 分支
                const tempDir = path.join(process.cwd(), '.temp-gh-pages');
                if (fs.existsSync(tempDir)) {
                    fs.rmSync(tempDir, { recursive: true });
                }

                try {
                    this.execCommand('git', ['clone', '--branch', branch, '--single-branch', repository, tempDir]);

                    // 如果存在旧版本目录，将其复制到新的构建目录
                    const versionsDir = path.join(tempDir);
                    if (fs.existsSync(versionsDir)) {
                        // 复制所有其他版本的文件
                        fs.readdirSync(versionsDir).forEach(dir => {
                            if (dir !== version && !dir.startsWith('.')) {
                                fs.cpSync(path.join(versionsDir, dir), path.join(buildPath, dir), { recursive: true });
                            }
                        });
                    }

                    // 清理临时目录
                    fs.rmSync(tempDir, { recursive: true });
                } catch (error) {
                    console.log('📝 首次部署或获取已有版本失败，继续部署当前版本');
                }
            }

            // 初始化临时 git 仓库
            this.execCommand('git', ['init'], {cwd: buildPath});

            // 如果配置了 CNAME，创建 CNAME 文件
            if (cname) {
                fs.writeFileSync(path.join(buildPath, 'CNAME'), cname);
                console.log(`✔ 创建 CNAME 文件 ${cname}`);
            }

            // 配置 git
            this.execCommand('git', ['config', 'user.name', config.deploy.github.username || 'PageForge Deploy']);
            this.execCommand('git', ['config', 'user.email', config.deploy.github.email || 'no-reply@localhost']);

            // 添加所有文件
            this.execCommand('git', ['add', '-A'], {cwd: buildPath});

            // 提交变更
            const timestamp = new Date().toISOString();
            const commitMessage = version
                ? `Deploy version ${version} to GitHub Pages - ${timestamp}`
                : `Deploy to GitHub Pages - ${timestamp} - by PageForge`;
            this.execCommand('git', ['commit', '-m', commitMessage], {cwd: buildPath});

            // 添加远程仓库
            this.execCommand('git', ['remote', 'add', 'origin', repository], {cwd: buildPath});

            // 推送到指定分支，使用 force 以覆盖已有内容
            console.log(`✨ 正在推送到 ${branch} 分支...`);
            this.execCommand('git', ['push', '--force', 'origin', `master:${branch}`], {cwd: buildPath});

            console.log(`
🎉 已成功部署到 GitHub Pages！
    您的网站应该很快就会在以下网址可用：
    ${this.getPublicUrl(repository, cname)}${version ? `/${version}` : ''}
`);

        }
        catch (error) {
            throw new Error(`🤯 部署 GitHub Pages 失败： ${error.message}`);
        }
    }

    execCommand(command, args, options = {}) {
        const result = spawnSync(command, args, {
            stdio: 'inherit',
            ...options
        });

        if (result.status !== 0) {
            throw new Error(`🤯 命令 '${command} ${args.join(' ')}' 无效`);
        }
    }

    getPublicUrl(repository, cname) {
        if (cname) {
            return `https://${cname}`;
        }

        // 从 repository URL 提取用户名和仓库名
        const match = repository.match(/github\.com[:/]([^/]+)\/([^/.]+)(?:\.git)?$/);
        if (!match) {
            return '🤯 无法解析 GitHub 存储库 URL';
        }

        const [, username, repo] = match;
        return `https://${username}.github.io/${repo}`;
    }
}

module.exports = DeployGithubCommand;