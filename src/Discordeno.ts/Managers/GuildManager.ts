import { Guild as RawGuild } from "discordeno/transformers";
import { CacheCollection } from "../Structures/CacheCollection";
import { Guild } from "../Structures/Guild";
import { transformOptions } from "../Util/transformOptions";
import { CacheBot } from "./CacheManager";

export class GuildManager {
    client: CacheBot;
    cache: CacheCollection<Guild, RawGuild>;
    constructor(client: CacheBot, options: GuildManagerOptions){
        this.client = client;
        this.cache = options.guilds || new CacheCollection();
    }

    public forge(data: RawGuild) {
        data = transformOptions(data);
    
        const id = String(data.id);
        if (this.client.guilds.cache?.has(id)) {
          const v = this.client.guilds.cache._get(id);
          // @ts-expect-error
          const members = v.members;
          // @ts-expect-error
          const channels = v.channels;
          // @ts-expect-error
          const roles = v.roles;
          // @ts-expect-error
          const emojis = v.emojis;
          // @ts-expect-error
          return new Guild(this.client, v, { roles: roles, channels: channels, members: members, emojis: emojis });
        }
        // @ts-expect-error
        return new Guild(this.client, data, { roles: data.roles, channels: data.channels, members: data.members, emojis: data.emojis });
    }

    public async fetch(options: {id: string, counts?: boolean | undefined}){
        options = transformOptions(options);
        const guild = await this.client.helpers.getGuild(options.id, options);
        return this.forge(guild) as Guild;
    }
    
}

export interface GuildManagerOptions {
    guilds: CacheCollection<Guild, RawGuild>
}