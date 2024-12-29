const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const {marked} = require('marked');
const {loadComponent} = require('./component-loader');

class FileProcessor {
    constructor(sourcePath, outputPath) {
        this.sourcePath = sourcePath;
        this.outputPath = outputPath;
    }

    // 读取并解析 Markdown 文件
    processMarkdown(filePath) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const {data, content: markdownContent} = matter(content);

        const renderer = {
            paragraph({tokens, raw, type}) {
                // 标记已经是链接格式的内容，避免被重复解析为文本
                const linkRegex = /\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\s*(?:"(.*?)")?\)/g;
                let matches = [...raw.matchAll(linkRegex)];

                tokens = tokens.map(token => {
                    token.raw = raw;
                    // 检查token是否是链接的一部分
                    for (const match of matches) {
                        if (match[0].includes(token.raw)) {
                            token.isLink = true;  // 标记这个token是链接的一部分
                            break;
                        }
                    }
                    return token;
                });

                return `<p>${this.parser.parseInline(tokens)}</p>\n`;
            },
            heading(item) {
                return loadComponent(`h${item.depth}`, {
                    text: item.text
                });
            },
            space(item) {
                return loadComponent('space');
            },
            hr(item) {
                return loadComponent('hr');
            },
            text(item) {
                if (item.isLink) {
                    return '';
                }

                return loadComponent('p', {
                    text: item.text
                });
            },
            link(item) {
                return loadComponent('a', {
                    linkItem: {
                        ...item,
                        raw: item.raw  // 保留原始 markdown 文本
                    }
                });
            },
            image(item) {
                console.log(item)
                return loadComponent('image', {
                    imageItem: {item}
                });
            },
            list(item) {
                return loadComponent('list', {
                    item
                });
            }
        };

        const html = marked(markdownContent, {
            renderer: renderer,
        });

        return {metadata: data, content: html};
    }

    // 复制静态资源
    copyAssets(assetPath) {
        const destPath = path.join(this.outputPath, path.basename(assetPath));
        fs.copyFileSync(assetPath, destPath);
    }
}

module.exports = FileProcessor