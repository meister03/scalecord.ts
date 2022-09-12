import { RestManager } from "discordeno/rest";
import { CacheServerType, OverwrittenGatewayManager, ServerProviders } from "./Providers/mod";
export declare class Server {
    options: {
        token: string;
        providers: ServerProviders;
    };
    rest?: RestManager;
    gateway?: OverwrittenGatewayManager;
    cache?: CacheServerType;
    constructor(options: {
        token: string;
        providers: ServerProviders;
    });
    build(): void;
}
//# sourceMappingURL=Server.d.ts.map