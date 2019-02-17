"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var SessionStorage = /** @class */ (function () {
    function SessionStorage() {
    }
    SessionStorage.prototype.parser = function () {
        return window.sessionStorage;
    };
    SessionStorage.prototype.clear = function () {
        utils_1.map(window.sessionStorage, this.unset);
        return this;
    };
    SessionStorage.prototype.get = function (key) {
        var string = window.sessionStorage.getItem(key) || "";
        try {
            return JSON.parse(string);
        }
        catch (error) {
            return string;
        }
    };
    SessionStorage.prototype.unset = function (key) {
        try {
            window.sessionStorage.removeItem(key);
        }
        catch (error) {
            window.sessionStorage.removeItem("");
        }
        return this;
    };
    SessionStorage.prototype.set = function (key, object) {
        window.sessionStorage.setItem(key, JSON.stringify(object));
        return this;
    };
    return SessionStorage;
}());
exports.default = SessionStorage;
//# sourceMappingURL=SessionStorage.js.map