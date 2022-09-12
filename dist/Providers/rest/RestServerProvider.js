"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.RestServerProvider = void 0;
var discordeno_1 = require("discordeno");
var rest_1 = require("discordeno/rest");
var express_1 = __importDefault(require("express"));
var RestServerProvider = (function () {
    function RestServerProvider(options) {
        this.options = options;
    }
    RestServerProvider.prototype.build = function (options) {
        this.options.token = options.token;
        this.rest = (0, rest_1.createRestManager)(this.options);
        this.create();
        return this.rest;
    };
    RestServerProvider.prototype.create = function () {
        var _this = this;
        if (this.options.create)
            return this.options.create(this);
        var app = (0, express_1["default"])();
        app.use(express_1["default"].urlencoded({
            extended: true
        }));
        app.use(express_1["default"].json());
        app.post("/*", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.options.secretKey !== req.headers.authorization) {
                    return [2, res.status(401).json({ error: "Invalid authorization key." })];
                }
                this.handleRequest(this.transformRequest(req), this.transformResponse(res));
                return [2];
            });
        }); });
        app.get("/*", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.options.secretKey !== req.headers.authorization) {
                    return [2, res.status(401).json({ error: "Invalid authorization key." })];
                }
                this.handleRequest(this.transformRequest(req), this.transformResponse(res));
                return [2];
            });
        }); });
        app.put("/*", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.options.secretKey !== req.headers.authorization) {
                    return [2, res.status(401).json({ error: "Invalid authorization key." })];
                }
                this.handleRequest(this.transformRequest(req), this.transformResponse(res));
                return [2];
            });
        }); });
        app["delete"]("/*", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.options.secretKey !== req.headers.authorization) {
                    return [2, res.status(401).json({ error: "Invalid authorization key." })];
                }
                this.handleRequest(this.transformRequest(req), this.transformResponse(res));
                return [2];
            });
        }); });
        app.patch("/*", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.options.secretKey !== req.headers.authorization) {
                    return [2, res.status(401).json({ error: "Invalid authorization key." })];
                }
                this.handleRequest(this.transformRequest(req), this.transformResponse(res));
                return [2];
            });
        }); });
        app.listen(Number(this.options.customUrl.replace(/[^0-9]/g, '')), function () {
            console.log("REST Server listening at ".concat(_this.options.customUrl));
        });
    };
    RestServerProvider.prototype.handleRequest = function (req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var result, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (this.options.handleRequest)
                            return [2, this.options.handleRequest(this, req, res)];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4, ((_a = this.rest) === null || _a === void 0 ? void 0 : _a.runMethod(this.rest, req.method, "".concat(discordeno_1.BASE_URL).concat(req.url), req.body))];
                    case 2:
                        result = _c.sent();
                        if (result) {
                            res.respond(200, result);
                        }
                        else {
                            res.respond(204);
                        }
                        return [3, 4];
                    case 3:
                        error_1 = _c.sent();
                        if (error_1 === null || error_1 === void 0 ? void 0 : error_1.code)
                            res.respond(500, error_1);
                        else {
                            res.respond(500, {
                                error: (_b = error_1.message) !== null && _b !== void 0 ? _b : "No error found at all what the hell discord."
                            });
                        }
                        return [3, 4];
                    case 4: return [2];
                }
            });
        });
    };
    RestServerProvider.prototype.transformRequest = function (req) {
        if (this.options.transformRequest)
            return this.options.transformRequest(req);
        return {
            method: req.method,
            body: req.body,
            url: req.url
        };
    };
    RestServerProvider.prototype.transformResponse = function (res) {
        if (this.options.transformResponse)
            return this.options.transformResponse(res);
        return {
            respond: function (status, result) {
                return res.status(status).json(result);
            }
        };
    };
    return RestServerProvider;
}());
exports.RestServerProvider = RestServerProvider;
