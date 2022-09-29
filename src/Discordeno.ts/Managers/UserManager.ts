import { User as RawUser } from "discordeno/transformers";
import { Optionalize } from "discordeno/types";
import { BaseCollection } from "../Structures/BaseCollection";
import { CacheCollection } from "../Structures/CacheCollection";
import { User } from "../Structures/User";
import { transformOptions } from "../Util/transformOptions";
import { CacheBot } from "./CacheManager";

export class UserManager {
    client: CacheBot;
    cache: CacheCollection<User, RawUser>;
    constructor(client: CacheBot, options: UserManagerOptions) {
        this.client = client;
        this.cache = options.users ?? new BaseCollection();
    }

    public async fetch(options: string | { id: string }) {
        const { id } = transformOptions(options) as { id: string };
        if (this.cache?.has(id)) return this.cache.get(id) as User;
        const user = await this.client.helpers.getUser(id);
        return this.forge(user);
    }

    public forge(data: Optionalize<RawUser>) {
        data = transformOptions(data);
        return new User(this.client, data);
    }
}

export interface UserManagerOptions {
    users: CacheCollection<User, RawUser>
}