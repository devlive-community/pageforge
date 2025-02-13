module.exports = function template(item) {
    const type = item.ordered ? 'ol' : 'ul';

    // 移除 list-inside 类，让数字显示在外部
    const listClasses = ['my-4', 'pl-8'];
    if (item.ordered) {
        listClasses.push('list-decimal');
    }
    else {
        listClasses.push('list-disc');
    }

    return `
        <${type} class="${listClasses.join(' ')}">
            ${item.body}
        </${type}>
    `;
};