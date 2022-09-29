import { BASE_URL } from "discordeno";
import { createRestManager, CreateRestManagerOptions, RestManager } from "discordeno/rest";
import express, { Request, Response } from "express";

interface OverwrittenCreateRestManagerOptions extends Omit<CreateRestManagerOptions, "token"> {
    token?: string;
    secretKey: string;
    customUrl: string;

    //Create Own Handle
    create?(provider: RestServerProvider): void;
    handleRequest?(provider: RestServerProvider, req: ReturnType<RestServerProvider["transformRequest"]>, res: ReturnType<RestServerProvider["transformResponse"]>): Promise<undefined>;
    transformRequest?(req: Request): {
        method: string,
        body: any,
        url: string,
    };
    transformResponse?(res: Response): {
        respond(status: number, result?: object): any;
    };
}


export class RestServerProvider {
    options: OverwrittenCreateRestManagerOptions;
    rest?: RestManager;
    constructor(options: OverwrittenCreateRestManagerOptions) {
        this.options = options;
    }

    public build(options: { token: string }): RestManager {
        this.options.token = options.token;
        this.rest = createRestManager(this.options as CreateRestManagerOptions);
        this.create();
        return this.rest;
    }

    public create() {
        if(this.options.create) return this.options.create(this);

        // @ts-expect-error
        this.rest.convertRestError = (errorStack, data) => {
            return data;
        }

        const app = express();

        app.use(
            express.urlencoded({
                extended: true,
            }),
        );

        app.use(express.json());

        app.post("/*", async (req, res) => {
            if (this.options.secretKey !== req.headers.authorization) {
                return res.status(401).json({ error: "Invalid authorization key." });
            }
            this.handleRequest(this.transformRequest(req), this.transformResponse(res));
        });
        app.get("/*", async (req, res) => {
            if (this.options.secretKey !== req.headers.authorization) {
                return res.status(401).json({ error: "Invalid authorization key." });
            }
            this.handleRequest(this.transformRequest(req), this.transformResponse(res));
        });

        app.put("/*", async (req, res) => {
            if (this.options.secretKey !== req.headers.authorization) {
                return res.status(401).json({ error: "Invalid authorization key." });
            }
            this.handleRequest(this.transformRequest(req), this.transformResponse(res));
        });

        app.delete("/*", async (req, res) => {
            if (this.options.secretKey !== req.headers.authorization) {
                return res.status(401).json({ error: "Invalid authorization key." });
            }
            this.handleRequest(this.transformRequest(req), this.transformResponse(res));
        });

        app.patch("/*", async (req, res) => {
            if (this.options.secretKey !== req.headers.authorization) {
                return res.status(401).json({ error: "Invalid authorization key." });
            }
            this.handleRequest(this.transformRequest(req), this.transformResponse(res));
        });

        app.listen(Number(this.options.customUrl.replace(/[^0-9]/g, '')), () => {
            console.log(`REST Server listening at ${this.options.customUrl}`);
        });
    }

    public async handleRequest(req: ReturnType<RestServerProvider["transformRequest"]>, res: ReturnType<RestServerProvider["transformResponse"]>) {
        if(this.options.handleRequest) return this.options.handleRequest(this, req, res);
        try {
            const result = await this.rest?.runMethod(
                this.rest,
                req.method as any,
                `${BASE_URL}${req.url}`,
                req.body,
            );

            if (result) {
                res.respond(200, result);
            } else {
                res.respond(204);
            }
        } catch (error: any) {
            if (error?.code) res.respond(500, error);
            else {
                res.respond(500, error);
            }
        }
    }

    public transformRequest(req: Request) {
        if(this.options.transformRequest) return this.options.transformRequest(req)
        return {
            method: req.method,
            body: req.body,
            url: req.url,
        }
    }

    public transformResponse(res: Response) {
        if(this.options.transformResponse) return this.options.transformResponse(res);
        return {
            respond: (status: number, result?: object) => {
                return res.status(status).json(result)
            }
        }
    }
}

