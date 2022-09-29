import { Interaction as RawInteraction } from "discordeno/transformers";
import { CacheCollection } from "../Structures/CacheCollection";
import { Interaction } from "../Structures/Interaction";
import { CacheBot } from "./CacheManager";
export declare class InteractionManager {
    client: CacheBot;
    cache: CacheCollection<Interaction, RawInteraction>;
    constructor(client: CacheBot, options: InteractionManagerOptions);
    forge(data: RawInteraction): Interaction;
}
export interface InteractionManagerOptions {
    interactions: CacheCollection<Interaction, RawInteraction>;
}
//# sourceMappingURL=InteractionManager.d.ts.map