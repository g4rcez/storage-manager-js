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
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("./types");
var Cookie_1 = require("./storages/Cookie");
var LocalStorage_1 = require("./storages/LocalStorage");
var SessionStorage_1 = require("./storages/SessionStorage");
var Cookie_2 = require("./storages/Cookie");
exports.Cookie = Cookie_2.default;
var LocalStorage_2 = require("./storages/LocalStorage");
exports.LocalStorage = LocalStorage_2.default;
var SessionStorage_2 = require("./storages/SessionStorage");
exports.SessionStorage = SessionStorage_2.default;
exports.Storages = __assign({}, types_1.Storages);
function normalize(str) {
    return str.toLowerCase().trim();
}
var managers = {
    cookie: function () { return new Cookie_1.default(); },
    localstorage: function () { return new LocalStorage_1.default(); },
    sessionstorage: function () { return new SessionStorage_1.default(); },
};
function getManager(value) {
    return managers[normalize(value)];
}
function StorageManagerJs(managerName) {
    if (managerName === void 0) { managerName = "cookie"; }
    var manager = getManager(managerName);
    return Object.freeze({
        all: function () { return manager.parser(); },
        cat: function (key) { return manager.get(key); },
        clear: function (key) { return manager.unset(key); },
        create: function (key, value, params) { return manager.set(key, value, params); },
        delete: function (key) { return manager.unset(key); },
        get: function (key) { return manager.get(key); },
        getItem: function (key) { return manager.get(key); },
        item: function (key) { return manager.get(key); },
        json: function () { return JSON.stringify(manager.parser()); },
        remove: function (key) { return manager.unset(key); },
        rm: function (key) { return manager.unset(key); },
        set: function (key, value, params) { return manager.set(key, value, params); },
        setItem: function (key, value, params) { return manager.set(key, value, params); },
        touch: function (key, value, params) { return manager.set(key, value, params); },
        unset: function (key) { return manager.unset(key); },
    });
}
exports.StorageManagerJs = StorageManagerJs;
//# sourceMappingURL=index.js.map