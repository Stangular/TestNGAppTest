import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Records } from '../../../../dataManagement/model/records';
import { IElementDefinition } from '../../../../dataManagement/model/definitions/ElementDefinition';
import { ActionType } from '../detail/detail-view.component';
import { AcknowlegeDeleteDialog } from './dialogs/acknowledgeDelete/acknowledge-delete-dialog.component';
//import { FormFilteringComponent } from './filtering/form-filtering.component';
import { DataHTTPService } from '../../../../dataManagement/service/dataHTTP.service';
import { MatSnackBar } from '@angular/material';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

export enum ViewType {
  detail = 0,
  table = 1,
  card = 2,
  graphic = 3,
  filter = 4
}

export enum PagingMode {
  byRecord,
  byPage
}

export class EntityRemoveModel {
  Id: string = '';
  why: string = '';
}

@Component({
  selector: 'form-view',
  templateUrl: 'form.component.html',
  styleUrls: ['form.component.css']
})
export class FormComponent {

  @Input() source: Records<string>;
  form: any;
  elements: any;
  public viewType = ViewType;
  view: ViewType;
  activeView: number;
  saveing: boolean = false;
  pagingMode = PagingMode;

  constructor(
    private httpService: DataHTTPService
    , public dialog: MatDialog
    , private snacker: MatSnackBar
    , private spinnerService: Ng4LoadingSpinnerService) {
    this.view = this.viewType.detail;
  }

  ngOnInit() {
    
    this.form = this.source.Form;
    this.elements = this.source.GetFormDefinition();
    this.SetFormContent(this.source.PageSize);

  }

  private SetFormContent(pageSize: number = 10) {

    this.spinnerService.show();
    this.httpService.postContent(this.source.Filter(pageSize)
      , 'https://localhost:44336/api/data/GetFilteredContent').subscribe(
      data => { this.initSuccess(data) },
      err => { this.initFail(err) });
  }

  get metaInfo() {
    const p = this.source.CurrentRecordNumber + 1;
    const c = this.source.Total.toString();
    let page = p.toString();
    while (page.length < c.length) {
      page = '0' + page;
    }
    return 'Record ' + page + ' of ' + c;
  }

  tableSort() {
    this.SetFormContent(this.source.PageSize);
  }

  viewChange(view: ViewType) {
    this.view = view;
  }

  UpdateElement(elmId = { id: '', value: '' }) {
    this.source.UpdateRecord(elmId.id);
  } 

  applyFilter() {
    this.SetFormContent(this.source.PageSize);
  }

  action(a: ActionType, elmId = '') {
    switch (a) {
      case ActionType.undo: this.source.ResetToInitial(); break;
      case ActionType.create: this.source.NewRecord(); break;
      case ActionType.update: break;// TODO: put into edit mode.
      case ActionType.remove:
        if (!this.source.RemoveNewForm()) { this.acknowledgeDelete(); }
        break;
      case ActionType.save:
        this.saveing = true;
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

  Snack(message: string) {

    this.snacker.open(message, 'Close', { duration: 2500, horizontalPosition: 'right', verticalPosition: 'bottom' });
  }

  initSuccess(data: any) {
    this.spinnerService.hide();
    this.source.LoadData(data.content, [], data.recordCount, data.totalAvailableCount);
  }

  initFail(data: any) {
    this.spinnerService.hide();
    console.error(JSON.stringify(data));
    this.Snack('Form failed to initialize');
  }

  saveSuccess(data: any) {
    this.source.LoadData(data.content, [], data.recordCount);
    this.saveing = false;
    this.Snack('Save succeeded');
  }

  saveFail(data: any) {
    console.error(JSON.stringify(data));
    this.saveing = false;
    this.Snack(data.error || 'Form save Failed for unknown reason');
  }

  deleteSuccess(data: any) {
    this.SetFormContent(this.source.PageSize);
    this.source.LoadData(data.content, [], data.recordCount);
    this.saveing = false;
    this.Snack('Form removed');
  }

  deleteFail(data: any) {
    console.error(JSON.stringify(data));
    this.saveing = false;
    this.Snack('Form removal failed');
  }

  SetTab(tab: number) {
    this.activeView = tab;
  }

  TabChange(item: any) {
    this.activeView = item;
    switch (item) {
      case 0: this.viewChange(ViewType.detail); break;
      case 1: this.viewChange(ViewType.table); break;
      default: this.viewChange(ViewType.graphic); break;
    }
  }
  
  page(code: number) {
    let reload = false;
    switch (code) {
      case 0:
        reload = !this.source.First();
        break;
      case 1:
        if (this.view == ViewType.detail) {
          reload = !this.source.Previous();
        }
        else if (this.view == ViewType.table) {
          reload = true;
          this.source.PreviousPage();
        }
        break;
      case 2:
        if (this.view == ViewType.detail) {
          reload = !this.source.Next();
        }
        else if (this.view == ViewType.table) {
          reload = true;
          this.source.NextPage();
        }
        break;
      case 3:
        reload = !this.source.Final();
        break;
    }
    if (reload) {
      this.SetFormContent(this.source.PageSize);
    }
  }

  //showFilter(): void {
  //  const dialogRef = this.dialog.open(FormFilteringComponent, {
  //    width: '250px',
  //    data: { query: 'sss' }
  //  });

  //  dialogRef.afterClosed().subscribe(result => {
     
  //  });
    
  //}
  acknowledgeDelete(): void {
    const dialogRef = this.dialog.open(AcknowlegeDeleteDialog, {
      width: '250px',
      data: { result: 'remove', why: '',question:'Gonna lose it!' }
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
