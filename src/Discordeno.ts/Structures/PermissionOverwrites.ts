// @ts-nocheck
import { CacheBot } from "../Managers/CacheManager";
import { Channel } from "./Channel";
import { separateOverwrites } from '../Util/Util';
import { Collection, OverwriteReadable } from "discordeno";
import { transformOptions, transformPermissionOverwrites } from "../Util/transformOptions";
import { DestructObject } from "./DestructObject";

export class PermissionOverwrites extends DestructObject {
    overwriteId: any;
    cache: any;
    channel: Channel;
    client: CacheBot;
    constructor(client: CacheBot, data: ReturnType<typeof separateOverwrites> & { overwriteId?: string, id?: string }, options: PermissionOverwritesOptions) {
        super(data);
        this.overwriteId = data.overwriteId || data.id;

        this.cache = options.permissionOverwrites ?? new Collection();

        this.channel = options.channel;
        this.client = client;
    }

    has(overwriteId: string) {
        return this.cache.has(String(overwriteId));
    }

    get(overwriteId: string) {
        return this.cache.get(String(overwriteId));
    }

    async edit(overwriteId: string, options: editOptions & {channelId?: string, neutral?: string[]}) {
        if (!overwriteId) overwriteId = String(options.overwriteId || options.id || this.overwriteId);

        const existing = this.cache.get(overwriteId) ?? { allow: this.allow ?? [], deny: this.deny ?? [], type: this.type || 'role', id: this.overwriteId };

        options = transformPermissionOverwrites(options);

        const overwrites = { allow: [...options.allow], deny: [...options.deny], type: options.type };

        if (options.allow) {
            existing.allow.forEach(x => {
                if (!options.allow.includes(x) && !options.deny.includes(x)) overwrites.allow.push(x);
            })
        }

        if (options.deny) {
            existing.deny.forEach(x => {
                if (!options.deny.includes(x) && !options.allow.includes(x)) overwrites.deny.push(x);
            })
        }

        if (options.neutral) {
            options.neutral.forEach(x => {
                if (overwrites.allow.includes(x)) overwrites.allow.splice(overwrites.allow.indexOf(x), 1);
                if (overwrites.deny.includes(x)) overwrites.deny.splice(overwrites.deny.indexOf(x), 1);
            })
        }

        options.allow = overwrites.allow;
        options.deny = overwrites.deny;
        delete options.neutral;

        if (!options.type) options.type = overwrites.type;

        const channelId = options.channelId || this.channel?.id;

        options.id = BigInt(overwriteId);
        return this.client.helpers.editChannelPermissionOverrides(channelId, options);
    }

    async create(overwriteId: string, options: editOptions) {
        return this.edit(overwriteId, options);
    }

    delete(options: {id: string, channelId?: string}) {
        options = transformOptions(options);

        const channelId = options.channelId || this.channel?.id;
        const overwriteId = options.id || this.overwriteId;

        return this.client.helpers.deleteChannelPermissionOverride(channelId, overwriteId);
    }
}

export interface PermissionOverwritesOptions {
    permissionOverwrites: Collection<string, any>;
    channel: Channel;
}
export interface PermissionOverwrites extends OverwriteReadable {

}

export interface editOptions extends OverwriteReadable { overwriteId?: string }