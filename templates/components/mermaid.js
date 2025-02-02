module.exports = function template(item) {
    // 生成唯一的图表 ID
    const chartId = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

    return `
        <div class="mermaid-wrapper my-4">
            <!-- 加载提示 -->
            <div id="${chartId}-loading" class="text-center text-gray-500 text-sm py-4">
                <span>加载图...</span>
            </div>
            
            <!-- Mermaid 图表容器 -->
            <div id="${chartId}" class="mermaid overflow-x-auto">
                ${item.content}
            </div>
            
            <!-- 初始化脚本 -->
            <script>
                (function() {
                    const config = ${JSON.stringify(item.config || {})};
                    
                    // 等待 mermaid 加载完成
                    function initMermaid() {
                        if (window.mermaid) {
                            try {
                                // 应用配置
                                window.mermaid.initialize({
                                    startOnLoad: false,
                                    theme: 'default',
                                    ...config
                                });
                                
                                // 渲染图表
                                window.mermaid.run({
                                    querySelector: '#${chartId}'
                                }).then(() => {
                                    // 隐藏加载提示
                                    document.getElementById('${chartId}-loading').style.display = 'none';
                                }).catch(error => {
                                    document.getElementById('${chartId}-loading').innerHTML = 
                                        '<span class="text-red-500">无法呈现图</span>';
                                });
                            } catch (error) {
                                console.error('Mermaid init error:', error);
                                document.getElementById('${chartId}-loading').innerHTML = 
                                    '<span class="text-red-500">无法初始化图</span>';
                            }
                        } else {
                            // 如果 mermaid 还没加载完，等待后重试
                            setTimeout(initMermaid, 100);
                        }
                    }
                    
                    // 开始初始化
                    initMermaid();
                })();
            </script>
        </div>
    `;
};