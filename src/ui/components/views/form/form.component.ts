import { Component, Input, Output, OnInit, EventEmitter, AfterContentInit } from '@angular/core';
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
import { ChartLayer } from '../../../../canvas/models/custom/layers/charts/chart.layer';
import { ShapeSelectResult } from 'src/canvas/models/shapes/shapeSelected';
import { MessageService } from 'src/app/messaging/message.service';
import { ElementDefinitionFactoryService } from 'src/dataManagement/service/elementDefinitionFactoryService';

export enum ViewType {
  detail = 0,
  table = 1,
  card = 2,
  graphic = 3,
  filter = 4,
  design = 5,
  map = 6,
  sandbox = 7,
  familyLineage = 8
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
export class FormComponent implements OnInit, AfterContentInit {

 // barSystem: ChartLayer;
  @Input() sourceID: number;
  @Input() sourceName: string;

  elements: any;
  public viewType = ViewType;
  view: ViewType;
  activeView: number;
  saveing: boolean = false;
  pagingMode = PagingMode;
  sourceIndex: number = -1;
  constructor(
    private edfs: ElementDefinitionFactoryService
    , private httpService: DataHTTPService
    , public dialog: MatDialog
    , private snacker: MatSnackBar
    , private messageService: MessageService
    , private spinnerService: Ng4LoadingSpinnerService) {
    this.view = this.viewType.detail;
    this.sourceIndex = edfs.getRecordsIndex(this.sourceName);
  }

  get Form(): FormGroup { return this.Source.Form; }

  ngAfterContentInit() {}

  get Source() {
    return this.edfs.Source(this.sourceIndex);
  }

  ngOnInit() {
    
    this.elements = this.Source.GetFormDefinition();
    this.SetFormContent(this.Source.PageSize);
  }

  public SetFormContent(pageSize: number = 10) {

    this.spinnerService.show();
    this.httpService.postContent(this.Source.Filter(pageSize)
      , 'https://localhost:44336/api/data/GetFilteredContent').subscribe(
      data => { this.initSuccess(data) },
      err => { this.initFail(err) });
  }

  get metaInfo() {
    const p = this.Source.CurrentRecordNumber + 1;
    const c = this.Source.Total.toString();
    let page = p.toString();
    while (page.length < c.length) {
      page = '0' + page;
    }
    return 'Record ' + page + ' of ' + c;
  }

  tableSort() {
    this.SetFormContent(this.Source.PageSize);
  }

  viewChange(view: ViewType) {
    this.view = view;
  }

  UpdateElement(elmId = { id: '', value: '' }) {
    this.source.UpdateRecord(elmId.id);
  } 

  applyFilter() {
    this.SetFormContent(this.Source.PageSize);
  }

  //action(a: ActionType, elmId = '') {
  //  switch (a) {
  //    case ActionType.undo: this.source.ResetToInitial(); break;
  //    case ActionType.create: this.source.NewRecord(); break;
  //    case ActionType.update: break;// TODO: put into edit mode.
  //    case ActionType.remove:
  //      if (!this.source.RemoveNewForm()) { this.acknowledgeDelete(); }
  //      break;
  //    case ActionType.save:
  //      this.saveing = true;
  //      let v = this.source.GetFieldValue('id');
  //      if (v.length <= 0) {

  //        this.httpService.postContent(this.source.OutputCurrentValues()).subscribe(
  //          data => { this.saveSuccess(data) },
  //          err => { this.saveFail(err) });
  //      }
  //      else {
  //        this.httpService.updateContent(this.source.OutputCurrentValues()).subscribe(
  //          data => { this.saveSuccess(data) },
  //          err => { this.saveFail(err) });
  //      }


  //      break;
  //  }
  //}

  Snack(message: string) {

    this.snacker.open(message, 'Close', { duration: 2500, horizontalPosition: 'right', verticalPosition: 'bottom' });
  }

  initSuccess(data: any) {
    this.spinnerService.hide();
    this.Source.LoadData(
      data.content, [],
      data.recordCount,
      data.totalAvailableCount);
 //   this.barSystem = this.source.ChartGraphic('bar', 0, 0, 'bar');
    setTimeout(() =>
      this.messageService.sendMessage(0), 0);
  }

  OnStateChange() {
  setTimeout(() =>
    this.messageService.sendMessage(10), 0);
  }

  OnDeleteItem() {
    setTimeout(() =>
      this.messageService.sendMessage(1), 0);
  }

  initFail(data: any) {
    this.spinnerService.hide();
    this.Snack('Form failed to initialize');
  }

  //saveSuccess(data: any) {
  //  this.source.LoadData(data.content, [], data.recordCount);
  //  this.saveing = false;
  //  this.Snack('Save succeeded');
  //}

  //saveFail(data: any) {
  //  this.saveing = false;
  //  this.Snack(data.error || 'Form save Failed for unknown reason');
  //}

  deleteSuccess(data: any) {
    this.SetFormContent(this.Source.PageSize);
    this.Source.LoadData(data.content, [], data.recordCount);
    this.saveing = false;
    this.Snack('Form removed');
  }

  onSelect(shapeSelectResult: ShapeSelectResult) {
    if (this.Source.SelectItemByField('Id', shapeSelectResult.id)) {
      this.SetTab(0);
    }
  }

  deleteFail(data: any) {
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
      case 3: this.viewChange(ViewType.design); break;
      case 4: this.viewChange(ViewType.map); break;
      case 5: this.viewChange(ViewType.sandbox); break;
      case 6: this.viewChange(ViewType.familyLineage); break;
      default: this.viewChange(ViewType.graphic); break;
    }
  }
  
  page(code: number) {
    let reload = false;
    //switch (this.view) {
    //  case ViewType.detail:
    //    switch (code) {
    //      case 0: reload = !this.source.First();    break;
    //      case 1: reload = !this.source.Previous(); break;
    //      case 2: reload = !this.source.Next();     break;
    //      case 3: reload = !this.source.Final();    break;
    //    }
    //  case ViewType.table: {

    //  }
    //    break;
      
    //}
    switch (code) {
      case 0:
        reload = !this.Source.First();
        break;
      case 1:
        if (this.view == ViewType.detail) {
          reload = !this.Source.Previous();
        }
        else if (this.view == ViewType.table) {
          reload = true;
          this.Source.PreviousPage();
        }
        else if (this.view == ViewType.graphic) {
          reload = true;
          this.Source.PreviousPage();
        }
        break;
      case 2:
        switch (this.view) {
          case ViewType.detail: reload = !this.source.Next(); break;
          case ViewType.table:
            reload = true;
            this.Source.NextPage();
            break;
          case ViewType.graphic:
            reload = true;
            this.Source.NextPage();
            break;
        }
        //if (this.view == ViewType.detail) {
        //  reload = !this.source.Next();
        //}
        //else if (this.view == ViewType.table) {
        //  reload = true;
        //  this.source.NextPage();
        //}
        break;
      case 3:
        reload = !this.Source.Final();
        break;
    }
    if (reload) {
      this.SetFormContent(this.Source.PageSize);
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
      if ('remove' == result.result) {
        let model = new EntityRemoveModel();
        model.Id = this.Source.GetFieldValue('id');
        model.why = result.why;
        this.httpService.deleteContent(model).subscribe(
          data => { this.deleteSuccess(data) },
          err => { this.deleteFail(err) });
      }
      //   this.httpService.


    });
  }
}
