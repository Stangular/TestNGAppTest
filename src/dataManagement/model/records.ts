import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { IElementDefinition, EditElementDefinition, SortOrder, IElementModel, ElementModelFactory } from './definitions/ElementDefinition';
import { IDataItem, DataItem, DataItems } from './data/dataitem';
import { ISequenceNavigator } from './sequencing/sequenceNavigator';
import { Field, BaseField } from './field';
import { IValidator } from './definitions/Validation';
import { ElementDefinitionFactoryService } from '../service/elementDefinitionFactoryService';
import { DataHTTPService } from '../service/dataHTTP.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

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
  // GetFormDefinition(): IElementDefinition<any>[];
  // AsList(valueName?: string): IListItem[];
  IsValid(): boolean;
}


export class Paging {
  constructor(
    private pageTotal: number,
    private pageSize: number = 10,
    private pageNumber: number = 0) { }

  UpdateTotal(pageTotal: number, pageSize: number = 10, pageNumber: number = 0) {
    let totalChange = this.pageTotal - pageTotal;
    this.pageTotal = pageTotal;
    return totalChange;
  }

  UpdateSize(pageSize: number) {
    if (this.pageSize != pageSize) {
      this.pageSize = pageSize;
      if (this.pageTotal > 0 && pageSize > this.pageTotal) {
        this.pageSize = this.pageTotal;
      }
      this.pageNumber = 0;
    }
  }

  get TotalSize() { return this.pageTotal; }
  get PageOffset() { return this.pageNumber * this.pageSize; }
  get PageSize() { return this.pageSize; }
  get PageNumber() {
    return this.pageNumber;
  }
  get PageCount() {
    return Math.ceil(this.pageTotal / this.pageSize);
  }

  gotoFirstPage() {
    let pn = this.pageNumber;
    this.pageNumber = 0;
    return pn == 0;   // return true if  already on the first page...

  }

  gotoNextPage() {
    let nextPage = this.pageNumber + 1;
    if (nextPage * this.pageSize >= this.pageTotal) {
      return false;
    }
    this.pageNumber = nextPage;
    return true;
  }

  gotoPreviousPage() {
    if (this.pageNumber <= 0) {
      return false;
    }
    this.pageNumber = this.pageNumber - 1;
    return true;
  }

  gotoFinalPage() {
    let pn = this.pageNumber;
    this.pageNumber = Math.ceil(this.TotalSize / this.pageSize) - 1;
    return pn == this.pageNumber; // Return true if already on the final page...
  }
}

//export class A_Form {
//  protected _form: FormGroup;
//  protected _UIElements: IElementDefinition<any>[] = [];

//  public get FormElements(): IElementDefinition<any>[] {
//    return this._UIElements;
//  }

//  private createFormGroup() {
//    let group: any = {};
//    this.GetFormDefinition();
//    this._UIElements.forEach(e => {
//      group[e.FieldID()] = new FormControl(e.CurrentValue() || '');
//    });
//    this._form = new FormGroup(group);
//    //this._UIElements.forEach(e => {
//    //  let contrl = this._form.controls[e.FieldID()];
//    //  //contrl.parent.valueChanges.subscribe( // TODO: evaluate as alternative to blur
//    //  //  changes => this.updateField(changes)
//    //  //);
//    //});
//  }
//   //get hasFilters() {
//  //  let r = this._UIElements.findIndex(e => e.HasFilter());
//  //  return r >= 0;
//  //}
//}

export abstract class Records<T> implements IRecordManager, ISequenceNavigator<T> {

  public page: Paging = new Paging(0);
  protected _form: FormGroup;
  private _selectedItem: number = -1;
  
  constructor(
    private formName: string
    , private formID: number
    , private sourceID: string = ''
    , protected _fields: Field<any>[] = []
    , private _recordCount = 0
    , totalRecordCount = 0
  ) {

    this.createFormGroup();
    this.page.UpdateTotal(totalRecordCount);
  }

  abstract GetFormDefinition(): IElementDefinition[];
  abstract New(data: any): Field<any>;
  abstract UpdateDependentUI(): void;
  abstract GetUIValue(fieldID: string): any;
  abstract OutputAll(): any;
  //abstract LoadContent(dataHTTPService: DataHTTPService);
  // abstract get testData(): Field<any>[];
  abstract ChartData(chartID: string): { xparam: number, yparam: number }[];
  abstract ChartGraphic(chartID: string, width: number, height: number, chartName: string);
  abstract ChartIDFrom(chartNumber: number);
  abstract AddFieldFromModel(models: ElementModelFactory);

  //get hasFilters() {
  //  let r = this._UIElements.findIndex(e => e.HasFilter());
  //  return r >= 0;
  //}

  //get DataCurrentPage() {
  //  let row: any[] = [];
  //  let size = this.page.PageSize;
  //  while (0 < size--) {

  //  }
  //  return page;
  //}

  DataFullPage(edfs: ElementDefinitionFactoryService) {
    let dataPage: any[] = [];
    let size = this.page.PageSize;
    for (let r = 0; r < size; r++) {
      let row: any[] = [];
      this._fields.forEach(function (f, i) {
        if (f.Observable) {
          let vlu = f.Value(r);
          if (!vlu) {
            row.push('');
          }
          else {
            let v = edfs.Model(f.ModelID).UIValueConvert(vlu) || '';
            row.push(v);
          }
        }
      });
      dataPage.push(row);
    }
    return dataPage;
  }

  get FormID() { return this.formID; }

  private createFormGroup() {
    let group: any = {};
    this.GetFormDefinition();
    //this._fields.forEach(f => {
    //  group[e.ElementID] = new FormControl(f.CurrentValue());
    //});
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

  //protected get UIElements(): IElementDefinition[] {
  //  return this._UIElements;
  //}

  //public AddElementDefinition(elmdef: IElementDefinition<any>) {
  //  if (elmdef) {
  //    this._UIElements.push(elmdef);
  //    let c = new FormControl(elmdef.CurrentValue() || '');
  //    this._form.addControl(elmdef.FieldID(), c);
  //  }
  //}

  get FormName(): string {
    return this.formName;
  }

  get SourceID(): string {
    return this.sourceID;
  }

  get Form(): FormGroup {
    return this._form;
  }

  AddDynamicFields(fields: Field<any>[]) {
    this._fields = [];
    this._fields = fields.concat([]);
  }

  CloneField(fieldId: number, elmName: string, elmId: number) {
    return this._fields[fieldId].Clone(elmName, elmId);
  }
  //Elements(): IElementDefinition[] {
  // // return this._fields.forEach
  //}
  //get IsNewForm() {
  //  return this._UIElements.some(e => e.isNew());
  //}

  RemoveAllFilters() {
    //this._fields.forEach(f => {
    //  f.TurnFilterOff();
    //});
  }

  GetFieldIndex(dataId: string) {
    return this._fields.findIndex(f => f.DataID == dataId);
  }

  GetField(elementName): any {
    return this._fields.find(f => f.ElementName == elementName);
  }

  RemoveNewForm() {
    //if (!this.IsNewForm) {
    //  return false;
    //}
    this._fields.forEach(f => f.RemoveLast());
    this._recordCount = this.Count;
    // this._selectedItem = this.Count - 1;
    this.UpdateUI();
    return true;
  }

  get IsDirty(): boolean {

    return this._fields.some(e => e.IsDirty);
  }

  IsValid(): boolean {
    return this.page.PageNumber > 0;
  }

  get Count(): number {
    return (this._fields.length > 0) ? this._fields[0].PageSize : 0;  // this._recordCount;
  }

  get Total(): number {
    return this.page.TotalSize;
  }

  get CurrentRecordNumber() {
    let rn = this.page.PageSize * this.page.PageNumber;
    rn += this._selectedItem;
    return rn;
  }

  RecordNumber(offset: number) {
    return offset + this.page.PageSize * this.page.PageNumber + 1;
  }

  NewRecord(edfs: ElementDefinitionFactoryService) {

    this._fields.forEach(f => f.AddNew(edfs.Model(f.ModelID)));
    this._selectedItem = 0;
    this._recordCount = this.Count + 1;
    this.UpdateUI();

  }

  //get NewContent() {
  //  let flds: Field<T>[] = [];
  //  const self = this;
  //  this._new.forEach(function (r, i) {
  //    self._UIElements.forEach(function (e, j) {
  //      const fld = self._fields.find(f => f.FieldId == e.FieldID());
  //      if (fld) {
  //        fld.Data[r];
  //      }
  //    });
  //  });
  //  return this._fields;
  //}

  CopyRecord(recordNumber: number): boolean {
    if (this.IsDirty) {// if the current record is dirty you do not want tit...
      return false; // isdirty   TODO: Dirty record message?
    }

    this._fields.forEach(f => f.Copy(recordNumber));

    this._recordCount = this._recordCount + 1;
    return this.Final();
  }

  public LoadData(content: any[] = [], converters: Converter[] = [], recordCount = 0, totalRecordCount = 0) {
    let self = this;
    
    this._recordCount = recordCount;
    this.page.UpdateTotal(totalRecordCount);
 
    content.forEach(function (c, i) {
      let fldID = c.fieldID.toLowerCase();
      let fldElm = self.Fields.find(e => e.DataID.toLowerCase() == fldID);
      if (fldElm) {
        fldElm.RefreshPage(c.values);
      }
      // if (fldElm) {
      //   self._fields.push(self.New(c));
      ////   fldElm.ResetToDefault(fldElm.DefaultValue);
      // }
    });
    if (recordCount > 0 && this._selectedItem >= recordCount - 1) {
      this._selectedItem = recordCount - 1;
    }
    else {
      this._selectedItem = 0;
    }
    this.UpdateUI();
  }

  get HasIgnoreLower() {
    return this._fields.some(f => f.Filter.ignore_lower);
  }

  get HasIgnoreUpper() {
    return this._fields.some(f => f.Filter.ignore_upper);
  }

  IgnoreAllFilter() {
    this.IgnoreAllLower();
    this.IgnoreAllUpper();
  }

  IgnoreAllLower(value:boolean = false) {
    this._fields.forEach(f => {
      f.Filter.ignore_lower = value;
    });
  }

  IgnoreAllUpper(value: boolean = false) {
    this._fields.forEach(f => {
      f.Filter.ignore_upper = value;
    });
  }

  LoadFail(data: any) {
    console.error(JSON.stringify(data));
  }

  get PageSize() {
    return this.page.PageSize;
  }

  public First(): boolean {
    this.Goto(0);
    return (this.page.gotoFirstPage());
  }

  public Final(): boolean {
    this.Goto(this.Count - 1);
    return (this.page.gotoFinalPage());
  }

  public NextPage(): boolean {
    return this.page.gotoNextPage();
  }

  public Next(): boolean {
    if (this.Goto(this._selectedItem + 1)) {
      return true;
    }
    this._selectedItem = 0;
    this.page.gotoNextPage();
    return false;
  }

  public PreviousPage(): boolean {
    return this.page.gotoPreviousPage();
  }

  public Previous(): boolean {
    if (this.Goto(this._selectedItem - 1)) {
      return true;
    }
    this._selectedItem = this.PageSize - 1;
    this.page.gotoPreviousPage();
    return false;
  }

  public SelectItem<T>(value: T): boolean {
    return this.SelectItemByField('ID', value);
  }


  public SelectItemByField(fieldId: string, value: any): boolean {
    let fld = this._fields.find(f => f.DataID == fieldId);
    if (fld) {
      return this.Goto(fld.ValueIndex(value));
    }
    return false;
  }

  public Goto(index: number): boolean {

    if (this.IsDirty) {// if the current record is dirty you do not want to leave it...
      console.log(index + ' is dirty');
      return false; // isdirty   TODO: Dirty record message (or just disable buttons)?
    }
    if (index < 0 || index >= this.Count) {
      return false;
    }

    this._selectedItem = index;
    this.UpdateUI();
    return true;
  }

  private UpdateUI(): void {
    let self = this;
    this._fields.forEach(f => f.Goto(self._selectedItem));
    //this.UpdateDependentUI();
  }

  //private InitUIField(field: Field<any>): void {

  //  if (field) {
  //    let elmdef = this._UIElements
  //      .find(e => e.FieldID().toLowerCase() == field.FieldId.toLowerCase());
  //    if (elmdef) {
  //      elmdef.SetInitialValue(field.Value(this._selectedItem));
  //      let contrl = this._form.controls[field.FieldId];
  //      if (contrl) {
  //        let v = elmdef.UIConvert();
  //        contrl.setValue(v);
  //      }
  //    }
  //  }
  //}

  ResetToInitial(validators: IValidator[] = []) {
    this._fields.forEach(e => {
      let contrl = this._form.controls[e.DataID];
      if (contrl) {
        if (e.UpdateCurrentValue(e.InitialValue(), validators)) {
          contrl.setValue(e.InitialValue());
        }
      }
    });
  }

  //UpdateCurrent() {
  //  this._fields.forEach(f => {
  //    f.Clean();
  //    f.UpdateCurrentValue();
  //    let contrl = this._form.controls[e.FieldID()];
  //    if (contrl) { contrl.setValue(e.InitialValue()); }
  //  });
  //}

  Filter() {
    let f = {
      SourceName: '',
      formName: this.SourceID,
      paging: { pageLength: this.page.PageSize, pageNumber: this.page.PageNumber },
      filters: []
    }
    this.Fields.forEach(e => {
      if (e.FilterApplied) {
        f.filters.push({
          DataId: e.Filter.DataId,
          UpperValue: e.Filter.ValueUpper,
          LowerValue: e.Filter.ValueLower,
          Sort: e.Filter.Sort,
          AsContent: e.Filter.asContent
        });
      }
      else {
        f.filters.push({
          DataId: e.Filter.DataId,
          UpperValue: null,
          LowerValue: null,
          Sort: e.Filter.Sort,
          AsContent: false
        });
      }
      if (e.Filter.new) {
        f.paging.pageNumber = 0;
        e.Filter.new = false;
      }
    });
    return f;
  }


  private getControl(elmdef: IElementDefinition) {
    return this._form.controls[elmdef.ElementID];
  }

  Field(index: number) {
    return this._fields[index];
  }

  UpdateRecord(fieldIndex: number, validator: IValidator[] = []): boolean {
    let elmdef = this._fields[fieldIndex];
    if (elmdef) {
      let v = elmdef.UpdateFromUI(validator);
      let c = this.getControl(elmdef);
      if (c) {
        c.setValue(v);
      }
      return true;
    }
    return false;
  }

  IsValueValid(elmdef: IElementDefinition): boolean {
    let c = this.getControl(elmdef);
    if (c) {
      let v = c.value;
      return false; // elmdef.validateValue(c.value);
    }
    return true; // An element that does not exist is always valid...
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
  protected get Fields() {// TODO: change this so that derived classes emit formatted data as needed..
    return this._fields;
  }
  // update model from UI...
  UpdateModel(): void {
    let self = this;
    let fldElm;
    this._fields.forEach(function (f, i) {
      fldElm = self
        ._fields
        .find(e => e.DataID.toLowerCase() == f.DataID.toLowerCase());
      fldElm.UpdateCurrentValue(self.GetUIValue(f.DataID));
    });
  }

  //public GetModelValue(fieldID: string, defaultValue: any) {
  //  let fld = this._UIElements.find(f => f.FieldID() == fieldID);
  //  if (!!fld) {
  //    return fld.CurrentValue();
  //  }
  //  return defaultValue;
  //}

  SelectedIndex(): number {
    return this._selectedItem;
  }

  protected GetOutputContent(modelFactory: ElementModelFactory) {
    let content = this._fields.map(f => {
      return {
        fieldID: f.DataID
        , values: [f.CurrentValue()]
      };
    });
    return content;
  }

  //public GetAllValues(fieldID: string): any[] {
  //  let out: any[] = [];
  //  let field = this._fields.find(f => f.FieldId == fieldID);
  //  if (!!field) {
  //    for (let i = 0; i < this._recordCount; i = i + 1) {
  //      out.push(field.Value(i));
  //    }
  //  }
  //  return out;
  //}

  public GetFieldValue(dataId: string): any {
    let field = this._fields.find(e => e.DataID == dataId);
    if (!!field) {
      return field.CurrentValue();
    }
    // TODO: Log error...
    return null;
  }

  OutputCurrentValues(modelFactory: ElementModelFactory) {
    this.UpdateModel();
    return {
      FormName: this.sourceID,
      RecordCount: 1,
      Content: this.GetOutputContent(modelFactory)
    };
  }



  get onLastRecord(): boolean {
    return (this._selectedItem == this.Count - 1);
  }

  //protected addElement<T>(elm: IElementDefinition<T>) {
  //  this._UIElements.push(elm);
  //}

}


export class FormFiltering extends Records<string>{
  constructor(
    formName: string
    , formID: number
    , sourceID: string = ''
    , _fields: Field<any>[] = []
    , _recordCount = 0
    , totalRecordCount = 0
  ) {
    super(formName
      , formID
      , sourceID
      , _fields
      , _recordCount
      , totalRecordCount);
  }

  GetFormDefinition(): IElementDefinition[] { return null; }
  New(data: any): Field<any> { return null; }
  UpdateDependentUI(): void { }
  GetUIValue(fieldID: string): any { return null; }
  OutputAll(): any { return null; }
  ChartData(chartID: string): { xparam: number, yparam: number }[] { return []; }
  ChartGraphic(chartID: string, width: number, height: number, chartName: string) { return null; }
  ChartIDFrom(chartNumber: number) { }
  AddFieldFromModel(models: ElementModelFactory) { }

}





