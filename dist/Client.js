"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBot = void 0;
const discordeno_1 = require("discordeno");
function createBot(options, providers) {
    if (providers?.rest) {
        options.rest = providers.rest.build({ token: options.token });
        options.secretKey = providers.rest?.options.secretKey;
    }
    const bot = (0, discordeno_1.createBot)(options);
    if (providers?.gateway) {
        const gateway = providers.gateway.build({ token: options.token, bot });
        bot.gateway = gateway;
    }
    else
        bot.gateway.start = async () => {
            throw new Error('GatewayClientProviderOptions has not been provided');
            //return undefined;
        };
    if (providers?.cache) {
        bot.storage = providers.cache.build().storage;
    }
    return bot;
}
exports.createBot = createBot;
