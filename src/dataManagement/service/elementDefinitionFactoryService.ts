import { Injectable } from '@angular/core';
import { IElementDefinition, EditElementDefinition, ElementModel, IElementModel, ElementModelFactory } from '../model/definitions/ElementDefinition';
import { DataHTTPService } from 'src/dataManagement/service/dataHTTP.service';
import { A_Sequence, A_Term } from '../model/sequencing/sequence';
import { Records, FormFiltering } from '../model/records';
import { ActionType } from 'src/ui/components/views/detail/detail-view.component';
import { MatSnackBar } from '@angular/material';
import { IValidator } from '../model/definitions/Validation';
import { FilterBasicBarChartModel } from 'src/NAS_App/Services/filter/filter.model';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { FilterLostCausePeopleModel, FilterLostCauseStateModel } from 'src/apps/LostCauseAnalysis/filters/filter.model';

@Injectable()
export class ElementDefinitionFactoryService {

  private modelFactory: ElementModelFactory = new ElementModelFactory();
  private source: Records<string>[] = [];
 // _elms: IElementDefinition[] = [];  // should be _textElms...
  saveing: boolean = false;

  constructor(
    private httpService: DataHTTPService
    , private spinnerService: Ng4LoadingSpinnerService
    , private snacker: MatSnackBar
) {
    this.Init();
    //let m = new ElementModel<string>();
    //m.formID = 'projectForm';
    //m.fieldID = 'name';
    //m.label = 'Name:';
    //this._elms.push(new EditElementDefinition<string>(m));
  }
  
  //ElementDefinitionIndex(ID: string) {
  //  return this._elms.findIndex(e => e.FieldID() == ID) || this._elms[0];
  //}

  Init() {
    let self = this;
    // this.LoadModels();
    this.source.push(new FormFiltering('formFilter', this.source.length));
    this.source.push(new FilterBasicBarChartModel('VBarChart', this.source.length));
    this.source.push(new FilterLostCausePeopleModel('lc_people', this.source.length));
    this.source.push(new FilterLostCauseStateModel('lc_states', this.source.length));
   this.source.forEach(function (s, i) {
      s.AddFieldFromModel(self.modelFactory);
    });
  }

  public SetFormContent(sourceIndex: number) {
    let src = this.Source(sourceIndex);
    this.spinnerService.show();
    this.httpService.postContent(src.Filter()
      , 'https://localhost:44336/api/data/GetFilteredContent').subscribe(
      data => {
        src.Filter()
        this.spinnerService.hide();
        src.LoadData(
          data.content, [],
          data.recordCount,
          data.totalAvailableCount); },
      err => { this.httpFail(err) });
  }

  contentSuccess(data: any, source: Records<any>) {
  
    //   this.barSystem = this.source.ChartGraphic('bar', 0, 0, 'bar');
    //setTimeout(() =>
    //  this.messageService.sendMessage(0), 0);
  }

  httpFail(data: any) {
    this.spinnerService.hide();
    this.Snack('Form failed to initialize');
  }

  getSourceIndex(sourceName: string): number {
    return this.source.findIndex(s => s.FormName == sourceName);
  }

  getRecords(fid: number = 0): Records<string> {
    return this.source.find(r => r.FormID == fid);
  }

  getForm(fid: number = 0) {
    let r = this.getRecords(fid);
    if (r) { return r.Form; }
  }

  GetFormFieldIndex(formIndex: number, dataId: string) {
    return this.source[formIndex].GetFieldIndex(dataId);
  }

  get IsInvalid() {
    return this.modelFactory.IsInvalid;
  }

  get IsDirty() {
    return this.source.some(r => r.IsDirty);
  }

  GetSourceIndex(sourceName: string) {
    return this.source.findIndex(r => r.SourceID == sourceName);
  }

  Source(sourceIndex: number = 0) {
    return this.source[sourceIndex];
  }

  NewRecord(sourceIndex: number) {
    let s = this.Source(sourceIndex);
    s.NewRecord(this);
  }

  UpdateRecord(modelIndex: number, formIndex: number, fieldIndex: number): boolean {
    let m = this.modelFactory.GetElementModel(modelIndex);
    let r = this.source[formIndex];
    return r.UpdateRecord(fieldIndex, m.Validators());
  }

  Model(index: number) {
    return this.modelFactory.GetElementModel(index);
  }

  Element(formIndex: number, fieldIndex: number): IElementDefinition {
    return this.source[formIndex].Field( fieldIndex );
  }

  FormIndex(formIndex: number, fieldIndex: number): IElementDefinition {
    return this.source[formIndex].Field(fieldIndex);
  }


  LoadListsFromServer(lists: string[]) {

  }

  LoadDefinedLists() {
      
  }

  OutputCurrentValues(sourceIndex: number) {
    let source = this.Source(sourceIndex);
    return source.OutputCurrentValues(this.modelFactory);
  }

  saveSuccess(data: any) {
   // this.source.LoadData(data.content, [], data.recordCount);
    this.saveing = false;
    this.Snack('Save succeeded');
  }

  saveFail(data: any) {
    this.saveing = false;
    this.Snack(data.error || 'Form save Failed for unknown reason');
  }
  

  acknowledgeDelete(): void {
    //const dialogRef = this.dialog.open(AcknowlegeDeleteDialog, {
    //  width: '250px',
    //  data: { result: 'remove', why: '', question: 'Gonna lose it!' }
    //});

    //dialogRef.afterClosed().subscribe(result => {
    //  if ('remove' == result.result) {
    //    let model = new EntityRemoveModel();
    //    model.Id = this.source.GetFieldValue('id');
    //    model.why = result.why;
    //    this.httpService.deleteContent(model).subscribe(
    //      data => { this.deleteSuccess(data) },
    //      err => { this.deleteFail(err) });
    //  }
    //  //   this.httpService.


    //});
  }

  Snack(message: string) {

    this.snacker.open(message, 'Close', { duration: 2500, horizontalPosition: 'right', verticalPosition: 'bottom' });
  }

  TestList(model: ElementModel) {
    //let i = this._elms.findIndex(e => e.FieldID() == "test_list");
    //if (i >= 0) {
    //  return this._elms[i];
    //}
    //let list: A_Sequence<string, string, number> = new A_Sequence(model, "test_list", "Test");
    //list.AddItem("One", "1", 1);
    //list.AddItem("Two", "2", 2);
    //list.AddItem("Three", "3", 3);
    //list.AddItem("Four", "4", 4);

  }

  USStateAbbreviations(model: ElementModel) {

    //let i = this._elms.findIndex(e => e.FieldID() == "state_abbreviations");
    //if( i >= 0 )
    //{
    //  return this._elms[i];
    //}
   // let list: A_Sequence<string, string, number> = new A_Sequence(model, "state_abbreviations", "States");

    //list.AddItem("AL", "AL",1);
    //list.AddItem("AK", "AK",2);
    //list.AddItem("AZ", "AZ",3);
    //list.AddItem("AR", "AR",4);
    //list.AddItem("CA", "CA",5);
    //list.AddItem("CO", "CO",6);
    //list.AddItem("CT", "CT",7);
    //list.AddItem("DE", "DE",8);
    //list.AddItem("FL", "FL",9);
    //list.AddItem("GA", "GA",10);
    //list.AddItem("HI", "GA",11);
    //list.AddItem("ID", "ID",12);
    //list.AddItem("IL", "IL",13);
    //list.AddItem("IN", "IN",14);
    //list.AddItem("IA", "IA",15);
    //list.AddItem("KS", "KS",16);
    //list.AddItem("KY", "KY",17);
    //list.AddItem("LA", "LA",18);
    //list.AddItem("ME", "ME",19);
    //list.AddItem("MD", "MD",20);
    //list.AddItem("MA", "MA",21);
    //list.AddItem("MI", "MI",22);
    //list.AddItem("MN", "MN",23);
    //list.AddItem("MS", "MS",24);
    //list.AddItem("MO", "MO",25);
    //list.AddItem("MT", "MT",26);
    //list.AddItem("NE", "NE",27);
    //list.AddItem("NV", "NV",28);
    //list.AddItem("NH", "NH",29);
    //list.AddItem("NJ", "NJ",30);
    //list.AddItem("NM", "NM",31);
    //list.AddItem("NY", "NY",32);
    //list.AddItem("NC", "NC",33);
    //list.AddItem("ND", "ND",34);
    //list.AddItem("OH", "OH",35);
    //list.AddItem("OK", "OK",36);
    //list.AddItem("OR", "OR",37);
    //list.AddItem("PA", "PA",38);
    //list.AddItem("RI", "RI",39);
    //list.AddItem("SC", "SC",40);
    //list.AddItem("SD", "SD",41);
    //list.AddItem("TN", "TN",42);
    //list.AddItem("TX", "TX",43);
    //list.AddItem("UT", "UT",44);
    //list.AddItem("VT", "VT",45);
    //list.AddItem("VA", "VA",46);
    //list.AddItem("WA", "WA",47);
    //list.AddItem("WV", "WV",48);
    //list.AddItem("WI", "WI",49);
    //list.AddItem("WY", "WY", 50);

    //this._elms.push(list);

    return {}; //list;
  }
}
