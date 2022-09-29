import { DestructObject } from "./DestructObject";
import { User as RawUser } from "discordeno/transformers";
import { CacheBot } from "../Managers/CacheManager";
import { CreateMessage, ImageFormat, ImageSize } from "discordeno";
import { transformOptions } from "../Util/transformOptions";
import { getSnowFlake } from "../Util/Util";

export class User extends DestructObject {
    override _raw: RawUser;
    client: CacheBot;
    constructor(client: CacheBot, data: RawUser) {
        super(data)
        this.client = client;
        this._raw = data;
    }

    public get tag() {
        return `${this.username}#${this.discriminator}`;
    }

    public avatarURL(options: {format: ImageFormat, size: ImageSize} = {format: 'png', size: 512}) {
        const { format, size } = options;
        return this.client.helpers.getAvatarURL(this.id, this.discriminator, { avatar: this.avatar, format, size });
    }

    async send(options: CreateMessage & {id?: string}) {
        options = transformOptions(options, {content: true});
        const channel = await this.client.helpers.getDmChannel(options.id ?? this.id);
        return this.client.helpers.sendMessage(channel.id, options);
    }

    get createdTimestamp() {
        return getSnowFlake(this.id).timestamp;
    }
}

export interface User extends RawUser {

}