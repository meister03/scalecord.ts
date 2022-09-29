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
export declare enum applicationCommandTypes {
    'CHAT_INPUT' = 1,
    'USER' = 2,
    'MESSAGE' = 3
}
export declare enum applicationCommandOptionsTypes {
    'SUB_COMMAND' = 1,
    'SUB_COMMAND_GROUP' = 2,
    'STRING' = 3,
    'INTEGER' = 4,
    'BOOLEAN' = 5,
    'USER' = 6,
    'CHANNEL' = 7,
    'ROLE' = 8,
    'MENTIONABLE' = 9,
    'NUMBER' = 10,
    'ATTACHMENT' = 11
}
//# sourceMappingURL=shared.d.ts.map