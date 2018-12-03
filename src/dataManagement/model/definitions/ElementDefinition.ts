import { IValidator } from './Validation';

export interface IUpdateType {
  Update(type: IUpdateType): void;
  Copy(): IUpdateType;
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

  constructor(model: ElementModel<T> = null) {
    if (model != null) {
      this.formID = model.formID;
      this.fieldID = model.fieldID;
      this.observe = model.observe;
      this.label = model.label;
      this.type = model.type;
      this.mask = model.mask;
      this.validator = model.validator;
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
  //  DBType(): dbtype;
  Mask(): number;

  init(): void;
  isDirty(): boolean;
  Clean(): void;
  ResetToDefault(): void;
  // ResetToInvalid(): void;
  validateValue(v: T): boolean;
  SetInitialValue(v: T): boolean;
  UpdateCurrentValue(v: T): boolean;

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

  isDirty(): boolean {
    return this._initialValue !== this._currentValue;
  }

  ResetToDefault(): void {
    this._initialValue = this.DefaultValue();
    this._currentValue = this.DefaultValue();
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
