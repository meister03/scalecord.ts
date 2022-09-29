// @ts-nocheck
import { Collection } from "discordeno";

export class BaseCollection<k,v> extends Collection<k,v>{
    convertKey: any;
    constructor(options: {convertKey?: Boolean} = {}){
        // @ts-expect-error
        super(null, options);
        this.convertKey = options.convertKey ?? false;
    }

    override has(key: string){
        if(typeof key === 'string' && this.convertKey) key = BigInt(key);
        return super.has(key);
    }

    override get(key: string){
        if(typeof key === 'string' && this.convertKey) key = BigInt(key);
        return super.get(key);
    }

    override set(key: string, value: any, options?: { forceSet?: any; }){
        if(typeof key === 'string' && this.convertKey) key = BigInt(key);
        if(options?.forceSet) return super.forceSet(key, value);
        return super.set(key, value);
    }

    override delete(key: string){
        if(typeof key === 'string' && this.convertKey) key = BigInt(key);
        return super.delete(key);
    }

    override first(){
        return super.get([...super.keys()][0]);
    }

    override last(){
        return super.get([...super.keys()][super.size - 1]);
    }
}