module.exports = function template(item) {
    const tag = `h${item.level}`;

    return `
        <${tag} id="${item.slug}">
            ${item.text}
        </${tag}>
    `;
};