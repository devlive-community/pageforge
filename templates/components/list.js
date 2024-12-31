module.exports = function template(item) {
    const type = item.ordered ? 'ol' : 'ul';
    const listClasses = 'my-4 pl-4 list-inside ' + (item.ordered ? 'list-decimal' : 'list-disc');

    return `
        <${type} class="${listClasses}">
            ${item.body}
        </${type}>
    `;
};