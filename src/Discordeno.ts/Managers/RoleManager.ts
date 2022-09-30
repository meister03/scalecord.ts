import { Collection, CreateGuildRole } from "discordeno";
import { Member, Role as RawRole } from "discordeno/transformers";
import { BaseCollection } from "../Structures/BaseCollection";
import { CacheCollection } from "../Structures/CacheCollection";
import { Guild } from "../Structures/Guild";
import { Role } from "../Structures/Role";
import { transformOptions } from "../Util/transformOptions";
import { CacheBot } from "./CacheManager";

export class RoleManager {
    client: CacheBot;
    cache: CacheCollection<Role, RawRole> | BaseCollection<string, RawRole>;
    guild: Guild | undefined;
    member: Member | undefined; 
    constructor(client: CacheBot, options: RoleManagerOptions) {
        this.client = client;
        this.cache = options.roles || new BaseCollection();
        this.guild = options.guild;
        this.member = options.member;
    }

    public async create(options: CreateGuildRole & {reason?: string, guildId?: string}) {
        return new Role(this.client, options as any, { guild: this.guild }).create(options);
    }

    public async fetch(options: {id?: string, guildId?: string}) {
        options = transformOptions(options);

        const guildId = String(options.guildId || this.guild?.id);
        const roleId = options.id ? String(options.id) : undefined;

        // @ts-expect-error
        if (this.cache?.has(roleId)) return this.cache.get(roleId, { guild: this.guild });


        const rawRoles = await this.client.helpers.getRoles(guildId);
        const roles: Collection<string,RawRole> = new Collection();
        for (const role of rawRoles) {
            // @ts-expect-error
            roles.set(String(role[0]), this.forge(role[1], { guild: this.guild }));
        }

        return roleId ? roles.get(roleId) : roles;
    }

    public forge(data: RawRole, options?: {guild: Guild}){
        data = transformOptions(data);

        if (options?.guild) {
            if (options.guild.roles.cache?.has(String(data.id))) {
                // @ts-expect-error
                return options.guild.roles.cache.get(data.id, { guild: options.guild });
            }
        } else if (this.client.roles.cache?.has(String(data.id))) {
            // @ts-expect-error
            return this.client.roles.cache.get(data.id, { guild: options.guild }) as Role;
        }
        return new Role(this.client, data, { guild: (options?.guild || this.guild) });
    }

    public async add(options: {id: string, memberId?: string, guildId?: string, reason?: string}) {
        options = transformOptions(options);

        const roleId = String(options.id);
        const guildId = String(this.guild ? this.guild.id : options.guildId);
        const memberId = String(this.member ? this.member.id : options.memberId);
        await this.client.helpers.addRole(guildId, memberId, roleId, options.reason);
        return true;
    }

    public async remove(options: {id: string, memberId?: string, guildId?: string, reason?: string}) {
        options = transformOptions(options);

        const roleId = String(options.id);
        const guildId = String(this.guild ? this.guild.id : options.guildId);
        const memberId = String(this.member ? this.member.id : options.memberId);
        await this.client.helpers.removeRole(guildId, memberId, roleId, options.reason);
        return true;
    }

    public forgeManager(options: RoleManagerOptions) {
        return new RoleManager(this.client, { guild: options.guild, member: options.member, roles: options.roles });
    }

    public get highest() {
        if (!this.cache) return null;
        // @ts-expect-error
        return [...this.cache.values({ raw: true })].map(r => r).sort((a, b) => b.position - a.position)?.[0] || { position: 0 };
    }

    public get premiumSubscriberRole() {
        // @ts-expect-error
        return [...this.cache.values({ raw: true })].filter(x => x.toggles?.premiumSubscriber)[0];
    }
}

export interface RoleManagerOptions {
    roles?: CacheCollection<Role, RawRole>;
    guild?: Guild;
    member?: Member;
}