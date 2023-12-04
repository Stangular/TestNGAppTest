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

//export class shapeContainter implements IShape {
//  constructor(private content: Content) { }

//  get Id(): string { return this.Id; }
//  get zIndex(): number { return this.content.Shape.zIndex; }
//  Draw(ctx: CanvasRenderingContext2D): void {
//    this.content.Draw(ctx);
//  }
//  public DrawContent(context: any) { this.content.Draw(context); };

//  CopyItem(newId: string): IContextItem { return this.content.Shape.CopyItem(newId); }
//  Save(): any { return this.content.Shape.Save(); }
//  Touch(point: Point) { }
//  get Top(): number { return this.content.Shape.Top; }
//  get Right(): number { return this.content.Shape.Right; }
//  get Bottom(): number { return this.content.Shape.Bottom; }
//  get Left(): number { return this.content.Shape.Left; }

//  get Width(): number { return this.content.Shape.Width; }
//  get Height(): number { return this.content.Shape.Height; }

//  get Center(): Point { return this.content.Shape.Center; }
//  get IsHit(): boolean { return this.content.Shape.IsHit; }

//  get StateName(): string { return this.content.Shape.StateName; }
//  get AreaType(): AreaType { return this.content.Shape.AreaType; }
//  get FreedomOfMotion(): FreedomOfMotion { return this.content.Shape.FreedomOfMotion; }
//  get FreedomOfSizing(): FreedomOfMotion { return this.content.Shape.FreedomOfSizing; }

//  //DrawShape(context: any);
//  MoveBy(x: number, y: number) { this.content.Shape.MoveBy(x, y); }
//  MoveTo(x: number, y: number) { this.content.Shape.MoveTo(x, y); }
//  SizeBy(context: any, top: number, right: number, bottom: number, left: number) { this.content.Shape.SizeBy(context, top, right, bottom, left); }
//  CenterOn(x: number, y: number) { this.content.Shape.CenterOn(x, y); }
//  SetProperties(properties: any) { this.content.Shape.SetProperties(properties); }
//  Select(criteria: any): boolean { return this.content.Shape.Select(criteria); }
//  IsPointInShape(point: Point) { return this.content.Shape.IsPointInShape(point); }
//  // Track(point: Point, tracker: AreaTracker): boolean;

//  get StateIndex(): StateIndex { return this.content.Shape.StateIndex; };
//  get Ports(): IShape[] { return this.content.Shape.Ports; }
//  public HitTest(point: Point): boolean { return false;}

//  ClearHit(){this.content.Shape.ClearHit();};
//}

class SizerHandle implements IShape {
  private _active: boolean = false;
  constructor(private id: string,
    private rangeOfMotion: number,
    private side: number,
    private shape: IShape) { }

  get Id(): string { return this.shape.Id; }
  get zIndex(): number { return this.shape.zIndex; }
  Draw(ctx: CanvasRenderingContext2D): void {
    this.shape.Draw(ctx);
  }
  CopyItem(newId: string): IContextItem { return this.shape.CopyItem(newId); }
  Save(): any { return this.shape.Save(); }
  Touch(point: Point) { }
  get Top(): number { return this.shape.Top; }
  get Right(): number { return this.shape.Right; }
  get Bottom(): number { return this.shape.Bottom; }
  get Left(): number { return this.shape.Left; }

  get Width(): number { return this.shape.Width; }
  get Height(): number { return this.shape.Height; }

  get Center(): Point { return this.shape.Center; }
  get IsHit(): boolean { return this.shape.IsHit; }

  get StateName(): string { return this.shape.StateName; }
  get AreaType(): AreaType { return this.shape.AreaType; }
  get FreedomOfMotion(): FreedomOfMotion { return this.shape.FreedomOfMotion; }
  get FreedomOfSizing(): FreedomOfMotion { return this.shape.FreedomOfSizing; }

  MoveTo(x: number, y: number) { this.shape.MoveTo(x, y); }
  SizeBy(context: any, top: number, right: number, bottom: number, left: number) { this.shape.SizeBy(context, top, right, bottom, left); }
  CenterOn(x: number, y: number) { this.shape.CenterOn(x, y); }
  SetProperties(properties: any) { this.shape.SetProperties(properties); }
  Select(criteria: any): boolean { return this.shape.Select(criteria); }
  IsPointInShape(point: Point) { return this.shape.IsPointInShape(point); }
  // Track(point: Point, tracker: AreaTracker): boolean;

  get StateIndex(): StateIndex { return this.shape.StateIndex; };
 // get Ports(): IShape[] { return this.shape.Ports; }
  public HitTest(point: Point): boolean { return false; }

  ClearHit() { this.shape.ClearHit(); };

  MoveSide(x: number, y: number, handle: number) {
    switch (this.side) {
      case 0:
        if (handle == 1 || handle == 7 || handle == 2 || handle == 6) {
          this.MoveBy(x, y);
        }
        break;
      case 1:
        if (handle == 0 || handle == 2) {
          this.MoveBy(x, y);
        }
        break;
      case 2:
        if (handle == 0 || handle == 1 || handle == 3 || handle == 4) {
          this.MoveBy(x, y);
        }
        break;
      case 3:
        if (handle == 2 || handle == 4) {
          this.MoveBy(x, y);
        }
        break;
      case 4:
        if (handle == 2 || handle == 3 || handle == 5 || handle == 6) {
          this.MoveBy(x, y);
        }
        break;
      case 5:
        if (handle == 4 || handle == 6) {
          this.MoveBy(x, y);
        }
        break;
      case 6:
        if (handle == 0 || handle == 7 || handle == 5 || handle == 4) {
          this.MoveBy(x, y);
        }
        break;
      case 7:
        if (handle == 0 || handle == 6) {
          this.MoveBy(x, y);
        }
        break;
    }
  }

  get IsActive() { return this._active; }
  Activate(fos: FreedomOfMotion, areaType: AreaType) {
    this._active = (fos == FreedomOfMotion.vertical && (this.side == 1 || this.side == 2))
      || (fos == FreedomOfMotion.horizontal && (this.side == 3 || this.side == 7))
      || ((areaType == AreaType.constantArea || areaType == AreaType.lockedRatio) && this.side % 2 != 0)
      || fos == FreedomOfMotion.full;
  }

  DeActivate() { this._active = false; }

  //DrawHandle(context: CanvasRenderingContext2D, fos: FreedomOfMotion, areaType: AreaType) {
  //  switch (areaType) {
  //    case AreaType.constantArea:
  //    case AreaType.lockedRatio:
  //      if (this.side == 1 || this.side == 3 || this.side == 5 || this.side == 7) {
  //        this.Draw(context);
  //      }
  //      break;
  //    default: {
  //      switch (fos) {
  //        case FreedomOfMotion.vertical:
  //          if (this.side == 1 || this.side == 5) {
  //            this.Draw(context);
  //          }
  //          break;
  //        case FreedomOfMotion.horizontal:
  //          if (this.side == 3 || this.side == 7) {
  //            this.Draw(context);
  //          }
  //          break;
  //        default: this.Draw(context); break;
  //      }
  //    }
  //  }
  // }

  MoveBy(x: number, y: number) {
    switch (this.rangeOfMotion) {
      case 0: this.MoveBy(x, y); break;
      case 1: this.MoveBy(0, y); break;
      case 2: this.MoveBy(x, 0); break;
    };
  }

  get Side(): number { return this.side; }
}

class SizerHandleRectangle extends SizerHandle {
}

class SizerHandleEllipse extends SizerHandle {
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

export class ContextLayer implements IContextSystem {

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

  Draw(context: CanvasRenderingContext2D) {
    let self = this;
    //    context.SelectLayer(this.id);
    //    context.ClearLayer(this.id);
    this.content.forEach(s => self.DrawShape(context, s as Shape));
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

  DrawShapePortPath(context: CanvasRenderingContext2D,shapeId:string) {
 //   this.Lines.forEach(l => this._portPath.DrawShapePath(context,shapeId, l));
 //   this._portPath.DrawAreaPorts(context);
  }

  //DrawPortPath(context: CanvasRenderingContext2D) {
  //  this.Lines.forEach(l => this._portPath.DrawPath(context, l));
  //  this._portPath.DrawAreaPorts(context);
  //}

  Init(): void { };
  //AddLine(result: any) {
  //  let L = this.lines.find(l => l.Id == result.name);
  //  if (!L) {
  //    L = new Line(result.name, result.state, result.type);
  //    this.lines.push(L);
  //  }
  //  else {
  //    L.Update(result.state, result.type);
  //  }
  //  this.paths = result.paths.concat(this.paths);
  //  this.paths.forEach(function (p, i) { p.SetInterimPorts(result.type); });
  //}

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

  //AddPortPath(shape: Shape) {
  //  let self = this;
  //  shape.Ports.forEach(function (p, i) {
  //    //let pp = self.paths.find(px => px.Id == (<Port>p).PathId);
  //    //if (pp) {
  //    //  pp.AddPortPoint(p.Center, (<Port>p).PathPosition);
  //    //}
  //    //     self.paths.push();
  //  });
  //}

  //get PortPath() {
  //  return this._portPath;
  //}
  //AddPath(id: string) {
  //  this._portPath.AddPorts();
  // // this.paths.push(new PortPath(id));
  //}

  //AssignPathPoint(pathName: string, position: Point) {
  //  let path = this.paths.find(p => p.Id == pathName);
  //  if (!path) {
  //    path = new PortPath(pathName);
  //    this.paths.push(path);
  //  }
  //  return path.AddPortPoint(position);
  //}

  //PathLength(pathName: string) {
  //  let path = this.paths.find(p => p.Id == pathName);
  //  if (!path) { return 0; }
  //  return path.Length;
  //}

  //get Paths() {
  //  return this.paths;
  //}

  //get Paths() {
  //  return this.paths;
  //}

  ResetPaths() {
    this.content.forEach((s, i) => this.ResetPath(s as Shape));
  }

  ResetPath(shape: Shape) {
    //let self = this;
    //this.Paths.forEach((p, i) => {
    //  if (p) {
    //    let line = self.lines.find(l => l.Id == p.LineId);
    //    p.SetInterimPorts(line.Type || lineTypes.straight);
    //  }
    //});

    ////   });
    shape.MoveBy(0, 0);
  }

  //SetLinePaths() {
  //  let self = this;
  //  this.lines.forEach(function (l, i) {
  //    self.paths.forEach(function (p, k) {
  //      self.content.forEach(c => (<Shape>c).LinePath(p));
  //    });
  //  });
  //}

  //DrawContent(context: CanvasRenderingContext2D, content: IContextItem) {
  //  content.Draw(context);
  //}

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

  //UpdateContextState() {
  //  this.content.forEach(function (c, i) {
  //    c.UpdateContextState();
  //  });
  //}

  SelectContent(index: number) {
    if (index > 0) {
      if (index >= this.content.length) {
        index = this.content.length - 1;
      }
      const c = this.content[index];
      this.content.splice(index, 1);
      this.content.unshift(c);
      return true;
    }
    return false;
  }

  SelectContentById(contentId: string) {
    this.SelectContent(this.content.findIndex(c => c.Id === contentId));
  }

  SortContentByZIndex() {
    this.content = this.content.sort(function (a, b) { return a.zIndex < b.zIndex ? -1 : 1 });
  }

  AddContent(content: IContextItem) {
    if (content) {
      this.content.unshift(content);
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

  // AddGeneralShape(name: string, state: string) {
  //   let activeShape = this.Content[0] as Shape;
  ////   this.AddShape(new Rectangle(name, activeShape.Top + 10, activeShape.Left + 10, 100, 100, state));
  // }

  //AddShape(shape: IShape) {
  //  let activeShape = this.Content[0];
  //  if (activeShape) {
  //    activeShape.AddContent(shape);
  //  }
  //}

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

export abstract class EventContextLayer extends ContextLayer {

  _mouseStateDownTracker: AreaSizer = new AreaSizer();
  _mouseStateUpTracker: ITracker;// = new AreaTracker();
  _tracker: ITracker = null;
  //protected _actionItem: ActionItemsss;
  protected _selectedItem: IContextItem;

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
    // this._actionItem = new ActionItemsss();
    //   this._selectedTracker = this._tracker;
    //   EventContextLayer._sizer = new AreaTracker(null);
 
  }

  Init() {
    this._mouseStateUpTracker = this.GetMouseUpTracker();
    this._tracker = this._mouseStateUpTracker;
  }


  abstract AutoUpdate();
  abstract LoadCanvasData(inputData: any): Promise<any>;
  abstract UpdateCanvasData(inputData: any);
  abstract GetContextData(): any;
  abstract GetTouchedShape(point: Point): IShape;
  abstract GetSelectedShape(point: Point): IShape;
  abstract ReturnTouchedShape(shape: IShape);


  get hasSelection() {
    return this._selectedItem != null;
  }

  GetMouseUpTracker() {
    return new AreaTracker();
  }
  //InitializeContext(context: CanvasRenderingContext2D) {


  //}

  ClearContext(context: CanvasRenderingContext2D) {
    context.clearRect(0, 0, this.ParentArea.Width, this.ParentArea.Height);

  }

  selectItem(event: any, context: CanvasRenderingContext2D): void {
    let c = this.GetSelectedShape(this._tracker.mousePosition.mousePosition) as IShape;
    if (c) {
      this._tracker.Reset(c);
    }
    this._mouseStateDownTracker.SetTracker(this._mouseStateUpTracker);
    this._tracker = this._mouseStateDownTracker;
    // 
    this._tracker.Draw(context, true);
    //    let d = this._tracker.mouseCapture(event, this.ParentArea);
    //if (!this._tracker.Track(d)) {
    //  let c = this.RemoveContentByPoint(d) as IShape;
    //  if (c) {
    //    this._tracker = TrackerFactory.GetTracker(c.Id);
    //    this._tracker.Reset(c);
    //  }
    //  else {
    //    this._tracker.Reset(null);
    //  }
    //}
    //this.ClearContext(context);
    //this._tracker.Draw(context, true);
  }

  ReleaseTouchedShape( context: CanvasRenderingContext2D){
    let c = this.GetTouchedShape(this._tracker.mousePosition.mousePosition) as IShape;
    let p = this._tracker.TrackedArea;
    if (p) {
      p.ClearHit();
      this._tracker.Draw(context, true);
    }
    this._tracker.Reset(c);
    this._tracker.Draw(context, true);
    this.ReturnTouchedShape(p);
  }

  mouseMove(event: any, context: CanvasRenderingContext2D): void {
    if (!this._tracker.mouseMove(event, this.ParentArea)) {
      this.ReleaseTouchedShape(context);
    }
    else if (this._mouseStateUpTracker.TrackedArea) {
      let sid = this._mouseStateUpTracker.TrackedArea.Id;
      this.ClearContext(context);
      this._tracker.Draw(context, true);
    }
  }

  releaseSelectedItem(event: any, context: CanvasRenderingContext2D) {

    this._tracker = this._mouseStateUpTracker;
    this.ReleaseTouchedShape(context);
  //  this._mouseStateDownTracker.Reset(null);
   // this._tracker.Draw(context, true);
    //  this._actionItem.mouseRelease();
    //this.PutContentItem(this._tracker.TrackedArea);
    //this._tracker.Reset(this._tracker.TrackedArea);
    //this.ClearContext(context);
    //this.Draw(context);
    //this._tracker.Draw(context, false);
  }

  //mouseRelease(): void {
  //  this._actionItem.mouseRelease();
  //}

  DrawSizer(context: CanvasRenderingContext2D) {
    this._tracker.Draw(context, true);
  }

  Draw(context: CanvasRenderingContext2D, initial: boolean = false) {
    this.ClearContext(context);
    this.content.forEach(s =>
      (<Shape>s).Draw(context));
    //this.content.forEach(s =>
    //  (<Shape>s).Ports.forEach(p => this.DrawPortPath(context, p as Port)));
//    this.DrawPortPath(context);

    if (initial) {
      this._tracker.Draw(context, true);
    }
  }
}

export interface ITracker {

  MoveItem(dx: number, dy: number);
  Reset(shape: IShape);
  Draw(context: CanvasRenderingContext2D, initial: boolean);
  //  RegisterShape(shapeId: string): void;
  // ForShape(shapeId: string): boolean;
  mouseMove(event: any, boundingArea: Rectangle): boolean;
  Track(point: Point): boolean;
  TrackedArea: IShape;
  Action(): boolean;
  HitTest(): boolean;
  mouseCapture(event: any, boundingArea: Rectangle): Point;
  mousePosition: MousePosition;
  Id: string;
  //dX: number;
  //dY: number;
}

export class MousePosition {

  protected _mousePosition: Point = new Point();
  private _previousPosition: Point = new Point();
  private _delta: Point = new Point();

  Init(event: any, boundingArea: Rectangle) {
    this._delta.SetToPosition(0, 0);
    this.PositionFromEvent(event, boundingArea);
    this._previousPosition.SetToPosition(this.mousePosition.X, this.mousePosition.Y);
  }

  Update(event: any, boundingArea: Rectangle) {
    this._previousPosition.SetToPosition(this.mousePosition.X, this.mousePosition.Y);
    this.PositionFromEvent(event, boundingArea);
    this.SetDelta();
  }

  private SetDelta() {
  
    let dx = this._mousePosition.X - this._previousPosition.X;
    let dy = this._mousePosition.Y - this._previousPosition.Y;
    this._delta.SetToPosition(dx, dy);
  }

  private PositionFromEvent(event: any, boundingArea: Rectangle): void {

    var offsetX = event.clientX - boundingArea.Left;
    var offsetY = event.clientY - boundingArea.Top;
    this.mousePosition.SetToPosition(offsetX, offsetY);
  }

  get mousePosition() { return this._mousePosition; }
  get Delta(): Point { return this._delta; }

}

//export class GroupAreaTracker implements ITracker  {

//  protected _mousePosition: MousePosition = new MousePosition();
//  protected _trackedGroup: IShape[] = [];

//  mouseMove(event: any, boundingArea: Rectangle): boolean {
//    //this._delta.SetToPosition(0, 0);
//    //this.positionFromEvent(event, boundingArea);
//    //this.Delta();
//    //this._previousPosition.SetToPosition(this.mousePosition.X, this.mousePosition.Y);
//    return false;// this.HitTest();// returns true if still in tracked area...
//  }

//  MoveItem(dx: number, dy: number) {
//    this._trackedGroup.forEach( g => g.MoveBy(dx, dy));
//  }

//  //Reset(shape: IShape): IShape;
//  //Draw(context: CanvasRenderingContext2D, initial: boolean);
//  ////  RegisterShape(shapeId: string): void;
//  //// ForShape(shapeId: string): boolean;
//  //Track(point: Point): boolean;
//  //TrackedArea: IShape;
//  //Action(): boolean;
//  //HitTest(): boolean;
//  //mouseCapture(event: any, boundingArea: Rectangle): Point;
//  mousePosition: MousePosition;
//  //Id: string;
//  dX: number;
//  dY: number;

//  constructor(private id: string = "no_tracking") { }

//  get Id(): string { return this.id; }

//  //get mousePosition() { return this._mousePosition; }

//  //RegisterShape(shapeId: string) {
//  //  if (!this.ForShape(shapeId)) {
//  //    this._shapes.push(shapeId);
//  //  }
//  //}

//  //ForShape(shapeId: string): boolean {
//  //  return this._shapes.findIndex(s => s == shapeId) >= 0;
//  //}

//  //get TrackedArea(): IShape {
//  //  return this._trackedArea;
//  //}


//  Draw(context: CanvasRenderingContext2D, initial: boolean = false) {
//    if (this._trackedArea) {
//      this._trackedArea.Draw(context);
//    }
//  }

//  Reset(shape: IShape): IShape {
//    let previousArea = this._trackedArea;
//    this._trackedArea = shape;
//    //    console.error("TA ID " + this._trackedArea.Id);
//    return previousArea;
//  }

//  Track(point: Point): boolean {
//    return false;
//  }

//  HitTest(): boolean {
//    return true; //this._trackedArea && (<IShape>this._trackedArea).IsPointInShape(this.mousePosition.mousePosition);
//  }

//  Action(): boolean {
//    return !this.HitTest();
//  }

//  GetDelta(previousPosition: Point, mousePosition: Point, delta: Point): Point {
//    return this._mousePosition.Delta;
//  }

//  //private Delta(): Point {
//  //  this._delta = this.GetDelta(
//  //    this._previousPosition,
//  //    this.mousePosition,
//  //    this._delta);

//  //  return this._delta;
//  //}

//  //get dX() { return this._delta.X; }
//  //get dY() { return this._delta.Y; }

//  mouseCapture(event: any, boundingArea: Rectangle): Point {

//    //this.positionFromEvent(event, boundingArea);
//    //this._previousPosition.SetToPosition(this.mousePosition.X, this.mousePosition.Y);
//    this._mousePosition.Init(event, boundingArea);
//    return this.mousePosition.mousePosition;
//  }

//  //positionFromEvent(event: any, boundingArea: Rectangle): void {

//  //  var offsetX = event.clientX - boundingArea.Left;
//  //  var offsetY = event.clientY - boundingArea.Top;
//  //  this.mousePosition.SetToPosition(offsetX, offsetY);
//  //}

//  mouseRelease(): void {
//    //  this._previousPosition.SetToPosition(0, 0);
//    //   this.mousePosition.SetToPosition(0, 0);
//  }
//}


export class AreaTracker implements ITracker {

  protected _mousePosition: MousePosition = new MousePosition();
  protected _trackedArea: IShape;
  //protected _mousePosition: Point = new Point();
  //private _previousPosition: Point = new Point();
  //private _delta: Point = new Point();

  constructor(private id: string = "no_tracking") { }

  get Id(): string { return this.id; }

  get mousePosition() { return this._mousePosition; }

  //RegisterShape(shapeId: string) {
  //  if (!this.ForShape(shapeId)) {
  //    this._shapes.push(shapeId);
  //  }
  //}

  //ForShape(shapeId: string): boolean {
  //  return this._shapes.findIndex(s => s == shapeId) >= 0;
  //}

  get TrackedArea(): IShape {
    return this._trackedArea;
  }

  MoveItem(dx: number, dy: number) { }

  Draw(context: CanvasRenderingContext2D, initial: boolean = false) {
    if (this._trackedArea) {
      this._trackedArea.Draw(context);
    }
  }

  Reset(shape: IShape) {
  //  let previousArea = this._trackedArea;

    this._trackedArea = shape;
    //    console.error("TA ID " + this._trackedArea.Id);
  }

  Track(point: Point): boolean {
    return false;
  }

  HitTest(): boolean {
    return this._trackedArea && (<IShape>this._trackedArea).IsPointInShape(this.mousePosition.mousePosition);
  }

  Action(): boolean {
    return !this.HitTest();
  }

  GetDelta(previousPosition: Point, mousePosition: Point, delta: Point): Point {
    return this._mousePosition.Delta;
  }

  mouseMove(event: any, boundingArea: Rectangle): boolean {
    this._mousePosition.Update(event, boundingArea);
    return this.HitTest();// returns true if still in tracked area...
  }

  //private Delta(): Point {
  //  this._delta = this.GetDelta(
  //    this._previousPosition,
  //    this.mousePosition,
  //    this._delta);

  //  return this._delta;
  //}

  //get dX() { return this._delta.X; }
  //get dY() { return this._delta.Y; }

  mouseCapture(event: any, boundingArea: Rectangle): Point {

    //this.positionFromEvent(event, boundingArea);
    //this._previousPosition.SetToPosition(this.mousePosition.X, this.mousePosition.Y);
    this._mousePosition.Init(event, boundingArea);
    return this.mousePosition.mousePosition;
  }

  //positionFromEvent(event: any, boundingArea: Rectangle): void {

  //  var offsetX = event.clientX - boundingArea.Left;
  //  var offsetY = event.clientY - boundingArea.Top;
  //  this.mousePosition.SetToPosition(offsetX, offsetY);
  //}

  mouseRelease(): void {
  //  this._previousPosition.SetToPosition(0, 0);
 //   this.mousePosition.SetToPosition(0, 0);
  }
}

export class ShapeContainerTracker extends AreaTracker {
  _content: IShapeContainer;
 // protected _trackedAreas: IShape[];

  constructor(id: string = "no_tracking") {
    super(id);
  }

  Reset(shapeContainer: IShape) {
    this._content = shapeContainer as IShapeContainer;

  }

}

export class PathShapeTracker extends AreaTracker {

  private _path: PathLink[] = [];

  constructor(private line: Line, id: string = "no_tracking") {
    super(id);
  }

  SetActivePath(activePath: PathLink[],line: Line) {
    this._path = activePath.concat([]);
    this.line = line;
  }

  get ActivePath(): PathLink[] {
    return this._path;
  }

  ClearActivePath() {
    this._path = [];
  }

  Draw(context: CanvasRenderingContext2D, initial: boolean = false) {
    if (this._trackedArea) {
   //   console.error("PATH Draw trackedarea Top:" + this._trackedArea.Top + " Left:" + this._trackedArea.Left);
      let area = this._trackedArea as PathShape;
      area.Draw(context);
      if (this.line ) {
        area.FindPorts(this._path);
        this.line.DrawPathLinks(context, this._path);
        area.DrawPorts(context);
      }
    }
  }
 
}

export class AreaSizer extends AreaTracker {

  private _handles: SizerHandle[] = [];
  private _activeHandles: SizerHandle[] = [];
  private _sideSelected: boolean = false;
  private _parentTracker: ITracker;

  constructor(id: string = "size_tracking") {

    super(id);
    let r = new Ellipse('sizer', 0, 0, 24, 16, 'sizerHandleA');

    this._handles.push(new SizerHandle('sizerTopLeft', 0, 0, r.CopyShape(r.Id + '_handle_text_TopLeft')));
    this._handles.push(new SizerHandle('sizerTop', 1, 1, r.CopyShape(r.Id + '_handle_text_Top')));
    this._handles.push(new SizerHandle('sizerTopRight', 0, 2, r.CopyShape(r.Id + '_handle_text_TopRight')));
    this._handles.push(new SizerHandle('sizerRight', 2, 3, r.CopyShape(r.Id + '_handle_text_right')));
    this._handles.push(new SizerHandle('sizerBottomRight', 0, 4, r.CopyShape(r.Id + '_handle_text_BottomRight')));
    this._handles.push(new SizerHandle('sizerBottom', 1, 5, r.CopyShape(r.Id + '_handle_text_Bottom')));
    this._handles.push(new SizerHandle('sizerBottomLeft', 0, 6, r.CopyShape(r.Id + '_handle_text_BottomLeft')));
    this._handles.push(new SizerHandle('sizerLeft', 2, 7, r.CopyShape(r.Id + '_handle_text_left')));

  }

  SetTracker(tracker: ITracker) {
    this._parentTracker = tracker;
  }

  Track(point: Point): boolean {

    if (this.select(point)) {
      return true;
    }
    if (this._trackedArea && (<Shape>this._trackedArea).IsPointInShape(point)) {
      this.Deactivate();
      return true;
    }
    return false;
  }

  AssignToClass(clss: string): void { }

  Activate() {
    this._handles
      .forEach(h => h.Activate(
        this._trackedArea.FreedomOfSizing,
        this._trackedArea.AreaType));
  }

  Deactivate() {
    this._handles.forEach(h => h.DeActivate());
    this.ReleaseHandle();
  }

  get Class(): string { return ""; }

  ReleaseHandle() {
    this._activeHandles = [];
  }

  //HitTest(point: Point): boolean {
  //  return !(<Shape>this._trackedArea).IsPointInShape(point);
  //}

  Action() {
    this.MoveItem(this._mousePosition.Delta.X, this._mousePosition.Delta.Y );
    return true;
  }

  private select(point: Point): boolean {
    this._activeHandles = [];
    let handle = this._handles.filter(h => h.IsActive).find(h => h.IsPointInShape(point));
    if (handle) {

      let x = handle.Center.X;
      let y = handle.Center.Y;

      switch (handle.Side) {
        case 0: this._activeHandles = this._handles.filter(s => s.Center.Y == y && s.Center.X == x); break;
        case 1: this._activeHandles = this._handles.filter(s => s.Center.Y == y); break;
        case 2: this._activeHandles = this._handles.filter(s => s.Center.Y == y && s.Center.X == x); break;
        case 3: this._activeHandles = this._handles.filter(s => s.Center.X == x); break;
        case 4: this._activeHandles = this._handles.filter(s => s.Center.Y == y && s.Center.X == x); break;
        case 5: this._activeHandles = this._handles.filter(s => s.Center.Y == y); break;
        case 6: this._activeHandles = this._handles.filter(s => s.Center.Y == y && s.Center.X == x); break;
        case 7: this._activeHandles = this._handles.filter(s => s.Center.X == x); break;
      }
    }
    this._sideSelected = this._activeHandles.length > 0;
    return this._sideSelected;
  }

  private ResizeShape() {
    this._trackedArea.SizeBy(
      null,
      this._handles[1].Center.Y,
      this._handles[3].Center.X,
      this._handles[5].Center.Y,
      this._handles[7].Center.X);
  }

  Hide() {
    this.Reset(null);
  }

  Reset(shape: IShape): IShape {

    this.Deactivate();
 //   let oldShape = this._parentTracker.Reset(shape);
    let area = this._parentTracker.TrackedArea;
    if( !area ){
      return area;
    }
    let xhalf = area.Left + (area.Width / 2);
    let yhalf = area.Top + (area.Height / 2);
    this._handles[0].CenterOn(area.Left, area.Top);
    this._handles[1].CenterOn(xhalf, area.Top);
    this._handles[2].CenterOn(area.Right, area.Top);
    this._handles[3].CenterOn(area.Right, yhalf);
    this._handles[4].CenterOn(area.Right, area.Bottom);
    this._handles[5].CenterOn(xhalf, area.Bottom);
    this._handles[6].CenterOn(area.Left, area.Bottom);
    this._handles[7].CenterOn(area.Left, yhalf);
    this.Activate();
    return area;
  }

  get TrackedArea(): IShape {
    return this._parentTracker.TrackedArea;
  }

  Draw(context: CanvasRenderingContext2D, initial: boolean = false) {
    this._parentTracker.Draw(context, initial);
    let activeHandles = this._handles.filter(h => h.IsActive);
    activeHandles.forEach(h => h.Draw(context));

  }

  mouseMove(event: any, boundingArea: Rectangle): boolean {
    this._parentTracker.mouseMove(event, boundingArea);
    this.MoveItem(this._parentTracker.mousePosition.Delta.X, this._parentTracker.mousePosition.Delta.Y);
    return true;
  }

  MoveItem(dx: number, dy: number) {
    if (!this.MoveSide(dx, dy) && this._parentTracker.TrackedArea) {
      this._parentTracker.TrackedArea.MoveBy(dx, dy);
    }
  }

  protected MoveSide(dx: number, dy: number): boolean {
    if (this._sideSelected) {
      this._activeHandles.forEach(h => h.MoveBy(dx, dy));
      this.ResizeShape();
    }
    return this._sideSelected;
  }
}

export class LinearTracker extends AreaTracker {

  constructor(private parentAreaRight: number, id: string = "linear_tracking") {

    super(id);
  }

  get TrackedArea(): IShape {
    return this._trackedArea;
  }

  MoveItem(dx: number, dy: number) {

    if (this._trackedArea) {

      //   (<Shape>this._trackedArea).Contents.forEach((s, i) => s.Shape.MoveBy(dx, 0));
      //   (<Shape>this._trackedArea).ShiftContent(new Point(dx, dy), this.parentAreaRight);
    }
  }

  Draw(context: CanvasRenderingContext2D, initial: boolean = false) {

    if (this._trackedArea) {

      this._trackedArea.Draw(context);
      (<Shape>this._trackedArea).Draw(context);
    }
  }

  Reset(shape: IShape) {
    //  this._trackedArea = shape;
   // return this._trackedArea;
  }

  Track(point: Point): boolean {


    return false;
  }
}

export class TrackerFactory {

  private static _trackers: ITracker[] = [];

  static AddTracker(tracker: ITracker) {
    this._trackers.push(tracker);
  }

  static Clear() {
    this._trackers = [];
  }
  static GetTracker(shapeId: string) {
    //return this._trackers.find(t => t.ForShape(shapeId));
  }

  static RegisterTracker(trackerId: string, shapeId: string) {
    let t = this._trackers.find(t => t.Id == trackerId);
    if (!t) {
      return;
    }
    //   t.RegisterShape(shapeId);

  }
}

export class ActionLayer extends ContextLayer {// uses separate context
  private _shapeSelected: boolean = false;
  private _tracker: AreaTracker;
  private _layer: ContextLayer;
  constructor(parentArea: Rectangle, layerName: string) {
    super(parentArea, 'edit', layerName, '', new Date());
    let bgNdx = DisplayValues.GetColorIndex('default.edit.background');
    this._tracker = new AreaTracker();
  }

  get Editing() {
    return this._layer != null;
  }

  EndEdit(): boolean {
    if (!this._layer) { return false; }
    this._tracker.Reset(this._layer.Content[0] as Shape);
    this._layer = null;
    return true;
  }

  SetLayer(lyr: ContextLayer) {
    if (lyr) {
      if (this._layer && lyr.Id == this._layer.Id) { return; }
      this._layer = lyr;
      this._tracker.Reset(this._layer.Content[0] as Shape);
      this._shapeSelected = true;
    }
  }

  get ShapeSelected() {
    return this._shapeSelected;
  }

  Select(point: Point): boolean {

    return false;
  }

  //AddPort(id: string,
  //  //offsetX: number,
  //  //offsetY: number,
  //  //type: ePortType,
  //  //pathName: string) {
  //  //if (!this._layer) { return; }

  //  //let ppath = this._layer.Paths.find(p => p.Id == pathName);
  //  //if (!ppath) { return; }
  //  //let shape = this._layer.Content[0] as Shape;

  //  //let port = new Port(id, offsetX, offsetY, shape, type, id + "_state", pathName, ppath.Length);
  //  //let removedPort = shape.AddPort(port);
  //  //if (null != removedPort) {
  //  //  ppath.RemovePortPoint(removedPort.Center, port.Center);
  //  //}
  //  //else {
  //  //  ppath.AddPortPoint(port.Center);
  //  //}
  //}

  //AddShape(shape: IShape) {
  //  this._layer.AddShape(shape);
  //}

  AddContent(content: IContextItem) {
    if (!this._layer) { return; }
    this._tracker.Reset(this._layer.Content[0] as Shape);
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
      this._tracker.Reset(this._layer.Content[0] as Shape);
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
    //let self = this;
    //let paths = this._layer.Paths.filter(p => p.Id == port.ParentShapeId);
    //paths = paths.filter(p => (<Shape>this._layer.Content[0]).Ports.findIndex(pt => (<Port>pt).PathId == p.Id) < 0);
    //paths.forEach(function (p, i) {
    //  let lines = self._layer.Lines.filter(l => l.Id == p.LineId);
    //  lines.forEach(l => l.DrawLine(context, p.Ports));
    //});
  }

  Draw(context: CanvasRenderingContext2D) {

    if (!this._layer) { return; }
    this._layer.Content[0].Draw(context);
    (<Shape>this._layer.Content[0]).Draw(context);
  //  this._layer.DrawPortPath(context);
    this._tracker.Draw(context);
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


  //AddPort(id: string,
  //  offsetX: number,
  //  offsetY: number,
  //  type: ePortType,
  //  path: string) {

  //}

  //get Paths() {
  //  return this.SelectedLayer.Paths;
  //}

  get Lines() {
    return this.SelectedLayer.Lines;
  }

  AddText(text: string, containerStateName: string, contentStateName: string, fromSource: boolean, angle: number = 0) {
    //   this.SelectedLayer.AddText(text, containerStateName, contentStateName, fromSource, angle);
  }

  AddImage(imageName: any, containerStateName: string, contentStateName: string, fromSource: boolean, angle = 0, imageIndex = 0) {
    this.SelectedLayer.AddImage(imageName, containerStateName, contentStateName, fromSource, angle = 0, imageIndex);
  }

  //AddGeneralShape(id: string, state: string) {
  //  this.SelectedLayer.AddGeneralShape(id, state);
  //}

  //AddShape(shape: IShape) {
  //  this.SelectedLayer.AddShape(shape);
  //}

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
