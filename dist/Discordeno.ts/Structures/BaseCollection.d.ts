import { Collection } from "discordeno";
export declare class BaseCollection<k, v> extends Collection<k, v> {
    convertKey: any;
    constructor(options?: {
        convertKey?: Boolean;
    });
    has(key: string): boolean;
    get(key: string): v | undefined;
    set(key: string, value: any, options?: {
        forceSet?: any;
    }): this;
    delete(key: string): boolean;
    first(): v | undefined;
    last(): v | undefined;
}
//# sourceMappingURL=BaseCollection.d.ts.map