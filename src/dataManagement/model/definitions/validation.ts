export enum FilterType {
  none = 0,
  lessThan = 1,
  lessThanORequal = 2,
  equal = 3,
  greaterThanORequal = 4,
  greaterThan = 5,
  contains = 6,
  doesNotContain = 7,
  notEqual = 8
}

export class Validation {
  valid: boolean = true;
  message: string = '';
}

export interface IValidator {

  IsInvalid: boolean;
  validate(v: any): Validation;
}

export abstract class Validator<T> implements IValidator {

  protected validation: Validation = new Validation();

  constructor(
    message: string) {
    this.validation.message = message;
  }

  get IsInvalid():  boolean {
    return !this.validation.valid;
  }

  abstract validate(v: T): Validation;
}

export class PatternValidator<T> extends Validator<T> {

  constructor(
    message: string,
    private validPattern : string,
    private _regex?: RegExp) {
    super(message);
  }

  validate(v: T): Validation {
    let v1: string = (v + this.validPattern.slice(v.toString().length)).toString();
    if( this._regex.test(v1))
    {
      if(this.validation.valid == false){
        console.error("False to true!!!!!!!!")
      }
      this.validation.valid = true;
      console.error(v + ": Set to True   !!!!!!!!")
    }
    else{
      this.validation.valid = false;
      console.error(v + ": Set to False!!!!!!!!")
    }
  
    return this.validation;
  }
}

export class ValueValidator<T> extends Validator<T> {

  constructor(
    message: string,
    private value: T,
    private compare: FilterType) {
    super(message);
  }
  
  validate(v: T): Validation{
    let r = false;
    switch (this.compare) {
      case FilterType.equal: r = v === this.value; break;
      case FilterType.lessThan: r = v < this.value; break;
      case FilterType.greaterThan: r = v > this.value; break;
      case FilterType.lessThanORequal: r = v <= this.value; break;
      case FilterType.greaterThanORequal: r = v >= this.value; break;
      case FilterType.notEqual: r = v != this.value; break;
    }
    this.validation.valid = r;
    return this.validation;
  }
}

export class NumberValidator extends Validator<number> {

  constructor(
    message: string,
    private max: number,
    private min?: number) {
    super(message);
 }

  validate(v: number): Validation{
    this.validation.valid = (this.max > v && (!this.min || this.min < v));
    return this.validation;
  }
}
