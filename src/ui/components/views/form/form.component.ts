import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Records } from '../../../../dataManagement/model/records';
import { IElementDefinition } from '../../../../dataManagement/model/definitions/ElementDefinition';
import { ActionType } from '../detail/detail-view.component';
import { AcknowlegeDeleteDialog } from './dialogs/acknowledgeDelete/acknowledge-delete-dialog.component';
import { DataHTTPService } from '../../../../dataManagement/service/dataHTTP.service'
export enum ViewType {
  detail = 0,
  table = 1,
  card = 2,
  graphic = 3
}
export class EntityRemoveModel {
  Id: string = '';
  why: string = '';
}
@Component({
  selector: 'form-view',
  templateUrl: 'form.component.html'
})
export class FormComponent {
  @Input() source: Records<string>;
  form: any;
  elements: any;
  public viewType = ViewType;
  view: ViewType;

  constructor(
    private httpService: DataHTTPService
    , public dialog: MatDialog) {
    this.view = this.viewType.detail;
  }

  ngOnInit() {

    this.form = this.source.Form;
    this.elements = this.source.GetFormDefinition();
    this.SetFormContent();
  
    // register D3 view...
  }

  private SetFormContent() {
    this.httpService.getContent(this.source.SourceID).subscribe(
      data => { this.initSuccess(data) },
      err => { this.initFail(err) });
  }

  get metaInfo() {
    const p = this.source.SelectedIndex() + 1;
    const c = this.source.Count;
    return 'Page ' + p + ' of ' + c.toString();
  }
  viewChange(view: ViewType) {
    this.view = view;
  }

  UpdateElement(elmId = { id: '', value: '' }) {
    this.source.UpdateRecord(elmId.id);
  } AcknowlegeDeleteDialog

  action(a: ActionType, elmId = '') {
    switch (a) {
      case ActionType.undo: this.source.ResetToInitial(); break;
      case ActionType.create: this.source.NewRecord(); break;
      case ActionType.update: break;// TODO: put into edit mode.
      case ActionType.remove:
        if (!this.source.RemoveNewForm()) {
          this.acknowledgeDelete(); break;
        }
      case ActionType.save:
        let v = this.source.GetFieldValue('id');
        if (v.length <= 0) {

          this.httpService.postContent(this.source.OutputCurrentValues()).subscribe(
            data => { this.saveSuccess(data) },
            err => { this.saveFail(err) });
        }
        else {
          this.httpService.updateContent(this.source.OutputCurrentValues()).subscribe(
            data => { this.saveSuccess(data) },
            err => { this.saveFail(err) });
        }


        break;
    }
  }

  initSuccess(data: any) {
   this.source.LoadData(data.content,[],data.recordCount);
  }

  initFail(data: any) {
    console.error(JSON.stringify(data));
  }

  saveSuccess(data: any) {
   // this.source.UpdateCurrent();
    this.SetFormContent();
  }

  saveFail(data: any) {
    console.error(JSON.stringify(data));
  }

  deleteSuccess(data: any) {
    this.SetFormContent();
  }

  deleteFail(data: any) {
    console.error(JSON.stringify(data));
  }

  page(code: number) {
    switch (code) {
      case 0: this.source.First(); break;
      case 1: this.source.Previous(); break;
      case 2: this.source.Next(); break;
      case 3: this.source.Final(); break;
    }
  }

  acknowledgeDelete(): void {
    const dialogRef = this.dialog.open(AcknowlegeDeleteDialog, {
      width: '250px',
      data: { result: 'remove', why:''}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The delete dialog was closed');
      if ('remove' == result.result) {
        let model = new EntityRemoveModel();
        model.Id = this.source.GetFieldValue('id');
        model.why = result.why;
        this.httpService.deleteContent(model).subscribe(
          data => { this.deleteSuccess(data) },
          err => { this.deleteFail(err) });
      }
        //   this.httpService.

      
    });
  }
}
