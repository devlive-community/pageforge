const fs = require('fs');
const path = require('path');

function loadComponent(componentName, props) {
    try {
        // 首先尝试从本地 components 目录加载
        const localComponentPath = path.join(process.cwd(), 'components', `${componentName}.js`);

        if (fs.existsSync(localComponentPath)) {
            const component = require(localComponentPath);
            return component(props);
        }

        // 如果本地不存在，尝试从默认组件系统加载
        const defaultComponentPath = path.join(__dirname, 'components', `${componentName}.js`);

        if (fs.existsSync(defaultComponentPath)) {
            const component = require(defaultComponentPath);
            return component(props);
        }

        throw new Error(`Component ${componentName} not found in both local and default paths`);
    }
    catch (error) {
        console.error(`Error loading component ${componentName}:`, error);
        return '';
    }
}

module.exports = {loadComponent};