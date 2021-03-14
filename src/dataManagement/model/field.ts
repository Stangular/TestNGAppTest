import { IElementDefinition, IElementModel, ElementModel, ElementFilter, SortOrder } from './definitions/ElementDefinition';
import { IRecord } from './records';
import { ISequenceNavigator } from './sequencing/sequenceNavigator';
import { IValidator } from './definitions/Validation';

export abstract class Field<T> implements ISequenceNavigator<T>, IElementDefinition{

  private _page = 0;

  constructor(
    protected _element: IElementDefinition,
    protected _dataPage: T[] = [],
    protected _dataID = '') { }

  //public get FieldId(): string {
  //  return this._fieldId;
  //}

  //public get Data() {
  //  return this._dataPage;
  //}

  get PageSize() { return this._dataPage.length; }
  get DataID() { return this._dataID; }

  SelectedIndex(): number { return this._page; }
  SelectItem(v: T): boolean {
    return this.Goto(this._dataPage.findIndex(p => p == v));
  }

  First(): boolean {
    return this.Goto(1);
  };

  Final(): boolean {
    return this.Goto(this._dataPage.length - 1);
  }

  Next(): boolean {
    return this.Goto(this._page + 1);
  }

  Previous(): boolean {
    return this.Goto(this._page - 1);
  }

  Goto(index: number) {
    if (index <= 1 || index >= this._dataPage.length) {
      return false;
    }
    this._page = index;
    return this.Update();
  }

  private Update() {
    let v = this._dataPage[this._page];
    return this.UpdateCurrentValue(v,null);
  }

  public ValueIndex(value: T) {
    return this._dataPage.findIndex(v => v === value);
  }

  abstract Value(recordNumber: number): T;

  //OutputValue(recordNumber: number) {
  //  return this.Value(recordNumber);
  //}

  AddNew(fieldDef: IElementModel): void {
    if (fieldDef) {
      this._dataPage.push(fieldDef.DefaultValue());
    }
  }

  RemoveLast(): void {

    this._dataPage.pop();
  }

  Copy(recordNumber: number) {
    this._dataPage.push(this._dataPage[recordNumber]);
  }

 
  //get FormID(): number { return this._element.; }
  get ElementID(): number { return this._element.ElementID; }
  get ElementName(): string { return this._element.ElementName; }

  InitialValue(): any { return this._element.InitialValue(); }
  CurrentValue(): any { return this._element.CurrentValue(); }

  init(): void { return this._element.init(); }
  Clean(): void { return this._element.Clean(); }
  ResetToDefault(defaultValue: any): void { return this._element.ResetToDefault(defaultValue); }
  SetInitialValue(v: any,validator: IValidator): boolean { return this._element.SetInitialValue(v, validator); }
  UpdateCurrentValue(v: any,validator: IValidator): boolean { return this._element.UpdateCurrentValue(v, validator); }
  UpdateFromUI(validator: IValidator): any { return this._element.UpdateFromUI(validator); }
  //UIConvert(): any { return this._element.UIConvert(); }
  //UIValueConvert(value: any) { return this._element.UIValueConvert(value); }
  get IsDirty(): boolean { return this._element.IsDirty; }
  get EditMode(): boolean { return this._element.EditMode; }

}

export class BaseField extends Field<string> {

  constructor(
    element: IElementDefinition,
    dataPage: string[] = [],
    dataID = '') {
    super(element, dataPage, dataID);
  }

  public Value(recordNumber: number) {
    return this._dataPage[recordNumber];
  }

  //UpdateValue(value: any, recordNumber = 0) {
  //  this._dataPage[recordNumber] = value;
  //}
}

export class DateField extends Field<Date> {

  constructor(
    element: IElementDefinition,
    dataPage: Date[] = [],
    dataID = '') {
    super(element, dataPage, dataID);
  }

  public Value(recordNumber: number): Date {
    return new Date(this._dataPage[recordNumber]);
  }

  //UpdateValue(value: Date, recordNumber = 0) {
  //  this._dataPage[recordNumber] = value;
  //}
}
