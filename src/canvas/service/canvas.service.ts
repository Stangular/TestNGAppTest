import { Injectable } from '@angular/core';
import { ShapeProperties } from '../models/shapes/shape';
import { ChartContentModel } from '../models/custom/layers/charts/models/contentModel';
import { ShapeSelectResult } from '../models/shapes/shapeSelected';
import { BaseDesignerModel, EditModel } from '../models/designer/base.model';


export enum objectTypes {
  rectangle = 0,
  ellipse = 1,
  port = 2,
  line = 3,
  gradientLine = 4,
  bezierLine = 5
}


@Injectable()
export class CanvasService {

  private designer: BaseDesignerModel;
  private editor: EditModel;
  shapeSelectResult: ShapeSelectResult = new ShapeSelectResult();
  selectedType: objectTypes = objectTypes.rectangle;
  private shapeProperties: ShapeProperties = new ShapeProperties();
  chartContent: ChartContentModel[] = [];

  constructor() {
    this.designer = new BaseDesignerModel();
    this.editor = new EditModel();
  }

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
        dataCount));
  }

  get Designer() {
    return this.designer;
  }

  get Editor() {
    return this.editor;
  }

  getChartModel(id: string) {
    return
  }

  get ShapeProperties() {
    return this.shapeProperties;
  }
}
