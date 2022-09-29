import { OverwriteReadable } from "discordeno/types";
import { AttachmentBlobFormat, permissionOverwrites } from "../types/shared";
export declare function transformOptions<V>(options: object | string, defaults?: {
    content?: Boolean;
    reason?: Boolean;
}): V;
export declare function transformAttachments(attachments: AttachmentBlobFormat): {
    blob: any;
    name: string;
}[];
export declare function transformPermissionOverwrites(permissionOverwrites: permissionOverwrites[]): OverwriteReadable[];
//# sourceMappingURL=transformOptions.d.ts.map