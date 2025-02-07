const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

class AssetBundler {
    constructor(config) {
        this.config = config;
        this.assets = {
            js: path.join(this.config.templatePath, 'assets/js'),  // JS 目录
            css: path.join(this.config.templatePath, 'assets/css') // CSS 目录
        };

        this.excludeFiles = this.getExcludeFiles();
    }

    // 根据配置获取需要排除的文件
    getExcludeFiles() {
        const excludeFiles = [];

        // 如果搜索功能未启用，则排除相关文件
        if (!this.config?.feature?.search?.enable) {
            excludeFiles.push('pageforge-search.js');
        }

        return excludeFiles;
    }

    // 扫描目录下的所有文件
    scanDirectory(dir, extension) {
        if (!fs.existsSync(dir)) {
            console.log(`⚠️ 目录不存在: ${dir}`);
            return [];
        }

        const files = fs.readdirSync(dir);
        return files
            .filter(file => file.endsWith(extension))
            .filter(file => !this.excludeFiles.includes(file))
            .map(file => path.join(dir, file));
    }

    async bundle() {
        await this.bundleJS();
        await this.bundleCSS();
    }

    async bundleJS() {
        try {
            // 扫描所有 JS 文件
            const jsFiles = this.scanDirectory(this.assets.js, '.js');

            if (jsFiles.length === 0) {
                console.log('⚠️ 未找到任何 JS 文件');
                return;
            }

            const outputDir = path.join(this.config.outputPath, 'assets');
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, {recursive: true});
            }

            // 创建一个临时目录来存储中间文件
            const tempDir = path.join(outputDir, 'temp');
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, {recursive: true});
            }

            // 先将每个文件单独打包
            await esbuild.build({
                entryPoints: jsFiles,
                bundle: true,
                minify: true,
                sourcemap: false,
                outdir: tempDir,
                target: ['es2018'],
                loader: {'.js': 'js'},
                logLevel: 'info',
                format: 'iife',
            });

            // 读取所有生成的文件
            const bundledFiles = fs.readdirSync(tempDir)
                .filter(file => file.endsWith('.js'))
                .map(file => path.join(tempDir, file));

            // 合并所有文件内容
            let concatenatedContent = '';
            for (const file of bundledFiles) {
                concatenatedContent += fs.readFileSync(file, 'utf8') + '\n';
            }

            // 写入最终的合并文件
            const finalOutput = path.join(outputDir, 'pageforge.min.js');
            fs.writeFileSync(finalOutput, concatenatedContent);

            // 清理临时目录
            fs.rmSync(tempDir, {recursive: true, force: true});

            console.log(`✓ JS 文件编译完成 (${jsFiles.length} 个文件)`);
        }
        catch (error) {
            console.error('✗ JS 文件编译失败 ', error);
            // 创建一个空的 JS 文件，以防止页面错误
            const outputFile = path.join(this.config.outputPath, 'assets', 'pageforge.min.js');
            fs.writeFileSync(outputFile, '// Empty file\n');
        }
    }

    async bundleCSS() {
        try {
            // 扫描所有 CSS 文件
            const cssFiles = this.scanDirectory(this.assets.css, '.css');

            if (cssFiles.length === 0) {
                console.log('⚠️ 未找到任何 CSS 文件');
                return;
            }

            const outputDir = path.join(this.config.outputPath, 'assets');
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, {recursive: true});
            }

            // 创建一个临时目录来存储中间文件
            const tempDir = path.join(outputDir, 'temp');
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, {recursive: true});
            }

            // 先将每个文件单独打包
            await esbuild.build({
                entryPoints: cssFiles,
                bundle: true,
                minify: true,
                sourcemap: false,
                outdir: tempDir,
                loader: {'.css': 'css'},
                logLevel: 'info'
            });

            // 读取所有生成的文件
            const bundledFiles = fs.readdirSync(tempDir)
                .filter(file => file.endsWith('.css'))
                .map(file => path.join(tempDir, file));

            // 合并所有文件内容
            let concatenatedContent = '';
            for (const file of bundledFiles) {
                concatenatedContent += fs.readFileSync(file, 'utf8') + '\n';
            }

            // 写入最终的合并文件
            const finalOutput = path.join(outputDir, 'pageforge.min.css');
            fs.writeFileSync(finalOutput, concatenatedContent);

            // 清理临时目录
            fs.rmSync(tempDir, {recursive: true, force: true});

            console.log(`\n✓ CSS 文件编译完成 (${cssFiles.length} 个文件)`);
        }
        catch (error) {
            console.error('\n✗ CSS 文件编译失败 ', error);
            // 创建一个空的 CSS 文件，以防止页面错误
            const outputFile = path.join(this.config.outputPath, 'assets', 'pageforge.min.css');
            fs.writeFileSync(outputFile, '/* Empty file */\n');
        }
    }
}

module.exports = AssetBundler;