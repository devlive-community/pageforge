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

    // 添加布局渲染方法
    async renderWithLayout(template, data) {
        const content = await this.render(template, data);
        const layout = data.layout || 'layouts/base';

        return this.render(layout, {
            ...data,
            content // 将内容传递给布局模板
        });
    }
}

module.exports = TemplateEngine;