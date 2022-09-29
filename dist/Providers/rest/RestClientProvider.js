"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestClientProvider = void 0;
const rest_1 = require("discordeno/rest");
class RestClientProvider {
    options;
    constructor(options) {
        this.options = options;
    }
    build(options) {
        this.options.token = options.token;
        return (0, rest_1.createRestManager)(this.options);
    }
}
exports.RestClientProvider = RestClientProvider;
