"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Channel = void 0;
const discordeno_1 = require("discordeno");
const transformOptions_1 = require("../Util/transformOptions");
const Util_1 = require("../Util/Util");
const DestructObject_1 = require("./DestructObject");
const PermissionOverwrites_1 = require("./PermissionOverwrites");
const Permissions_1 = require("./Permissions");
const Webhook_1 = require("./Webhook");
class Channel extends DestructObject_1.DestructObject {
    _raw;
    guild;
    client;
    messages;
    constructor(client, data, options) {
        super(data, { "permissionOverwrites": true });
        this.client = client;
        this._raw = data;
        this.guild = options.guild ?? this.client.guilds.forge({ id: this.guildId });
        this.messages = this.client.messages.forgeManager({ messages: options.messages, channel: this, guild: this.guild });
    }
    async create(options) {
        if (options.permissionOverwrites) {
            options.permissionOverwrites = (0, transformOptions_1.transformPermissionOverwrites)(options.permissionOverwrites);
        }
        const guildId = options.guildId || String(this.guild?.id);
        const channel = await this.client.helpers.createChannel(guildId, options);
        return this.client.channels.forge(channel, { guild: this.guild });
    }
    async edit(options) {
        if (options.permissionOverwrites) {
            options.permissionOverwrites = (0, transformOptions_1.transformPermissionOverwrites)(options.permissionOverwrites);
        }
        const guildId = options.guildId || String(this.guild?.id);
        const channel = await this.client.helpers.editChannel(guildId, options);
        return this.client.channels.forge(channel, { guild: this.guild });
    }
    async delete(options) {
        options = (0, transformOptions_1.transformOptions)(options);
        if (!options.id)
            options.id = String(this.id);
        await this.client.helpers.deleteChannel(options.id, options.reason);
        return true;
    }
    async fetch(options) {
        options = (0, transformOptions_1.transformOptions)(options);
        if (!options.id)
            options.id = String(this.id);
        return this.client.channels.fetch(options);
    }
    async send(options) {
        options = (0, transformOptions_1.transformOptions)(options, { content: true });
        if (options.attachments) {
            options.file = (0, transformOptions_1.transformAttachments)(options.attachments);
        }
        if (!options.channelId)
            options.channelId = String(this.id);
        const msg = await this.client.helpers.sendMessage(options.channelId, options);
        return this.client.messages.forge(msg, { channel: this, guild: this.guild });
    }
    async bulkDelete(options, reason) {
        const ids = options.map((x) => {
            if (typeof x === 'object')
                return String(x.id);
            else
                return String(x);
        });
        await this.client.helpers.deleteMessages(this.id, ids, reason);
        return true;
    }
    get permissionOverwrites() {
        const cache = new discordeno_1.Collection();
        this._permissionOverwrites?.forEach(x => {
            let [type, id, allow, deny] = (0, Util_1.separateOverwrites)(x);
            // @ts-expect-error
            if (allow !== undefined)
                allow = new Permissions_1.Permissions(allow).toArray();
            // @ts-expect-error
            if (deny !== undefined)
                deny = new Permissions_1.Permissions(deny).toArray();
            // @ts-expect-error
            cache.set(String(id), new PermissionOverwrites_1.PermissionOverwrites(this.client, { type, id: String(id), allow, deny }, { channel: this }));
        });
        // @ts-expect-error
        return new PermissionOverwrites_1.PermissionOverwrites(this.client, {}, { channel: this, permissionOverwrites: cache });
    }
    permissionsFor(resource, type, checkAdmin = true) {
        if (type !== 'role' && type !== 'member')
            throw new Error('The provided resource has to be one of the type: role, member');
        if (type === 'role') {
            if (checkAdmin && resource.permissions.has(Permissions_1.Permissions.FLAGS.ADMINISTRATOR)) {
                return new Permissions_1.Permissions(Permissions_1.Permissions.ALL).freeze();
            }
            const everyoneOverwrites = this.permissionOverwrites.cache.get(this.guild?.id);
            const roleOverwrites = this.permissionOverwrites.cache.get(resource.id);
            return resource.permissions
                .remove(everyoneOverwrites?.deny ?? 0n)
                .add(everyoneOverwrites?.allow ?? 0n)
                .remove(roleOverwrites?.deny ?? 0n)
                .add(roleOverwrites?.allow ?? 0n)
                .freeze();
        }
        if (type === 'member') {
            const member = resource;
            if (checkAdmin && member.id === this.guild?.ownerId)
                return new Permissions_1.Permissions(Permissions_1.Permissions.ALL).freeze();
            const roles = member.roles.cache;
            const rolePermissions = roles.map(role => role.permissions);
            const permissions = new Permissions_1.Permissions(rolePermissions);
            if (checkAdmin && permissions.has(Permissions_1.Permissions.FLAGS.ADMINISTRATOR)) {
                return new Permissions_1.Permissions(Permissions_1.Permissions.ALL).freeze();
            }
            // @ts-expect-error
            const overwrites = this.overwritesFor(member, roles);
            return permissions
                .remove(overwrites.everyone?.deny ?? 0n)
                .add(overwrites.everyone?.allow ?? 0n)
                // @ts-expect-error
                .remove(overwrites.roles.length > 0 ? overwrites.roles.map(role => role.deny) : 0n)
                // @ts-expect-error
                .add(overwrites.roles.length > 0 ? overwrites.roles.map(role => role.allow) : 0n)
                .remove(overwrites.member?.deny ?? 0n)
                .add(overwrites.member?.allow ?? 0n)
                .freeze();
        }
    }
    // Credits to Discord.js v13 | https://github.com/discordjs/discord.js/blob/988a51b7641f8b33cc9387664605ddc02134859d/src/structures/GuildChannel.js#L166
    overwritesFor(member, roles) {
        // @ts-expect-error
        roles ??= member.roles.cache;
        const roleOverwrites = [];
        let memberOverwrites;
        let everyoneOverwrites;
        for (const overwrite of this.permissionOverwrites.cache.values()) {
            if (overwrite.id === this.guild?.id) {
                everyoneOverwrites = overwrite;
            }
            else if (roles?.has(overwrite.id)) {
                roleOverwrites.push(overwrite);
            }
            else if (overwrite.id === member.id) {
                memberOverwrites = overwrite;
            }
        }
        return {
            everyone: everyoneOverwrites,
            roles: roleOverwrites,
            member: memberOverwrites,
        };
    }
    async createWebhook(options) {
        if (!options.channelId)
            options.channelId = String(this.id);
        const webhook = await this.client.helpers.createWebhook(options.channelId, options);
        return new Webhook_1.Webhook(this.client, webhook);
    }
    async fetchWebhooks(channelId) {
        if (!channelId)
            channelId = String(this.id);
        const webhooks = await this.client.helpers.getChannelWebhooks(channelId);
        const webhooksCollection = new discordeno_1.Collection();
        webhooks.map(x => {
            webhooksCollection.set(x.id, new Webhook_1.Webhook(this.client, x));
        });
        return webhooksCollection;
    }
}
exports.Channel = Channel;
