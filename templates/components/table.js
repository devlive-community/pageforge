module.exports = function table(props) {
    const {headers, rows} = props;

    return `
        <div class="space-y-4">
            <div class="relative overflow-x-auto shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 sm:rounded-lg">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            ${headers.map(header => `
                                <th scope="col" class="px-6 py-3">
                                    ${header.text}
                                </th>
                            `).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${rows.map((row, index) => `
                            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                ${row.map(cell => `
                                    <td class="px-6 py-4">
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