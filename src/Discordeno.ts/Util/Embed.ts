import { Embed as RawEmbed } from "discordeno/transformers";
import { EmbedTypes } from 'discordeno';
import { convertColor } from "./Util";

export class Embed {
  title: string | undefined;
  description: string | undefined;
  fields: { inline?: boolean | undefined; name: string; value: string; }[];
  thumbnail: { proxyUrl?: string | undefined; height?: number | undefined; width?: number | undefined; url: string; } | undefined;
  image: { proxyUrl?: string | undefined; height?: number | undefined; width?: number | undefined; url: string; } | undefined;
  author: { url?: string | undefined; iconUrl?: string | undefined; proxyIconUrl?: string | undefined; name: string; } | undefined;
  color: number | undefined;
  timestamp: number | undefined;
  footer: { iconUrl?: string | undefined; proxyIconUrl?: string | undefined; text: string; } | undefined;
  url: string | undefined;
  constructor(options: RawEmbed) {
    if(!options) options = {};
    this.title = options.title;
    this.description = options.description;
    this.thumbnail = options.thumbnail;
    this.image = options.image;
    this.author = options.author;
    this.color = options.color;
    this.timestamp = options.timestamp;
    this.footer = options.footer;
    this.url = options.url;
    this.fields = options.fields ?? [];
  }
  setTitle(title: string | undefined) {
    this.title = title;
    return this;
  }

  setDescription(description: string | undefined) {
    this.description = description;
    return this;
  }

  setThumbnail(thumbnail: { proxyUrl?: string | undefined; height?: number | undefined; width?: number | undefined; url: string; } | undefined) {
    if(typeof thumbnail === "string") thumbnail = {url: thumbnail};
    this.thumbnail = thumbnail;
    return this;
  }

  setImage(image: { proxyUrl?: string | undefined; height?: number | undefined; width?: number | undefined; url: string; } | undefined) {
    if(typeof image === "string") image = {url: image};
    this.image = image;
    return this;
  }

  setAuthor(author: { url?: string | undefined; iconUrl?: string | undefined; proxyIconUrl?: string | undefined; name: string; } | undefined) {
    if (typeof author !== "object") throw new Error("Author must be an object");
    this.author = author;
    return this;
  }

  setColor(color: number | undefined | string) {
    if(typeof color === "string") color = convertColor(color);
    this.color = color;
    return this;
  }

  setTimestamp(timestamp: number) {
    this.timestamp = timestamp ?? Date.now();
    return this;
  }

  setFooter(footer: { iconUrl?: string | undefined; proxyIconUrl?: string | undefined; text: string; } | undefined) {
    if (typeof footer !== "object") throw new Error("Footer must be an object");
    this.footer = footer;
    return this;
  }

  setURL(url: string | undefined) {
    this.url = url;
    return this;
  }

  addField(field: { inline?: boolean | undefined; name: string; value: string; }) {
    this.fields.push(field);
    return this;
  }

  addFields(...fields: { inline?: boolean | undefined; name: string; value: string; }[]) {
    this.fields.push(...Embed.flatFields(fields));
    return this;
  }

  static flatFields(...fields: { inline?: boolean | undefined; name: string; value: string; }[][]) {
    return fields.flat(2);
  }

  toJSON(): RawEmbed {
    const embedObject = {
      title: this.title,
      type: "rich" as EmbedTypes,
      description: this.description,
      color: typeof this.color === "string" ? convertColor(this.color) : this.color,
      timestamp: (this.timestamp ? new Date(this.timestamp).toISOString() : undefined) as any,
      thumbnail: this.thumbnail,
      image: this.image,
      fields: this.fields,
      url: this.url,
      author: this.author
        ? {
          name: this.author.name,
          url: this.author.url,
          // @ts-expect-error tripple format support
          iconUrl: this.author.icon_url || this.author.iconUrl || this.author.iconURL,
        }
        : undefined,
      footer: this.footer
        ? {
          text: this.footer.text,
          // @ts-expect-error tripple format support
          iconUrl: this.footer.icon_url || this.footer.iconUrl || this.footer.iconURL,
        }
        : undefined,
    };
    Object.assign(this, embedObject);
    return embedObject;
  }
}
