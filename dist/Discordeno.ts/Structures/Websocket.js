"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocket = void 0;
class WebSocket {
    shards;
    constructor(gateway) {
        this.shards = gateway.manager.shards;
    }
    get ping() {
        const pings = [...this.shards.values()].map(x => Date.now() - x.heart.lastBeat);
        return pings.reduce((a, b) => a + b, 0) / pings.length;
    }
    getShards() {
        const shards = [...this.shards.values()].map(x => {
            return {
                status: getStatus(x),
                ping: Date.now() - x.heart.lastBeat,
                ...x
            };
        });
        return shards;
    }
}
exports.WebSocket = WebSocket;
function getStatus(x) {
    return x.state;
}
