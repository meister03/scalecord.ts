"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guild = void 0;
const discordeno_1 = require("discordeno");
const transformOptions_1 = require("../Util/transformOptions");
const Util_1 = require("../Util/Util");
const DestructObject_1 = require("./DestructObject");
class Guild extends DestructObject_1.DestructObject {
    _raw;
    client;
    me;
    roles;
    channels;
    members;
    emojis;
    constructor(client, data, options) {
        super(data);
        this._raw = data;
        this.client = client;
        this.roles = client.roles.forgeManager({ guild: this, roles: options.roles });
        this.channels = client.channels.forgeManager({ guild: this, channels: options.channels });
        this.members = client.members.forgeManager({ guild: this, members: options.members });
        this.emojis = client.emojis.forgeManager({ guild: this, emojis: options.emojis });
        this.me = client.members.forge({ id: (client.user ? client.user.id : client.id) }, { guild: this });
    }
    async fetch(id) {
        if (!id)
            id = String(this.id);
        return this.client.guilds.fetch({ id });
    }
    async edit(options) {
        if (!options.id)
            options.id = String(this.id);
        const shardId = (0, discordeno_1.calculateShardId)(this.client.gateway, BigInt(options.id));
        const guild = await this.client.helpers.editGuild(options.id, options, shardId);
        return this.client.guilds.forge(guild);
    }
    async leave(id) {
        const options = (0, transformOptions_1.transformOptions)(id ?? this.id);
        await this.client.helpers.leaveGuild(options.id);
        return true;
    }
    async fetchAuditLogs(options) {
        options = (0, transformOptions_1.transformOptions)(options);
        if (!options.id)
            options.id = String(this.id);
        const audit = await this.client.helpers.getAuditLog(options.id, options);
        const entries = new discordeno_1.Collection();
        audit.auditLogEntries.forEach((x) => {
            x.executor = this.client.users.forge({
                id: x.userId,
            });
            x.target = this.client.users.forge({
                id: x.targetId,
            });
            entries.set(String(x.id), x);
        });
        return Object.assign(audit, { entries });
    }
    iconURL(options = { format: 'png', size: 512 }) {
        return this.client.helpers.getGuildIconURL(this.id, this.icon, options);
    }
    get createdTimestamp() {
        return (0, Util_1.getSnowFlake)(this.id).timestamp;
    }
}
exports.Guild = Guild;
