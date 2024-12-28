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
                throw new Error('GitHub deployment configuration not found in pageforge.yaml');
            }

            const {
                repository,
                branch = 'gh-pages',
                cname,
                buildDir = 'dist'
            } = config.deploy.github;

            if (!repository) {
                throw new Error('GitHub repository URL is required in configuration');
            }

            // 确保构建目录存在
            const buildPath = path.resolve(process.cwd(), buildDir);
            if (!fs.existsSync(buildPath)) {
                throw new Error(`Build directory '${buildDir}' not found. Please run 'pageforge build' first.`);
            }

            console.log('Starting deployment to GitHub Pages...');

            // 初始化临时 git 仓库
            this.execCommand('git', ['init'], {cwd: buildPath});

            // 如果配置了 CNAME，创建 CNAME 文件
            if (cname) {
                fs.writeFileSync(path.join(buildPath, 'CNAME'), cname);
                console.log(`Created CNAME file for ${cname}`);
            }

            // 配置 git
            this.execCommand('git', ['config', 'user.name', config.deploy.github.username || 'PageForge Deploy']);
            this.execCommand('git', ['config', 'user.email', config.deploy.github.email || 'no-reply@localhost']);

            // 添加所有文件
            this.execCommand('git', ['add', '-A'], {cwd: buildPath});

            // 提交变更
            const timestamp = new Date().toISOString();
            this.execCommand('git', ['commit', '-m', `Deploy to GitHub Pages - ${timestamp}`], {cwd: buildPath});

            // 添加远程仓库
            this.execCommand('git', ['remote', 'add', 'origin', repository], {cwd: buildPath});

            // 推送到指定分支，使用 force 以覆盖已有内容
            console.log(`Pushing to ${branch} branch...`);
            this.execCommand('git', ['push', '--force', 'origin', `master:${branch}`], {cwd: buildPath});

            console.log(`
Successfully deployed to GitHub Pages!
Your site should be available soon at:
${this.getPublicUrl(repository, cname)}
`);

        }
        catch (error) {
            throw new Error(`Deployment failed: ${error.message}`);
        }
    }

    execCommand(command, args, options = {}) {
        const result = spawnSync(command, args, {
            stdio: 'inherit',
            ...options
        });

        if (result.status !== 0) {
            throw new Error(`Command '${command} ${args.join(' ')}' failed`);
        }
    }

    getPublicUrl(repository, cname) {
        if (cname) {
            return `https://${cname}`;
        }

        // 从 repository URL 提取用户名和仓库名
        const match = repository.match(/github\.com[:/]([^/]+)\/([^/.]+)(?:\.git)?$/);
        if (!match) {
            return 'URL not available';
        }

        const [, username, repo] = match;
        return `https://${username}.github.io/${repo}`;
    }
}

module.exports = DeployGithubCommand;