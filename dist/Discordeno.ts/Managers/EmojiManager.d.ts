import { CacheCollection } from "../Structures/CacheCollection";
import { Emoji } from "../Structures/Emoji";
import { CacheBot } from "./CacheManager";
import { Emoji as RawEmoji } from "discordeno/transformers";
import { Guild } from "../Structures/Guild";
import { Optionalize } from "discordeno/types";
import { BaseCollection } from "../Structures/BaseCollection";
export declare class EmojiManager {
    cache: CacheCollection<Emoji, RawEmoji> | BaseCollection<string, RawEmoji>;
    client: CacheBot;
    guild: Guild | undefined;
    constructor(client: CacheBot, options: EmojiManagerOptions);
    forge(data: Optionalize<RawEmoji>, options?: {
        guild?: Guild;
    }): Emoji;
    forgeManager(options: EmojiManagerOptions): EmojiManager;
    fetch(options: {
        guildId: string;
        id?: string;
    }): Promise<Emoji | BaseCollection<string, Emoji>>;
}
export interface EmojiManagerOptions {
    emojis?: CacheCollection<Emoji, RawEmoji>;
    guild?: Guild;
}
//# sourceMappingURL=EmojiManager.d.ts.map