import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { IElementDefinition, ElementFilter, SortOrder } from '../../../../../dataManagement/model/definitions/ElementDefinition';

@Component({
  selector: 'form-filter',
  templateUrl: 'form-filtering.component.html',
  styleUrls: ['form-filtering.component.css']
})
export class FormFilteringComponent {
  selectedElement: IElementDefinition<any>;
  sortOrder = SortOrder;
  @Input() elements: IElementDefinition<any>[] = [];
  @Input() form;
 //@Output() Apply
  constructor() { }

  get filterSelection() {
    return ElementFilter.FilterList;
  }

  Apply() {
     
  }

  RemoveFromField() {

  }

  RemoveAll() {

  }

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
}
