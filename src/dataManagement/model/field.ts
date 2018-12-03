import { IElementDefinition } from './definitions/elementDefinition';
import { IRecord } from './records';

export abstract class Field<T> {
  protected _data: any[] = [];
  protected _fieldId: string;
  protected _dataID = '';

  constructor(data: any) {
    this._fieldId = data.fieldID || '';
    this._data = data.values.concat([]);
  }

  public get FieldId(): string {
    return this._fieldId;
  }

  public get Data() {
    return this._data;
  }
  
  public ValueIndex(value: any) {
    return this._data.findIndex(v => v === value);
  }

  abstract Value(recordNumber: number): any;

  OutputValue(recordNumber: number) {
    return this.Value(recordNumber);
  }

  AddNew(fieldDef: IElementDefinition<T>): void {
    this._data.push(fieldDef.DefaultValue());
    //  fieldDef.ResetToInvalid();

  }

  Copy(recordNumber: number) {
    this._data.push(this._data[recordNumber]);
  }
}

export class BaseField extends Field<string> {

  constructor(data: any) {
    super(data);
  }

  public Value(recordNumber: number) {
    return this._data[recordNumber];
  }

  UpdateValue(value: any, recordNumber = 0) {
    this._data[recordNumber] = value;
  }
}

export class DateField extends Field<Date> {

  constructor(data: IRecord) {
    super(data);
  }

  public Value(recordNumber: number): Date {
    return new Date(this._data[recordNumber]);
  }

  UpdateValue(value: Date, recordNumber = 0) {
    this._data[recordNumber] = value.toString();
  }
}
