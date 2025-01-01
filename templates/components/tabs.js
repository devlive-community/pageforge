module.exports = function tabs({tabs}) {
    // 生成唯一的 tabgroup ID 来确保多个 tab 组之间不会互相影响
    const tabGroupId = `tabgroup-${Math.random().toString(36).substr(2, 9)}`;

    // 生成 tab 按钮 HTML
    const tabButtons = tabs.map((tab, index) => `
        <button role="tab"
            class="px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200
                   ${index === 0 ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                   focus:outline-none"
            onclick="switchTab(event, '${tabGroupId}', ${index})"
            aria-selected="${index === 0 ? 'true' : 'false'}"
            aria-controls="${tabGroupId}-panel-${index}"
            id="${tabGroupId}-tab-${index}">
            ${tab.title}
        </button>
    `).join('');

    // 生成 tab 内容 HTML
    const tabPanels = tabs.map((tab, index) => `
        <div class="p-4 ${index === 0 ? '' : 'hidden'}"
            role="tabpanel"
            aria-labelledby="${tabGroupId}-tab-${index}"
            id="${tabGroupId}-panel-${index}">
            ${tab.content}
        </div>
    `).join('');

    // 添加必要的 JavaScript 函数
    const script = `
        <script>
            function switchTab(event, tabGroupId, selectedIndex) {
                // 获取当前 tab 组的所有按钮和面板
                const tabButtons = event.target.parentElement.children;
                const tabPanels = document.querySelectorAll('[id^="' + tabGroupId + '-panel-"]');
                
                // 更新所有 tab 按钮的状态
                Array.from(tabButtons).forEach((button, index) => {
                    if (index === selectedIndex) {
                        button.classList.remove('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
                        button.classList.add('border-blue-500', 'text-blue-600');
                        button.setAttribute('aria-selected', 'true');
                    } else {
                        button.classList.remove('border-blue-500', 'text-blue-600');
                        button.classList.add('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
                        button.setAttribute('aria-selected', 'false');
                    }
                });
                
                // 更新所有面板的显示状态
                tabPanels.forEach((panel, index) => {
                    if (index === selectedIndex) {
                        panel.classList.remove('hidden');
                    } else {
                        panel.classList.add('hidden');
                    }
                });
            }
        </script>
    `;

    // 返回完整的 tabs 组件 HTML
    return `
        <div class="w-full">
            <div class="border-b border-gray-200">
                <nav class="flex space-x-4" role="tablist" aria-label="Tabs">
                    ${tabButtons}
                </nav>
            </div>
            <div class="mt-2">
                ${tabPanels}
            </div>
            ${script}
        </div>
    `;
};