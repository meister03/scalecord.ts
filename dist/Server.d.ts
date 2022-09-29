import { CacheServer } from "discord-cross-hosting";
import { RestManager } from "discordeno/rest";
import { OverwrittenGatewayManager, ServerProviders } from "./Providers/mod";
export declare class Server {
    options: {
        token: string;
        providers: ServerProviders;
    };
    rest?: RestManager;
    gateway?: OverwrittenGatewayManager;
    cache?: CacheServer;
    constructor(options: {
        token: string;
        providers: ServerProviders;
    });
    build(): void;
}
//# sourceMappingURL=Server.d.ts.map