"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberManager = void 0;
const discordeno_1 = require("discordeno");
const CacheCollection_1 = require("../Structures/CacheCollection");
const Member_1 = require("../Structures/Member");
const transformOptions_1 = require("../Util/transformOptions");
class MemberManager {
    client;
    cache;
    guild;
    constructor(client, options) {
        this.client = client;
        this.cache = options.members || new CacheCollection_1.CacheCollection();
        this.guild = options.guild;
    }
    forge(data, options) {
        data = (0, transformOptions_1.transformOptions)(data);
        if (options?.guild && data.id) {
            if (options.guild.members.cache?.has(String(data.id))) {
                const user = this.client.users.cache._get(data.id);
                return options.guild.members.cache.get(data.id, { guild: options.guild, user });
            }
        }
        return new Member_1.Member(this.client, data, { guild: (options?.guild || this.guild), user: options?.user });
    }
    forgeManager(options) {
        return new MemberManager(this.client, { guild: options.guild, members: options.members });
    }
    async fetch(options) {
        options = (0, transformOptions_1.transformOptions)(options);
        const guildId = String(options.guildId || this.guild?.id);
        const memberId = options.id;
        if (!memberId) {
            const rawMembers = await this.client.helpers.fetchMembers(guildId, options);
            const members = new discordeno_1.Collection();
            // rawMembers not Collection, because of Custom Overwrite in CacheManager
            for (const member of rawMembers) {
                members.set(member.id, this.forge(member, { guild: this.guild }));
            }
            return members;
        }
        if (this.cache?.has(memberId))
            return this.forge({ id: String(memberId) }, { guild: this.guild });
        const member = await this.client.helpers.getMember(guildId, memberId);
        return this.forge(member, { guild: this.guild, user: member.user });
    }
    async edit(options) {
        options = (0, transformOptions_1.transformOptions)(options);
        const member = this.forge(options, { guild: this.guild });
        return member.edit(options);
    }
    async kick(options) {
        options = (0, transformOptions_1.transformOptions)(options);
        const member = this.forge(options, { guild: this.guild });
        return member.kick(options);
    }
    async ban(options) {
        options = (0, transformOptions_1.transformOptions)(options);
        const member = this.forge(options, { guild: this.guild });
        return member.ban(options);
    }
    async unban(options) {
        options = (0, transformOptions_1.transformOptions)(options);
        const member = this.forge(options, { guild: this.guild });
        return member.unban(options);
    }
}
exports.MemberManager = MemberManager;
