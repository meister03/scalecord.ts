import { DestructObject } from "./DestructObject";
import { User as RawUser } from "discordeno/transformers";
import { CacheBot } from "../Managers/CacheManager";
import { CreateMessage, ImageFormat, ImageSize } from "discordeno";
export declare class User extends DestructObject {
    _raw: RawUser;
    client: CacheBot;
    constructor(client: CacheBot, data: RawUser);
    get tag(): string;
    avatarURL(options?: {
        format: ImageFormat;
        size: ImageSize;
    }): string;
    send(options: CreateMessage & {
        id?: string;
    }): Promise<import("discordeno").Message>;
    get createdTimestamp(): number;
}
export interface User extends RawUser {
}
//# sourceMappingURL=User.d.ts.map