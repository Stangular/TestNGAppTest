import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IElementDefinition } from '../../../dataManagement/model/definitions/ElementDefinition';
import { IListItem } from '../../../dataManagement/model/list/list';
import { AppDataService } from '../../../dataManagement/service/appData.service';
import { AppDataModel, ListItem } from '../../../dataManagement/model/data/appData.model';
import {
  MatSelectChange,
} from '@angular/material';

/**
 * @title Basic select
 */
@Component({
  selector: 'select-list',
  templateUrl: 'form-list-select.component.html'
})
export class SelectListComponent implements OnInit {

  List: ListItem[] = [];
  @Input() element: IElementDefinition<string>;
  @Input() form: FormGroup;
  @Input() actionClass: string = '';
  @Input() currentItem: number = 0;
  @Output() action: EventEmitter<number> = new EventEmitter<number>();
  constructor(private appDataService: AppDataService) { }

  ngOnInit() {

    this.List = this.appDataService.GetList(this.element.FieldID());
  }

  SelectItem(item: MatSelectChange) {
    this.action.emit(item.value);

    //  alert(item.value);

  }

  get isValid() { return true; }

}
