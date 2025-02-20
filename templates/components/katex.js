module.exports = function template(item) {
    return `
        <div class="katex-wrapper my-4">
            <div class="katex-formula overflow-x-auto">
                <script>
                    document.currentScript.parentElement.innerHTML = katex.renderToString(
                        \`${item.content}\`, 
                        {
                            displayMode: true,
                            throwOnError: false,
                            ...${JSON.stringify(item.config || {})}
                        }
                    );
                </script>
            </div>
        </div>
    `;
};