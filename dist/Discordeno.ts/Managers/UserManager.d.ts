import { User as RawUser } from "discordeno/transformers";
import { Optionalize } from "discordeno/types";
import { CacheCollection } from "../Structures/CacheCollection";
import { User } from "../Structures/User";
import { CacheBot } from "./CacheManager";
export declare class UserManager {
    client: CacheBot;
    cache: CacheCollection<User, RawUser>;
    constructor(client: CacheBot, options: UserManagerOptions);
    fetch(options: string | {
        id: string;
    }): Promise<User>;
    forge(data: Optionalize<RawUser>): User;
}
export interface UserManagerOptions {
    users: CacheCollection<User, RawUser>;
}
//# sourceMappingURL=UserManager.d.ts.map