"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
const DestructObject_1 = require("./DestructObject");
const Permissions_1 = require("./Permissions");
const Util_1 = require("../Util/Util");
class Role extends DestructObject_1.DestructObject {
    guild;
    _raw;
    client;
    constructor(client, data, options) {
        super(data, { "permissions": true });
        this.client = client;
        this._raw = data;
        this.guild = options.guild ?? this.client.guilds.forge({ id: this.guildId });
    }
    get permissions() {
        return new Permissions_1.Permissions(this._permissions || 0n).freeze();
    }
    async delete(options) {
        const guildId = String(options.guildId || this.guildId || this.guild?.id);
        const id = options.id || this.id;
        await this.client.helpers.deleteRole(guildId, id);
        return true;
    }
    async create(options) {
        const guildId = String(options.guildId || this.guildId || this.guild?.id);
        if (options.color)
            options.color = (0, Util_1.convertColor)(options.color);
        const role = await this.client.helpers.createRole(guildId, options, options.reason);
        return this.client.roles.forge(role, { guild: this.guild });
    }
    async edit(options) {
        const guildId = String(options.guildId || this.guildId || this.guild?.id);
        const id = options.id || this.id;
        if (options.color)
            options.color = (0, Util_1.convertColor)(options.color);
        const role = await this.client.helpers.editRole(guildId, id, options);
        return this.client.roles.forge(role, { guild: this.guild });
    }
    async setPosition(position) {
        const guildId = String(this.guildId || this.guild?.id);
        const roles = await this.client.helpers.modifyRolePositions(guildId, [{ id: this.id, position }]);
        return roles.map(x => this.client.roles.forge(x, { guild: this.guild }));
    }
}
exports.Role = Role;
