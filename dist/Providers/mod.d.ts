import { DiscordGatewayPayload } from "discordeno/types";
import { CacheClientProvider } from "./cache/CacheClientProvider";
import { GatewayClientProvider } from "./gateway/GatewayClientProvider";
import { GatewayServerProvider } from "./gateway/GatewayServerProvider";
import { RestClientProvider } from "./rest/RestClientProvider";
import { RestServerProvider } from "./rest/RestServerProvider";
export * from "./cache/CacheClientProvider";
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
}
export interface DiscordGatewayPayloadIPCMessage extends DiscordGatewayPayload {
    shardId: number;
}
