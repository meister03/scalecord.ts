"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayClientProvider = void 0;
const discord_cross_hosting_1 = require("discord-cross-hosting");
const gateway_1 = require("discordeno/gateway");
const shared_1 = require("../../types/shared");
class GatewayClientProvider {
    gateway;
    options;
    constructor(options) {
        this.options = options;
    }
    build(options) {
        if (!this.options.gatewayConfig)
            this.options.gatewayConfig = { token: options.token };
        else
            this.options.gatewayConfig.token = options.token;
        if (!this.options.gatewayBot)
            this.options.gatewayBot = {};
        this.gateway = (0, gateway_1.createGatewayManager)(this.options);
        this.create(this.gateway, options.bot);
        return this.gateway;
    }
    create(gateway, bot) {
        if (!this.options.tcpOptions)
            this.options.tcpOptions = {};
        gateway.client = new discord_cross_hosting_1.Client({
            ...this.options.tcpOptions,
            host: this.options.customUrl.replace(/[0-9]/g, '').replace('http://', '').replace(':', ''),
            port: Number(this.options.customUrl.replace(/[^0-9]/g, '')),
            authToken: this.options.secretKey,
            agent: 'bot',
        });
        gateway.client.on('bridgeMessage', (msg, client) => {
            if (msg?._type === shared_1.GatewayIPCMessageTypes.PACKET && msg.packet) {
                this.handlePayload(bot, msg.packet);
            }
        });
        gateway.start = async () => {
            await gateway.client?.connect();
            const requestedData = await gateway.client?.requestShardData();
            gateway.manager.totalShards = requestedData?.totalShards;
            gateway.firstShardId = requestedData?.shardList.flat().pop();
            gateway.lastShardId = requestedData?.shardList.flat().shift();
            return undefined;
        };
    }
    handlePayload(bot, packet) {
        if (!packet.t)
            return;
        bot.events.raw(bot, packet, packet.shardId);
        bot.handlers[packet.t]?.(bot, packet, packet.shardId);
    }
}
exports.GatewayClientProvider = GatewayClientProvider;
