"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionManager = void 0;
const CacheCollection_1 = require("../Structures/CacheCollection");
const Interaction_1 = require("../Structures/Interaction");
class InteractionManager {
    client;
    cache;
    constructor(client, options) {
        this.client = client;
        this.cache = options.interactions || new CacheCollection_1.CacheCollection();
    }
    forge(data) {
        return new Interaction_1.Interaction(this.client, data);
    }
}
exports.InteractionManager = InteractionManager;
