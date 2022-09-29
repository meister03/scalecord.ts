import { CacheCollection } from "../Structures/CacheCollection";
import { Emoji } from "../Structures/Emoji";
import { CacheBot } from "./CacheManager";
import { Emoji as RawEmoji } from "discordeno/transformers";
import { Guild } from "../Structures/Guild";
import { Optionalize } from "discordeno/types";
import { transformOptions } from "../Util/transformOptions";
import { BaseCollection } from "../Structures/BaseCollection";

export class EmojiManager {
    cache: CacheCollection<Emoji, RawEmoji> | BaseCollection<string, RawEmoji>;
    client: CacheBot;
    guild: Guild | undefined;
    constructor(client: CacheBot, options: EmojiManagerOptions) {
        this.client = client;
        this.cache = options.emojis ?? new BaseCollection()
        this.guild = options.guild;
    }

    public forge(data: Optionalize<RawEmoji>, options?: { guild?: Guild }) {
        const newData = transformOptions(data);
        const emoji = new Emoji(this.client, newData as Optionalize<RawEmoji>, { guild: options?.guild ?? this.guild });
        return emoji;
    }

    public forgeManager(options: EmojiManagerOptions){
        return new EmojiManager(this.client, options);
    }

    public async fetch(options: { guildId: string, id?: string }) {
        const guildId = options.guildId || String(this.guild?.id);
        const emojiId = options.id;

        if (!emojiId) {
            const rawEmojis = await this.client.helpers.getEmojis(guildId);
            const emojis = new BaseCollection<string,Emoji>();
            for (const emoji of Array.from(rawEmojis)) {
                emojis.set(String(emoji[0]), this.forge(emoji[1], { guild: this.guild }));
            }
            return emojis;
        }
        // @ts-expect-error
        if (this.cache?.has(emojiId)) return this.cache.get(emojiId, { guild: this.guild }) as Emoji;
        const emoji = await this.client.helpers.getEmoji(guildId, emojiId);
        return this.forge(emoji, { guild: this.guild });
    }
}

export interface EmojiManagerOptions {
    emojis?: CacheCollection<Emoji, RawEmoji>;
    guild?: Guild;
}