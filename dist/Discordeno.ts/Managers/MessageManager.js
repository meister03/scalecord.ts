"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageManager = void 0;
const discordeno_1 = require("discordeno");
const CacheCollection_1 = require("../Structures/CacheCollection");
const Message_1 = require("../Structures/Message");
const transformOptions_1 = require("../Util/transformOptions");
class MessageManager {
    client;
    guild;
    channel;
    cache;
    constructor(client, options) {
        this.client = client;
        this.guild = options.guild;
        this.channel = options.channel;
        this.cache = options.messages || new CacheCollection_1.CacheCollection();
    }
    forge(data, options) {
        data = (0, transformOptions_1.transformOptions)(data);
        const guild = options?.guild || this.guild;
        const channel = options?.channel || this.channel;
        if (channel && channel?.messages?.cache) {
            if (channel.messages.cache?.has(String(data.id))) {
                return channel.messages.cache.get(data.id, { guild, channel });
            }
        }
        else if (this.client.messages.cache?.has(String(data.id))) {
            return this.client.messages.cache.get(data.id, { guild, channel });
        }
        return new Message_1.Message(this.client, data, { guild: guild, channel });
    }
    forgeManager(options) {
        return new MessageManager(this.client, { guild: options.guild, channel: options.channel, messages: options.messages });
    }
    async fetch(options) {
        options = (0, transformOptions_1.transformOptions)(options);
        const id = options.id ? String(options.id) : undefined;
        const channelId = String(options.channelId || this.channel?.id);
        if (id && this.cache?.has(id))
            return this.cache.get(id, { guild: this.guild, channel: this.channel });
        if (id) {
            if (this.cache?.has(id))
                return this.cache.get(id, { guild: this.guild });
            const msg = await this.client.helpers.getMessage(channelId, id);
            return this.forge(msg, { guild: this.guild, channel: this.channel });
        }
        return this.client.helpers.getMessages(channelId, options).then(msgs => {
            const messages = new discordeno_1.Collection();
            for (const msg of msgs) {
                messages.set(msg[0], this.forge(msg[1], { guild: this.guild, channel: this.channel }));
            }
            return messages;
        });
    }
}
exports.MessageManager = MessageManager;
