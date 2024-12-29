module.exports = function template(item) {
    return `
        <code class="bg-gray-100 text-gray-900 px-1.5 py-0.5 rounded text-sm font-mono inline">
            ${item.text}
        </code>
    `;
};