"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Cookie_1 = require("./storages/Cookie");
var LocalStorage_1 = require("./storages/LocalStorage");
var SessionStorage_1 = require("./storages/SessionStorage");
var types_1 = require("./types");
var Cookie_2 = require("./storages/Cookie");
exports.Cookie = Cookie_2.default;
var LocalStorage_2 = require("./storages/LocalStorage");
exports.LocalStorage = LocalStorage_2.default;
var SessionStorage_2 = require("./storages/SessionStorage");
exports.SessionStorage = SessionStorage_2.default;
exports.Storages = types_1.Storages;
var normalize = function (str) { return str.toLowerCase().trim(); };
var managers = {
    cookie: function () { return new Cookie_1.default(); },
    localstorage: function () { return new LocalStorage_1.default(); },
    sessionstorage: function () { return new SessionStorage_1.default(); },
};
var getManager = function (value) { return managers[normalize(value)]; };
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