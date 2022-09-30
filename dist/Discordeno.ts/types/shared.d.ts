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
export declare const JSONERRORS: {
    0: string;
    10001: string;
    10002: string;
    10003: string;
    10004: string;
    10005: string;
    10006: string;
    10007: string;
    10008: string;
    10009: string;
    10010: string;
    10011: string;
    10012: string;
    10013: string;
    10014: string;
    10015: string;
    10016: string;
    10020: string;
    10026: string;
    10027: string;
    10028: string;
    10029: string;
    10030: string;
    10031: string;
    10032: string;
    10033: string;
    10036: string;
    10038: string;
    10049: string;
    10050: string;
    10057: string;
    10059: string;
    10060: string;
    10062: string;
    10063: string;
    10065: string;
    10066: string;
    10067: string;
    10068: string;
    10069: string;
    10070: string;
    10071: string;
    10087: string;
    20001: string;
    20002: string;
    20009: string;
    20012: string;
    20016: string;
    20018: string;
    20022: string;
    20024: string;
    20028: string;
    20029: string;
    20031: string;
    20035: string;
    30001: string;
    30002: string;
    30003: string;
    30004: string;
    30005: string;
    30007: string;
    30008: string;
    30010: string;
    30013: string;
    30015: string;
    30016: string;
    30018: string;
    30019: string;
    30030: string;
    30031: string;
    30032: string;
    30033: string;
    30034: string;
    30035: string;
    30037: string;
    30038: string;
    30039: string;
    30040: string;
    30042: string;
    30046: string;
    30047: string;
    30048: string;
    30052: string;
    40001: string;
    40002: string;
    40003: string;
    40004: string;
    40005: string;
    40006: string;
    40007: string;
    40012: string;
    40032: string;
    40033: string;
    40041: string;
    40043: string;
    40060: string;
    40061: string;
    50001: string;
    50002: string;
    50003: string;
    50004: string;
    50005: string;
    50006: string;
    50007: string;
    50008: string;
    50009: string;
    50010: string;
    50011: string;
    50012: string;
    50013: string;
    50014: string;
    50015: string;
    50016: string;
    50017: string;
    50019: string;
    50020: string;
    50021: string;
    50024: string;
    50025: string;
    50026: string;
    50027: string;
    50028: string;
    50033: string;
    50034: string;
    50035: string;
    50036: string;
    50041: string;
    50045: string;
    50046: string;
    50054: string;
    50055: string;
    50068: string;
    50070: string;
    50074: string;
    50080: string;
    50081: string;
    50083: string;
    50084: string;
    50085: string;
    50086: string;
    50095: string;
    50097: string;
    50101: string;
    50109: string;
    50132: string;
    50138: string;
    50146: string;
    50600: string;
    60003: string;
    80004: string;
    90001: string;
    110001: string;
    130000: string;
    150006: string;
    160002: string;
    160004: string;
    160005: string;
    160006: string;
    160007: string;
    170001: string;
    170002: string;
    170003: string;
    170004: string;
    170005: string;
    170006: string;
    170007: string;
    180000: string;
    180002: string;
    200000: string;
    200001: string;
    220003: string;
};
//# sourceMappingURL=shared.d.ts.map