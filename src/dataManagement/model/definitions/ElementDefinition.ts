import { IValidator } from './Validation';
import * as moment from 'moment';

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
  LowerValue: any;
  UpperValue: any;
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

export class ElementModel<T>{

  // userPermission: ePermission;  edit/view
  formID: string = '';
  fieldID: string = '';
  observe: boolean = true;
  label = '';
  type: string = 'text';
  defaultValue: T;
  mask: number = 0; // RegExp[] = []; //or {ID:'',mask:RegExp[] = []}
  validator: number = 0;
  autoDirtyOnDefault: boolean = false;
  filter: ElementFilter<T> = new ElementFilter();

  constructor(model: ElementModel<T> = null) {
    if (model != null) {
      this.formID = model.formID;
      this.fieldID = model.fieldID;
      this.observe = model.observe;
      this.label = model.label;
      this.type = model.type;
      this.mask = model.mask;
      this.validator = model.validator;
      this.filter.FieldId = model.fieldID;
      this.filter.UpperValue = model.filter.UpperValue;
      this.filter.LowerValue = model.filter.LowerValue;
      this.filter.asContent = model.filter.asContent;
      this.filter.Sort = model.filter.Sort;
    }
  }
}

export interface IElementDefinition<T> {

  FormID(): string;
  FieldID(): string;
  Observable(): boolean;
  Label(): string;
  Type(): string;
  //  InvalidValue(): T;
  DefaultValue(): T;
  InitialValue(): T;
  CurrentValue(): T;
  Mask(): number;

  init(): void;
  isNew(): boolean;
  isDirty(): boolean;
  Clean(): void;
  ResetToDefault(): void;
  validateValue(v: T): boolean;
  SetInitialValue(v: T): boolean;
  UpdateCurrentValue(v: T): boolean;
  UpdateFromUI(): T;
  setFilter(lowervalue: T, uppervalue: T, asContent: boolean);
  getFilter();
  SortOrder(): SortOrder;
  SetNextSortOrder(): void;
  UIConvert(): T;
  UIValueConvert(value: T): T;
  TurnFilterOff();
  FilterApplied: boolean;
  HasFilter: boolean;
  ToggleFilter();
};

export class EditElementDefinition<T> implements IElementDefinition<T> {


  constructor(
    private _model: ElementModel<T>,
    protected _initialValue: T = _model.defaultValue,
    protected _currentValue: T = _initialValue
  ) {
    this.ResetToDefault();
  }
  
  getFilter() {
    this._model.filter.FieldId = this._model.fieldID;
    return this._model.filter;
  }

  setFilter(lowervalue: T,uppervalue: T, asContent: boolean = false) {
    this._model.filter.LowerValue = lowervalue;
    this._model.filter.UpperValue = uppervalue;
    this._model.filter.asContent = asContent;
    this._model.filter.applied = lowervalue != undefined || uppervalue != undefined;
  }

  get HasFilter() {
    return this._model.filter.LowerValue != null || this._model.filter.UpperValue != null;
  }
  //FilterValue(): T {
  //  return this._model.;
  //}

  //FilterType(): FilterType {
  //  return this._model.filterType;
  //}

  SetNextSortOrder(): void {
    switch (this._model.filter.Sort) {
      case SortOrder.unsorted: this._model.filter.Sort = SortOrder.ascending; break;
      case SortOrder.ascending: this._model.filter.Sort = SortOrder.descending; break;
      case SortOrder.descending: this._model.filter.Sort = SortOrder.unsorted; break;
    }
  }

  get CloneModel() {
    return new ElementModel(this._model);
  }

  get Duplicate() {
    return new EditElementDefinition(this._model, this._currentValue);
  }

  SortOrder(): SortOrder {
    return this._model.filter.Sort;
  }

  init(): void {

  }

  ToggleFilter() {
    return this._model.filter.Toggle();
  }

  TurnFilterOff() {
    this._model.filter.TurnOff();
  }

  get FilterApplied() {
    return this._model.filter.Applied;
  }
  
  Label(): string {
    return this._model.label;
  }

  Type(): string {
    return this._model.type;
  }

  FormID(): string {
    return this._model.formID;
  }

  FieldID(): string {
    return this._model.fieldID;
  }

  Observable(): boolean {
    return this._model.observe;
  }

  Mask(): number {
    return this._model.mask;
  }

  DefaultValue(): T {
    return this._model.defaultValue;
  }

  InitialValue(): T {
    return this._initialValue || this.DefaultValue();
  }

  CurrentValue(): T {
    return this._currentValue || this.InitialValue();
  }

  isNew(): boolean {
    return (this._model.autoDirtyOnDefault
      && this.CurrentValue() == this.DefaultValue());
  }

  isDirty(): boolean {
    let isDirty = false;
    switch (this.Type()) {
      case 'date':
        let c = moment(this._currentValue).format("YYYY-MM-DD");
        let i = moment(this._initialValue).format("YYYY-MM-DD");
        isDirty = c != i;
        break;
      default: isDirty = this._initialValue !== this._currentValue;
    }
    return isDirty || this.isNew();
  }

  ResetToDefault(): void {
    this._initialValue = this.DefaultValue();
    this._currentValue = this._initialValue;
  }

  //  ResetToInvalid(): void {
  //       this._initialValue = this._defaultValue;
  //       this._currentValue = this._invalidValue;
  //    }

  Clean(): void {
    this._initialValue = this._currentValue;
  }

  UpdateFromUI(): T {
    const elm: any = document.getElementById(this.FieldID()); // <- Non-angular, but seems to work pretty well anyway....
    if (elm) {
      const v = this.Type() == 'number' ? parseInt(elm.value) : elm.value;
      this.UpdateCurrentValue(v);
    }
    return this._currentValue;
  }
  validateValue(v: T): boolean {
    let res = true;

    //for (let validator of this._model.validators) {
    //  if (!validator.validate(v.toString())) {
    //    res = false;
    //  }
    //}
    return res;
  }

  SetInitialValue(v: T): boolean {
    let res = this.validateValue(v);
    if (res) {
      this._initialValue = v;
      this._currentValue = this._initialValue;
    }
    return res;
  }

  UpdateCurrentValue(v: T): boolean {
    let res = this.validateValue(v);
    if (res) {
      this._currentValue = v;
    }
    return res;
  }
  /// Converts the currentValue if necessary for UI display.
  UIConvert(): T {
    let c: any;
    switch (this.Type()) {
      case 'date':
        c = moment(this._currentValue).format("YYYY-MM-DD");
        break;
      default: c = this._currentValue;
    }
    return c;
  }

  UIValueConvert(value: T): T {
    let c: any;
    switch (this.Type()) {
      case 'date':
        c = moment(value).format("YYYY-MM-DD");
        break;
      default: c = value;
    }
    return c;
  }
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
