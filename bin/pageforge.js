#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const ConfigManager = require('../lib/config-manager');
const SiteGenerator = require('../lib/site-generator');
const ExampleReader = require('../lib/example-reader');
const CreateSiteCommand = require('../lib/commands/create-site');
const DeployGithubCommand = require('../lib/commands/deploy-github');
const HelpCommand = require('../lib/commands/help');

// 获取当前工作目录
const cwd = process.cwd();

// 解析命令行参数
const args = process.argv.slice(2);
const command = args[0];

async function main() {
    const configManager = new ConfigManager(cwd);
    const config = configManager.getConfig();
    const exampleReader = new ExampleReader();

    switch (command) {
        case 'create-site':
            try {
                const sitePath = args[1];
                if (!sitePath) {
                    console.error('Error: Site path is required');
                    console.log('Usage: pageforge create-site <site-path>');
                    process.exit(1);
                }

                const createSite = new CreateSiteCommand();
                await createSite.execute(sitePath);
            }
            catch (error) {
                console.error('Error creating site:', error.message);
                process.exit(1);
            }
            break;

        case 'deploy-github':
            try {
                const deployGithub = new DeployGithubCommand(configManager);
                await deployGithub.execute();
            }
            catch (error) {
                console.error('Error deploying to GitHub Pages:', error.message);
                process.exit(1);
            }
            break;

        case 'build':
            try {
                // 检查是否存在自定义配置文件
                const customConfigPath = path.join(cwd, 'pageforge.config.js');

                if (fs.existsSync(customConfigPath)) {
                    const customConfig = require(customConfigPath);
                    config = {...config, ...customConfig};
                }

                const generator = new SiteGenerator(config);
                await generator.generate();
                console.log('Site generated successfully!');
            }
            catch (error) {
                console.error('Error generating site:', error);
                process.exit(1);
            }
            break;

        case 'serve':
            try {
                const DevServer = require('../lib/dev-server');
                const server = new DevServer(config);
                await server.start();
            }
            catch (error) {
                console.error('Error starting dev server:', error);
                process.exit(1);
            }
            break;

        case 'init':
            try {
                // 创建必要的目录
                ['content'].forEach(dir => {
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                        console.log(`Created ${dir}/ directory`);
                    }
                });

                // 创建 YAML 配置文件
                if (!fs.existsSync('pageforge.yaml')) {
                    fs.writeFileSync(
                        path.join(cwd, 'pageforge.yaml'),
                        exampleReader.readExampleConfig()
                    );
                }

                // 创建示例内容
                if (!fs.existsSync('content/index.md')) {
                    fs.writeFileSync(
                        path.join(cwd, 'content', 'index.md'),
                        exampleReader.readExampleMarkdown()
                    );
                }

                console.log('Project initialized successfully!');
                console.log('\nTip: You can override default templates by creating matching files in your templates/ directory');
            }
            catch (error) {
                console.error('Error initializing project:', error);
                process.exit(1);
            }
            break;

        default:
            const help = new HelpCommand();
            help.execute();
            break;
    }
}

main();