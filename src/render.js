const {addClass, classnames, setStyle, setAttr, setEvent} = require('./dom');

function isDef(v) {
    return v !== undefined && v !== null;
}

function isPrimitive(value) {
    return (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'symbol' ||
        typeof value === 'boolean'
    );
}

function normalizeChildren(children) {
    if (isPrimitive(children)) {
        return [createText(children)];
    }

    if (!Array.isArray(children)) {
        return [children];
    }

    return children;
}

function createElement(context, tag, data, children = []) {
    const el = document.createElement(tag);

    addClass(el, classnames(data.class || {}));

    setStyle(el, data.style || {});

    setAttr(el, data.attrs || {});

    setEvent(el, data.on || {});

    if (data.ref) {
        context.$refs[data.ref] = el;
    }

    children = normalizeChildren(children);

    children.forEach(function (child) {
        el.appendChild(child);
    });

    return el;
}

function createText(text) {
    return document.createTextNode(text);
}

class Render {
    constructor(options) {
        this.$refs = {};

        this.$el = null;
        this.render = options.render;
        this.el = options.el;

        this.isMounted = false;
        if (this.el) {
            this.$mount(this.el);
        }
    }

    $createElement(tag, data, children = []) {
        if (isDef(tag)) {
            return createElement(this, tag, data, children);
        } else {
            return createText(data);
        }
    }

    $mount(parentElement) {
        parentElement = parentElement || this.el;

        if (!parentElement) {
            throw new Error('[Render]: not found parentElement');
        }

        if (this.isMounted) {
            return this;
        }
        this.isMounted = true;

        this.parentElement = parentElement;

        this.$el = this.render.call(this, this.$createElement.bind(this));

        setStyle(this.$el, {
            display: 'none',
        });

        parentElement.appendChild(this.$el);

        return this;
    }

    show(displayValue = 'block') {
        setStyle(this.$el, {
            display: displayValue,
        });
    }

    hide(force = false) {
        if (force) {
            this.remove();
        } else {
            setStyle(this.$el, {
                display: 'none',
            });
        }
    }

    remove() {
        const parentElement = this.parentElement || this.$el.parentElement;
        parentElement && parentElement.removeChild(this.$el);
    }
}
exports.Render = Render;
