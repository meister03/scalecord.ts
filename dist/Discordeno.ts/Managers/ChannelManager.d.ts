import { Channel as RawChannel } from "discordeno/transformers";
import { CacheCollection } from "../Structures/CacheCollection";
import { CacheBot } from "./CacheManager";
import { Guild } from "../Structures/Guild";
import { Channel } from "../Structures/Channel";
import { CreateGuildChannel, ModifyChannel } from "discordeno";
export declare class ChannelManager {
    cache: CacheCollection<Channel, RawChannel>;
    client: CacheBot;
    guild: Guild | undefined;
    constructor(client: CacheBot, options: ChannelManagerOptions);
    create(options: CreateGuildChannel & {
        reason?: string;
        guildId?: string;
    }): Promise<Channel>;
    edit(options: ModifyChannel & {
        reason?: string;
        guildId?: string;
    }): Promise<Channel>;
    delete(options: {
        id: string;
        reason?: string;
    }): Promise<boolean>;
    fetch(options: {
        id?: string;
        guildId?: string;
    }): Promise<any>;
    forge(data: RawChannel, options?: {
        guild: Guild;
    }): Channel;
    forgeManager(options: ChannelManagerOptions): ChannelManager;
}
export interface ChannelManagerOptions {
    channels?: CacheCollection<Channel, RawChannel>;
    guild?: Guild;
}
//# sourceMappingURL=ChannelManager.d.ts.map