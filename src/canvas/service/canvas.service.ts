import { Injectable } from '@angular/core';
import { ShapeProperties } from '../models/shapes/shape';
import { ChartContentModel } from '../models/custom/layers/charts/models/contentModel';
import { ShapeSelectResult } from '../models/shapes/shapeSelected';

@Injectable({
  providedIn: 'root'
})

  export enum objectTypes {
  rectangle = 0,
  ellipse = 1,
  port = 2,
  line = 3,
  gradientLine = 4,
  bezierLine = 5
}

export class CanvasService {

  shapeSelectResult: ShapeSelectResult = new ShapeSelectResult();
  selectedType: objectTypes = objectTypes.rectangle;
  private shapeProperties: ShapeProperties = new ShapeProperties();
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

  get ShapeProperties() {
    return this.shapeProperties;
  }
}
