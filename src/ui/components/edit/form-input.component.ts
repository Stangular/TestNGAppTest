import { Component, Input, Output, OnInit, AfterContentChecked,  EventEmitter, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IElementDefinition, ElementModel, IElementModel } from '../../../dataManagement/model/definitions/ElementDefinition';
import { ElementDefinitionFactoryService } from 'src/dataManagement/service/elementDefinitionFactoryService';
import { Validation } from 'src/dataManagement/model/definitions/Validation';

@Component({
  selector: 'input-edit',
  templateUrl: 'form-input.component.html',
  styleUrls: ['./form-input.component.css']
})

export class FormInputElementComponent implements OnInit, AfterContentChecked {
  private mRef: IElementModel;
  private eRef: IElementDefinition;
  private valid: boolean = false;
  private validMessage: string = 'zxcvzcvzc';
  private _validation: Validation = new Validation();

  value: string = '';
  hasFocus: boolean = false;
  @Input() modelIndex: number;
  @Input() formIndex: number;
  @Input() fieldIndex: number;
  @Input() showLabel: boolean = true;


  constructor(private edfs: ElementDefinitionFactoryService) {}
 
  get editMode() {
    return true;
  }

  onUpdate() {
    this.hasFocus = false;
    let validation = this.mRef.NextCharacterValidation(this.eRef.ElementName);
    this._validation.valid = validation.valid;
    this._validation.message = validation.message;
    if (this._validation.valid) {
      this.edfs.UpdateRecord(this.eRef.ModelID, this.formIndex, this.fieldIndex);
    }
  }

  ngAfterContentChecked() {
 
    this.valid = this._validation.valid;
    this.validMessage = this._validation.message;

  }

  ngOnInit() {
    
    this.eRef = this.edfs.Element(this.formIndex, this.fieldIndex);
    this.mRef = this.edfs.Model(this.eRef.ModelID);
   // this._validation = this.mRef.Validate(this.eRef.CurrentValue());
  }

  get IsValid(): boolean {
  //  console.error(this.valid ? '*valid:' + this.eRef.ElementName : '*not valid:'+ this.eRef.ElementName);
    return this.valid;
  }

  get InvalidMessage(): string {
    return this.valid ? '' : this.validMessage;
  }

  keyUp(e: any) {
    let validation = this.mRef.NextCharacterValidation(this.eRef.ElementName);
    this._validation.valid = validation.valid;
    this._validation.message = validation.message;
  }

  get Label() {
    return this.eRef.Label;
  }

  get Type() {
    return this.mRef.Type();
  }

  UIConvert() {
    if (this.hasFocus) {
      return;
    }
    let r = this.mRef.UIConvert(this.eRef);
    return r;
  }

  onFocus() {
    this.hasFocus = true;
  }

  IfValid() {

  }
  //Init() { }
  //   mask = [/\d/, /\d/, /\d/, /\d/]; // ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  //get isValid() {
  //  return true; //this.edfs.IsValidValue(this.modelIndex, this.formIndex, this.fieldIndex);
  //}
}
