import { createBot, RestManager } from "discordeno";
import { CreateGatewayManager, createGatewayManager, Shard, ShardGatewayConfig } from "discordeno/gateway";
import { DiscordGatewayPayload } from "discordeno/types";
import { GatewayIPCMessageTypes, PickPartial } from "../../types/shared";
import { Bridge, BridgeOptions } from "discord-cross-hosting"
import { DiscordGatewayPayloadIPCMessage } from "../mod";

interface OverwrittenCreateGatewayManagerOptions extends Omit<PickPartial<CreateGatewayManager, "gatewayConfig">, "gatewayConfig"> {
    token?: string;
    gatewayConfig?: PickPartial<ShardGatewayConfig, "token">;
    secretKey: string;
    customUrl: string;
    intents: number;
    totalMachines: number;
    tcpOptions?: BridgeOptions;
    filterPayload?(shard: Shard, message: DiscordGatewayPayload): Boolean;
    convertPayload?(shard: Shard, message: DiscordGatewayPayload & { shardId?: number }): DiscordGatewayPayloadIPCMessage;
    sendPayload?(message: DiscordGatewayPayload & DiscordGatewayPayloadIPCMessage): any;
}

export interface OverwrittenGatewayManager extends ReturnType<typeof createGatewayManager> {
    bridge?: Bridge;
    start(): Promise<undefined>;
}

export class GatewayServerProvider {
    options: OverwrittenCreateGatewayManagerOptions;
    gateway?: OverwrittenGatewayManager;
    constructor(options: OverwrittenCreateGatewayManagerOptions) {
        this.options = options;
    }

    public build(options: { token: string , rest?: RestManager}) {
        this.options.token = options.token;
        if (!this.options.gatewayConfig) this.options.gatewayConfig = { token: options.token, intents: this.options.intents };
        else {
            this.options.gatewayConfig.token = options.token;
            this.options.gatewayConfig.intents = this.options.intents;
        }
        if (!this.options.gatewayBot) this.options.gatewayBot = {} as any;
        if (!this.options.handleDiscordPayload) this.options.handleDiscordPayload = this.handleDiscordPayload.bind(this);
        this.gateway = createGatewayManager(this.options as CreateGatewayManager) as OverwrittenGatewayManager;

        // Creates to an IPC to all clients
        this.create(this.gateway, options.rest);
        return this.gateway;
    }

    public create(gateway: OverwrittenGatewayManager, rest?: RestManager) {
        if (!this.options.tcpOptions) this.options.tcpOptions = {} as any;
        gateway.bridge = new Bridge({
            //path: this.options.customUrl.replace(/[0-9]/g, '').replace(':', ''),
            ...this.options.tcpOptions,
            port: Number(this.options.customUrl.replace(/[^0-9]/g, '')),
            authToken: this.options.secretKey,
            token: this.options.token as string,
            totalMachines: this.options.totalMachines,
        })

        gateway.start = async () => {
            const tempBot = createBot({
                token: this.options.token as string, 
                secretKey: rest?.secretKey,
            });
            const gatewayBot = await tempBot.helpers.getGatewayBot();

            // Overwrite Properties
            if (gateway.bridge?.totalShards) gateway.bridge.totalShards = this.options.totalShards ?? gatewayBot.shards;
            await gateway.bridge?.start()


            gateway.gatewayBot = gatewayBot;
            gateway.manager.totalShards = this.options.totalShards ?? gatewayBot.shards;
            gateway.firstShardId = this.options.firstShardId ?? 0;
            gateway.lastShardId = this.options.lastShardId ?? gateway.manager.totalShards - 1;
            gateway.spawnShards();
            return undefined;
        }

    }

    public handleDiscordPayload(shard: Shard, message: DiscordGatewayPayload) {
        if (this.filterPayload(shard, message)) return;
        return this.sendPayload(
            this.convertPayload(shard, message)
        );
    }

    public filterPayload(shard: Shard, message: DiscordGatewayPayload) {
        if (this.options.filterPayload) return this.options.filterPayload(shard, message);
        if (!message.t) return true;
        return false;
    }

    public convertPayload(shard: Shard, message: DiscordGatewayPayload & { shardId?: number }) {
        if (this.options.convertPayload) return this.options.convertPayload(shard, message);
        message.shardId = shard.id;
        return message;
    }

    public sendPayload(message: ReturnType<GatewayServerProvider["convertPayload"]>) {
        if (this.options.sendPayload) return this.options.sendPayload(message as DiscordGatewayPayloadIPCMessage);

        if (this.gateway?.bridge?.clients) {
            for (const client of Array.from(this.gateway.bridge.clients)) {
                if (client[1].shardList === undefined) continue;
                const shardList = client[1].shardList.flat();
                if (shardList.includes(message.shardId as number)) {
                    const packetMessage = { packet: message, _type: GatewayIPCMessageTypes.PACKET };
                    client[1].send(packetMessage);
                    break;
                }
            }
        };
    }


}
