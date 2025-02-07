// 代码复制模块
const CodeCopy = {
    copy(button) {
        const {find, toggleClass} = DOMUtils;
        const codeBlock = find('code', button.closest('div'));
        if (!codeBlock) {
            return;
        }

        navigator.clipboard.writeText(codeBlock.textContent)
            .then(() => {
                const copyIcon = find('.copy-icon', button);
                const checkIcon = find('.check-icon', button);

                toggleClass(copyIcon, '!hidden');
                toggleClass(checkIcon, '!hidden');

                setTimeout(() => {
                    toggleClass(copyIcon, '!hidden');
                    toggleClass(checkIcon, '!hidden');
                }, 800);
            })
            .catch(err => console.error('Failed to copy text:', err));
    }
};

window.PageForge = window.PageForge || {};
window.PageForge.CodeCopy = CodeCopy;