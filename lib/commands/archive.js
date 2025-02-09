const path = require('path');
const fs = require('fs-extra');
const yaml = require('js-yaml');
const BuildCommand = require('./build');

class ArchiveCommand {
    constructor(configManager) {
        this.configManager = configManager;
        this.config = configManager.getConfig();
    }

    async execute(version) {
        if (!version) {
            console.error('🤯 版本号不能为空');
            console.log('使用 pageforge archive <version>');
            process.exit(1);
        }

        try {
            // 1. 更新 pageforge.yaml 中的 versions
            const yamlPath = path.join(process.cwd(), 'pageforge.yaml');
            if (await fs.pathExists(yamlPath)) {
                const content = await fs.readFile(yamlPath, 'utf8');
                const lines = content.split('\n');
                const doc = yaml.load(content);

                // 初始化 versions
                if (!doc.versions) {
                    doc.versions = ['current'];
                }

                // 处理版本更新
                if (version !== 'current') {
                    // 如果是新版本且不是 current，添加到数组
                    if (!doc.versions.includes(version)) {
                        doc.versions.push(version);
                    }

                    // 确保 current 在第一位
                    if (!doc.versions.includes('current')) {
                        doc.versions.unshift('current');
                    } else {
                        const currentIndex = doc.versions.indexOf('current');
                        if (currentIndex > 0) {
                            doc.versions.splice(currentIndex, 1);
                            doc.versions.unshift('current');
                        }
                    }

                    // 对非 current 的版本号进行排序
                    const nonCurrentVersions = doc.versions.filter(v => v !== 'current')
                        .sort((a, b) => {
                            const [aMajor, aMinor, aPatch] = a.split('.').map(Number);
                            const [bMajor, bMinor, bPatch] = b.split('.').map(Number);
                            if (aMajor !== bMajor) return bMajor - aMajor;
                            if (aMinor !== bMinor) return bMinor - aMinor;
                            return bPatch - aPatch;
                        });

                    // 重组 versions 数组，保持 current 在第一位
                    doc.versions = ['current', ...nonCurrentVersions];
                }

                // 查找 versions 部分
                let versionsStart = -1;
                let versionsEnd = -1;

                for (let i = 0; i < lines.length; i++) {
                    if (lines[i].trim().startsWith('versions:')) {
                        versionsStart = i;
                    } else if (versionsStart !== -1 &&
                        lines[i].trim() !== '' &&
                        !lines[i].startsWith(' ')) {
                        versionsEnd = i;
                        break;
                    }
                }

                if (versionsEnd === -1) {
                    versionsEnd = lines.length;
                }

                // 生成新的 versions 部分
                const versionsYaml = yaml.dump({ versions: doc.versions }, {
                    indent: 2,
                    lineWidth: -1
                }).split('\n');

                // 更新内容
                if (versionsStart === -1) {
                    // 如果之前没有 versions，添加到末尾
                    if (lines[lines.length - 1] !== '') {
                        lines.push('');
                    }
                    lines.push(...versionsYaml);
                } else {
                    // 替换已有的 versions 部分
                    lines.splice(versionsStart, versionsEnd - versionsStart, ...versionsYaml);
                }

                // 写回文件
                await fs.writeFile(yamlPath, lines.join('\n'));
            }

            // 2. 更新版本号
            const config = this.configManager.getConfig();
            config.version = version;
            this.configManager.updateConfig(config);

            // 3. 执行构建
            const buildCommand = new BuildCommand(this.configManager);
            await buildCommand.execute();
            console.log(`✓ 版本 ${version} 归档完成`);
        }
        catch (error) {
            console.error(`✗ 版本归档失败: ${error.message}`);
            console.error(error);
            process.exit(1);
        }
    }
}

module.exports = ArchiveCommand;