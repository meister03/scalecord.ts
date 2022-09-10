import { CreateRestManagerOptions } from "discordeno/rest";
interface OverwrittenCreateRestManagerOptions extends Omit<CreateRestManagerOptions, "token"> {
    token?: string;
    secretKey: string;
    customUrl: string;
}
export declare class RestClientProvider {
    options: OverwrittenCreateRestManagerOptions;
    constructor(options: OverwrittenCreateRestManagerOptions);
    build(options: {
        token: string;
    }): {
        invalidRequests: number;
        maxInvalidRequests: number;
        invalidRequestsInterval: number;
        invalidRequestsTimeoutId: number;
        invalidRequestsSafetyAmount: number;
        invalidRequestFrozenAt: number;
        invalidRequestErrorStatuses: number[];
        version: number;
        token: string;
        maxRetryCount: number;
        secretKey: string;
        customUrl: string;
        pathQueues: Map<string, {
            isWaiting: boolean;
            requests: {
                request: import("discordeno/rest").RestRequest;
                payload: import("discordeno/rest").RestPayload;
            }[];
        }>;
        processingQueue: boolean;
        processingRateLimitedPaths: boolean;
        globallyRateLimited: boolean;
        globalQueue: {
            request: import("discordeno/rest").RestRequest;
            payload: import("discordeno/rest").RestPayload;
            basicURL: string;
            urlToUse: string;
        }[];
        globalQueueProcessing: boolean;
        rateLimitedPaths: Map<string, import("discordeno/rest").RestRateLimitedPath>;
        debug: (text: string) => unknown;
        checkRateLimits: typeof import("discordeno/rest").checkRateLimits;
        cleanupQueues: typeof import("discordeno/rest").cleanupQueues;
        processQueue: typeof import("discordeno/rest").processQueue;
        processRateLimitedPaths: typeof import("discordeno/rest").processRateLimitedPaths;
        processRequestHeaders: typeof import("discordeno/rest").processRequestHeaders;
        processRequest: typeof import("discordeno/rest").processRequest;
        createRequestBody: typeof import("discordeno/rest").createRequestBody;
        runMethod: typeof import("discordeno/rest").runMethod;
        simplifyUrl: typeof import("discordeno/rest").simplifyUrl;
        processGlobalQueue: typeof import("discordeno/rest").processGlobalQueue;
        convertRestError: typeof import("discordeno/rest").convertRestError;
        sendRequest: typeof import("discordeno/rest").sendRequest;
        fetching: (options: import("discordeno/rest").RestSendRequestOptions) => void;
        fetched: (options: import("discordeno/rest").RestSendRequestOptions, response: import("undici").Response) => void;
    };
}
export {};
