/// <reference types="node" />
/// <reference types="node" />
import { EventEmitter } from 'events';
import { CacheBot } from '../mod';
export declare class Collector extends EventEmitter {
    event: string;
    client: CacheBot | undefined;
    eventListener: any;
    items: any;
    filter: (...args: any[]) => Boolean;
    max: number | undefined;
    _timeout: any;
    _collectFunction: (...args: any[]) => any;
    timeout: NodeJS.Timeout | undefined;
    constructor(event: string, options?: {
        time?: number | undefined;
        client?: CacheBot;
        listener?: EventEmitter;
        filter?: (...args: any[]) => Boolean;
        max?: number;
        timeout?: number;
    });
    startCollector(): void;
    stop(options?: {
        emit?: Boolean;
    }): any;
    collectFunction(...args: any[]): any;
}
//# sourceMappingURL=Collector.d.ts.map