#!/usr/bin/env node

const yaml = require('js-yaml');
const path = require('path');
const fs = require('fs');
const SiteGenerator = require('../lib/site-generator');

const getConfig = () => {
    let config = defaultConfig;
    const yamlConfigPath = path.join(cwd, 'pageforge.yaml');

    if (fs.existsSync(yamlConfigPath)) {
        try {
            const yamlConfig = yaml.load(fs.readFileSync(yamlConfigPath, 'utf8'));
            // 转换路径配置为绝对路径
            const pathKeys = ['source_path', 'output_path', 'template_path', 'assets_path'];
            pathKeys.forEach(key => {
                if (yamlConfig[key]) {
                    yamlConfig[key] = path.join(cwd, yamlConfig[key]);
                }
            });

            // 将 snake_case 转换为 camelCase
            config = {
                ...defaultConfig,
                sourcePath: yamlConfig.source_path,
                outputPath: yamlConfig.output_path,
                templatePath: yamlConfig.template_path,
                assetsPath: yamlConfig.assets_path,
                site: yamlConfig.site,
                nav: yamlConfig.nav
            };
        }
        catch (err) {
            console.error('Error parsing pageforge.yaml:', err);
            process.exit(1);
        }
    }
    return config;
};

// 获取当前工作目录
const cwd = process.cwd();

// 默认配置
const defaultConfig = {
    sourcePath: path.join(cwd, 'content'),
    // outputPath: path.join(cwd, 'dist'),
    templatePath: path.join(cwd, 'templates'),
    assetsPath: path.join(cwd, 'assets')
};

// 解析命令行参数
const args = process.argv.slice(2);
const command = args[0];

async function main() {

    const config = getConfig();

    switch (command) {
        case 'build':
            try {
                // 检查是否存在自定义配置文件
                let config = defaultConfig;
                const customConfigPath = path.join(cwd, 'pageforge.config.js');

                if (require('fs').existsSync(customConfigPath)) {
                    const customConfig = require(customConfigPath);
                    config = {...defaultConfig, ...customConfig};
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
                console.log('Development server started at http://localhost:3000');
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
                const configContent = `# PageForge 配置文件
source_path: content
output_path: dist
template_path: templates  # 可选，不创建也能工作
assets_path: assets

site:
  title: My PageForge Site
  description: A static site built with PageForge

# 导航配置
nav:
  - url: /
    text: 首页
  - url: /about.html
    text: 关于`;

                if (!fs.existsSync('pageforge.yaml')) {
                    fs.writeFileSync(
                        path.join(cwd, 'pageforge.yaml'),
                        configContent
                    );
                }

                // 创建示例内容
                const markdownContent = `---
title: 欢迎使用 PageForge
---
# 欢迎使用 PageForge

This is your first page!`;

                if (!fs.existsSync('content/index.md')) {
                    fs.writeFileSync(
                        path.join(cwd, 'content', 'index.md'),
                        markdownContent
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
            console.log(`
PageForge - Static Site Generator

Commands:
  init    Initialize a new PageForge project
  build   Build the static site
`);
            break;
    }
}

main();