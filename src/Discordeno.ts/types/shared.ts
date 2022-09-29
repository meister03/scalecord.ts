export const DISCORD_EPOCH = 1_420_070_400_000;
export type AttachmentBlobFormat = {name: string, attachment: Buffer, blob?: Buffer}[];
export type permissionOverwrites = {id: bigint, type: permissionOverwritesTypes | string | number, allow?: string[], deny?: string[]}
export enum permissionOverwritesTypes {
    'role',
    'member'
}

export const COLORS = {
    DEFAULT: 0x000000,
    AQUA: 0x1abc9c,
    WHITE: 0xffffff,
    BLUE: 0x3498db,
    GREEN: 0x57f287,
    PURPLE: 0x9b59b6,
    YELLOW: 0xfee75c,
    ORANGE: 0xe67e22,
    GOLD: 0xf1c40f,
    NAVY: 0x34495e,
    RED: 0xed4245,
    GREY: 0x95a5a6,
    GREYPLE: 0x99aab5,
    BLURPLE: 0x5865f2,
}