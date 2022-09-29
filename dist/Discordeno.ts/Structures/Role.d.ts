import { DestructObject } from "./DestructObject";
import { CreateGuildRole, EditGuildRole, Role as RawRole } from "discordeno";
import { CacheBot } from "../Managers/CacheManager";
import { Permissions } from "./Permissions";
import { Guild } from "./Guild";
export declare class Role extends DestructObject {
    guild: Guild;
    _raw: RawRole;
    client: CacheBot;
    constructor(client: CacheBot, data: RawRole, options: {
        guild?: Guild;
    });
    get permissions(): Readonly<Permissions>;
    delete(options: {
        id?: string;
        guildId?: string;
    }): Promise<boolean>;
    create(options: CreateGuildRole & {
        reason?: string;
        guildId?: string;
    }): Promise<any>;
    edit(options: EditGuildRole & {
        id?: string;
        guildId?: string;
    }): Promise<any>;
    setPosition(position: number): Promise<any[]>;
}
export interface Role extends Omit<RawRole, 'permissions'> {
    _permissions: bigint;
}
//# sourceMappingURL=Role.d.ts.map