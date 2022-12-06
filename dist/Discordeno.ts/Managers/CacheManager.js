"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableCachePlugin = exports.overwriteTransformers = void 0;
const CacheCollection_1 = require("../Structures/CacheCollection");
const User_1 = require("../Structures/User");
const ChannelManager_1 = require("./ChannelManager");
const EmojiManager_1 = require("./EmojiManager");
const GuildManager_1 = require("./GuildManager");
const MemberManager_1 = require("./MemberManager");
const MessageManager_1 = require("./MessageManager");
const RoleManager_1 = require("./RoleManager");
const UserManager_1 = require("./UserManager");
const ActionManager_1 = __importDefault(require("./ActionManager"));
const mod_1 = require("../mod");
function overwriteTransformers(bot) {
    const { guild, user, member, channel, message, role, emoji, embed } = bot.transformers;
    const { fetchMembers } = bot.helpers;
    bot.transformers.snowflake = function (id) {
        return String(id);
    };
    bot.utils.snowflakeToBigint = function (id) {
        return String(id);
    };
    bot.events.raw = function (_bot, packet, shardId) {
        if (ActionManager_1.default[packet.t])
            ActionManager_1.default[packet.t]?.(bot, packet, shardId);
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
        guild.channels = [createClone(result)];
        bot.guilds.cache.patch(guild.id, guild);
        return result;
    };
    bot.transformers.message = function (_, payload) {
        const channel = bot.channels.cache.base({ id: payload.channel_id });
        const result = message(bot, payload);
        channel.messages = [createClone(result)];
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
            };
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
        guild.roles = [createClone(result)];
        bot.guilds.cache.patch(guild.id, guild);
        return result;
    };
    bot.transformers.emoji = function (_, payload, guildId) {
        if (!guildId)
            return emoji(bot, payload);
        const result = emoji(bot, payload);
        const guild = bot.guilds.cache.base({ id: guildId });
        guild.emojis = [createClone(result)];
        bot.guilds.cache.patch(guild.id, guild);
        return result;
    };
    bot.transformers.member = function (_, payload, guildId, userId) {
        const result = member(bot, payload, guildId, userId);
        const guild = bot.guilds.cache.base({ id: guildId });
        guild.members = [createClone(result)];
        bot.guilds.cache.patch(guild.id, guild);
        return result;
    };
    bot.transformers.user = function (_, payload) {
        const result = user(bot, payload);
        bot.users.cache.patch(result.id, createClone(result));
        return result;
    };
    bot.transformers.embed = function (_, payload) {
        const result = embed(bot, payload);
        if (!result.fields) {
            result.fields = [];
        }
        return result;
    };
    // Overwrite Helpers
    bot.helpers.fetchMembers = async function (guildId, options) {
        const promise = await fetchMembers(guildId, options);
        const members = bot.members.chunkCache.get(guildId) || [];
        bot.members.chunkCache.delete(guildId);
        return members;
    };
    return bot;
}
exports.overwriteTransformers = overwriteTransformers;
function enableCachePlugin(bot, options) {
    bot = Object.assign(bot, {
        emojis: new EmojiManager_1.EmojiManager(bot, {
            emojis: new CacheCollection_1.CacheCollection(createOptions(bot, options.emojis, mod_1.Emoji, 'guild'))
        }),
        users: new UserManager_1.UserManager(bot, {
            users: new CacheCollection_1.CacheCollection(createOptions(bot, options.users, User_1.User, 'users'))
        }),
        guilds: new GuildManager_1.GuildManager(bot, {
            guilds: new CacheCollection_1.CacheCollection(createOptions(bot, options.guilds, mod_1.Guild, 'guild'))
        }),
        channels: new ChannelManager_1.ChannelManager(bot, {
            channels: new CacheCollection_1.CacheCollection(createOptions(bot, options.channels, mod_1.Channel, 'channel'))
        }),
        roles: new RoleManager_1.RoleManager(bot, {
            roles: new CacheCollection_1.CacheCollection(createOptions(bot, options.roles, mod_1.Role, 'guild'))
        }),
        members: new MemberManager_1.MemberManager(bot, {
            members: new CacheCollection_1.CacheCollection(createOptions(bot, options.members, mod_1.Member, 'guild'))
        }),
        messages: new MessageManager_1.MessageManager(bot, {
            messages: new CacheCollection_1.CacheCollection(createOptions(bot, options.messages, mod_1.Message, 'channel'))
        }),
        interactions: new mod_1.InteractionManager(bot, {
            interactions: new CacheCollection_1.CacheCollection(createOptions(bot, options.interactions, mod_1.Interaction, 'interaction'))
        })
    });
    // @ts-expect-error
    bot.members.chunkCache = new mod_1.BaseCollection();
    return overwriteTransformers(bot);
}
exports.enableCachePlugin = enableCachePlugin;
function createOptions(client, options = {}, transformerClass, context) {
    return {
        ...options,
        client,
        context,
        properties: options.properties ? addBaseProperties(options.properties) : createFakePropertyOptions(),
        transformerClass: options.transformerClass ?? transformerClass,
    };
}
function createFakePropertyOptions() {
    return {
        includes: (str) => true,
        _cacheAll: true,
    };
}
function addBaseProperties(properties) {
    //remove duplicates
    properties = [...properties, "id", "guildId"];
    properties = Array.from(new Set(properties));
    return properties;
}
function createClone(obj) {
    return { ...obj };
}
