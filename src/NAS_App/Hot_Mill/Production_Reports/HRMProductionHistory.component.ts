import { Component, OnInit, AfterContentInit } from '@angular/core';
import { Location } from '@angular/common';
import { NgForm, FormBuilder, FormGroup } from '@angular/forms';
import { D3Service } from '../../../d3/services/d3.service'
import { FilterService } from '../../Services/filter/filter.service';
import { D3LineChartModel } from '../../../d3/Services/d3.linechart.model';

@Component({
  templateUrl: './HRMProductionHistory.component.html',
    styleUrls: ['../../NAS_APP.css']
})
export class HRMProductionHistoryComponent implements OnInit, AfterContentInit {
  form: FormGroup;
  toggle = false;
  private d3LineChartModel: D3LineChartModel = new D3LineChartModel();

  constructor(private filterService: FilterService, private d3Service: D3Service, private loc: Location ) { }

  ngOnInit() {
    this.InitForm();
  }

  Refresh() {
    this.toggle = !this.toggle;

   // this.d3LineChartModel.Draw(this.d3Service.D3, inventorysummanrbyarea,);
  //  this.dataSource = this.toggle ? ELEMENT_DATA2 : ELEMENT_DATA2;
  }
  //getElement(elementID: string) {
  //  return this.elements.find(e => e.FieldID() === elementID) || {};
  //}

  InitForm(): FormGroup {
    return this.form;
  }

  TestList(value: number) {
    console.error('sss:' + value);
  }

  ngAfterContentInit() {
    this.d3Service.D3.select("p").style("color", "red");
  }
  
}
