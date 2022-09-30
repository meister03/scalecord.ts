import { EventEmitter } from 'events'
import { BaseCollection, CacheBot } from '../mod';
export class Collector extends EventEmitter {
    event: string;
    client: CacheBot | undefined;
    eventListener: any;
    items: any;
    filter: (...args: any[]) => Boolean;
    max: number | undefined;
    _timeout: any;
    _collectFunction: (...args: any[]) => any;
    timeout: NodeJS.Timeout | undefined;
    constructor(event: string, options: {
        time?: number | undefined, client?: CacheBot, listener?: EventEmitter, filter?: (...args: any[]) =>Boolean, max?: number, timeout?: number
} = {}) {
      super();
  
      this.event = event;
  
      this.client = options.client;

      // @ts-expect-error
      this.eventListener = options.listener || this.client?.eventListener;
      if(!this.eventListener) throw new Error("No event listener has been provided");
  
      this.items = new BaseCollection();
  
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
  
    stop(options: {emit?: Boolean} = {}) {
      if (options.emit === undefined) options.emit = true;
      clearTimeout(this.timeout);
      if (options.emit) this.emit("end", this.items);
      return this.eventListener.removeListener(this.event, this._collectFunction);
    }
  
    collectFunction(...args: any[]) {
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