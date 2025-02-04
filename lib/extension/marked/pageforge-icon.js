const {loadComponent} = require("../../component-loader");
const ConfigManager = require("../../config-manager");
const config = new ConfigManager(process.cwd()).getConfig();

const PageForgeIconExtension = {
    name: 'pageforgeIcon',
    level: 'inline',

    start(src) {
        if (!config.feature?.lucide?.enable) {
            return -1;
        }

        // 匹配 :icon: 或 :icon{params}: 格式
        const pattern = /:[a-zA-Z-]+(?:{[^}]+})?:/;
        const match = src.match(pattern);

        if (match) {
            // 检查是否在代码块内
            const beforeText = src.substring(0, match.index);
            const matches = beforeText.match(/`/g);
            if (matches && matches.length % 2 === 1) {
                return -1;
            }

            return match.index;
        }

        return -1;
    },

    tokenizer(src, tokens) {
        if (!config.feature?.lucide?.enable) {
            return false;
        }

        // 检查是否在代码块内
        if (src.startsWith('`') || src.indexOf('`') > -1) {
            return false;
        }

        // 支持以下格式:
        // 1. :icon-name:
        // 2. :icon-name{size}:
        // 3. :icon-name{size,color}:
        const rule = /^:([a-zA-Z-]+)(?:{([^}]+)})?:/;
        const match = rule.exec(src);

        if (match) {
            const [fullMatch, iconName, params = ''] = match;
            const [size = '20', color = 'currentColor'] = params.split(',').map(p => p.trim());

            return {
                type: 'pageforgeIcon',
                raw: fullMatch,
                iconName: iconName,
                size: size,
                color: color,
                tokens: []
            };
        }
        return false;
    },

    renderer(item) {
        return loadComponent('icon', item);
    }
};

module.exports = PageForgeIconExtension;