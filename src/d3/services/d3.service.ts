import { Injectable } from '@angular/core';
import { Size, D3ChartSectionModel, Margin } from './d3.common.model';
import { DataHTTPService } from '../../dataManagement/service/dataHTTP.service';
import { ID3SVGView } from '../dataviewModel/viewInterface.model';
import { PercentageChangeExample } from '../dataviewModel/examples/linecharts/PercentageChange.example'
import { MultiSeriesLineChartExample } from '../dataviewModel/examples/linecharts/MultiSeriesLineChart.example'
import { TestNormalizedStackedBarChart } from '../dataviewModel/examples/barcharts/NormalizedStackedBarChart.example'
import { VBarChart } from '../dataviewModel/examples/barcharts/VBarChart'
import { D3ChartAxisDataModel } from '../dataviewModel/dataStructure.model';
import { Records } from '../../dataManagement/model/records';
import * as d3 from "d3";

@Injectable()
export class D3Service{

  _views: ID3SVGView[] = [];

  constructor(private dataHTTPService: DataHTTPService) {}

  get D3() { return d3; }


  DrawComponent(componentId: string ) {

    let view = this._views.find(v => v.IsView(componentId));
    if (view) {
      view.Draw(d3);
    }
  }

  CreateView(componentId: string, records: Records<string>) {
    let view = this._views.find(v => v.IsView(componentId));
    if (!view) {
      this.RegisterView(componentId, records);
    }
  }

  SetViewParameters(componentId: string, margin: Margin, size: Size ) {
    let view = this._views.find(v => v.IsView(componentId));
    if (view) {
      view.SetViewParameters(margin, size);
    }
  }

  RegisterView(componentId: string, records: Records<string>): ID3SVGView {

    let view: ID3SVGView;
    switch ( componentId ) {
  //    case 'inventorybyarea200': view = new PercentageChangeExample(); break;
  //    case 'multiSeriesLineChartExample': view = new MultiSeriesLineChartExample(); break;
   //   case 'TestNormalizedStackedBarChart': view = new TestNormalizedStackedBarChart(records); break;
      case 'VBarChart': view = new VBarChart(records); break;
 // TODO: have a default view...
    }
    if (view) {
      this._views.push(view);
    }
    return view;
  }

}

