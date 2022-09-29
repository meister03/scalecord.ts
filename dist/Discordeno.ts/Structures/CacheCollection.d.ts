import { CacheBot, CreateCacheCollectionOptions } from "../Managers/CacheManager";
import { BaseCollection } from "./BaseCollection";
export declare class CacheCollection<V, rawStructure> extends BaseCollection<string, rawStructure> {
    client: CacheBot;
    context: string;
    properties: string[] | {
        includes: (str: string) => boolean;
        _cacheAll: boolean;
    };
    transformerClass: any;
    forceSetFilter: any;
    _options: {
        client: CacheBot;
        context: string;
        properties: string[] | {
            includes: (str: string) => boolean;
            _cacheAll: boolean;
        };
        transformerClass: any;
        maxSize?: number | undefined;
        sweepFilter?: Function | undefined;
        forceSetFilter?: Function | undefined;
    };
    constructor(options?: CreateCacheCollectionOptions);
    has(k: string): boolean;
    delete(k: string): boolean;
    _set(key: string, value: V, options?: {
        forceSet?: boolean;
        removeProps?: boolean;
    }): this;
    _get(key: any, options?: {}): NonNullable<rawStructure> | null;
    _delete(key: any): boolean;
    base(v: {
        id: string;
    }, options?: {}): {
        id: string;
    } | null;
    set(k: any, v: any, options?: {}): this | null;
    get(k: any, options?: {}): any;
    transform(v: any, options?: {}): any;
    patch(k: any, v: any): this | null;
}
//# sourceMappingURL=CacheCollection.d.ts.map