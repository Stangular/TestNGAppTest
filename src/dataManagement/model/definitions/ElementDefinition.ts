import { IValidator, Validator } from './Validation';
import * as moment from 'moment';
import { ISequenceNavigator } from '../sequencing/sequenceNavigator';
import { Field } from '../field';

export interface IUpdateType {
  Update(type: IUpdateType): void;
  Copy(): IUpdateType;
}

export enum FilterType {
  none = 0,
  lessThan = 1,
  lessThanORequal = 2,
  equal = 3,
  greaterThanORequal = 4,
  greaterThan = 5,
  contains = 6,
  doesNotContain = 7
}

export enum SortOrder {
  unsorted = 0,
  ascending = 1,
  descending = 2
}

export class ElementFilter<T> {

  constructor() { }
  FieldId: string = '';
  Sort: SortOrder = SortOrder.unsorted;
  LowerValue: T;
  UpperValue: T;
  asContent: boolean = false;
  not: boolean = false;
  applied: boolean = false;

  Remove() {

    this.UpperValue = undefined;
    this.LowerValue = undefined;
    this.asContent = false;
    this.applied = false;
  }

  get Applied() {
    return this.applied;
  }

  TurnOff() {
    this.applied = false;
  }

  Toggle() {
    this.applied = !this.applied;
    return this.applied;
  }
}

export interface IElementModel {
  Name: string;
  HasFilter: boolean;
  Filter: ElementFilter<any>;
  setFilter(lowervalue: any, uppervalue: any, asContent: boolean);
  SetNextSortOrder(): void;
  SortOrder(): SortOrder;
  ToggleFilter();
  TurnFilterOff();
  FilterApplied: boolean;
  Type(): string;
  Observable(): boolean;
  Label: string;
  Mask(): number;
  DefaultValue: any;
  Validator: number;
  UIConvert(elmdef: IElementDefinition): any;
  UIValueConvert(value: any): any;

}

export class ElementModel<T> implements IElementModel{

  modelName: string = '';
  modelID: number = -1;
  observe: boolean = true;
  label: string = '';
  type: string = 'text';
  defaultValue: T;
  mask: number = 0; // RegExp[] = []; //or {ID:'',mask:RegExp[] = []}
  validator: number = 0;
  autoDirtyOnDefault: boolean = false;
  filter: ElementFilter<T> = new ElementFilter();

  constructor(model: ElementModel<T> = null) {
    if (model != null) {
      this.observe = model.observe;
      this.type = model.type;
      this.mask = model.mask;
      this.validator = model.validator;
      this.filter.UpperValue = model.filter.UpperValue;
      this.filter.LowerValue = model.filter.LowerValue;
      this.filter.asContent = model.filter.asContent;
      this.filter.Sort = model.filter.Sort;
      this.label = model.Label;
    }
  }

  get Name() { return this.modelName; }
  get Validator() { return this.validator }

  get Label() { return this.label; }

  get HasFilter(): boolean{
    return this.filter.LowerValue != null || this.filter.UpperValue != null;
  }

  get Filter() : ElementFilter<T> {
    //this.filter.FieldId = this.fieldID;
    return this.filter;
  }

  setFilter(lowervalue: T, uppervalue: T, asContent: boolean = false) {
    this.filter.LowerValue = lowervalue;
    this.filter.UpperValue = uppervalue;
    this.filter.asContent = asContent;
    this.filter.applied = lowervalue != undefined || uppervalue != undefined;
  }

  SetNextSortOrder(): void {
    switch (this.filter.Sort) {
      case SortOrder.unsorted: this.filter.Sort = SortOrder.ascending; break;
      case SortOrder.ascending: this.filter.Sort = SortOrder.descending; break;
      case SortOrder.descending: this.filter.Sort = SortOrder.unsorted; break;
    }
  }

  SortOrder(): SortOrder {
    return this.filter.Sort;
  }

  ToggleFilter() {
    return this.filter.Toggle();
  }

  TurnFilterOff() {
    this.filter.TurnOff();
  }

  get FilterApplied(): boolean {
    return this.filter.Applied;
  }

  Type(): string {
    return this.type;
  }

  Observable(): boolean {
    return this.observe;
  }

  Mask(): number {
    return this.mask;
  }

  get DefaultValue(): T {
    return this.defaultValue;
  }

  UIConvert(elmdef: IElementDefinition): any {
    return this.UIValueConvert(elmdef.CurrentValue());
  }

  UIValueConvert(value: T): T {
    let c: any;
    switch (this.Type()) {
      case 'date':
        c = moment(value).format("YYYY-MM-DD");
        break;
      default: c = value;
    }
    return value;
  }
}


export interface IElementDefinition {

  ElementID: number;
  ElementName: string;
  EditMode: boolean;
  InitialValue(): any;
  CurrentValue(): any;

  init(): void;
  IsDirty: boolean;
  Clean(): void;
  ResetToDefault(defaultValue: any): void;
//  validateValue(v: any): boolean;
  SetInitialValue(v: any, validator: IValidator): boolean;
  UpdateCurrentValue(v: any, validator: IValidator): boolean;
  UpdateFromUI(validator: IValidator): any;
};

export class EditElementDefinition<T> implements IElementDefinition {

  constructor(
    private elemName: string,
    private elemId: number,
    private modelId: number,
    protected _initialValue: T,
    protected _currentValue: T = _initialValue,
    private editMode: boolean = true) {}

  get ElementName(): string {
    return this.elemName;
  }

  get EditMode() : boolean { return this.editMode; }
  get ElementID(): number {
    return this.elemId;
  }

  get ModelID(): number {
    return this.modelId;
  }

  get IsDirty(): boolean {
    return this._currentValue != this._initialValue;
  }

  init(): void {}
  

  InitialValue(): T {
    return this._initialValue;
  }

  CurrentValue(): T {
    return this._currentValue || this.InitialValue();
  }

  ResetToDefault(defaultValue : T): void {
    this._initialValue = defaultValue;
    this._currentValue = this._initialValue;
  }

  Clean(): void {
    this._initialValue = this._currentValue;
  }

  UpdateFromUI(validator: IValidator): T {
    const elm: any = document.getElementById(this.ElementName); // <- Non-angular, but seems to work pretty well anyway....
    if (elm) {
      this.UpdateCurrentValue(elm.value,validator);
    }
    return this._currentValue;
  }

  //validateValue(v: T): boolean {
  //  let res = true;

  //  //for (let validator of this._model.validators) {
  //  //  if (!validator.validate(v.toString())) {
  //  //    res = false;
  //  //  }
  //  //}
  //  return res;
  //}

  SetInitialValue(v: T, validator: IValidator): boolean {
    let res = validator.validateValue(v);
    if (res) {
      this._initialValue = v;
      this._currentValue = this._initialValue;
    }
    return res;
  }

  UpdateCurrentValue(v: T, validator: IValidator): boolean {
    let res = validator.validateValue(v);
    if (res) {
      this._currentValue = v;
    }
    return res;
  }
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
