import { ActionRow, ButtonComponent, ButtonStyles, InputTextComponent, MessageComponents, MessageComponentTypes,  SelectMenuComponent, SelectOption, TextStyles } from "discordeno/types";
import { getEmoji } from "./Util";

const Constants = {
    PRIMARY: 1,
    SECONDARY: 2,
    SUCCESS: 3,
    DANGER: 4,
    LINK: 5,
    SHORT: 1,
    PARAGRAPH: 2,

    ACTION_ROW: 1,
    BUTTON: 2,
    SELECT_MENU: 3,
    TEXT_INPUT: 4,
};

export class Component {
    type: MessageComponentTypes;
    custom_id: string;
    disabled: Boolean;
    style: TextStyles | ButtonStyles;
    label: string;
    emoji: {animated?: Boolean, name?: string, id: string} | null;
    url: string;
    options: SelectOption[];
    placeholder: string;
    min_values: number;
    max_values: number;
    components: MessageComponents;
    value: string;
    min_length: number;
    max_length: number;
    required: Boolean;
    constructor(options: InputTextComponent | ButtonComponent | SelectMenuComponent) {
        // @ts-expect-error
        if(!options) options = {};
        // @ts-expect-error
        this.type = typeof options.type === "string" ? Constants[options.type as string] : options.type;
        // @ts-expect-error
        this.custom_id = options.custom_id ?? options.customId;
        // @ts-expect-error
        this.disabled = options.disabled;
        // @ts-expect-error
        this.style = options.style;
        // @ts-expect-error
        this.label = options.label;
        // @ts-expect-error
        this.emoji = options.emoji;
        // @ts-expect-error
        this.url = options.url;
        // @ts-expect-error

        //Select Menu
        this.options = options.options ?? [];
        // @ts-expect-error
        this.placeholder = options.placeholder;
        // @ts-expect-error
        this.min_values = options.min_values ?? options.minValues;
        // @ts-expect-error
        this.max_values = options.max_values ?? options.maxValues;
        // @ts-expect-error

        //Action Row
        this.components = options.components ?? [];
        // @ts-expect-error

        //Modal
        this.value = options.value;
        // @ts-expect-error
        this.min_length = options.min_length ?? options.minLength;
        // @ts-expect-error
        this.max_length = options.max_length ?? options.maxLength;
        // @ts-expect-error
        this.required = options.required;
    }
    static CONSTANTS = Constants;

    setType(type: string | MessageComponentTypes) {
        if (typeof type === "string") {
            // @ts-expect-error
            this.type = Constants[type.toUpperCase()];
            if (!this.type) throw new Error(`Invalid Component Type: ${type}`);
        } else this.type = type;
        return this;
    }

    setCustomId(custom_id: string) {
        if (!this.url) this.custom_id = custom_id;
        return this;
    }

    setDisabled(disabled: Boolean) {
        this.disabled = disabled;
        return this;
    }

    setRequired(required: Boolean) {
        this.required = required;
        return this;
    }

    setStyle(style: string | TextStyles | ButtonStyles) {
        if (!this.url) {
            if (typeof style === "string") {
                // @ts-expect-error
                this.style = Constants[style.toUpperCase()];
                if (!this.style) throw new Error(`Invalid Button Style Type: ${this.type}`);
            } else this.style = style;
        }
        return this;
    }

    setLabel(label: string) {
        this.label = label;
        return this;
    }

    setEmoji(emoji: string) {
        if (typeof emoji !== "object") {
            this.emoji = getEmoji(emoji) as {animated?: Boolean, name?: string, id: string};
        } else this.emoji = emoji;
        return this;
    }

    setUrl(url: string) {
        this.url = url;
        this.style = 5;
        // @ts-expect-error
        this.custom_id = undefined;
        return this;
    }

    setOptions(options: SelectOption[]) {
        this.options = options;
        return this;
    }

    addOptions(...options: SelectOption[]) {
        options.forEach((c) => this.options.push(c));
        return this;
    }

    setValue(value: string) {
        if(value !== "" && value !== undefined){
            this.value = value;
        }
        return this;
    }

    setPlaceholder(placeholder: string) {
        this.placeholder = placeholder;
        return this;
    }

    setMinValues(min_values: number) {
        this.min_values = min_values;
        return this;
    }

    setMaxValues(max_values: number) {
        this.max_values = max_values;
        return this;
    }

    setMinLength(min_values: number) {
        this.min_length = min_values;
        return this;
    }

    setMaxLength(max_values: number) {
        this.max_length = max_values;
        return this;
    }

    setComponents(...components: ActionRow[]) {
        this.components = components;
        return this;
    }

    addComponents(...components: any[]) {
        components.forEach((c) => this.components.push(c));
        return this;
    }

    toJSON() {
        if (!this.type) throw new Error("Component must have a type");

        // @ts-expect-error
        const json: MessageComponentTypes = {
            type: this.type,
        };
        if (this.type === 1) {
            // @ts-expect-error
            json.components = this.components.map((c) => c.toJSON ? c.toJSON() : c).filter((c) => c?.type);
        }

        if (this.type === 2) {
            // @ts-expect-error
            json.customId = this.custom_id;
            // @ts-expect-error
            json.style = this.style;
            // @ts-expect-error
            json.label = this.label;
            // @ts-expect-error
            json.emoji = this.emoji;
            // @ts-expect-error
            json.url = this.url;
            // @ts-expect-error
            json.disabled = this.disabled;
        }

        if (this.type === 3) {
            // @ts-expect-error
            json.customId = this.custom_id;
            // @ts-expect-error
            json.options = this.options?.map((o: { emoji: any; }) => {
                if (typeof o.emoji === "object") return o;
                o.emoji = getEmoji(o.emoji);
                return o;
            });
            // @ts-expect-error
            json.placeholder = this.placeholder;
            // @ts-expect-error
            json.minValues = this.min_values;
            // @ts-expect-error
            json.maxValues = this.max_values ?? json.options.length;
            // @ts-expect-error
            json.disabled = this.disabled;
        }

        if (this.type === 4) {
            // @ts-expect-error
            json.customId = this.custom_id;
            // @ts-expect-error
            json.style = this.style;
            // @ts-expect-error
            json.label = this.label;
            // @ts-expect-error
            json.minLength = this.min_length;
            // @ts-expect-error
            json.maxLength = this.max_length;
            // @ts-expect-error
            json.required = this.required;
            // @ts-expect-error
            json.value = this.value;
            // @ts-expect-error
            json.placeholder = this.placeholder;
            
        }

        if (this.type === 5) {
            // @ts-expect-error
            json.customId = this.custom_id;
            // @ts-expect-error
            json.disabled = this.disabled;
        }
        return json;
    }
}