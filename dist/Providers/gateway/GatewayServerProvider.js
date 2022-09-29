"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayServerProvider = void 0;
const discordeno_1 = require("discordeno");
const gateway_1 = require("discordeno/gateway");
const shared_1 = require("../../types/shared");
const discord_cross_hosting_1 = require("discord-cross-hosting");
class GatewayServerProvider {
    options;
    gateway;
    constructor(options) {
        this.options = options;
    }
    build(options) {
        this.options.token = options.token;
        if (!this.options.gatewayConfig)
            this.options.gatewayConfig = { token: options.token, intents: this.options.intents };
        else {
            this.options.gatewayConfig.token = options.token;
            this.options.gatewayConfig.intents = this.options.intents;
        }
        if (!this.options.gatewayBot)
            this.options.gatewayBot = {};
        if (!this.options.handleDiscordPayload)
            this.options.handleDiscordPayload = this.handleDiscordPayload.bind(this);
        this.gateway = (0, gateway_1.createGatewayManager)(this.options);
        // Creates to an IPC to all clients
        this.create(this.gateway, options.rest);
        return this.gateway;
    }
    create(gateway, rest) {
        if (!this.options.tcpOptions)
            this.options.tcpOptions = {};
        gateway.bridge = new discord_cross_hosting_1.Bridge({
            //path: this.options.customUrl.replace(/[0-9]/g, '').replace(':', ''),
            ...this.options.tcpOptions,
            port: Number(this.options.customUrl.replace(/[^0-9]/g, '')),
            authToken: this.options.secretKey,
            token: this.options.token,
            totalMachines: this.options.totalMachines,
        });
        gateway.start = async () => {
            const tempBot = (0, discordeno_1.createBot)({
                token: this.options.token,
                secretKey: rest?.secretKey,
            });
            const gatewayBot = await tempBot.helpers.getGatewayBot();
            // Overwrite Properties
            if (gateway.bridge?.totalShards)
                gateway.bridge.totalShards = this.options.totalShards ?? gatewayBot.shards;
            await gateway.bridge?.start();
            gateway.gatewayBot = gatewayBot;
            gateway.manager.totalShards = this.options.totalShards ?? gatewayBot.shards;
            gateway.firstShardId = this.options.firstShardId ?? 0;
            gateway.lastShardId = this.options.lastShardId ?? gateway.manager.totalShards - 1;
            gateway.spawnShards();
            return undefined;
        };
    }
    handleDiscordPayload(shard, message) {
        if (this.filterPayload(shard, message))
            return;
        return this.sendPayload(this.convertPayload(shard, message));
    }
    filterPayload(shard, message) {
        if (this.options.filterPayload)
            return this.options.filterPayload(shard, message);
        if (!message.t)
            return true;
        return false;
    }
    convertPayload(shard, message) {
        if (this.options.convertPayload)
            return this.options.convertPayload(shard, message);
        message.shardId = shard.id;
        return message;
    }
    sendPayload(message) {
        if (this.options.sendPayload)
            return this.options.sendPayload(message);
        if (this.gateway?.bridge?.clients) {
            for (const client of Array.from(this.gateway.bridge.clients)) {
                if (client[1].shardList === undefined)
                    continue;
                const shardList = client[1].shardList.flat();
                if (shardList.includes(message.shardId)) {
                    const packetMessage = { packet: message, _type: shared_1.GatewayIPCMessageTypes.PACKET };
                    client[1].send(packetMessage);
                    break;
                }
            }
        }
        ;
    }
}
exports.GatewayServerProvider = GatewayServerProvider;
