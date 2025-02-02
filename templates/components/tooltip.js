module.exports = function template(item) {
    return `
        <div class="relative inline-block group">
            <span class="text-gray-900 cursor-help border-b border-dotted border-gray-500">
                ${item.text}
            </span>
            <div class="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 bottom-full left-1/2 -translate-x-1/2 mb-2">
                <div class="relative" style="min-width: max-content; max-width: 24rem;">
                    <div class="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm">
                        ${item.tooltip}
                    </div>
                    <div class="absolute w-0 h-0 border-4 bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-t-gray-800 border-x-transparent border-b-transparent"></div>
                </div>
            </div>
        </div>
    `;
};