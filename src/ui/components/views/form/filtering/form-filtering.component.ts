import { Component, Inject, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { IElementDefinition, ElementFilter, ElementModel, SortOrder, EditElementDefinition } from '../../../../../dataManagement/model/definitions/ElementDefinition';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ElementDefinitionFactoryService } from 'src/dataManagement/service/elementDefinitionFactoryService';


export interface FilterDialogData {
  upperValue: any;
  lowerValue: any;
  asContent: boolean;
  fieldId: string;
  formId: number;
  element: IElementDefinition;
  ignore: boolean;
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
  selections: IElementDefinition[] = [];
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
  // selectedLowerElement: IElementDefinition;
  // selectedUpperElement: IElementDefinition;
  label: string = '';
  fieldIndex: number = 0;
  inclusive: boolean = true;
  exact: boolean = true;
  elmName: string;
  elmId: number;

  @Input() cancelLabel: string = 'Cancel';
  @Input() okLabel: string = 'Apply';

  @Input() form;
  @Output() applyfilter: EventEmitter<number> = new EventEmitter<number>();
  constructor(public dialogRef: MatDialogRef<FormFilteringComponent>,
    public edfs: ElementDefinitionFactoryService,
    @Inject(MAT_DIALOG_DATA) public data: FilterDialogData) {

    //data.element.Filter.FieldId = data.element.Filter.FieldId + '_lowerfilter';
    this.label = data.element.Label;
    this.fieldIndex = this.edfs.GetFormFieldIndex(data.formId, data.fieldId);
    //data.element.Label = '';
    this.elmName = data.element.ElementName;
    this.elmId = data.element.ElementID;

    let form = this.edfs.getRecords(0);
    let targetForm = this.edfs.getRecords(data.formId);
    let flds: any[] = [];
    let lower = targetForm.CloneField(this.fieldIndex, this.elmName + '_lower', 1000 + this.elmId);
    let upper = targetForm.CloneField(this.fieldIndex, this.elmName + '_upper', 2000 + this.elmId);
    lower.SetInitialValue(data.lowerValue);
    upper.SetInitialValue(data.upperValue);
    flds.push(lower);
    flds.push(upper);
    this.exact = !data.asContent;
    if (data.lowerValue && data.upperValue) {
      this.exact = false;
    }
    else {
      this.exact = (data.lowerValue || data.upperValue) ? true : false;
    }
    form.AddDynamicFields(flds);
  }

  get IsSameValue() {
    return false;
  }

  FilterData() {
    this.data.asContent = this.exact;
    let form = this.edfs.getRecords(0);
    this.data.lowerValue = form.Field(0).CurrentValue();
    this.data.upperValue = this.data.lowerValue;
    if (!this.exact) {
      this.data.upperValue = form.Field(1).CurrentValue();
    }
    this.data.fieldId = this.label;
    form.Field(0).SetInitialValue(this.data.lowerValue);
    form.Field(1).SetInitialValue(this.data.upperValue);
    return this.data;
  }

  get DialogTitle() {
    return 'Define Filter Parameters for ' + this.label;
  }

  RemoveFromField() { }

  RemoveAll() { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onIgnore(): void {
    this.data.ignore = true;
  }

  onRemove() {
    this.data.asContent = this.exact;
    let form = this.edfs.getRecords(0);
    this.data.lowerValue = "";
    this.data.upperValue = "";
    this.data.fieldId = this.label;
    form.Field(0).SetInitialValue(this.data.lowerValue);
    form.Field(1).SetInitialValue(this.data.upperValue);
    //this.dialogRef.close();
    //return this.data;
  }

}
