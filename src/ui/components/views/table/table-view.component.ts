import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormFilteringComponent } from '../form/filtering/form-filtering.component';
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

  constructor(public dialog: MatDialog) { }

  CellData(elm: IElementDefinition, row: number): string {

    //const fld = this.source.Fields.find(f => f.ElementID == elm.ElementID);
    //if (fld) {
    //  return elm.UIValueConvert(fld.Data[row]);
    //}
    return '';
  }

  selectRecord(rowNumber: number) {
    this.source.Goto(rowNumber);
  }

  GotoDetail(rowNumber: number) {
    this.selectRecord(rowNumber);
    this.gotoDetail.emit(1);
  }

  ElementLabel(element: IElementDefinition) {
    return "later!"; //element.Label();
  }

  Sort(elm: IElementDefinition) {
    if (elm) {
   //   elm.SetNextSortOrder();
      this.sortChange.emit();
    }
  }

  toggleFilter(elm: EditElementDefinition<any>) {

    //if (!elm.FilterApplied) {
    //  this.showFilter(elm);
    //}
    //else {
    //  elm.TurnFilterOff();
    //  this.applyFilter.emit();
    //}
  }

  removeAllFilters() {
    this.source.RemoveAllFilters();
    this.applyFilter.emit();
  }

  get filtersApplied() {
    let appliedFilters = this.VisibleElements.filter(e => e.FilterApplied);
    return appliedFilters.length > 0;
  }

  saveFilters() {
  }

  removeFilter(elm: EditElementDefinition<any>) {
 //   elm.setFilter(undefined, undefined, false);
    this.applyFilter.emit();
  }

  get HasFilter() {
    const elements = this.source.GetFormDefinition();
    //let fltrs = elements.filter(e => e.HasFilter);
    //return fltrs.length > 0;
    return false;
  }

  ApplyAllFilters(e:any) {
    const elements = this.source.GetFormDefinition();
    //let fltrs = elements.filter(e => e.HasFilter);
    //fltrs.forEach(f => f.ToggleFilter());
    this.applyFilter.emit();
  }

  get VisibleElements() {
    const elements = this.source.GetFormDefinition();
    return null; //elements.filter(e => e.Label() != ':');
  }

  showFilter(elm: EditElementDefinition<any>): void {
    //let fltr = elm.getFilter();
    //if (!fltr) {  return; }
    //const dialogRef = this.dialog.open(FormFilteringComponent, {
    //  width: '400px',
    //  data: { upperValue: fltr.UpperValue, lowerValue: fltr.LowerValue, asContent: elm.getFilter().asContent, elementLowerModel: elm.CloneModel, elementUpperModel: elm.CloneModel }
    //});

    //dialogRef.afterClosed().subscribe(result => {
    //  elm.setFilter(result.lowerValue, result.upperValue, result.asContent);
   
    //  this.applyFilter.emit();
    //});
  }
}
