"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleManager = void 0;
const discordeno_1 = require("discordeno");
const BaseCollection_1 = require("../Structures/BaseCollection");
const Role_1 = require("../Structures/Role");
const transformOptions_1 = require("../Util/transformOptions");
class RoleManager {
    client;
    cache;
    guild;
    member;
    constructor(client, options) {
        this.client = client;
        this.cache = options.roles || new BaseCollection_1.BaseCollection();
        this.guild = options.guild;
        this.member = options.member;
    }
    async create(options) {
        return new Role_1.Role(this.client, options, { guild: this.guild }).create(options);
    }
    async fetch(options) {
        options = (0, transformOptions_1.transformOptions)(options);
        const guildId = String(options.guildId || this.guild?.id);
        const roleId = options.id ? String(options.id) : undefined;
        // @ts-expect-error
        if (this.cache?.has(roleId))
            return this.cache.get(roleId, { guild: this.guild });
        const rawRoles = await this.client.helpers.getRoles(guildId);
        const roles = new discordeno_1.Collection();
        for (const role of rawRoles) {
            // @ts-expect-error
            roles.set(String(role[0]), this.forge(role[1], { guild: this.guild }));
        }
        return roleId ? roles.get(roleId) : roles;
    }
    forge(data, options) {
        data = (0, transformOptions_1.transformOptions)(data);
        if (options?.guild) {
            if (options.guild.roles.cache?.has(String(data.id))) {
                // @ts-expect-error
                return options.guild.roles.cache.get(data.id, { guild: options.guild });
            }
        }
        else if (this.client.roles.cache?.has(String(data.id))) {
            // @ts-expect-error
            return this.client.roles.cache.get(data.id, { guild: this.guild });
        }
        return new Role_1.Role(this.client, data, { guild: (options?.guild || this.guild) });
    }
    async add(options) {
        options = (0, transformOptions_1.transformOptions)(options);
        const roleId = String(options.id);
        const guildId = String(this.guild ? this.guild.id : options.guildId);
        const memberId = String(this.member ? this.member.id : options.memberId);
        await this.client.helpers.addRole(guildId, memberId, roleId, options.reason);
        return true;
    }
    async remove(options) {
        options = (0, transformOptions_1.transformOptions)(options);
        const roleId = String(options.id);
        const guildId = String(this.guild ? this.guild.id : options.guildId);
        const memberId = String(this.member ? this.member.id : options.memberId);
        await this.client.helpers.removeRole(guildId, memberId, roleId, options.reason);
        return true;
    }
    forgeManager(options) {
        return new RoleManager(this.client, { guild: options.guild, member: options.member, roles: options.roles });
    }
    get highest() {
        if (!this.cache)
            return null;
        // @ts-expect-error
        return [...this.cache.values({ raw: true })].map(r => r).sort((a, b) => b.position - a.position)?.[0] || { position: 0 };
    }
    get premiumSubscriberRole() {
        // @ts-expect-error
        return [...this.cache.values({ raw: true })].filter(x => x.toggles?.premiumSubscriber)[0];
    }
}
exports.RoleManager = RoleManager;
