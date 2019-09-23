import { Injectable } from '@angular/core';
import { ChartContentModel } from '../models/custom/layers/charts/models/contentModel';
import { ShapeSelectResult, eContentType } from '../models/shapes/shapeSelected';
import { BaseDesignerModel, EditModel } from '../models/designer/base.model';
import { ContextSystem, ContextLayer, ActionLayer, UnitCell, IContextItem } from '../models/IContextItem';
import { PathService } from '../models/shapes/service/path.service';
import { Line, PortPath, lineTypes } from '../models/lines/line';
import { DisplayValues } from '../models/DisplayValues';
import { Shape } from '../models/shapes/shape';
import { DataHTTPService } from 'src/dataManagement/service/dataHTTP.service';
import { DisplayValueModel, GraphicsModel, LineModel, PathModel, PortModel, ShapeModel, ContentModel } from './graphicsModel';
import { Point } from '../models/shapes/primitives/point';
import { Port, ePortType } from '../models/shapes/port';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material';
import { Rectangle } from '../models/shapes/rectangle';
import { MessageService } from 'src/app/messaging/message.service';
import { Path } from '../models/lines/path';
import { Ellipse } from '../models/shapes/ellipse';
import { Content } from '../models/shapes/content/Content';
import { TextShape } from '../models/shapes/content/text/text';
import { ImageModel } from '../models/shapes/content/image/image.model';

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
  editOn: boolean = false;

  // protected lines: Line[] = []
  //  protected paths: PortPath[] = [];
  shapeSelectResult: ShapeSelectResult = new ShapeSelectResult();
  selectedType: eContentType = eContentType.rectangle;
  chartContent: ChartContentModel[] = [];
  private availableImages: ImageModel[] = [];
  private _loadingData: boolean = false;
  private contextSystems: ContextSystem[] = [];
  readonly datapath: string = 'https://localhost:44328/api/canvas';
  constructor(
    private pathService: PathService,
    public httpService: DataHTTPService,
    public dialog: MatDialog,
    private messageService: MessageService) {

    this.GetImageList();

  }

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
  get DataLoading() { return this._loadingData; }

  AddLayer() {
    let activeLayer: ActionLayer = null;
    let layers: ContextLayer[] = [];
    layers.push(new ContextLayer("baseLayer", "displayState"));
    activeLayer = new ActionLayer();
    this.contextSystems.push(new ContextSystem(layers, activeLayer));
  }

  ToggleEdit() {
    this.editOn = !this.editOn;
  }


  get EditOn() {
    return this.editOn;
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

  GetImageList() {
    let path = "https://localhost:44314/api/ImageUploader/GetAvailableImageList?=" + 'images';
    this.httpService.getContent(null, path)
      .subscribe(
        data => { this.RetrieveImageListSuccess(data) },
        err => { this.Fail(err) });
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
    this.AddLayer();
    this._loadingData = true;
    let paths: string[] = [];
    paths.push("https://localhost:44328/api/state");
    paths.push("https://localhost:44328/api/Line");
    paths.push(this.datapath + '/Cells');
    this.httpService.getCombined(paths).subscribe(results => {
      this.RetrieveStateSuccess(results[0]);
      this.RetrieveLineSuccess(results[1]);
      this.RetrieveCellsSuccess(results[2]);
      this.FinishedLoading();
    },
      err => { this.Fail(err) });

  }

  FinishedLoading() {
    setTimeout(() => { this._loadingData = false }, 1000);
  }

  RetrieveCells() {
    this._loadingData = true;
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
    let self = this;
    let model: GraphicsModel = new GraphicsModel();
    model.UnitCellId = unitCellId;
    model.UnitCellName = unitCellName;
    this.BaseSystem.Content.forEach(function (c, i) {
      self.UpdateModel(model, c);
    });

    this.httpService.postContent(model, this.datapath)
      .subscribe(
        data => { this.UpdateSuccess(data) },
        err => { this.Fail(err) });
  }

  UpdateModel(model: GraphicsModel, content: IContextItem) {
    let s = content as Shape;
    model.shapes.push(s.Save());
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
      let shape = self.LoadShape(d);
      self.BaseSystem.AddContent(shape);
    });
    setTimeout(() => this.messageService.sendMessage(1001), 0);
  }

  private LoadShape(shape: any, parent: Shape = null): Shape {
    let self = this;
    let s: Shape = null;
    switch (shape.type) {
      case 1:
        s = new Ellipse(shape.id, shape.top, shape.left, shape.width, shape.height, shape.displayValueId);
        break;
      default:
        if (shape.content) {
          let c = shape.content;
          let content = new Content(
            c.id,
            c.displayValueId,
            c.content,
            c.contentType,
            c.angle);
          s = new TextShape(shape.id, shape.top, shape.left, shape.width, shape.height, content);
        }
        else {
          s = new Rectangle(shape.id, shape.top, shape.left, shape.width, shape.height, shape.displayValueId);
        }
        break;
    }
    shape.ports.forEach(function (p, i) {
      let port = new Port(p.portId, p.offsetX, p.offsetY, s, ePortType.source, '', p.pathId);
      s.AddPort(port);
    });
    shape.shapes.forEach(function (shp,i) {
      s.AddShape(self.LoadShape(shp,s));
    });
    return s;
  }

  RetrieveCellsSuccess(data: any[]) {
    let self = this;
    self.BaseSystem.ClearCells();
    data.forEach(function (d, i) {
      self.BaseSystem.AddCell(d.unitCellId, d.name, d.updatedBy, d.updatedOn);
    });
    this.FinishedLoading();
  }

  AddText(textContent: any, textState: string, angle = 0) {
    this.BaseSystem.AddText(textContent, textState, angle);
    setTimeout(() => this.messageService.sendMessage(1001), 0);
  }

  AddLine(result: any) {
    this.BaseSystem.AddLine(result);
    this.UpdateLine(result);

  }

  get AvailableImages() {
    return this.availableImages;
  }

  RetrieveImageListSuccess(data: any[]) {
    let self = this;

    data.forEach((d, i) => self.availableImages.push(new ImageModel(d)));
  }

  RetrieveStateSuccess(data: any[]) {
    data.forEach(function (d, i) {
      DisplayValues.SetColor(d.displayValueId, d.bgColor);
      DisplayValues.SetFGColor(d.displayValueId, d.fgColor);
      DisplayValues.SetWeight(d.displayValueId, d.weight);
      DisplayValues.SetFont(d.displayValueId, d.font);
    });
  }

  UpdateSuccess(data: any) {
    let sss = 0;
  }



  Fail(data: any) {
    this.FinishedLoading();
  }

}
