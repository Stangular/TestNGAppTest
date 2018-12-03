import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { IElementDefinition, EditElementDefinition, } from './definitions/ElementDefinition';
import { IDataItem, DataItem, DataItems } from './data/dataitem';
import { IListNavigator } from './list/ListNavigator';
import { Field } from './field';
//import { D3AxisModel } from '../../d3/axis/d3.axis.model';

export interface IRecord {
  fieldID: string;
  values: any[];
}

export enum recordsError {
  none = 0,
  invalidIndex = 1,
  isDirty = 2
}
/// Allows for conversion between a user interface element ID and a field id from a database if they are different
export class Converter {

  constructor(private uiid: string, private dataid: string) { }

  public get UIID() {
    return this.uiid;
  }

  public get DataID() {
    return this.dataid;
  }
}

export class KeyValue<T> {
  key: string;
  value: T;
}

export class Hydrator {

  _values: any[] = [];

  SetValue<T>(key: string, value: T) {
    let h = this._values.find(v => v.key == key);
    if (!!h) {
      h.value = value;
      return true;
    } else {
      let kv = new KeyValue<T>();
      kv.key = key;
      kv.value = value;
      this._values.push(kv);
    }
    return false;
  }

  GetValue<T>(key: string, defaultValue: T) {
    let h = this._values.find(v => v.key == key);
    if (!!h) {
      return h.value;
    }
    return defaultValue;
  }

  get KeyList() {
    let list: string[] = [];
    this._values.forEach(v => list.push(v.key));
    return list;
  }
}

export interface IRecordService {
  Content: IRecordManager;
}


export interface IRecordManager {

  Form: FormGroup;
  GetFormDefinition(): void;
  // AsList(valueName?: string): IListItem[];
  IsValid(): boolean;
}

export abstract class Records<T> implements IRecordManager, IListNavigator<T> {

  protected _UIElements: IElementDefinition<any>[] = [];
  protected _childRecords: Records<T>[] = [];

  protected _form: FormGroup;
  private _selectedItem: number = -1;
  private _filter: { field: '', value: '' }[] = [];
  private _sort: { field: '', direction: boolean }[] = [];
  // private _lazyState : LazyState; ie {pageCount:0,pageSize:0,pageNumber:0,complete:boolean,filters:[]}

  constructor(private formName: string
    , protected _fields: Field<any>[] = []
    , private _recordCount = 0) {

    this._selectedItem = 0;
    this.createFormGroup();
  }

  public get FormElements(): IElementDefinition<any>[] {
    return this._UIElements;
  }

  abstract GetFormDefinition(): void;
  abstract New(data: any): Field<any>;
  abstract UpdateDependentUI(): void;
  abstract GetUIValue(fieldID: string): any;
  abstract get testData(): Field<any>[];

  private createFormGroup() {
    let group: any = {};
    this.GetFormDefinition();
    this._UIElements.forEach(e => {
      group[e.FieldID()] = new FormControl(e.CurrentValue() || '');
    });
    this._form = new FormGroup(group);
  }

  public Test() {
    if (this._fields.length <= 0) {
      this._fields = this.testData;
    }
  }

  public AddDependentRecord(records: Records<T>) {
    this._childRecords.push(records);
  }

  protected get UIElements(): IElementDefinition<any>[] {
    return this._UIElements;
  }

  public AddElementDefinition(elmdef: IElementDefinition<any>) {
    if (elmdef) {
      this._UIElements.push(elmdef);
      let c = new FormControl(elmdef.CurrentValue() || '');
      this._form.addControl(elmdef.FieldID(), c);
    }
  }

  get FormName(): string {
    return this.formName;
  }

  get Form(): FormGroup {
    return this._form;
  }

  get IsDirty(): boolean {

    return this._UIElements.some(e => e.isDirty())
      || this._childRecords.some(r => r.IsDirty);
  }

  IsValid(): boolean {
    return this._selectedItem >= 1;
  }

  get Count(): number {
    return this._recordCount;
  }

  NewRecord(): boolean {
    if (this.IsDirty) {// if the current record is dirty you do not want tit...
      return false; // isdirty   TODO: Dirty record message?
    }
    this._fields.forEach(f =>
      f.AddNew(this._UIElements
        .find(e => e.FieldID() == f.FieldId)));

    this._selectedItem = this._recordCount;
    this._recordCount = this._recordCount + 1;
    this.UpdateUI();
  }

  CopyRecord(recordNumber: number): boolean {
    if (this.IsDirty) {// if the current record is dirty you do not want tit...
      return false; // isdirty   TODO: Dirty record message?
    }

    this._fields.forEach(f => f.Copy(recordNumber));

    this._recordCount = this._recordCount + 1;
    return this.Final();
  }

  public LoadData(content: IRecord[] = [], converters: Converter[] = [], recordCount = 0) {
    let self = this;
    if (content.length <= 0) {
      this.Test();
      return;
    }
    this._recordCount = recordCount;
    content.forEach(function (c, i) {
      let fldID = c.fieldID;
      let convert = converters.find(x => x.DataID == fldID);
      if (!!convert) {
        fldID = convert.UIID;
        c.fieldID = fldID;
      }
      let fldElm = self._UIElements.find(e => e.FieldID() == fldID);
      if (!!fldElm) {
        self._fields.push(self.New(c));
        fldElm.ResetToDefault();
      }
    });
    return this.First();
  }

  public First(): boolean {
    return this.Goto(0);
  }

  public Final(): boolean {
    return this.Goto(this.Count - 1);
  }

  public Next(): boolean {
    return this.Goto(this._selectedItem + 1);
  }

  public Previous(): boolean {
    return this.Goto(this._selectedItem - 1);
  }

  public SelectItem<T>(value: T): boolean {
    return this.SelectItemByField('ID', value);
  }

  public SelectItemByField(fieldId: string, value: any): boolean {
    let fld = this._fields.find(f => f.FieldId == fieldId);
    if (!!fld) {
      return this.Goto(fld.ValueIndex(value));
    }
    return false;
  }

  protected Goto(index: number): boolean {
    if (index < 0 || index >= this.Count) {// invalid index...
      return false; // invalid
    }
    if (this.IsDirty) {// if the current record is dirty you do not want to leave it...
      console.log(index + ' is dirty');
      return false; // isdirty   TODO: Dirty record message?
    }
    this._selectedItem = index;
    this.UpdateUI();
    return true;
  }

  private UpdateUI(): void {
    let self = this;
    this._fields.forEach(f => this.InitUIField(f));
    this.UpdateDependentUI();
  }

  private InitUIField(field: Field<any>): void {

    if (!!field) {
      let elmdef = this._UIElements.find(e => e.FieldID() == field.FieldId);
      let contrl = this._form.controls[field.FieldId];
      elmdef.SetInitialValue(field.Value(this._selectedItem));
      contrl.setValue(elmdef.CurrentValue());
    }
  }

  //get DataAsJson() {
  //  let data: any [] = [];
  //  this._fields.forEach(function (f, i) {
  //    let x = f.FieldId;
  //    if( f.)
  //    x += f.Value(i);
  //  });
  //  return data;
  //}
  get Fields() {// TODO: change this so that derived classes emit formatted data as needed..
    return this._fields;
  }
  // update model from UI...
  UpdateModel(): void {
    let self = this;
    let fldElm;
    this._fields.forEach(function (f, i) {
      fldElm = self._UIElements.find(e => e.FieldID() == f.FieldId);
      fldElm.UpdateCurrentValue(self.GetUIValue(f.FieldId));
    });
  }

  public GetModelValue(fieldID: string, defaultValue: any) {
    let fld = this._UIElements.find(f => f.FieldID() == fieldID);
    if (!!fld) {
      return fld.CurrentValue();
    }
    return defaultValue;
  }

  SelectedIndex(): number {
    return this._selectedItem;
  }

  protected GetOutputContent() {
    let content = this._UIElements.map(f => {
      return {
        fieldID: f.FieldID()
        , values: [f.CurrentValue()]
      };
    });
    return content;
  }

  public GetAllValues(fieldID: string): any[] {
    let out: any[] = [];
    let field = this._fields.find(f => f.FieldId == fieldID);
    if (!!field) {
      for (let i = 0; i < this._recordCount; i = i + 1) {
        out.push(field.Value(i));
      }
    }
    return out;
  }

  public GetFieldValue(fieldID: string): any {
    let field = this._UIElements.find(e => e.FieldID() == fieldID);
    if (!!field) {
      return field.CurrentValue();
    }
    // TODO: Log error...
    return null;
  }

  OutputCurrentValues(converters: Converter[] = []) {
    this.UpdateModel();
    return this.GetOutputContent();
  }

  OutputAll(): any {
    return {
      FormName: this.formName,
      RecordCount: 1,
      Content: this.OutputCurrentValues()
    };
  }

  protected addElement<T>(elm: IElementDefinition<T>) {
    this._UIElements.push(elm);
  }

}




