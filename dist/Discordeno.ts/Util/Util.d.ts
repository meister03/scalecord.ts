export declare function getSnowFlake(id: string | bigint): {
    timestamp: number;
    workerId: number;
    binary: string;
    increment: number;
    processId: number;
};
export declare function separateOverwrites(v: bigint): (number | bigint)[];
export declare function unpack64(v: bigint, shift: number): bigint;
export declare function pack64(v: bigint | string, shift: number): bigint;
export declare function convertColor(color: string | number): number;
export declare function getEmoji(str: string): string | {
    animated?: Boolean | undefined;
    name?: string | undefined;
    id: string;
} | {
    animated: boolean;
    name: string;
    id: null;
} | null;
//# sourceMappingURL=Util.d.ts.map