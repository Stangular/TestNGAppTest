import { Component, OnInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup } from '@angular/forms';
import { ElementDefinitionFactoryService } from 'src/dataManagement/service/elementDefinitionFactoryService';
import { IElementDefinition } from 'src/dataManagement/model/definitions/ElementDefinition';

@Component({
  templateUrl: './lc_states.component.html',
  styleUrls: ['./lc_states.component.css']
})
export class LCStatesComponent implements OnInit {

  elements: IElementDefinition[] = [];
  form: FormGroup;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];

  constructor(private edfs: ElementDefinitionFactoryService) {
  }

  ngOnInit() {

    this.InitForm();
  }

  get Source() {
    return 'lc_states';
  }
  

  InitForm(): FormGroup {
    return this.form;
  }

  TestList(value: number) {
    console.error('sss:' + value);
  }
}
