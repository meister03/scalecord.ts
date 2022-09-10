import { Bot, CreateBotOptions } from "discordeno";
import { OverwrittenGatewayManagerClient, Providers } from "./Providers/mod";
export declare function createBot(options: CreateBotOptions, providers?: Providers): GatewayBot;
interface GatewayBot extends Bot {
    gateway: OverwrittenGatewayManagerClient;
}
export {};
