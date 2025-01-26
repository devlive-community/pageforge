module.exports = function template(item) {
    const wrapperClass = "!block !w-full !bg-gray-100 !dark:bg-gray-800 !dark:text-gray-300 !text-gray-900 !my-3 !rounded !font-mono !leading-normal !overflow-hidden !relative";
    const language = item.language ? `language-${item.language}` : '';
    const languageLabel = item.language ? `<div class="!absolute !right-2 !top-2 !text-sm !text-gray-500 !dark:text-gray-400 !bg-gray-100 !dark:bg-gray-800 !z-10">${item.language}</div>` : '';

    const lines = item.text.split('\n');
    const lineNumbers = lines.map((_, i) => `<span class="!block !w-8 !pr-2 !text-right !text-gray-500 !select-none">${i + 1}</span>`).join('');
    const lineNumbersDiv = item.showLineNumbers ? `<div class="!py-2.5 !bg-gray-200 !dark:bg-gray-700">${lineNumbers}</div>` : '';

    return `<div class="${wrapperClass}">
        ${languageLabel}
        <div class="!overflow-x-auto !flex">
            ${lineNumbersDiv}
            <div class="!flex-1">
                <pre class="!px-3 !py-2.5 !m-0"><code class="${language}">${item.text}</code></pre>
            </div>
        </div>
    </div>`;
};