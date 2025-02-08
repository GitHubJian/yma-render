const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
const MOZ_HACK_REGEXP = /^moz([A-Z])/;

function camelCase(name) {
    return name
        .replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
            return offset ? letter.toUpperCase() : letter;
        })
        .replace(MOZ_HACK_REGEXP, 'Moz$1');
}

function getStyle(el, stylename) {
    if (!el || !stylename) return null;

    stylename = camelCase(stylename);
    if (stylename === 'float') {
        stylename = 'cssFloat';
    }

    try {
        var computed = document.defaultView.getComputedStyle(el, '');
        return el.style[stylename] || computed ? computed[stylename] : null;
    } catch (e) {
        return el.style[stylename];
    }
}
exports.getStyle = getStyle;

function setStyle(el, stylename, value) {
    if (!el || !stylename) return;

    if (typeof stylename === 'object') {
        for (var prop in stylename) {
            if (stylename.hasOwnProperty(prop)) {
                setStyle(el, prop, stylename[prop]);
            }
        }
    } else {
        stylename = camelCase(stylename);

        el.style[stylename] = value;
    }
}
exports.setStyle = setStyle;

function sty2str(styles) {
    const style = [];

    for (const prop in styles) {
        if (styles.hasOwnProperty(prop)) {
            style.push(prop + ': ' + styles[prop]);
        }
    }

    return style.join('; ');
}
exports.sty2str = sty2str;

const on = (function on() {
    if (document.addEventListener) {
        return function (el, event, handler) {
            if (el && event && handler) {
                el.addEventListener(event, handler, false);
            }
        };
    }
    return function (el, event, handler) {
        if (el && event && handler) {
            el.attachEvent('on' + event, handler);
        }
    };
})();
exports.on = on;

const off = (function () {
    if (document.removeEventListener) {
        return function (el, event, handler) {
            if (el && event) {
                el.removeEventListener(event, handler, false);
            }
        };
    }
    return function (el, event, handler) {
        if (el && event) {
            el.detachEvent('on' + event, handler);
        }
    };
})();

exports.off = off;

function setEvent(el, eventname, fn) {
    if (!el || !eventname) return;

    if (typeof eventname === 'object') {
        for (var prop in eventname) {
            if (eventname.hasOwnProperty(prop)) {
                setEvent(el, prop, eventname[prop]);
            }
        }
    } else {
        on(el, eventname, fn.bind(this));
    }
}
exports.setEvent = setEvent;

function addClass(el, classname) {
    if (typeof classname === 'undefined') {
        return el;
    }

    const classes = classname.split(' ');
    for (let i = 0; i < classes.length; i++) {
        if (
            typeof el !== 'undefined' &&
            typeof el.classList !== 'undefined' &&
            !!classes[i]
        ) {
            el.classList.add(classes[i]);
        }
    }

    return el;
}
exports.addClass = addClass;

function removeClass(el, classname) {
    const classes = classname.split(' ');
    for (let i = 0; i < classes.length; i++) {
        if (typeof el !== 'undefined' && typeof el.classList !== 'undefined') {
            el.classList.remove(classes[i]);
        }
    }

    return el;
}
exports.removeClass = removeClass;

function hasClass(el, classname) {
    if (!el) {
        return false;
    }

    return el.classList.contains(classname);
}
exports.hasClass = hasClass;

function toggleClass(el, classname) {
    const classes = classname.split(' ');
    for (let i = 0; i < classes.length; i++) {
        if (typeof el !== 'undefined' && typeof el.classList !== 'undefined') {
            el.classList.toggle(classes[i]);
        }
    }

    return el;
}
exports.toggleClass = toggleClass;

const hasOwn = {}.hasOwnProperty;

function parseValue(arg) {
    if (typeof arg === 'string') {
        return arg;
    }

    if (typeof arg !== 'object') {
        return '';
    }

    if (Array.isArray(arg)) {
        return classnames.apply(null, arg);
    }

    if (
        arg.toString !== Object.prototype.toString &&
        !arg.toString.toString().includes('[native code]')
    ) {
        return arg.toString();
    }

    let classes = '';

    for (const key in arg) {
        if (hasOwn.call(arg, key) && arg[key]) {
            classes = appendClass(classes, key);
        }
    }

    return classes;
}

function appendClass(value, newClass) {
    if (!newClass) {
        return value;
    }

    return value ? value + ' ' + newClass : newClass;
}

function classnames() {
    let classes = '';

    for (let i = 0; i < arguments.length; i++) {
        const arg = arguments[i];
        if (arg) {
            classes = appendClass(classes, parseValue(arg));
        }
    }

    return classes;
}

exports.classnames = classnames;

function getAttr(el, attrname) {
    if (el) {
        return el.getAttribute(attrname);
    }

    return undefined;
}
exports.getAttr = getAttr;

function setAttr(el, attrname, value) {
    if (!el || !attrname) return;

    if (typeof attrname === 'object') {
        for (var prop in attrname) {
            if (attrname.hasOwnProperty(prop)) {
                setAttr(el, prop, attrname[prop]);
            }
        }
    } else {
        el.setAttribute(attrname, value);
    }

    return el;
}
exports.setAttr = setAttr;

function removeAttr(el, attrname) {
    el.removeAttribute(attrname);

    return el;
}
exports.removeAttr = removeAttr;
