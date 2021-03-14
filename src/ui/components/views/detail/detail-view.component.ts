import { Component, Input, Output, Renderer2, EventEmitter } from '@angular/core';
import { IElementDefinition } from '../../../../dataManagement/model/definitions/ElementDefinition';
import { ElementDefinitionFactoryService } from 'src/dataManagement/service/elementDefinitionFactoryService';


export enum ActionType {
  save = 0,
  create = 1,
  update = 2,
  remove = 3,
  undo = 4
}

@Component({
  selector: 'detail-view',
  templateUrl: 'detail-view.component.html',
  styleUrls: ['detail-view.component.css']
})
export class DetailViewComponent {

  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  diameter = 30;

  actionType = ActionType;
  @Input() formDirty: boolean = false;
  @Input() servicing: boolean = false;
  @Input() formNew: boolean = false;
  @Input() formID: number;

  // @Input() elements: IElementDefinition<any>[] = [];
  @Input() form;
  @Output() action: EventEmitter<ActionType> = new EventEmitter<ActionType>();
  @Output() blur: EventEmitter<{ id: string, value: string }> = new EventEmitter<{ id: string, value: string }>();
  constructor(private source: ElementDefinitionFactoryService) {}

  onAction(action: ActionType) {
    this.action.emit(action);
  }

  get displayElements() {
    let records = this.source.getRecords(this.formID);
    return records.getElements();
  }

  onBlur(elmId = { id: '', value: '' }) {
    this.blur.emit(elmId);
  }
  
}
