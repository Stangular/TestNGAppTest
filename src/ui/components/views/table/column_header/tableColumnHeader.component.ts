import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
//import { IElementDefinition, EditElementDefinition, SortOrder } from '../../../../dataManagement/model/definitions/ElementDefinition';
import { ElementDefinitionFactoryService } from 'src/dataManagement/service/elementDefinitionFactoryService';
import { NavigationService } from 'src/models/navigation/navigationService';

@Component({
  selector: 'table-column-header',
  templateUrl: 'tableColumnHeader.component.html',
  styleUrls: ['tableColumnHeader.component.css']
})

export class TableColumnHeaderComponent {
  
  constructor() {}
  

  //SortOrder(element: IElementDefinition) {
  //  return element.Filter.SortOrder();
  //}

  //Sort(elm: Field<any>) {
  //  if (elm) {
  //    elm.Filter.SetNextSortOrder();
  //    this.edfs.SetFormContent(this.sourceIndex);
  //  }
  //}

  //toggleFilter(elm: Field<any>) {

  //  if (!elm.FilterApplied) {
  //    this.showFilter(elm);
  //  }
  //  else {
  //    elm.TurnFilterOff();
  //    this.edfs.SetFormContent(this.sourceIndex);
  //  }
  //}

  //removeAllFilters() {
  //  this.source.RemoveAllFilters();
  //  this.applyFilter.emit();
  //}

  //get filtersApplied() {
  //  // let appliedFilters = this.VisibleElements.filter(e => e.FilterApplied);
  //  // return appliedFilters.length > 0;
  //  return true;
  //}

  //saveFilters() {
  //}

  //removeFilter(elm: EditElementDefinition<any>) {
  //  //   elm.setFilter(undefined, undefined, false);
  //  this.applyFilter.emit();
  //}

  //get HasFilter() {
  //  const elements = this.source.GetFormDefinition();
  //  //let fltrs = elements.filter(e => e.HasFilter);
  //  //return fltrs.length > 0;
  //  return false;
  //}

  //ApplyAllFilters(e: any) {
  //  const elements = this.source.GetFormDefinition();
  //  //let fltrs = elements.filter(e => e.HasFilter);
  //  //fltrs.forEach(f => f.ToggleFilter());
  //  this.applyFilter.emit();
  //}

  //get VisibleElements() {

  //  let elements = this.source.GetFormDefinition();
  //  return elements.filter(e => e.Observable);
  //  //  return elements; //elements.filter(e => e.Label() != ':');
  //}

  //showFilter(elm: Field<any>): void {
  //  let fltr = elm.Filter;
  //  if (!fltr) { return; }

  //  const dialogRef = this.dialog.open(FormFilteringComponent, {
  //    width: '400px',
  //    data: {
  //      upperValue: fltr.UpperValue,
  //      lowerValue: fltr.LowerValue,
  //      asContent: fltr.asContent,
  //      fieldId: elm.DataID,
  //      formId: this.sourceIndex,
  //      element: elm
  //    }
  //  });

  //  dialogRef.afterClosed().subscribe(result => {
  //    elm.setFilter(result.fieldId, result.lowerValue, result.upperValue, result.asContent);

  //    this.edfs.SetFormContent(this.sourceIndex);
  //  });
  //}
}
