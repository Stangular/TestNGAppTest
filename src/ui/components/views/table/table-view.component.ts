import { Component, Input, Output, OnInit, EventEmitter, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormFilteringComponent, FilterDialogData } from '../form/filtering/form-filtering.component';
import { Field } from '../../../../dataManagement/model/field';
import { IRecordService, Records } from '../../../../dataManagement/model/records'
import { ActivatedRoute } from '@angular/router';
import { IElementDefinition, EditElementDefinition, SortOrder } from '../../../../dataManagement/model/definitions/ElementDefinition';
import { ElementDefinitionFactoryService } from 'src/dataManagement/service/elementDefinitionFactoryService';
import { NavigationService } from 'src/models/navigation/navigationService';

@Component({
  selector: 'table-view',
  templateUrl: 'table-view.component.html',
  styleUrls: ['table-view.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class TableViewComponent implements OnInit {
  elmName: string;
  elmId: number;
  fieldIndex: number = 0;
  exact: boolean = true;
  _showFilter: boolean = true;
  sourceIndex: number = -1;
  sourceName: string = '';
  fltrs: number = 2;
  //  @Input() elements: IElementDefinition<string>[] = [];
  // @Input() fields: Field<any>[] = [];
  @Input() source: Records<string>;
  @Output() sortChange: EventEmitter<void> = new EventEmitter<void>();
  @Output() applyFilter: EventEmitter<void> = new EventEmitter<void>();
  sortOrder = SortOrder;
  //filterType = FilterType;


  constructor(public dialog: MatDialog
    , private edfs: ElementDefinitionFactoryService,
    private activatedRoute: ActivatedRoute
    , private navService: NavigationService) {
    this.activatedRoute.params.subscribe(params => {
      this.sourceName = params['sourceName'];
      this.sourceIndex = this.edfs.getSourceIndex(this.sourceName);
      if (this.sourceIndex >= 0) {
        this.source = this.edfs.Source(this.sourceIndex);
      }
    });
  }

  ngOnInit() {}

  GetLowerFilterValue(elm: Field<any>) {
    if (!elm.Filter.LowerValue) { return ''; }
    return elm.Filter.LowerValue || '';
  }

  GetUpperFilterValue(elm: Field<any>) {
    if (!elm.Filter.UpperValue) { return ''; }
    return elm.Filter.UpperValue || '';
  }

  SetFilter(element: Field<any>) {

  //  let form = this.edfs.getRecords(0);
  ////  form.GetUIValue(0);
  //  this.fieldIndex = this.edfs.GetFormFieldIndex(thi, data.fieldId);
  //  //data.element.Label = '';
  //  this.elmName = element.ElementName;
  //  this.elmId = element.ElementID;
  //  element.Filter.UpperValue
  //  let targetForm = this.edfs.getRecords(data.formId);
  //  let flds: any[] = [];
  //  let lower = targetForm.CloneField(this.fieldIndex, this.elmName + '_lower', 1000 + this.elmId);
  //  let upper = targetForm.CloneField(this.fieldIndex, this.elmName + '_upper', 2000 + this.elmId);
  //  lower.SetInitialValue(data.lowerValue);
  //  upper.SetInitialValue(data.upperValue);
  //  flds.push(lower);
  //  flds.push(upper);
  //  this.exact = !data.asContent;
  //  if (data.lowerValue && data.upperValue) {
  //    this.exact = false;
  //  }
  //  else {
  //    this.exact = (data.lowerValue || data.upperValue) ? true : false;
  //  }
  //  form.AddDynamicFields(flds);

  }

  CellData(elm: IElementDefinition, row: number): string {

    //const fld = this.source.Fields.find(f => f.ElementID == elm.ElementID);
    //if (fld) {
    //  return elm.UIValueConvert(fld.Data[row]);
    //}
    return '';
  }
  
  get Data() {
    return this.source.DataFullPage(this.edfs);
  }
  selectRecord(rowNumber: number) {
    this.source.Goto(rowNumber);
  }

  ElementLabel(element: IElementDefinition) {
    return element.Label;
  }

  //SortOrder(element: IElementDefinition) {
  //  return element.Filter.SortOrder();
  //}

  Sort(elm: Field<any>) {
    if (elm) {
      elm.Filter.SetNextSortOrder();
      this.edfs.SetFormContent(this.sourceIndex);
    }
  }

 // SoggleFilter(elm: Field<any>) {

 // //  if (!elm.FilterApplied) {
 //     this.showFilter(elm);
 ////   }
 //   //else {
 //   //  elm.TurnFilterOff();
 //   //  this.edfs.SetFormContent(this.sourceIndex);
 //   //}
 // }

  removeAllFilters() {
    this.source.RemoveAllFilters();
    this.applyFilter.emit();
  }

  ToggleFilterRows() {
    this._showFilter = !this._showFilter;
  }

  get filtersApplied() {
   // let appliedFilters = this.VisibleElements.filter(e => e.FilterApplied);
   // return appliedFilters.length > 0;
    return true;
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

  ToggleIgnoreAllUpper() {
    let s = this.source;
    s.IgnoreAllUpper(!s.HasIgnoreUpper);
    this.edfs.SetFormContent(this.sourceIndex);
  }

  ToggleIgnoreAllLower() {
    let s = this.source;
    s.IgnoreAllLower(!s.HasIgnoreLower);
    this.edfs.SetFormContent(this.sourceIndex);
  }

  get HasLowerFilter() {
    if ( !this._showFilter ) { return false; }
    const elements = this.source.GetFormDefinition();
    return elements.filter(f => (f as Field<any>).Filter.LowerValue != undefined).length > 0;
  }

  get HasUpperFilter() {
    if ( !this._showFilter ) { return false; }
    const elements = this.source.GetFormDefinition();
    return elements.filter(f => (f as Field<any>).Filter.UpperValue != undefined).length > 0;
  }

  ApplyAllFilters(e:any) {
    const elements = this.source.GetFormDefinition();
    //let fltrs = elements.filter(e => e.HasFilter);
    //fltrs.forEach(f => f.ToggleFilter());
    this.applyFilter.emit();
  }

  get VisibleElements() {
    
    let elements = this.source.GetFormDefinition();
    return elements.filter(e => e.Observable);
  //  return elements; //elements.filter(e => e.Label() != ':');
  }

  showFilter(elm: Field<any>): void {
    let fltr = elm.Filter;
    if (!fltr) { return; }
    this._showFilter = true;
    const dialogRef = this.dialog.open(FormFilteringComponent, {
      width: '400px',
      data: {
        upperValue: fltr.ignore_lower ? fltr.UpperValue : undefined,
        lowerValue: fltr.ignore_lower ? fltr.LowerValue : undefined,
        asContent: fltr.asContent,
        fieldId: elm.DataID,
        formId: this.sourceIndex,
        element: elm,
        ignore_lower: fltr.ignore_lower,
        ignore_upper: fltr.ignore_upper
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        elm.setFilter(result.fieldId, result.lowerValue, result.upperValue, result.asContent);
        this.edfs.SetFormContent(this.sourceIndex);
      }
    });

  }
}
