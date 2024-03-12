import { Component, Input, Output, Renderer2, EventEmitter, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ElementDefinitionFactoryService } from 'src/dataManagement/service/elementDefinitionFactoryService';
import { EntityRemoveModel } from '../form/form.component';
import { DataHTTPService } from 'src/dataManagement/service/dataHTTP.service';
import { AcknowlegeDeleteDialog } from '../form/dialogs/acknowledgeDelete/acknowledge-delete-dialog.component';
import { MatSnackBar, MatDialog } from '@angular/material';


export enum ActionType {
  save = 0,
  create = 1,
  update = 2,
  remove = 3,
  undo = 4
}

@Component({
  selector: 'detail-view',
  templateUrl: 'detail-view.component.html',
  styleUrls: ['detail-view.component.css']
})
export class DetailViewComponent implements OnDestroy {
  [x: string]: any;
  rowspan = "3";
  colspan = "3";
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  diameter = 30;
  sourceIndex: number = -1;

  actionType = ActionType;
  @Input() formDirty: boolean = false;
  @Input() servicing: boolean = false;
  @Input() formNew: boolean = false;
  @Input() elements: any;

  // @Input() elements: IElementDefinition<any>[] = [];
  @Input() form;
  @Output() action: EventEmitter<ActionType> = new EventEmitter<ActionType>();
  @Output() blur: EventEmitter<{ id: string, value: string }> = new EventEmitter<{ id: string, value: string }>();
  constructor(
    private source: ElementDefinitionFactoryService,
    private activatedRoute: ActivatedRoute
    , private snacker: MatSnackBar
    , public dialog: MatDialog
    , private httpService: DataHTTPService) {

      this.activatedRoute.params.subscribe(params => {
        let sourceName = params['sourceName'];
        this.sourceIndex = this.source.getSourceIndex(sourceName);
        if (this.sourceIndex >= 0) {
          this.elements = this.Source.GetFormDefinition();
        }
      });
  }

  onAction(action: ActionType) {
    this.source.NewRecord(this.sourceIndex);
    this.formDirty = true;
  }

  get Elements() {
    let elms = this.elements.filter(e => e.Observable);
    return elms;
  }

  OnRemove() {
    this.acknowledgeDelete();
  }

  get Source() {

    return this.source.Source(this.sourceIndex);
  }

  //get displayElements() {
  //  let elms = this.source.getRecords(this.formID);
  //  return elms;
  //}

  onBlur(elmId = { id: '', value: '' }) {
    this.blur.emit(elmId);
  }

  ngOnDestroy(): void {
    // confirm("Unsaved changes exist.  Do you wish to close and lose current changes?")
    console.error('Destroy Detail');
  }


  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event) {
    //   console.error('Destroy Detail');
  }

  saveSuccess(data: any) {
  //  this.source.LoadData(data.content, [], data.recordCount);
    this.saveing = false;
    this.Snack('Save succeeded');
  }

  saveFail(data: any) {
    this.saveing = false;
    this.Snack(data.error || 'Form save Failed for unknown reason');
  }

  deleteSuccess(data: any) {
  //  this.SetFormContent(this.Source.PageSize);
    this.Source.LoadData(data.content, [], data.recordCount);
    this.saveing = false;
    this.Snack('Form removed');
  }

  deleteFail(data: any) {
    this.saveing = false;
    this.Snack('Form removal failed');
  }

  Snack(message: string) {

    this.snacker.open(message, 'Close', { duration: 2500, horizontalPosition: 'right', verticalPosition: 'bottom' });
  }

  SaveChanges() {

    let v = this.Source.GetFieldValue('Id');
    if (!v) {
      this.httpService.postContent(this.source.OutputCurrentValues(this.sourceIndex)).subscribe(
        data => { this.saveSuccess(data) },
        err => { this.saveFail(err) });
    }
    else {
    this.source
      this.httpService.updateContent(this.source.OutputCurrentValues(this.sourceIndex)).subscribe(
        data => { this.saveSuccess(data) },
        err => { this.saveFail(err) });
    }
  }

  acknowledgeDelete(): void {
    const dialogRef = this.dialog.open(AcknowlegeDeleteDialog, {
      width: '250px',
      data: { result: 'remove', why: '', question: 'Gonna lose it!' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if ('remove' == result.result) {
        let model = new EntityRemoveModel();
        model.Id = this.Source.GetFieldValue('Id');
        model.why = result.why;
        model.FormName = this.Source.SourceID;
        this.httpService.deleteContent(model).subscribe(
          data => { this.deleteSuccess(data) },
          err => { this.deleteFail(err) });
      }
      //   this.httpService.


    });
  }
}
