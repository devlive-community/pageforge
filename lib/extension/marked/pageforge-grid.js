const {loadComponent} = require("../../component-loader");
const ConfigManager = require("../../config-manager");
const config = new ConfigManager(process.cwd()).getConfig();

const PageForgeGridExtension = {
    name: 'pageforgeGrid',
    level: 'block',

    start(src) {
        if (!config.feature?.grid?.enable) {
            return -1;
        }
        const index = src.match(/^:::\s*grid(?:\s+[\w-]+)*\s*\n/m)?.index ?? -1;
        return index;
    },

    tokenizer(src, tokens) {
        if (!config.feature?.grid?.enable) {
            return false;
        }

        const headerMatch = /^:::\s*grid((?:\s+[\w-]+)*)\s*\n/.exec(src);
        if (!headerMatch) {
            return false;
        }

        const endIndex = src.indexOf('\n:::');
        if (endIndex === -1) {
            return false;
        }

        const gridOptions = {
            cols: 2,
            gap: 4,
            responsive: true
        };

        const options = headerMatch[1];
        if (options) {
            options.trim().split(/\s+/).forEach(opt => {
                if (opt.startsWith('cols-')) {
                    gridOptions.cols = parseInt(opt.slice(5));
                }
                else if (opt.startsWith('gap-')) {
                    gridOptions.gap = parseInt(opt.slice(4));
                }
                else if (opt === 'no-responsive') {
                    gridOptions.responsive = false;
                }
            });
        }

        const headerLength = headerMatch[0].length;
        const content = src.slice(headerLength, endIndex);
        const raw = src.slice(0, endIndex + 4);

        const items = content.split(/\n(?=\s*[-*+]|\s*\d+\.)/g)
            .map(item => item.trim())
            .filter(item => item)
            .map(item => {
                return item.replace(/^[-*+]\s+|^\d+\.\s+/, '');
            });

        return {
            type: 'pageforgeGrid',
            raw,
            content: items,
            options: gridOptions,
            tokens: []
        };
    },

    renderer(token) {
        return loadComponent('grid', {
            content: token.content,
            options: token.options,
            config: config.feature?.grid?.options || {}
        });
    }
};

module.exports = PageForgeGridExtension;