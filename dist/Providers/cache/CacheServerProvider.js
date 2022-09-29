"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheServerProvider = exports.ServerStorageOptions = void 0;
const discord_cross_hosting_1 = require("discord-cross-hosting");
exports.ServerStorageOptions = {
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
class CacheServerProvider {
    options;
    constructor(options) {
        this.options = options;
    }
    build(options) {
        this.options.token = options.token;
        return this.create();
    }
    create() {
        const cache = {};
        cache.bridge = new discord_cross_hosting_1.Bridge({
            //path: this.options.customUrl.replace(/[0-9]/g, '').replace(':', ''),
            ...this.options,
            token: this.options.token,
            totalMachines: this.options.totalMachines,
        });
        const storageOptions = this.options.storageOptions || exports.ServerStorageOptions;
        cache.storage = new discord_cross_hosting_1.CacheServer(cache.bridge, storageOptions);
        return cache;
    }
}
exports.CacheServerProvider = CacheServerProvider;
