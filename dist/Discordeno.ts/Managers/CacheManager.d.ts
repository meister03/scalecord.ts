import { BigString, Bot, FinalHelpers, HelperUtils, Member as RawMember, RequestGuildMembers, Transformers } from "discordeno";
import { User } from "../Structures/User";
import { ChannelManager } from "./ChannelManager";
import { EmojiManager } from "./EmojiManager";
import { GuildManager } from "./GuildManager";
import { MemberManager } from "./MemberManager";
import { MessageManager } from "./MessageManager";
import { RoleManager } from "./RoleManager";
import { UserManager } from "./UserManager";
import { OverwrittenBot } from "../../Client";
export declare function overwriteTransformers(bot: CacheBot): CacheBot;
export declare function enableCachePlugin(bot: Bot, options: BotCacheOptions): CacheBot;
export interface CacheBot extends Omit<OverwrittenBot, 'transformers' | 'utils' | 'helpers'> {
    members: MemberManager;
    emojis: EmojiManager;
    users: UserManager;
    guilds: GuildManager;
    channels: ChannelManager;
    roles: RoleManager;
    messages: MessageManager;
    user: User;
    transformers: OverwrittenTransformers;
    utils: OverwrittenUtils;
    helpers: OverwrittenHelpers;
}
export interface OverwrittenTransformers extends Omit<Transformers, 'snowflake'> {
    snowflake(id: BigString): string;
}
export interface OverwrittenUtils extends Omit<HelperUtils, 'snowflakeToBigint'> {
    snowflakeToBigint(id: BigString): string;
}
export interface OverwrittenHelpers extends Omit<FinalHelpers, 'fetchMembers'> {
    fetchMembers(guildId: BigString, options?: Omit<RequestGuildMembers, 'guildId'>): Promise<RawMember[]>;
}
export interface BotCacheOptions {
    emojis?: CacheOptions;
    users?: CacheOptions;
    guilds?: CacheOptions;
    channels?: CacheOptions;
    roles?: CacheOptions;
    messages?: CacheOptions;
    members?: CacheOptions;
}
export interface CacheOptions {
    properties?: string[];
    maxSize?: number;
    transformerClass?: any;
    sweepFilter?: Function;
    forceSetFilter?: Function;
}
declare function createOptions(client: CacheBot, options: CacheOptions | undefined, transformerClass: any, context: string): {
    client: CacheBot;
    context: string;
    properties: string[] | {
        includes: (str: string) => boolean;
        _cacheAll: boolean;
    };
    transformerClass: any;
    maxSize?: number | undefined;
    sweepFilter?: Function | undefined;
    forceSetFilter?: Function | undefined;
};
export declare type CreateCacheCollectionOptions = ReturnType<typeof createOptions>;
export {};
//# sourceMappingURL=CacheManager.d.ts.map