window.DOMUtils = {
    find: (selector, context = document) => context.querySelector(selector),
    findAll: (selector, context = document) => context.querySelectorAll(selector),
    toggleClass: (element, className) => element?.classList.toggle(className)
};