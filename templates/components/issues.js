module.exports = function template(item) {
    return `
        <a class="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 cursor-pointer"
           href="${item.href}"
           target="_blank"
           title="${item.text || ''}">
            ${item.text}
        </a>
    `;
};