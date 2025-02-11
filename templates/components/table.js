module.exports = function table(props) {
    const {headers, rows} = props;

    // 根据对齐方式获取对应的类名
    const getAlignClass = (align) => {
        switch(align) {
            case 'center': return 'text-center';
            case 'right': return 'text-right';
            case 'left': return 'text-left';
            default: return 'text-left';
        }
    };

    return `
        <div class="space-y-4">
            <div class="relative overflow-x-auto shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 sm:rounded-lg">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            ${headers.map(header => `
                                <th scope="col" class="px-3.5 py-1 ${getAlignClass(header.align)}">
                                    ${header.text}
                                </th>
                            `).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${rows.map((row, index) => `
                            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                ${row.map(cell => `
                                    <td class="px-3 py-1.5 ${getAlignClass(cell.align)}">
                                        ${cell.text}
                                    </td>
                                `).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
};