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
    }): RestManager;
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
//# sourceMappingURL=RestServerProvider.d.ts.map