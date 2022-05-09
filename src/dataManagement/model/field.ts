import { IElementDefinition, IElementModel, ElementModel, ElementFilter, SortOrder, ElementModelFactory } from './definitions/ElementDefinition';
import { IRecord } from './records';
import { ISequenceNavigator } from './sequencing/sequenceNavigator';
import { IValidator, Validation } from './definitions/Validation';

export abstract class Field<T> implements ISequenceNavigator<T>, IElementDefinition{

  private _page = 0;
  protected _dataPage: T[] = [];
  private filter: ElementFilter<T>;

  constructor(
    protected _element: IElementDefinition,
    dataID) {
      this.filter = new ElementFilter(dataID);
    }

  //public get FieldId(): string {
  //  return this._fieldId;
  //}

  //public get Data() {
  //  return this._dataPage;
  //}



  get PageSize() { return this._dataPage.length; }
  get DataID() { return this.filter.DataId; }

  SelectedIndex(): number { return this._page; }
  SelectItem(v: T): boolean {
    return this.Goto(this._dataPage.findIndex(p => p == v));
  }

  GetOutputContent(modelFactory: ElementModelFactory) {
    let model = modelFactory.GetElementModel(this.ModelID);
    let v = this.CurrentValue();
    model.UIValueConvert(v);
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
    if (index < 0 || index >= this._dataPage.length) {
      return false;
    }
    this._page = index;
    this.Update();
    return true;
  }

  private Update() {
    let v = this._dataPage[this._page];
    let r = this.SetInitialValue(v || null);
  }


  //Value(index: number,defaultValue: any) {
  //  if (index < 0 || index >= this._dataPage.length) {
  //    return defaultValue;
  //  }
  //  return this._dataPage[index];
  //}

  public ValueIndex(value: T) {
    return this._dataPage.findIndex(v => v === value);
  }

  

  abstract Value(recordNumber: number): T;

  //OutputValue(recordNumber: number) {
  //  return this.Value(recordNumber);
  //}

  RefreshPage(datapage: any[] = []) {
    this._dataPage = [];
    this._dataPage = this._dataPage.concat(datapage);
    this.Update();
  }

  AddNew(model: IElementModel): void {
    this._dataPage.unshift(model.DefaultValue);
  }

  RemoveLast(): void {

    this._dataPage.pop();
  }

  Copy(recordNumber: number) {
    this._dataPage.push(this._dataPage[recordNumber]);
  }

  get Label() { return this._element.Label; }

  Clone(elmName: string, elmId: number) {
    return new BaseField(this._element.Clone(elmName, elmId), this.DataID);
  }


  get HasFilter(): boolean {
    return this.filter != null && (this.filter.LowerValue != null || this.filter.UpperValue != null);
  }

  get Filter(): ElementFilter<T> {
    return this.filter;
  }

  ToggleFilter() {
    if (this.filter) {
      return this.filter.Toggle();
    }
  }

  TurnFilterOff() {
    if (this.filter) {
      return this.filter.TurnOff();
    }
  }

  get FilterApplied(): boolean {
    if (this.filter) {
      return this.filter.Applied;
    }
    return false;
  }

  get Observable(): boolean {
    return this._element.Observable;
  }

  setFilter(fieldId: string, lowervalue: T, uppervalue: T, asContent: boolean = false) {
    this.filter.SetFilter(fieldId, lowervalue, uppervalue, asContent);
  }


  SortOrder(): SortOrder {
    if (!this.filter) {
      return SortOrder.unsorted;
    }
    return this.filter.Sort;
  }

  //get FormID(): number { return this._element.; }
  get ElementID(): number { return this._element.ElementID; }
  get ElementName(): string { return this._element.ElementName; }

  InitialValue(): any { return this._element.InitialValue(); }
  CurrentValue(): any { return this._element.CurrentValue(); }

  init(): void { return this._element.init(); }
  Clean(): void { return this._element.Clean(); }
  ResetToDefault(defaultValue: any): void { return this._element.ResetToDefault(defaultValue); }
  SetInitialValue(v: any) { this._element.SetInitialValue(v); }
  UpdateCurrentValue(v: any, validators: IValidator[] = []): Validation {
    let r = this._element.UpdateCurrentValue(v, validators);
    if (r && r.valid)
    {
      this._dataPage[this._page] = v;
    }
    return r;
  }

  UpdateFromUI(validator: IValidator[] = []): any {
    let r = this._element.UpdateFromUI(validator);
    this._dataPage[this._page] = r;
    return r;
  }
  //UIConvert(): any { return this._element.UIConvert(); }
  //UIValueConvert(value: any) { return this._element.UIValueConvert(value); }
  get IsDirty(): boolean { return this._element.IsDirty; }
  get EditMode(): boolean { return this._element.EditMode; }
  get ModelID(): number { return this._element.ModelID; }
}

export class BaseField extends Field<string> {

  constructor(
    element: IElementDefinition,
    dataID = '') {
    super(element, dataID);
  }

  public Value(recordNumber: number) {
    if (recordNumber < 0 || recordNumber >= this._dataPage.length) {
      return null;
    }
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
    super(element, dataID);
  }

  public Value(recordNumber: number): Date {
    if (recordNumber < 0 || recordNumber >= this._dataPage.length) {
      return null;
    }
    return new Date(this._dataPage[recordNumber]);
  }

  //UpdateValue(value: Date, recordNumber = 0) {
  //  this._dataPage[recordNumber] = value;
  //}
}
