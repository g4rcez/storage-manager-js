"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStr = function (value) { return typeof value === "string" || value instanceof String; };
exports.fnDate = function (str) {
    var date = new Date();
    var integer = new Date(date * 1 + str * 864e5);
    return !!parseInt(str, 10) ? integer : str;
};
exports.map = function (object, callback) {
    try {
        Object.keys(object).forEach(function (x) { return callback(x); });
    }
    catch (error) {
        window.console.log(error);
    }
};
//# sourceMappingURL=utils.js.map