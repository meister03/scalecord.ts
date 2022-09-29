"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Member = void 0;
const transformOptions_1 = require("../Util/transformOptions");
const DestructObject_1 = require("./DestructObject");
const Permissions_1 = require("./Permissions");
const BaseCollection_1 = require("./BaseCollection");
class Member extends DestructObject_1.DestructObject {
    _raw;
    guild;
    client;
    user;
    roles;
    constructor(client, data, options) {
        super(data, { "permissions": true });
        this._raw = data;
        this.client = client;
        this.guild = options.guild ?? this.client.guilds.forge({ id: this.guildId });
        if (options.user)
            data.user = options.user;
        this.user = client.users.forge(data.user ?? options.user);
        // Shallow Copy RoleIds befor overwrite
        const roleIds = data.roles ? data.roles.slice(0) : [];
        this.roles = client.roles.forgeManager({
            guild: this.guild,
            member: this,
            // @ts-expect-error
            roles: getRoles(client, roleIds, this.guild),
        });
    }
    get permissions() {
        if (this.id === this.guild?.ownerId)
            return new Permissions_1.Permissions(Permissions_1.Permissions.ALL).freeze();
        if (!this.roles.cache)
            return new Permissions_1.Permissions(0n).freeze();
        // @ts-expect-error
        const permissions = [...this.roles.cache.values()].map((role) => role._permissions || 0n);
        return new Permissions_1.Permissions(permissions).freeze();
    }
    get manageable() {
        if (this.id === this.guild?.ownerId)
            return false;
        if (this.id === this.client.id)
            return false;
        if (this.client.id === this.guild?.ownerId)
            return true;
        // @ts-expect-error
        return new Boolean(this.guild?.me?.roles?.highest > this.roles.highest);
    }
    get kickable() {
        return this.manageable && this.guild?.me.permissions.has(Permissions_1.Permissions.FLAGS.KICK_MEMBERS);
    }
    get bannable() {
        return this.manageable && this.guild?.me.permissions.has(Permissions_1.Permissions.FLAGS.BAN_MEMBERS);
    }
    async send(options) {
        options = (0, transformOptions_1.transformOptions)(options, { content: true });
        return this.client.users.forge({ id: this.id }).send(options);
    }
    async fetch(options) {
        options = (0, transformOptions_1.transformOptions)(options);
        const id = options.id || this.id;
        const guildId = String(options.guildId || this.guildId || this.guild?.id);
        const member = await this.client.helpers.getMember(guildId, id);
        return this.client.members.forge(member, { guild: this.guild });
    }
    async kick(options) {
        options = (0, transformOptions_1.transformOptions)(options);
        const id = options.id || this.id;
        const guildId = String(options.guildId || this.guildId || this.guild?.id);
        const reason = options.reason;
        await this.client.helpers.kickMember(guildId, id, reason);
        return this;
    }
    async ban(options) {
        options = (0, transformOptions_1.transformOptions)(options);
        const id = options.id || this.id;
        const guildId = String(options.guildId || this.guildId || this.guild?.id);
        await this.client.helpers.banMember(guildId, id, options);
        return this;
    }
    async unban(options) {
        options = (0, transformOptions_1.transformOptions)(options);
        const id = options.id || this.id;
        const guildId = String(options.guildId || this.guildId || this.guild?.id);
        await this.client.helpers.unbanMember(guildId, id);
        return this;
    }
    async edit(options) {
        options = (0, transformOptions_1.transformOptions)(options);
        const id = String(options.id || this.id);
        const guildId = String(options.guildId || this.guildId || this.guild?.id);
        const member = await this.client.helpers.editMember(guildId, id, options);
        return this.client.members.forge(member, { guild: this.guild });
    }
}
exports.Member = Member;
function getRoles(client, roles, guild) {
    if (!roles)
        return new BaseCollection_1.BaseCollection();
    const memberRoles = new BaseCollection_1.BaseCollection();
    roles.forEach((m) => {
        const role = client.roles.forge({ id: m }, { guild: guild });
        if (role)
            memberRoles.set(role.id, role);
    });
    return memberRoles;
}
