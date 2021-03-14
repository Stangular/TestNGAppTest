import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IElementDefinition } from 'src/dataManagement/model/definitions/ElementDefinition';
import { FormControl } from '@angular/forms';
import { A_Sequence } from 'src/dataManagement/model/sequencing/sequence';

@Component({
  selector: 'check-selector',
  templateUrl: './check-selector.component.html',
  styleUrls: ['./check-selector.component.css']
})
export class CheckSelectorComponent implements OnInit {
  @Input() label: string = '';
  @Input() source: A_Sequence<string,string,number>;
  @Input() control: FormControl;
  @Output() OnSelect: EventEmitter<{ id: string, value: string }> = new EventEmitter<{ id: string, value: string }>();

  constructor() {}

  ngOnInit() {}

  selectState(item, index) {
    this.OnSelect.emit({ id: this.source.FieldID(), value: this.source.CurrentValue() });
  }
}
