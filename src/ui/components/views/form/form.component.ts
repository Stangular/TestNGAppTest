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
import { TabDefinitionModel } from 'src/models/tabs/tabdef';
//import { Router } from '@angular/router';

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
  FormName: string = '';
}

@Component({
  selector: 'form-view',
  templateUrl: 'form.component.html',
  styleUrls: ['form.component.css']
})
export class FormComponent implements OnInit, AfterContentInit {

  private sourceID: number;
  @Input() sourceName: string = '';
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
  }

  get Form(): FormGroup { return this.Source.Form; }

  ngAfterContentInit() {}

  get Source() {
    return this.edfs.Source(this.sourceIndex);
  }

  ngOnInit() {

    this.sourceIndex = this.edfs.getSourceIndex(this.sourceName);
    if (this.sourceIndex >= 0) {
      this.elements = this.Source.GetFormDefinition();
      this.edfs.SetFormContent(this.sourceIndex);
    }
  }

  public SetFormContent(pageSize: number = 10) {
    this.Source.page.UpdateSize(pageSize);
    this.edfs.SetFormContent(this.sourceIndex);
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

  viewChange(view: ViewType) {
    this.view = view;
  }

  UpdateElement(elmId = { id: 0, value: '' }) {
  //  this.Source.UpdateRecord(elmId.id, this.edfs);
  } 
  

  Snack(message: string) {

    this.snacker.open(message, 'Close', { duration: 2500, horizontalPosition: 'right', verticalPosition: 'bottom' });
  }
  
  OnStateChange() {
  setTimeout(() =>
    this.messageService.sendMessage(10), 0);
  }
  
  page(code: number) {
    let reload = false;

    switch (code) {
      case 0:
        reload = !this.Source.First();
        break;
      case 1:
        if (this.view == ViewType.detail) {
          reload = !this.Source.Previous();
        }
        else if (this.view == ViewType.table) {
          reload = !this.Source.Previous();
        }
        else if (this.view == ViewType.graphic) {
          reload = true;
          this.Source.PreviousPage();
        }
        break;
      case 2:
        switch (this.view) {
          case ViewType.detail: reload = !this.Source.Next(); break;
          case ViewType.table:  reload = !this.Source.Next(); break;
          case ViewType.graphic:
            reload = true;
            this.Source.NextPage();
            break;
        }
        break;
      case 3:
        reload = !this.Source.Final();
        break;
    }
    if (reload) {
      this.edfs.SetFormContent(this.sourceIndex);
    }
  }
  
}
