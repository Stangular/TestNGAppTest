import { Injectable } from '@angular/core';
import { IElementDefinition, EditElementDefinition, ElementModel } from '../model/definitions/elementDefinition';

@Injectable()
export class ElementDefinitionFactoryService {

  _elms: IElementDefinition<string>[] = [];  // should be _textElms...

  constructor() {

    let m = new ElementModel<string>();
    m.formID = 'projectForm';
    m.fieldID = 'name';
    m.label = 'Name:';
    this._elms.push(new EditElementDefinition<string>(m));
  }

  ElementDefinition(ID: string) {
    return this._elms.find(e => e.FieldID() == ID) || this._elms[0];
  }
}
