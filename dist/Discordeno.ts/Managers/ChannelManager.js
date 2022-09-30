"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelManager = void 0;
const CacheCollection_1 = require("../Structures/CacheCollection");
const Channel_1 = require("../Structures/Channel");
const discordeno_1 = require("discordeno");
const transformOptions_1 = require("../Util/transformOptions");
class ChannelManager {
    cache;
    client;
    guild;
    constructor(client, options) {
        this.client = client;
        this.cache = options.channels ?? new CacheCollection_1.CacheCollection();
        this.guild = options.guild;
    }
    async create(options) {
        if (!options.guildId && this.guild?.id)
            options.guildId = String(this.guild?.id);
        return new Channel_1.Channel(this.client, options, { guild: this.guild }).create(options);
    }
    async edit(options) {
        if (!options.guildId && this.guild?.id)
            options.guildId = String(this.guild?.id);
        return this.forge(options, { guild: this.guild }).edit(options);
    }
    async delete(options) {
        options = (0, transformOptions_1.transformOptions)(options);
        return new Channel_1.Channel(this.client, { id: options.id }, { guild: this.guild }).delete(options);
    }
    async fetch(options) {
        options = (0, transformOptions_1.transformOptions)(options);
        const guildId = String(options.guildId || this.guild?.id);
        const channelId = options.id;
        if (!channelId) {
            const rawChannels = await this.client.helpers.getChannels(guildId);
            const channels = new discordeno_1.Collection();
            for (const channel of rawChannels) {
                channels.set(channel[0], this.forge(channel[1], { guild: this.guild }));
            }
            return channels;
        }
        if (this.cache?.has(channelId)) {
            return this.cache.get(channelId, { guild: this.guild });
        }
        const channel = await this.client.helpers.getChannel(channelId);
        return this.forge(channel, { guild: this.guild });
    }
    forge(data, options) {
        data = (0, transformOptions_1.transformOptions)(data);
        const guild = options?.guild || this.guild;
        if (guild) {
            if (guild.channels.cache?.has(String(data.id))) {
                return guild.channels.cache.get(data.id, { guild });
            }
        }
        else if (this.client.channels.cache?.has(String(data.id))) {
            return this.client.channels.cache.get(data.id, { guild });
        }
        return new Channel_1.Channel(this.client, data, { guild });
    }
    forgeManager(options) {
        return new ChannelManager(this.client, { guild: options.guild, channels: options.channels });
    }
}
exports.ChannelManager = ChannelManager;
