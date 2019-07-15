import {
  Component, Input, Output, EventEmitter
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
export class DisplayStateSelectorComponent  {

  @Input() state: string = "";
  @Output() stateChange: EventEmitter<string> = new EventEmitter<string>();
  get States() {
    return DisplayValues.StateNames;
  }

  OnStateChange(value: string) {
    this.stateChange.emit(value);
  }
}
