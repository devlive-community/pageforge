const yaml = require('js-yaml');
const path = require('path');
const fs = require('fs');

class ConfigManager {
    constructor(cwd) {
        this.cwd = cwd;
        this.defaultConfig = {
            sourcePath: path.join(cwd, 'content'),
            templatePath: path.join(cwd, 'templates'),
            assetsPath: path.join(cwd, 'assets'),
            outputPath: path.join(cwd, 'dist')
        };
        // 定义需要转换为绝对路径的键
        this.pathKeys = ['source_path', 'output_path', 'template_path', 'assets_path'];
    }

    // 将 snake_case 转换为 camelCase
    toCamelCase(str) {
        return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
    }

    // 递归转换对象的键名从 snake_case 到 camelCase
    transformKeys(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        if (Array.isArray(obj)) {
            return obj.map(item => this.transformKeys(item));
        }

        return Object.keys(obj).reduce((acc, key) => {
            const camelKey = this.toCamelCase(key);

            // 如果是路径配置，转换为绝对路径
            if (this.pathKeys.includes(key)) {
                acc[camelKey] = path.join(this.cwd, obj[key]);
            }
            else {
                // 递归转换嵌套对象
                acc[camelKey] = this.transformKeys(obj[key]);
            }

            return acc;
        }, {});
    }

    getConfig() {
        let config = this.defaultConfig;
        const yamlConfigPath = path.join(this.cwd, 'pageforge.yaml');

        if (fs.existsSync(yamlConfigPath)) {
            try {
                const yamlConfig = yaml.load(fs.readFileSync(yamlConfigPath, 'utf8'));
                // 转换所有配置项
                const transformedConfig = this.transformKeys(yamlConfig);

                // 合并配置
                config = {
                    ...this.defaultConfig,
                    ...transformedConfig
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