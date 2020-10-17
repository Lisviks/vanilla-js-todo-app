(function (window) {
  // Get element(s) by CSS selector
  window.$ = function (selector, node) {
    return (node || document).querySelector(selector);
  };
  window.$$ = function (selector, node) {
    return (node || document).querySelectorAll(selector);
  };

  // addEventListener
  window.$on = function (target, type, callback) {
    target.addEventListener(type, callback);
  };

  /**
   *
   * @param {string} elToCreate HTML element name
   * @param {object} attributes Element attributes {class: 'container', id: '123', etc...}
   * @param  {string | element} children String - text, element - another element
   * @returns {element} Returns object
   */
  window.$cl = function (elToCreate, attributes, ...children) {
    const element = document.createElement(elToCreate);

    for (const prop in attributes) {
      element.setAttribute(prop, attributes[prop]);
    }

    children.forEach((child) => {
      if (typeof child === 'string') {
        element.innerText = child;
      } else if (typeof child === 'object') {
        element.append(child);
      }
    });

    return element;
  };
})(window);
