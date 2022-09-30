import { Collection, ModifyGuildMember, RequestGuildMembers } from "discordeno";
import { Member as RawMember, User as RawUser } from "discordeno/transformers";
import { CacheCollection } from "../Structures/CacheCollection";
import { Guild } from "../Structures/Guild";
import { Member } from "../Structures/Member";
import { CacheBot } from "./CacheManager";
export declare class MemberManager {
    client: CacheBot;
    cache: CacheCollection<Member, RawMember>;
    guild: Guild | undefined;
    constructor(client: CacheBot, options: MemberManagerOptions);
    forge(data: RawMember, options?: {
        user?: RawUser;
        guild?: Guild;
    }): Member;
    forgeManager(options: MemberManagerOptions): MemberManager;
    fetch(options: RequestGuildMembers & {
        id?: string;
        guildId?: string;
    }): Promise<Member | Collection<unknown, unknown>>;
    edit(options: ModifyGuildMember & {
        id?: string;
        guildId?: string;
    }): Promise<Member>;
    kick(options: {
        id: string;
        guildId?: string;
        reason?: string;
    }): Promise<Member>;
    ban(options: {
        id: string;
        guildId?: string;
        reason?: string;
    }): Promise<Member>;
    unban(options: {
        id: string;
        guildId?: string;
        reason?: string;
    }): Promise<Member>;
}
export interface MemberManagerOptions {
    members?: CacheCollection<Member, RawMember>;
    guild?: Guild;
}
//# sourceMappingURL=MemberManager.d.ts.map