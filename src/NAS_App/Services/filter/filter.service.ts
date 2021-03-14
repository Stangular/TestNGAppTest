import { Injectable } from '@angular/core';
import { ChartLayer } from 'src/canvas/models/custom/layers/charts/chart.layer';

import { IRecordService, IRecordManager, Records } from '../../../dataManagement/model/records';
import { DataHTTPService } from '../../../dataManagement/service/dataHTTP.service';

import {
  FilterSystemInventoryModel
  , FilterCityTemperatureModel
  , FilterNormalizedStackedBarChartModel
 , FilterBasicBarChartModel
} from './filter.model';

import { D3Service } from '../../../d3/services/d3.service';


//export interface PeriodicElement {
//  name: string;
//  position: number;
//  weight: number;
//  symbol: string;
//}

//const ELEMENT_DATA: PeriodicElement[] = [
//  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
//  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
//  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
//  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
//  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
//  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
//  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
//  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
//  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
//  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
//];

//const ELEMENT_DATA2: PeriodicElement[] = [
//  { position: 1, name: 'Hydrogen2', weight: 10079, symbol: 'H' },
//  { position: 2, name: 'Helium2', weight: 40026, symbol: 'He' },
//  { position: 3, name: 'Lithium2', weight: 6941, symbol: 'Li' },
//  { position: 4, name: 'Beryllium2', weight: 90122, symbol: 'Be' },
//  { position: 5, name: 'Boron2', weight: 10811, symbol: 'B' },
//  { position: 6, name: 'Carbon2', weight: 120107, symbol: 'C' },
//  { position: 7, name: 'Nitrogen2', weight: 140067, symbol: 'N' },
//  { position: 8, name: 'Oxygen2', weight: 159994, symbol: 'O' },
//  { position: 9, name: 'Fluorine2', weight: 189984, symbol: 'F' },
//  { position: 10, name: 'Neon2', weight: 201797, symbol: 'Ne' },
//];


@Injectable()
export class FilterService implements IRecordService {
  toggle = false;
  // dataSource = ELEMENT_DATA;
  ;
  private _filterA: FilterSystemInventoryModel;
  private _filterB: FilterCityTemperatureModel;
  private _filterC: FilterNormalizedStackedBarChartModel;
  private _filterD: FilterBasicBarChartModel;

  constructor(private dataHTTPService: DataHTTPService, private d3Service: D3Service) {
    this._filterA = new FilterSystemInventoryModel(this.d3Service.D3, 'testtable1');
    this._filterB = new FilterCityTemperatureModel(this.d3Service.D3, 'TestMultSeriesLineChart');
    this._filterC = new FilterNormalizedStackedBarChartModel(this.d3Service.D3, 'VBarChart');
    this._filterD = new FilterBasicBarChartModel('VBarChart');


  }

  ChartGraphic(width:number,height:number,chartName: string): ChartLayer {

    let layer: ChartLayer;

    //switch (chartName) {
    //  case 'bar': layer = this._filterD.ChartGraphic(width, height); break;
    //}

    return layer;
  }


  ApplyFilter() {
    this.toggle = !this.toggle;
    //   this.dataSource = this.toggle ? ELEMENT_DATA2 : ELEMENT_DATA;
  }

  ResetFilter() {

  }


  public get Content(): IRecordManager {
    //if (null == this._filterA) {
    //  this._filterA = new FilterSystemInventoryModel(this.d3Service.D3, 'testtable1');
    //}
    //return this._filterA;
    return this._filterD;
  }

  contentSuccess(data: any) {
    // let form = data.content.find(c => c.formName == 'projectForm');
    //if (!!form) {

    if (data.formName == 'testtable1') {
      this._filterA.LoadData(data.content, [], data.recordCount);
      this._filterA.SetDataView();
   //   this.d3Service.DrawComponent('inventorybyarea200', this._filterA.Fields);
    }
    if (data.formName == 'TestMultSeriesLineChart') {
      this._filterB.LoadData(data.content, [], data.recordCount);
      this._filterB.SetDataView();
  //    this.d3Service.DrawComponent('multiSeriesLineChartExample', this._filterB.Fields);
    }
    if (data.formName == 'TestNormalizedStackedBarChart') {
      this._filterC.LoadData(data.content, [], data.recordCount);
      this._filterC.SetDataView();
      this.d3Service.CreateView(data.formName, this._filterC);
   //   this.d3Service.DrawComponent('testNormalizedStackedBarChart', this._filterC.Fields);
    }
    if (data.formName == 'VBarChart') {
      this._filterD.LoadData(data.content, [], data.recordCount);
      this._filterD.SetDataView();
      this.d3Service.CreateView(data.formName, this._filterD);
      //   this.d3Service.DrawComponent('testNormalizedStackedBarChart', this._filterC.Fields);
    }
    // }

  }

  filterSource(formName: string) {
    let source: Records<string>;
    switch (formName) {
      case 'TestMultSeriesLineChart': source = this._filterA; break;
      case 'TestNormalizedStackedBarChart': source = this._filterB; break;
      case 'TestNormalizedStackedBarChart': source = this._filterC; break;
      case 'VBarChart': source = this._filterD; break;
    }
    return source;
  }

  contentFail(data: any) {
    console.error(JSON.stringify(data));
  }

  public Save(formName: string) {
    let source: Records<string>;
    switch (formName) {
      case 'TestMultSeriesLineChart': source = this._filterA; break;
      case 'TestNormalizedStackedBarChart': source = this._filterB; break;
      case 'TestNormalizedStackedBarChart': source = this._filterC; break;
      case 'VBarChart': source = this._filterD; break;
    }
 //   this.dataHTTPService.postContent(source.NewContent);
  }

  public Init(formname: string) {
    this.contentSuccess({ formName: formname, content: [] });
    this._filterD.First();
  //  let p = 'http://localhost:44336/api/data/' + formname;
  //  this.dataHTTPService.getContent(p).subscribe(
  //    data => { this.contentSuccess(data) },
  //    err => { this.contentFail(err) });
  }
}

