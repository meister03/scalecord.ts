import { Collection } from "discordeno";
import { createGatewayManager, Shard } from "discordeno/gateway";
export declare class FakeWebSocket {
    shards: Collection<number, Shard>;
    constructor(gateway: ReturnType<typeof createGatewayManager>);
    get ping(): number;
    getShards(): {
        gatewayConfig: import("discordeno").ShardGatewayConfig;
        heart: import("discordeno").ShardHeart;
        id: number;
        maxRequestsPerRateLimitTick: number;
        previousSequenceNumber: number | null;
        rateLimitResetInterval: number;
        sessionId: string | undefined;
        socket: any;
        state: import("discordeno").ShardState;
        totalShards: number;
        resumeGatewayUrl: string;
        events: import("discordeno").ShardEvents;
        calculateSafeRequests: () => number;
        close: (code: number, reason: string) => void;
        connect: () => Promise<void>;
        identify: () => Promise<void>;
        isOpen: () => boolean;
        makePresence: ((shardId: number) => import("discordeno").StatusUpdate | Promise<import("discordeno").StatusUpdate>) | undefined;
        resume: () => Promise<void>;
        send: (message: import("discordeno").ShardSocketRequest, highPriority?: boolean | undefined) => Promise<void>;
        shutdown: () => Promise<void>;
        bucket: import("discordeno").LeakyBucket;
        handleClose: (close: dntShim.CloseEvent) => Promise<void>;
        handleMessage: (message: dntShim.MessageEvent<any>) => Promise<void>;
        requestIdentify: () => Promise<void>;
        offlineSendQueue: ((_?: unknown) => void)[];
        resolves: Map<"READY" | "RESUMED" | "INVALID_SESSION", (payload: import("discordeno").DiscordGatewayPayload) => void>;
        startHeartbeating: (interval: number) => void;
        stopHeartbeating: () => void;
        status: import("discordeno").ShardState;
        ping: number;
    }[];
}
//# sourceMappingURL=Websocket.d.ts.map