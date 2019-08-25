import { Injectable } from '@angular/core';
import { ChartContentModel } from '../models/custom/layers/charts/models/contentModel';
import { ShapeSelectResult, eContentType } from '../models/shapes/shapeSelected';
import { BaseDesignerModel, EditModel } from '../models/designer/base.model';
import { ContextSystem, ContextLayer, ActionLayer, UnitCell } from '../models/IContextItem';
import { PathService } from '../models/shapes/service/path.service';
import { Line, PortPath, lineTypes } from '../models/lines/line';
import { DisplayValues } from '../models/DisplayValues';
import { Shape } from '../models/shapes/shape';
import { DataHTTPService } from 'src/dataManagement/service/dataHTTP.service';
import { DisplayValueModel, GraphicsModel, LineModel, PathModel, PortModel, ShapeModel } from './graphicsModel';
import { Point } from '../models/shapes/primitives/point';
import { Port, ePortType } from '../models/shapes/port';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material';
import { Rectangle } from '../models/shapes/rectangle';
import { MessageService } from 'src/app/messaging/message.service';
import { Path } from '../models/lines/path';

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
  // protected lines: Line[] = []
  //  protected paths: PortPath[] = [];
  shapeSelectResult: ShapeSelectResult = new ShapeSelectResult();
  selectedType: eContentType = eContentType.rectangle;
  chartContent: ChartContentModel[] = [];
  private contextSystems: ContextSystem[] = [];
  readonly datapath: string = 'https://localhost:44328/api/canvas';
  constructor(
    private pathService: PathService,
    public httpService: DataHTTPService,
    public dialog: MatDialog,
    private messageService: MessageService) { }

  AddPort(portData: any) {
    if (!portData) { return; }
    this.contextSystems[0].AddPort(portData.name,
      portData.offsetX,
      portData.offsetY,
      portData.type,
      portData.path);
  }

  get ActiveShape(): Shape {
    if (this.contextSystems.length <= 0
      || !this.contextSystems[0].ActiveLayer) {
      return null;
    }
    return this.contextSystems[0].ActiveLayer.SelectedShape;
  }

  AddLayer() {
    let activeLayer: ActionLayer = null;
    let layers: ContextLayer[] = [];
    layers.push(new ContextLayer("baseLayer", "displayState"));
    activeLayer = new ActionLayer();
    this.contextSystems.push(new ContextSystem(layers, activeLayer));
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
    let path = "https://localhost:44328/api/state";
    this.httpService.getContent(null, path)
      .subscribe(
        data => { this.RetrieveStateSuccess(data) },
        err => { this.Fail(err) });
  }

  RetrieveShape(unitCellId: string) {
    let path = "https://localhost:44328/api/shape/" + unitCellId;
    this.httpService.getContent(null, path)
      .subscribe(
        data => { this.RetrieveShapeSuccess(data) },
        err => { this.Fail(err) });
  }

  RetrieveLines() {
    let path = "https://localhost:44328/api/Line";
    this.httpService.getContent(null, path)
      .subscribe(
        data => { this.RetrieveLineSuccess(data) },
        err => { this.Fail(err) });
  }

  RetrievePaths() {
    this.httpService.getContent(null, this.datapath + '/Lines')
      .subscribe(
        data => { this.RetrievePathSuccess(data) },
        err => { this.Fail(err) });
  }

  RetrieveInitial() {
    let paths: string[] = [];
    paths.push("https://localhost:44328/api/state");
    paths.push("https://localhost:44328/api/Line");
    paths.push(this.datapath + '/Cells');
    this.httpService.getCombined(paths).subscribe(results => {
      this.RetrieveStateSuccess(results[0]);
      this.RetrieveLineSuccess(results[1]);
      this.RetrieveCellsSuccess(results[2]);
   });

  }
  RetrieveCells() {
    this.httpService.getContent(null, this.datapath + '/Cells')
      .subscribe(
        data => { this.RetrieveCellsSuccess(data) },
        err => { this.Fail(err) });
  }

  UpdateState(result: any) {
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

  UpdateSystem(unitCellId: string, unitCellName: string) {
    let model: GraphicsModel = new GraphicsModel();
    model.UnitCellId = unitCellId;
    model.UnitCellName = unitCellName;
    this.BaseSystem.Content.forEach(function (c, i) {
      let shapeModel = new ShapeModel();
      let s = c as Shape;
      shapeModel.DisplayValueId = s.StateName;
      shapeModel.Id = s.Id;
      shapeModel.Top = s.Top;
      shapeModel.Left = s.Left;
      shapeModel.Width = s.Width;
      shapeModel.Height = s.Height;
      shapeModel.Shadow = 0;
      shapeModel.CornerRadius = 0;
      s.Ports.forEach(function (p, j) {
        let portModel = new PortModel();
        portModel.ShapeId = c.Id;
        portModel.PathId = (<Port>p).PathId;
        portModel.PortId = p.Id;
        portModel.OffsetX = (<Port>p).OffsetX;
        portModel.OffsetY = (<Port>p).OffsetY;
        shapeModel.Ports.push(portModel);
      });
      model.shapes.push(shapeModel);

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

  RetrieveLineSuccess(data: any) {
    let self = this;
    data.lines.forEach(function (d, i) {
      self.BaseSystem.Lines.push(new Line(d.lineId, d.displayValueId, d.lineType));
    });
    data.paths.forEach(function (d, i) {
      self.BaseSystem.Paths.push(new PortPath(d.pathId, d.lineId));
    });
    setTimeout(() => this.messageService.sendMessage(1002), 0);
  }

  RetrievePathSuccess(data: any[]) {
    let self = this;
    data.forEach(function (d, i) {
      self.BaseSystem.Paths.push(new PortPath(d.PathId, d.LineId))
    });
  }

  RetrieveShapeSuccess(data: any[]) {
    let self = this;
    data.forEach(function (d, i) {
      let s = new Rectangle(d.id, d.top, d.left, d.width, d.height, d.displayValueId);
      d.ports.forEach(function (p, i) {
        let port = new Port(p.portId, p.offsetX, p.offsetY, s, ePortType.source, '', p.pathId);
        s.AddPort(port);
      });
      self.BaseSystem.AddContent(s);
    });
    setTimeout(() => this.messageService.sendMessage(1001), 0);
  }

  RetrieveCellsSuccess(data: any[]) {
    let self = this;
    self.BaseSystem.ClearCells();
    data.forEach(function (d, i) {
      self.BaseSystem.AddCell(d.unitCellId, d.name, d.updatedBy, d.updatedOn);
    });
  }

  AddLine(result: any) {
    this.BaseSystem.AddLine(result);
    this.UpdateLine(result);

  }

  RetrieveStateSuccess(data: any[]) {
    data.forEach(function (d, i) {
      DisplayValues.SetColor(d.displayValueId, d.bgColor);
      DisplayValues.SetWeight(d.displayValueId, d.weight);
      DisplayValues.SetFont(d.displayValueId, d.font);
    });
  }

  UpdateSuccess(data: any) {
    let sss = 0;
  }



  Fail(data: any) {
    let sss = 0;
  }

}
