"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildManager = void 0;
const CacheCollection_1 = require("../Structures/CacheCollection");
const Guild_1 = require("../Structures/Guild");
const transformOptions_1 = require("../Util/transformOptions");
class GuildManager {
    client;
    cache;
    constructor(client, options) {
        this.client = client;
        this.cache = options.guilds || new CacheCollection_1.CacheCollection();
    }
    forge(data) {
        data = (0, transformOptions_1.transformOptions)(data);
        const id = String(data.id);
        if (this.client.guilds.cache?.has(id)) {
            const v = this.client.guilds.cache._get(id);
            // @ts-expect-error
            const members = v.members;
            // @ts-expect-error
            const channels = v.channels;
            // @ts-expect-error
            const roles = v.roles;
            // @ts-expect-error
            const emojis = v.emojis;
            // @ts-expect-error
            return new Guild_1.Guild(this.client, v, { roles: roles, channels: channels, members: members, emojis: emojis });
        }
        // @ts-expect-error
        return new Guild_1.Guild(this.client, data, { roles: data.roles, channels: data.channels, members: data.members, emojis: data.emojis });
    }
    async fetch(options) {
        options = (0, transformOptions_1.transformOptions)(options);
        const guild = await this.client.helpers.getGuild(options.id, options);
        return this.forge(guild);
    }
}
exports.GuildManager = GuildManager;
