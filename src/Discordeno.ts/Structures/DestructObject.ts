
export class DestructObject {
    _raw: object;
    constructor(message: object = {}, removeFields = {}) {
      this._raw = message;
      this.destructObject(message, removeFields);
    }
    destructObject(message: object, removeFields: {[x:string]: any}) {
      for (let [key, value] of Object.entries(message)) {
        if (!removeFields[key]) {
          // @ts-expect-error
          this[key] = value;
          // Add toggles to base level
          if(key === 'toggles') {
              // @ts-expect-error
            for (let [toggleKey, toggleValue] of Object.entries(this[key].list())) {
              // @ts-expect-error
              this[toggleKey] = toggleValue;
            }
          }
        } else {
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