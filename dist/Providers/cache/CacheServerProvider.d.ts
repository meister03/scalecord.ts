import { Bridge, BridgeOptions, CacheServer } from "discord-cross-hosting";
export interface CacheServerOptions extends Omit<BridgeOptions, "token"> {
    token?: string;
    storageOptions?: {
        path: Array<{
            path: string;
            maxSize: number;
        }>;
    };
}
export declare const ServerStorageOptions: {
    path: {
        path: string;
        maxSize: number;
    }[];
};
export interface CacheServerType {
    bridge?: Bridge;
    storage?: CacheServer;
}
export declare class CacheServerProvider {
    options: CacheServerOptions;
    constructor(options: CacheServerOptions);
    build(options: {
        token: string;
    }): CacheServerType;
    create(): CacheServerType;
}
//# sourceMappingURL=CacheServerProvider.d.ts.map