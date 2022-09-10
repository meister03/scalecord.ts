import { CreateRestManagerOptions, RestManager } from "discordeno/rest";
import { Request, Response } from "express";
interface OverwrittenCreateRestManagerOptions extends Omit<CreateRestManagerOptions, "token"> {
    token?: string;
    secretKey: string;
    customUrl: string;
    create?(provider: RestServerProvider): void;
    handleRequest?(provider: RestServerProvider, req: ReturnType<RestServerProvider["transformRequest"]>, res: ReturnType<RestServerProvider["transformResponse"]>): Promise<undefined>;
    transformRequest?(req: Request): {
        method: string;
        body: any;
        url: string;
    };
    transformResponse?(res: Response): {
        respond(status: number, result?: object): any;
    };
}
export declare class RestServerProvider {
    options: OverwrittenCreateRestManagerOptions;
    rest?: RestManager;
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
                request: import("discordeno").RestRequest;
                payload: import("discordeno").RestPayload;
            }[];
        }>;
        processingQueue: boolean;
        processingRateLimitedPaths: boolean;
        globallyRateLimited: boolean;
        globalQueue: {
            request: import("discordeno").RestRequest;
            payload: import("discordeno").RestPayload;
            basicURL: string;
            urlToUse: string;
        }[];
        globalQueueProcessing: boolean;
        rateLimitedPaths: Map<string, import("discordeno").RestRateLimitedPath>;
        debug: (text: string) => unknown;
        checkRateLimits: typeof import("discordeno").checkRateLimits;
        cleanupQueues: typeof import("discordeno").cleanupQueues;
        processQueue: typeof import("discordeno").processQueue;
        processRateLimitedPaths: typeof import("discordeno").processRateLimitedPaths;
        processRequestHeaders: typeof import("discordeno").processRequestHeaders;
        processRequest: typeof import("discordeno").processRequest;
        createRequestBody: typeof import("discordeno").createRequestBody;
        runMethod: typeof import("discordeno").runMethod;
        simplifyUrl: typeof import("discordeno").simplifyUrl;
        processGlobalQueue: typeof import("discordeno").processGlobalQueue;
        convertRestError: typeof import("discordeno").convertRestError;
        sendRequest: typeof import("discordeno").sendRequest;
        fetching: (options: import("discordeno").RestSendRequestOptions) => void;
        fetched: (options: import("discordeno").RestSendRequestOptions, response: import("undici").Response) => void;
    };
    create(): void;
    handleRequest(req: ReturnType<RestServerProvider["transformRequest"]>, res: ReturnType<RestServerProvider["transformResponse"]>): Promise<undefined>;
    transformRequest(req: Request): {
        method: string;
        body: any;
        url: string;
    };
    transformResponse(res: Response): {
        respond(status: number, result?: object | undefined): any;
    };
}
export {};
