import { CacheClient } from "discord-cross-hosting";
import { Bot, createBot as DDcreateBot, CreateBotOptions } from "discordeno";
import { OverwrittenGatewayManagerClient, Providers } from "./Providers/mod";

export function createBot(options: CreateBotOptions, providers?: Providers) {
    if (providers?.rest) {
        options.rest = providers.rest.build({ token: options.token });
        options.secretKey = providers.rest?.options.secretKey;
    }
    const bot = DDcreateBot(options) as OverwrittenBot;
    if (providers?.gateway) {
        const gateway = providers.gateway.build({ token: options.token , bot});
        bot.gateway = gateway;
    }else bot.gateway.start = async () => {
        throw new Error('GatewayClientProviderOptions has not been provided');
        //return undefined;
    };
    if (providers?.cache) {
        bot.storage = providers.cache.build().storage;
    }
    return bot;
}

export interface OverwrittenBot extends Bot {
    gateway: OverwrittenGatewayManagerClient;
    storage?: CacheClient;
}