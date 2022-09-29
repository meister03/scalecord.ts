import { Client, ClientOptions, IPCMessage } from "discord-cross-hosting";
import { Bot, GatewayDispatchEventNames } from "discordeno";
import { createGatewayManager, CreateGatewayManager, ShardGatewayConfig } from "discordeno/gateway";
import { GatewayIPCMessageTypes, PickPartial } from "../../types/shared";
import { DiscordGatewayPayloadIPCMessage } from "../mod";

interface OverwrittenCreateGatewayManagerOptions extends Omit<PickPartial<CreateGatewayManager, "gatewayConfig">, "gatewayConfig"> {
    token?: string;
    gatewayConfig?: PickPartial<ShardGatewayConfig, "token">;
    secretKey: string;
    customUrl: string;
    tcpOptions?: ClientOptions;
}

export interface OverwrittenGatewayManagerClient extends ReturnType<typeof createGatewayManager> {
    client?: Client;
    start(): Promise<undefined>;
}

export class GatewayClientProvider {
    gateway?: OverwrittenGatewayManagerClient;
    options: OverwrittenCreateGatewayManagerOptions;
    constructor(options: OverwrittenCreateGatewayManagerOptions) {
        this.options = options;
    }

    public build(options: { token: string, bot: Bot }) {
        if (!this.options.gatewayConfig) this.options.gatewayConfig = { token: options.token };
        else this.options.gatewayConfig.token = options.token;
        if (!this.options.gatewayBot) this.options.gatewayBot = {} as any;
        this.gateway = createGatewayManager(this.options as CreateGatewayManager) as OverwrittenGatewayManagerClient;

        this.create(this.gateway, options.bot);
        return this.gateway as OverwrittenGatewayManagerClient;
    }

    public create(gateway: OverwrittenGatewayManagerClient, bot: Bot) {
        if(!this.options.tcpOptions) this.options.tcpOptions = {} as any;
        gateway.client = new Client({
            ...this.options.tcpOptions,
            host: this.options.customUrl.replace(/[0-9]/g, '').replace('http://', '').replace(':', ''),
            port: Number(this.options.customUrl.replace(/[^0-9]/g, '')),
            authToken: this.options.secretKey,
            agent: 'bot',
        });

        gateway.client.on('bridgeMessage', (msg: IPCMessage & { _type?: number , packet?: DiscordGatewayPayloadIPCMessage}, client) => {
            if (msg?._type === GatewayIPCMessageTypes.PACKET && msg.packet) {
                this.handlePayload(bot, msg.packet);
            }
        });

        gateway.start = async () => {
            await gateway.client?.connect()
            const requestedData = await gateway.client?.requestShardData();

            gateway.manager.totalShards = requestedData?.totalShards as number;
            gateway.firstShardId = requestedData?.shardList.flat().pop() as number;
            gateway.lastShardId = (requestedData?.shardList.flat().shift() as number);
            return undefined;
        }
    }

    public handlePayload(bot: Bot, packet: DiscordGatewayPayloadIPCMessage) {
        if (!packet.t) return;
        bot.events.raw(bot, packet, packet.shardId);
        bot.handlers[packet.t as GatewayDispatchEventNames]?.(
            bot,
            packet,
            packet.shardId,
        );
    }
}