"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmoji = exports.convertColor = exports.pack64 = exports.unpack64 = exports.separateOverwrites = exports.getSnowFlake = void 0;
const shared_1 = require("../types/shared");
function getSnowFlake(id) {
    const snowflake = BigInt(id);
    return {
        timestamp: Number(snowflake >> 22n) + shared_1.DISCORD_EPOCH,
        workerId: Number((snowflake >> 17n) & 31n),
        binary: snowflake.toString(2).padStart(64, '0'),
        increment: Number(snowflake & 4095n),
        processId: Number((snowflake >> 12n) & 31n),
    };
}
exports.getSnowFlake = getSnowFlake;
function separateOverwrites(v) {
    return [Number(unpack64(v, 3)), unpack64(v, 2), unpack64(v, 0), unpack64(v, 1)]; // type , id, allow, deny
}
exports.separateOverwrites = separateOverwrites;
const Mask = (1n << 64n) - 1n;
function unpack64(v, shift) {
    return (v >> BigInt(shift * 64)) & Mask;
}
exports.unpack64 = unpack64;
;
function pack64(v, shift) {
    const b = BigInt(v);
    if (b < 0 || b > Mask)
        throw new Error("should have been a 64 bit unsigned integer: " + v);
    return b << BigInt(shift * 64);
}
exports.pack64 = pack64;
;
function convertColor(color) {
    if (typeof color === 'string') {
        if (color === 'DEFAULT')
            return 0;
        if (color === 'RANDOM')
            return Math.floor(Math.random() * (0xffffff + 1));
        // @ts-expect-error
        color = shared_1.COLORS[color] ?? parseInt(color.replace('#', ''), 16);
    }
    else if (Array.isArray(color)) {
        color = (color[0] << 16) + (color[1] << 8) + color[2];
    }
    return color;
}
exports.convertColor = convertColor;
function getEmoji(str) {
    if (!str)
        return null;
    if (isBigInt(str))
        str = `<:testname:${str}>`;
    if (str.includes('%'))
        return decodeURIComponent(str);
    if (!str.includes(':'))
        return { animated: false, name: str, id: null };
    // @ts-expect-error
    const [_, animated, name, id] = /^<(a?):([a-z0-9_-]{2,}):(\d{18})>/i.exec(str);
    return { animated: new Boolean(animated), name, id };
}
exports.getEmoji = getEmoji;
function isBigInt(v) {
    try {
        v = BigInt(v);
        return true;
    }
    catch (e) {
        return false;
    }
}
