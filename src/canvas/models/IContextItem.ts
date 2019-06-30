import { Injectable } from '@angular/core';
import { Point } from "./shapes/primitives/point";
import { Size } from "./shapes/primitives/size";
import { ShapeSelectResult, eContentType } from "./shapes/shapeSelected";
import { Shape } from "./shapes/shape";
import { forEach } from "@angular/router/src/utils/collection";
import { Line, PortPath } from './lines/line';
import { Port, ePortType } from './shapes/port';
import { Rectangle } from './shapes/rectangle';
import { StateIndex, UIStates, DisplayValues } from './DisplayValues';
import { ILine } from './lines/ILine';
import { Ellipse } from './shapes/ellipse';
import { Path } from './lines/path';


class SizerHandle extends Rectangle {
  constructor(id: string,
    private rangeOfMotion: number,
    private side: number,
    top: number,
    left: number,
    width: number,
    height: number,
    state: StateIndex) {
    super(id, top, left, width, height, state);
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
        if (handle == 1 || handle == 3 || handle == 4) {
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
  Class: string;
  AssignToClass(clss: string): void;
  Draw(context: any): void;
  Select(criteria: any): boolean;
  CopyItem(newId: string): IContextItem;
  UpdateContextState(): void;
}

export interface IContextSystem {
  Content: IContextItem[];
  AddContent(content: IContextItem);
  RemoveContent(): IContextItem;
  RemoveContentById(id: string): IContextItem;
  RemoveAllContent();
  Draw(context: any): void;
  CopyItem(itemId: string, newId: string): string;
}

export class ContextLayer implements IContextSystem {
  private layers: ContextLayer[] = [];

  constructor(
    private id: string,
    private displayState: string = '',
    protected content: IContextItem[] = [],
    protected lines: Line[] = []) {
  }

  get Id() { return this.id; }

  Draw(context: any = null) {
    let c = context;
    this.content.forEach(i => i.Draw(c));
    this.lines.forEach(l => l.DrawAllPaths(c));
    this.layers.forEach(l => l.Draw(c));
  }

  SetLinePaths() {
    let self = this;
    this.lines.forEach(function (l, i) {
      l.Paths.forEach(function (p, k) {
        self.content.forEach(c => (<Shape>c).LinePath(p));
      });
    });
  }

  DrawContent(context: any, content: IContextItem) {
    content.Draw(context);
  }

  get Content(): IContextItem[] { return this.content; }

  UpdateContextState() {
    this.content.forEach(function (c, i) {
      c.UpdateContextState();
    });
  }

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

  AddContent(content: IContextItem) {
    if (content) {
      this.content.push(content);
    }
    // this.Draw();
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

  RemoveContentById(id: string): IContextItem {
    if (this.content.length <= 0) { return null; }
    let ndx = this.content.findIndex(c => c.Id == id);
    if (ndx < 0) { return null; }
    let item = this.content[ndx];
    this.content.splice(ndx, 1);
    return item;
  };

  CopyItem(itemId: string, newId: string = ''): string {
    let ndx = this.content.findIndex(c => c.Id == itemId);
    if (ndx < 0) { return ''; }
    if (newId.length <= 0) { newId = itemId + '_' + this.content.length; }
    this.AddContent(this.content[ndx].CopyItem(newId));
    return newId;
  }
  //RemoveContentById(contentId: string): boolean {
  //  return (this.SelectContentById(contentId)) ? this.RemoveContent() : false;
  //}

  Select(ssr: ShapeSelectResult): boolean {

    let ndx = this.content.findIndex(c => c.Select(ssr));
    if (ndx < 0) { return false; }
    ssr.layerId = this.id;
    return true;
  }

  AddLine(line: Line) {
    this.lines.push(line);
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

class Sizer implements IContextItem {
  private _handles: SizerHandle[] = [];
  private _selectedSide = -1;
  constructor(designerpad: StateIndex) {
    let bgNdx = DisplayValues.GetColorIndex('default.edit.background');
    designerpad.setState(UIStates.background, bgNdx);
    designerpad.setState(UIStates.foreground, 1);
    designerpad.setState(UIStates.color, 4);
    designerpad.setState(UIStates.weight, 0);
    this._handles.push(new SizerHandle('sizerTopLeft', 0, 0, 0, 0, 9, 9, designerpad));
    this._handles.push(new SizerHandle('sizerTop', 1, 1, 0, 0, 9, 9, designerpad));
    this._handles.push(new SizerHandle('sizerTopRight', 0, 2, 0, 0, 9, 9, designerpad));
    this._handles.push(new SizerHandle('sizerRight', 2, 3, 0, 0, 9, 9, designerpad));
    this._handles.push(new SizerHandle('sizerBottomRight', 0, 4, 0, 0, 9, 9, designerpad));
    this._handles.push(new SizerHandle('sizerBottom', 1, 5, 0, 0, 9, 9, designerpad));
    this._handles.push(new SizerHandle('sizerBottomLeft', 0, 6, 0, 0, 9, 9, designerpad));
    this._handles.push(new SizerHandle('sizerLeft', 2, 7, 0, 0, 9, 9, designerpad));
  }
  AssignToClass(clss: string): void { }
  CopyItem(newId: string): IContextItem { return null; }
  UpdateContextState(): void { }

  get Id(): string { return 'sizer'; }

  get Class(): string { return ""; }

  Select(ssr: ShapeSelectResult): boolean {

    this._selectedSide = -1;
    //ssr.id = '';
    //ssr.type = '';
    let handle = this._handles.find(s => s.Select(ssr)) as SizerHandle;
    if (handle) {
      this._selectedSide = handle.Side;
      return true;
    }
    return false;
  }

  ResizeShape(shape: Shape) {
    shape.SizeBy(
      this._handles[1].Center.Y,
      this._handles[3].Center.X,
      this._handles[5].Center.Y,
      this._handles[7].Center.X);
    this.Reset(shape);

  }

  Reset(shape: Shape) {
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
  }

  Draw(context: any) {
    this._handles.forEach(h => h.Draw(context));
  }

  MoveItem(ssr: ShapeSelectResult) {
    if (this._selectedSide >= 0) {
      let dx = ssr.DX;
      let dy = ssr.DY;
      this._handles[this._selectedSide].MoveBy(dx, dy);
      for (let i = 0; i < 8; i++) {
        this._handles[i].MoveSide(dx, dy, this._handles[this._selectedSide].Side);
      }
      return true;
    }
    return false;
  }
}


export class ActionLayer extends ContextLayer {// uses separate context
  private designerpad = new StateIndex('designerpad');
  private _sizer: Sizer;
  constructor() {
    super('edit', 'default');
    let bgNdx = DisplayValues.GetColorIndex('default.edit.background');
    this.designerpad.setState(UIStates.background, bgNdx);
    this.designerpad.setState(UIStates.foreground, 1);
    this.designerpad.setState(UIStates.color, 4);
    this.designerpad.setState(UIStates.weight, 0);
    this._sizer = new Sizer(this.designerpad);
  }

  Draw(context: any = null) {
    if (this.content.length <= 0) { return; }
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    this.Content[0].Draw(context);
    this.lines.forEach(l => l.DrawToContent(context, (<Shape>this.Content[0]).Ports));
    this._sizer.Draw(context);
  }

  Select(ssr: ShapeSelectResult): boolean {
    if (this._sizer.Select(ssr)) {
      return true;
    }
    return super.Select(ssr);
  }

  //SelectItem(ssr: ShapeSelectResult) {
  //  if (this.content.length <= 0) { return false; }
  //  if (this._sizer.Select(ssr)) {
  //    return true;
  //  }
  //  if (this.content[0].Select(ssr)) {
  //    this._sizer.Reset(this.content[0] as Shape);
  //    return true;
  //  }
  //  return false;
  //}

  private GetPath(pathName: string) {
    let ppath: PortPath;
    for (let i = 0; i < this.lines.length; i = i + 1) {
      ppath = this.lines[i].Paths.find(p => p.Id == pathName);
      if (ppath) {
        break;
      }
    }
    return ppath;
  }

  AddPort(id: string,
    offsetX: number,
    offsetY: number,
    type: ePortType,
    pathName: string) {
    let state = DisplayValues.GetPortIndex(id + "_state", "base_port_bg", "base_port_border");
    let shape = this.content[0] as Shape;
    let ppath = this.GetPath(pathName);
    if (!ppath) { return; }
    let port = new Port(id, offsetX, offsetY, shape, type, state, pathName, ppath.Length);
    ppath.AddPortPoint(port.Center);
    shape.AddPort(port);
  }

  AddContent(content: IContextItem) {
    if (!content) {
      return;
    }
    this.content.length = 0;
    this.content.push(content);
    this._sizer.Reset(this.content[0] as Shape);
    //   this.Draw();
  }

  SelectedShape(): Shape {
    return this.content[0] as Shape;
  }

  MoveItem(ssr: ShapeSelectResult) {
    let c = this.content[0] as Shape;
    if (this._sizer.MoveItem(ssr)) {// Moving sizer handle
      this._sizer.ResizeShape(c);
    }
    else {
      c.MoveBy(
        ssr.DX,
        ssr.DY);
      this._sizer.Reset(c);
    }
    ssr.UpdatePosition();
    this.lines.forEach(l => l.ResetPath(c.Ports));
  }
}


// manages context layers...
export class ContextSystem implements IContextSystem {

  ssr: ShapeSelectResult;

  constructor(
    private layers: ContextLayer[] = [],
    private activeLayer: ActionLayer = null) { }

  get Id() { return this.layers[0].Id; }

  Draw(staticContext: any = null, activeContext: any = null) {
    this.layers.reverse().forEach(l => l.Draw(staticContext));
    if (this.activeLayer) {
      this.activeLayer.Draw(activeContext);
    }
  }

  get Content(): IContextItem[] { return this.layers[0].Content; }

  AddContent(content: IContextItem) { this.layers[0].AddContent(content); }

  RemoveContent(): IContextItem {
    return this.layers[0].RemoveContent();
  };

  get ActiveLayer() {
    return this.activeLayer;
  }

  RemoveAllContent() {
    return this.layers[0].RemoveAllContent();
  }

  RemoveContentById(id: string) {
    return this.layers[0].RemoveContentById(id);
  }

  CopyItem(itemId: string, newId: string = ''): string {
    return this.layers[0].CopyItem(itemId, newId);
  }

  //RedrawStatic(width: number, height: number) {
  //  this.layers[0].Clear(width, height);
  //  this.layers[0].Draw();
  //}

  //RedrawActive(width: number, height: number) {
  //  this.activeLayer.Clear(width, height);
  //  this.activeLayer.Draw();
  //}

  AddLayer(id: string, displayState: string, content: IContextItem[] = []) {
    // this.layers.unshift(new ContextLayer(this.id, displayState, content));
    //   this.Draw();
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

  Move(ssr: ShapeSelectResult) {
    if (this.activeLayer) {
      this.activeLayer.MoveItem(ssr);
    }
  }

  Select(ssr: ShapeSelectResult): boolean {
    if (this.activeLayer.Select(ssr)) {
      return true;
    }
    let ndx = this.layers.findIndex(l => l.Select(ssr));
    if (ndx < 0) {

      if (this.ReturnContent(ssr)) {
        ssr.id = '';
        ssr.layerId = '';
        ssr.itemCaptured = false;
      }
    }
    else {
      this.EditContent(ndx, ssr);
    }
  //  this.Draw();
    return ndx >= 0;
  }

  EditContent(layerIndex: number, ssr: ShapeSelectResult) {
    if (this.activeLayer) {
      this.ReturnContent(ssr);
      let layer = this.layers[layerIndex];
      let c = layer.RemoveContentById(ssr.id);
      this.activeLayer.AddContent(c);
    }
  }

  ReturnContent(ssr: ShapeSelectResult): boolean {
    if (!this.activeLayer) { return true; }
    if (!this.activeLayer.Select(ssr)) {
      let ndx = this.layers.findIndex(l => l.Id == ssr.layerId);
      if (ndx >= 0) {
        let c = this.activeLayer.RemoveContent();
        this.layers[ndx].AddContent(c);
      }
      return true;
    }
    return false;
  }

  LayerByName(layerId: string) {
    if (this.layers.length <= 0) {
      return null;
    }
    let lyr = this.layers.find(l => l.Id == layerId);
    if (!lyr) {
      lyr = this.layers[0];
    }
    return lyr;
  }


  AddPort(id: string,
    offsetX: number,
    offsetY: number,
    type: ePortType,
    path: string) {

    this.activeLayer.AddPort(id,offsetX,offsetY,type,path);
  }

  AddLine(line: Line) {
    this.layers[0].AddLine(line);
  }


  AddNewContent(
    ssr: ShapeSelectResult,
    shapeName: string = '') {

    if (!this.activeLayer) { return false; }
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
        shp = new Rectangle(shapeName, ssr.point.Y, ssr.point.X, 30, 30, ssr.DesignState);
        break;
      case eContentType.ellipse:
        shp = new Ellipse(shapeName, ssr.point.Y, ssr.point.X, 30, 30, ssr.DesignState);
        break;
    }
    if (shp) {
      let shape = this.activeLayer.RemoveContent();
      this.layers[0].AddContent(shape);
      this.activeLayer.AddContent(shp);
      return true;
    }
    return false;
  }
}

//@Injectable()
//export class ContextService {
//  ssr: ShapeSelectResult;

//  // shapes;
//  // ports;
//  // lines;
//  constructor(private contextSystem: ContextSystem) { }

//  Select() {
//    this.contextSystem.Select(this.ssr);
//    this.Draw();
//  }

//  Move(): boolean {
//    if (!this.contextSystem.Move(this.ssr)) { return false; }
//    this.contextSystem.DrawActive();
//    return true;
//  }

//  Draw() {
//    this.contextSystem.DrawStatic();
//    this.contextSystem.DrawActive();
//  }



