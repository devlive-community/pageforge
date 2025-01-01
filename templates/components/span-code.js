module.exports = function template(item) {
    return `
        <code class="bg-gray-100 text-gray-900 px-1.5 py-0.5 rounded text-sm font-mono mx-1 inline break-words whitespace-pre-wrap">${item.text}</code>
    `;
};