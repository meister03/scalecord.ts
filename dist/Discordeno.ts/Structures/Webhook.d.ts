import { CreateMessage, GetWebhookMessageOptions, InteractionCallbackData, ModifyWebhook } from "discordeno";
import { Webhook as RawWebhook } from "discordeno/transformers";
import { CacheBot } from "../Managers/CacheManager";
import { DestructObject } from "./DestructObject";
export declare class Webhook extends DestructObject {
    _raw: RawWebhook;
    client: CacheBot;
    constructor(client: CacheBot, data: RawWebhook);
    send(options: CreateMessage & {
        webhookId?: string;
        token?: string;
    }): Promise<any>;
    edit(options: ModifyWebhook & {
        webhookId?: string;
    }): Promise<Webhook>;
    fetchMessage(options: GetWebhookMessageOptions & {
        webhookId?: string;
        token?: string;
        id: string;
    }): Promise<any>;
    editMessage(options: InteractionCallbackData & {
        webhookId?: string;
        token?: string;
        id: string;
    }): Promise<any>;
    delete(options: {
        id?: string;
        reason?: string;
    }): Promise<boolean>;
}
export interface Webhook extends RawWebhook {
}
//# sourceMappingURL=Webhook.d.ts.map