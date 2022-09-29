import { CreateMessage, GetWebhookMessageOptions, InteractionCallbackData, ModifyWebhook } from "discordeno";
import { Webhook as RawWebhook } from "discordeno/transformers";
import { CacheBot } from "../Managers/CacheManager";
import { transformOptions } from "../Util/transformOptions";
import { DestructObject } from "./DestructObject";
export class Webhook extends DestructObject {
    override _raw: RawWebhook;
    client: CacheBot;
    constructor(client: CacheBot, data: RawWebhook) {
        super(data);
        this.client = client;
        this._raw = data;
    }
    public async send(options: CreateMessage & { webhookId?: string, token?: string }) {
        options = transformOptions(options);

        if (!options.webhookId) options.webhookId = String(this.id);
        if (!options.token) options.token = this.token as string;
        const message = await this.client.helpers.sendWebhookMessage(options.webhookId, options.token, options);
        if(!message) return true;
        return this.client.messages ? this.client.messages.forge(message) : message;
    }

    public async edit(options: ModifyWebhook & {webhookId?: string}) {
        options = transformOptions(options);

        const id = options.webhookId || this.id;
        const webhook = await this.client.helpers.editWebhook(id, options);
        return new Webhook(this.client, webhook);
    }

    public async fetchMessage(options: GetWebhookMessageOptions & {webhookId?: string, token?: string, id: string}) {
        options = transformOptions(options);

        const webhookId = options.webhookId|| this.id;
        const token = (options.token || this.token) as string;

        const messageId = options.id;

        const message = await this.client.helpers.getWebhookMessage(webhookId, token, messageId, options);
        return this.client.messages ? this.client.messages.forge(message) : message;
    }


    public async editMessage(options: InteractionCallbackData & {webhookId?: string, token?: string, id: string}) {
        options = transformOptions(options);

        const webhookId = options.webhookId|| this.id;
        const token = (options.token || this.token) as string;

        const messageId = options.id;

        const message = await this.client.helpers.editWebhookMessage(webhookId, token, messageId, options);
        return this.client.messages ? this.client.messages.forge(message) : message;
    }

    public async delete(options: {id?: string, reason?: string}) {
        options = transformOptions(options, {reason: true});

        const id = options.id || this.id;
        const reason = options.reason;

        await this.client.helpers.deleteWebhook(id, reason);
        return true;
    }
}

export interface Webhook extends RawWebhook {

}