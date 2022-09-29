import { createRestManager, CreateRestManagerOptions } from "discordeno/rest";
interface OverwrittenCreateRestManagerOptions extends Omit<CreateRestManagerOptions, "token"> {
    token?: string;
    secretKey: string;
    customUrl: string;
}
export declare class RestClientProvider {
    options: OverwrittenCreateRestManagerOptions;
    constructor(options: OverwrittenCreateRestManagerOptions);
    build(options: {
        token: string;
    }): ReturnType<typeof createRestManager>;
}
export {};
//# sourceMappingURL=RestClientProvider.d.ts.map