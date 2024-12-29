module.exports = function template(value) {

    return `
        <img src="${value.imageItem.item.href}" 
             alt="${value.imageItem.item.text}"
             title="${value.imageItem.item.title || ''}"
             class="max-w-full h-auto"/>
    `;
};