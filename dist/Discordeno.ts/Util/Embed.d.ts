import { Embed as RawEmbed } from "discordeno/transformers";
export declare class Embed {
    title: string | undefined;
    description: string | undefined;
    fields: {
        inline?: boolean | undefined;
        name: string;
        value: string;
    }[];
    thumbnail: {
        proxyUrl?: string | undefined;
        height?: number | undefined;
        width?: number | undefined;
        url: string;
    } | undefined;
    image: {
        proxyUrl?: string | undefined;
        height?: number | undefined;
        width?: number | undefined;
        url: string;
    } | undefined;
    author: {
        url?: string | undefined;
        iconUrl?: string | undefined;
        proxyIconUrl?: string | undefined;
        name: string;
    } | undefined;
    color: number | undefined;
    timestamp: number | undefined;
    footer: {
        iconUrl?: string | undefined;
        proxyIconUrl?: string | undefined;
        text: string;
    } | undefined;
    url: string | undefined;
    constructor(options: RawEmbed);
    setTitle(title: string | undefined): this;
    setDescription(description: string | undefined): this;
    setThumbnail(thumbnail: {
        proxyUrl?: string | undefined;
        height?: number | undefined;
        width?: number | undefined;
        url: string;
    } | undefined): this;
    setImage(image: {
        proxyUrl?: string | undefined;
        height?: number | undefined;
        width?: number | undefined;
        url: string;
    } | undefined): this;
    setAuthor(author: {
        url?: string | undefined;
        iconUrl?: string | undefined;
        proxyIconUrl?: string | undefined;
        name: string;
    } | undefined): this;
    setColor(color: number | undefined | string): this;
    setTimestamp(timestamp: number): this;
    setFooter(footer: {
        iconUrl?: string | undefined;
        proxyIconUrl?: string | undefined;
        text: string;
    } | undefined): this;
    setURL(url: string | undefined): this;
    addField(field: {
        inline?: boolean | undefined;
        name: string;
        value: string;
    }): this;
    addFields(...fields: {
        inline?: boolean | undefined;
        name: string;
        value: string;
    }[]): this;
    static flatFields(...fields: {
        inline?: boolean | undefined;
        name: string;
        value: string;
    }[][]): {
        inline?: boolean | undefined;
        name: string;
        value: string;
    }[];
    toJSON(): RawEmbed;
}
//# sourceMappingURL=Embed.d.ts.map