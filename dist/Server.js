"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
class Server {
    options;
    rest;
    gateway;
    cache;
    constructor(options) {
        this.options = options;
        this.build();
    }
    build() {
        if (this.options.providers.rest)
            this.rest = this.options.providers.rest.build({ token: this.options.token });
        if (this.options.providers.gateway)
            this.gateway = this.options.providers.gateway.build({ token: this.options.token, rest: this.rest });
        if (this.options.providers.cache)
            this.cache = this.options.providers.cache.build({ token: this.options.token }).storage;
    }
}
exports.Server = Server;
