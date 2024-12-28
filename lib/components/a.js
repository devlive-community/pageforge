module.exports = function template(value) {
    const item = value.linkItem;
    const matches = item.raw.match(/\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\s*(?:"(.*?)")?\)/);
    const target = matches?.[4];

    return `
        <a class="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 cursor-pointer"
           href="${target ? matches[2] : item.href}"
           target="${target || '_self'}"
           title="${target ? matches[3] : item.title || ''}">
            ${target ? matches[1] : item.text}
        </a>
    `;
};