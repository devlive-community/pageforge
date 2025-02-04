module.exports = function template(value) {
    const wrapperClass = "!block !w-full !bg-gray-50 !rounded-lg !overflow-hidden !relative";

    // 添加复制按钮
    const copyButton = `
        <button onclick="window.PageForge.CodeCopy.copy(this)" class="!absolute !right-2 !top-1 !p-1 !rounded !text-gray-400 hover:!text-blue-600 !dark:text-gray-500 hover:!text-blue-300 !transition-colors !duration-200 !z-10">
            <svg class="copy-icon !w-5 !h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <svg class="check-icon !hidden !w-5 !h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
        </button>
    `;

    return `<div class="${wrapperClass}">
        ${copyButton}
        <div class="!overflow-x-auto">
            <pre class="!min-w-full !w-max"><code>${value.content.map(item =>
        `<div class="!flex !px-2 !py-0.5 ${item.type === 'addition' ? '!bg-green-100' : item.type === 'deletion' ? '!bg-red-100' : ''}">
                    <span class="!w-4 !shrink-0 !text-gray-500 !select-none">${item.prefix}</span>
                    <span class="!flex-1 !ml-1">${item.content}</span>
                </div>`
    ).join('')}</code></pre>
        </div>
    </div>`;
};