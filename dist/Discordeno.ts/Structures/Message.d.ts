import { Collection, CreateMessage, EditMessage } from "discordeno";
import { Message as RawMessage, User as RawUser } from "discordeno/transformers";
import { CacheBot } from "../Managers/CacheManager";
import { AttachmentBlobFormat } from "../types/shared";
import { Channel } from "./Channel";
import { DestructObject } from "./DestructObject";
import { Guild } from "./Guild";
import { Member } from "./Member";
import { User } from "./User";
export declare class Message extends DestructObject {
    _raw: RawMessage;
    client: CacheBot;
    guild: Guild;
    channel: Channel;
    author: User;
    member: Member;
    constructor(client: CacheBot, data: RawMessage & {
        author: RawUser;
    }, options: MessageOptions);
    edit(options: EditMessage & {
        attachments?: AttachmentBlobFormat;
        files?: AttachmentBlobFormat;
        channelId?: string;
        id?: string;
    }): Promise<RawMessage>;
    reply(options: CreateMessage & {
        attachments?: AttachmentBlobFormat;
        files?: AttachmentBlobFormat;
        channelId?: string;
        messageReference?: {
            messageId: string;
            guildId: string;
            channelId: string;
        };
    }): Promise<any>;
    delete(options: {
        id?: string;
        channelId?: string;
        reason?: string;
        delayMilliseconds?: number;
    }): Promise<boolean>;
    react(emoji: string): Promise<this>;
    pin(pinOptions?: {
        channelId?: string;
        id?: string;
        reason?: string;
    }): Promise<this>;
    unpin(pinOptions?: {
        channelId?: string;
        id?: string;
        reason?: string;
    }): Promise<this>;
    get mentions(): {
        channels: Collection<unknown, unknown>;
        members: Collection<unknown, unknown>;
        roles: Collection<unknown, unknown>;
        users: Collection<unknown, unknown>;
    };
}
export interface Message extends Omit<RawMessage, 'member'> {
    mentionedUsers: RawUser[];
}
export interface MessageOptions {
    guild: Guild;
    channel?: Channel;
}
//# sourceMappingURL=Message.d.ts.map