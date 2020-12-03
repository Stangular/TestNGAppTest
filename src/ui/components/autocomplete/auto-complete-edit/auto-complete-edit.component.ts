import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { IListItem,ListItem, List} from 'src/dataManagement/model/list/list';

@Component({
  selector: 'app-auto-complete-edit',
  templateUrl: './auto-complete-edit.component.html',
  styleUrls: ['./auto-complete-edit.component.css']
})
export class AutoCompleteEditComponent implements OnInit {
  @Input() label: string = '';
  @Input() source: List;
  @Input() control: FormControl;
  @Output() AddNew: EventEmitter<string> = new EventEmitter<string>();
  @Output() SearchSelection: EventEmitter<string> = new EventEmitter<string>();
  @Output() RemoveSelection: EventEmitter<string> = new EventEmitter<string>();
  @Output() ClearSelection: EventEmitter<string> = new EventEmitter<string>();

  items: Observable<IListItem[]>;
  selection: string = '';
  selectionId: string = '';
  private state: number = 0;

  constructor() { }

  ngOnInit() {
    this.items = this.control.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterState(value))
      );
  }

  get State(): number {
    return this.state;
  }

  Add() {
    this.AddNew.emit(this.selection);
  }

  Remove() {
    this.RemoveSelection.emit(this.selectionId);
  }

  Search() {
    this.SearchSelection.emit(this.selectionId);
  }

  Clear() {
    this.ClearSelection.emit(this.selectionId);
  }

  Sort() {

  }

  private _filterState(item: string): IListItem[] {

    if (!item) { return this.source.Items; }
    this.state = 0;
    this.selection = item;
    this.selectionId = '';
    let result = this.source.FilterContent(item);
    if (result.length == 1) {
      this.selectionId = result[0].ID();
    }
    if (item.length <= 0) {
      this.state = 0;
    }
    else {
      let n = this.source.IndexOfContent(item);
      this.state = n < 0 ? 1 : 2;
    }

    return result;
  }
}
