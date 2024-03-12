import { Injectable } from '@angular/core';
import { Point } from "./shapes/primitives/point";
import { Size } from "./shapes/primitives/size";
import { ShapeSelectResult, eContentType } from "./shapes/shapeSelected";
import { Shape, PathShape, ShapeContainer } from "./shapes/shape";
import { forEach } from "@angular/router/src/utils/collection";
import { Line, PortPath, lineTypes, VerticalToVerticalLine, VerticaToHorizontallLine, HorizontalToVerticalLine, HorizontallToHorizontalLine, GradientLine, BezierLine, PathLink } from './lines/line';
import { Port } from './shapes/port';
import { Rectangle } from './shapes/rectangle';
import { StateIndex, UIStates, DisplayValues } from './DisplayValues';
import { ILine } from './lines/ILine';
import { Ellipse } from './shapes/ellipse';
import { Path } from './lines/path';
import { LineService } from './lines/service/line.service';
//import { TextShape } from '../models/shapes/content/text/text';
import { IShape, FreedomOfMotion, AreaType, EmptyShape, IShapeContainer } from './shapes/IShape';
import { Content, TextContent, ImageContent } from '../models/shapes/content/Content';
//import { ImageShape } from './shapes/content/image/image';
import { ContextModel } from '../component/context.model';
import { emptyGuid } from '../../const/constvalues.js';
import { IActionItem, ActionItemsss, IMouseState } from '../component/layers/Interfaces/IActionLayer';
import { YearContent } from 'src/components/timeline/service/timeLine.model';
//import { ContentShape } from './shapes/content/ContentShape';
import { Action } from 'rxjs/internal/scheduler/Action';
import { IScale } from './custom/layers/charts/axis/axis.layer';
import { extend } from 'webdriver-js-extender';
import { SizeableArea, AreaSizer } from './shapes/sizing/sizer';



//export class ContextModel {
//  constructor(private _context: CanvasRenderingContext2D) {

//  }


//}

export interface IContextFillStyleTool {
  renderItem(context: CanvasRenderingContext2D): void;
}

export class DefaultFillStyleTool implements IContextFillStyleTool {

  constructor(
    private color: string) {

  }

  renderItem(context: CanvasRenderingContext2D): void {
    context.fillStyle = this.color;
  }
}

export class GradientFillStyleTool implements IContextFillStyleTool {

  private _gradient: CanvasGradient;

  constructor(
    context: CanvasRenderingContext2D,
    color1: string,
    color2: string,
    from: Point,
    to: Point) {

    this._gradient = context.createLinearGradient(from.X, from.Y, to.X, to.Y);
    this._gradient.addColorStop(0, color1);
    this._gradient.addColorStop(1, color2);
  }

  renderItem(context: CanvasRenderingContext2D): void {
    context.fillStyle = this._gradient;
  }
}

export interface IContextItem {

  Id: string;
  zIndex: number;
  Draw(ctx: CanvasRenderingContext2D): void;
  CopyItem(newId: string): IContextItem;
  Save(): any;
  //  InitializeContext(context: CanvasRenderingContext2D);
}

export interface IDataSourceItem extends IContextItem {

}

export interface IContextSystem {
  Content: IContextItem[];
  AddContent(content: IContextItem);
  RemoveContent(): IContextItem;
  RemoveContentById(id: string): IContextItem;
  RemoveAllContent();
  Draw(context: CanvasRenderingContext2D): void;
  CopyItem(itemId: string, newId: string): string;
  Init(): void;
}

export class UnitCell {
  _removedItems: string[] = [];
  constructor(
    private Id: string,
    private name: string,
    private updatedBy: string = '',
    private updatedOn: Date = null) { }

  get ID() { return this.Id; }
  get Name() { return this.name }
  get UpdatedBy() { return this.updatedBy; }
  get UpdatedOn() { return this.updatedOn; }
  ItemRemoved(id: string) { this._removedItems.push(id); }

}

export interface IDataResult {
  ID: string;
  Data: any;
  Update(data: any);
  Flag: any;
}

export class ContextLayer implements IContextSystem {


  // private _context: CanvasRenderingContext2D;
  private _contentCount = 0;
  //private layers: ContextLayer[] = [];
  private unitCell: UnitCell = null;
  // private _portPath: PortPath;
  constructor(
    private parentArea: Rectangle,
    private id: string,
    name: string,
    updatedBy: string,
    updatedOn: Date = new Date(),
    private displayState: string = '',
    protected content: IContextItem[] = [],
    protected lines: ILine[] = []) {
    this.AddCell(id, name, updatedBy, updatedOn);
    //  this._portPath = new PortPath(this.id + "_paths");
  }

  SetContext(context: CanvasRenderingContext2D) {
    //this._context = context;
  }

  get ParentArea() {
    return this.parentArea;
  }

  Resize(parentArea: Rectangle) {
    this.parentArea = new Rectangle(this.parentArea.Id,
      parentArea.Top,
      parentArea.Left,
      parentArea.Width,
      parentArea.Height,
      parentArea.StateName,
      parentArea.zIndex);
  }

  AddCell(id: string, name: string, updatedBy: string, updatedOn: Date) {
    this.unitCell = new UnitCell(id, name, updatedBy, updatedOn);
  }

  NewCell(id: string, name: string, updatedBy: string, updatedOn: Date) {
    this.unitCell = new UnitCell(emptyGuid, name, updatedBy, updatedOn);
  }

  get UnitCell() { return this.unitCell; }
  get Id() { return this.id; }
  get CanvasId() { return this.id; }

  ClearPaths() {
    // this.paths = [];
  }


  //mouseMove(event: any, context: CanvasRenderingContext2D): void {
  //  //this._mousePosition.Update(event, this.ParentArea);
  //  //let c = this.Content[0] as IShape;
  //  //let d = this._mousePosition.Delta;
  //  //c.MoveBy(d.X, d.Y);
  //}

  DrawStatic(context: CanvasRenderingContext2D, initial: boolean = false) {
    let staticContent = this.content.slice(1);
    this.DrawState(context, staticContent, this._contentCount - 2);
  }

  Draw(context: CanvasRenderingContext2D, initial: boolean = false) {

    this.DrawState(context, this.content, this._contentCount - 1);
  }

  private DrawState(context: CanvasRenderingContext2D, content: IContextItem[], count: number) {
    for (let i = count; i >= 0; i--) {
      this.DrawShape(context, content[i] as Shape);
    }
  }

  DrawPaths(context: CanvasRenderingContext2D, line: ILine) {
    // let paths = this.paths.filter(p => p.LineId == line.Id);
    // paths.forEach(p => line.DrawPortPath(context, p));
  }

  DrawShape(context: CanvasRenderingContext2D, shape: Shape) {
    shape.Draw(context);
    //  shape.Ports.forEach(p => this.DrawPortPath(context, p as Port));
    //shape.Draw(context);
  }

  DrawShapePortPath(context: CanvasRenderingContext2D, shapeId: string) {
    //   this.Lines.forEach(l => this._portPath.DrawShapePath(context,shapeId, l));
    //   this._portPath.DrawAreaPorts(context);
  }

  Init(): void { };

  AddLine(id: string, state: string, type: lineTypes, paths: PortPath[] = []) {
    let L = this.lines.find(l => l.Id == id);
    if (!L) {
      switch (type) {
        case lineTypes.bezier: L = new BezierLine(id, state); break;
        case lineTypes.gradient: L = new GradientLine(id, state); break;
        case lineTypes.HtoH: L = new HorizontallToHorizontalLine(id, state); break;
        case lineTypes.HtoV: L = new HorizontalToVerticalLine(id, state); break;
        case lineTypes.VtoH: L = new VerticaToHorizontallLine(id, state); break;
        case lineTypes.VtoV: L = new VerticalToVerticalLine(id, state); break;
        default: L = new Line(id, state); break;
      }
      this.lines.push(L);
    }
    else {
      L.Update(state);
    }
    //  this.paths = paths.concat(this.paths);
    //  this.paths.forEach(function (p, i) { p.SetInterimPorts(type); });
  }



  ResetPaths() {
    this.content.forEach((s, i) => this.ResetPath(s as Shape));
  }

  ResetPath(shape: Shape) {

    shape.MoveBy(0, 0);
  }


  get Content(): IContextItem[] { return this.content; }

  ClearContent(start: number = 0, maintainFirst = true) {
    let c = null;
    if (maintainFirst) {
      c = this.content[this.content.length - 1];
    }
    this.content = [];
    this.lines = [];
    //this.paths = [];
    if (c) {
      this.content.push(c);
    }
    // this.content = this.content.splice(start);
  }

  get Lines(): ILine[] { return this.lines; }

  SelectContent(index: number) {
    if (index > 0) {
      const c = this.content[index];
      this.content.splice(index, 1);
      this.content.unshift(c);
    }
  }

  SelectContentById(contentId: string) {
    this.SelectContent(this.content.findIndex(c => c.Id === contentId));
  }

  SortContentByZIndex() {
    this.content = this.content.sort(function (a, b) { return a.zIndex < b.zIndex ? -1 : 1 });
  }

  AddContent(content: IContextItem) {
    if (content) {
      this.content.push(content);
      this._contentCount = this.content.length;
      // this.AddPortPath(content as Shape);
      this.SortContentByZIndex();
    }
  }

  AddText(parentShape: Shape, text: string, containerStateName: string, contentStateName: string, fromSource: boolean, angle: number = 0) {
    //if (!parentShape) {
    //  parentShape = this.Content[0] as Shape;
    //}
    //if (parentShape) {
    //  let id = '_text_content_' + parentShape.Contents.length;
    //  let shp = new Rectangle(
    //    parentShape.Id + id,
    //    parentShape.Top + 3,
    //    parentShape.Left + 3, parentShape.Width, parentShape.Height,
    //    containerStateName);
    //  let i = new TextContent(emptyGuid, contentStateName, text, shp, fromSource, angle)
    //  parentShape.AddContent(i);
    //}
  }


  AddImage(imageName: string, containerStateName: string, contentStateName: string, fromSource: boolean, angle: number = 0, imageIndex = 0) {
    //let activeShape = this.Content[0] as Shape;
    //if (activeShape) {
    //  let id = '_image_content_' + activeShape.Contents.length;
    //  let shp = new Rectangle(
    //    activeShape.Id + id,
    //    activeShape.Top + 3,
    //    activeShape.Left + 3, 10, 10,
    //    containerStateName);
    //  let i = new ImageContent(emptyGuid, contentStateName, imageName,shp, fromSource, angle, imageIndex);

    //  activeShape.AddContent(i);
    //}
  }

  RemoveAllContent() {
    while (this.RemoveContent());
  }

  RemoveContent(): IContextItem {
    if (this.content.length <= 0) { return null; }
    let item = this.content[0];
    this.content.splice(0, 1);
    return item;
  };

  RemoveContentByIndex(i: number): IContextItem {
    if (i < 0) {
      return null;
    }
    let result = this.content.splice(i, 1);
    if (result.length > 0) {
      console.error('remove ' + result[0].Id);
    }
    return (result.length > 0) ? result[0] : null;
  };

  RemoveContentByPoint(pt: Point): IContextItem {
    let i = this.content.findIndex(c => (<Rectangle>c).IsPointInShape(pt));
    return this.RemoveContentByIndex(i);
  }

  RemoveContentById(id: string): IContextItem {
    let ndx = this.content.findIndex(c => c.Id == id);
    return this.RemoveContentByIndex(ndx);
  };

  MoveToTop(id: string) {
    if (this.content.length <= 0) { return false; }
    let ndx = this.content.findIndex(c => c.Id == id);
    return this.MakeTop(ndx);
  };

  MakeTop(index: number) {
    if (index < 0 || index >= this.content.length) { return false; }
    let item = this.content[index];
    this.content.splice(index, 1);
    this.content.unshift(item);
    return true;
  }

  CopyItem(itemId: string, newId: string = ''): string {
    let ndx = this.content.findIndex(c => c.Id == itemId);
    if (ndx < 0) { return ''; }
    if (newId.length <= 0) { newId = itemId + '_' + this.content.length; }
    this.AddContent(this.content[ndx].CopyItem(newId));
    return newId;
  }

  GetContentItem(point: Point) {

    let ndx = this.content.findIndex(c => (<Shape>c).Select(point));
    if (!this.MakeTop(ndx)) { return false; }
    //  ssr.layerId = this.id;
    return this.content.splice(0, 1);
  }

  PutContentItem(item: IContextItem) {
    if (item && (<IShape>item).IsHit && this.content.findIndex(c => c.Id == item.Id) < 0) {
      this.content.unshift(item);
    }
    this.SortContentByZIndex();
  }

  Select(point: Point): boolean {
    // return this.content.some(c => (<IShape>c).Track(point));
    let ndx = this.content.findIndex(c => (<Shape>c).Select(point));
    if (!this.MakeTop(ndx)) { return false; }
    //  ssr.layerId = this.id;
    return true;
  }

  RemoveLine(lineName: string) {
    let ndx = this.lines.findIndex(l => l.Id == lineName);
    if (ndx >= 0) {
      this.lines.splice(ndx, 1);
    }
  }

  ContentFromID(id: string) {
    return this.content.find(c => c.Id == id);
  }
}

export interface Isss {
  Draw(): void;
}

export class sss implements Isss {
  _context: CanvasRenderingContext2D;
  _layer: EventContextLayer;

  Draw(): void {
    this._layer.Draw(this._context);
  }
}

export class sssex extends sss {

  Draw(): void {
    // this._layer.DrawSelection(this._context);
  }
}


export interface ITracker {
  Reset(shape: IShape, selected: boolean);
  Draw(context: CanvasRenderingContext2D, initial: boolean);
  mouseMove(event: any, boundingArea: Rectangle): boolean;
  Track(point: Point): boolean;
  TrackedArea: IShape;
  HitTest(): boolean;
  mouseCapture(event: any, boundingArea: Rectangle): Point;
  mousePosition: MousePosition;
  IsSelected: boolean;
}

export class MousePosition {

  protected _mousePosition: Point = new Point();
  private _previousPosition: Point = new Point();


  Init(event: any, boundingArea: Rectangle) {
    this.PositionFromEvent(event, boundingArea);
    this._previousPosition.SetToPosition(this.mousePosition.X, this.mousePosition.Y);
  }

  Update(event: any, boundingArea: Rectangle, area: IShape): boolean {
 
    this._previousPosition.SetToPosition(this.mousePosition.X, this.mousePosition.Y);
    return this.PositionFromEvent(event, boundingArea);
  }

  private PositionFromEvent(event: any, boundingArea: Rectangle): boolean {

    var offsetX = event.clientX;
    var offsetY = event.clientY;
    this.mousePosition.SetToPosition(offsetX, offsetY);
    if (!boundingArea.IsPointInShape(this.mousePosition)) {
      return false;
    }

    offsetX -= boundingArea.Left;
    offsetY -= boundingArea.Top;

    this.mousePosition.SetToPosition(offsetX, offsetY);
    return true;
  }

  get PreviousPosition() { return this._previousPosition; }
  get mousePosition() { return this._mousePosition; }


}

export class TrackingMousePosition extends MousePosition {
  private _delta: Point = new Point();

  Init(event: any, boundingArea: Rectangle) {
    this._delta.SetToPosition(0, 0);
    super.Init(event, boundingArea);
  }

  Update(event: any, boundingArea: Rectangle, area: IShape): boolean {
    console.error("MOUSE POSITION X: " + this.mousePosition.X);
    super.Update(event, boundingArea, area);
    this.SetDelta();
    let d = this.Delta;
    if (!AreaSizer.MoveSide(d.X, d.Y, area)) {

      area.MoveBy(d.X, d.Y);
      AreaSizer.MoveItem(d.X, d.Y,area.Id);

    }
    return false;
  }

  protected SetDelta() {

    let dx = this._mousePosition.X - this.PreviousPosition.X;
    let dy = this._mousePosition.Y - this.PreviousPosition.Y;
    this._delta.SetToPosition(dx, dy);
  }

  get Delta(): Point { return this._delta; }

}

export abstract class EventContextLayer extends ContextLayer {
  
  protected _mousePosition: MousePosition;
  protected _staticPosition: MousePosition = new MousePosition();
  protected _trackingPosition: TrackingMousePosition = new TrackingMousePosition();

  constructor(
    parentArea: Rectangle,
    id: string,
    name: string,
    updatedBy: string,
    updatedOn: Date = new Date(),
    displayState: string = '',
    content: IContextItem[] = [],
    lines: ILine[] = [],
    paths: PortPath[] = []) {
    super(parentArea, id, name, updatedBy, updatedOn, displayState, content, lines);
    this._mousePosition = this._staticPosition;

  }

  Init() {
  }


  abstract AutoUpdate();
  abstract LoadCanvasData(inputData: any): Promise<any>;
  abstract UpdateCanvasData(inputData: any);
  abstract GetContextData(): any;
  abstract GetTouchedShape(point: Point): IShape;
  abstract GetSelectedShape(point: Point): IShape;
  abstract ReturnTouchedShape(shape: IShape);
  abstract GetDataResult(): IDataResult; // need to move
  abstract SetDataResult(data: IDataResult, changeType: any);// need to move

  ClearContext(context: CanvasRenderingContext2D) {
    context.clearRect(0, 0, this.ParentArea.Width, this.ParentArea.Height);
  }

  ReInitMousePosition(event: any, mousePosition: MousePosition) {
    this._mousePosition = mousePosition;
    this._mousePosition.Init(event, this.ParentArea);
  }

  SelectContentByPosition(mousePosition: MousePosition) {

    const p = mousePosition.mousePosition;
    const index = this.Content.findIndex(c => (<IShape>c).IsPointInShape(p));
    this.SelectContent(index);

  }

  protected touchItem() {
    this.SelectContentByPosition(this._mousePosition);
   // this.SortContentByZIndex();
  }

  selectItem(event: any, context: CanvasRenderingContext2D): void {

    this.ReInitMousePosition(event, this._trackingPosition);
    this.SelectContentByPosition(this._mousePosition);
    AreaSizer.Reset(this.Content[0] as IShape, false);


  }

  releaseSelectedItem(event: any, context: CanvasRenderingContext2D) {

    this.SortContentByZIndex();
    this.ReInitMousePosition(event, this._staticPosition);
    AreaSizer.ReleaseHandle();
  }

  mouseMove(event: any, context: CanvasRenderingContext2D): void {

    let c = this.Content[0] as IShape;
    this._mousePosition.Update(event, this.ParentArea, c);
    c.Touch(this._mousePosition.mousePosition);
    c.Draw(context);
  }
}

export class ActionLayer extends ContextLayer {// uses separate context
  private _shapeSelected: boolean = false;
  private _layer: ContextLayer;
  constructor(parentArea: Rectangle, layerName: string) {
    super(parentArea, 'edit', layerName, '', new Date());
    let bgNdx = DisplayValues.GetColorIndex('default.edit.background');
  }

  get Editing() {
    return this._layer != null;
  }

  EndEdit(): boolean {
    if (!this._layer) { return false; }
    this._layer = null;
    return true;
  }

  SetLayer(lyr: ContextLayer) {
    if (lyr) {
      if (this._layer && lyr.Id == this._layer.Id) { return; }
      this._layer = lyr;
      this._shapeSelected = true;
    }
  }

  get ShapeSelected() {
    return this._shapeSelected;
  }

  Select(point: Point): boolean {

    return false;
  }

  AddContent(content: IContextItem) {
    if (!this._layer) { return; }
    this._shapeSelected = true;
  }

  get SelectedShape(): Shape {
    if (!this._layer) { return null; }
    return this._layer.Content[0] as Shape;
  }

  AddNewContent(
    ssr: ShapeSelectResult,
    shapeName: string = '') {

    if (shapeName.length <= 0) {
      shapeName = 'item_' + this._layer.Content.length.toString();
    }
    if (this._layer.Content.findIndex(c => c.Id == shapeName) >= 0) {
      return false;
    }
    let shp: Shape = null;
    switch (ssr.shapeType) {
      case eContentType.typeCount:
      case eContentType.rectangle:
        shp = new Rectangle(shapeName, ssr.point.Y, ssr.point.X, 30, 30, ssr.stateName);
        break;
      case eContentType.ellipse:
        shp = new Ellipse(shapeName, ssr.point.Y, ssr.point.X, 30, 30, ssr.stateName);
        break;
    }
    if (shp) {
      this._layer.AddContent(shp);
      this._shapeSelected = true;
      return true;
    }
    return false;
  }

  Reset(context: CanvasRenderingContext2D) {
    if (this._shapeSelected) {
      this.DrawPartial(context);
    }
    else {
      this._layer.Draw(context);
    }
  }

  DrawPartial(context: CanvasRenderingContext2D) {
    for (let i = 1; i < this._layer.Content.length; i++) {
      this.DrawLayerShape(context, this._layer.Content[i] as Shape);
      (<Shape>this._layer.Content[i]).Draw(context);
    }
  }

  DrawLayerShape(context: CanvasRenderingContext2D, shape: Shape) {
    shape.Draw(context);
    //   shape.Ports.forEach(p => this.DrawLayerPortPath(context, p as Port));
  }

  DrawLayerPortPath(context: CanvasRenderingContext2D, port: Port) {

  }

  Draw(context: CanvasRenderingContext2D) {

    if (!this._layer) { return; }
    this._layer.Content[0].Draw(context);
    (<Shape>this._layer.Content[0]).Draw(context);
    //  this._layer.DrawPortPath(context);
    let I = this;
    this._layer.Lines.forEach(l => I.DrawPaths(context, l));

  }

  MoveItem(context: ContextModel, point: Point) {
    if (!this._layer) { return; }
    let c = (<Shape>this._layer.Content[0])
      || this._layer.Content[0] as Shape;

    this._layer.ResetPath(c);
  }
}
// manages context layers...
export class ContextSystem implements IContextSystem {

  ssr: ShapeSelectResult;
  _selectedLayer: number = 0;
  _activeLayer: ActionLayer = null;
  constructor(
    private layers: ContextLayer[] = []) {
  }

  get Id() { return this.SelectedLayer ? this.SelectedLayer.Id : ''; }

  get Layers() { return this.layers; }
  SetSelectedLayer(id: string) {
    this._selectedLayer = this.layers.findIndex(l => l.Id == id);
  }

  Init() { }

  get SelectedLayer() {
    return this.layers[this._selectedLayer] || this.layers[0];
  }

  getLayer(unitcellID: string) {
    return this.layers.find(l => l.UnitCell.ID == unitcellID);
  }

  Draw(context: CanvasRenderingContext2D) {
    this.layers.reverse().forEach(l => l.Draw(context));
  }

  get Content(): IContextItem[] { return this.SelectedLayer.Content; }

  AddContent(content: IContextItem) { this.SelectedLayer.AddContent(content); }
  ResetPaths() {
    this.layers.forEach((l, i) => l.ResetPaths());
  }
  RemoveContent(): IContextItem {

    let item = this.SelectedLayer.RemoveContent();
    return item;

  };

  RemoveAllContent() {
    return this.SelectedLayer.RemoveAllContent();
  }

  RemoveContentById(id: string) {
    return this.SelectedLayer.RemoveContentById(id);
  }

  CopyItem(itemId: string, newId: string = ''): string {
    return this.SelectedLayer.CopyItem(itemId, newId);
  }

  AddLayer(parentArea: Rectangle, id: string, name: string, updatedBy: string, updatedOn: Date, displayState: string, content: IContextItem[] = []) {
    this.layers.unshift(new ContextLayer(parentArea, id, name, updatedBy, updatedOn, displayState, content));
  }

  SelectLayer(index: number) {
    if (index > 0) {
      if (index >= this.layers.length) {
        index = this.layers.length - 1;
      }
      const layer = this.layers[index];
      this.layers.splice(index, 1);
      this.layers.unshift(layer);
      return true;
    }
    return false;
  }

  Clear() {
    this.layers.forEach(function (l, i) { l.RemoveAllContent(); });
  }

  SelectLayerById(layerId: string) {
    return this.SelectLayer(this.layers.findIndex(l => l.Id === layerId));
  }

  Move(context: ContextModel, ssr: ShapeSelectResult) { }

  Select(point: Point): boolean {

    let ndx = this.layers.findIndex(l => l.Select(point));
    return ndx >= 0;
  }

  LayerByName(layerId: string) {
    if (this.layers.length <= 0) {
      return null;
    }
    let lyr = this.layers.find(l => l.Id == layerId);
    if (!lyr) {
      lyr = this.SelectedLayer;
    }
    return lyr;
  }

  get Lines() {
    return this.SelectedLayer.Lines;
  }

  AddText(text: string, containerStateName: string, contentStateName: string, fromSource: boolean, angle: number = 0) {
    //   this.SelectedLayer.AddText(text, containerStateName, contentStateName, fromSource, angle);
  }

  AddImage(imageName: any, containerStateName: string, contentStateName: string, fromSource: boolean, angle = 0, imageIndex = 0) {
    this.SelectedLayer.AddImage(imageName, containerStateName, contentStateName, fromSource, angle = 0, imageIndex);
  }

  AddLine(id: string, state: string, type: lineTypes, path: PortPath[] = []) {
    this.SelectedLayer.AddLine(id, state, type, path);
  }

  ClearLayers() {
    this.layers = [];
  }
  RemoveLine(lineName: string) {
    this.SelectedLayer.RemoveLine(lineName);
  }

  AddNewContent(
    ssr: ShapeSelectResult,
    shapeName: string = '') {

    let lyr = this.LayerByName(ssr.layerId);
    if (!lyr) {
      return false;
    }
    if (shapeName.length <= 0) {
      shapeName = 'item_' + lyr.Content.length.toString();
    }
    if (lyr.Content.findIndex(c => c.Id == shapeName) >= 0) {
      return false;
    }
    let shp: Shape = null;
    switch (ssr.shapeType) {
      case eContentType.rectangle:
        shp = new Rectangle(shapeName, ssr.point.Y, ssr.point.X, 30, 30, ssr.stateName);
        break;
      case eContentType.ellipse:
        shp = new Ellipse(shapeName, ssr.point.Y, ssr.point.X, 30, 30, ssr.stateName);
        break;
    }
    if (shp) {
      this.SelectedLayer.AddContent(shp);
      return true;
    }
    return false;
  }

  getLayers(canvasId) {
    return this.layers.filter(l => l.CanvasId == canvasId);
  }
}
