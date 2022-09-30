import { Collection, CreateGuildChannel, CreateMessage, CreateWebhook, ModifyChannel } from "discordeno";
import { Channel as RawChannel, Message as RawMessage, Role as RawRole } from "discordeno/transformers";
import { CacheBot } from "../Managers/CacheManager";
import { MessageManager } from "../Managers/MessageManager";
import { AttachmentBlobFormat } from "../types/shared";
import { transformAttachments, transformOptions, transformPermissionOverwrites } from "../Util/transformOptions";
import { separateOverwrites } from "../Util/Util";
import { BaseCollection } from "./BaseCollection";
import { CacheCollection } from "./CacheCollection";
import { DestructObject } from "./DestructObject";
import { Guild } from "./Guild";
import { Member } from "./Member";
import { Message } from "./Message";
import { PermissionOverwrites } from "./PermissionOverwrites";
import { Permissions } from "./Permissions";
import { Role } from "./Role";
import { Webhook } from "./Webhook";
export class Channel extends DestructObject {
    override _raw: RawChannel;
    guild: Guild;
    client: CacheBot;
    messages: MessageManager;
    constructor(client: CacheBot, data: RawChannel, options: { guild?: Guild, messages?: CacheCollection<Message, RawMessage> }) {
        super(data, { "permissionOverwrites": true });
        this.client = client;
        this._raw = data;
        this.guild = options.guild ?? this.client.guilds.forge({id: this.guildId} as any);
        this.messages = this.client.messages.forgeManager({ messages: options.messages, channel: this, guild: this.guild });
    }

    public async create(options: CreateGuildChannel & { reason?: string, guildId?: string }) {
        if (options.permissionOverwrites) {
            options.permissionOverwrites = transformPermissionOverwrites(options.permissionOverwrites);
        }
        const guildId = options.guildId || String(this.guild?.id);
        const channel = await this.client.helpers.createChannel(guildId, options);
        return this.client.channels.forge(channel, { guild: this.guild });
    }

    public async edit(options: ModifyChannel & { reason?: string, id?: string }) {
        if (options.permissionOverwrites) {
            options.permissionOverwrites = transformPermissionOverwrites(options.permissionOverwrites);
        }
        const channelId = options.id || String(this.id);
        const channel = await this.client.helpers.editChannel(channelId, options);
        return this.client.channels.forge(channel, { guild: this.guild });
    }

    public async delete(options: { id?: string, reason?: string }) {
        options = transformOptions(options);
        if (!options.id) options.id = String(this.id);
        await this.client.helpers.deleteChannel(options.id, options.reason);
        return true;
    }

    public async fetch(options: { id: string}) {
        options = transformOptions(options);
        if (!options.id) options.id = String(this.id);
        return this.client.channels.fetch(options) as Promise<Channel>;
    }

    public async send(options: CreateMessage & { files: AttachmentBlobFormat, attachments?: AttachmentBlobFormat, channelId?: string }) {
        options = transformOptions(options, { content: true });

        if (options.files || options.attachments) {
            options.file = transformAttachments( options.files || options.attachments);
        }

        if (!options.channelId) options.channelId = String(this.id);
        const msg = await this.client.helpers.sendMessage(options.channelId, options);
        return this.client.messages.forge(msg, { channel: this, guild: this.guild });
    }

    public async bulkDelete(options: { id: string | bigint }[] | string[] | bigint[], reason?: string) {
        const ids = options.map((x) => {
            if (typeof x === 'object') return String(x.id);
            else return String(x);
        });
        await this.client.helpers.deleteMessages(this.id, ids, reason)
        return true;
    }

    public get permissionOverwrites() {
        const cache = new Collection();

        this._permissionOverwrites?.forEach(x => {
            let [type, id, allow, deny] = separateOverwrites(x);

            // @ts-expect-error
            if (allow !== undefined) allow = new Permissions(allow as bigint).toArray();
            // @ts-expect-error
            if (deny !== undefined) deny = new Permissions(deny as bigint).toArray();

            // @ts-expect-error
            cache.set(String(id), new PermissionOverwrites(this.client, { type, id: String(id), allow, deny }, { channel: this }));
        })

        // @ts-expect-error
        return new PermissionOverwrites(this.client, {}, { channel: this, permissionOverwrites: cache });
    }

    permissionsFor(resource: Role | Member, type: 'role' | 'member', checkAdmin = true) {
        if (type !== 'role' && type !== 'member') throw new Error('The provided resource has to be one of the type: role, member');

        if (type === 'role') {
            if (checkAdmin && resource.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
                return new Permissions(Permissions.ALL).freeze();
            }

            const everyoneOverwrites = this.permissionOverwrites.cache.get(this.guild?.id);
            const roleOverwrites = this.permissionOverwrites.cache.get(resource.id);

            return resource.permissions
                .remove(everyoneOverwrites?.deny ?? 0n)
                .add(everyoneOverwrites?.allow ?? 0n)
                .remove(roleOverwrites?.deny ?? 0n)
                .add(roleOverwrites?.allow ?? 0n)
                .freeze();
        }

        if (type === 'member') {
            const member = resource;
            if (checkAdmin && member.id === this.guild?.ownerId) return new Permissions(Permissions.ALL).freeze();

            const roles = (member as Member).roles.cache;

            const rolePermissions = roles.map(role => role.permissions);

            const permissions = new Permissions(rolePermissions);

            if (checkAdmin && permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
                return new Permissions(Permissions.ALL).freeze();
            }

            // @ts-expect-error
            const overwrites = this.overwritesFor(member as Member, roles);

            return permissions
                .remove(overwrites.everyone?.deny ?? 0n)
                .add(overwrites.everyone?.allow ?? 0n)
                // @ts-expect-error
                .remove(overwrites.roles.length > 0 ? overwrites.roles.map(role => role.deny) : 0n)
                // @ts-expect-error
                .add(overwrites.roles.length > 0 ? overwrites.roles.map(role => role.allow) : 0n)
                .remove(overwrites.member?.deny ?? 0n)
                .add(overwrites.member?.allow ?? 0n)
                .freeze();
        }
    }

    // Credits to Discord.js v13 | https://github.com/discordjs/discord.js/blob/988a51b7641f8b33cc9387664605ddc02134859d/src/structures/GuildChannel.js#L166
    public overwritesFor(member: Member, roles?: BaseCollection<string,RawRole>) {
        // @ts-expect-error
        roles ??= member.roles.cache;
        const roleOverwrites = [];
        let memberOverwrites;
        let everyoneOverwrites;

        for (const overwrite of this.permissionOverwrites.cache.values()) {
            if (overwrite.id === this.guild?.id) {
                everyoneOverwrites = overwrite;
            } else if (roles?.has(overwrite.id)) {
                roleOverwrites.push(overwrite);
            } else if (overwrite.id === member.id) {
                memberOverwrites = overwrite;
            }
        }

        return {
            everyone: everyoneOverwrites,
            roles: roleOverwrites,
            member: memberOverwrites,
        };
    }

    public async createWebhook(options: CreateWebhook & { channelId?: string }) {
        if (!options.channelId) options.channelId = String(this.id);
        const webhook = await this.client.helpers.createWebhook(options.channelId, options);
        return new Webhook(this.client, webhook);
    }

    public async fetchWebhooks(channelId?: string) {
        if (!channelId) channelId = String(this.id);
        const webhooks = await this.client.helpers.getChannelWebhooks(channelId);
        const webhooksCollection = new Collection();
        webhooks.map(x => {
            webhooksCollection.set(x.id, new Webhook(this.client, x));
        });
        return webhooksCollection;
    }
}

export interface Channel extends Omit<RawChannel, 'permissionOverwrites'> {
    _permissionOverwrites: RawChannel['permissionOverwrites'];
}