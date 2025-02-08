const minify = require('html-minifier').minify;

class HtmlMinifier {
    constructor(config) {
        // 设置基础压缩选项
        const baseOptions = {
            collapseWhitespace: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            minifyCSS: true,
            minifyJS: true,
            processConditionalComments: true,
            collapseBooleanAttributes: true,
            removeAttributeQuotes: true,
            removeOptionalTags: true
        };

        // 合并用户配置
        this.options = config.feature?.compress?.enable ?
            {...baseOptions, ...config.feature.compress.options} :
            false;
    }

    /**
     * 压缩 HTML 内容
     * @param {string} html 要压缩的 HTML 内容
     * @param {string} [filePath] 文件路径（用于日志输出）
     * @returns {string} 压缩后的 HTML 内容
     */
    compress(html, filePath = '') {
        if (!this.options) {
            return html;
        }

        try {
            const compressedHtml = minify(html, this.options);
            if (filePath) {
                console.log(`🗜️  压缩 ${filePath} 完成`);
            }
            return compressedHtml;
        }
        catch (error) {
            if (filePath) {
                console.warn(`⚠️  压缩 ${filePath} 失败: ${error.message}`);
            }
            return html;
        }
    }

    /**
     * 检查压缩功能是否启用
     * @returns {boolean}
     */
    isEnabled() {
        return !!this.options;
    }
}

module.exports = HtmlMinifier;