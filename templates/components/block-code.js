module.exports = function template(item) {
    const wrapperClass = "!block !w-full !bg-gray-100 !dark:bg-gray-800 !dark:text-gray-300 !text-gray-900 !my-3 !rounded !font-mono !leading-normal !overflow-hidden !relative";
    const language = item.language ? `language-${item.language}` : '';

    // Add title bar if title exists
    const titleBar = item.title ? `
        <div class="!px-3 !py-2 !bg-gray-200 !dark:bg-gray-700 !border-b !border-gray-300 !dark:border-gray-600">
            <span class="!text-sm !text-gray-700 !dark:text-gray-300">${item.title}</span>
        </div>
    ` : '';

    const languageLabel = item.language ? `<div class="!absolute !right-12 !top-${item.title ? '14' : '2'} !text-sm !text-gray-500 !dark:text-gray-400 !bg-gray-100 !dark:bg-gray-800 !z-10">${item.language}</div>` : '';

    const lines = item.text.split('\n');
    const lineNumbers = lines.map((_, i) => `<span class="!block !w-8 !pr-2 !text-right !text-gray-500 !select-none">${i + 1}</span>`).join('');
    const lineNumbersDiv = item.showLineNumbers ? `<div class="!py-2.5 !bg-gray-200 !dark:bg-gray-700">${lineNumbers}</div>` : '';

    const copyButton = `
        <button onclick="window.PageForge.CodeCopy.copy(this)" class="!absolute !right-2 !top-${item.title ? '14' : '1'} !p-1 !rounded !text-gray-400 hover:!text-blue-600 !dark:text-gray-500 hover:!dark:text-blue-300 !transition-colors !duration-200 !z-10">
            <svg class="copy-icon !w-5 !h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <svg class="check-icon !hidden !w-5 !h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
        </button>
    `;

    return `<div class="${wrapperClass}">
            ${titleBar}
            ${languageLabel}
            ${copyButton}
            <div class="!overflow-x-auto !flex">
                ${lineNumbersDiv}
                <div class="!flex-1">
                    <pre class="!px-3 !py-2.5 !m-0"><code class="${language}">${item.text}</code></pre>
                </div>
            </div>
        </div>`;
};