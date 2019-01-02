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
  GetFormDefinition(): IElementDefinition<any>[];
  // AsList(valueName?: string): IListItem[];
  IsValid(): boolean;
}


export class Paging {
  constructor(private pageTotal: number, private pageSize: number = 10, private pageNumber: number = 0) {

  }

  get PageSize() { return this.pageSize; }
  get PageNumber() { return this.pageNumber; }

  gotoFirstPage() {
    this.pageNumber = 0; return this.pageNumber;
  }

  gotoNextPage() {
    this.pageNumber = this.pageNumber + 1; return this.pageNumber;
  }

  gotoPreviousPage() {
    this.pageNumber = this.pageNumber - 1; return this.pageNumber;
  }

  gotoFinalPage() {
    this.pageNumber = this.pageTotal - 1; return this.pageNumber;
  }
}

export abstract class Records<T> implements IRecordManager, IListNavigator<T> {

  protected _UIElements: IElementDefinition<any>[] = [];
  //protected _childRecords: Records<T>[] = [];

  protected _form: FormGroup;
  private _selectedItem: number = -1;
  protected _new: number[] = [];
  protected _dirty: number[] = [];
  // private _filter: { field: '', value: '',  }[] = [];
  //private _sort: { field: '', direction: boolean }[] = [];
  // private _lazyState : LazyState; ie {pageCount:0,pageSize:0,pageNumber:0,complete:boolean,filters:[]}

  constructor(private formName: string, private sourceID: string = ''
    , protected _fields: Field<any>[] = []
    , private _recordCount = 0
    ) {

    this._selectedItem = 0;
    this.createFormGroup();
  }

  public get FormElements(): IElementDefinition<any>[] {
    return this._UIElements;
  }

  abstract GetFormDefinition(): IElementDefinition<any>[];
  abstract New(data: any): Field<any>;
  abstract UpdateDependentUI(): void;
  abstract GetUIValue(fieldID: string): any;
  abstract OutputAll(): any;
 // abstract get testData(): Field<any>[];
  abstract ChartData(chartID: string): { xparam: number, yparam: number }[];

  private createFormGroup() {
    let group: any = {};
    this.GetFormDefinition();
    this._UIElements.forEach(e => {
      group[e.FieldID()] = new FormControl(e.CurrentValue() || '');
    });
    this._form = new FormGroup(group);
    //this._UIElements.forEach(e => {
    //  let contrl = this._form.controls[e.FieldID()];
    //  //contrl.parent.valueChanges.subscribe( // TODO: evaluate as alternative to blur
    //  //  changes => this.updateField(changes)
    //  //);
    //});
  }

  //public updateField(changes: any) {
  //  const sss = 'sss';
  //}
  //public Test() {
  //  if (this._fields.length <= 0) {
  //    this._fields = this.testData;
  //  }
  //}

  //public AddDependentRecord(records: Records<T>) {
  //  this._childRecords.push(records);
  //}

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

  get SourceID(): string {
    return this.sourceID;
  }

  get Form(): FormGroup {
    return this._form;
  }

  get IsNewForm() {
    return this._UIElements.some(e => e.isNew());
  }

  RemoveNewForm() {
    if (!this.IsNewForm) {
      return false;
    }
    this._fields.forEach(f =>f.RemoveLast());
    this._recordCount = this.Count;
    this._selectedItem = this.Count - 1;
    this.UpdateUI();
  return true;
  }

  get IsDirty(): boolean {

    return this._UIElements.some(e => e.isDirty());
  }

  SetDirty(): void {
    if (this._UIElements.some(e => e.isDirty())) {
      this._dirty.push(this.SelectedIndex());
    }
    else {
      const v = this._dirty.findIndex(r => r == this.SelectedIndex());
      if (v && v >= 0) {
        this._dirty.splice(v, 1);
      }
    }

  }

  IsValid(): boolean {
    return this._selectedItem >= 1;
  }

  get Count(): number {
    return (this._fields.length > 0) ? this._fields[0].Data.length : 0;  // this._recordCount;
  }

  NewRecord(): boolean {
    if (this.IsDirty) {// if the current record is dirty you do not want to leave it...
      return false; // isdirty   TODO: Dirty record message?
    }
    this._fields.forEach(f =>
      f.AddNew(this._UIElements
        .find(e => e.FieldID() == f.FieldId)));

    this._selectedItem = this.Count;
    this._recordCount = this._selectedItem + 1;
    this._new.push(this._selectedItem);
    this.UpdateUI();
  }

  get NewContent() {
    let flds: Field<T>[] = [];
    const self = this;
    this._new.forEach(function (r, i) {
      self._UIElements.forEach(function (e, j) {
        const fld = self._fields.find(f => f.FieldId == e.FieldID());
        if (fld) {
          fld.Data[r];
        }
      });
    });
    return this._fields;
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
    //if (content.length <= 0) {
    ////  this.Test();
    //  this._selectedItem = 0;
    //  this.UpdateUI();
    //  return;
    //}
    this._fields.length = 0;
    this._recordCount = recordCount;
    content.forEach(function (c, i) {
      let fldID = c.fieldID.toLowerCase();
      //let convert = converters
      //  .find(x => x.DataID.toLowerCase() == fldID);
      //if (!!convert) {
      //  fldID = convert.UIID;
      //  c.fieldID = fldID;
      //}
      let fldElm = self
        ._UIElements
        .find(e => e.FieldID().toLowerCase() == fldID);
      if (!!fldElm) {
        self._fields.push(self.New(c));
        fldElm.ResetToDefault();
      }
    });
    if (recordCount > 0 && this._selectedItem >= recordCount) {
      this._selectedItem = recordCount - 1;

    }
    this.UpdateUI();
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
      return false; // isdirty   TODO: Dirty record message (or just disable buttons)?
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

    if (field) {
      let elmdef = this._UIElements
        .find(e => e.FieldID().toLowerCase() == field.FieldId.toLowerCase());
      if (elmdef) {
        elmdef.SetInitialValue(field.Value(this._selectedItem));
        let contrl = this._form.controls[field.FieldId];
        if (contrl) {
          let v = elmdef.UIConvert();
          contrl.setValue(v);
        }
      }
    }
  }

  ResetToInitial() {
    this._UIElements.forEach(e => {
      let contrl = this._form.controls[e.FieldID()];
      if (contrl) {
          if (e.UpdateCurrentValue(e.InitialValue())) {
            contrl.setValue(e.InitialValue());
          }
      }
    });
  }

  UpdateCurrent() {
    this._UIElements.forEach(e => {
      e.Clean();
      let fld = this._fields.find(f => f.FieldId == e.FieldID());
      fld.Data[this.SelectedIndex()] = e.InitialValue();
      let contrl = this._form.controls[e.FieldID()];
      if (contrl) { contrl.setValue(e.InitialValue()); }
    });
  }

  UpdateRecord(elmID: string) {

    let contrl = this._form.controls[elmID];
    if (contrl) {
      let elmdef = this._UIElements.find(e => e.FieldID() == elmID);
      if (elmdef) {
        const elm: any = document.getElementById(elmID); // <- Non-angular, but seems to work pretty well anyway....
        const v = elmdef.Type() == 'number' ? parseInt(elm.value) : elm.value;
        if (elmdef.UpdateCurrentValue(v)) {
          contrl.setValue(v);
        }
      }
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
      fldElm = self
        ._UIElements
        .find(e => e.FieldID().toLowerCase() == f.FieldId.toLowerCase());
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
    return {
      FormName: this.sourceID,
      RecordCount: 1,
      Content: this.GetOutputContent()
    };
  }

  

  get onLastRecord(): boolean {
    return (this._selectedItem == this.Count - 1);
  }

  protected addElement<T>(elm: IElementDefinition<T>) {
    this._UIElements.push(elm);
  }

}




