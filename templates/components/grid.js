module.exports = function template(value) {
    const {content, options} = value;

    const gridClasses = [
        '!grid !py-2',
        options.responsive ? `!grid-cols-1 sm:!grid-cols-${Math.min(options.cols, 2)} md:!grid-cols-${options.cols}` : `!grid-cols-${options.cols}`,
        `!gap-${options.gap}`,
        '!w-full'
    ].join(' ');

    const gridItems = content.map(item =>
        `<div class="!p-4 !border !bg-white !rounded-lg hover:!shadow-md !transition-shadow !duration-200">
            ${item}
        </div>`
    ).join('');

    return `<div class="${gridClasses}">
        ${gridItems}
    </div>`;
};