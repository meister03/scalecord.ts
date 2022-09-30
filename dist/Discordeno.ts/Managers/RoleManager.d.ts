import { CreateGuildRole } from "discordeno";
import { Member, Role as RawRole } from "discordeno/transformers";
import { BaseCollection } from "../Structures/BaseCollection";
import { CacheCollection } from "../Structures/CacheCollection";
import { Guild } from "../Structures/Guild";
import { Role } from "../Structures/Role";
import { CacheBot } from "./CacheManager";
export declare class RoleManager {
    client: CacheBot;
    cache: CacheCollection<Role, RawRole> | BaseCollection<string, RawRole>;
    guild: Guild | undefined;
    member: Member | undefined;
    constructor(client: CacheBot, options: RoleManagerOptions);
    create(options: CreateGuildRole & {
        reason?: string;
        guildId?: string;
    }): Promise<any>;
    fetch(options: {
        id?: string;
        guildId?: string;
    }): Promise<any>;
    forge(data: RawRole, options?: {
        guild: Guild;
    }): any;
    add(options: {
        id: string;
        memberId?: string;
        guildId?: string;
        reason?: string;
    }): Promise<boolean>;
    remove(options: {
        id: string;
        memberId?: string;
        guildId?: string;
        reason?: string;
    }): Promise<boolean>;
    forgeManager(options: RoleManagerOptions): RoleManager;
    get highest(): RawRole | {
        position: number;
    } | null;
    get premiumSubscriberRole(): RawRole | undefined;
}
export interface RoleManagerOptions {
    roles?: CacheCollection<Role, RawRole>;
    guild?: Guild;
    member?: Member;
}
//# sourceMappingURL=RoleManager.d.ts.map