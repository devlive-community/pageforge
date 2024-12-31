module.exports = function alert({type = 'info', title, content}) {
    const styles = {
        info: {
            wrapper: 'border border-blue-200',
            headerWrapper: 'bg-blue-50',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
            title: 'text-blue-800',
            content: 'text-blue-700'
        },
        danger: {
            wrapper: 'border border-red-200',
            headerWrapper: 'bg-red-50',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
            title: 'text-red-800',
            content: 'text-red-700'
        },
        success: {
            wrapper: 'border border-green-200',
            headerWrapper: 'bg-green-50',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
            title: 'text-green-800',
            content: 'text-green-700'
        },
        warning: {
            wrapper: 'border border-yellow-200',
            headerWrapper: 'bg-yellow-50',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
            title: 'text-yellow-800',
            content: 'text-yellow-700'
        },
        dark: {
            wrapper: 'border border-gray-200',
            headerWrapper: 'bg-gray-50',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
            title: 'text-gray-800',
            content: 'text-gray-700'
        }
    };

    const style = styles[type];

    return `
        <div class="rounded-lg my-2 overflow-hidden ${style.wrapper}">
        
        ${title
            ? `<div class="flex items-start space-x-2 p-2 rounded-t-lg ${style.headerWrapper}">
               <div class="flex-shrink-0">${style.icon}</div>
               <h3 class="text-sm font-medium text-gray-900 mb-2">${title}</h3>
           </div>`
            : ''}
                   
            <div class="w-full px-5 py-3">
                <div class="text-sm ${style.content}">
                    ${content}
                </div>
            </div>
        </div>
    `;
};