import { Guild as RawGuild } from "discordeno/transformers";
import { CacheCollection } from "../Structures/CacheCollection";
import { Guild } from "../Structures/Guild";
import { CacheBot } from "./CacheManager";
export declare class GuildManager {
    client: CacheBot;
    cache: CacheCollection<Guild, RawGuild>;
    constructor(client: CacheBot, options: GuildManagerOptions);
    forge(data: RawGuild): Guild;
    fetch(options: {
        id: string;
        counts?: boolean | undefined;
    }): Promise<Guild>;
}
export interface GuildManagerOptions {
    guilds: CacheCollection<Guild, RawGuild>;
}
//# sourceMappingURL=GuildManager.d.ts.map