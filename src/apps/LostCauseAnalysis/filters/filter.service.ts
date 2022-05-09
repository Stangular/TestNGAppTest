import { Injectable } from '@angular/core';
import { ChartLayer } from 'src/canvas/models/custom/layers/charts/chart.layer';

import { IRecordService, IRecordManager, Records } from '../../../dataManagement/model/records';
import { DataHTTPService } from '../../../dataManagement/service/dataHTTP.service';

import {
  FilterLostCausePeopleModel,
  FilterLostCauseStateModel
} from './filter.model';

//import { D3Service } from '../../../d3/services/d3.service';


@Injectable()
export class FilterService implements IRecordService {
  toggle = false;
  // dataSource = ELEMENT_DATA;
  private _filterPeople: FilterLostCausePeopleModel;
  private _filterStates: FilterLostCauseStateModel;

  constructor(private dataHTTPService: DataHTTPService) {
    this._filterPeople = new FilterLostCausePeopleModel('Person', 0);
    this._filterStates = new FilterLostCauseStateModel('States', 1);
  }

  ChartGraphic(width: number, height: number, chartName: string): ChartLayer {

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
    return this._filterPeople;
  }

  contentSuccess(data: any) {

    if (data.formName == 'Person') {
      this._filterPeople.LoadData(data.content, [], data.recordCount);
      this._filterPeople.SetDataView();
  //    this.d3Service.CreateView(data.formName, this._filterPeople);
    }

  }

  filterSource(formName: string) {
    let source: Records<string>;
    switch (formName) {
      case 'States': source = this._filterStates; break;
      case 'Person': source = this._filterPeople; break;
    }
    return source;
  }

  contentFail(data: any) {
    console.error(JSON.stringify(data));
  }

  public Save(formName: string) {
    let source: Records<string>;
    switch (formName) {
      case 'States': source = this._filterStates; break;
      case 'Person': source = this._filterPeople; break;
    }
    //   this.dataHTTPService.postContent(source.NewContent);
  }

  public Init(formname: string) {
    this.contentSuccess({ formName: formname, content: [] });
    this._filterPeople.First();
  }
}

