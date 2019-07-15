import { Injectable } from '@angular/core';
import { ChartContentModel } from '../models/custom/layers/charts/models/contentModel';
import { ShapeSelectResult, eContentType } from '../models/shapes/shapeSelected';
import { BaseDesignerModel, EditModel } from '../models/designer/base.model';
import { ContextSystem, ContextLayer, ActionLayer } from '../models/IContextItem';
import { PathService } from '../models/shapes/service/path.service';
import { Line, PortPath, lineTypes } from '../models/lines/line';
import { DisplayValues } from '../models/DisplayValues';
import { Shape } from '../models/shapes/shape';

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
  shapeSelectResult: ShapeSelectResult = new ShapeSelectResult();
  selectedType: eContentType = eContentType.rectangle;
  chartContent: ChartContentModel[] = [];
  private contextSystems: ContextSystem[] = [];
  constructor(private pathService: PathService) {

  }

  AddPort(portData: any) {
    this.contextSystems[0].AddPort(portData.name,
      portData.offsetX,
      portData.offsetY,
      portData.type,
      portData.path);
  }

  AddLine(id: string, state: string, paths: PortPath[], type: lineTypes) {
    let line = new Line(id, state, paths,type);
    this.contextSystems[0].AddLine(line);
  }

  AddPath() {

  }


  get ActiveShape() : Shape {
    if (this.contextSystems.length <= 0
      || !this.contextSystems[0].ActiveLayer) {
      return null;
    }
    return this.contextSystems[0].ActiveLayer.SelectedShape();
  }

  AddLayer() {
    let activeLayer: ActionLayer = null;
    let layers: ContextLayer[] = [];
    layers.push(new ContextLayer("baseLayer", "displayState"));
    activeLayer = new ActionLayer();
    this.contextSystems.push( new ContextSystem(layers, activeLayer));
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

  get BaseSystem(): ContextSystem {
    return this.contextSystems[0];
  }

  get SSR(): ShapeSelectResult {
    return this.shapeSelectResult;
  }

  getChartModel(id: string) {
    return;
  }

  Select() {
    if (this.contextSystems.length > 0 && !this.contextSystems[0].Select(this.SSR)) {
      this.SSR.shapeType = this.selectedType;
      this.contextSystems[0].AddNewContent(this.SSR);
    }
  }



}
