import { CacheBot } from "../Managers/CacheManager";
import { DestructObject } from "./DestructObject";
import { Interaction as RawInteraction } from "discordeno/transformers";
import { InteractionCallbackData } from "discordeno/types";
import { AttachmentBlobFormat } from "../types/shared";
import { Channel } from "./Channel";
import { Guild } from "./Guild";
import { Member } from "./Member";
export declare class Interaction extends DestructObject {
    _raw: RawInteraction;
    client: CacheBot;
    deferred: boolean;
    replied: boolean;
    ephemeral: boolean;
    guild: Guild;
    channel: Channel;
    member: Member;
    constructor(client: CacheBot, data: RawInteraction);
    isCommand(): boolean;
    isModalSubmit(): boolean;
    isContextMenu(): boolean;
    isContextMenuCommand(): boolean;
    isAutoComplete(): boolean;
    isMessageComponent(): boolean;
    isSelectMenu(): false | string[] | undefined;
    isButton(): boolean;
    deferReply(options?: {
        ephemeral?: boolean;
    }): Promise<void>;
    deferUpdate(options?: {
        ephemeral?: boolean;
    }): Promise<void>;
    reply(options: InteractionCallbackData & {
        ephemeral?: Boolean;
        attachments?: AttachmentBlobFormat;
    }): Promise<void>;
    popupModal(options: InteractionCallbackData & {
        customId: string;
        title: string;
    }): Promise<void>;
    editReply(options: InteractionCallbackData & {
        ephemeral?: Boolean;
        attachments?: AttachmentBlobFormat;
    }): Promise<import("discordeno/transformers").Message | undefined>;
    deleteReply(): Promise<void>;
    followUp(options: InteractionCallbackData & {
        ephemeral?: Boolean | undefined;
        attachments?: AttachmentBlobFormat | undefined;
    }): Promise<import("discordeno/transformers").Message | undefined>;
    update(options: InteractionCallbackData & {
        ephemeral?: Boolean;
        attachments?: AttachmentBlobFormat;
    }): Promise<void>;
}
export interface Interaction extends Omit<RawInteraction, 'member'> {
}
//# sourceMappingURL=Interaction.d.ts.map