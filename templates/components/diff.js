module.exports = function template(value) {
    return `<div class="bg-gray-50 rounded-lg overflow-x-auto">
    <pre class="min-w-full w-max"><code>${value.content.map(item =>
        `<div class="flex px-2 py-0.5 ${item.type === 'addition' ? 'bg-green-100' : item.type === 'deletion' ? 'bg-red-100' : ''}">
            <span class="w-4 shrink-0 text-gray-500 select-none">${item.prefix}</span>
            <span class="flex-1 ml-1">${item.content}</span>
        </div>`
    ).join('')}</code></pre>
</div>`;
};