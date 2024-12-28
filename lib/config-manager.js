const yaml = require('js-yaml');
const path = require('path');
const fs = require('fs');

class ConfigManager {
    constructor(cwd) {
        this.cwd = cwd;
        this.defaultConfig = {
            sourcePath: path.join(cwd, 'content'),
            templatePath: path.join(cwd, 'templates'),
            assetsPath: path.join(cwd, 'assets')
        };
    }

    getConfig() {
        let config = this.defaultConfig;
        const yamlConfigPath = path.join(this.cwd, 'pageforge.yaml');

        if (fs.existsSync(yamlConfigPath)) {
            try {
                const yamlConfig = yaml.load(fs.readFileSync(yamlConfigPath, 'utf8'));
                // 转换路径配置为绝对路径
                const pathKeys = ['source_path', 'output_path', 'template_path', 'assets_path'];
                pathKeys.forEach(key => {
                    if (yamlConfig[key]) {
                        yamlConfig[key] = path.join(this.cwd, yamlConfig[key]);
                    }
                });

                // 将 snake_case 转换为 camelCase
                config = {
                    ...this.defaultConfig,
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
    }
}

module.exports = ConfigManager;