import { Bridge, BridgeOptions, CacheServer } from "discord-cross-hosting";

export interface CacheServerOptions extends Omit<BridgeOptions, "token"> {
    token?: string;
    storageOptions?: { path: Array<{ path: string, maxSize: number }> }
}

export const ServerStorageOptions = {
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

export interface CacheServerType {
    bridge?: Bridge;
    storage?: CacheServer;
}

export class CacheServerProvider {
    options: CacheServerOptions;
    constructor(options: CacheServerOptions) {
        this.options = options;
    }
    public build(options: { token: string }) {
        this.options.token = options.token;
        return this.create();
    }

    public create() {
        const cache: CacheServerType = {
        };
        cache.bridge = new Bridge({
            //path: this.options.customUrl.replace(/[0-9]/g, '').replace(':', ''),
            ...this.options,
            token: this.options.token as string,
            totalMachines: this.options.totalMachines,
        })

        const storageOptions = this.options.storageOptions || ServerStorageOptions;
        cache.storage = new CacheServer(cache.bridge, storageOptions)
        return cache;
    }


}