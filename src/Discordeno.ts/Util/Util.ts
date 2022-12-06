import { COLORS, DISCORD_EPOCH } from "../types/shared";

export function getSnowFlake(id: string | bigint) {
  const snowflake = BigInt(id);
  return {
    timestamp: Number(snowflake >> 22n) + DISCORD_EPOCH,
    workerId: Number((snowflake >> 17n) & 0b11111n),
    binary: snowflake.toString(2).padStart(64, '0'),
    increment: Number(snowflake & 0b111111111111n),
    processId: Number((snowflake >> 12n) & 0b11111n),
  }

}

export function separateOverwrites(v: bigint) {
  return [Number(unpack64(v, 3)), unpack64(v, 2), unpack64(v, 0), unpack64(v, 1)]; // type , id, allow, deny
}

const Mask = (1n << 64n) - 1n;

export function unpack64(v: bigint, shift: number) {
  return (v >> BigInt(shift * 64)) & Mask;
};

export function pack64(v: bigint | string, shift: number) {
  const b = BigInt(v);
  if (b < 0 || b > Mask) throw new Error("should have been a 64 bit unsigned integer: " + v);
  return b << BigInt(shift * 64);
};

export function convertColor(color: string | number) {
  if (typeof color === 'string') {
      if (color === 'DEFAULT') return 0;
      if (color === 'RANDOM') return Math.floor(Math.random() * (0xffffff + 1));
      // @ts-expect-error
      color = COLORS[color] ?? parseInt(color.replace('#', ''), 16);
  } else if (Array.isArray(color)) {
      color = (color[0] << 16) + (color[1] << 8) + color[2];
  }
  return color as number;
}    

export function getEmoji(str: string){
  if (!str) return null;
  if(isBigInt(str)) str = `<:testname:${str}>`;
  if (str.includes('%')) return decodeURIComponent(str);
  if (!str.includes(':')) return { animated: false, name: str, id: null };
  // @ts-expect-error
  const [_, animated, name, id] = /^<(a?):([a-z0-9_-]{2,}):(\d{21})>/i.exec(str)
  return { animated: new Boolean(animated), name, id } as {animated?: Boolean, name?: string, id: string};
}

function isBigInt(v: any) {
  try{
      v = BigInt(v);
      return true;
  }catch(e){
      return false;
  }
}