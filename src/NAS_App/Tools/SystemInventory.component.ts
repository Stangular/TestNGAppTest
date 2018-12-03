import { Component, OnInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup } from '@angular/forms';
import { FilterService } from '../Services/filter/filter.service';
import { IElementDefinition } from '../../dataManagement/model/definitions/elementDefinition';
import { TheCanvasState } from '../../canvas/models/DisplayValues';

@Component({
  templateUrl: './SystemInventory.component.html',
  styleUrls: ['./SystemInventory.component.css']
})
export class SystemInventoryComponent implements OnInit {

  elements: IElementDefinition<any>[] = [];
  form: FormGroup;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  _theCanvas: TheCanvasState = new TheCanvasState();
  constructor(private filterService: FilterService) {

  }

  ngOnInit() {

    this.InitForm();
    // register D3 view...
  }


 
  //getElement(elementID: string) {
  //  return this.elements.find(e => e.FieldID() === elementID) || {};
  //}

  InitForm(): FormGroup {
    //this.elements = this.filterService.Content.GetFormDefinition();
    //this.form = this.filterService.Content.Form;
 //   this.filterService.Init('TestMultSeriesLineChart');
  //  this.filterService.Init('testtable1');
    this.filterService.Init('VBarChart');
    return this.form;
  }

  TestList(value: number) {
    console.error('sss:' + value);
  }
}
