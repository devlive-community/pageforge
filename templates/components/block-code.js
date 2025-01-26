module.exports = function template(item) {
    const wrapperClass = "!block !w-full !bg-gray-100 !dark:bg-gray-800 !dark:text-gray-300 !text-gray-900 !my-3 !rounded !font-mono !leading-normal !overflow-x-auto !relative";
    const language = item.language ? `language-${item.language}` : '';
    const languageLabel = item.language ? `<div class="!absolute !right-2 !top-2 !text-sm !text-gray-500 !dark:text-gray-400">${item.language}</div>` : '';

    return `<div class="${wrapperClass}">
       ${languageLabel}
       <pre class="!px-3 !py-2.5 !m-0"><code class="${language}">${item.text}</code></pre>
   </div>`;
};