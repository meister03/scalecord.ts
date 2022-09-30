// @ts-nocheck
import { BigString, Bot, FinalHelpers, HelperUtils, Member as RawMember, RequestGuildMembers, Transformers } from "discordeno";
import { CacheCollection } from "../Structures/CacheCollection";
import { User } from "../Structures/User";
import { ChannelManager } from "./ChannelManager";
import { EmojiManager } from "./EmojiManager";
import { GuildManager } from "./GuildManager";
import { MemberManager } from "./MemberManager";
import { MessageManager } from "./MessageManager";
import { RoleManager } from "./RoleManager";
import { UserManager } from "./UserManager";
import Actions from './ActionManager'
import { OverwrittenBot } from "../../Client";
import { Channel, Emoji, Guild, Interaction, InteractionManager, Member, Message, Role } from "../mod";

export function overwriteTransformers(bot: CacheBot) {
    const { guild, user, member, channel, message, role, emoji, embed } = bot.transformers;
    const { fetchMembers } = bot.helpers;

    bot.transformers.snowflake = function (id) {
        return String(id);
    }

    bot.utils.snowflakeToBigint = function (id) {
        return String(id);
    }

    bot.events.raw = function (_bot, packet, shardId) {
        if (Actions[packet.t]) Actions[packet.t]?.(bot, packet, shardId);
    };

    bot.transformers.guild = function (_, payload) {
        // Run the unmodified transformer
        const roles = payload.guild.roles;
        payload.guild.roles = [];

        const emojis = payload.guild.emojis;
        payload.guild.emojis = [];

        const result = guild(bot, payload);
        if (payload.guild) {
            result.channels = payload.guild.channels?.map((x) => channel(bot, { channel: x, guildId: result.id }));
            result.members = payload.guild.members?.map((x) => member(bot, x, result.id, bot.transformers.snowflake(x.user.id)));

            result.roles = roles?.map((x) => role(bot, { role: x, guildId: result.id }));
            result.emojis = emojis?.map((x) => emoji(bot, x));
        }
        // Cache the result
        if (result) {
            bot.guilds.cache.patch(result.id, result);
        }

        // Return the result
        return result;
    };

    bot.transformers.channel = function (_, payload) {
        const guildId = payload.guildId ?? payload.channel.guild_id;
        const guild = bot.guilds.cache.base({ id: guildId });
        const result = channel(bot, payload);
        guild.channels = [result];
        bot.guilds.cache.patch(guild.id, guild);
        return result;
    };

    bot.transformers.message = function (_, payload) {
        const channel = bot.channels.cache.base({ id: payload.channel_id });
        const result = message(bot, payload);

        channel.messages = [result];

        bot.channels.cache.patch(channel.id, channel);

        if (!result.author) {
            const author = {
                id: payload.author.id,
                username: payload.author.username,
                discriminator: String(payload.author.discriminator),
                avatar: payload.author.avatar ? payload.author.avatar : undefined,
                bot: payload.author.bot,
                flags: payload.author.flags,
                public_flags: payload.author.public_flags,
            }
            result.author = bot.transformers.user(bot, author);
        }

        if (payload.member) {
            bot.transformers.member(bot, payload.member, bot.transformers.snowflake(payload.guild_id), bot.transformers.snowflake(payload.author.id));
        }

        if (payload.mentions) {
            result.mentionedUsers = payload.mentions?.map((x) => bot.transformers.user(bot, x));
        }

        return result;
    };

    bot.transformers.role = function (_, payload) {
        const guildId = payload.guildId ?? payload.role?.guild_id;
        const guild = bot.guilds.cache.base({ id: guildId });
        const result = role(bot, payload);
        guild.roles = [result];
        bot.guilds.cache.patch(guild.id, guild);
        return result;
    };

    bot.transformers.emoji = function (_, payload, guildId) {
        if (!guildId) return emoji(bot, payload);
        const result = emoji(bot, payload);
        const guild = bot.guilds.cache.base({ id: guildId });
        guild.emojis = [result];
        bot.guilds.cache.patch(guild.id, guild);
        return result;
    };
    bot.transformers.member = function (_, payload, guildId, userId) {
        const result = member(bot, payload, guildId, userId);
        const guild = bot.guilds.cache.base({ id: guildId });
        guild.members = [result];
        bot.guilds.cache.patch(guild.id, guild);
        return result;
    }

    bot.transformers.user = function (_, payload) {
        const result = user(bot, payload);
        bot.users.cache.patch(result.id, result);
        return result;
    };

    bot.transformers.embed = function (_, payload) {
        const result = embed(bot, payload);
        if (!result.fields) {
            result.fields = [];
        }
        return result;
    }

    // Overwrite Helpers
    bot.helpers.fetchMembers = async function (guildId, options) {
        const promise = await fetchMembers(guildId, shardId, options);
        const members = bot.members.chunkCache.get(guildId) || [];
        bot.members.chunkCache.delete(guildId)
        return members;
    }

    return bot;
}

export function enableCachePlugin(bot: Bot, options: BotCacheOptions) {

    bot = Object.assign(bot,
        {
            emojis: new EmojiManager(bot as CacheBot, {
                emojis: new CacheCollection(
                    createOptions(bot as CacheBot, options.emojis, Emoji, 'guild')
                )
            }),
            users: new UserManager(bot as CacheBot, {
                users: new CacheCollection(
                    createOptions(bot as CacheBot, options.users, User, 'users')
                )
            }),
            guilds: new GuildManager(bot as CacheBot, {
                guilds: new CacheCollection(
                    createOptions(bot as CacheBot, options.guilds, Guild, 'guild')
                )
            }),
            channels: new ChannelManager(bot as CacheBot, {
                channels: new CacheCollection(
                    createOptions(bot as CacheBot, options.channels, Channel, 'guild')
                )
            }),
            roles: new RoleManager(bot as CacheBot, {
                roles: new CacheCollection(
                    createOptions(bot as CacheBot, options.roles, Role, 'guild')
                )
            }),
            members: new MemberManager(bot as CacheBot, {
                members: new CacheCollection(
                    createOptions(bot as CacheBot, options.members, Member, 'guild')
                )
            }),
            messages: new MessageManager(bot as CacheBot, {
                messages: new CacheCollection(
                    createOptions(bot as CacheBot, options.messages, Message, 'channel')
                )
            }),
            interactions: new InteractionManager(bot as CacheBot, {
                interactions: new CacheCollection(
                    createOptions(bot as CacheBot, options.interactions, Interaction, 'interaction')
                )
            })
        }
    )
    return overwriteTransformers(bot);
}

export interface CacheBot extends Omit<OverwrittenBot, 'transformers' | 'utils' | 'helpers'> {
    members: MemberManager;
    emojis: EmojiManager;
    users: UserManager;
    guilds: GuildManager;
    channels: ChannelManager;
    roles: RoleManager;
    messages: MessageManager;
    interactions: InteractionManager;
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
    interactions?: CacheOptions;
}

export interface CacheOptions {
    properties?: string[];
    maxSize?: number;
    transformerClass?: any;
    sweepFilter?: Function;
    forceSetFilter?: Function;
}


function createOptions(client: CacheBot, options: CacheOptions = {}, transformerClass: any, context: string) {
    return {
        ...options,
        client,
        context,
        properties: options.properties ? addBaseProperties(options.properties) : createFakePropertyOptions(),
        transformerClass: options.transformerClass ?? transformerClass,
    };
}

export type CreateCacheCollectionOptions = ReturnType<typeof createOptions>;

function createFakePropertyOptions() {
    return {
        includes: (str: string) => true,
        _cacheAll: true,
    };
}

function addBaseProperties(properties: string[]) {
    //remove duplicates
    properties = [...properties, "id", "guildId"];
    properties = Array.from(new Set(properties));
    return properties;
}