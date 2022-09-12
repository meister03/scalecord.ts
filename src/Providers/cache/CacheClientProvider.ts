import { Client, ClientOptions, CacheClient } from "discord-cross-hosting";

export interface CacheClientOptions extends ClientOptions {
    storageOptions?: { path: Array<{ path: string, maxSize: number }> }
}

export const ClientStorageOptions = {
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
}

export interface CacheClientType {
    client?: Client;
    storage?: CacheClient;
}

export class CacheClientProvider {
    options: CacheClientOptions;
    constructor(options: CacheClientOptions) {
        this.options = options;
    }

    public build() {
        return this.create();
    }

    public create() {
        const cache: CacheClientType = {};
        cache.client = new Client(this.options);

        const storageOptions = this.options.storageOptions || ClientStorageOptions;
        cache.storage = new CacheClient(cache.client, storageOptions);
        return cache;
    }
}