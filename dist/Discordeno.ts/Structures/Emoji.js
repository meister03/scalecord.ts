"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emoji = void 0;
const transformOptions_1 = require("../Util/transformOptions");
const Util_1 = require("../Util/Util");
const DestructObject_1 = require("./DestructObject");
class Emoji extends DestructObject_1.DestructObject {
    _raw;
    guild;
    client;
    constructor(client, data, options) {
        super(data);
        this.client = client;
        this._raw = data;
        this.guild = options.guild ?? this.client.guilds.forge({ id: this.guildId });
    }
    async fetch(id) {
        return this.client.emojis.fetch({ id, guildId: String(this.guild?.id) });
    }
    async create(options) {
        options = (0, transformOptions_1.transformOptions)(options);
        if (!options.guildId)
            options.guildId = String(this.guild?.id);
        const emoji = await this.client.helpers.createEmoji(options.guildId, options);
        return new Emoji(this.client, emoji, { guild: this.guild });
    }
    async edit(options) {
        if (!options.guildId)
            options.guildId = String(this.guild?.id);
        if (!options.id)
            options.id = String(this.id);
        const emoji = await this.client.helpers.editEmoji(options.guildId, options.id, options);
        return new Emoji(this.client, emoji, { guild: this.guild });
    }
    async delete(options) {
        if (!options.id)
            options.id = String(this.id);
        if (!options.guildId)
            options.guildId = String(this.guild?.id);
        await this.client.helpers.deleteEmoji(options.guildId, options.id, options.reason);
        return true;
    }
    get createdTimestamp() {
        return (0, Util_1.getSnowFlake)(this.id).timestamp;
    }
}
exports.Emoji = Emoji;
