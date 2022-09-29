import { CacheServer } from "discord-cross-hosting";
import { RestManager } from "discordeno/rest";
import { OverwrittenGatewayManager, ServerProviders } from "./Providers/mod";

export class Server {
    options: {
        token: string; providers: ServerProviders;
    };
    rest?: RestManager;
    gateway?: OverwrittenGatewayManager;
    cache?: CacheServer;
    constructor(options: { token: string, providers: ServerProviders }) {
        this.options = options;
        this.build()
    }
    public build() {
        if (this.options.providers.rest) this.rest = this.options.providers.rest.build({ token: this.options.token });
        if (this.options.providers.gateway) this.gateway = this.options.providers.gateway.build({token: this.options.token, rest: this.rest})
        if (this.options.providers.cache) this.cache = this.options.providers.cache.build({token: this.options.token}).storage;
    }
}
