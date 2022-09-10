"use strict";
exports.__esModule = true;
exports.RestClientProvider = void 0;
var rest_1 = require("discordeno/rest");
var RestClientProvider = (function () {
    function RestClientProvider(options) {
        this.options = options;
    }
    RestClientProvider.prototype.build = function (options) {
        this.options.token = options.token;
        return (0, rest_1.createRestManager)(this.options);
    };
    return RestClientProvider;
}());
exports.RestClientProvider = RestClientProvider;
