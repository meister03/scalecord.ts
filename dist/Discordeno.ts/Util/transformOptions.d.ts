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
export declare function transformApplicationCommand(options: any): any;
export declare function transformApplicationCommandOptions(options: any): any;
//# sourceMappingURL=transformOptions.d.ts.map