import { Component, OnInit, Input, AfterContentChecked, Output, EventEmitter } from '@angular/core';
import { IElementDefinition, IElementModel } from 'src/dataManagement/model/definitions/ElementDefinition';
import { FormControl } from '@angular/forms';
import { A_Sequence } from 'src/dataManagement/model/sequencing/sequence';
import { ElementDefinitionFactoryService } from 'src/dataManagement/service/elementDefinitionFactoryService';
import { Validation } from 'src/dataManagement/model/definitions/Validation';

@Component({
  selector: 'check-selector',
  templateUrl: './check-selector.component.html',
  styleUrls: ['./check-selector.component.css']
})
export class CheckSelectorComponent implements OnInit, AfterContentChecked  {
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

  ngOnInit() {
    this.eRef = this.edfs.Element(this.formIndex, this.fieldIndex);
    this.mRef = this.edfs.Model(this.eRef.ModelID);
}

  ngAfterContentChecked() {

    this.valid = this._validation.valid;
    this.validMessage = this._validation.message;

  }
  selectState(item, index) {
    return true;
   // this.OnSelect.emit({ id: this.source.ElementName, value: this.source.CurrentValue() });
  }

  get Label() {
    return this.eRef.Label;
  }

  UIConvert() {
    //if (this.hasFocus) {
    //  return;
    //}
    let r = this.mRef.UIConvert(this.eRef);
    return r;
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
}
