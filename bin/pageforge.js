#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const ConfigManager = require('../lib/config-manager');
const CreateSiteCommand = require('../lib/commands/create-site');
const DeployGithubCommand = require('../lib/commands/deploy-github');
const HelpCommand = require('../lib/commands/help');
const InitCommand = require('../lib/commands/init');
const ServeCommand = require('../lib/commands/serve');
const BuildCommand = require('../lib/commands/build');

// 获取当前工作目录
const cwd = process.cwd();

// 解析命令行参数
const args = process.argv.slice(2);
const command = args[0];

async function main() {
    const configManager = new ConfigManager(cwd);
    const config = configManager.getConfig();

    switch (command) {
        case 'create-site':
            try {
                const sitePath = args[1];
                if (!sitePath) {
                    console.error(' 🤯  项目路径不能为空');
                    console.log(' 使用 pageforge create-site <site-path>');
                    process.exit(1);
                }

                const createSite = new CreateSiteCommand();
                await createSite.execute(sitePath);
            }
            catch (error) {
                console.error(error.message);
                process.exit(1);
            }
            break;

        case 'deploy-github':
            try {
                const deployGithub = new DeployGithubCommand(configManager);
                await deployGithub.execute();
            }
            catch (error) {
                console.error(error.message);
                process.exit(1);
            }
            break;

        case 'build':
            const build = new BuildCommand(configManager);
            await build.execute();
            break;

        case 'serve':
            const serveOptions = {
                port: args.includes('--port') ? parseInt(args[args.indexOf('--port') + 1]) : undefined
            };
            const serve = new ServeCommand(configManager);
            await serve.execute(serveOptions);
            break;

        case 'init':
            try {
                const init = new InitCommand();
                await init.execute();
            }
            catch (error) {
                console.error(error.message);
                process.exit(1);
            }
            break;

        default:
            const help = new HelpCommand();
            help.execute(args[1]);
            break;
    }
}

main();