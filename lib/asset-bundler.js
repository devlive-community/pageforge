const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

class AssetBundler {
    constructor(config) {
        this.config = config;
        this.defaultAssets = {
            js: path.join(this.config.templatePath, 'assets/js/pageforge.js'),
            css: path.join(this.config.templatePath, 'assets/css/pageforge.css')
        };
    }

    async bundle() {
        await this.bundleJS();
        await this.bundleCSS();
    }

    async bundleJS() {
        try {
            // 检查源文件是否存在
            if (!fs.existsSync(this.defaultAssets.js)) {
                console.log('⚠️ No JS file found at:', this.defaultAssets.js);
                return;
            }

            const outputDir = path.join(this.config.outputPath, 'assets');
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            await esbuild.build({
                entryPoints: [this.defaultAssets.js],
                bundle: true,
                minify: true,
                sourcemap: false,
                outfile: path.join(outputDir, 'pageforge.min.js'),
                target: ['es2018'],
                loader: { '.js': 'js' },
                logLevel: 'info'
            });

            console.log('✓ JS bundle created successfully');
        } catch (error) {
            console.error('✗ Error bundling JS:', error);
            // 创建一个空的 JS 文件，以防止页面错误
            const outputFile = path.join(this.config.outputPath, 'assets', 'pageforge.min.js');
            fs.writeFileSync(outputFile, '// Empty file\n');
        }
    }

    async bundleCSS() {
        try {
            // 检查源文件是否存在
            if (!fs.existsSync(this.defaultAssets.css)) {
                console.log('⚠️ No CSS file found at:', this.defaultAssets.css);
                return;
            }

            const outputDir = path.join(this.config.outputPath, 'assets');
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            await esbuild.build({
                entryPoints: [this.defaultAssets.css],
                bundle: true,
                minify: true,
                sourcemap: false,
                outfile: path.join(outputDir, 'pageforge.min.css'),
                loader: { '.css': 'css' },
                logLevel: 'info'
            });

            console.log('✓ CSS bundle created successfully');
        } catch (error) {
            console.error('✗ Error bundling CSS:', error);
            // 创建一个空的 CSS 文件，以防止页面错误
            const outputFile = path.join(this.config.outputPath, 'assets', 'pageforge.min.css');
            fs.writeFileSync(outputFile, '/* Empty file */\n');
        }
    }
}

module.exports = AssetBundler;