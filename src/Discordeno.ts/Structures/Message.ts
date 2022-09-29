import { Collection, CreateMessage, EditMessage } from "discordeno";
import { Message as RawMessage, User as RawUser } from "discordeno/transformers";
import { CacheBot } from "../Managers/CacheManager";
import { AttachmentBlobFormat } from "../types/shared";
import { Embed } from "../Util/Embed";
import { transformOptions, transformAttachments } from "../Util/transformOptions";
import { Channel } from "./Channel";
import { DestructObject } from "./DestructObject";
import { Guild } from "./Guild";
import { Member } from "./Member";
import { User } from "./User";
export class Message extends DestructObject {
    override _raw: RawMessage;
    client: CacheBot;
    guild: Guild;
    channel: Channel;
    author: User;
    member: Member;
    constructor(client: CacheBot, data: RawMessage & {author: RawUser}, options: MessageOptions){
    super(data);
    this.client = client;
    this._raw = data;
    this.guild = options.guild ?? this.client.guilds.forge({id: this.guildId} as any);
    this.channel = options.channel ?? this.guild.channels.forge({ id: this.channelId } as any, { guild: this.guild });
    this.author = client.users.forge(data.author);
    this.member = this.guild.members.forge({ ...data.member, id: this.authorId } as any, { guild: this.guild, user: data.author });
  }

  public async edit(options: EditMessage & { attachments?: AttachmentBlobFormat, files?: any, channelId?: string, id?: string}) {
    options = transformOptions(options, {content: true});

    if(options.files|| options.attachments){
      options.file = transformAttachments(options.files || options.attachments);
    }

    const channelId = String(options.channelId || this.channelId);
    const id = String(options.id || this.id);

    if(options.embeds){
      options.embeds = options.embeds.map((e)=> {
        return new Embed(e).toJSON();
      });
    }

    return this.client.helpers.editMessage(channelId, id, options);
  }

  public async reply(options: CreateMessage & { attachments?: AttachmentBlobFormat, files?: any, channelId?: string, messageReference?: {messageId: string, guildId: string, channelId: string} }) {
    options = transformOptions(options, {content: true});
    const channelId = String(options.channelId || this.channelId);
    if(options.files || options.attachments){
      options.file = transformAttachments(options.files || options.attachments);
    }

    if (!options.messageReference) {
      options.messageReference = { messageId: String(this.id), channelId: String(this.channel.id), guildId: String(this.guild.id), failIfNotExists: true };
    }
    const msg = await this.client.helpers.sendMessage(channelId, options);
    return this.client.messages.forge(msg, { guild: this.guild , channel: this.channel });
  }

  public async delete(options: {id?: string, channelId?: string, reason?: string, delayMilliseconds?:  number}) {
    options = transformOptions(options);
    const channelId = String(options.channelId || this.channelId);
    const id = String(options.id || this.id);
    
    await this.client.helpers.deleteMessage(channelId, id, options.reason, options.delayMilliseconds);
    return true;
  }

  public async react(emoji: string) {
    await this.client.helpers.addReaction(this.channel.id, this.id, emoji);
    return this;
  }

  public async pin(pinOptions?: {channelId?: string, id?: string, reason?: string}) {
    const options = transformOptions(pinOptions as any, {reason: true}) as {channelId: string, id: string, reason: string};
    const channelId = String(options.channelId || this.channelId);
    const id = String(options.id || this.id);
    await this.client.helpers.pinMessage(channelId, id, options.reason);
    return this;
  }

  public async unpin(pinOptions?: {channelId?: string, id?: string, reason?: string}) {
    const options = transformOptions(pinOptions as any, {reason: true}) as {channelId: string, id: string, reason: string};
    const channelId = String(options.channelId || this.channelId);
    const id = String(options.id || this.id);
    await this.client.helpers.unpinMessage(channelId, id, options.reason);
    return this;
  }


  ///Parse Members:
  get mentions()  {
    const channels = new Collection();
    const members = new Collection();
    const roles = new Collection();
    const users = new Collection();
  
    this.mentionedUsers.forEach((u)=> {
      users.set(u, this.client.users.forge(u));
    })

    this.mentionedRoleIds.forEach((r)=> {
      roles.set(r, this.guild.roles.forge({ id: r } as any, { guild: this.guild }));
    })

    this.mentionedChannelIds.forEach((c)=> {
      channels.set(c, this.guild.channels.forge({ id: c } as any, { guild: this.guild }));
    })

    return {
      channels,
      members,
      roles,
      users,
    }

  }

}

export interface Message extends Omit<RawMessage, 'member'> {
  mentionedUsers: RawUser[];
}

export interface MessageOptions {
    guild: Guild;
    channel?: Channel;
}