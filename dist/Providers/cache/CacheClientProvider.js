"use strict";
exports.__esModule = true;
exports.CacheClientProvider = exports.ClientStorageOptions = void 0;
var discord_cross_hosting_1 = require("discord-cross-hosting");
exports.ClientStorageOptions = {
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
var CacheClientProvider = (function () {
    function CacheClientProvider(options) {
        this.options = options;
    }
    CacheClientProvider.prototype.build = function () {
        return this.create();
    };
    CacheClientProvider.prototype.create = function () {
        var cache = {};
        cache.client = new discord_cross_hosting_1.Client(this.options);
        var storageOptions = this.options.storageOptions || exports.ClientStorageOptions;
        cache.storage = new discord_cross_hosting_1.CacheClient(cache.client, storageOptions);
        return cache;
    };
    return CacheClientProvider;
}());
exports.CacheClientProvider = CacheClientProvider;
