const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const ExampleReader = require('../example-reader');

class InitCommand {
    constructor() {
        this.exampleReader = new ExampleReader();
        this.cwd = process.cwd();
    }

    async execute() {
        try {
            const files = fs.readdirSync(this.cwd);
            if (files.length > 0) {
                throw new Error('🤯  当前目录不为空，无法初始化项目');
            }

            await this.createDirectories();
            await this.createConfigFile();
            await this.createExampleContent();

            console.log('\n🎉  项目初始化完成!');
            console.log('\n📄  您可以通过在 templates 目录中创建匹配的文件来覆盖默认模板.');
        }
        catch (error) {
            throw new Error(`${error.message}`);
        }
    }

    async createDirectories() {
        const dirs = ['content', 'templates'];

        for (const dir of dirs) {
            if (!fs.existsSync(dir)) {
                await mkdirp(dir);
                console.log(`✔ 初始化 ${dir} 文件夹`);
            }
        }
    }

    async createConfigFile() {
        // 创建 pageforge.yaml 配置文件
        if (!fs.existsSync('pageforge.yaml')) {
            const configContent = this.exampleReader.readExampleConfig();
            await fs.promises.writeFile(
                path.join(this.cwd, 'pageforge.yaml'),
                configContent
            );
            console.log('✔ 初始化 pageforge.yaml 配置文件');
        }
    }

    async createExampleContent() {
        // 创建示例内容
        if (!fs.existsSync('content/index.md')) {
            const indexContent = this.exampleReader.readExampleMarkdown();
            await fs.promises.writeFile(
                path.join(this.cwd, 'content', 'index.md'),
                indexContent
            );
            console.log('✔ 初始化 content/index.md 示例文件');
        }
    }
}

module.exports = InitCommand;