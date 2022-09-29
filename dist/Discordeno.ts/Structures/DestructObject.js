"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DestructObject = void 0;
class DestructObject {
    _raw;
    constructor(message = {}, removeFields = {}) {
        this._raw = message;
        this.destructObject(message, removeFields);
    }
    destructObject(message, removeFields) {
        for (let [key, value] of Object.entries(message)) {
            if (!removeFields[key]) {
                // @ts-expect-error
                this[key] = value;
                // Add toggles to base level
                if (key === 'toggles') {
                    // @ts-expect-error
                    for (let [toggleKey, toggleValue] of Object.entries(this[key].list())) {
                        // @ts-expect-error
                        this[toggleKey] = toggleValue;
                    }
                }
            }
            else {
                // @ts-expect-error
                this[`_${key}`] = value;
            }
        }
        return this;
    }
    toJSON() {
        return this._raw;
    }
}
exports.DestructObject = DestructObject;
