import { calculateShardId, Collection, GetGuildAuditLog, ImageFormat, ImageSize, ModifyGuild } from "discordeno";
import { AuditLogEntry, Guild as RawGuild, User as RawUser, Role as RawRole, Channel as RawChannel, Member as RawMember, Emoji as RawEmoji } from "discordeno/transformers";
import { CacheBot } from "../Managers/CacheManager";
import { ChannelManager } from "../Managers/ChannelManager";
import { EmojiManager } from "../Managers/EmojiManager";
import { MemberManager } from "../Managers/MemberManager";
import { RoleManager } from "../Managers/RoleManager";
import { transformOptions } from "../Util/transformOptions";
import { getSnowFlake } from "../Util/Util";
import { CacheCollection } from "./CacheCollection";
import { Channel } from "./Channel";
import { DestructObject } from "./DestructObject";
import { Emoji } from "./Emoji";
import { Member } from "./Member";
import { Role } from "./Role";
import { User } from "./User";
export class Guild extends DestructObject {
    override _raw: RawGuild;
    client: CacheBot;
    me: Member;
    roles: RoleManager;
    channels: ChannelManager;
    members: MemberManager;
    emojis: EmojiManager;
    constructor(client: CacheBot, data: RawGuild, options: GuildOptions) {
        super(data)
        this._raw = data;
        this.client = client;

        this.roles = client.roles.forgeManager({ guild: this, roles: options.roles });
        this.channels = client.channels.forgeManager({ guild: this, channels: options.channels });
        this.members = client.members.forgeManager({ guild: this, members: options.members });
        this.emojis = client.emojis.forgeManager({ guild: this, emojis: options.emojis });

        this.me = client.members.forge({ id: (client.user ? client.user.id : client.id) } as any, { guild: this });
    }

    public async fetch(id: string) {
        if (!id) id = String(this.id);
        return this.client.guilds.fetch({ id });
    }

    public async edit(options: ModifyGuild & { id?: string }) {
        if (!options.id) options.id = String(this.id);
        const shardId = calculateShardId(this.client.gateway, BigInt(options.id));
        const guild = await this.client.helpers.editGuild(options.id, options, shardId)
        return this.client.guilds.forge(guild);
    }

    public async leave(id: string) {
        const options: { id: string } = transformOptions(id ?? this.id);
        await this.client.helpers.leaveGuild(options.id);
        return true;
    }

    public async fetchAuditLogs(options: GetGuildAuditLog & { id?: string }) {
        options = transformOptions(options);
        if (!options.id) options.id = String(this.id);
        const audit = await this.client.helpers.getAuditLog(options.id, options);
        const entries: Collection<string, AuditLogEntry & { executor?: User, target?: User }> = new Collection();
        audit.auditLogEntries.forEach((x: AuditLogEntry & { executor?: User, target?: User }) => {
            x.executor = this.client.users.forge({
                id: x.userId as bigint,
            } as RawUser);
            x.target = this.client.users.forge({
                id: x.targetId as bigint,
            } as RawUser);
            entries.set(String(x.id), x)
        });
        return Object.assign(audit, { entries });
    }

    public iconURL(options: { format: ImageFormat, size: ImageSize } = { format: 'png', size: 512 }) {
        return this.client.helpers.getGuildIconURL(this.id, this.icon, options);
    }

    public get createdTimestamp() {
        return getSnowFlake(this.id as bigint).timestamp;
    }
}

export interface Guild extends Omit<RawGuild, 'roles' | 'emojis' | 'channels' | 'members'> {

}

export interface GuildOptions {
    roles?: CacheCollection<Role, RawRole>;
    members?: CacheCollection<Member, RawMember>;
    emojis?: CacheCollection<Emoji, RawEmoji>;
    channels?: CacheCollection<Channel, RawChannel>;
}