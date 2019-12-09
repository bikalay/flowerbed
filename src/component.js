import {clear, create, fireEvent, on, off, insertBefore} from "./dom";

export class BaseComponent extends HTMLElement {
    static attrs= {};
    static get observedAttributes() {
        return Object.keys(this.attrs);
    }
    _elements = {};
    template = null;
    constructor() {
        super();
        const tagName = this.constructor.tagName;
        this.template = document.getElementById(tagName);
    }
    fireEvent(eventName, detail) {
        fireEvent(this, eventName, detail);
    }
    on(elementId, eventName, callback) {
        on(this._elements[elementId], eventName, callback);
    }
    off(elementId, eventName, callback) {
        off(this._elements[elementId], eventName, callback);
    }
    render() {

    }
}

export class Component extends BaseComponent {
    constructor() {
        super();
    }
    render() {
        if (this.template && this.template instanceof HTMLTemplateElement) {
            this.appendChild(document.importNode(this.template.content, true));
        }
        this.querySelectorAll('[id]').forEach(element => {
            this._elements[element.id] = element;
        });
    }
    connectedCallback() {
       this.render();
    }
}

export class ShadowComponent extends BaseComponent {
    static attrs= {};
    static get observedAttributes() {
        return Object.keys(this.attrs);
    }
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: 'open' });
        if (this.template && this.template instanceof HTMLTemplateElement) {
            this._shadowRoot.appendChild(document.importNode(this.template.content, true));
        }
        this._shadowRoot.querySelectorAll('[id]').forEach(element => {
            this._elements[element.id] = element;
        });
    }
}

/**
 *
 * @param component
 */
export function registerComponent(component) {
    window[component.name] = component;
    window.customElements.define(component.tagName, component);
    applyAttributes(component);
}

export function appendComponent(component, props, parent) {
   return create(component.tagName, props, parent);
}

export function insertBeforeComponent(component, props, parent, refElement) {
    return insertBefore(component.tagName, props, parent, refElement);
}

export function insertComponent(component, props, parent) {
    clear(parent);
    return appendComponent(component, props, parent);
}

function applyAttributes (component) {
    Object.keys(component.attrs).forEach(function (attr) {
        const prop = attr.replace(/-([a-z])/g, function (match, letter) {
            return letter.toUpperCase();
        });
        const defaultValue = component.attrs[attr].default;
        const type = component.attrs[attr].type;
        Object.defineProperty(component.prototype, prop, {
            get: function () {
                const attrValue = this.getAttribute(attr);
                switch(type) {
                    case Boolean:
                        return this.hasAttribute(attr);
                    case Number:
                        if(attrValue) {
                            return attrValue-0;
                        }
                        break;
                    default:
                        return attrValue || defaultValue;
                }
                if(!attrValue) {
                    return defaultValue;
                }
            },
            set: function (value) {
                if(value == null || (type === Boolean && !value)) {
                    this.removeAttribute(attr);
                } else {
                    this.setAttribute(attr, value);
                }
            }
        });
    });
}