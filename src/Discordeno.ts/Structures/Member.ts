import { CreateMessage, ModifyGuildMember } from "discordeno";
import { Member as RawMember, User as RawUser } from "discordeno/transformers";
import { CacheBot } from "../Managers/CacheManager";
import { transformOptions } from "../Util/transformOptions";
import { DestructObject } from "./DestructObject";
import { Permissions } from "./Permissions";
import { Guild } from "./Guild";
import { User } from "./User";
import { RoleManager } from "../Managers/RoleManager";
import { BaseCollection } from "./BaseCollection";
export class Member extends DestructObject {
    override _raw: RawMember;
    guild: Guild;
    client: CacheBot;
    user: User;
    roles: RoleManager;
    constructor(client: CacheBot, data: RawMember, options: { guild?: Guild, user: RawUser }) {
        super(data, { "permissions": true });
        this._raw = data;
        this.client = client;

        this.guild = options.guild  ?? this.client.guilds.forge({id: this.guildId} as any);

        if (options.user) data.user = options.user;

        this.user = client.users.forge(data.user ?? options.user);

        // Shallow Copy RoleIds befor overwrite
        // @ts-expect-error
        const roleIds = typeof data.roles === 'array' ? data.roles.slice(0) : (data.roles ? Array.from(data.roles.values()) : []);

        this.roles = client.roles.forgeManager({
            guild: this.guild,
            member: this as any,
            // @ts-expect-error
            roles: getRoles(client, roleIds, this.guild),
        });
    }

    public get permissions() {
        if (this.id === this.guild?.ownerId) return new Permissions(Permissions.ALL).freeze();
        if (!this.roles.cache) return new Permissions(0n).freeze();
        // @ts-expect-error
        const permissions: bigint[] = [...this.roles.cache.values()].map((role) => role._permissions || 0n);
        return new Permissions(permissions).freeze();
    }

    public get manageable() {
        if (this.id === this.guild?.ownerId) return false;
        if (this.id === this.client.id) return false;
        if (this.client.id === this.guild?.ownerId) return true;
        // @ts-expect-error
        return new Boolean(this.guild?.me?.roles?.highest > this.roles.highest);
    }

    public get kickable() {
        return this.manageable && this.guild?.me.permissions.has(Permissions.FLAGS.KICK_MEMBERS);
    }

    public get bannable() {
        return this.manageable && this.guild?.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS);
    }

    public async send(options: CreateMessage & {id?: string}) {
        options = transformOptions(options, { content: true });
        return this.client.users.forge({ id: this.id } as any).send(options);
    }

    public async fetch(options: {id?: string, guildId?: string}) {
        options = transformOptions(options);

        const id = options.id || this.id;   
        const guildId = String(options.guildId || this.guildId || this.guild?.id);

        const member = await this.client.helpers.getMember(guildId, id);
        return this.client.members.forge(member, { guild: this.guild });
    }

    public async kick(options: {id?: string, guildId?: string, reason?: string}) {
        options = transformOptions(options);

        const id = options.id || this.id;
        const guildId = String(options.guildId || this.guildId || this.guild?.id);
        const reason = options.reason;

        await this.client.helpers.kickMember(guildId, id, reason);
        return this;
    }

    public async ban(options: {id?: string, guildId?: string, reason?: string}) {
        options = transformOptions(options);

        const id = options.id || this.id;
        const guildId = String(options.guildId || this.guildId || this.guild?.id);

        await this.client.helpers.banMember(guildId, id, options);
        return this;
    }

    public async unban(options: {id?: string, guildId?: string}) {
        options = transformOptions(options);

        const id = options.id || this.id;
        const guildId = String(options.guildId || this.guildId || this.guild?.id);
        await this.client.helpers.unbanMember(guildId, id);
        return this;
    }

    public async edit(options: ModifyGuildMember & {id?: string, guildId?: string}) {
        options = transformOptions(options);

        const id = String(options.id || this.id);
        const guildId = String(options.guildId || this.guildId || this.guild?.id);

        const member = await this.client.helpers.editMember(guildId, id, options);
        return this.client.members.forge(member, { guild: this.guild });
    }


}

export interface Member extends Omit<RawMember,'permissions' | 'roles'>{
}

function getRoles(client: CacheBot, roles: [], guild: Guild) {
    if (!roles) return new BaseCollection();
    const memberRoles = new BaseCollection();
    roles.forEach((m) => {
        const role = client.roles.forge(m as any, { guild: guild });
        if (role) memberRoles.set(role.id, role);
    });
    return memberRoles;
}