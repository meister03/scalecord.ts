import { OverwriteReadable } from "discordeno/types";
import { Permissions } from "../Structures/Permissions";
import { applicationCommandOptionsTypes, applicationCommandTypes, AttachmentBlobFormat, permissionOverwrites, permissionOverwritesTypes } from "../types/shared";
import { Blob } from 'buffer';
export function transformOptions<V>(options: object | string, defaults?: {content?: Boolean, reason?: Boolean}) {
    if (defaults?.content) {
        if (typeof options === "string") options = { content: options };
    }
    if (defaults?.reason) {
        if (typeof options === "string") options = { reason: options };
    }
    if (typeof options !== "object") options = { id: options };

    return options as V;
}

export function transformAttachments(attachments: AttachmentBlobFormat) {
    return attachments.map(a => {
        // @ts-expect-error
        const file = { blob: new Blob((a.blob ?? a.attachment)), name: a.name };
        return file;
    })
}


export function transformPermissionOverwrites(permissionOverwrites: permissionOverwrites[] ) {
    let isArray = true;
    if (!Array.isArray(permissionOverwrites)) {
        permissionOverwrites = [permissionOverwrites];
        isArray = false;
    }
    let result = permissionOverwrites.map((o: permissionOverwrites): OverwriteReadable => {
        if (typeof o.id === "string") o.id = BigInt(o.id);
        if (typeof o.type === "string") o.type = permissionOverwritesTypes[o.type as any] as string;
        if (!o.type) o.type = permissionOverwritesTypes.role;

        const p = { allow: [], deny: [], neutral: [] };

        if (o.allow) {
            o.allow.map(allow => {
                // @ts-expect-error
                new Permissions(0n).transform(allow) !== 0n ? p.allow.push(allow) : null;
                return allow;
            })

            o.allow = p.allow ?? [];
        } else o.allow = [];

        if (o.deny) {
            o.deny.map(deny => {
                // @ts-expect-error
                new Permissions(0n).transform(deny) !== 0n ? p.deny.push(deny) : null;
                return deny;
            })

            o.deny = p.deny ?? [];
        } else o.deny = [];

        // @ts-expect-error
        if (o.neutral) {
            // @ts-expect-error
            o.neutral.map(neutral => {
                // @ts-expect-error
                new Permissions(0n).transform(neutral) !== 0n ? p.neutral.push(neutral) : null;
                return neutral;
            })
            // @ts-expect-error
            o.neutral = p.neutral ?? [];
            // @ts-expect-error
        } else o.neutral = [];
        // @ts-expect-error
        return o;
    });
    // @ts-expect-error
    if (!isArray) result = result[0];
    return result;
}

// @ts-expect-error
export function transformApplicationCommand(options) {
    return {
        ...options,
        type: typeof options.type === "string" ? applicationCommandTypes[options.type] : options.type,
        options: options.options ? transformApplicationCommandOptions(options.options) : undefined
    }
}

// @ts-expect-error
export function transformApplicationCommandOptions(options) {
    
// @ts-expect-error
    return options.map(option => {
        return {
            ...option,
            type: typeof option.type === "string" ? applicationCommandOptionsTypes[option.type] : option.type,
            options: option.options ? transformApplicationCommandOptions(option.options) : undefined,
        }
    })
}

