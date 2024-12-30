module.exports = function template(item) {
    // 构建样式类
    let classes = ['max-w-full', 'h-auto'];

    // 添加对齐方式的类
    if (item.align) {
        switch (item.align) {
            case 'left':
                classes.push('float-left', 'mr-4');
                break;
            case 'right':
                classes.push('float-right', 'ml-4');
                break;
            case 'center':
                classes.push('mx-auto', 'block');
                break;
        }
    }

    // 构建style属性
    let styles = [];
    if (item.width) {
        styles.push(`width: ${item.width}px`);
    }
    if (item.height) {
        styles.push(`height: ${item.height}px`);
    }

    // 组合HTML属性
    const styleAttr = styles.length > 0 ? ` style="${styles.join(';')}"` : '';
    const classAttr = ` class="${classes.join(' ')}"`;
    const titleAttr = item.title ? ` title="${item.title}"` : '';

    // 返回完整的img标签
    return `
        <div class="w-full h-full">
            <img src="${item.href}" 
                 alt="${item.alt}"${titleAttr}${styleAttr}${classAttr}/>
        </div>
    `;
};