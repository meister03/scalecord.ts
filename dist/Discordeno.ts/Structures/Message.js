"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const discordeno_1 = require("discordeno");
const Embed_1 = require("../Util/Embed");
const transformOptions_1 = require("../Util/transformOptions");
const DestructObject_1 = require("./DestructObject");
class Message extends DestructObject_1.DestructObject {
    _raw;
    client;
    guild;
    channel;
    author;
    member;
    constructor(client, data, options) {
        super(data);
        this.client = client;
        this._raw = data;
        this.guild = options.guild ?? this.client.guilds.forge({ id: this.guildId });
        this.channel = options.channel ?? this.guild.channels.forge({ id: this.channelId }, { guild: this.guild });
        this.author = client.users.forge(data.author);
        this.member = this.guild.members.forge({ ...data.member, id: this.authorId }, { guild: this.guild, user: data.author });
    }
    async edit(options) {
        options = (0, transformOptions_1.transformOptions)(options, { content: true });
        if (options.files || options.attachments) {
            options.file = (0, transformOptions_1.transformAttachments)((options.files || options.attachments));
        }
        const channelId = String(options.channelId || this.channelId);
        const id = String(options.id || this.id);
        if (options.embeds) {
            options.embeds = options.embeds.map((e) => {
                return new Embed_1.Embed(e).toJSON();
            });
        }
        return this.client.helpers.editMessage(channelId, id, options);
    }
    async reply(options) {
        options = (0, transformOptions_1.transformOptions)(options, { content: true });
        const channelId = String(options.channelId || this.channelId);
        if (options.files || options.attachments) {
            options.file = (0, transformOptions_1.transformAttachments)((options.files || options.attachments));
        }
        if (!options.messageReference) {
            options.messageReference = { messageId: String(this.id), channelId: String(this.channel.id), guildId: String(this.guild.id), failIfNotExists: true };
        }
        const msg = await this.client.helpers.sendMessage(channelId, options);
        return this.client.messages.forge(msg, { guild: this.guild, channel: this.channel });
    }
    async delete(options) {
        options = (0, transformOptions_1.transformOptions)(options);
        const channelId = String(options.channelId || this.channelId);
        const id = String(options.id || this.id);
        await this.client.helpers.deleteMessage(channelId, id, options.reason, options.delayMilliseconds);
        return true;
    }
    async react(emoji) {
        await this.client.helpers.addReaction(this.channel.id, this.id, emoji);
        return this;
    }
    async pin(pinOptions) {
        const options = (0, transformOptions_1.transformOptions)(pinOptions, { reason: true });
        const channelId = String(options.channelId || this.channelId);
        const id = String(options.id || this.id);
        await this.client.helpers.pinMessage(channelId, id, options.reason);
        return this;
    }
    async unpin(pinOptions) {
        const options = (0, transformOptions_1.transformOptions)(pinOptions, { reason: true });
        const channelId = String(options.channelId || this.channelId);
        const id = String(options.id || this.id);
        await this.client.helpers.unpinMessage(channelId, id, options.reason);
        return this;
    }
    ///Parse Members:
    get mentions() {
        const channels = new discordeno_1.Collection();
        const members = new discordeno_1.Collection();
        const roles = new discordeno_1.Collection();
        const users = new discordeno_1.Collection();
        this.mentionedUsers.forEach((u) => {
            users.set(u, this.client.users.forge(u));
        });
        this.mentionedRoleIds.forEach((r) => {
            roles.set(r, this.guild.roles.forge({ id: r }, { guild: this.guild }));
        });
        this.mentionedChannelIds.forEach((c) => {
            channels.set(c, this.guild.channels.forge({ id: c }, { guild: this.guild }));
        });
        return {
            channels,
            members,
            roles,
            users,
        };
    }
}
exports.Message = Message;
