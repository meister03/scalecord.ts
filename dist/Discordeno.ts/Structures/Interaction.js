"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interaction = void 0;
const DestructObject_1 = require("./DestructObject");
const types_1 = require("discordeno/types");
const transformOptions_1 = require("../Util/transformOptions");
class Interaction extends DestructObject_1.DestructObject {
    _raw;
    client;
    deferred;
    replied;
    ephemeral;
    guild;
    channel;
    member;
    constructor(client, data) {
        super(data);
        this.client = client;
        this._raw = data;
        this.user = client.users.forge(data.user);
        this.guild = client.guilds.forge({ id: this.guildId }) ?? this.client.guilds.forge({ id: this.guildId });
        this.channel = client.channels.forge({ id: this.channelId }, { guild: this.guild });
        this.member = this.guild.members.forge({ ...data.member, id: this.user.id, guildId: this.guildId }, { guild: this.guild, user: data.user });
        this.deferred = false;
        this.replied = false;
        this.ephemeral = false;
    }
    isCommand() { return this._raw.type === types_1.InteractionTypes.ApplicationCommand; }
    // @todo check Context Menu type and Component Type
    isModalSubmit() { return this._raw.type === types_1.InteractionTypes.ModalSubmit; }
    isContextMenu() { return this.isCommand(); }
    isContextMenuCommand() { return this.isCommand(); }
    isAutoComplete() { return this._raw.type === types_1.InteractionTypes.ApplicationCommandAutocomplete; }
    isMessageComponent() { return this._raw.type === types_1.InteractionTypes.MessageComponent; }
    isSelectMenu() { return this._raw.type === types_1.InteractionTypes.MessageComponent && this._raw.data?.values; }
    isButton() { return this._raw.type === types_1.InteractionTypes.MessageComponent && !this._raw.data?.values; }
    async deferReply(options) {
        const payload = { data: {}, type: types_1.InteractionResponseTypes.DeferredChannelMessageWithSource };
        if (options?.ephemeral && typeof payload.data === 'object') {
            payload.data.flags = 64;
            this.ephemeral = true;
        }
        this.deferred = true;
        return this.client.helpers.sendInteractionResponse(this._raw.id, this._raw.token, payload);
    }
    async deferUpdate(options) {
        const payload = { data: {}, type: types_1.InteractionResponseTypes.DeferredUpdateMessage };
        if (options?.ephemeral && typeof payload.data === 'object') {
            payload.data.flags = 64;
            this.ephemeral = true;
        }
        this.deferred = true;
        return this.client.helpers.sendInteractionResponse(this._raw.id, this._raw.token, payload);
    }
    async reply(options) {
        options = (0, transformOptions_1.transformOptions)(options, { content: true });
        if (options.ephemeral) {
            delete options.ephemeral;
            options.flags = options.flags ? options.flags | 64 : 64;
            this.ephemeral = true;
        }
        if (options.files || options.attachments) {
            options.file = (0, transformOptions_1.transformAttachments)((options.attachments || options.files));
        }
        const payload = { data: options, type: types_1.InteractionResponseTypes.ChannelMessageWithSource };
        this.replied = true;
        return this.client.helpers.sendInteractionResponse(this._raw.id, this._raw.token, payload);
    }
    async popupModal(options) {
        const payload = { data: options, type: types_1.InteractionResponseTypes.Modal };
        this.replied = true;
        return this.client.helpers.sendInteractionResponse(this._raw.id, this._raw.token, payload);
    }
    async editReply(options) {
        options = (0, transformOptions_1.transformOptions)(options, { content: true });
        if (options.attachments || options.files) {
            options.file = (0, transformOptions_1.transformAttachments)((options.attachments || options.files));
        }
        this.replied = true;
        return this.client.helpers.editOriginalInteractionResponse(this._raw.token, options);
    }
    async deleteReply() {
        return this.client.helpers.deleteOriginalInteractionResponse(this._raw.token);
    }
    async followUp(options) {
        return this.reply(options);
    }
    async update(options) {
        options = (0, transformOptions_1.transformOptions)(options, { content: true });
        if (options.attachments || options.files) {
            options.file = (0, transformOptions_1.transformAttachments)((options.files || options.attachments));
        }
        const payload = { data: options, type: types_1.InteractionResponseTypes.UpdateMessage };
        this.replied = true;
        return this.client.helpers.sendInteractionResponse(this._raw.id, this._raw.token, payload);
    }
}
exports.Interaction = Interaction;
