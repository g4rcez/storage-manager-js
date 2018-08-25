"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var isObject = function (value) {
    return value && typeof value === "object" && value.constructor === Object;
};
var isStr = function (value) { return typeof value === "string" || value instanceof String; };
var mapper = function (object, callback) {
    try {
        Object.keys(object).map(function (item) {
            return callback(item);
        });
    }
    catch (error) { }
};
var has = function (object, value) {
    return !isObject(object)
        ? false
        : Object.keys(object)
            .filter(function (item) { return item === value; })
            .toString() === value && isStr(value);
};
var c = {};
var op = {
    localstorage: {
        parser: function () { return window.localStorage; },
        get: function (key) { return window.localStorage.getItem(key); },
        set: function (key, value) { return window.localStorage.setItem(key, value); },
        unset: function (key) {
            try {
                window.localStorage.removeItem(key);
            }
            catch (error) { }
        },
        clear: function () {
            mapper(window.localStorage, op.localstorage.unset);
        }
    },
    sessionstorage: {
        parser: function () { return window.sessionStorage; },
        get: function (key) { return window.sessionStorage.getItem(key); },
        set: function (key, value) { return window.sessionStorage.setItem(key, value); },
        unset: function (key) {
            try {
                window.sessionStorage.removeItem(key);
            }
            catch (error) { }
        },
        clear: function () {
            mapper(window.sessionStorage, op.sessionstorage.unset);
        }
    },
    cookie: {
        parser: function () {
            if (document.cookie === "") {
                return {};
            }
            return document.cookie
                .split("; ")
                .map(function (v) { return v.split("="); })
                .reduce(function (acc, v) {
                acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
                return acc;
            }, {});
        },
        set: function (key, val) {
            console.log(key + "=" + val + "; Path=/;");
            document.cookie = key + "=" + val + "; Path=/;";
        },
        get: function (key) { return c[key]; },
        unset: function (key) {
            document.cookie = encodeURIComponent(key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
            c[key] = null;
        },
        clear: function () {
            mapper(op.cookie.parser(), op.cookie.unset);
            c = {};
        }
    }
};
function StorageManagerJs(manager) {
    if (manager === void 0) { manager = "cookie"; }
    var managers = Object.freeze({
        c: "cookie",
        l: "localstorage",
        s: "sessionstorage",
        cookie: "cookie",
        localstorage: "localstorage",
        sessionstorage: "sessionstorage"
    });
    if (!!Storage) {
        manager = managers[manager.toLowerCase()] || "cookie";
    }
    else {
        console.warn("Browser doesn't have support to Storage");
        manager = "cookie";
    }
    return Object.freeze({
        get: get,
        set: set,
        json: json,
        clear: clear,
        unset: unset,
        change: change,
        clearAll: clearAll,
        cat: get,
        all: json,
        item: get,
        rm: unset,
        touch: set,
        create: set,
        getItem: get,
        setItem: set,
        "delete": unset,
        remove: unset,
        purge: clearAll
    });
    function json() {
        var parser = op[manager].parser();
        Object.keys(parser).map(function (item) {
            var _a, _b;
            try {
                return _a = {}, _a[item] = JSON.parse(parser[item]), _a;
            }
            catch (error) {
                return _b = {}, _b[item] = parser[item], _b;
            }
        });
    }
    function change(value) {
        if (value === void 0) { value = "cookie"; }
        if (has(managers, value)) {
            manager = managers[value.toLowerCase().trim()];
        }
        else {
            manager = "cookie";
        }
        c = op[manager].parser();
        return this;
    }
    function get(key, expect) {
        var value = op[manager].get(key);
        try {
            return expect === "raw" || expect === "r"
                ? value
                : expect === "array" || expect === "a"
                    ? value.split(",")
                    : JSON.parse(value);
        }
        catch (error) {
            return value;
        }
    }
    function set(key, value, expires) {
        if (expires === void 0) { expires = ""; }
        var _a;
        if (typeof value === 'string') {
            op[manager].set(key, value, expires);
        }
        else {
            op[manager].set(key, JSON.stringify(value), expires);
        }
        c = __assign({}, c, (_a = {}, _a[key] = value, _a));
        return this;
    }
    function unset(key) {
        op[manager].unset(key);
        return this;
    }
    function clear() {
        op[manager].clear();
        return this;
    }
    function clearAll() {
        ["cookie", "localstorage", "sessionstorage"].forEach(function (x) { return op[x].clear(); });
        return this;
    }
}
exports["default"] = StorageManagerJs;
