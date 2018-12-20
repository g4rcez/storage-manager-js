"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./../utils");
var Cookie = /** @class */ (function () {
    function Cookie() {
    }
    Cookie.prototype.parser = function () {
        return document.cookie === ""
            ? {}
            : document.cookie
                .split("; ")
                .map(function (v) { return v.split("="); })
                .reduce(function (acc, v) {
                acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
                return acc;
            }, {});
    };
    Cookie.prototype.clear = function () {
        document.cookie.split(";").forEach(function (cookie) {
            document.cookie = utils_1.setExpires(cookie);
        });
        return this;
    };
    Cookie.prototype.get = function (key) {
        var string = this.parser()[key];
        try {
            return JSON.parse(string);
        }
        catch (error) {
            return JSON.parse(string);
        }
    };
    Cookie.prototype.unset = function (key) {
        document.cookie = encodeURIComponent(key) + "=;" + new Date().toUTCString();
        return this;
    };
    Cookie.prototype.set = function (key, object, parameters) {
        var path = "/";
        var expires = "1969-12-31T23:59:59.000Z";
        if (parameters) {
            if (parameters.path) {
                path = parameters.path;
            }
            if (parameters.expires) {
                expires = "" + parameters.expires;
            }
        }
        document.cookie = encodeURIComponent(key) + "=" + decodeURIComponent(JSON.stringify(object)) + ";path=" + path + ";expires=" + utils_1.fnDate(expires);
        return this;
    };
    return Cookie;
}());
exports.default = Cookie;
//# sourceMappingURL=Cookie.js.map