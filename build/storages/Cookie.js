"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
exports.expire = function (cookie) { return cookie.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); };
var defaultParams = { path: "/", expires: "1969-12-31T23:59:59.000Z", domain: window.location.hostname };
var Cookie = /** @class */ (function () {
    function Cookie() {
    }
    Cookie.prototype.parser = function () {
        var cookie = document.cookie;
        if (cookie === "") {
            return {};
        }
        return cookie
            .split("; ")
            .map(function (v) { return v.split("="); })
            .reduce(function (acc, v) {
            acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
            return acc;
        }, {});
    };
    Cookie.prototype.clear = function () {
        document.cookie.split(";").forEach(function (cookie) {
            document.cookie = exports.expire(cookie);
        });
        return this;
    };
    Cookie.prototype.get = function (key) {
        var value = this.parser()[key];
        try {
            return JSON.parse(value);
        }
        catch (error) {
            return value;
        }
    };
    Cookie.prototype.unset = function (key) {
        document.cookie = encodeURIComponent(key) + "=;expires=" + new Date().toUTCString();
        return this;
    };
    Cookie.prototype.set = function (key, object, parameters) {
        if (parameters === void 0) { parameters = defaultParams; }
        var expires = parameters.expires, path = parameters.path;
        document.cookie = encodeURIComponent(key) + "=" + decodeURIComponent(JSON.stringify(object)) + "; path=" + path + "; expires=" + utils_1.fnDate(expires) + ";secure; SameSite=strict";
        return this;
    };
    return Cookie;
}());
exports.default = Cookie;
//# sourceMappingURL=Cookie.js.map