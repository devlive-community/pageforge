const {marked} = require("marked");
const {loadComponent} = require("../../component-loader");
const Prism = require('prismjs');

// Core languages
require('prismjs/components/prism-markup');
require('prismjs/components/prism-css');
require('prismjs/components/prism-clike');
require('prismjs/components/prism-javascript');
require('prismjs/components/prism-markup-templating');

// Common programming languages
require('prismjs/components/prism-python');
require('prismjs/components/prism-java');
require('prismjs/components/prism-c');
require('prismjs/components/prism-cpp');
require('prismjs/components/prism-csharp');
require('prismjs/components/prism-go');
require('prismjs/components/prism-rust');
require('prismjs/components/prism-swift');
require('prismjs/components/prism-kotlin');
require('prismjs/components/prism-php');
require('prismjs/components/prism-ruby');
require('prismjs/components/prism-typescript');
require('prismjs/components/prism-sql');

// Web development
require('prismjs/components/prism-jsx');
require('prismjs/components/prism-tsx');
require('prismjs/components/prism-json');
require('prismjs/components/prism-graphql');
require('prismjs/components/prism-markdown');
require('prismjs/components/prism-yaml');
require('prismjs/components/prism-ejs');

// Shell scripting
require('prismjs/components/prism-bash');
require('prismjs/components/prism-powershell');

// Config & markup
require('prismjs/components/prism-docker');
require('prismjs/components/prism-nginx');

const PageForgeCodeBlockExtension = {
    name: 'pageforgeCodeBlock',
    level: 'block',
    start(src) {
        return src.match(/^```/)?.index;
    },
    tokenizer(src, tokens) {
        const rule = /^```(\w*)\n([\s\S]*?)\n```/;
        const match = rule.exec(src);

        if (match) {
            let language = match[1].toLowerCase();
            const code = match[2].replace(/</g, '&lt;').replace(/>/g, '&gt;');

            // 处理特殊语言映射
            const languageMap = {
                'bash': 'bash',
                'shell': 'bash',
                'sh': 'bash'
            };

            language = languageMap[language] || language;

            try {
                if (Prism.languages[language]) {
                    const highlightedCode = Prism.highlight(
                        code,
                        Prism.languages[language],
                        language
                    );
                    return {
                        type: 'pageforgeCodeBlock',
                        raw: match[0],
                        lang: language,
                        text: highlightedCode,
                        tokens: []
                    };
                }
            } catch (e) {
                console.warn(`Failed to highlight code for language: ${language}`, e);
            }

            return {
                type: 'pageforgeCodeBlock',
                raw: match[0],
                lang: language,
                text: code,
                tokens: []
            };
        }
        return false;
    },
    renderer(item) {
        return loadComponent('block-code', {
            language: item.lang,
            text: item.text
        });
    }
};

module.exports = PageForgeCodeBlockExtension;