import { Client, ClientOptions, CacheClient } from "discord-cross-hosting";
export interface CacheClientOptions extends ClientOptions {
    storageOptions?: {
        path: Array<{
            path: string;
            maxSize: number;
        }>;
    };
}
export declare const ClientStorageOptions: {
    path: {
        path: string;
        maxSize: number;
    }[];
};
export interface CacheClientType {
    client?: Client;
    storage?: CacheClient;
}
export declare class CacheClientProvider {
    options: CacheClientOptions;
    constructor(options: CacheClientOptions);
    build(): CacheClientType;
    create(): CacheClientType;
}
//# sourceMappingURL=CacheClientProvider.d.ts.map