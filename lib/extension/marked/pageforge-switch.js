const {loadComponent} = require("../../component-loader");
const ConfigManager = require("../../config-manager");
const config = new ConfigManager(process.cwd()).getConfig();

const PageForgeSwitchExtension = {
    name: 'pageforgeSwitch',
    level: 'inline',

    start(src) {
        if (!config.feature?.switch?.enable) {
            return -1;
        }

        // 匹配 !switch[ 格式
        const pattern = /!switch\[/;
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
        if (!config.feature?.switch?.enable) {
            return false;
        }

        // 检查是否在代码块内
        if (src.startsWith('`') || src.indexOf('`') > -1) {
            return false;
        }

        // 支持的格式:
        // 1. !switch[开关文本](状态){类名}
        // 2. !switch[开关文本](状态)
        // 3. !switch[开关文本]{类名}
        // 4. !switch[开关文本]
        const rule = /^!switch\[(.*?)\](?:\((.*?)\))?(?:{(.*?)})?/;
        const match = rule.exec(src);

        if (match) {
            const [fullMatch, text, state, className] = match;
            // 状态值默认为false，如果提供了状态且为 true、on、1 等则设为true
            const isChecked = state ? ['true', 'on', '1', 'yes'].includes(state.toLowerCase()) : false;

            return {
                type: 'pageforgeSwitch',
                raw: fullMatch,
                text: text,
                state: isChecked,
                className: className || '',
                tokens: []
            };
        }
        return false;
    },

    renderer(item) {
        const switchComponent = loadComponent('switch', item);
        return item.prefix || item.suffix
            ? `${item.prefix || ''}${switchComponent}${item.suffix || ''}`
            : switchComponent;
    }
};

module.exports = PageForgeSwitchExtension;