module.exports = function template(item) {
    const divClass = () => {
        switch (item.level) {
            case 1:
                return 'text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl my-3';
            case 2:
                return 'text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl my-3';
            case 3:
                return 'text-xl font-bold tracking-tight text-gray-900 sm:text-2xl my-3';
            case 4:
                return 'text-lg font-bold tracking-tight text-gray-900 sm:text-xl my-3';
            case 5:
                return 'text-md font-bold tracking-tight text-gray-900 sm:text-lg my-3';
            case 6:
                return 'text-sm font-bold tracking-tight text-gray-900 sm:text-md my-3';
            default:
                return 'text-base font-bold tracking-tight text-gray-900 sm:text-lg my-3';
        }
    }

    return `
        <div class="${divClass()}">
            <div id="${item.slug}" class="inline-flex items-center">${item.text}</div>
        </div>
    `;
};