import { Component, Input, Output, Renderer2, EventEmitter } from '@angular/core';
import { IElementDefinition } from '../../../../dataManagement/model/definitions/ElementDefinition';


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
  actionType = ActionType;
  @Input() formDirty: boolean = false;
  @Input() formNew: boolean = false;
  @Input() elements: IElementDefinition<any>[] = [];
  @Input() form;
  @Output() action: EventEmitter<ActionType> = new EventEmitter<ActionType>();
  @Output() blur: EventEmitter<{ id: string, value: string }> = new EventEmitter<{ id: string, value: string }>();
  constructor() {}

  onAction(action: ActionType) {
    this.action.emit(action);
    
  }

  get displayElements() {
    return this.elements.filter(e => e.Label() != ':');
  }
  onBlur(elmId = { id: '', value: '' }) {
    this.blur.emit(elmId);
  }
  
}
