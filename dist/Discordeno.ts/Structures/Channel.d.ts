import { Collection, CreateGuildChannel, CreateMessage, CreateWebhook, ModifyChannel } from "discordeno";
import { Channel as RawChannel, Message as RawMessage, Role as RawRole } from "discordeno/transformers";
import { CacheBot } from "../Managers/CacheManager";
import { MessageManager } from "../Managers/MessageManager";
import { AttachmentBlobFormat } from "../types/shared";
import { BaseCollection } from "./BaseCollection";
import { CacheCollection } from "./CacheCollection";
import { DestructObject } from "./DestructObject";
import { Guild } from "./Guild";
import { Member } from "./Member";
import { Message } from "./Message";
import { PermissionOverwrites } from "./PermissionOverwrites";
import { Permissions } from "./Permissions";
import { Role } from "./Role";
import { Webhook } from "./Webhook";
export declare class Channel extends DestructObject {
    _raw: RawChannel;
    guild: Guild;
    client: CacheBot;
    messages: MessageManager;
    constructor(client: CacheBot, data: RawChannel, options: {
        guild?: Guild;
        messages?: CacheCollection<Message, RawMessage>;
    });
    create(options: CreateGuildChannel & {
        reason?: string;
        guildId?: string;
    }): Promise<Channel>;
    edit(options: ModifyChannel & {
        reason?: string;
        guildId?: string;
    }): Promise<Channel>;
    delete(options: {
        id?: string;
        reason?: string;
    }): Promise<boolean>;
    fetch(options: {
        id: string;
    }): Promise<Channel>;
    send(options: CreateMessage & {
        attachments?: AttachmentBlobFormat;
        channelId?: string;
    }): Promise<any>;
    bulkDelete(options: {
        id: string | bigint;
    }[] | string[] | bigint[], reason?: string): Promise<boolean>;
    get permissionOverwrites(): PermissionOverwrites;
    permissionsFor(resource: Role | Member, type: 'role' | 'member', checkAdmin?: boolean): Readonly<Permissions> | undefined;
    overwritesFor(member: Member, roles?: BaseCollection<string, RawRole>): {
        everyone: any;
        roles: any[];
        member: any;
    };
    createWebhook(options: CreateWebhook & {
        channelId?: string;
    }): Promise<Webhook>;
    fetchWebhooks(channelId?: string): Promise<Collection<unknown, unknown>>;
}
export interface Channel extends Omit<RawChannel, 'permissionOverwrites'> {
    _permissionOverwrites: RawChannel['permissionOverwrites'];
}
//# sourceMappingURL=Channel.d.ts.map