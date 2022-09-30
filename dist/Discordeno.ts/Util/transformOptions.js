"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformApplicationCommandOptions = exports.transformApplicationCommand = exports.transformPermissionOverwrites = exports.transformAttachments = exports.transformOptions = void 0;
const Permissions_1 = require("../Structures/Permissions");
const shared_1 = require("../types/shared");
const buffer_1 = require("buffer");
function transformOptions(options, defaults) {
    if (defaults?.content) {
        if (typeof options === "string")
            options = { content: options };
    }
    if (defaults?.reason) {
        if (typeof options === "string")
            options = { reason: options };
    }
    if (typeof options !== "object")
        options = { id: options };
    return options;
}
exports.transformOptions = transformOptions;
function transformAttachments(attachments) {
    return attachments.map(a => {
        // @ts-expect-error
        const file = { blob: new buffer_1.Blob((a.blob ?? a.attachment)), name: a.name };
        return file;
    });
}
exports.transformAttachments = transformAttachments;
function transformPermissionOverwrites(permissionOverwrites) {
    let isArray = true;
    if (!Array.isArray(permissionOverwrites)) {
        permissionOverwrites = [permissionOverwrites];
        isArray = false;
    }
    let result = permissionOverwrites.map((o) => {
        if (typeof o.id === "string")
            o.id = BigInt(o.id);
        if (typeof o.type === "string")
            o.type = shared_1.permissionOverwritesTypes[o.type];
        if (!o.type)
            o.type = shared_1.permissionOverwritesTypes.role;
        const p = { allow: [], deny: [], neutral: [] };
        if (o.allow) {
            o.allow.map(allow => {
                // @ts-expect-error
                new Permissions_1.Permissions(0n).transform(allow) !== 0n ? p.allow.push(allow) : null;
                return allow;
            });
            o.allow = p.allow ?? [];
        }
        else
            o.allow = [];
        if (o.deny) {
            o.deny.map(deny => {
                // @ts-expect-error
                new Permissions_1.Permissions(0n).transform(deny) !== 0n ? p.deny.push(deny) : null;
                return deny;
            });
            o.deny = p.deny ?? [];
        }
        else
            o.deny = [];
        // @ts-expect-error
        if (o.neutral) {
            // @ts-expect-error
            o.neutral.map(neutral => {
                // @ts-expect-error
                new Permissions_1.Permissions(0n).transform(neutral) !== 0n ? p.neutral.push(neutral) : null;
                return neutral;
            });
            // @ts-expect-error
            o.neutral = p.neutral ?? [];
            // @ts-expect-error
        }
        else
            o.neutral = [];
        // @ts-expect-error
        return o;
    });
    // @ts-expect-error
    if (!isArray)
        result = result[0];
    return result;
}
exports.transformPermissionOverwrites = transformPermissionOverwrites;
// @ts-expect-error
function transformApplicationCommand(options) {
    return {
        ...options,
        type: shared_1.applicationCommandTypes[options.type] || options.type,
        options: options.options ? transformApplicationCommandOptions(options.options) : undefined
    };
}
exports.transformApplicationCommand = transformApplicationCommand;
// @ts-expect-error
function transformApplicationCommandOptions(options) {
    // @ts-expect-error
    return options.map(option => {
        return {
            ...option,
            type: shared_1.applicationCommandOptionsTypes[option.type] || option.type,
            options: option.options ? transformApplicationCommandOptions(option.options) : undefined,
        };
    });
}
exports.transformApplicationCommandOptions = transformApplicationCommandOptions;
