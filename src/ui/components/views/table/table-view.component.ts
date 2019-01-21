import { Component, Input, Output, EventEmitter} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormFilteringComponent  } from '../form/filtering/form-filtering.component';
import { Field } from '../../../../dataManagement/model/field';
import { IRecordService, Records } from '../../../../dataManagement/model/records'
import { IElementDefinition, EditElementDefinition, SortOrder, FilterType } from '../../../../dataManagement/model/definitions/ElementDefinition';

@Component({
  selector: 'table-view',
  templateUrl: 'table-view.component.html',
  styleUrls: ['table-view.component.css']
})
export class TableViewComponent {

//  @Input() elements: IElementDefinition<string>[] = [];
 // @Input() fields: Field<any>[] = [];
  @Input() source: Records<string>;
  @Output() gotoDetail: EventEmitter<number> = new EventEmitter<number>();
  @Output() sortChange: EventEmitter<void> = new EventEmitter<void>();
  @Output() applyFilter: EventEmitter<void> = new EventEmitter<void>();
  sortOrder = SortOrder;
  filterType = FilterType;

  constructor(
     public dialog: MatDialog) {
  }

  CellData(elm: IElementDefinition<string>, row: number): string {

    const fld = this.source.Fields.find(f => f.FieldId == elm.FieldID());
    if (fld) {
      return elm.UIValueConvert(fld.Data[row]);
    }
    return '';
  }

  selectRecord(rowNumber: number) {
    this.source.Goto(rowNumber);
  }

  GotoDetail(rowNumber: number) {
    this.selectRecord(rowNumber);
    this.gotoDetail.emit(1);
  }

  ElementLabel(element: IElementDefinition<string>) {
    return element.Label();
  }

  Sort(elm: IElementDefinition<string>) {
    if (elm) {
      elm.SetNextSortOrder();
      this.sortChange.emit();
    }
  }

  toggleFilter(elm: EditElementDefinition<any>) {
    this.showFilter(elm);
  }

  removeFilter(elm: EditElementDefinition<any>) {
    elm.Model.filter.Remove();
    this.applyFilter.emit();
  }

  get VisibleElements() {
    const elements = this.source.GetFormDefinition();
    return elements.filter(e => e.Label() != ':');
  }

  showFilter(elm: EditElementDefinition<any>): void {
    const dialogRef = this.dialog.open(FormFilteringComponent, {
      width: '400px',
      data: { value: '', operation: '', elementModel: elm.Model }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The Filter Dialog closed...');
      elm.setFilter(result.value, result.operation.type);
      this.applyFilter.emit();
      //if ('remove' == result.result) {
      //  let model = new EntityRemoveModel();
      //  model.Id = this.source.GetFieldValue('id');
      //  model.why = result.why;
      //  this.httpService.deleteContent(model).subscribe(
      //    data => { this.deleteSuccess(data) },
      //    err => { this.deleteFail(err) });
      //}
      //   this.httpService.


    });
  }
}
