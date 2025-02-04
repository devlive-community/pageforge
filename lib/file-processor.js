const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const ejs = require('ejs');
const marked = require('./extension/marked/pageforge-marked');
const formatTOC = require('./extension/marked/pageforge-toc');
const {
    getPagePath,
    getTranslation,
    getAvailableLocales,
    appendHtml,
    getRelativeBasePath,
    transformNavigation,
    getOutputFilename,
    getFileLanguage,
    isFeatureEnabled
} = require("./utils");
const {execSync} = require('child_process');
const TemplateEngine = require("./template-engine");
const {setContext} = require("./extension/marked/pageforge-ejs");
const minify = require('html-minifier').minify;

class FileProcessor {
    constructor(config, pages, sourcePath, outputPath) {
        this.config = config;
        this.pages = pages;
        this.sourcePath = sourcePath;
        this.outputPath = outputPath;

        this.templateEngine = new TemplateEngine(config.templatePath);

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
        this.minifyOptions = config.feature?.compress?.enable ?
            { ...baseOptions, ...config.feature.compress.options } :
            false;
    }

    // 解析元数据中的 EJS 模板
    parseMetadataTemplates(data, context) {
        const processed = {...data};

        // 检查字符串是否包含 EJS 模板语法
        const hasEjsTemplate = (str) => {
            return str.includes('<%') && str.includes('%>');
        };

        // 递归处理对象
        const processValue = (value) => {
            if (typeof value === 'string') {
                // 只有包含 EJS 语法的字符串才进行模板解析
                if (hasEjsTemplate(value)) {
                    try {
                        return ejs.render(value, context, {
                            async: false,
                            cache: false,
                            filename: context.filename
                        });
                    }
                    catch (error) {
                        console.warn(`Template parsing error for value "${value}":`, error);
                        return value;
                    }
                }
                // 普通字符串直接返回
                return value;
            }
            else if (Array.isArray(value)) {
                return value.map(item => processValue(item));
            }
            else if (typeof value === 'object' && value !== null) {
                const result = {};
                for (const [key, val] of Object.entries(value)) {
                    result[key] = processValue(val);
                }
                return result;
            }
            return value;
        };

        // 处理每个顶层属性
        for (const [key, value] of Object.entries(processed)) {
            processed[key] = processValue(value);
        }

        return processed;
    }

    // 读取并解析 Markdown 文件
    processMarkdown(filePath, locale, relativePath) {
        const content = fs.readFileSync(filePath, 'utf-8');

        const {data: rawData, content: markdownContent} = matter(content);

        const forwardPath = this.getPath(relativePath, locale)
        const context = {
            pageData: {
                ...rawData,
                language: locale,
                ...forwardPath
            },
            siteData: {
                nav: this.config.nav
            }
        };

        // 解析元数据中的模板
        const data = this.parseMetadataTemplates(rawData, context);

        // 更新上下文
        context.pageData = {
            ...context.pageData,
            ...data
        };

        setContext(context);

        const html = marked.parse(markdownContent);

        data.toc = formatTOC(markdownContent);

        return {metadata: data, content: html};
    }

    getPath(relativePath, locale) {
        // 计算当前页面的路径
        const pagePath = getPagePath(relativePath);
        const localPath = appendHtml(pagePath, this.config, locale);
        const noLocalePath = isFeatureEnabled(this.config, 'i18n')
            ? localPath.replace(`/${locale}`, '')
            : localPath;

        return {localPath, noLocalePath, relativePath: relativePath.replace(locale, '')};
    }

    async getGitFileInfo(filePath) {
        let result = {};

        try {
            // 获取 revision 信息
            if (this.config.feature?.revision?.enable) {
                // 获取第一次提交信息
                const firstCommitCommand = `git log --follow --format="%H|%an|%aI" -- "${filePath}" | tail -n 1`;
                const firstCommitInfo = execSync(firstCommitCommand, {encoding: 'utf-8'}).trim();

                // 获取最后一次修改信息
                const lastModifiedCommand = `git log -n 1 --format="%H|%aI" -- "${filePath}"`;
                const lastModifiedInfo = execSync(lastModifiedCommand, {encoding: 'utf-8'}).trim();

                if (firstCommitInfo && lastModifiedInfo) {
                    const [commitHash, author, createTimeStr] = firstCommitInfo.split('|');
                    const [lastCommitHash, lastModifiedTimeStr] = lastModifiedInfo.split('|');

                    // 处理时间字符串
                    const formatDate = (dateStr) => {
                        try {
                            const date = new Date(dateStr);
                            return date.getFullYear() + '/' +
                                String(date.getMonth() + 1).padStart(2, '0') + '/' +
                                String(date.getDate()).padStart(2, '0') + ' ' +
                                String(date.getHours()).padStart(2, '0') + ':' +
                                String(date.getMinutes()).padStart(2, '0');
                        }
                        catch (error) {
                            console.warn('Date parsing error:', error);
                            return dateStr;
                        }
                    };

                    result.revision = {
                        commitHash,
                        createTime: formatDate(createTimeStr),
                        lastModifiedTime: formatDate(lastModifiedTimeStr),
                        lastCommitHash,
                    };
                }
            }

            // 获取 contributors 信息
            if (this.config.feature?.contributors?.enable) {
                // 获取所有提交用户信息
                const contributorsCommand = `git log --follow --format="%an" -- "${filePath}" | sort | uniq`;
                const contributors = execSync(contributorsCommand, {encoding: 'utf-8'})
                    .trim()
                    .split('\n')
                    .filter(Boolean);

                // 获取每个用户的提交次数
                const contributionStatsCommand = `git log --follow --format="%an" -- "${filePath}" | sort | uniq -c | sort -nr`;
                const contributionStats = execSync(contributionStatsCommand, {encoding: 'utf-8'})
                    .trim()
                    .split('\n')
                    .filter(Boolean)
                    .map(line => {
                        const [count, author] = line.trim().split(/\s+(.+)/);
                        return {
                            author,
                            commitCount: parseInt(count, 10)
                        };
                    });

                result.contributors = {
                    list: contributors,
                    stats: contributionStats
                };
            }

            return Object.keys(result).length > 0 ? result : null;

        }
        catch (error) {
            console.warn(`Unable to get git info for ${filePath}:`, error.message);
            return null;
        }
    }

    async processMarkdownFile(sourceDir, baseDir, filename, locale = '', originalFilePath = baseDir) {
        const sourcePath = path.join(sourceDir, filename);
        const relativePath = path.join(baseDir, filename);
        const fileLanguage = getFileLanguage(this.config, filename);

        // 如果文件语言与当前处理的语言不匹配
        if (locale !== fileLanguage) {
            // 检查是否是默认语言文件
            const isDefaultLanguageFile = fileLanguage === this.config.i18n?.default || (!filename.includes('.') || filename.endsWith('.md'));
            // 检查是否存在当前语言的文件
            const currentLanguageFilename = filename.replace(/(\.[a-zA-Z-]+)?\.md$/, `.${locale}.md`);
            const hasLocaleFile = fs.existsSync(path.join(sourceDir, currentLanguageFilename));

            if (!hasLocaleFile && isFeatureEnabled(this.config, 'i18n') && isDefaultLanguageFile) {
                console.log(`📄 未找到 ${locale} 语言文件，使用默认语言(${this.config.i18n?.default})文件: ${filename}`);
            } else {
                console.log(`📄 正在跳过文件 ${filename} 不是当前语言文件`);
                return;
            }
        }

        try {
            const gitInfo = await this.getGitFileInfo(sourcePath);
            const {metadata, content} = this.processMarkdown(sourcePath, locale, relativePath);
            const outputFilename = getOutputFilename(filename);
            const pageUrlPath = getPagePath(relativePath);
            this.pages.set(pageUrlPath, metadata);

            const outputDir = path.join(this.config.outputPath, baseDir);
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, {recursive: true});
            }

            const translatedTitle = metadata.title
                ? getTranslation(this.config, metadata.title, locale)
                : metadata.title;
            metadata.title = translatedTitle;

            this.config.languages = getAvailableLocales(this.config)
            const forwardPath = this.getPath(relativePath, locale)

            const pageData = {
                pageData: {
                    config: metadata.config,
                    toc: metadata.toc,
                    title: translatedTitle,
                    content: content,
                    language: locale,
                    basePath: getRelativeBasePath(baseDir),
                    layout: metadata.layout || 'layouts/content',
                    gitInfo,
                    ...forwardPath,
                    ...metadata
                },
                siteData: {
                    nav: this.config.nav,
                    ...this.config
                }
            }
            pageData.siteData.nav = transformNavigation(this.config.nav, this.pages, this.config, locale);

            // 渲染页面
            let html = await this.templateEngine.renderWithLayout('layouts/page', pageData);

            // 压缩 HTML
            if (this.config.feature?.compress?.enable !== false) {
                try {
                    html = minify(html, this.minifyOptions);
                    console.log(`🗜️  压缩 ${relativePath} HTML 完成`);
                }
                catch (minifyError) {
                    console.warn(`⚠️  压缩 ${relativePath} HTML 失败: ${minifyError.message}`);
                }
            }

            const outputFile = path.join(outputDir, outputFilename);
            fs.writeFileSync(outputFile, html);

            console.log(`✓ 编译 ${relativePath} 文件完成`);
        }
        catch (error) {
            console.log(error)
            console.error(`✗ 编译 ${relativePath} 失败 ${error.message}`);
        }
    }

    async processLayoutFile(metadata, locale) {
        const translatedTitle = metadata.title
            ? getTranslation(this.config, metadata.title, locale)
            : metadata.title;
        metadata.title = translatedTitle;

        this.config.languages = getAvailableLocales(this.config);

        const pageData = {
            pageData: {
                config: metadata.config,
                basePath: getRelativeBasePath('/'),
                ...metadata
            },
            siteData: {
                nav: this.config.nav,
                ...this.config
            }
        }
        pageData.siteData.nav = transformNavigation(this.config.nav, this.pages, this.config, locale);

        let html = await this.templateEngine.renderWithLayout('layouts/page', pageData);

        // 压缩布局 HTML
        if (this.config.minify !== false) {
            try {
                html = minify(html, this.minifyOptions);
            }
            catch (minifyError) {
                console.warn(`⚠️  压缩布局 HTML 失败: ${minifyError.message}`);
            }
        }

        return html;
    }
}

module.exports = FileProcessor