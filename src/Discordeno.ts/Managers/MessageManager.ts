import { Collection, GetMessagesOptions} from "discordeno";
import { Message as RawMessage } from "discordeno/transformers";
import { CacheCollection } from "../Structures/CacheCollection";
import { Channel } from "../Structures/Channel";
import { Guild } from "../Structures/Guild";
import { Message, MessageOptions } from "../Structures/Message";
import { transformOptions } from "../Util/transformOptions";
import { CacheBot } from "./CacheManager";

export class MessageManager {
  client: CacheBot;
  guild: Guild | undefined;
  channel: Channel | undefined;
  cache: CacheCollection<Message, RawMessage>;
  constructor(client: CacheBot, options: MessageManagerOptions) {
    this.client = client;
    this.guild = options.guild;
    this.channel = options.channel;

    this.cache = options.messages || new CacheCollection();

  }

public forge(data: RawMessage, options?: MessageOptions) {
    data = transformOptions(data);

    const guild = options?.guild || this.guild;
    const channel = options?.channel || this.channel;

    if (channel) {
      if (channel.messages.cache?.has(String(data.id))) {
        return channel.messages.cache.get(data.id, { guild, channel});
      }
    } else if (this.client.messages.cache?.has(String(data.id))) {
      return this.client.messages.cache.get(data.id, { guild, channel });
    }
    return new Message(this.client, data as any, { guild: guild as Guild, channel});
  }

  public forgeManager(options: MessageManagerOptions) {
    return new MessageManager(this.client, { guild: options.guild, channel: options.channel, messages: options.messages });
  }

  public async fetch(options:  GetMessagesOptions & {channelId?: string, id?: String}) {
    options = transformOptions(options);

    const id = String(options.id);
    const channelId = String(options.channelId || this.channel?.id);

    if (this.cache?.has(id)) return this.cache.get(id, { guild: this.guild, channel: this.channel });

    if (typeof id === 'string' && id) {
      if (this.cache?.has(id)) return this.cache.get(id, { guild: this.guild });

      const msg = await this.client.helpers.getMessage(channelId, id);
      return this.forge(msg, { guild: this.guild as Guild, channel: this.channel });
    }

    return this.client.helpers.getMessages(channelId, options).then(msgs => {
      const messages = new Collection();
      for (const msg of msgs) {
        messages.set(msg[0], this.forge(msg[1], { guild: this.guild as Guild, channel: this.channel }));
      }
      return messages;
    })
  }
}

export interface MessageManagerOptions {
    guild?: Guild;
    channel?: Channel;
    messages?: CacheCollection<Message, RawMessage>
}