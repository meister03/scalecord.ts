import { GetMessagesOptions } from "discordeno";
import { Message as RawMessage } from "discordeno/transformers";
import { CacheCollection } from "../Structures/CacheCollection";
import { Channel } from "../Structures/Channel";
import { Guild } from "../Structures/Guild";
import { Message, MessageOptions } from "../Structures/Message";
import { CacheBot } from "./CacheManager";
export declare class MessageManager {
    client: CacheBot;
    guild: Guild | undefined;
    channel: Channel | undefined;
    cache: CacheCollection<Message, RawMessage>;
    constructor(client: CacheBot, options: MessageManagerOptions);
    forge(data: RawMessage, options?: MessageOptions): any;
    forgeManager(options: MessageManagerOptions): MessageManager;
    fetch(options: GetMessagesOptions & {
        channelId?: string;
        id?: String;
    }): Promise<any>;
}
export interface MessageManagerOptions {
    guild?: Guild;
    channel?: Channel;
    messages?: CacheCollection<Message, RawMessage>;
}
//# sourceMappingURL=MessageManager.d.ts.map