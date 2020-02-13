"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cookie_1 = require("./storages/cookie");
exports.Cookie = cookie_1.default;
var local_storage_1 = require("./storages/local-storage");
exports.LocalStorage = local_storage_1.default;
var session_storage_1 = require("./storages/session-storage");
exports.SessionStorage = session_storage_1.default;
