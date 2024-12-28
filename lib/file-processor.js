const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const {marked} = require('marked');

class FileProcessor {
    constructor(sourcePath, outputPath) {
        this.sourcePath = sourcePath;
        this.outputPath = outputPath;
    }

    // 读取并解析 Markdown 文件
    processMarkdown(filePath) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const {data, content: markdownContent} = matter(content);
        const html = marked.parse(markdownContent);
        return {metadata: data, content: html};
    }

    // 复制静态资源
    copyAssets(assetPath) {
        const destPath = path.join(this.outputPath, path.basename(assetPath));
        fs.copyFileSync(assetPath, destPath);
    }
}

module.exports = FileProcessor