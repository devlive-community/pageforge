module.exports = function template(item) {
    const className = "block w-full bg-gray-100 text-gray-900 my-3 px-3 py-2.5 rounded font-mono leading-normal overflow-x-auto";
    const language = item.language ? `language-${item.language}` : '';

    const cleanText = item.text.trim();

    return `<div class="${className}" style="white-space: pre;"><code class="${language}">${cleanText}</code></div>`;
};