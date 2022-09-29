"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionOverwrites = void 0;
const discordeno_1 = require("discordeno");
const transformOptions_1 = require("../Util/transformOptions");
const DestructObject_1 = require("./DestructObject");
class PermissionOverwrites extends DestructObject_1.DestructObject {
    overwriteId;
    cache;
    channel;
    client;
    constructor(client, data, options) {
        super(data);
        this.overwriteId = data.overwriteId || data.id;
        this.cache = options.permissionOverwrites ?? new discordeno_1.Collection();
        this.channel = options.channel;
        this.client = client;
    }
    has(overwriteId) {
        return this.cache.has(String(overwriteId));
    }
    get(overwriteId) {
        return this.cache.get(String(overwriteId));
    }
    async edit(overwriteId, options) {
        if (!overwriteId)
            overwriteId = String(options.overwriteId || options.id || this.overwriteId);
        const existing = this.cache.get(overwriteId) ?? { allow: this.allow ?? [], deny: this.deny ?? [], type: this.type || 'role', id: this.overwriteId };
        options = (0, transformOptions_1.transformPermissionOverwrites)(options);
        const overwrites = { allow: [...options.allow], deny: [...options.deny], type: options.type };
        if (options.allow) {
            existing.allow.forEach(x => {
                if (!options.allow.includes(x) && !options.deny.includes(x))
                    overwrites.allow.push(x);
            });
        }
        if (options.deny) {
            existing.deny.forEach(x => {
                if (!options.deny.includes(x) && !options.allow.includes(x))
                    overwrites.deny.push(x);
            });
        }
        if (options.neutral) {
            options.neutral.forEach(x => {
                if (overwrites.allow.includes(x))
                    overwrites.allow.splice(overwrites.allow.indexOf(x), 1);
                if (overwrites.deny.includes(x))
                    overwrites.deny.splice(overwrites.deny.indexOf(x), 1);
            });
        }
        options.allow = overwrites.allow;
        options.deny = overwrites.deny;
        delete options.neutral;
        if (!options.type)
            options.type = overwrites.type;
        const channelId = options.channelId || this.channel?.id;
        options.id = BigInt(overwriteId);
        return this.client.helpers.editChannelPermissionOverrides(channelId, options);
    }
    async create(overwriteId, options) {
        return this.edit(overwriteId, options);
    }
    delete(options) {
        options = (0, transformOptions_1.transformOptions)(options);
        const channelId = options.channelId || this.channel?.id;
        const overwriteId = options.id || this.overwriteId;
        return this.client.helpers.deleteChannelPermissionOverride(channelId, overwriteId);
    }
}
exports.PermissionOverwrites = PermissionOverwrites;
