import { CacheBot } from "../Managers/CacheManager";
import { Channel } from "./Channel";
import { separateOverwrites } from '../Util/Util';
import { Collection, OverwriteReadable } from "discordeno";
import { DestructObject } from "./DestructObject";
export declare class PermissionOverwrites extends DestructObject {
    overwriteId: any;
    cache: any;
    channel: Channel;
    client: CacheBot;
    constructor(client: CacheBot, data: ReturnType<typeof separateOverwrites> & {
        overwriteId?: string;
        id?: string;
    }, options: PermissionOverwritesOptions);
    has(overwriteId: string): any;
    get(overwriteId: string): any;
    edit(overwriteId: string, options: editOptions & {
        channelId?: string;
        neutral?: string[];
    }): Promise<void>;
    create(overwriteId: string, options: editOptions): Promise<void>;
    delete(options: {
        id: string;
        channelId?: string;
    }): Promise<void>;
}
export interface PermissionOverwritesOptions {
    permissionOverwrites: Collection<string, any>;
    channel: Channel;
}
export interface PermissionOverwrites extends OverwriteReadable {
}
export interface editOptions extends OverwriteReadable {
    overwriteId?: string;
}
//# sourceMappingURL=PermissionOverwrites.d.ts.map