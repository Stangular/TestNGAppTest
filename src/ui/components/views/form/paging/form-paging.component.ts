import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ViewType } from '../form.component';
@Component({
  selector: 'form-pager',
  templateUrl: 'form-paging.component.html',
  styleUrls: ['form-paging.component.css']
})
export class FormPagingComponent {

  @Input() formDirty: boolean = false;
  @Input() recordCount: number;
  @Input() recordNumber: number;
  @Output() pageaction: EventEmitter<number> = new EventEmitter<number>();
  @Output() viewaction: EventEmitter<ViewType> = new EventEmitter<ViewType>();
  public viewType = ViewType;

  constructor() { }

  get firstRecord() {
    return this.recordNumber == 0;
  }

  get finalRecord() {
    return this.recordNumber == this.recordCount - 1;
  }

  view(view: ViewType) {
    this.viewaction.emit(view);
  }

  page(code: number) {
    this.pageaction.emit(code);
  }
}
