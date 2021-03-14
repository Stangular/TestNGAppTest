export interface IValidator {

    Message: string;
    validate(v: any): boolean;
    validateValue(v: any): boolean;
}

export abstract class Validation implements IValidator {

    abstract validate(v: any): boolean;
    abstract get Message(): string;

    validateValue(
        v: any): boolean {
        let m = this.Message;
        if (!this.validate(v)) {
            if (m.length > 0) {
                return true;
                //  t.error(m, fieldName + ' is invalid');
            }
            return false;
        }
        return true;
    }
}
// This would simply be a default string validator
export class Validator extends Validation {

    constructor(
        private message = '',
        private _regex?: RegExp) {
        super();
    }

    get Message() {
        return this.message;
    }

    validate(v: string) {
        if (!this._regex) { return true; }
        if (!this._regex.test(v)) {
            return false;
        }
        return true;
    }
}

export class ValueValidator extends Validation {

    constructor(private message: string, private value: number, private compare: number) {
        super();
    }

    get Message() {
        return this.message;
    }

    validate(val: string) {
        let r = false;
        let v = parseInt(val);
        switch (this.compare) {
            case 0: r = v === this.value; break;
            case 1: r = v < this.value; break;
            case 2: r = v > this.value; break;
            case 3: r = v <= this.value; break;
            case 4: r = v >= this.value; break;
            case 5: r = v != this.value; break;
        }
        return r;
    }
}

export class NumberValidator extends Validation {

    constructor(private message: string, private max: number, private min?: number) {
        super();
    }

    get Message() {
        return this.message;
    }

    validate(v: string) {
        let y = parseInt(v);

        if (this.max < y) {
            return false;
        }
        if (this.min && this.min > y) {
            return false;
        }
        return true;
    }
}
