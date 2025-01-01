const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

class TemplateEngine {
    constructor(templatePath) {
        this.templatePath = templatePath;
        this.defaultTemplatesPath = path.join(__dirname, '../templates');
    }

    findTemplate(template) {
        const projectTemplate = path.join(this.templatePath, `${template}.ejs`);
        if (fs.existsSync(projectTemplate)) {
            return projectTemplate;
        }

        const defaultTemplate = path.join(this.defaultTemplatesPath, `${template}.ejs`);
        if (fs.existsSync(defaultTemplate)) {
            return defaultTemplate;
        }

        throw new Error(`Template not found: ${template} (looked in ${this.templatePath} and ${this.defaultTemplatesPath})`);
    }

    // 检查内容布局文件是否存在
    findContentLayout(layout) {
        // 如果未指定布局，使用默认布局
        if (!layout) {
            return this.findTemplate('layouts/content');
        }

        // 如果布局路径不以 layouts/ 开头，添加前缀
        const layoutPath = layout.startsWith('layouts/') ? layout : `layouts/${layout}`;

        try {
            return this.findTemplate(layoutPath);
        } catch (error) {
            // 如果找不到指定布局，使用默认内容布局
            console.warn(`Content layout '${layoutPath}' not found, falling back to 'layouts/content'`);
            return this.findTemplate('layouts/content');
        }
    }

    async render(template, data) {
        const templatePath = this.findTemplate(template);
        const templateContent = fs.readFileSync(templatePath, 'utf-8');

        const options = {
            filename: templatePath,
            views: [
                this.templatePath,
                this.defaultTemplatesPath
            ]
        };

        return ejs.render(templateContent, {
            ...data,
            site: data.site || {}
        }, options);
    }

    // 渲染页面内容
    async renderContent(layout, data) {
        try {
            // 获取内容布局模板路径
            const contentLayoutPath = await this.findContentLayout(layout);
            const contentTemplate = fs.readFileSync(contentLayoutPath, 'utf-8');

            // 渲染内容布局
            const options = {
                filename: contentLayoutPath,
                views: [
                    this.templatePath,
                    this.defaultTemplatesPath
                ]
            };

            return ejs.render(contentTemplate, {
                ...data,
                content: data.content
            }, options);
        } catch (error) {
            console.error('Error rendering content:', error);
            // 如果渲染失败，返回原始内容
            return data.content;
        }
    }

    async renderWithLayout(template, data) {
        try {
            // 准备渲染数据
            const enhancedData = {
                ...data,
                page: {
                    ...data.page || {},
                    config: data.config || {}
                }
            };

            // 首先渲染内容布局
            const layout = data.pageData?.layout || template;
            const renderedContent = await this.renderContent(layout, {
                ...enhancedData,
                content: data.pageData?.content
            });

            // 更新数据中的内容
            enhancedData.pageData = {
                ...enhancedData.pageData,
                content: renderedContent
            };

            // 最后渲染基础布局
            return this.render('layouts/base', enhancedData);
        } catch (error) {
            console.error('Error in renderWithLayout:', error);
            throw error;
        }
    }
}

module.exports = TemplateEngine;