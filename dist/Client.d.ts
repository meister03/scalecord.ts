import { CacheClient } from "discord-cross-hosting";
import { Bot, CreateBotOptions } from "discordeno";
import { OverwrittenGatewayManagerClient, Providers } from "./Providers/mod";
export declare function createBot(options: CreateBotOptions, providers?: Providers): OverwrittenBot;
export interface OverwrittenBot extends Bot {
    gateway: OverwrittenGatewayManagerClient;
    storage?: CacheClient;
}
//# sourceMappingURL=Client.d.ts.map