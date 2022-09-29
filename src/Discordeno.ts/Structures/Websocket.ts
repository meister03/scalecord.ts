import { Collection } from "discordeno";
import { createGatewayManager, Shard} from "discordeno/gateway";

export class FakeWebSocket {
    shards: Collection<number, Shard>;
    constructor(gateway: ReturnType<typeof createGatewayManager>) {
        this.shards = gateway.manager.shards;
    }

    get ping(){
        const pings = [...this.shards.values()].map(x => Date.now() - (x.heart.lastBeat as number));
        return pings.reduce((a, b) => a + b, 0) / pings.length;
    }

    getShards(){
        const shards = [...this.shards.values()].map(x => {
            return {
                status: getStatus(x),
                ping: Date.now() - (x.heart.lastBeat as number),
                ...x
            }
        })
        return shards;
    }
}

function getStatus(x: Shard){
    return x.state;
}