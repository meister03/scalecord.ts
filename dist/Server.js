"use strict";
exports.__esModule = true;
exports.Server = void 0;
var Server = (function () {
    function Server(options) {
        this.options = options;
        this.build();
    }
    Server.prototype.build = function () {
        if (this.options.providers.rest)
            this.rest = this.options.providers.rest.build({ token: this.options.token });
        if (this.options.providers.gateway)
            this.gateway = this.options.providers.gateway.build({ token: this.options.token, rest: this.rest });
        if (this.options.providers.cache)
            this.cache = this.options.providers.cache.build({ token: this.options.token }).storage;
    };
    return Server;
}());
exports.Server = Server;
