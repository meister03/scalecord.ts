import { Client, ClientOptions } from "discord-cross-hosting";
import { Bot } from "discordeno";
import { createGatewayManager, CreateGatewayManager, ShardGatewayConfig } from "discordeno/gateway";
import { PickPartial } from "../../types/shared";
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
export declare class GatewayClientProvider {
    gateway?: OverwrittenGatewayManagerClient;
    options: OverwrittenCreateGatewayManagerOptions;
    constructor(options: OverwrittenCreateGatewayManagerOptions);
    build(options: {
        token: string;
        bot: Bot;
    }): OverwrittenGatewayManagerClient;
    create(gateway: OverwrittenGatewayManagerClient, bot: Bot): void;
    handlePayload(bot: Bot, packet: DiscordGatewayPayloadIPCMessage): void;
}
export {};
//# sourceMappingURL=GatewayClientProvider.d.ts.map