"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Webhook = void 0;
const transformOptions_1 = require("../Util/transformOptions");
const DestructObject_1 = require("./DestructObject");
class Webhook extends DestructObject_1.DestructObject {
    _raw;
    client;
    constructor(client, data) {
        super(data);
        this.client = client;
        this._raw = data;
    }
    async send(options) {
        options = (0, transformOptions_1.transformOptions)(options);
        if (!options.webhookId)
            options.webhookId = String(this.id);
        if (!options.token)
            options.token = this.token;
        const message = await this.client.helpers.sendWebhookMessage(options.webhookId, options.token, options);
        if (!message)
            return true;
        return this.client.messages ? this.client.messages.forge(message) : message;
    }
    async edit(options) {
        options = (0, transformOptions_1.transformOptions)(options);
        const id = options.webhookId || this.id;
        const webhook = await this.client.helpers.editWebhook(id, options);
        return new Webhook(this.client, webhook);
    }
    async fetchMessage(options) {
        options = (0, transformOptions_1.transformOptions)(options);
        const webhookId = options.webhookId || this.id;
        const token = (options.token || this.token);
        const messageId = options.id;
        const message = await this.client.helpers.getWebhookMessage(webhookId, token, messageId, options);
        return this.client.messages ? this.client.messages.forge(message) : message;
    }
    async editMessage(options) {
        options = (0, transformOptions_1.transformOptions)(options);
        const webhookId = options.webhookId || this.id;
        const token = (options.token || this.token);
        const messageId = options.id;
        const message = await this.client.helpers.editWebhookMessage(webhookId, token, messageId, options);
        return this.client.messages ? this.client.messages.forge(message) : message;
    }
    async delete(options) {
        options = (0, transformOptions_1.transformOptions)(options, { reason: true });
        const id = options.id || this.id;
        const reason = options.reason;
        await this.client.helpers.deleteWebhook(id, reason);
        return true;
    }
}
exports.Webhook = Webhook;
