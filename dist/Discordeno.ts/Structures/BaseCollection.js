"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCollection = void 0;
// @ts-nocheck
const discordeno_1 = require("discordeno");
class BaseCollection extends discordeno_1.Collection {
    convertKey;
    constructor(options = {}) {
        // @ts-expect-error
        super(null, options);
        this.convertKey = options.convertKey ?? false;
    }
    has(key) {
        if (typeof key === 'string' && this.convertKey)
            key = BigInt(key);
        return super.has(key);
    }
    get(key) {
        if (typeof key === 'string' && this.convertKey)
            key = BigInt(key);
        return super.get(key);
    }
    set(key, value, options) {
        if (typeof key === 'string' && this.convertKey)
            key = BigInt(key);
        if (options?.forceSet)
            return super.forceSet(key, value);
        return super.set(key, value);
    }
    delete(key) {
        if (typeof key === 'string' && this.convertKey)
            key = BigInt(key);
        return super.delete(key);
    }
    first() {
        return super.get([...super.keys()][0]);
    }
    last() {
        return super.get([...super.keys()][super.size - 1]);
    }
}
exports.BaseCollection = BaseCollection;
