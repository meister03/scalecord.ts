"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmojiManager = void 0;
const Emoji_1 = require("../Structures/Emoji");
const transformOptions_1 = require("../Util/transformOptions");
const BaseCollection_1 = require("../Structures/BaseCollection");
class EmojiManager {
    cache;
    client;
    guild;
    constructor(client, options) {
        this.client = client;
        this.cache = options.emojis ?? new BaseCollection_1.BaseCollection();
        this.guild = options.guild;
    }
    forge(data, options) {
        const newData = (0, transformOptions_1.transformOptions)(data);
        const emoji = new Emoji_1.Emoji(this.client, newData, { guild: options?.guild ?? this.guild });
        return emoji;
    }
    forgeManager(options) {
        return new EmojiManager(this.client, options);
    }
    async fetch(options) {
        const guildId = options.guildId || String(this.guild?.id);
        const emojiId = options.id;
        if (!emojiId) {
            const rawEmojis = await this.client.helpers.getEmojis(guildId);
            const emojis = new BaseCollection_1.BaseCollection();
            for (const emoji of Array.from(rawEmojis)) {
                emojis.set(String(emoji[0]), this.forge(emoji[1], { guild: this.guild }));
            }
            return emojis;
        }
        // @ts-expect-error
        if (this.cache?.has(emojiId))
            return this.cache.get(emojiId, { guild: this.guild });
        const emoji = await this.client.helpers.getEmoji(guildId, emojiId);
        return this.forge(emoji, { guild: this.guild });
    }
}
exports.EmojiManager = EmojiManager;
