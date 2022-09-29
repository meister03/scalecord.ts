import { DestructObject } from "./DestructObject";
import { CreateGuildRole, EditGuildRole, Role as RawRole } from "discordeno"
import { CacheBot } from "../Managers/CacheManager";
import { Permissions } from "./Permissions";
import { convertColor } from "../Util/Util";
import { Guild } from "./Guild";

export class Role extends DestructObject {
    guild: Guild;
    override _raw: RawRole;
    client: CacheBot;
    constructor(client: CacheBot, data: RawRole, options: { guild?: Guild }) {
        super(data, { "permissions": true });
        this.client = client;
        this._raw = data;
        this.guild = options.guild ?? this.client.guilds.forge({id: this.guildId} as any);
    }

    get permissions() {
        return new Permissions(this._permissions || 0n).freeze();
    }

    async delete(options: {id?: string, guildId?: string}) {
        const guildId = String(options.guildId || this.guildId || this.guild?.id);
        const id = options.id || this.id;
        await this.client.helpers.deleteRole(guildId, id);
        return true;
    }

    async create(options: CreateGuildRole & {reason?: string, guildId?: string}) {
        const guildId = String(options.guildId || this.guildId || this.guild?.id);
        if (options.color) options.color = convertColor(options.color);
        const role = await this.client.helpers.createRole(guildId, options, options.reason);
        return this.client.roles.forge(role, { guild: this.guild });
    }

    async edit(options: EditGuildRole & {id?: string, guildId?: string}) {
        const guildId = String(options.guildId || this.guildId || this.guild?.id);
        const id = options.id || this.id;
        if (options.color) options.color = convertColor(options.color);
        const role = await this.client.helpers.editRole(guildId, id, options);
        return this.client.roles.forge(role, { guild: this.guild });
    }

    async setPosition(position: number) {
        const guildId = String(this.guildId || this.guild?.id);
        const roles = await this.client.helpers.modifyRolePositions(guildId, [{ id: this.id, position }]);
        return roles.map(x => this.client.roles.forge(x, { guild: this.guild }));
    }

}

export interface Role extends Omit<RawRole, 'permissions'> {
    _permissions: bigint;
}