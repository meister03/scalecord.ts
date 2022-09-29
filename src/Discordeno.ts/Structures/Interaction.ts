import { CacheBot } from "../Managers/CacheManager";
import { DestructObject } from "./DestructObject";
import { Interaction as RawInteraction } from "discordeno/transformers";
import { InteractionCallbackData, InteractionResponse, InteractionResponseTypes, InteractionTypes } from "discordeno/types";
import { transformAttachments, transformOptions } from "../Util/transformOptions";
import { AttachmentBlobFormat } from "../types/shared";
import { Channel } from "./Channel";
import { Guild } from "./Guild";
import { Member } from "./Member";

export class Interaction extends DestructObject {
    override _raw: RawInteraction;
    client: CacheBot;
    deferred: boolean;
    replied: boolean;
    ephemeral: boolean;
    guild: Guild;
    channel: Channel;
    member: Member;
    constructor(client: CacheBot, data: RawInteraction) {
        super(data)
        this.client = client;
        this._raw = data;

        this.user = client.users.forge(data.user);
        this.guild = client.guilds.forge({ id: this.guildId } as any)  ?? this.client.guilds.forge({id: this.guildId} as any);
        this.channel = client.channels.forge({ id: this.channelId } as any, { guild: this.guild });
        this.member = this.guild.members.forge({ ...data.member, id: this.user.id, guildId: this.guildId as bigint } as any, { guild: this.guild, user: data.user });

        this.deferred = false;
        this.replied = false;
        this.ephemeral = false;
    }

    public isCommand() { return this._raw.type === InteractionTypes.ApplicationCommand; }

    // @todo check Context Menu type and Component Type
    public isModalSubmit(){ return this._raw.type === InteractionTypes.ModalSubmit;}
    public isContextMenu() { return this.isCommand(); }
    public isContextMenuCommand() { return this.isCommand(); }
    public isAutoComplete() { return this._raw.type === InteractionTypes.ApplicationCommandAutocomplete; }
    public isMessageComponent() { return this._raw.type === InteractionTypes.MessageComponent; }
    public isSelectMenu() { return this._raw.type === InteractionTypes.MessageComponent && this._raw.data?.values; }
    public isButton() { return this._raw.type === InteractionTypes.MessageComponent && !this._raw.data?.values; }

    public async deferReply(options?: {ephemeral?: boolean}){
        const payload: InteractionResponse = { data: {}, type: InteractionResponseTypes.DeferredChannelMessageWithSource};
        if(options?.ephemeral && typeof payload.data === 'object') {
            payload.data.flags = 64;
            this.ephemeral = true;
        }
        this.deferred = true;
        return this.client.helpers.sendInteractionResponse(this._raw.id, this._raw.token, payload);
    }

    public async deferUpdate(options?: {ephemeral?: boolean}){
        const payload: InteractionResponse = { data: {}, type: InteractionResponseTypes.DeferredUpdateMessage};
        if(options?.ephemeral && typeof payload.data === 'object') {
            payload.data.flags = 64;
            this.ephemeral = true;
        }
        this.deferred = true;
        return this.client.helpers.sendInteractionResponse(this._raw.id, this._raw.token, payload);
    }

    public async reply(options: InteractionCallbackData & {ephemeral?: Boolean, attachments?: AttachmentBlobFormat }){
        options = transformOptions(options, {content: true});
        if (options.ephemeral) {
            delete options.ephemeral;
            options.flags = options.flags ? options.flags | 64 : 64;
            this.ephemeral = true;
        }

        if (options.attachments) {
            options.file = transformAttachments(options.attachments);
        }

        const payload: InteractionResponse = {data: options, type: InteractionResponseTypes.ChannelMessageWithSource}
        
        this.replied = true;
        return this.client.helpers.sendInteractionResponse(this._raw.id, this._raw.token, payload);
    }

    public async popupModal(options: InteractionCallbackData & {customId: string, title: string}){
        const payload: InteractionResponse = {data: options, type: InteractionResponseTypes.Modal};
        this.replied = true;
        return this.client.helpers.sendInteractionResponse(this._raw.id, this._raw.token, payload);
    }

    public async editReply(options: InteractionCallbackData & {ephemeral?: Boolean, attachments?: AttachmentBlobFormat }){
        options = transformOptions(options, {content: true});

        if (options.attachments) {
            options.file = transformAttachments(options.attachments);
        }
        this.replied = true;
        return this.client.helpers.editOriginalInteractionResponse(this._raw.token, options);
    }

    public async deleteReply(){
        return this.client.helpers.deleteOriginalInteractionResponse(this._raw.token);
    }

    public async followUp(options: InteractionCallbackData & { ephemeral?: Boolean | undefined; attachments?: AttachmentBlobFormat | undefined; }){
        return this.editReply(options);
    }

    public async update(options: InteractionCallbackData & {ephemeral?: Boolean, attachments?: AttachmentBlobFormat }){
        options = transformOptions(options, {content: true});
        if (options.attachments) {
            options.file = transformAttachments(options.attachments);
        }

        const payload: InteractionResponse = {data: options, type: InteractionResponseTypes.UpdateMessage}
        
        this.replied = true;
        return this.client.helpers.sendInteractionResponse(this._raw.id, this._raw.token, payload);
    }
}

export interface Interaction extends Omit<RawInteraction, 'member'>{

}