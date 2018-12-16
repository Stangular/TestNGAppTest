import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IElementDefinition} from '../../../dataManagement/model/definitions/elementDefinition';

@Component({
    selector: 'input-edit',
    templateUrl: 'form-input.component.html'
})

export class FormInputElementComponent implements OnInit {
    @Input() element: IElementDefinition<string>;
 //   @Input() form: FormGroup;
    @Input() actionClass = '';
    @Output() action: EventEmitter<string> = new EventEmitter<string>();
    constructor() {}

    onAction(value: HTMLElement) {
        this.action.emit(this.actionClass);
    }

    ngOnInit(){}

    Init() {}
    //   mask = [/\d/, /\d/, /\d/, /\d/]; // ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    get isValid() {
        let v = this.form.controls[this.element.FieldID()].value;
        let valid = this.element.validateValue(v);

        return valid;
    }
}
