module.exports = function template(item) {
    return `
        <code class="bg-gray-100 text-gray-900 px-1.5 py-0.5 rounded text-sm font-mono mx-1 inline-block max-w-full break-all whitespace-pre-wrap overflow-wrap-anywhere">${item.text}</code>
    `;
};