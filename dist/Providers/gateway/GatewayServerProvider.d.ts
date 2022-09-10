import { CreateGatewayManager, createGatewayManager, Shard, ShardGatewayConfig } from "discordeno/gateway";
import { DiscordGatewayPayload } from "discordeno/types";
import { PickPartial } from "../../types/shared";
import { Bridge, BridgeOptions, Client } from "discord-cross-hosting";
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
    convertPayload?(shard: Shard, message: DiscordGatewayPayload & {
        shardId?: number;
    }): DiscordGatewayPayloadIPCMessage;
    sendPayload?(message: DiscordGatewayPayload & DiscordGatewayPayloadIPCMessage): any;
}
export interface OverwrittenGatewayManager extends ReturnType<typeof createGatewayManager> {
    bridge?: Bridge & {
        clients?: Map<string, Client & {
            shardList?: number[][];
        }>;
    };
    start(): Promise<undefined>;
}
export declare class GatewayServerProvider {
    options: OverwrittenCreateGatewayManagerOptions;
    gateway?: OverwrittenGatewayManager;
    constructor(options: OverwrittenCreateGatewayManagerOptions);
    build(options: {
        token: string;
    }): OverwrittenGatewayManager;
    create(gateway: OverwrittenGatewayManager): void;
    handleDiscordPayload(shard: Shard, message: DiscordGatewayPayload): any;
    filterPayload(shard: Shard, message: DiscordGatewayPayload): boolean | Boolean;
    convertPayload(shard: Shard, message: DiscordGatewayPayload & {
        shardId?: number;
    }): DiscordGatewayPayload & {
        shardId?: number | undefined;
    };
    sendPayload(message: ReturnType<GatewayServerProvider["convertPayload"]>): any;
}
export {};
