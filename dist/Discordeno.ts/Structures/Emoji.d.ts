import { CreateGuildEmoji, ModifyGuildEmoji } from "discordeno";
import { Emoji as RawEmoji } from "discordeno/transformers";
import { CacheBot } from "../Managers/CacheManager";
import { DestructObject } from "./DestructObject";
import { Guild } from "./Guild";
export declare class Emoji extends DestructObject {
    _raw: RawEmoji;
    guild: Guild;
    client: CacheBot;
    constructor(client: CacheBot, data: RawEmoji, options: {
        guild?: Guild;
    });
    fetch(id: string): Promise<Emoji | import("./BaseCollection").BaseCollection<string, Emoji>>;
    create(options: CreateGuildEmoji & {
        guildId: string;
    }): Promise<Emoji>;
    edit(options: ModifyGuildEmoji & {
        guildId: string;
        id?: string;
    }): Promise<Emoji>;
    delete(options: {
        id?: string;
        guildId?: string;
        reason?: string;
    }): Promise<boolean>;
    get createdTimestamp(): number;
}
export interface Emoji extends RawEmoji {
    guildId: string;
}
//# sourceMappingURL=Emoji.d.ts.map