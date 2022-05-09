import { Injectable } from '@angular/core';
import { Point } from "./shapes/primitives/point";
import { Size } from "./shapes/primitives/size";
import { ShapeSelectResult, eContentType } from "./shapes/shapeSelected";
import { Shape } from "./shapes/shape";
import { forEach } from "@angular/router/src/utils/collection";
import { Line, PortPath, lineTypes, VerticalToVerticalLine, VerticaToHorizontallLine, HorizontalToVerticalLine, HorizontallToHorizontalLine, GradientLine, BezierLine } from './lines/line';
import { Port, ePortType } from './shapes/port';
import { Rectangle } from './shapes/rectangle';
import { StateIndex, UIStates, DisplayValues } from './DisplayValues';
import { ILine } from './lines/ILine';
import { Ellipse } from './shapes/ellipse';
import { Path } from './lines/path';
import { LineService } from './lines/service/line.service';
import { TextShape } from '../models/shapes/content/text/text';
import { IShape, FreedomOfMotion, AreaType } from './shapes/IShape';
import { Content, TextContent, ImageContent } from '../models/shapes/content/Content';
import { ImageShape } from './shapes/content/image/image';
import { ContextModel } from '../component/context.model';
import { emptyGuid } from '../../const/constvalues.js';
import { IActionItem, ActionItemsss, IMouseState } from '../component/layers/Interfaces/IActionLayer';
import { YearContent } from 'src/components/timeline/service/timeLine.model';
import { ContentShape } from './shapes/content/ContentShape';

class SizerHandle extends Rectangle {
  private _active: boolean = false;
  constructor(id: string,
    private rangeOfMotion: number,
    private side: number,
    top: number,
    left: number,
    width: number,
    height: number,
    stateName: string) {
    super(id, top, left, width, height, stateName);
  }

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
      case 0: super.MoveBy(x, y); break;
      case 1: super.MoveBy(0, y); break;
      case 2: super.MoveBy(x, 0); break;
    };
  }

  get Side(): number { return this.side; }
}

export interface IContextItem {

  Id: string;
  zIndex: number;
  Draw(ctx: CanvasRenderingContext2D): void;
  CopyItem(newId: string): IContextItem;
  Save(): any;
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

  private layers: ContextLayer[] = [];
  private unitCell: UnitCell = null;

  constructor(
    private parentArea: Rectangle,
    private id: string,
    name: string,
    updatedBy: string,
    updatedOn: Date = new Date(),
    private displayState: string = '',
    protected content: IContextItem[] = [],
    protected lines: ILine[] = [],
    protected paths: PortPath[] = []) {
    this.AddCell(id, name, updatedBy, updatedOn);
  }

  get ParentArea() {
    return this.parentArea;
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
    this.paths = [];
  }

  Draw(context: CanvasRenderingContext2D) {
    let self = this;
    //    context.SelectLayer(this.id);
    //    context.ClearLayer(this.id);
    this.content.forEach(s => self.DrawShape(context, s as Shape));
  }

  DrawPaths(context: CanvasRenderingContext2D, line: ILine) {
    let paths = this.paths.filter(p => p.LineId == line.Id);
    // paths.forEach(p => line.DrawPortPath(context, p));
  }

  DrawShape(context: CanvasRenderingContext2D, shape: Shape) {
    shape.Draw(context);
    shape.Ports.forEach(p => this.DrawPortPath(context, p as Port));
    shape.DrawContent(context);
  }

  DrawPortPath(context: CanvasRenderingContext2D, port: Port) {
    let self = this;
    let paths = this.paths.filter(p => p.Id == port.PathId);

    paths.forEach(function (p, i) {
      let lines = self.lines.filter(l => l.Id == p.LineId);
      lines.forEach(l => l.DrawLine(context, p.Ports));
    });
  }

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
    this.paths = paths.concat(this.paths);
    //  this.paths.forEach(function (p, i) { p.SetInterimPorts(type); });
  }

  AddPortPath(shape: Shape) {
    let self = this;
    shape.Ports.forEach(function (p, i) {
      let pp = self.paths.find(px => px.Id == (<Port>p).PathId);
      if (pp) {
        pp.AddPortPoint(p.Center, (<Port>p).PathPosition);
      }
      //     self.paths.push();
    });
  }

  AddPath(id: string, lineId: string, ports: Point[]) {
    this.paths.push(new PortPath(id, lineId, ports));
  }

  //AssignPathPoint(pathName: string, position: Point) {
  //  let path = this.paths.find(p => p.Id == pathName);
  //  if (!path) {
  //    path = new PortPath(pathName);
  //    this.paths.push(path);
  //  }
  //  return path.AddPortPoint(position);
  //}

  PathLength(pathName: string) {
    let path = this.paths.find(p => p.Id == pathName);
    if (!path) { return 0; }
    return path.Length;
  }

  //get Paths() {
  //  return this.paths;
  //}

  get Paths() {
    return this.paths;
  }

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

  SetLinePaths() {
    let self = this;
    this.lines.forEach(function (l, i) {
      self.paths.forEach(function (p, k) {
        self.content.forEach(c => (<Shape>c).LinePath(p));
      });
    });
  }

  //DrawContent(context: CanvasRenderingContext2D, content: IContextItem) {
  //  content.Draw(context);
  //}

  get Content(): IContextItem[] { return this.content; }

  ClearContent(start: number = 0) {
    let c = this.content[this.content.length - 1];
    this.content = [];
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
      this.AddPortPath(content as Shape);
      this.SortContentByZIndex();
    }
  }

  AddText(text: string, containerStateName: string, contentStateName: string, fromSource: boolean, angle: number = 0) {
    let activeShape = this.Content[0] as Shape;
    if (activeShape) {
      let id = '_text_content_' + activeShape.Contents.length;
      let shp = new TextShape(
        activeShape.Id + id,
        activeShape.Top + 3,
        activeShape.Left + 3, 0, 10,
        containerStateName,
        new TextContent(emptyGuid, contentStateName, text, fromSource, angle));
      activeShape.AddContent(shp);
    }
  }

  AddImage(imageName: string, containerStateName: string, contentStateName: string, fromSource: boolean, angle: number = 0, imageIndex = 0) {
    let activeShape = this.Content[0] as Shape;
    if (activeShape) {
      let id = '_image_content_' + activeShape.Contents.length;
      let shp = new ImageShape(
        activeShape.Id + id,
        activeShape.Top + 3,
        activeShape.Left + 3, 10, 10,
        containerStateName,
        new ImageContent(emptyGuid, contentStateName, imageName, fromSource, angle, imageIndex));
      activeShape.AddContent(shp);
    }
  }

  AddGeneralShape(name: string, state: string) {
    let activeShape = this.Content[0] as Shape;
    this.AddShape(new Rectangle(name, activeShape.Top + 10, activeShape.Left + 10, 100, 100, state));
  }

  AddShape(shape: IShape) {
    let activeShape = this.Content[0] as Shape;
    if (activeShape) {
      activeShape.AddContent(shape as ContentShape);
    }
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
    if (i < 0) { return null; }
    let result = this.content.splice(i, 1);
    return (result.length > 0) ? result[0] : null;
  };

  RemoveContentByPoint(pt: Point): IContextItem {
    let i = this.content.reverse().findIndex(c => (<Rectangle>c).IsPointInShape(pt));
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
    if (item) {
      this.content.unshift(item);
      this.SortContentByZIndex();
    }
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

export class EventContextLayer extends ContextLayer {

  _selectedTracker: ITracker = null;
  _tracker: AreaTracker = new AreaTracker();
  _sizer: AreaSizer = new AreaSizer();

  protected _selectedItem: IContextItem;
  private _actionItem: ActionItemsss;
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
    super(parentArea, id, name, updatedBy, updatedOn, displayState, content, lines, paths);
    this._actionItem = new ActionItemsss();
    this._selectedTracker = this._tracker;
    //   EventContextLayer._sizer = new AreaTracker(null);
  }

  get hasSelection() {
    return this._selectedItem != null;
  }

  get mouseState(): IMouseState {
    return this._actionItem.mouseState;
  }

  get mousePosition(): Point {
    return this._actionItem.mousePosition;
  }

  private Track(point: Point): boolean {
    let c = this.RemoveContentByPoint(point);
    if (!c) {
      return false;
    }
    this._sizer.Reset(c as IShape);
  //  this._sizer.Hide();

    return true;
  }

  private Size(point: Point): boolean {
    if (this._sizer.Select(point)) {
      this.RemoveContentById(this._sizer.TrackedArea.Id || '');
  //    this._selectedTracker = this._sizer;
      return true;
    }
    return false;
  }

  mouseCapture(event: any, boundingArea: Rectangle): Point {
    return this._actionItem.mouseCapture(event, boundingArea);
  }

  selectItem(event: any, boundingArea: Rectangle, context: CanvasRenderingContext2D): void {
   // this._selectedTracker = this._tracker;
    let d = this.mouseCapture(event, this.ParentArea);
    this.Track(d);
  //  this.Size(d);
    context.clearRect(
      0,
      0,
      this.ParentArea.Width,
      this.ParentArea.Height);
    this._sizer.Draw(context);
  }

  releaseSelectedItem(context: CanvasRenderingContext2D) {
  //  this._selectedTracker = this._sizer;

    //if (this._selectedItem != null) {
    //  this.content.unshift(this._selectedItem);
    //  this._selectedItem = null;
    //}

    //   this.content.forEach(c => (<Shape>c).Resize(this._sizer));
    //   this._sizer.Release();
    //this._tracker.Release();
   // this.content.forEach(c => (<Shape>c).ClearHit());
    this._actionItem.mouseRelease();
    context.clearRect(
      0,
      0,
      this.ParentArea.Width,
      this.ParentArea.Height);
  //  this.RemoveContentByPoint
    if (this._sizer.TrackedArea == null) {
      this.PutContentItem(this._tracker.TrackedArea);
    }
    this._sizer.Reset(this._tracker.TrackedArea);
    this.Draw(context);
    this._sizer.Draw(context);
  }

  mouseRelease(): void {
    this._actionItem.mouseRelease();
    this._sizer.Reset(this._tracker.TrackedArea);
  }

  mouseMove(event: any, boundingArea: Rectangle, context: CanvasRenderingContext2D): Point {
    let d = this._actionItem.mouseMove(event, boundingArea);
    if (d.X == 0 && d.Y == 0) {
      return d;
    }
    context.clearRect(
      0,
      0,
      boundingArea.Width,
      boundingArea.Height);
    this._selectedTracker.MoveItem(d.X, d.Y);
    this._selectedTracker.Draw(context);
    return d;
  }

  //DrawHitContent(context: CanvasRenderingContext2D) {
  //  this.content.forEach(s => (<Shape>s).DrawHitContent(context));
  //}

  //DrawNotHitContent(context: CanvasRenderingContext2D) {
  //  this.content.forEach(
  //    s => !(<Shape>s).IsTracked 
  //    &&  (<Shape>s).Draw(context));
  //}

  //DrawActive(context: CanvasRenderingContext2D) {
  //  this._tracker.Draw(context);
  //  //if( )
  //  // this._sizer.Draw(context);  only draw this when mouse up or sizing.
  //}

  DrawSizer(context: CanvasRenderingContext2D) {
    this._sizer.Draw(context);
  }

  Draw(context: CanvasRenderingContext2D,initial: boolean = false) {
    context.clearRect(
      0,
      0,
      this.ParentArea.Width,
      this.ParentArea.Height);
    this.content.forEach(s => (<Shape>s).DrawContent(context));
    if (initial) {
      this._sizer.Draw(context);
    }
  }
}

//export class PortLayer extends ContextLayer {

//  _ports: Port[] = [];

//  constructor(
//    context: any,
//    id: string,
//    displayState: string,
//    content: IContextItem[] = []) {
//    super(context, id, displayState, content);
//  }

//  AddContent(content: Port) {
//    this.content.push(content);
//  }
//}


export interface ITracker extends IActionItem {
  MoveItem(dx: number, dy: number);
  Reset(shape: IShape);
  Draw(context: CanvasRenderingContext2D);
}

export class AreaSizer implements ITracker {

  protected _trackedArea: IShape;
  private _handles: SizerHandle[] = [];
  private _activeHandles: SizerHandle[] = [];
  // protected _selectedSide = -1;
  private _fos: FreedomOfMotion;
  private _areaType: AreaType;
  private _sideSelected: boolean = false;
  private _actionItem: ActionItemsss;

  constructor() { // Create the handles...
    this._handles.push(new SizerHandle('sizerTopLeft', 0, 0, 0, 0, 9, 9, 'default.edit.background'));
    this._handles.push(new SizerHandle('sizerTop', 1, 1, 0, 0, 9, 9, 'default.edit.background'));
    this._handles.push(new SizerHandle('sizerTopRight', 0, 2, 0, 0, 9, 9, 'default.edit.background'));
    this._handles.push(new SizerHandle('sizerRight', 2, 3, 0, 0, 9, 9, 'default.edit.background'));
    this._handles.push(new SizerHandle('sizerBottomRight', 0, 4, 0, 0, 9, 9, 'default.edit.background'));
    this._handles.push(new SizerHandle('sizerBottom', 1, 5, 0, 0, 9, 9, 'default.edit.background'));
    this._handles.push(new SizerHandle('sizerBottomLeft', 0, 6, 0, 0, 9, 9, 'default.edit.background'));
    this._handles.push(new SizerHandle('sizerLeft', 2, 7, 0, 0, 9, 9, 'default.edit.background'));
  }

  get mouseState(): IMouseState { return this._actionItem.mouseState; };
  get mousePosition(): Point { return this._actionItem.mousePosition; };

  //private Track(point: Point): boolean {
  //  let c = this.RemoveContentByPoint(point);
  //  if (!c) {
  //    return false;
  //  }
  //  this._sizer.Reset(c as IShape);
  //  //  this._sizer.Hide();

  //  return true;
  //}

  mouseCapture(event: any, boundingArea: Rectangle): Point {
    return this._actionItem.mouseCapture(event, boundingArea);
  }

  mouseMove(event: any, boundingArea: Rectangle): Point {
    return this._actionItem.mouseMove(event, boundingArea);
  }

  mouseRelease(): void {
    this._actionItem.mouseRelease();
  }

  AssignToClass(clss: string): void { }

  get Class(): string { return ""; }

  ReleaseHandle() {
    this._activeHandles = [];
  }

  Select(point: Point): boolean {
    this._activeHandles = [];
    let handle = this._handles.filter(h => h.IsActive).find(h => h.IsPointInShape(point));
    if (handle) {

      let x = handle.Center.X;
      let y = handle.Center.Y;

      switch (handle.Side) {
        case 0: this._activeHandles = this._handles.filter(s => s.Center.Y == y && s.Center.X == x); break;
        case 1: this._activeHandles = this._handles.filter(s => s.Center.Y == y ); break;
        case 2: this._activeHandles = this._handles.filter(s => s.Center.Y == y && s.Center.X == x); break;
        case 3: this._activeHandles = this._handles.filter(s => s.Center.X == x ); break;
        case 4: this._activeHandles = this._handles.filter(s => s.Center.Y == y && s.Center.X == x); break;
        case 5: this._activeHandles = this._handles.filter(s => s.Center.Y == y ); break;
        case 6: this._activeHandles = this._handles.filter(s => s.Center.Y == y && s.Center.X == x); break;
        case 7: this._activeHandles = this._handles.filter(s => s.Center.X == x ); break;
      }
    }
    this._sideSelected = this._activeHandles.length > 0;
    return this._sideSelected;
  }

  //get SelectedSide() {
  //  return this._selectedSide;
  //}
  //Release() {
  //  this._selectedSide = -1;
  //  this.Reset(this._trackedArea);
  //  this.ResizeShape(null);
  //}

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

  Reset(shape: IShape) {
    this.ReleaseHandle();
    this._handles.forEach(h => h.DeActivate());
    this._trackedArea = shape;
    if (!shape) {
      return;
    }
    this._fos = shape.FreedomOfSizing;
    this._areaType = shape.AreaType;
    let xhalf = shape.Left + (shape.Width / 2);
    let yhalf = shape.Top + (shape.Height / 2);
    this._handles[0].CenterOn(shape.Left, shape.Top);
    this._handles[1].CenterOn(xhalf, shape.Top);
    this._handles[2].CenterOn(shape.Right, shape.Top);
    this._handles[3].CenterOn(shape.Right, yhalf);
    this._handles[4].CenterOn(shape.Right, shape.Bottom);
    this._handles[5].CenterOn(xhalf, shape.Bottom);
    this._handles[6].CenterOn(shape.Left, shape.Bottom);
    this._handles[7].CenterOn(shape.Left, yhalf);
    this._handles.forEach(h => h.Activate(this._fos, this._areaType));
  }

  get TrackedArea() {
    return this._trackedArea;
  }

  Draw(context: CanvasRenderingContext2D) {
    if (this._trackedArea) {
      this._trackedArea.Draw(context);
      this._handles.filter(h => h.IsActive).forEach(h => h.Draw(context));
    }
  }

  MoveItem(dx: number, dy: number) {
    if (!this._sideSelected) {
      this._trackedArea.MoveBy(dx, dy);
    }
    else {
      this.MoveSide(dx, dy);
    }
  }

  protected MoveSide(dx: number, dy: number) {

    this._activeHandles.forEach(h => h.MoveBy(dx, dy));
    this.ResizeShape();
  }
}

export class AreaTracker implements ITracker {

  private _trackedArea: IShape;
  private _actionItem: ActionItemsss;

  constructor() { }

  get mouseState(): IMouseState { return this._actionItem.mouseState; };
  get mousePosition(): Point { return this._actionItem.mousePosition; };

  //private Track(point: Point): boolean {
  //  let c = this.RemoveContentByPoint(point);
  //  if (!c) {
  //    return false;
  //  }
  //  this._sizer.Reset(c as IShape);
  //  //  this._sizer.Hide();

  //  return true;
  //}

  mouseCapture(event: any, boundingArea: Rectangle): Point {
    return this._actionItem.mouseCapture(event, boundingArea);
  }

  mouseMove(event: any, boundingArea: Rectangle): Point {
    return this._actionItem.mouseMove(event, boundingArea);
  }

  mouseRelease(): void {
    this._actionItem.mouseRelease();
  }

  get TrackedArea(): IShape {
    return this._trackedArea;
  }

  MoveItem(dx: number, dy: number) {
      return this._trackedArea.MoveBy(dx, dy);
  }

  Draw(context: CanvasRenderingContext2D) {
    this._trackedArea.Draw(context);
  }

  Reset(shape: IShape) {
    this._trackedArea = shape;
  }
}

export class ActionLayer extends ContextLayer {// uses separate context
  private _shapeSelected: boolean = false;
  // private designerpad = new StateIndex('designerpad');
  private _tracker: AreaTracker;
  private _layer: ContextLayer;
  constructor(parentArea: Rectangle, layerName: string) {
    super(parentArea,'edit', layerName, '', new Date());
    let bgNdx = DisplayValues.GetColorIndex('default.edit.background');
    //this.designerpad.setState(UIStates.background, bgNdx);
    //this.designerpad.setState(UIStates.foreground, bgNdx);
    //this.designerpad.setState(UIStates.color, bgNdx);
    //this.designerpad.setState(UIStates.weight, bgNdx);
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
    //this._shapeSelected = false;
    //let result = (this._layer && (this._tracker.Select(point) || this._layer.Select(point)));
    //if (result) {
    //  let c = (<Shape>this._layer.Content[0]).ChildShape;
    //  this._tracker.Reset(c || this._layer.Content[0] as Shape);
    //  this._shapeSelected = true;
    //}
    //return result;

    return false;
  }

  //private GetPath(pathName: string) {
  //  if (!this._layer) { return null; }

  //  let ppath: PortPath;
  //  for (let i = 0; i < this._layer.Lines.length; i = i + 1) {
  //    ppath = this._layer.Lines[i].Paths.find(p => p.Id == pathName);
  //    if (ppath) {
  //      break;
  //    }
  //  }
  //  return ppath;
  //}

  AddPort(id: string,
    offsetX: number,
    offsetY: number,
    type: ePortType,
    pathName: string) {
    if (!this._layer) { return; }

    let ppath = this._layer.Paths.find(p => p.Id == pathName);
    if (!ppath) { return; }
    //  let state = DisplayValues.GetPortIndex(id + "_state", "base_port_bg", "base_port_border");
    let shape = this._layer.Content[0] as Shape;

    let port = new Port(id, offsetX, offsetY, shape, type, id + "_state", pathName, ppath.Length);
    let removedPort = shape.AddPort(port);
    if (null != removedPort) {
      ppath.RemovePortPoint(removedPort.Center, port.Center);
    }
    else {
      ppath.AddPortPoint(port.Center);
    }
  }

  AddShape(shape: IShape) {
    this._layer.AddShape(shape);
  }

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

    //    if (!this.activeLayer) { return false; }

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
      (<Shape>this._layer.Content[i]).DrawContent(context);
    }
  }

  DrawLayerShape(context: CanvasRenderingContext2D, shape: Shape) {
    shape.Draw(context);
    shape.Ports.forEach(p => this.DrawLayerPortPath(context, p as Port));
  }

  DrawLayerPortPath(context: CanvasRenderingContext2D, port: Port) {
    let self = this;
    let paths = this._layer.Paths.filter(p => p.Id == port.PathId);
    paths = paths.filter(p => (<Shape>this._layer.Content[0]).Ports.findIndex(pt => (<Port>pt).PathId == p.Id) < 0);
    paths.forEach(function (p, i) {
      let lines = self._layer.Lines.filter(l => l.Id == p.LineId);
      lines.forEach(l => l.DrawLine(context, p.Ports));
    });
  }

  Draw(context: CanvasRenderingContext2D) {

    if (!this._layer) { return; }
    //  context.ClearLayer('editor');
    this._layer.Content[0].Draw(context);
    let shp = (<Shape>this._layer.Content[0]);
    if (shp) {
      shp.Ports.forEach(p => this._layer.DrawPortPath(context, p as Port));
      shp.DrawContent(context);
    }
    this._tracker.Draw(context);
    let I = this;
    this._layer.Lines.forEach(l => I.DrawPaths(context, l));

    //  let ports = (<Shape>this._layer.Content[0]).Ports;
    // this.content.forEach(s => self.DrawShape(context, s as Shape));
    //this.lines.forEach(l => self.DrawPaths(context, l));
    //  this._layer.Lines.forEach(l => l.DrawToContent(context, ports));
  }

  MoveItem(context: ContextModel, point: Point) {
    if (!this._layer) { return; }
    let c = (<Shape>this._layer.Content[0]).ChildShape
      || this._layer.Content[0] as Shape;

    if (this._tracker.MoveItem(point.X, point.Y)) {// Moving sizer handle
      ////  this._tracker.ResizeShape(context);
    }
    else {
      c.MoveBy(
        point.X,
        point.Y);
      this._tracker.Reset(c);
    }
    //    ssr.UpdatePosition();
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
    // this._cells[0].ItemRemoved(item.Id);
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
    this.layers.unshift(new ContextLayer(parentArea,id, name, updatedBy, updatedOn, displayState, content));
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
    //if (ndx < 0) {
    //  ssr.id = '';
    //  ssr.layerId = '';
    //  ssr.itemCaptured = false;

    //}
    //  else {
    //   this.layers[ndx].MoveToTop(ssr.id);
    //    this.activeLayer.SetLayer(this.layers[ndx]);
    // }
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


  AddPort(id: string,
    offsetX: number,
    offsetY: number,
    type: ePortType,
    path: string) {

    //  this.activeLayer.AddPort(id, offsetX, offsetY, type, path);
  }

  get Paths() {
    return this.SelectedLayer.Paths;
  }

  get Lines() {
    return this.SelectedLayer.Lines;
  }

  AddText(text: string, containerStateName: string, contentStateName: string, fromSource: boolean, angle: number = 0) {
    this.SelectedLayer.AddText(text, containerStateName, contentStateName, fromSource, angle);
  }

  AddImage(imageName: any, containerStateName: string, contentStateName: string, fromSource: boolean, angle = 0, imageIndex = 0) {
    this.SelectedLayer.AddImage(imageName, containerStateName, contentStateName, fromSource, angle = 0, imageIndex);
  }

  AddGeneralShape(id: string, state: string) {
    this.SelectedLayer.AddGeneralShape(id, state);
  }

  AddShape(shape: IShape) {
    this.SelectedLayer.AddShape(shape);
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

    //    if (!this.activeLayer) { return false; }
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
      //      this.activeLayer.SetLayer(this.SelectedLayer);
      return true;
    }
    else {
      //      this.activeLayer.EndEdit();
    }
    return false;
  }

  getLayers(canvasId) {
    return this.layers.filter(l => l.CanvasId == canvasId);
  }

  //ClearCells() {
  //  this._cells = [];
  //}

  //AddCell(id: string, name: string, updatedBy: string, updatedOn: Date) {
  //  this._cells.push(new UnitCell(id, name, updatedBy, updatedOn));
  //}

  // get Cells() { return this._cells; }
}
