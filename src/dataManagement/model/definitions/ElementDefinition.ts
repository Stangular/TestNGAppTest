import { IValidator } from './Validation';
import * as moment from 'moment';

export interface IUpdateType {
  Update(type: IUpdateType): void;
  Copy(): IUpdateType;
}


export enum FilterType {
  none = 0,
  greaterThan = 1,
  lessThan = 2,
  equal = 3,
  greaterThanORequal = 4,
  lessThanORequal = 5,
  contains = 6,
  doesNotContain = 7
}

export enum SortOrder {
  unsorted = 0,
  ascending = 1,
  descending = 2
}

export class ElementFilter<T> {

  constructor(private value: T, private filterType: FilterType, private sortOrder: SortOrder = SortOrder.unsorted) { }

  get Value() { return this.value; }
  get FilterType() { return this.filterType; }
  get SortOrder() { return this.sortOrder; }

  SetNextSortOrder() {
    switch (this.sortOrder) {
      case SortOrder.unsorted: this.sortOrder = SortOrder.ascending; break;
      case SortOrder.ascending: this.sortOrder = SortOrder.descending; break;
      case SortOrder.descending: this.sortOrder = SortOrder.unsorted; break;
    }
  }
  ResetFilter(value: T, filterType: FilterType) {
    this.value = value;
    this.filterType = filterType;
  }

  static get FilterList() {
    let filterTypes: string[] = [];
    filterTypes.push('less than');
    filterTypes.push('less than or equal to');
    filterTypes.push('equal to');
    filterTypes.push('greater than or equal to');
    filterTypes.push('greater than');
    filterTypes.push('contains');
    filterTypes.push('does not contain');
    return filterTypes;
  }
}

export class ElementModel<T>{

  formID: string = '';
  fieldID: string = '';
  observe: boolean = true;
  label = '';
  type: string = 'text';
  defaultValue: T;
  mask: number = 0; // RegExp[] = []; //or {ID:'',mask:RegExp[] = []}
  validator: number = 0;
  filterValue: T;
  filterType: FilterType = FilterType.none;
  sortOrder: SortOrder = SortOrder.unsorted;
  autoDirtyOnDefault: boolean = false;
  //filter: ElementFilter<T> = null;

  constructor(model: ElementModel<T> = null) {
    if (model != null) {
      this.formID = model.formID;
      this.fieldID = model.fieldID;
      this.observe = model.observe;
      this.label = model.label;
      this.type = model.type;
      this.mask = model.mask;
      this.validator = model.validator;
      this.filterType = model.filterType;
      this.filterValue = model.filterValue;
      this.sortOrder = model.sortOrder;
      //  this.filter = model.filter;
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
  // ResetToInvalid(): void;
  validateValue(v: T): boolean;
  SetInitialValue(v: T): boolean;
  UpdateCurrentValue(v: T): boolean;

  setFilter(value: T, filterType: FilterType);
  FilterValue(): T;
  FilterType(): FilterType;
  SortOrder(): SortOrder;
  SetNextSortOrder(): void;
  UIConvert(): void;

};

export class EditElementDefinition<T> implements IElementDefinition<T> {


  constructor(
    private _model: ElementModel<T>,
    protected _initialValue: T = _model.defaultValue,
    protected _currentValue: T = _initialValue
  ) {

    this.ResetToDefault();
  }


  //constructor(
  //  private _formID: string,
  //  private _fieldID: string,
  //  private _observe: boolean,
  //  protected _defaultValue: T,
  //  protected _initialValue: T = _defaultValue,
  //  protected _currentValue: T = _initialValue,
  //  private _label = '',
  //  private _type: string = 'text',
  //  private _mask: RegExp[] = [], //or {ID:'',mask:RegExp[] = []}
  //  private _validators: IValidator[] = []
  //) {

  //  if (!this._validators) {
  //    _validators = [];
  //  }
  //  this.ResetToDefault();
  //}

  //setFilter(value: T, filterType: FilterType) {
  //  if (this._model.filter) {
  //    this._model.filter.ResetFilter(value, filterType);
  //  }
  //  else {
  //    this._model.filter = new ElementFilter(value, filterType);
  //  }
  //}

  //filtersss(): ElementFilter<T> {
  //  return null;
  //}

  setFilter(value: T, filterType: FilterType) {
    this._model.filterValue = value;
    this._model.filterType = filterType;
  }

  FilterValue(): T {
    return this._model.filterValue;
  }

  FilterType(): FilterType {
    return this._model.filterType;
  }

  SetNextSortOrder(): void {
    switch (this._model.sortOrder) {
      case SortOrder.unsorted: this._model.sortOrder = SortOrder.ascending; break;
      case SortOrder.ascending: this._model.sortOrder = SortOrder.descending; break;
      case SortOrder.descending: this._model.sortOrder = SortOrder.unsorted; break;
    }
  }


  SortOrder(): SortOrder {
    return this._model.sortOrder;
  }

  init(): void {

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

    return this._initialValue !== this._currentValue || this.isNew();
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
  UIConvert() {
    let c:any;
    switch (this.Type()) {
      case 'date':
        c = moment(this._currentValue).format("YYYY-MM-DD");
        break;
      default: c = this._currentValue;
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
