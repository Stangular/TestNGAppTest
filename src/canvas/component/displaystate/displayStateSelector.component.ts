import {
  Component, Input, Output, EventEmitter, OnInit
} from '@angular/core';
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
  @Input() stateName: string = "DefaultFG";
  @Output() stateChange: EventEmitter<string> = new EventEmitter<string>();
  states: any[] = [];
  constructor() {}

  ngOnInit() {
    let self = this;
    DisplayValues.StateNames.forEach(function (s, i) {
      self.states.push({ name: s, key: s })
    });
   // this.stateName = "3";
  }
  get States() {
    return DisplayValues.StateNames;
  }

  compareStates(s1:any,s2:any) {
    return s1 === s2;
  }

  OnStateChange(value: any) {
    this.stateChange.emit(value.name);
  }
}
