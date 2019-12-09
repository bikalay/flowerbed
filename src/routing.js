import {ShadowComponent, appendComponent, registerComponent} from "./component";
import {clear} from "./dom";

function matchRoutes(pathTemplate, path) {
    const templateKey = pathTemplate.split('?')[0];
    const pathKey = path.split('?')[0];
    return pathKey === templateKey;
}
function getParams(pathTemplate, path) {
    const result = {};
    const match = pathTemplate.match(/([\?&]?:)([^?&]+)/img);
    if(match) {
        const keys = match.map(v => v.replace(/(\?|&|:)/img, ''));
        const query = path.split('?')[1];
        if (query) {
            const params = new URLSearchParams(query);
            keys.forEach(key => {
                if (params.has(key)) {
                    result[key] = decodeURIComponent(params.get(key));
                }
            });
        }
    }
    return result;
}
export class Router extends ShadowComponent {
    static tagName = 't-router';
    _routes = [];
    constructor() {
        super();
        this.handleRoute = () => {
            const path = location.hash.slice(1);
            let route = this._routes.find(route => matchRoutes(route.path, path));
            if(!route) {
                route = this._routes.find(route => route.default) || this._routes[0];
            }
            const params = getParams(route.path, path);
            clear(this._shadowRoot);
            const props = Object.assign({}, route.props || {}, params);
            appendComponent(route.component, props, this._shadowRoot);
        };
        window.addEventListener('hashchange', this.handleRoute, false);
    }
    disconnectedCallback() {
        window.removeEventListener('hashchange', this.handleRoute);
    }
    addRoute(route) {
        this._routes.push(route);
        this.handleRoute();
    }

    set routes(value) {
        this._routes = value;
        this.handleRoute();
    }
}

registerComponent(Router);

export function go(path, params) {
    location.hash = href(path, params);
}

export function href(path, params = {}) {
    const p = new URLSearchParams('');
    Object.keys(params).forEach(key => {
        p.append(key, encodeURIComponent(params[key]));
    });
    const query = p.toString();
    return '#' + path + (query ? '?'+query : '');
}







