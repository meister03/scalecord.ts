/// <reference types="node" />
export declare const DISCORD_EPOCH = 1420070400000;
export declare type AttachmentBlobFormat = {
    name: string;
    attachment: Buffer;
    blob?: Buffer;
}[];
export declare type permissionOverwrites = {
    id: bigint;
    type: permissionOverwritesTypes | string | number;
    allow?: string[];
    deny?: string[];
};
export declare enum permissionOverwritesTypes {
    'role' = 0,
    'member' = 1
}
export declare const COLORS: {
    DEFAULT: number;
    AQUA: number;
    WHITE: number;
    BLUE: number;
    GREEN: number;
    PURPLE: number;
    YELLOW: number;
    ORANGE: number;
    GOLD: number;
    NAVY: number;
    RED: number;
    GREY: number;
    GREYPLE: number;
    BLURPLE: number;
};
//# sourceMappingURL=shared.d.ts.map