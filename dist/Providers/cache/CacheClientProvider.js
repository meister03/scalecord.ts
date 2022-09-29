"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheClientProvider = exports.ClientStorageOptions = void 0;
const discord_cross_hosting_1 = require("discord-cross-hosting");
exports.ClientStorageOptions = {
    path: [
        {
            path: 'guilds',
            maxSize: Infinity,
        },
        {
            path: 'channels',
            maxSize: Infinity,
        },
        {
            path: 'users',
            maxSize: Infinity,
        },
    ]
};
class CacheClientProvider {
    options;
    constructor(options) {
        this.options = options;
    }
    build() {
        return this.create();
    }
    create() {
        const cache = {};
        cache.client = new discord_cross_hosting_1.Client(this.options);
        const storageOptions = this.options.storageOptions || exports.ClientStorageOptions;
        cache.storage = new discord_cross_hosting_1.CacheClient(cache.client, storageOptions);
        return cache;
    }
}
exports.CacheClientProvider = CacheClientProvider;
