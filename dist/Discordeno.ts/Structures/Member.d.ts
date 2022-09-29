import { CreateMessage, ModifyGuildMember } from "discordeno";
import { Member as RawMember, User as RawUser } from "discordeno/transformers";
import { CacheBot } from "../Managers/CacheManager";
import { DestructObject } from "./DestructObject";
import { Permissions } from "./Permissions";
import { Guild } from "./Guild";
import { User } from "./User";
import { RoleManager } from "../Managers/RoleManager";
export declare class Member extends DestructObject {
    _raw: RawMember;
    guild: Guild;
    client: CacheBot;
    user: User;
    roles: RoleManager;
    constructor(client: CacheBot, data: RawMember, options: {
        guild?: Guild;
        user: RawUser;
    });
    get permissions(): Readonly<Permissions>;
    get manageable(): boolean | Boolean;
    get kickable(): boolean;
    get bannable(): boolean;
    send(options: CreateMessage & {
        id?: string;
    }): Promise<import("discordeno").Message>;
    fetch(options: {
        id?: string;
        guildId?: string;
    }): Promise<Member>;
    kick(options: {
        id?: string;
        guildId?: string;
        reason?: string;
    }): Promise<this>;
    ban(options: {
        id?: string;
        guildId?: string;
        reason?: string;
    }): Promise<this>;
    unban(options: {
        id?: string;
        guildId?: string;
    }): Promise<this>;
    edit(options: ModifyGuildMember & {
        id?: string;
        guildId?: string;
    }): Promise<Member>;
}
export interface Member extends Omit<RawMember, 'permissions' | 'roles'> {
}
//# sourceMappingURL=Member.d.ts.map