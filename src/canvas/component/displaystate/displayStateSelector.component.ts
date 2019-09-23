import {
  Component, Input, Output, EventEmitter, OnInit
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DisplayValues } from 'src/canvas/models/DisplayValues';

@Component({
  selector: 'display-state-selector',
  templateUrl: './displayStateSelector.component.html',
  styleUrls: ['./displayStateSelector.component.css'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})

export class DisplayStateSelectorComponent implements  OnInit {

 // statesss = "redState";
  stateNameFG: FormGroup;
  @Input() stateName: string = "DefaultFG";
  @Output() stateChange: EventEmitter<string> = new EventEmitter<string>();
  states: any[] = [];
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    let self = this;
    DisplayValues.StateNames.forEach(function (s, i) {
      self.states.push({ name: s, key: s })
    });

    this.stateNameFG = this.fb.group({
      stateNameSSS: [null, Validators.required]
    });
    this.stateNameFG.get('stateNameSSS').setValue(this.stateName);
  }
  get States() {
    return DisplayValues.StateNames;
  }

  compareStates(s1:any,s2:any) {
    return s1 === s2;
  }

  OnStateChange(value: any) {
    this.stateChange.emit(value);
  }
}
