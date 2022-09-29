import { Interaction as RawInteraction } from "discordeno/transformers";
import { CacheCollection } from "../Structures/CacheCollection";
import { Interaction } from "../Structures/Interaction";
import { CacheBot } from "./CacheManager";

export class InteractionManager {
    client: CacheBot;
    cache: CacheCollection<Interaction, RawInteraction>;
    constructor(client: CacheBot, options: InteractionManagerOptions){
        this.client = client;
        this.cache = options.interactions || new CacheCollection()
    }

    public forge(data: RawInteraction){
        return new Interaction(this.client, data);
    }
}

export interface InteractionManagerOptions {
    interactions: CacheCollection<Interaction, RawInteraction>
}