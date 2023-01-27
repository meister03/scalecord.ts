"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
const Util_1 = require("./Util");
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
class Component {
    type;
    custom_id;
    disabled;
    style;
    label;
    emoji;
    url;
    options;
    placeholder;
    min_values;
    max_values;
    components;
    value;
    min_length;
    max_length;
    required;
    constructor(options) {
        // @ts-expect-error
        if (!options)
            options = {};
        // @ts-expect-error
        this.type = typeof options.type === "string" ? Constants[options.type] : options.type;
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
    setType(type) {
        if (typeof type === "string") {
            // @ts-expect-error
            this.type = Constants[type.toUpperCase()];
            if (!this.type)
                throw new Error(`Invalid Component Type: ${type}`);
        }
        else
            this.type = type;
        return this;
    }
    setCustomId(custom_id) {
        if (!this.url)
            this.custom_id = custom_id;
        return this;
    }
    setDisabled(disabled) {
        this.disabled = disabled;
        return this;
    }
    setRequired(required) {
        this.required = required;
        return this;
    }
    setStyle(style) {
        if (!this.url) {
            if (typeof style === "string") {
                // @ts-expect-error
                this.style = Constants[style.toUpperCase()];
                if (!this.style)
                    throw new Error(`Invalid Button Style Type: ${this.type}`);
            }
            else
                this.style = style;
        }
        return this;
    }
    setLabel(label) {
        this.label = label;
        return this;
    }
    setEmoji(emoji) {
        if (typeof emoji !== "object") {
            this.emoji = (0, Util_1.getEmoji)(emoji);
        }
        else
            this.emoji = emoji;
        return this;
    }
    setUrl(url) {
        this.url = url;
        this.style = 5;
        // @ts-expect-error
        this.custom_id = undefined;
        return this;
    }
    setOptions(options) {
        this.options = options;
        return this;
    }
    addOptions(...options) {
        options.forEach((c) => this.options.push(c));
        return this;
    }
    setValue(value) {
        if (value !== "" && value !== undefined) {
            this.value = value;
        }
        return this;
    }
    setPlaceholder(placeholder) {
        this.placeholder = placeholder;
        return this;
    }
    setMinValues(min_values) {
        this.min_values = min_values;
        return this;
    }
    setMaxValues(max_values) {
        this.max_values = max_values;
        return this;
    }
    setMinLength(min_values) {
        this.min_length = min_values;
        return this;
    }
    setMaxLength(max_values) {
        this.max_length = max_values;
        return this;
    }
    setComponents(...components) {
        this.components = components;
        return this;
    }
    addComponents(...components) {
        components.forEach((c) => this.components.push(c));
        return this;
    }
    toJSON() {
        if (!this.type)
            throw new Error("Component must have a type");
        // @ts-expect-error
        const json = {
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
            json.options = this.options?.map((o) => {
                if (typeof o.emoji === "object")
                    return o;
                o.emoji = (0, Util_1.getEmoji)(o.emoji);
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
exports.Component = Component;
