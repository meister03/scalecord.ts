import { ActionRow, ButtonComponent, ButtonStyles, InputTextComponent, MessageComponents, MessageComponentTypes, SelectMenuComponent, SelectOption, TextStyles } from "discordeno/types";
export declare class Component {
    type: MessageComponentTypes;
    custom_id: string;
    disabled: Boolean;
    style: TextStyles | ButtonStyles;
    label: string;
    emoji: {
        animated?: Boolean;
        name?: string;
        id: string;
    } | null;
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
    constructor(options: InputTextComponent | ButtonComponent | SelectMenuComponent);
    static CONSTANTS: {
        PRIMARY: number;
        SECONDARY: number;
        SUCCESS: number;
        DANGER: number;
        LINK: number;
        SHORT: number;
        PARAGRAPH: number;
        ACTION_ROW: number;
        BUTTON: number;
        SELECT_MENU: number;
        TEXT_INPUT: number;
    };
    setType(type: string | MessageComponentTypes): this;
    setCustomId(custom_id: string): this;
    setDisabled(disabled: Boolean): this;
    setRequired(required: Boolean): this;
    setStyle(style: string | TextStyles | ButtonStyles): this;
    setLabel(label: string): this;
    setEmoji(emoji: string): this;
    setUrl(url: string): this;
    setOptions(options: SelectOption[]): this;
    addOptions(...options: SelectOption[]): this;
    setValue(value: string): this;
    setPlaceholder(placeholder: string): this;
    setMinValues(min_values: number): this;
    setMaxValues(max_values: number): this;
    setMinLength(min_values: number): this;
    setMaxLength(max_values: number): this;
    setComponents(...components: ActionRow[]): this;
    addComponents(...components: any[]): this;
    toJSON(): MessageComponentTypes;
}
//# sourceMappingURL=Component.d.ts.map