import { Bot, CreateBotOptions } from "discordeno";
import { CacheClientType, OverwrittenGatewayManagerClient, Providers } from "./Providers/mod";
export declare function createBot(options: CreateBotOptions, providers?: Providers): OverwrittenBot;
export interface OverwrittenBot extends Bot {
    gateway: OverwrittenGatewayManagerClient;
    storage?: CacheClientType;
}
//# sourceMappingURL=Client.d.ts.map