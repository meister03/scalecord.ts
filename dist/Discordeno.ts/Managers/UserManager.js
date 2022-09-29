"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
const BaseCollection_1 = require("../Structures/BaseCollection");
const User_1 = require("../Structures/User");
const transformOptions_1 = require("../Util/transformOptions");
class UserManager {
    client;
    cache;
    constructor(client, options) {
        this.client = client;
        this.cache = options.users ?? new BaseCollection_1.BaseCollection();
    }
    async fetch(options) {
        const { id } = (0, transformOptions_1.transformOptions)(options);
        if (this.cache?.has(id))
            return this.cache.get(id);
        const user = await this.client.helpers.getUser(id);
        return this.forge(user);
    }
    forge(data) {
        data = (0, transformOptions_1.transformOptions)(data);
        return new User_1.User(this.client, data);
    }
}
exports.UserManager = UserManager;
