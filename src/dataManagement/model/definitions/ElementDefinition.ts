import { IValidator, Validator, Validation, PatternValidator, FilterType, ValueValidator, NumberValidator } from './Validation';
import * as moment from 'moment';
import { ISequenceNavigator } from '../sequencing/sequenceNavigator';
import { Field } from '../field';

export interface IUpdateType {
  Update(type: IUpdateType): void;
  Copy(): IUpdateType;
}

export enum SortOrder {
  unsorted = 0,
  ascending = 1,
  descending = 2
}

export class ElementFilter<T> {

  constructor(private _dataID: string) { }

  Sort: SortOrder = SortOrder.unsorted;
  LowerValue: T;
  UpperValue: T;
  asContent: boolean = false;
  not: boolean = false;
  applied: boolean = false;
  ignore_upper: boolean = true;
  ignore_lower: boolean = true;
  new: boolean = false;

  Remove() {

    this.UpperValue = undefined;
    this.LowerValue = undefined;
    this.asContent = false;
    this.applied = false;
    this.ignore_upper = true;
    this.ignore_lower = true;
 }

  get Applied() {
    return this.applied;
  }

  SetFilter(fieldId: string, lowervalue: T, uppervalue: T, asContent: boolean = false) {

    this.LowerValue = lowervalue || undefined;
    this.UpperValue = uppervalue || undefined;
    this.asContent = asContent;
    this.applied = lowervalue != undefined || uppervalue != undefined;
    this.new = true;
  }

  ToggleUpper() {
    this.ignore_upper = !this.ignore_upper;
    this.new = true;
  }

  ToggleLower() {
    this.ignore_lower = !this.ignore_lower;
    this.new = true;
  }

  get ValueUpper() {
    if (!this.ignore_upper) { return undefined; }
    return this.UpperValue;
  }

  get ValueLower() {
    if (!this.ignore_lower) { return undefined; }
    return this.LowerValue;
  }

  TurnOff() {
    this.applied = false;
  }

  Toggle() {
    this.applied = !this.applied;
    return this.applied;
  }

  get DataId() {
    return this._dataID;
  }

  SetNextSortOrder(): void {
    switch (this.Sort) {
      case SortOrder.unsorted: this.Sort = SortOrder.ascending; break;
      case SortOrder.ascending: this.Sort = SortOrder.descending; break;
      case SortOrder.descending: this.Sort = SortOrder.unsorted; break;
    }
  }
}

export interface IElementModel {
  Name: string;
  Mask: string;
  IsInvalid: boolean;
  DefaultValue: any;
  Validators(): IValidator[];
  Validate(v: any): Validation;
  UIConvert(elmdef: IElementDefinition): any;
  UIValueConvert(value: any): any;
  ValueConvertForOutput(value: any): any;
  Type(): string;
  NextCharacterValidation(currentValue: string): Validation;
  GetElementDefinition(
    elemName: string,
    elemId: number,
    modelId: number,
    label: string,
    editMode: boolean): IElementDefinition;
}

export abstract class ElementModelBase implements IElementModel {

  _defaultValidation: Validation = new Validation();

  constructor(
    private modelName: string = '',
    protected defaultValue: any = null,
    private mask: string = "", // RegExp[] = []; //or {ID:'',mask:RegExp[] = []}
    private autoDirtyOnDefault: boolean = false,
    protected _validators: IValidator[] = []
  ) {
    //  this.mask = '/' + this.mask + '/g';
  }


  GetElementDefinition(
    elemName: string,
    elemId: number,
    modelId: number,
    label: string,
    editMode: boolean): IElementDefinition {
    return new EditElementDefinition(
      elemName,
      elemId,
      modelId,
      label,
      this.DefaultValue);
  }

  get Name() { return this.modelName; }

  get Mask(): string {
    return this.mask;
  }

  get DefaultValue(): any {
    return this.defaultValue;
  }

  UIConvert(elmdef: IElementDefinition): any {
    let vlu = this.UIValueConvert(elmdef.CurrentValue());
    return vlu;
  }

  SetToModel(model: ElementModel = null) {
    if (model != null) {
      //    this.observe = model.observe;
      //    this.type = model.type;
      this.mask = model.mask;
      //this.filter.UpperValue = model.filter.UpperValue;
      //this.filter.LowerValue = model.filter.LowerValue;
      //this.filter.asContent = model.filter.asContent;
      //this.filter.Sort = model.filter.Sort;
      //   this.label = model.Label;
    }
  }

  abstract UIValueConvert(value: any): any;
  abstract ValueConvertForOutput(value: any): any;
  abstract Type(): string;

  Validators(): IValidator[] {
    return this._validators;
  }

  get IsInvalid(): boolean {
    return this._validators.findIndex(v => v.IsInvalid) >= 0;
  }

  public Validate(v: any): Validation {
    let result: Validation = this._defaultValidation;
    if (!this._validators) { return result; }
    for (let i = 0; i < this._validators.length; i++) {
      result = this._validators[i].validate(v);
      if (!result.valid) {
        break;
      }
    }
    return result;
  }

  NextCharacterValidation(elementName: string): Validation {
    const elm: any = document.getElementById(elementName); // <- Non-angular, but seems to work pretty well anyway....
    if (!elm) {
      return this._defaultValidation;
    }

    let v = elm.value;
    let d = this.mask;
    let slice = d.slice(v.length);
    v += slice;
    return this.Validate(v);
  }

  //  let v = '';
  //  console.error(code);
  //  const elm: any = document.getElementById(elementName); // <- Non-angular, but seems to work pretty well anyway....
  //  if (!elm) {
  //    return true;
  //  }
  //  v = elm.value;
  //  let d = '01/01/2000';
  //  let slice = d.slice(v.length);
  //  v += slice;
  //  console.error(v);
  //  let r2 = v.match(/^(0?[1-9]|1[012])[\/\-\.](0?[1-9]|[12][0-9]|3[01])[\/\-\.]\d{4}$/g);
  ////  let x = '16/01/2013';
  ////  let r1 = x.match(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/g); //let currentLength = v.length;
  //  if (r2) {
  //    console.error(r2[0]);
  //  }
  //  return false;
  //}
}

export class ElementModel extends ElementModelBase {

  constructor(
    modelName: string = '',
    defaultValue: any = null,
    mask: string = "", // RegExp[] = []; //or {ID:'',mask:RegExp[] = []}
    autoDirtyOnDefault: boolean = false) {
    super(modelName,
      defaultValue,
      mask,
      autoDirtyOnDefault);
  }

  UIValueConvert(value: any): any { return value; }
  ValueConvertForOutput(value: any): any { return value; }
  Type() { return 'text' };

}

export class DateElementModel extends ElementModelBase {

  constructor(
    modelName: string = '',
    defaultValue: Date = new Date(),
    mask: string = '01/01/2001', // RegExp[] = []; //or {ID:'',mask:RegExp[] = []}
    autoDirtyOnDefault: boolean = false

  ) {
    super(modelName,
      defaultValue,
      mask,
      autoDirtyOnDefault);

    let v = moment(defaultValue).format('MM/DD/YYYY');
    this.defaultValue = moment(v).toDate();
    this._validators.push(new PatternValidator('Required Format: ' + mask, mask, /^(0?[1-9]|1[012])[\/\-\.](0?[1-9]|[12][0-9]|3[01])[\/\-\.]\d{4}$/));
  }

  UIValueConvert(value: string): any {
    let v = moment(value || '').format('MM/DD/YYYY');
    if (v.toLowerCase() == 'invalid date') {
      v = moment(this.defaultValue).format('MM/DD/YYYY');
    }
    return v;
  }

  ValueConvertForOutput(value: string): Date {
    if (!value) {
      return this.DefaultValue;
    }
    let v = moment(value);
    if (!v.isValid()) {
      return this.DefaultValue;
    }

    return v.toDate();
  }


  Type() { return 'text' };

  //  NextCharacterValidation(code: number, elementName: string): string {
  //    let v = '';

  //    const elm: any = document.getElementById(elementName); // <- Non-angular, but seems to work pretty well anyway....
  //    if (!elm) {
  //      return '';
  //    }
  //    v = elm.value;
  //    let r2 = v.match(/^(0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-]\d{4}$/g);
  ////    let x = '16/01/2013';
  //    let r1 = v.match(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/g); 
  // //   let d = new Date(x);

  //    //if (currentLength >= this.Mask.length) {
  //    //  return '';
  //    //}
  //    //let c = this.Mask[currentLength + 1];
  //    //if (c == '0' && code >= 48 && code <= 57 ) {
  //    //  return c;
  //    //}
  //    //if (c == 'A' && code >= 65 && code <= 90 ) {
  //    //  return c;
  //    //}
  //    //if (c == 'A' && code >= 97 && code <= 122 ) {
  //    //  return c;
  //    //}
  //    //let char = this.ConvertAsciiToChar(code);

  //    return '';
  //  }
}

export class NumberElementModel extends ElementModelBase {

  constructor(
    modelName: string = '',
    defaultValue: number = 0,
    mask: string = "",
    autoDirtyOnDefault: boolean = false

  ) {
    super(modelName,
      defaultValue,
      mask,
      autoDirtyOnDefault);

    this._validators.push(new NumberValidator('Required Range: 0 to 9999', 9999, 0));

  }

  UIValueConvert(value: string): string {
    return value;
  }

  ValueConvertForOutput(value: string): number {
    return parseInt(value);
  }

  Type() { return 'number' };
}

export class MoneyElementModel extends ElementModelBase {

  constructor(
    modelName: string = '',
    defaultValue: number = 0.0,
    mask: string = "",
    autoDirtyOnDefault: boolean = false

  ) {
    super(modelName,
      defaultValue,
      mask,
      autoDirtyOnDefault);
  }

  UIValueConvert(value: string): string {
    let c: any = value;
    return c;//.toFixed(2);
  }

  ValueConvertForOutput(value: string): number {
    return parseFloat(value);
  }

  Type() { return 'money' };
}

export class BooleanElementModel extends ElementModelBase {

  constructor(
    modelName: string = '',
    defaultValue: string = null,
    mask: string = "",
    autoDirtyOnDefault: boolean = false

  ) {
    super(modelName,
      defaultValue,
      mask,
      autoDirtyOnDefault);
  }

  UIValueConvert(value: string): string {
    return value;
  }

  ValueConvertForOutput(value: string): string {
    return value;
  }

  Type() { return 'check' };
}


export enum ModelType {
  Text = 0,
  Int = 1,
  Date = 2,
  Money = 3,
  Bool = 4
}

export class ElementModelFactory {

  private _models: IElementModel[] = [];

  constructor() {
    this._models.push(new ElementModel("text", ""));
    this._models.push(new NumberElementModel("integer", 0));
    this._models.push(new DateElementModel("date", new Date()));
    this._models.push(new MoneyElementModel("money", 0.0));
    this._models.push(new BooleanElementModel("bool", "f"));
  }

  GetElementModel(index: ModelType) {
    return this._models[index];
  }

  get TextModel() {
    return this._models[ModelType.Text];
  }

  get IntegerModel() {
    return this._models[ModelType.Int];
  }

  get DateModel() {
    return this._models[ModelType.Date];
  }

  get MoneyModel() {
    return this._models[ModelType.Money];
  }

  get BooleanModel() {
    return this._models[ModelType.Bool];
  }

  get IsInvalid() {
    return this._models.findIndex(m => m.IsInvalid) >= 0;
  }
}

export interface IElementDefinition {

  ElementID: number;
  ElementName: string;
  ModelID: number;
  EditMode: boolean;
  InitialValue(): any;
  CurrentValue(): any;
  Label: string;
  Clone(elmName: string, elmId: number): IElementDefinition;
  Observable: boolean;
  init(): void;
  IsDirty: boolean;
  Clean(): void;
  ResetToDefault(defaultValue: any): void;
  //  validateValue(v: any): boolean;
  SetInitialValue(v: any);
  UpdateCurrentValue(v: any, validator: IValidator[]): Validation;
  UpdateFromUI(validator: IValidator[]): any;
};

export class EditElementDefinition<T> implements IElementDefinition {


  // _defaultValidation: Validation = new Validation();
  constructor(
    private elemName: string,
    private elemId: number,
    private modelId: number,
    private label: string = '',
    protected _initialValue: T,
    protected _currentValue: T = _initialValue,
    private editMode: boolean = true,
    private observable: boolean = true) { }

  get ElementName(): string {
    return this.elemName;
  }

  Clone(elmName: string, elmId: number): IElementDefinition {
    return new EditElementDefinition(
      elmName, elmId,
      this.ModelID,
      this.Label,
      this.InitialValue,
      this.CurrentValue,
      this.EditMode);
  }
  get EditMode(): boolean { return this.editMode; }
  get ElementID(): number {
    return this.elemId;
  }
 // get Parent(): string { return this.parent;}
  get ModelID(): number {
    return this.modelId;
  }

  get Observable(): boolean {
    return this.observable;
  }

  get IsDirty(): boolean {
    return this._currentValue != this._initialValue;
  }

  init(): void { }


  InitialValue(): T {
    return this._initialValue;
  }

  CurrentValue(): T {
    return this._currentValue;
  }

  ResetToDefault(defaultValue: T): void {
    this._initialValue = defaultValue;
    this._currentValue = this._initialValue;
  }

  Clean(): void {
    this._initialValue = this._currentValue;
  }

  UpdateFromUI(validator: IValidator[] = []): T {
    const elm: any = document.getElementById(this.ElementName); // <- Non-angular, but seems to work pretty well anyway....
    if (elm) {
      this.UpdateCurrentValue(elm.value, validator);
    }
    return this._currentValue;
  }

  private Validate(v: T, validators: IValidator[] = []): Validation {
    let result: Validation = null; // this._defaultValidation;
    if (!validators) { return result; }
    for (let i = 0; i < validators.length; i++) {
      result = validators[i].validate(v);
      if (!result.valid) {
        break;
      }
    }
    return result;
  }

  SetInitialValue(v: T) {
    this._initialValue = v;
    this._currentValue = this._initialValue;
  }

  UpdateCurrentValue(v: T, validators: IValidator[] = []): Validation {

    let res = this.Validate(v, validators);
    if (!res || res.valid) {
      this._currentValue = v;
    }
    return res;
  }

  get Label() { return this.label; }



  /// Converts the currentValue if necessary for UI display.
  //UIConvert(): T {
  //  //let c: any;
  //  //switch (this.Type()) {
  //  //  case 'date':
  //  //    c = moment(this._currentValue).format("YYYY-MM-DD");
  //  //    break;
  //  //  default: c = this._currentValue;
  //  //}
  //  return this._currentValue;
  //}

  //UIValueConvert(value: T): T {
  //  //let c: any;
  //  //switch (this.Type()) {
  //  //  case 'date':
  //  //    c = moment(value).format("YYYY-MM-DD");
  //  //    break;
  //  //  default: c = value;
  //  //}
  //  return value;
  //}
};

//export class UpdateElementDefinition extends EditElementDefinition<IUpdateType> {

//    constructor(
//        formID: string,
//        fieldID: string,
//        observe: boolean,
//        label = '',
//        mask: RegExp[] = [], //or {ID:'',mask:RegExp[] = []}???
//        validators: IValidator[] = [],
//        defaultValue: IUpdateType,
//        invalidValue: IUpdateType,
//        initialValue?: IUpdateType,
//        currentValue?: IUpdateType) {

//        super(formID,
//            fieldID,
//            observe,
//            label,
//            mask,
//            validators,
//            defaultValue,
//            invalidValue,
//            initialValue,
//            currentValue);
//    }

//    isDirty(): boolean {
//        return (<Date><any>this._initialValue).getTime()
//            !== (<Date><any>this._currentValue).getTime();
//    }

//    ResetAllToDefault(): void {
//        let t = (<Date><any>this._defaultValue).getTime();
//        (<Date><any>this._currentValue).setTime(t);
//        (<Date><any>this._initialValue).setTime(t);
//    }

//    ResetToInvalid(): void {//https://stackoverflow.com/questions/18735178/casting-typescript-generics
//        let t = (<Date><any>this._defaultValue).getTime();
//        (<Date><any>this._initialValue).setTime((<Date><any>this._defaultValue).getTime());
//        (<Date><any>this._currentValue).setTime((<Date><any>this._invalidValue).getTime());
//    }

//    Clean(): void {
//        //if (this._dbtype === dbtype.date) {//https://stackoverflow.com/questions/18735178/casting-typescript-generics
//        //    let t = (<Date><any>this._initialValue).getTime();
//        //    (<Date><any>this._currentValue).setTime(t);
//        //} else {
//        this._initialValue = this._currentValue;
//        //}
//    }

//    validateValue(v: T): boolean {
//        let res = true;

//        for (let validator of this._validators) {
//            if (!validator.validate(v.toString())) {
//                res = false;
//            }
//        }
//        return res;
//    }

//    SetInitialValue(v: T): boolean {
//        let res = this.validateValue(v);
//        if (res) {
//            //if (this._dbtype === dbtype.date) {//https://stackoverflow.com/questions/18735178/casting-typescript-generics
//            //    let t = (<Date><any>v).getTime();
//            //    (<Date><any>this._initialValue).setTime(t);
//            //    (<Date><any>this._currentValue).setTime(t);
//            //} else if (this._dbtype === dbtype.update) {
//            //    (<IUpdateType><any>this._initialValue).Update((<IUpdateType><any>v));
//            //    (<IUpdateType><any>this._currentValue).Update((<IUpdateType><any>v));
//            //} else {
//            this._initialValue = v;
//            this._currentValue = this._initialValue;
//            //}
//        }
//        return res;
//    }

//    UpdateCurrentValue(v: T): boolean {
//        let res = this.validateValue(v);
//        if (res) {
//            //if (this._dbtype === dbtype.date) {//https://stackoverflow.com/questions/18735178/casting-typescript-generics
//            //    let t = (<Date><any>v).getTime();
//            //    (<Date><any>this._currentValue).setTime(t);
//            //} else if (this._dbtype === dbtype.update) {
//            //    (<IUpdateType><any>this._currentValue).Update((<IUpdateType><any>v));
//            //} else {
//            this._currentValue = v;
//            //}
//        }
//        return res;
//    }
//};

//export class ElementGroup {
//    // _elements : EditElementDefinition<T>[] = [];

//    AddElementDefinition<T>(formID: string,
//        fieldID: string,
//        observe: boolean,
//        label = '',
//        mask = '',
//        regex = '',
//        defaultValue: T,
//        initialValue?: T,
//        currentValue?: T) {


//    }
//}
