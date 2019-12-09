/**
 *
 * @param {string} tagName
 * @param {*} props
 * @param {HTMLElement?} parent
 * @return {HTMLElement}
 */
export function create(tagName, props, parent) {
    const element = document.createElement(tagName);
    Object.assign(element, props);
    if(parent) {
        parent.appendChild(element);
    }
    return element;
}

export function insertBefore(tagName, props, parent, refElement) {
    const element = document.createElement(tagName);
    Object.assign(element, props);
    parent.insertBefore(element, refElement);
    return element;
}


export function remove(element, parent) {
    parent.removeChild(element);
}

/**
 *
 * @param {HTMLElement} element
 */
export function clear(element) {
    element.innerHTML = '';
}

export function on(element, events, callback) {
    if(!Array.isArray(events)) {
        events = [events];
    }
    if(!Array.isArray(element)) {
        element = [element];
    }
    element.forEach(el => {
        events.forEach(eventName => {
            el.addEventListener(eventName, callback, false);
        });
    });
}

export function off(element, events, callback) {
    if(!Array.isArray(events)) {
        events = [events];
    }
    if(!Array.isArray(element)) {
        element = [element];
    }
    element.forEach(el => {
        events.forEach(eventName => {
            el.removeEventListener(eventName, callback);
        });
    });
}

export function fireEvent(element, eventName, detail) {
    const event = new CustomEvent(eventName, {bubbles: true, detail});
    element.dispatchEvent(event);
}

