"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestServerProvider = void 0;
const discordeno_1 = require("discordeno");
const rest_1 = require("discordeno/rest");
const express_1 = __importDefault(require("express"));
class RestServerProvider {
    options;
    rest;
    constructor(options) {
        this.options = options;
    }
    build(options) {
        this.options.token = options.token;
        this.rest = (0, rest_1.createRestManager)(this.options);
        this.create();
        return this.rest;
    }
    create() {
        if (this.options.create)
            return this.options.create(this);
        // @ts-expect-error
        this.rest.convertRestError = (errorStack, data) => {
            return data;
        };
        const app = (0, express_1.default)();
        app.use(express_1.default.urlencoded({
            extended: true,
        }));
        app.use(express_1.default.json());
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
    async handleRequest(req, res) {
        if (this.options.handleRequest)
            return this.options.handleRequest(this, req, res);
        try {
            const result = await this.rest?.runMethod(this.rest, req.method, `${discordeno_1.BASE_URL}${req.url}`, req.body);
            if (result) {
                res.respond(200, result);
            }
            else {
                res.respond(204);
            }
        }
        catch (error) {
            if (error?.code)
                res.respond(500, error);
            else {
                res.respond(500, error);
            }
        }
    }
    transformRequest(req) {
        if (this.options.transformRequest)
            return this.options.transformRequest(req);
        return {
            method: req.method,
            body: req.body,
            url: req.url,
        };
    }
    transformResponse(res) {
        if (this.options.transformResponse)
            return this.options.transformResponse(res);
        return {
            respond: (status, result) => {
                return res.status(status).json(result);
            }
        };
    }
}
exports.RestServerProvider = RestServerProvider;
