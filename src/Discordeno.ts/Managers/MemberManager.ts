import { Collection, ModifyGuildMember, RequestGuildMembers } from "discordeno";
import { Member as RawMember, User as RawUser} from "discordeno/transformers";
import { CacheCollection } from "../Structures/CacheCollection";
import { Guild } from "../Structures/Guild";
import { Member } from "../Structures/Member";
import { User } from "../Structures/User";
import { transformOptions } from "../Util/transformOptions";
import { CacheBot } from "./CacheManager";

export class MemberManager {
    client: CacheBot;
    cache: CacheCollection<Member, RawMember>;
    guild: Guild | undefined;
    constructor(client: CacheBot, options: MemberManagerOptions) {
        this.client = client;

        this.cache = options.members || new CacheCollection();
        this.guild = options.guild;
    }

    public forge(data: RawMember, options?: {user?: RawUser, guild?: Guild}) {
        data = transformOptions(data);
        if (options?.guild && data.id) {
            if (options.guild.members.cache?.has(String(data.id))) {
                const user = this.client.users.cache._get(data.id);
                return options.guild.members.cache.get(data.id, { guild: options.guild, user }) as Member;
            }
        }
        return new Member(this.client, data, { guild: (options?.guild || this.guild), user: options?.user as User});
    }

    public forgeManager(options: MemberManagerOptions) {
        return new MemberManager(this.client, { guild: options.guild, members: options.members });
    }

    public async fetch(options: RequestGuildMembers & {id?: string, guildId?: string}) {
        options = transformOptions(options);
        const guildId = String(options.guildId || this.guild?.id);
        const memberId = options.id;

        if (!memberId) {
            const rawMembers = await this.client.helpers.fetchMembers(guildId, options);
            const members = new Collection();
            // rawMembers not Collection, because of Custom Overwrite in CacheManager
            for (const member of rawMembers) {
                members.set(member.id, this.forge(member, { guild: this.guild }));
            }
            return members;
        }

        if (this.cache?.has(memberId)) return this.forge({id: String(memberId)} as any, { guild: this.guild });
        const member = await this.client.helpers.getMember(guildId, memberId);
        return this.forge(member, { guild: this.guild, user: member.user });
    }

    public async edit(options: ModifyGuildMember & {id?: string, guildId?: string}) {
        options = transformOptions(options);
        const member = this.forge(options as any, { guild: this.guild });
        return member.edit(options);
    }

    public async kick(options: {id: string, guildId?: string, reason?: string}) {
        options = transformOptions(options);
        const member = this.forge(options as any, { guild: this.guild });
        return member.kick(options);
    }

    public async ban(options: {id: string, guildId?: string, reason?: string}) {
        options = transformOptions(options);
        const member = this.forge(options as any, { guild: this.guild });
        return member.ban(options);
    }

    public async unban(options: {id: string, guildId?: string, reason?: string}) {
        options = transformOptions(options);
        const member = this.forge(options as any, { guild: this.guild });
        return member.unban(options);
    }
}

export interface MemberManagerOptions {
    members?: CacheCollection<Member, RawMember>;
    guild?: Guild;
}