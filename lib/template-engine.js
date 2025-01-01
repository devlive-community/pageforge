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
        // 确保布局路径正确
        if (!layout.startsWith('layouts/')) {
            layout = `layouts/${layout}`;
        }

        try {
            return this.findTemplate(layout);
        }
        catch (error) {
            // 如果找不到指定布局，使用默认内容布局
            if (layout !== 'layouts/content') {
                console.warn(`Content layout '${layout}' not found, falling back to 'layouts/content'`);
                return this.findTemplate('layouts/content');
            }
            throw error;
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

    // 渲染内容布局
    async renderContent(content, data) {
        // 获取内容布局名称
        let contentLayout;
        try {
            const requestedLayout = data.layout || 'content';
            contentLayout = requestedLayout;
            // 尝试找到内容布局文件
            this.findContentLayout(contentLayout);
        }
        catch (error) {
            // 如果找不到任何内容布局，直接返回原始内容
            console.error(`No content layout found: ${error.message}`);
            return content;
        }

        // 确保布局路径正确
        if (!contentLayout.startsWith('layouts/')) {
            contentLayout = `layouts/${contentLayout}`;
        }

        // 渲染内容布局
        return this.render(contentLayout, {
            ...data,
            content
        });
    }

    async renderWithLayout(template, data) {
        const enhancedData = {
            ...data,
            page: {
                ...data.page || {},
                config: data.config || {}
            }
        };

        return this.render('layouts/base', {
            ...enhancedData
        });
    }
}

module.exports = TemplateEngine;