module.exports = function restApi({ method, path, description, sections }) {
    // HTTP 方法对应的颜色
    const methodColors = {
        'GET': 'bg-blue-100 text-blue-700',
        'POST': 'bg-green-100 text-green-700',
        'PUT': 'bg-yellow-100 text-yellow-700',
        'PATCH': 'bg-orange-100 text-orange-700',
        'DELETE': 'bg-red-100 text-red-700'
    };

    // 渲染 HTTP 方法和路径
    const methodHtml = `
        <div class="flex items-center space-x-2 border-b py-2">
            <span class="px-3 py-1 rounded-md font-mono font-bold ${methodColors[method] || 'bg-gray-100 text-gray-700'}">
                ${method}
            </span>
            <span class="font-mono text-gray-900">${path}</span>
        </div>
    `;

    // 渲染描述信息
    const descriptionHtml = description ? `
        <div class="mt-4 text-gray-600">
            ${description}
        </div>
    ` : '';

    // 渲染各个部分
    const sectionsHtml = sections.map(section => `
        <div class="mt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-3">${section.title}</h3>
            ${section.content}
        </div>
    `).join('');

    return `
        <div class="border border-gray-200 rounded-lg p-4 pt-0 my-4">
            ${methodHtml}
            ${descriptionHtml}
            ${sectionsHtml}
        </div>
    `;
};