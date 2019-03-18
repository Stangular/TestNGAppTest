import { Injectable } from '@angular/core';
import { ChartContentModel } from './models/custom/layers/charts/models/contentModel';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  chartContent: ChartContentModel[] = [];

  constructor() { }

  AddNewChartContent(id: string,
    minValue: number,
    maxValue: number,
    value: number,
    dataCount: number) {

    this.chartContent.push(
      new ChartContentModel(
        id,
        minValue,
        maxValue,
        value,
        dataCount ));
  }

  getChartModel(id: string) {
    return 
  }
  
}
