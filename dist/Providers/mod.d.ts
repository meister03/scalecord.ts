import { DiscordGatewayPayload } from "discordeno/types";
import { CacheClientProvider } from "./cache/CacheClientProvider";
import { CacheServerProvider } from "./cache/CacheServerProvider";
import { GatewayClientProvider } from "./gateway/GatewayClientProvider";
import { GatewayServerProvider } from "./gateway/GatewayServerProvider";
import { RestClientProvider } from "./rest/RestClientProvider";
import { RestServerProvider } from "./rest/RestServerProvider";
export * from "./cache/CacheClientProvider";
export * from "./cache/CacheServerProvider";
export * from "./gateway/GatewayClientProvider";
export * from "./gateway/GatewayServerProvider";
export * from "./rest/RestClientProvider";
export * from "./rest/RestServerProvider";
export interface Providers {
    gateway?: GatewayClientProvider;
    rest?: RestClientProvider;
    cache?: CacheClientProvider;
}
export interface ServerProviders {
    rest?: RestServerProvider;
    gateway?: GatewayServerProvider;
    cache?: CacheServerProvider;
}
export interface DiscordGatewayPayloadIPCMessage extends DiscordGatewayPayload {
    shardId: number;
}
//# sourceMappingURL=mod.d.ts.map