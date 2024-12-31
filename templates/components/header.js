module.exports = function template(item) {
    const divClass = () => {
        const baseClasses = 'font-bold tracking-tight text-gray-900 my-3 [&_span]:!font-inherit [&_span]:!text-inherit [&_code]:!text-inherit';

        switch (item.level) {
            case 1:
                return `text-3xl sm:text-4xl ${baseClasses} [&_span]:!text-3xl [&_span]:sm:!text-4xl`;
            case 2:
                return `text-2xl sm:text-3xl ${baseClasses} [&_span]:!text-2xl [&_span]:sm:!text-3xl`;
            case 3:
                return `text-xl sm:text-2xl ${baseClasses} [&_span]:!text-xl [&_span]:sm:!text-2xl`;
            case 4:
                return `text-lg sm:text-xl ${baseClasses} [&_span]:!text-lg [&_span]:sm:!text-xl`;
            case 5:
                return `text-md sm:text-lg ${baseClasses} [&_span]:!text-md [&_span]:sm:!text-lg`;
            case 6:
                return `text-sm sm:text-md ${baseClasses} [&_span]:!text-sm [&_span]:sm:!text-md`;
            default:
                return `text-base sm:text-lg ${baseClasses} [&_span]:!text-base [&_span]:sm:!text-lg`;
        }
    }

    return `
        <div class="${divClass()}">
            <div id="${item.slug}" class="inline-flex items-center">${item.text}</div>
        </div>
    `;
};