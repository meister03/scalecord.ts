"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.GatewayServerProvider = void 0;
var discordeno_1 = require("discordeno");
var gateway_1 = require("discordeno/gateway");
var shared_1 = require("../../types/shared");
var discord_cross_hosting_1 = require("discord-cross-hosting");
var GatewayServerProvider = (function () {
    function GatewayServerProvider(options) {
        this.options = options;
    }
    GatewayServerProvider.prototype.build = function (options) {
        this.options.token = options.token;
        if (!this.options.gatewayConfig)
            this.options.gatewayConfig = { token: options.token, intents: this.options.intents };
        else {
            this.options.gatewayConfig.token = options.token;
            this.options.gatewayConfig.intents = this.options.intents;
        }
        if (!this.options.gatewayBot)
            this.options.gatewayBot = {};
        if (!this.options.handleDiscordPayload)
            this.options.handleDiscordPayload = this.handleDiscordPayload.bind(this);
        this.gateway = (0, gateway_1.createGatewayManager)(this.options);
        this.create(this.gateway);
        return this.gateway;
    };
    GatewayServerProvider.prototype.create = function (gateway) {
        var _this = this;
        if (!this.options.tcpOptions)
            this.options.tcpOptions = {};
        gateway.bridge = new discord_cross_hosting_1.Bridge(__assign(__assign({}, this.options.tcpOptions), { port: Number(this.options.customUrl.replace(/[^0-9]/g, '')), authToken: this.options.secretKey, token: this.options.token, totalMachines: this.options.totalMachines }));
        gateway.start = function () { return __awaiter(_this, void 0, void 0, function () {
            var gatewayBot;
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4, (0, discordeno_1.createBot)({ token: this.options.token }).helpers.getGatewayBot()];
                    case 1:
                        gatewayBot = _g.sent();
                        (_a = gateway.bridge) === null || _a === void 0 ? void 0 : _a.totalShards = (_b = this.options.totalShards) !== null && _b !== void 0 ? _b : gatewayBot.shards;
                        return [4, ((_c = gateway.bridge) === null || _c === void 0 ? void 0 : _c.start())];
                    case 2:
                        _g.sent();
                        gateway.gatewayBot = gatewayBot;
                        gateway.manager.totalShards = (_d = this.options.totalShards) !== null && _d !== void 0 ? _d : gatewayBot.shards;
                        gateway.firstShardId = (_e = this.options.firstShardId) !== null && _e !== void 0 ? _e : 0;
                        gateway.lastShardId = (_f = this.options.lastShardId) !== null && _f !== void 0 ? _f : gateway.manager.totalShards - 1;
                        gateway.spawnShards();
                        return [2, undefined];
                }
            });
        }); };
    };
    GatewayServerProvider.prototype.handleDiscordPayload = function (shard, message) {
        if (this.filterPayload(shard, message))
            return;
        return this.sendPayload(this.convertPayload(shard, message));
    };
    GatewayServerProvider.prototype.filterPayload = function (shard, message) {
        if (this.options.filterPayload)
            return this.options.filterPayload(shard, message);
        if (!message.t)
            return true;
        return false;
    };
    GatewayServerProvider.prototype.convertPayload = function (shard, message) {
        if (this.options.convertPayload)
            return this.options.convertPayload(shard, message);
        message.shardId = shard.id;
        return message;
    };
    GatewayServerProvider.prototype.sendPayload = function (message) {
        var _a, _b;
        if (this.options.sendPayload)
            return this.options.sendPayload(message);
        if ((_b = (_a = this.gateway) === null || _a === void 0 ? void 0 : _a.bridge) === null || _b === void 0 ? void 0 : _b.clients) {
            for (var _i = 0, _c = Array.from(this.gateway.bridge.clients); _i < _c.length; _i++) {
                var client = _c[_i];
                if (client[1].shardList === undefined)
                    continue;
                var shardList = client[1].shardList.flat();
                if (shardList.includes(message.shardId)) {
                    client[1].send({ packet: message, type: shared_1.GatewayIPCMessageTypes.PACKET });
                    break;
                }
            }
        }
        ;
    };
    return GatewayServerProvider;
}());
exports.GatewayServerProvider = GatewayServerProvider;
