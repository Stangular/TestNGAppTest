import { Component, Inject, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { IElementDefinition, ElementFilter, ElementModel, SortOrder, FilterType, EditElementDefinition } from '../../../../../dataManagement/model/definitions/ElementDefinition';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


export interface FilterDialogData {
  value: any;
  operation: any;
  elementModel: ElementModel<any>;
}



export interface FilterValues {
  type: number;
  label: string;
}

@Component({
  selector: 'form-filter',
  templateUrl: 'form-filtering.component.html',
  styleUrls: ['form-filtering.component.css']
})
export class FormFilteringComponent {
  selections: IElementDefinition<any>[] = [];
  // selectedElementFilter: IElementDefinition<any>;
  sortOrder = SortOrder;
//  selectedFilterType: any;
  pageSize: number = 10;
  filterSelection: FilterValues[] = [
    { type: 0, label: 'none' },
    { type: 1, label: 'less than' },
    { type: 2, label: 'less than or equal to' },
    { type: 3, label: 'equal to' },
    { type: 4, label: 'greater than or equal to' },
    { type: 5, label: 'greater than' },
    { type: 6, label: 'contains' },
    { type: 7, label: 'does not contain' }
  ];

  // @Input() elements: IElementDefinition<any>[] = [];
  selectedElement: IElementDefinition<any>;
  label: string = '';
  @Input() cancelMessage: string = 'No';
  @Input() okMessage: string = 'Ok';

  @Input() form;
  @Output() applyfilter: EventEmitter<number> = new EventEmitter<number>();
  constructor(public dialogRef: MatDialogRef<FormFilteringComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FilterDialogData) {
    data.elementModel.fieldID = data.elementModel.fieldID + '_filter';
    this.label = data.elementModel.label;
    data.elementModel.label = '';
    this.selectedElement = new EditElementDefinition(data.elementModel);
    this.selectedElement.UpdateCurrentValue(data.elementModel.defaultValue);
  }

  get FilterData() {
    this.data.value = this.selectedElement.CurrentValue();
    return this.data;
  }
  //get filterSelection() {
  //  return [
  //    { type: 0, label: 'none' },
  //    { type: 1, label: 'less than' },
  //    { type: 2, label: 'less than or equal to' },
  //    { type: 3, label: 'equal to' },
  //    { type: 4, label: 'greater than or equal to' },
  //    { type: 5, label: 'greater than' },
  //    { type: 6, label: 'contains' },
  //    { type: 7, label: 'does not contain' }
  //  ];
  //}

  //onFieldChange(event: any): void {
  //  this.selectedElement = event.value;
  //  let fid = event.value._model.fieldID + '_filter';
  //  this.selectedElementFilter = this.selections.find(s => s.FieldID() == fid);
  //  if (!this.selectedElementFilter) {
  //    let m = new ElementModel(event.value._model);
  //    m.fieldID = fid;
  //    m.label = '';
  //    this.selectedElementFilter = new EditElementDefinition(m);
  //    this.selections.push(this.selectedElementFilter);
  //  }
  //  this.selectedElementFilter.UpdateCurrentValue(event.value.CurrentValue());
  //}

  Apply() {
    if (this.selectedElement) {
      this.applyfilter.emit(this.pageSize);
    }
  }

  get DialogTitle() {
    return 'Define Filter Parameters for ' + this.label;
  }

  UpdateFilter(elmId = { id: '', value: '' }) {
    this.selectedElement.setFilter(
      this.selectedElement.UpdateFromUI()
      , this.data.operation.type);
  }

  RemoveFromField() {

  }

  RemoveAll() {

  }

  //get viewableFields() {
  //  return this.elements.filter(f => f.Label() != ':') || [];
  //}

  Sort() {
    if (this.selectedElement) {
      this.selectedElement.SetNextSortOrder();
    }
  }

  get ElementSelected() {
    if (this.selectedElement) {
      return true;
    }
    return false;
  }

  get DefaultValue() {
    if (!this.selectedElement) {
      return '';
    }
    return this.selectedElement.CurrentValue || '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
