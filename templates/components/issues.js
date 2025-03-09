module.exports = function template(item) {
    // Extract owner and repo from href
    const urlParts = item.href.split('/');
    const owner = urlParts[3] || '';
    const repo = urlParts[4] || '';

    return `
        <a href="${item.href}" 
           target="_blank" 
           class="inline-flex items-center px-2.5 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100 transition-colors duration-200 no-underline max-w-md">
            <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                <path d="M9 18c-4.51 2-5-2-7-2"></path>
            </svg>
            <span class="flex-1">
                <span class="font-semibold">${owner}/${repo}</span>
                <span class="inline-flex items-center ml-1">
                    <span class="w-3 h-3 inline-flex items-center justify-center bg-gray-600 dark:bg-gray-400 rounded-full text-white text-xs mr-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
                            <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                            <path fill-rule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"></path>
                        </svg>
                    </span>
                    ${item.text}
                </span>
            </span>
        </a>
    `;
};