import { Component, Inject, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { IElementDefinition, ElementFilter, ElementModel, SortOrder, FilterType, EditElementDefinition } from '../../../../../dataManagement/model/definitions/ElementDefinition';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


export interface FilterDialogData {
  upperValue: any;
  lowerValue: any;
  asContent: boolean;
  elementLowerModel: ElementModel<any>;
  elementUpperModel: ElementModel<any>;
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
  selectedLowerElement: IElementDefinition<any>;
  selectedUpperElement: IElementDefinition<any>;
  label: string = '';

  asContent: boolean = false;
  inclusive: boolean = true;
  exact: boolean = true;
  @Input() cancelMessage: string = 'No';
  @Input() okMessage: string = 'Ok';

  @Input() form;
  @Output() applyfilter: EventEmitter<number> = new EventEmitter<number>();
  constructor(public dialogRef: MatDialogRef<FormFilteringComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FilterDialogData) {
    data.elementLowerModel.fieldID = data.elementLowerModel.fieldID + '_lowerfilter';
    this.label = data.elementLowerModel.label;

    data.elementLowerModel.label = '';
    this.selectedLowerElement = new EditElementDefinition(data.elementLowerModel);
    this.selectedLowerElement.UpdateCurrentValue(data.elementLowerModel.filter.LowerValue || data.elementLowerModel.defaultValue);

    data.elementUpperModel.fieldID = data.elementUpperModel.fieldID + '_upperfilter';

    this.label = data.elementUpperModel.label;
    data.elementUpperModel.label = '';

    this.selectedUpperElement = new EditElementDefinition(data.elementUpperModel);
    this.selectedUpperElement.UpdateCurrentValue(data.elementUpperModel.filter.UpperValue || data.elementUpperModel.defaultValue);
    this.exact = this.selectedUpperElement.CurrentValue() == this.selectedLowerElement.CurrentValue();
  
 }

  get IsSameValue() {
    this.selectedLowerElement.UpdateFromUI();
    this.selectedUpperElement.UpdateFromUI();
   return this.selectedUpperElement.CurrentValue() == this.selectedLowerElement.CurrentValue();
  }
 
  get FilterData() {
    this.selectedLowerElement.UpdateFromUI();
    this.selectedUpperElement.UpdateFromUI();
    this.selectedLowerElement.Type();
    this.data.lowerValue = this.selectedLowerElement.CurrentValue();
    this.data.upperValue = this.selectedUpperElement.CurrentValue();
    this.data.asContent = this.asContent;
    if (this.exact) {
      this.data.upperValue = this.data.lowerValue;
    }
    return this.data;
  }
  
  get DialogTitle() {
    return 'Define Filter Parameters for ' + this.label;
  }

  RemoveFromField() {

  }

  RemoveAll() {

  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

}
