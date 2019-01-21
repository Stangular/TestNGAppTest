import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ViewType, PagingMode } from '../form.component';


@Component({
  selector: 'form-pager',
  templateUrl: 'form-paging.component.html',
  styleUrls: ['form-paging.component.css']
})
export class FormPagingComponent {
  
  pageSizeModel: number = 10;
  @Input() mode: PagingMode = PagingMode.byRecord; 
  @Input() formDirty: boolean = false;
  @Input() recordCount: number;
  @Input() pageCount: number;
  @Input() recordNumber: number;
  @Input() pageNumber: number;
  @Input() pageSize: number;
  @Output() pageaction: EventEmitter<number> = new EventEmitter<number>();
  @Output() pagesizeOut: EventEmitter<number> = new EventEmitter<number>();
  @Output() viewaction: EventEmitter<ViewType> = new EventEmitter<ViewType>();

  public viewType = ViewType

  constructor() { }

  changePageSize(size: string) {
    this.pagesizeOut.emit(parseInt(size));
  }

  get prevDisabled() {
    if (this.formDirty) { return true;}
    if (this.mode == PagingMode.byRecord) {
      return this.firstRecord;
    }
    else if(this.mode == PagingMode.byPage) {
      return this.firstPage;
    }
  }

  get sizeOptions() {
    let options = [5, 10, 25, 50, 100, 200];
    options = options.filter(i => i <= this.recordCount);
    let i = options.findIndex(i => i == this.recordCount);
    if (i < 0) {
      options.push(this.recordCount);
    }
    return options;
  }

  get nextDisabled() {
    if (this.formDirty) { return true; }
    if (this.mode == PagingMode.byRecord) {
      return this.finalRecord;
    }
    else if(this.mode == PagingMode.byPage) {
      return this.finalPage;
    }
  }

  get firstPage() {
    return this.pageNumber == 0;
  }

  get finalPage() {
    return this.pageNumber == this.pageCount - 1;
  }

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
