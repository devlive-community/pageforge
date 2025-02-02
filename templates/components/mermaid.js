module.exports = function template(item) {
    // 生成唯一的图表 ID
    const chartId = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

    return `
        <div class="mermaid-wrapper my-4 relative w-full" style="min-width: min-content;">
            <!-- 加载提示 -->
            <div id="${chartId}-loading" class="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10">
                <span class="text-gray-500 text-sm">加载图...</span>
            </div>
            
            <!-- Mermaid 图表容器 -->
            <div id="${chartId}" class="mermaid overflow-x-auto w-full" style="opacity: 0; transition: opacity 0.2s ease-in-out;">
                ${item.content}
            </div>
            
            <!-- 初始化脚本 -->
            <script>
                (function() {
                    const config = ${JSON.stringify(item.config || {})};
                    
                    // 创建一个 Promise 来追踪 mermaid 的加载
                    window.mermaidReady = window.mermaidReady || new Promise((resolve) => {
                        if (window.mermaid) {
                            resolve(window.mermaid);
                            return;
                        }

                        const checkMermaid = () => {
                            if (window.mermaid) {
                                resolve(window.mermaid);
                            } else {
                                setTimeout(checkMermaid, 50);
                            }
                        };
                        checkMermaid();
                    });

                    // 等待 DOM 完全加载
                    window.addEventListener('load', () => {
                        // 初始化 mermaid
                        window.mermaidReady.then(mermaid => {
                            try {
                                const chartElement = document.getElementById('${chartId}');
                                const loadingElement = document.getElementById('${chartId}-loading');

                                // 先设置容器的最小宽度
                                chartElement.closest('.mermaid-wrapper').style.minWidth = 'min-content';

                                // 应用配置
                                mermaid.initialize({
                                    startOnLoad: false,
                                    theme: 'default',
                                    ...config
                                });

                                // 渲染图表
                                mermaid.run({
                                    querySelector: '#${chartId}'
                                }).then(() => {
                                    // 平滑显示图表
                                    chartElement.style.opacity = '1';
                                    loadingElement.style.opacity = '0';
                                    setTimeout(() => {
                                        loadingElement.style.display = 'none';
                                    }, 200);
                                }).catch(error => {
                                    console.error('Mermaid render error:', error);
                                    loadingElement.innerHTML = '<span class="text-red-500">无法呈现图</span>';
                                });
                            } catch (error) {
                                console.error('Mermaid init error:', error);
                                document.getElementById('${chartId}-loading').innerHTML = 
                                    '<span class="text-red-500">无法初始化图</span>';
                            }
                        });
                    });
                })();
            </script>
        </div>
    `;
};