import { Channel as RawChannel } from "discordeno/transformers";
import { CacheCollection } from "../Structures/CacheCollection";
import { CacheBot } from "./CacheManager";
import { Guild } from "../Structures/Guild";
import { Channel } from "../Structures/Channel";
import { Collection, CreateGuildChannel, ModifyChannel } from "discordeno";
import { transformOptions } from "../Util/transformOptions";

export class ChannelManager {
    cache: CacheCollection<Channel, RawChannel>;
    client: CacheBot;
    guild: Guild | undefined;
    constructor(client: CacheBot, options: ChannelManagerOptions) {
        this.client = client;
        this.cache = options.channels ?? new CacheCollection()
        this.guild = options.guild;
    }

    async create(options: CreateGuildChannel & { reason?: string, guildId?: string }) {
        if (!options.guildId && this.guild?.id) options.guildId = String(this.guild?.id);
        return new Channel(this.client, options as any, {guild: this.guild}).create(options);
    }

    async edit(options: ModifyChannel & { reason?: string, guildId?: string }) {
        if (!options.guildId && this.guild?.id) options.guildId = String(this.guild?.id);
        return this.forge(options as any, { guild: this.guild as Guild }).edit(options);
    }

    async delete(options: { id: string, reason?: string }) {
        options = transformOptions(options);
        return new Channel(this.client, { id: options.id } as any, { guild: this.guild }).delete(options);
    }

    async fetch(options: {id?: string, guildId?: string}) {
        options = transformOptions(options);

        const guildId = String(options.guildId || this.guild?.id);
        const channelId = options.id;


        if (!channelId) {
            const rawChannels = await this.client.helpers.getChannels(guildId);
            const channels = new Collection();
            for (const channel of rawChannels) {
                channels.set(channel[0], this.forge(channel[1], { guild: this.guild as Guild}));
            }
            return channels;
        }

        if (this.cache?.has(channelId)) {
            return this.cache.get(channelId, { guild: this.guild});
        }
        const channel = await this.client.helpers.getChannel(channelId);

        return this.forge(channel, { guild: this.guild as Guild})
    }

    forge(data: RawChannel, options?: {guild: Guild}) {
        data = transformOptions(data);

        const guild = options?.guild || this.guild;
        if (guild) {
            if (guild.channels.cache?.has(String(data.id))) {
                return guild.channels.cache.get(data.id, { guild }) as Channel;
            }
        } else if (this.client.channels.cache?.has(String(data.id))) {
            return this.client.channels.cache.get(data.id, { guild }) as Channel;
        }
        return new Channel(this.client, data, { guild });
    }

    forgeManager(options: ChannelManagerOptions) {
        return new ChannelManager(this.client,{ guild: options.guild, channels: options.channels });
    }
}

export interface ChannelManagerOptions {
    channels?: CacheCollection<Channel, RawChannel>;
    guild?: Guild;
}