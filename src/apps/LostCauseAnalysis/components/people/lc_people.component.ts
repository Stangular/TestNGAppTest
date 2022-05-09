import { Component, OnInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup } from '@angular/forms';
import { ElementDefinitionFactoryService } from 'src/dataManagement/service/elementDefinitionFactoryService';
import { IElementDefinition } from 'src/dataManagement/model/definitions/ElementDefinition';

@Component({
  templateUrl: './lc_people.component.html',
  styleUrls: ['./lc_people.component.css']
})
export class LCPeopleComponent implements OnInit {

  elements: IElementDefinition[] = [];
  form: FormGroup;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];

  constructor(private edfs: ElementDefinitionFactoryService) {}

  ngOnInit() {
    this.InitForm();
  }

  get Source() {
    return 'lc_people';
  }

  InitForm(): FormGroup {
    return this.form;
  }

  TestList(value: number) {
    console.error('sss:' + value);
  }
}
