const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const ejs = require('ejs');
const marked = require('./extension/marked/pageforge-marked');
const formatTOC = require('./extension/marked/pageforge-toc');
const {
    getPagePath,
    appendHtml,
    isFeatureEnabled
} = require("./utils");
const TemplateEngine = require("./template-engine");
const {setContext} = require("./extension/marked/pageforge-ejs");
const minify = require('html-minifier').minify;
const SitemapGenerator = require('./sitemap-generator');
const SearchIndexBuilder = require('./indexer-generator');
const TaxonomyProcessor = require('./taxonomy-processor');
const HtmlMinifier = require('./html-minifier');
const GitInfoProvider = require('./git-info-provider');
const I18nProcessor = require('./i18n-processor');
const NavigationProcessor = require('./navigation-processor');
const PageDataProcessor = require('./page-data-processor');

class FileProcessor {
    constructor(config, pages, sourcePath, outputPath) {
        this.config = config;
        this.pages = pages;
        this.sourcePath = sourcePath;
        this.outputPath = outputPath;

        if (config.feature?.compress?.enable) {
            this.htmlMinifier = new HtmlMinifier(config);
        }
        this.templateEngine = new TemplateEngine(config.templatePath);
        this.gitInfoProvider = new GitInfoProvider(config);
        this.i18nProcessor = new I18nProcessor(config, pages);
        this.navigationProcessor = new NavigationProcessor(config, pages);
        this.pageDataProcessor = new PageDataProcessor(config, pages);
    }

    // 获取缓存的导航数据
    getCachedNavigation(locale) {
        return this.navigationProcessor.getCachedNavigation(locale);
    }

    // 构建站点地图数据
    async generateSitemap() {
        const sitemapGenerator = new SitemapGenerator(
            this.config,
            this.pages,
            (locale) => this.getCachedNavigation(locale)
        );
        sitemapGenerator.generate();
    }

    // 构建站点索引
    async generateIndex() {
        const indexBuilder = new SearchIndexBuilder(
            this.config,
            this.pages,
            (locale) => this.getCachedNavigation(locale)
        );
        indexBuilder.generate();
    }

    // 生成标签页
    async generateTaxonomy() {
        const taxonomyProcessor = new TaxonomyProcessor(
            this.config,
            this.pages,
            (locale) => this.getCachedNavigation(locale)
        );
        await taxonomyProcessor.generateTagPages(this);
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

    async processMarkdownFile(sourceDir, baseDir, filename, locale = '', originalFilePath = baseDir) {
        const sourcePath = path.join(sourceDir, filename);
        const relativePath = path.join(baseDir, filename);
        const fileLanguage = this.i18nProcessor.getFileLanguage(filename);

        // 检查文件语言
        if (locale !== fileLanguage) {
            const isDefaultLanguageFile = fileLanguage === this.i18nProcessor.getDefaultLocale() ||
                (!filename.includes('.') || filename.endsWith('.md'));
            const currentLanguageFilename = filename.replace(/(\.[a-zA-Z-]+)?\.md$/, `.${locale}.md`);
            const hasLocaleFile = fs.existsSync(path.join(sourceDir, currentLanguageFilename));

            if (!hasLocaleFile && this.i18nProcessor.isEnabled() && isDefaultLanguageFile) {
                console.log(`📄 未找到 ${locale} 语言文件，使用默认语言(${this.i18nProcessor.getDefaultLocale()})文件: ${filename}`);
            }
            else {
                console.log(`📄 正在跳过文件 ${filename} 不是当前语言文件`);
                return;
            }
        }

        try {
            // 获取 Git 信息
            const gitInfo = await this.gitInfoProvider.getGitInfo(sourcePath);

            // 处理 Markdown 内容
            const {metadata, content} = this.processMarkdown(sourcePath, locale, relativePath);

            const readingTime = await this.estimateReadingTime(content)

            this.config.languages = this.i18nProcessor.getAvailableLocales()
            // 构建基础页面数据
            let pageData = this.pageDataProcessor.buildBasePageData(
                metadata,
                content,
                relativePath,
                locale,
                gitInfo,
                readingTime
            );

            // 应用国际化处理
            pageData = this.i18nProcessor.buildI18nPageData(
                pageData,
                metadata,
                locale,
                this.getCachedNavigation(locale)
            );

            // 渲染页面
            let html = await this.templateEngine.renderWithLayout('layouts/page', pageData);

            // 压缩 HTML
            if (this.config.feature?.compress?.enable) {
                html = this.htmlMinifier.compress(html, relativePath);
            }

            // 保存文件
            const outputFilename = this.i18nProcessor.getOutputFilename(filename);
            const outputDir = path.join(this.config.outputPath, baseDir);

            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, {recursive: true});
            }

            const outputFile = path.join(outputDir, outputFilename);
            fs.writeFileSync(outputFile, html);

            console.log(`✓ 编译 ${relativePath} 文件完成`);
        }
        catch (error) {
            console.error(`✗ 编译 ${relativePath} 失败 ${error.message}`);
            console.error(error);
        }
    }

    /**
     * 估算文章阅读时间
     * @param {string} markdownContent Markdown 格式的文章内容
     * @param {number} wordsPerMinute 英语阅读速度（每分钟单词数）
     * @return {Object} 阅读时间信息
     */
    async estimateReadingTime(markdownContent, wordsPerMinute = 200) {
        // 移除 Markdown 语法中的特殊字符
        const cleanText = markdownContent
            .replace(/!\[.*?\]\(.*?\)/g, '') // 移除图片链接
            .replace(/\[.*?\]\(.*?\)/g, '$1') // 移除链接，保留链接文本
            .replace(/(\*|_|\#|`){1,3}(.*?)\1{1,3}/g, '$2') // 移除加粗、斜体、标题等格式
            .replace(/```[\s\S]*?```/g, '') // 移除代码块
            .replace(/`.*?`/g, '') // 移除内联代码
            .replace(/\n/g, ' ') // 将换行替换为空格
            .replace(/\s+/g, ' ') // 将多个空格替换为单个空格
            .trim();

        // 计算中英文字符
        const chineseChars = (cleanText.match(/[\u4e00-\u9fa5]/g) || []).length;
        const englishWords = cleanText
            .replace(/[\u4e00-\u9fa5]/g, '') // 移除中文字符
            .split(/\s+/)
            .filter(word => word.length > 0).length;

        // 中文阅读速度一般比英文慢，按经验中文阅读速度约为每分钟300字
        const chineseReadingTime = chineseChars / 300;
        const englishReadingTime = englishWords / wordsPerMinute;

        // 总阅读时间（分钟）
        let totalMinutes = chineseReadingTime + englishReadingTime;

        // 如果阅读时间不足1分钟，显示为"1分钟"
        let minutes = Math.max(1, Math.round(totalMinutes));

        // 阅读时间格式化逻辑
        let text;
        if (minutes <= 5) {
            // 5分钟以内正常显示
            text = `${minutes} 分钟阅读`;
        }
        else if (minutes <= 30) {
            // 5-30分钟显示为舍入到5分钟的倍数
            text = `${Math.ceil(minutes / 5) * 5} 分钟阅读`;
        }
        else if (minutes <= 60) {
            // 30-60分钟显示为"半小时以上阅读"
            text = "半小时以上阅读";
        }
        else if (minutes <= 120) {
            // 1-2小时显示为"1小时以上阅读"
            text = "1小时以上阅读";
        }
        else {
            // 超过2小时显示为"长篇阅读"
            text = "长篇阅读";
        }

        return {
            minutes,
            words: englishWords,
            chars: chineseChars,
            text: text
        };
    }

    async processLayoutFile(metadata, locale) {
        metadata.title = this.i18nProcessor.getTranslation(metadata.title, locale);
        this.config.languages = this.i18nProcessor.getAvailableLocales();

        const pageData = this.pageDataProcessor.buildLayoutPageData(metadata, locale);
        pageData.siteData.nav = this.getCachedNavigation(locale);

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