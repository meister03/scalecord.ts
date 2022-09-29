import { CreateGuildEmoji, ModifyGuildEmoji } from "discordeno";
import { Emoji as RawEmoji } from "discordeno/transformers";
import { CacheBot } from "../Managers/CacheManager";
import { transformOptions } from "../Util/transformOptions";
import { getSnowFlake } from "../Util/Util";
import { DestructObject } from "./DestructObject";
import { Guild } from "./Guild";
export class Emoji extends DestructObject{
    override _raw: RawEmoji;
    guild: Guild;
    client: CacheBot;
    constructor(client: CacheBot, data: RawEmoji, options: {guild?: Guild}){
        super(data)
        this.client = client;
        this._raw = data;
        this.guild = options.guild ?? this.client.guilds.forge({id: this.guildId} as any);
    }

    public async fetch(id: string){
        return this.client.emojis.fetch({id, guildId: String(this.guild?.id)});
    }

    public async create(options: CreateGuildEmoji & {guildId: string}){
        options = transformOptions<CreateGuildEmoji & {guildId: string}>(options);
        if(!options.guildId) options.guildId = String(this.guild?.id);
        const emoji = await this.client.helpers.createEmoji(options.guildId, options);
        return new Emoji(this.client, emoji, {guild: this.guild});
    }

    public async edit(options: ModifyGuildEmoji & {guildId: string, id?: string}){
        if(!options.guildId) options.guildId = String(this.guild?.id);
        if(!options.id) options.id = String(this.id);
        const emoji = await this.client.helpers.editEmoji(options.guildId,options.id, options);
        return new Emoji(this.client, emoji, {guild: this.guild});
    }

    public async delete(options: {id?: string, guildId?: string, reason?: string}){
        if(!options.id) options.id = String(this.id);
        if(!options.guildId) options.guildId = String(this.guild?.id);
        await this.client.helpers.deleteEmoji(options.guildId, options.id, options.reason);
        return true;
    }

    get createdTimestamp() {
        return getSnowFlake(this.id as bigint).timestamp;
    }
}

export interface Emoji extends RawEmoji {
    guildId: string;
}