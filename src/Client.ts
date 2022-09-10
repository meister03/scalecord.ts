import { Bot, createBot as DDcreateBot, CreateBotOptions } from "discordeno";
import { OverwrittenGatewayManagerClient, Providers } from "./Providers/mod";

export function createBot(options: CreateBotOptions, providers?: Providers) {
    if (providers?.cache) {

    }
    if (providers?.rest) {
        options.rest = providers.rest.build({ token: options.token });
    }
    const bot = DDcreateBot(options) as GatewayBot;
    if (providers?.gateway) {
        const gateway = providers.gateway.build({ token: options.token , bot});
        bot.gateway = gateway;
    }else bot.gateway.start = async () => {
        throw new Error('Gateway Provider has not been provided');
        //return undefined;
    };
    return bot;
}

interface GatewayBot extends Bot {
    gateway: OverwrittenGatewayManagerClient;
}

