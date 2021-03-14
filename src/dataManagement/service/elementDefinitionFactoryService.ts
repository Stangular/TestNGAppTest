import { Injectable } from '@angular/core';
import { IElementDefinition, EditElementDefinition, ElementModel, IElementModel } from '../model/definitions/ElementDefinition';
import { DataHTTPService } from 'src/dataManagement/service/dataHTTP.service';
import { A_Sequence, A_Term } from '../model/sequencing/sequence';
import { Records } from '../model/records';
import { ActionType } from 'src/ui/components/views/detail/detail-view.component';
import { MatSnackBar } from '@angular/material';
import { IValidator } from '../model/definitions/Validation';

@Injectable()
export class ElementDefinitionFactoryService {

  private validators: IValidator[] = [];
  private source: Records<string>[] = [];
  private _models: IElementModel[] = [];
 // _elms: IElementDefinition[] = [];  // should be _textElms...
  saveing: boolean = false;

  constructor(
    private httpService: DataHTTPService,
    private snacker: MatSnackBar
) {

    //let m = new ElementModel<string>();
    //m.formID = 'projectForm';
    //m.fieldID = 'name';
    //m.label = 'Name:';
    //this._elms.push(new EditElementDefinition<string>(m));
  }
  
  //ElementDefinitionIndex(ID: string) {
  //  return this._elms.findIndex(e => e.FieldID() == ID) || this._elms[0];
  //}

  getRecordsIndex(sourceName: string) : number {
    return this.source.findIndex(s => s.SourceID == sourceName);
  }

  getRecords(fid: number = 0): Records<string> {
    return this.source.find(r => r.FormID == fid);
  }

  getForm(fid: number = 0) {
    let r = this.getRecords(fid);
    if (r) { return r.Form; }
  }

  Source(sourceIndex: number = 0) {
    return this.source[sourceIndex];
  }

  IsValidValue<T>(v: T, validatorIndex: number): boolean {

    return this.validators[validatorIndex].validate(v);
   
  }

  UpdateRecord(modelIndex: number, formIndex: number, fieldIndex: number) : boolean {
    let m = this._models[modelIndex];
    let r = this.source[formIndex];
    return r.UpdateRecord(fieldIndex,this.validators[m.Validator]);
  }

  Model(index: number) {
    return this._models[index];
  }

  Element(formIndex: number, fieldIndex: number): IElementDefinition {
    return this.source[formIndex].Fields[fieldIndex];
  }

  LoadListsFromServer(lists: string[]) {

  }

  LoadDefinedLists() {
      
  }

  saveSuccess(data: any) {
    this.source.LoadData(data.content, [], data.recordCount);
    this.saveing = false;
    this.Snack('Save succeeded');
  }

  saveFail(data: any) {
    this.saveing = false;
    this.Snack(data.error || 'Form save Failed for unknown reason');
  }

  //Action(a: ActionType, elmId = '') {
  //  //switch (a) {
  //  //  case ActionType.undo: this.source.ResetToInitial(); break;
  //  //  case ActionType.create: this.source.NewRecord(); break;
  //  //  case ActionType.update: break;// TODO: put into edit mode.
  //  //  case ActionType.remove:
  //  //    if (!this.source.RemoveNewForm()) { this.acknowledgeDelete(); }
  //  //    break;
  //  //  case ActionType.save:
  //  //    this.saveing = true;
  //  //    let v = this.source.GetFieldValue('id');
  //  //    if (v.length <= 0) {

  //  //      this.httpService.postContent(this.source.OutputCurrentValues()).subscribe(
  //  //        data => { this.saveSuccess(data) },
  //  //        err => { this.saveFail(err) });
  //  //    }
  //  //    else {
  //  //      this.httpService.updateContent(this.source.OutputCurrentValues()).subscribe(
  //  //        data => { this.saveSuccess(data) },
  //  //        err => { this.saveFail(err) });
  //  //    }


  //  //    break;
  //  }
  //}

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

  TestList(model: ElementModel<string>) {
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

  USStateAbbreviations(model: ElementModel<string>) {

    //let i = this._elms.findIndex(e => e.FieldID() == "state_abbreviations");
    //if( i >= 0 )
    //{
    //  return this._elms[i];
    //}
    let list: A_Sequence<string, string, number> = new A_Sequence(model, "state_abbreviations", "States");

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

    return list;
  }
}
