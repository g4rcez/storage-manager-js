"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var LocalStorage = /** @class */ (function () {
    function LocalStorage() {
    }
    LocalStorage.prototype.parser = function () {
        return window.localStorage;
    };
    LocalStorage.prototype.clear = function () {
        utils_1.map(window.localStorage, this.unset);
        return this;
    };
    LocalStorage.prototype.get = function (key) {
        var string = window.localStorage.getItem(key) || "";
        try {
            return JSON.parse(string);
        }
        catch (error) {
            return string;
        }
    };
    LocalStorage.prototype.unset = function (key) {
        try {
            window.localStorage.removeItem(key);
        }
        catch (error) {
            window.localStorage.removeItem("");
        }
        return this;
    };
    LocalStorage.prototype.set = function (key, object) {
        window.localStorage.setItem(key, JSON.stringify(object));
        return this;
    };
    return LocalStorage;
}());
exports.default = LocalStorage;
//# sourceMappingURL=LocalStorage.js.map