import { Injectable } from '@angular/core';
import { ChartContentModel } from '../models/custom/layers/charts/models/contentModel';
import { ShapeSelectResult, eContentType } from '../models/shapes/shapeSelected';
import { BaseDesignerModel, EditModel } from '../models/designer/base.model';
import { ContextSystem, ContextLayer, ActionLayer } from '../models/IContextItem';
import { PathService } from '../models/shapes/service/path.service';
import { Line, PortPath, lineTypes } from '../models/lines/line';
import { DisplayValues } from '../models/DisplayValues';
import { Shape } from '../models/shapes/shape';
import { DataHTTPService } from 'src/dataManagement/service/dataHTTP.service';
import { DisplayValueModel, GraphicsModel, LineModel, PathModel, PortModel, ShapeModel } from './graphicsModel';

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
  readonly datapath: string = 'https://localhost:44328/api/canvas';
  constructor(private pathService: PathService, public httpService: DataHTTPService) {}

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

  RetrieveState() {
    this.httpService.getContent(null, this.datapath + '/DisplayState')
      .subscribe(
      data => { this.RetrieveSuccess(data) },
      err => { this.Fail(err) });
  }

  RetrieveLines() {
    this.httpService.getContent(null, this.datapath + '/DisplayState')
      .subscribe(
        data => { this.RetrieveLineSuccess(data) },
        err => { this.Fail(err) });
  }

  UpdateState(result: any)  {
    let model: GraphicsModel = new GraphicsModel();
   
    let value: DisplayValueModel = new DisplayValueModel();
    value.DisplayValueId = result.state;
    value.BGColor = result.color;
    value.Weight = result.weight;
    value.Font = result.font;
    model.displayValues.push(value);
    this.httpService.postContent(model, this.datapath)
      .subscribe(
      data => { this.UpdateSuccess(data) },
      err => { this.Fail(err) });
  }

  UpdateSystem(unitCellName: string) {
    let model: GraphicsModel = new GraphicsModel();
    model.UnitCellName = unitCellName;
    this.BaseSystem.Content.forEach(function (c, i) {
      let shapeModel = new ShapeModel();
      let s = c as Shape;
      shapeModel.DisplayValueId = s.StateName;
      shapeModel.Id = s.Id;
      shapeModel.Width = s.Width;
      shapeModel.Height = s.Height;
      shapeModel.Shadow = 0;
      shapeModel.CornerRadius = 0;
      model.shapes.push(shapeModel);
      s.Ports.forEach(function (p, j) {
        let portModel = new PortModel();
        portModel.ShapeId = c.Id;
        portModel.PortId = p.Id;
        portModel.OffsetX = p.Offset.X;
        portModel.OffsetY = p.Offset.Y;
      });
    });

    this.httpService.postContent(model, this.datapath)
      .subscribe(
        data => { this.UpdateSuccess(data) },
        err => { this.Fail(err) });
  }

  RemoveUnitCell(unitCellName: string) {

  }


  UpdateShape(result: any) {
    let model: GraphicsModel = new GraphicsModel();
    let value: ShapeModel = new ShapeModel();
    
  }

  UpdateLine(result: any) {
    let model: GraphicsModel = new GraphicsModel();

    let value: LineModel = new LineModel();
    value.DisplayValueId = result.state;
    value.LineId = result.name;
    value.LineType = 0;
    value.OffsetX1 = 0;
    value.OffsetX2 = 0;
    value.OffsetY1 = 0;
    value.OffsetY2 = 0;
    model.lines.push(value);
     result.paths.forEach(function (p, i) {
      let path = new PathModel();
      path.LineId = result.name;
      path.PathId = p.Id;
      model.paths.push(path);
    });
   this.httpService.postContent(model, this.datapath)
      .subscribe(
        data => { this.UpdateSuccess(data) },
      err => { this.Fail(err) });
  }
  
  RetrieveLineSuccess(data: any[]) {
    data.forEach(function (d, i) {
      
    });
  }

  RetrieveSuccess(data: any[]) {
    data.forEach(function (d, i) {
      DisplayValues.SetColor(d.displayValueId,d.bgColor);
      DisplayValues.SetWeight(d.displayValueId,d.weight);
      DisplayValues.SetFont(d.displayValueId,d.font);
    });
  }

  UpdateSuccess(data: any) {
    let sss = 0;
  }



  Fail(data: any) {
    let sss = 0;
  }

}
