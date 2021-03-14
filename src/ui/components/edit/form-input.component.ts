import { Component, Input, Output, OnInit, EventEmitter, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IElementDefinition, ElementModel, IElementModel } from '../../../dataManagement/model/definitions/ElementDefinition';
import { ElementDefinitionFactoryService } from 'src/dataManagement/service/elementDefinitionFactoryService';

@Component({
  selector: 'input-edit',
  templateUrl: 'form-input.component.html'
})

export class FormInputElementComponent implements OnInit {
  private mRef: IElementModel;
  private eRef: IElementDefinition;
  value: string = '';
  @Input() modelIndex: number;
  @Input() formIndex: number;
  @Input() fieldIndex: number;
  
  constructor(private edfs: ElementDefinitionFactoryService) {
    this.mRef = this.edfs.Model(this.modelIndex);
    this.eRef = this.edfs.Element(this.formIndex, this.fieldIndex);
  }
 
  get editMode() {
    return true;
  }

  onUpdate() {
    this.edfs.UpdateRecord(this.modelIndex, this.formIndex, this.fieldIndex);
  }

  ngOnInit() {}

  //Init() { }
  //   mask = [/\d/, /\d/, /\d/, /\d/]; // ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  get isValid() {
    return true; //this.edfs.IsValidValue(this.modelIndex, this.formIndex, this.fieldIndex);
  }
}
