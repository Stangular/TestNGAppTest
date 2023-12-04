import { Injectable } from '@angular/core';
import { ChartContentModel } from '../models/custom/layers/charts/models/contentModel';
import { ShapeSelectResult, eContentType } from '../models/shapes/shapeSelected';
import { BaseDesignerModel, EditModel } from '../models/designer/base.model';
import { ContextSystem, ContextLayer, ActionLayer, UnitCell, IContextItem, EventContextLayer } from '../models/IContextItem';
import { PathService } from '../models/shapes/service/path.service';
import { Line, PortPath, lineTypes, VerticalToVerticalLine, VerticaToHorizontallLine, HorizontalToVerticalLine, HorizontallToHorizontalLine, GradientLine, BezierLine } from '../models/lines/line';
import { DisplayValues } from '../models/DisplayValues';
import { Shape } from '../models/shapes/shape';
import { DataHTTPService } from 'src/dataManagement/service/dataHTTP.service';
import { DisplayValueModel, GraphicsModel, LineModel, PathModel, PortModel, ShapeModel, ContentModel } from './graphicsModel';
import { Point } from '../models/shapes/primitives/point';
import { Port } from '../models/shapes/port';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material';
import { Rectangle } from '../models/shapes/rectangle';
import { MessageService } from 'src/app/messaging/message.service';
import { Path } from '../models/lines/path';
import { Ellipse } from '../models/shapes/ellipse';
import { Content, TextContent, ImageContent } from '../models/shapes/content/Content';
//import { TextShape } from '../models/shapes/content/text/text';
import { ImageModel } from '../models/shapes/content/image/image.model';
import { ContextModel } from '../component/context.model';
import { emptyGuid } from '../../const/constvalues.js';
import { IShape } from '../models/shapes/IShape';
//import { ImageShape } from '../models/shapes/content/image/image';
import { TimeLineBaseLayerModel, TimeLineTypes } from '../models/concepts/timelines/timeLineBase.model';
import { ILine } from '../models/lines/ILine';
import { FamilyTreeModel, PersonModel, FamilyModel, Sex } from '../models/concepts/Family/familyTree/familyTree.model';
import { DNAChromosomes } from '../models/concepts/CommonMatchDNA/dnaChromosome';
//import { ContentShape } from '../models/shapes/content/ContentShape';

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
  private contextModel: ContextModel;
  private _activeShape: IShape = null;
  public _layerName: '';
  // protected lines: Line[] = []
  //  protected paths: PortPath[] = [];
  private selectedUnitCellId: string = emptyGuid;
  shapeSelectResult: ShapeSelectResult = new ShapeSelectResult();
  selectedType: eContentType = eContentType.rectangle;
  chartContent: ChartContentModel[] = [];
  private availableImages: ImageModel[] = [];
  private _loadingData: boolean = false;
  private contextSystems: ContextSystem[] = [];
  private selectedSystem: number = 0;
  readonly datapath: string = 'https://localhost:44328/api/canvas';
  constructor(
    private pathService: PathService,
    public httpService: DataHTTPService,
    public dialog: MatDialog,
    private messageService: MessageService) {


    DisplayValues.Clear();
    DisplayValues.SetColor('TimeSpansss', '#aad8e699');
    DisplayValues.SetColor('TimeSpanLine', 'orange');
    DisplayValues.SetWeight('TimeSpanLine', 2);
    DisplayValues.SetColor('DefaultBG', 'red');
    DisplayValues.SetWeight('DefaultBG', 2);
    DisplayValues.SetFont('DefaultBG', 'Roboto');
    DisplayValues.SetColor('DefaultFG', '#000000');
    DisplayValues.SetColor('DefaulthitFG', '#330000');
    DisplayValues.SetColor('OddSlot', '#bbbbbb');
    DisplayValues.SetColor('EvenSlot', '#FFE4E1');
    DisplayValues.SetGradientColor('OddSlot', '#FFE4E1');
    DisplayValues.SetGradientArea('OddSlot', new Rectangle('sss',10, 0, 50, 0));
    DisplayValues.SetGradientColor('EvenSlot', '#bbbbbb');
    DisplayValues.SetGradientArea('EvenSlot', new Rectangle('sss', 10, 0, 50, 0));
    DisplayValues.SetFGColor('OddSlot', '#2F4F4F');
    DisplayValues.SetFGColor('EvenSlot', '#2F4F4F');
    DisplayValues.SetWeight('OddSlot', 0);
    DisplayValues.SetWeight('EvenSlot', 0);
    DisplayValues.SetColor('boundingArea', 'purple');
    DisplayValues.SetColor('sizerHandleA', '#d8ade699');
    DisplayValues.SetFGColor('sizerHandleA', 'yellow');
    DisplayValues.SetColor('sizerHandleB', 'transparent');
    DisplayValues.SetFGColor('sizerHandleB', 'yellow');
    DisplayValues.SetFont('personData', 'Lato');
    DisplayValues.SetColor('personData', '#F8F0E3');
    DisplayValues.SetFGColor('personData', 'blue');
    DisplayValues.SetFont('personData_hit', 'verdana');
    DisplayValues.SetFGColor('personData_hit', 'yellow');
    DisplayValues.SetColor('personData_hit', 'red');
    DisplayValues.SetColor('personContainer', '#ffffff');
    DisplayValues.SetColor('personContainer_hit', '#ff22ff');
    DisplayValues.SetColor('personPort1', '#555555');
    DisplayValues.SetColor('personPort2', '#555555');
    DisplayValues.SetColor('person', '#ffffff');
    DisplayValues.SetColor('timeLineColor', '#44121255');
    DisplayValues.SetColor('dnaSegmentLineColor', 'yellow');
    
    DisplayValues.SetColor('dnaSegments', '#d8ade699');
    DisplayValues.SetColor('familyTree', 'white');

    this.GetImageList();
  //  this.contextModel = new ContextModel();
  }

  get SelectedUnitCellId() { return this.selectedUnitCellId; }

  //AddPort(portData: any) {
  //  //if (!portData) { return; }
  //  //this.contextSystems[this.selectedSystem].AddPort(portData.name,
  //  //  portData.offsetX,
  //  //  portData.offsetY,
  //  //  portData.type,
  //  //  portData.path);
  //}

  GetContextLayer(id: string, area: Rectangle,context: CanvasRenderingContext2D): EventContextLayer {
    let result: EventContextLayer = null;
    let people: PersonModel[] = [];
    people.push(new PersonModel('197182_0', Sex.Male, "Stanley"));
    people.push(new PersonModel('197182_1', Sex.Male, "J.C."));
    people.push(new PersonModel('197182_2', Sex.Male, "Joshua"));
    people.push(new PersonModel('197182_3', Sex.Male, "William"));
    people.push(new PersonModel('197182_4', Sex.Male, "John"));
    people.push(new PersonModel('197182_5', Sex.Male, "John"));
    people.push(new PersonModel('197182_6', Sex.Male, "John"));
    people.push(new PersonModel('197182_7', Sex.Male, "Thomas"));
    people.push(new PersonModel("R-Y34201", Sex.Male, "R-Y34201"));
    people.push(new PersonModel("R-Y34202 ", Sex.Male, "R-Y34202"));
    people.push(new PersonModel("R-E306", Sex.Male, "R-E306"));
    people.push(new PersonModel("R-Y23202", Sex.Male, "R-Y23202"));
    people.push(new PersonModel("R-Y23202", Sex.Male, "R-Y23555"));
    people.push(new PersonModel("R-FR123394", Sex.Male, "R-FR123394"));
    people.push(new PersonModel("R-FR123394", Sex.Male, "R-FGC71677"));
    people.push(new PersonModel("R-1211", Sex.Male, "R-1211"));
    people.push(new PersonModel("R-1211", Sex.Male, "R-A8500"));
    people.push(new PersonModel("R-1211", Sex.Male, "R-S1199"));
    people.push(new PersonModel("R-1211", Sex.Male, "R-S1196"));
    people.push(new PersonModel("R-1211", Sex.Male, "R-A8469"));
    people.push(new PersonModel("R-1211", Sex.Male, "R-S14328"));
    this.GetISOGG();
 //   let f = new FamilyModel('197182',context,area, 'Shannon', 'R-Y34201', people);

    switch (id.toLowerCase()) {
      case 'dna-segments': result = new DNAChromosomes(area); break;
      case 'family-tree': result = new FamilyTreeModel(context, area, people); break;
      case 'timeline-decade': result = new TimeLineBaseLayerModel(area,new Date(), 12, 80, 0, TimeLineTypes.decade); break;
      case 'timeline-century': result = new TimeLineBaseLayerModel(area,new Date(), 12, 80, 0, TimeLineTypes.century); break;
      default: result = new TimeLineBaseLayerModel(area,new Date(), 12, 80, 0, TimeLineTypes.year,1844);
    }

    return result;
  }

  System(canvasId: string) {
    return (this.BaseSystem.getLayers(canvasId));
  }

  UpdateCanvas() {
    setTimeout(() =>
      this.messageService.sendMessage(1001)
      , 0);
  }

  SetLayerContext(layername: string, ctx: CanvasRenderingContext2D) {
 //   this.contextModel.SetLayerContext(layername, ctx);
    this.selectedSystem = this.contextSystems.findIndex(s => s.Id === layername);
  }

  public SetCanvasContent(canvasId: string) {
    let self = this;

    this.httpService.postContent('', '').subscribe(
      data => {
        //    if (self.BaseSystem) {
        //    let lyrs = self.BaseSystem.Layers;
        //     lyrs.forEach((l, i) => { l.Draw(self.contextModel); });

        //      }

      },
      err => {
        //      if (self.BaseSystem) {
        //    let lyrs = self.BaseSystem.Layers.filter(l => l.CanvasId == canvasId);
        //   lyrs.forEach((l, i) => { l.Draw(self.contextModel); });
        //       }
      });
  }

  DrawSystem(canvasId: string) {
    //let self = this;
    //let lyrs = this.BaseSystem.Layers.filter(l => l.CanvasId == canvasId);
    //lyrs.forEach((l, i) => { l.Draw(self.contextModel); });
  }

  MoveSystem() {
  //  this.BaseSystem.Move(this.contextModel, this.shapeSelectResult);
  }

  SetActiveShape(shape: IShape) {
    this._activeShape = shape;
  }

  get ActiveShape(): IShape {
    return this._activeShape;
  }

  get DataLoading() { return this._loadingData; }

  AddLayer(layer: ContextLayer = null) {
    let activeLayer: ActionLayer = null;
    let layers: ContextLayer[] = [];
    if (layer) {
      layers.push(layer);
    }
    //  layers.push(new ContextLayer("baseLayer", "displayState"));
    // activeLayer = new ActionLayer();
    this.contextSystems.push(new ContextSystem(layers));
  }

  ToggleEdit() {
    this.editOn = !this.editOn;
  }

  get EditOn() {
    return this.editOn;
  }

  //get ContextModel() {
  //  return this.contextModel;
  //}

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
    return this.contextSystems[this.selectedSystem];
  }

  get SSR(): ShapeSelectResult {
    return this.shapeSelectResult;
  }

  getChartModel(id: string) {
    return;
  }

  Select() {
    if (this.contextSystems.length > 0
      && !this.contextSystems[this.selectedSystem].Select(this.SSR.point)) {

      this.SSR.shapeType = this.selectedType;
      this.contextSystems[this.selectedSystem].AddNewContent(this.SSR);
    }
  }

  GetISOGG() {
    let path = "https://localhost:44346/api/ISOGGHaplogroup/sss";
    this.httpService.getContent(null, path)
      .subscribe(
      data => { this.ISOGGResult(data) },
        err => { this.Fail(err) });
  }

  ISOGGResult(data: any) {

  }


  GetImageList() {
    let path = "https://localhost:44314/api/ImageUploader/GetAvailableImageList?=" + 'S:\\Projects\\repos\\Angular6Sandbox\\TestNGApp2\\images';
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
    this.editOn = false;
    this.BaseSystem.SetSelectedLayer(unitCellId);
    if (this.BaseSystem.SelectedLayer.Content.length > 0) {
      this.selectedUnitCellId = unitCellId || emptyGuid;
      setTimeout(() =>
        this.messageService.sendMessage(1001)
        , 0);
      return;
    }
    this.selectedUnitCellId = emptyGuid;
    let path = "https://localhost:44328/api/shape/" + unitCellId;
    this.httpService.getContent(null, path)
      .subscribe(
        data => { this.RetrieveShapeSuccess(data, unitCellId) },
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
    this._loadingData = true;
    let paths: string[] = [];
    paths.push("https://localhost:44328/api/state");
    paths.push("https://localhost:44328/api/Line");
    paths.push(this.datapath + '/Cells');
    this.httpService.getCombined(paths).subscribe(results => {
      this.RetrieveCellsSuccess(results[2]);
      this.RetrieveStateSuccess(results[this.selectedSystem]);
      this.RetrieveLineSuccess(results[1]);
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

  private UpdateGraphicsModel(model: GraphicsModel) {
    this.httpService.postContent(model, this.datapath)
      .subscribe(
        data => { this.UpdateSuccess(data) },
        err => { this.Fail(err) });
  }

  UpdateCell(result: any) {
    let model: GraphicsModel = new GraphicsModel();
    model.UnitCellId = emptyGuid;
    model.UnitCellName = result.name;
    this.UpdateGraphicsModel(model);
  }

  UpdateState(result: any) {
    let model: GraphicsModel = new GraphicsModel();

    let value: DisplayValueModel = new DisplayValueModel();
    value.DisplayValueId = result.state;
    value.BGColor = result.color;
    value.Weight = result.weight;
    value.Font = result.font;
    model.displayValues.push(value);
    this.UpdateGraphicsModel(model);
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

  UpdateLine(id: string, state: string, type: lineTypes, path: PortPath[] = []) {
    let model: GraphicsModel = new GraphicsModel();

    let value: LineModel = new LineModel();
    value.DisplayValueId = state;
    //  value.LineId = name;
    value.LineType = type;
    value.OffsetX1 = 0;
    value.OffsetX2 = 0;
    value.OffsetY1 = 0;
    value.OffsetY2 = 0;
    model.lines.push(value);
    path.forEach(function (p, i) {
      let path = new PathModel();
      //  path.LineId = name;
      path.PathId = p.Id;
      model.paths.push(path);
    });
    this.httpService.postContent(model, this.datapath)
      .subscribe(
        data => { this.UpdateSuccess(data) },
        err => { this.Fail(err) });
  }

  RetrieveLineSuccess(data: any) {
    if (!this.BaseSystem) { return; }
    let self = this;
    data.lines.forEach(function (d, i) {
      let line: ILine;
      switch (d.lineType) {
        case lineTypes.bezier: line = new BezierLine(d.lineId, d.displayValueId); break;
        case lineTypes.gradient: line = new GradientLine(d.lineId, d.displayValueId); break;
        case lineTypes.HtoH: line = new HorizontallToHorizontalLine(d.lineId, d.displayValueId); break;
        case lineTypes.HtoV: line = new HorizontalToVerticalLine(d.lineId, d.displayValueId); break;
        case lineTypes.VtoH: line = new VerticaToHorizontallLine(d.lineId, d.displayValueId); break;
        case lineTypes.VtoV: line = new VerticalToVerticalLine(d.lineId, d.displayValueId); break;
        default: line = new Line(d.lineId, d.displayValueId); break;
      }
      self.BaseSystem.Lines.push(line);
    });
    //data.paths.forEach(function (d, i) {
    //  self.BaseSystem.Paths.push(new PortPath(d.pathId, d.lineId));
    //});
    setTimeout(() => this.messageService.sendMessage(1002), 0);
  }

  RetrievePathSuccess(data: any[]) {
    if (!this.BaseSystem) { return; }
    let self = this;
    //data.forEach(function (d, i) {
    //  self.BaseSystem.Paths.push(new PortPath(d.PathId, d.LineId));
    //});
  }

  RetrieveShapeSuccess(data: any[], unitCellId: string) {
    if (!this.BaseSystem) { return; }
    let self = this;
    data.forEach(function (d, i) {

      let shape = self.LoadShape(d);
      self.BaseSystem.AddContent(shape);
    });
    this.BaseSystem.ResetPaths();
    this.selectedUnitCellId = unitCellId || emptyGuid;
    setTimeout(() =>
      this.messageService.sendMessage(1001)
      , 0);

  }

  private LoadShape(shape: any, parent: Shape = null): Shape {
    let self = this;
    let s: Shape = null;
    switch (shape.type) {
      case 1:
        s = new Ellipse(
          shape.id,
          shape.top,
          shape.left,
          shape.width,
          shape.height,
          shape.displayValueId);
        break;
      default:
        if (shape.textContent) {
          let c = shape.textContent;
          let content = new TextContent(
            c.id,
            c.displayValueId,
            "",
            c.content,
            c.fromSource || false,
            c.angle);
          //s = new TextShape(
          //  shape.id,
          //  shape.top,
          //  shape.left,
          //  shape.width,
          //  shape.height,
          //  shape.displayValueId,
          //  content);
        }
        else if (shape.imageContent) {
          let c = shape.imageContent;
          //      let imageIndex = this.contextModel.AddImage(c.content, this.messageService);
          let content = new ImageContent(
            c.id,
            c.displayValueId,
            "",
            c.content,
            c.fromSource || false,
            c.angle,
            0);

          //s = new ImageShape(
          //  shape.id,
          //  shape.top,
          //  shape.left,
          //  shape.width,
          //  shape.height,
          //  shape.displayValueId,
          //  content);
        }
        else {
          s = new Rectangle(
            shape.id,
            shape.top,
            shape.left,
            shape.width,
            shape.height,
            shape.displayValueId);
        }
        break;
    }
    //shape.ports.forEach(function (p, i) {
    //  let port = new Port(
    //    p.portId,
    //    p.offsetX,
    //    p.offsetY, s,
    //    ePortType.source,
    //    '',
    //    p.pathId,
    //    p.pathOrder);
    //  s.AddPort(port);
    //});
    //shape.shapes.forEach(function (shp, i) {
    //  let child = self.LoadShape(shp, s);
    //  if (shp.textContent) {
    //    s.AddContent(child as TextShape);
    //  }
    //  else if (shp.imageContent) {
    //    s.AddContent(child as ImageShape);
    //  }
    //  else {
    //    s.AddContent(child as ContentShape);
    //  }
    //});
    return s;
  }

  RetrieveCellsSuccess(data: any[]) {
    if (!this.BaseSystem) {
      this.contextSystems.push(new ContextSystem());
    }
    let self = this;
    this.BaseSystem.ClearLayers();
    data.forEach(function (d, i) {
      self.BaseSystem.AddLayer(null, d.unitCellId, d.name, d.updatedBy, d.updatedOn, "displayState");
    });
    this.FinishedLoading();
  }

  AddText(textContent: any, containerState: string, contentState: string, fromSource: boolean, angle = 0) {
    this.BaseSystem.AddText(textContent, containerState, contentState, fromSource, angle);
    setTimeout(() => this.messageService.sendMessage(1001), 0);

  }

  AddImage(imageName: any, containerState: string, contentState: string, fromSource: boolean, angle = 0) {
    //   let imageIndex = this.contextModel.AddImage(imageName, this.messageService);
    //   this.BaseSystem.AddImage(imageName, containerState, contentState, fromSource, angle, imageIndex);
    setTimeout(() => this.messageService.sendMessage(1001), 0);
  }

  //AddGeneral(id: any, containerState: string) {
  //  this.BaseSystem.AddGeneralShape(id, containerState);
  //  setTimeout(() => this.messageService.sendMessage(1001), 0);
  //}

  AddLine(id: string, state: string, type: lineTypes, path: PortPath[] = []) {
    this.BaseSystem.AddLine(id, state, type, path);
    this.UpdateLine(id, state, type, path);
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

  AddPath() {
    // this.BaseSystem.AddPathSegment()
  }
}
