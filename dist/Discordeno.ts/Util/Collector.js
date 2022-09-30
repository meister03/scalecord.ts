"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collector = void 0;
const events_1 = require("events");
const mod_1 = require("../mod");
class Collector extends events_1.EventEmitter {
    event;
    client;
    eventListener;
    items;
    filter;
    max;
    _timeout;
    _collectFunction;
    timeout;
    constructor(event, options = {}) {
        super();
        this.event = event;
        this.client = options.client;
        // @ts-expect-error
        this.eventListener = options.listener || this.client?.eventListener;
        if (!this.eventListener)
            throw new Error("No event listener has been provided");
        this.items = new mod_1.BaseCollection();
        this.filter = options.filter || ((a) => true);
        this.max = options.max;
        this._timeout = options.timeout || options.time || 10000;
        this._collectFunction = this.collectFunction.bind(this);
        this.startCollector();
    }
    startCollector() {
        this.eventListener.on(this.event, this._collectFunction);
        this.timeout = setTimeout(() => {
            this.emit("end", this.items);
            this.eventListener.removeListener(this.event, this._collectFunction);
        }, this._timeout);
    }
    stop(options = {}) {
        if (options.emit === undefined)
            options.emit = true;
        clearTimeout(this.timeout);
        if (options.emit)
            this.emit("end", this.items);
        return this.eventListener.removeListener(this.event, this._collectFunction);
    }
    collectFunction(...args) {
        args.shift();
        if (this.filter(...args)) {
            if (this.max && this.items.size >= this.max) {
                return this.stop({ emit: true });
            }
            this.items.set(args[0].id, args[0]);
            this.emit("collect", ...args);
        }
    }
}
exports.Collector = Collector;
