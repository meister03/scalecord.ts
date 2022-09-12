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
exports.CacheServerProvider = exports.ServerStorageOptions = void 0;
var discord_cross_hosting_1 = require("discord-cross-hosting");
exports.ServerStorageOptions = {
    path: [
        {
            path: 'guilds',
            maxSize: Infinity
        },
        {
            path: 'channels',
            maxSize: Infinity
        },
        {
            path: 'users',
            maxSize: Infinity
        },
    ]
};
var CacheServerProvider = (function () {
    function CacheServerProvider(options) {
        this.options = options;
    }
    CacheServerProvider.prototype.build = function (options) {
        this.options.token = options.token;
        return this.create();
    };
    CacheServerProvider.prototype.create = function () {
        var cache = {};
        cache.bridge = new discord_cross_hosting_1.Bridge(__assign(__assign({}, this.options), { token: this.options.token, totalMachines: this.options.totalMachines }));
        var storageOptions = this.options.storageOptions || exports.ServerStorageOptions;
        cache.storage = new discord_cross_hosting_1.CacheServer(cache.bridge, storageOptions);
        return cache;
    };
    return CacheServerProvider;
}());
exports.CacheServerProvider = CacheServerProvider;
