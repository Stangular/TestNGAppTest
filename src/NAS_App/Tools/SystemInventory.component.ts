import { Component, OnInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup } from '@angular/forms';
import { FilterService } from '../Services/filter/filter.service';
import { IElementDefinition } from '../../dataManagement/model/definitions/ElementDefinition';
import { TheCanvasState } from '../../canvas/models/DisplayValues';
import { ChartLayer } from 'src/canvas/models/custom/layers/charts/chart.layer';
import { ElementDefinitionFactoryService } from 'src/dataManagement/service/elementDefinitionFactoryService';
import { TabDefinitionModel } from 'src/models/tabs/tabdef';

@Component({
  templateUrl: './SystemInventory.component.html',
  styleUrls: ['./SystemInventory.component.css']
})
export class SystemInventoryComponent implements OnInit {

  elements: IElementDefinition[] = [];
  form: FormGroup;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  _theCanvas: TheCanvasState = new TheCanvasState();
 // tabs: TabDefinitionModel[] = [];

  constructor(private edfs: ElementDefinitionFactoryService) {
  //  this.tabs.push(new TabDefinitionModel("Details", "view_compact", "/systeminventory/detail", this.Source));
   // this.tabs.push(new TabDefinitionModel("Table", "grid_on", "/systeminventory/table", this.Source));
  }

  ngOnInit() {

    this.InitForm();
    // register D3 view...
  }

  get Source() {
    return 'VBarChart';
  }

  //get Tabs(): TabDefinitionModel[] {
  //  return this.tabs;
  //}
  //getElement(elementID: string) {
  //  return this.elements.find(e => e.FieldID() === elementID) || {};
  //}

  InitForm(): FormGroup {
   // this.elements = this.filterService.Content.GetFormDefinition();
   // this.form = this.filterService.Content.Form;
 //   this.filterService.Init('TestMultSeriesLineChart');
    //  this.filterService.Init('testtable1');
    
    // this.filterService.Init('VBarChart');
   // this.edfs.LoadData('VBarChart');
    return this.form;
  }

  TestList(value: number) {
    console.error('sss:' + value);
  }
}
