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
            heading(item) {
                return loadComponent(`h${item.depth}`, {
                    checked: item.checked,
                    text: item.text
                });
            },
            space(item) {
                return loadComponent('space');
            },
            hr(item) {
                return loadComponent('hr');
            },
            paragraph(item) {
                return loadComponent('p', {
                    text: item.text
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