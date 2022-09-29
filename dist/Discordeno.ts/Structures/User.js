"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const DestructObject_1 = require("./DestructObject");
const transformOptions_1 = require("../Util/transformOptions");
const Util_1 = require("../Util/Util");
class User extends DestructObject_1.DestructObject {
    _raw;
    client;
    constructor(client, data) {
        super(data);
        this.client = client;
        this._raw = data;
    }
    get tag() {
        return `${this.username}#${this.discriminator}`;
    }
    avatarURL(options = { format: 'png', size: 512 }) {
        const { format, size } = options;
        return this.client.helpers.getAvatarURL(this.id, this.discriminator, { avatar: this.avatar, format, size });
    }
    async send(options) {
        options = (0, transformOptions_1.transformOptions)(options, { content: true });
        const channel = await this.client.helpers.getDmChannel(options.id ?? this.id);
        return this.client.helpers.sendMessage(channel.id, options);
    }
    get createdTimestamp() {
        return (0, Util_1.getSnowFlake)(this.id).timestamp;
    }
}
exports.User = User;
