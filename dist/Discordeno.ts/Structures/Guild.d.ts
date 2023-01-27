import { Collection, GetGuildAuditLog, ImageFormat, ImageSize, ModifyGuild } from "discordeno";
import { AuditLogEntry, Guild as RawGuild, Role as RawRole, Channel as RawChannel, Member as RawMember, Emoji as RawEmoji } from "discordeno/transformers";
import { CacheBot } from "../Managers/CacheManager";
import { ChannelManager } from "../Managers/ChannelManager";
import { EmojiManager } from "../Managers/EmojiManager";
import { MemberManager } from "../Managers/MemberManager";
import { RoleManager } from "../Managers/RoleManager";
import { CacheCollection } from "./CacheCollection";
import { Channel } from "./Channel";
import { DestructObject } from "./DestructObject";
import { Emoji } from "./Emoji";
import { Member } from "./Member";
import { Role } from "./Role";
import { User } from "./User";
export declare class Guild extends DestructObject {
    _raw: RawGuild;
    client: CacheBot;
    me: Member;
    roles: RoleManager;
    channels: ChannelManager;
    members: MemberManager;
    emojis: EmojiManager;
    constructor(client: CacheBot, data: RawGuild, options: GuildOptions);
    fetch(id: string): Promise<Guild>;
    edit(options: ModifyGuild & {
        id?: string;
    }): Promise<Guild>;
    leave(id: string): Promise<boolean>;
    fetchAuditLogs(options: GetGuildAuditLog & {
        id?: string;
    }): Promise<import("discordeno").AuditLog & {
        entries: Collection<string, AuditLogEntry & {
            executor?: User | undefined;
            target?: User | undefined;
        }>;
    }>;
    iconURL(options?: {
        format: ImageFormat;
        size: ImageSize;
    }): string | undefined;
    get createdTimestamp(): number;
}
export interface Guild extends Omit<RawGuild, 'roles' | 'emojis' | 'channels' | 'members'> {
}
export interface GuildOptions {
    roles?: CacheCollection<Role, RawRole>;
    members?: CacheCollection<Member, RawMember>;
    emojis?: CacheCollection<Emoji, RawEmoji>;
    channels?: CacheCollection<Channel, RawChannel>;
}
//# sourceMappingURL=Guild.d.ts.map