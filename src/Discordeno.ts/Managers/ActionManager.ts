// @ts-nocheck
import { BaseCollection } from "../Structures/BaseCollection";


export function GUILD_DELETE(bot, packet, shardId) {
  const guild = bot.guilds.cache._get(packet.d.id);
  if (!guild) return;
  guild.channels?.clear();
  guild.threads?.clear();
  guild.members?.clear();
  guild.roles?.clear();
  guild.emojis?.clear();
  guild.stageInstances?.clear();
  bot.guilds.cache.delete(packet.d.id);
  return guild;
}

export function GUILD_MEMBERS_CHUNK(bot, packet, shardId) {
  const guild = bot.guilds.cache.base({ id: packet.d.guild_id });
  guild.members = packet.d.members.map((x) => bot.transformers.member(bot, x, packet.d.guild_id, bot.transformers.snowflake(x.user.id)));

  // Resolve later with members
  const chunkedMembers = bot.members.chunkCache.get(packet.d.guild_id) || [];
  chunkedMembers.push(...guild.members);
  bot.members.chunkCache.set(packet.d.guild_id, chunkedMembers);

  return bot.guilds.cache.patch(packet.d.id, guild);
}

export function GUILD_EMOJIS_UPDATE(bot, packet, shardId) {
  const guild = bot.guilds.cache._get(packet.d.guild_id);
  if (!guild) {
    guild = { id: packet.d.guild_id };
    guild = bot.guilds.cache.base(guild, { emojis: true });
  }

  const old = guild.emojis.values({ raw: true });
  const rawEmojis = new BaseCollection(packet.d.emojis.map((x) => [x.id, x]));

  for (const emoji of packet.d.emojis) {
    const cachedEmoji = guild.emojis._get(emoji.id);
    guild.emojis.patch(emoji.id, emoji);
    if (cachedEmoji) {
    } else {
      /// @emit EmojiCreate
    }
  }

  for (const emoji of old) {
    // Emoji deleted
    if (guild.emojis.has(emoji.id) && !rawEmojis.has(emoji.id)) {
      guild.emojis.delete(emoji.id);
      /// @emit EmojiDelete
    }
  }
  return bot.guilds.cache._set(guild.id, guild);
}

export function GUILD_MEMBER_ADD(bot, packet, shardId) {
  const guild = bot.guilds.cache.base({ id: packet.d.guild_id });

  if (!guild.memberCount) guild.memberCount = 0;
  guild.memberCount++;

  guild.members = [
    bot.transformers.member(bot, packet.d, packet.d.guild_id, bot.transformers.snowflake(packet.d.user.id)),
  ];
  return bot.guilds.cache.patch(guild.id, guild);
}

export function GUILD_MEMBER_REMOVE(bot, packet, shardId) {
  const guild = bot.guilds.cache._get(packet.d.guild_id);
  if (!guild) return;

  if (!guild.memberCount) guild.memberCount = 0;
  guild.memberCount--;

  guild.members?.delete(bot.transformers.snowflake(packet.d.user.id));
  return bot.guilds.cache._set(guild.id, guild);
}

export function GUILD_MEMBER_UPDATE(bot, packet, shardId) {
  const guild = bot.guilds.cache.base(packet.d.guild_id);
  const member = bot.transformers.member(bot, packet.d, packet.d.guild_id, bot.transformers.snowflake(packet.d.user.id));
  guild.members = [member];
  //console.log(member.roles, guild)
  return bot.guilds.cache.patch(guild.id, guild);
}


export function GUILD_ROLE_DELETE(bot, packet, shardId) {
  const guild = bot.guilds.cache._get(packet.d.guild_id);
  if (guild?.roles) {
    guild.roles.delete(packet.d.role_id);
  } else {
    return bot.roles.cache.delete(packet.d.role_id);
  }
  return bot.guilds.cache._set(guild.id, guild);
}

export function CHANNEL_DELETE(bot, packet, shardId) {
  const guild = bot.guilds.cache._get(packet.d.guild_id);
  if (guild?.channels) {
    guild.channels.delete(packet.d.id);
  } else {
    return bot.channels.cache.delete(packet.d.id);
  }
  return bot.guilds.cache._set(guild.id, guild);
}
export function THREAD_DELETE(bot, packet, shardId) {
  const guild = bot.guilds.cache._get(packet.d.guild_id);
  if (guild?.threads) {
    guild.threads.delete(packet.d.id);
  } else {
    return bot.channels.cache.delete(packet.d.id);
  }
  return bot.guilds.cache._set(guild.id, guild);
}



/// Interaction Based Events

export function MESSAGE_DELETE(bot, packet, shardId) {
  const channel = bot.channels.cache._get(packet.d.channel_id);
  if (channel?.message) {
    channel.messages.delete(packet.d.id);
  } else {
    return bot.messages.cache.delete(packet.d.id);
  }
  return bot.channels.cache._set(channel.id, channel);
}

export function MESSAGE_DELETE_BULK(bot, packet, shardId) {
  const channel = bot.channels.cache._get(packet.d.channel_id);
  if (channel?.messages) {
    packet.d.ids.forEach((id) => channel.messages.delete(id));
  } else {
    return packet.d.ids.forEach((id) => bot.messages.cache.delete(id));
  }
  return bot.channels.cache._set(channel.id, channel);
}

export function MESSAGE_REACTION_ADD(bot, packet, shardId) {
  const channel = bot.channels.cache._get(packet.d.channel_id);
  if (!channel) return;
  const message = channel.messages?._get(packet.d.message_id);
  if (!message) return;
  const reaction = message.reactions?.find((r) => r.emoji.id === packet.d.emoji.id);
  if (reaction) {
    reaction.count = reaction.count + 1;
    message.reactions.splice(message.reactions.indexOf(reaction), 1);
    message.reactions.push(reaction);
    channel.messages.patch(message.id, message);
  }
  channel.messages.patch(message.id, message);
  return bot.channels.cache._set(channel.id, channel);
}

export function MESSAGE_REACTION_REMOVE(bot, packet, shardId) {
  const channel = bot.channels.cache._get(packet.d.channel_id);
  if (!channel) return;
  const message = channel.messages?._get(packet.d.message_id);
  if (!message) return;
  const reaction = message.reactions?.find((r) => r.emoji.id === packet.d.emoji.id);
  if (reaction) {
    reaction.count = reaction.count - 1;
    message.reactions.splice(message.reactions.indexOf(reaction), 1);
    message.reactions.push(reaction);
    channel.messages.patch(message.id, message);
  }
  return bot.channels.cache._set(channel.id, channel);
}

export function MESSAGE_REACTION_REMOVE_ALL(bot, packet, shardId) {
  const channel = bot.channels.cache._get(packet.d.channel_id);
  if (!channel) return;
  const message = channel.messages?._get(packet.d.message_id);
  if (!message) return;
  message.reactions = [];
  channel.messages.patch(message.id, message);
  return bot.channels.cache._set(channel.id, channel);
}

export function MESSAGE_REACTION_REMOVE_EMOJI(bot, packet, shardId) {
  const channel = bot.channels.cache._get(packet.d.channel_id);
  if (!channel) return;
  const message = channel.messages?._get(packet.d.message_id);
  if (!message) return;
  message.reactions = message.reactions?.filter((r) => r.emoji.id !== packet.d.emoji.id);
  channel.messages.patch(message.id, message);
  return bot.channels.cache._set(channel.id, channel);
}

export default { 
  GUILD_DELETE, 
  GUILD_MEMBERS_CHUNK, 
  GUILD_EMOJIS_UPDATE, 
  GUILD_MEMBER_ADD, 
  GUILD_MEMBER_REMOVE, 
  GUILD_MEMBER_UPDATE,
  GUILD_ROLE_DELETE,
  CHANNEL_DELETE,
  THREAD_DELETE,
  MESSAGE_DELETE,
  MESSAGE_DELETE_BULK,
  MESSAGE_REACTION_ADD,
  MESSAGE_REACTION_REMOVE,
  MESSAGE_REACTION_REMOVE_ALL,
  MESSAGE_REACTION_REMOVE_EMOJI
}