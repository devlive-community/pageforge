module.exports = function template(item) {
    const className = "block w-full bg-gray-100 text-gray-900 my-2 px-3 py-2.5 rounded font-mono leading-normal";
    const language = item.language ? `language-${item.language}` : '';

    const cleanText = item.text.trim();

    return `<pre class="${className}"><code class="${language}">${cleanText}</code></pre>`;
};