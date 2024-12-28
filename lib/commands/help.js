const chalk = require('chalk');

class HelpCommand {
    constructor() {
        // 命令配置对象
        this.commands = {
            'create-site': {
                description: '在指定路径创建新项目',
                usage: 'pageforge create-site <site-path>',
                args: [
                    {name: 'site-path', description: '即将创建项目的路径，如果是 . 则在当前目录下创建'}
                ]
            },
            'init': {
                description: '初始化项目',
                usage: 'pageforge init'
            },
            'serve': {
                description: '启动本地服务器',
                usage: 'pageforge serve',
                options: [
                    {flag: '--port', description: '启动的端口号（默认为 3000）'}
                ]
            },
            'build': {
                description: '构建项目',
                usage: 'pageforge build'
            },
            'deploy-github': {
                description: '部署到 GitHub Pages',
                usage: 'pageforge deploy-github'
            }
        };

        // 示例配置对象
        this.examples = [
            {
                description: '创建一个名为 my-blog 的项目',
                command: 'pageforge create-site my-blog'
            }
        ];
    }

    formatHelp() {
        const sections = [];

        // 标题部分
        sections.push(chalk.bold('\nPageForge - 优秀的现代化的静态网站生成器\n'));

        // 命令部分
        sections.push(chalk.bold('可用命令:'));
        Object.entries(this.commands).forEach(([name, info]) => {
            sections.push(`    ${chalk.green(name.padEnd(20))} ${info.description}`);

            // 如果有参数，显示参数信息
            if (info.args) {
                info.args.forEach(arg => {
                    sections.push(`        ${chalk.yellow(arg.name.padEnd(18))} ${arg.description}`);
                });
            }

            // 如果有选项，显示选项信息
            if (info.options) {
                info.options.forEach(option => {
                    sections.push(`        ${chalk.blue(option.flag.padEnd(18))} ${option.description}`);
                });
            }
        });

        sections.push('\n' + chalk.bold('示例:'));
        this.examples.forEach(example => {
            sections.push(`    # ${example.description}`);
            sections.push(`    ${chalk.cyan(example.command)}\n`);
        });

        return sections.join('\n');
    }

    execute(command) {
        if (command && this.commands[command]) {
            // 显示特定命令的帮助信息
            const cmd = this.commands[command];
            const sections = [
                chalk.bold(`\n${command} - ${cmd.description}\n`),
                chalk.bold('使用方式:'),
                `    ${chalk.cyan(cmd.usage)}\n`
            ];

            if (cmd.args) {
                sections.push(chalk.bold('参数:'));
                cmd.args.forEach(arg => {
                    sections.push(`    ${chalk.yellow(arg.name.padEnd(20))} ${arg.description}`);
                });
                sections.push('');
            }

            if (cmd.options) {
                sections.push(chalk.bold('选项:'));
                cmd.options.forEach(option => {
                    sections.push(`    ${chalk.blue(option.flag.padEnd(20))} ${option.description}`);
                });
                sections.push('');
            }

            console.log(sections.join('\n'));
        }
        else {
            // 显示通用帮助信息
            console.log(this.formatHelp());
        }
    }
}

module.exports = HelpCommand;