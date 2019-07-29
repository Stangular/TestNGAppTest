import { Injectable} from '@angular/core';
import { Point } from "./shapes/primitives/point";
import { Size } from "./shapes/primitives/size";
import { ShapeSelectResult, eContentType } from "./shapes/shapeSelected";
import { Shape, FreedomOfMotion, AreaType } from "./shapes/shape";
import { forEach } from "@angular/router/src/utils/collection";
import { Line, PortPath } from './lines/line';
import { Port, ePortType } from './shapes/port';
import { Rectangle } from './shapes/rectangle';
import { StateIndex, UIStates, DisplayValues } from './DisplayValues';
import { ILine } from './lines/ILine';
import { Ellipse } from './shapes/ellipse';
import { Path } from './lines/path';
import { LineService } from './lines/service/line.service';


class SizerHandle extends Rectangle {
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

  DrawHandle(context: any, fos: FreedomOfMotion, areaType: AreaType) {
    switch (areaType) {
      case AreaType.constantArea:
      case AreaType.lockedRatio:
        if (this.side == 1 || this.side == 3 || this.side == 5 || this.side == 7) {
          this.Draw(context);
        }
      break;
      default: {
        switch (fos) {
          case FreedomOfMotion.vertical:
            if (this.side == 1 || this.side == 5) {
              this.Draw(context);
            }
            break;
          case FreedomOfMotion.horizontal:
            if (this.side == 3 || this.side == 7) {
              this.Draw(context);
            }
            break;
          default: this.Draw(context); break;
        }
      }
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
  Draw(context: any): void;
  Select(criteria: any): boolean;
  CopyItem(newId: string): IContextItem;

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
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
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

  AddContent(content: IContextItem) {
    if (content) {
      this.content.unshift(content);
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

  RemoveContentById(id: string): IContextItem {
    if (this.content.length <= 0) { return null; }
    let ndx = this.content.findIndex(c => c.Id == id);
    if (ndx < 0) { return null; }
    let item = this.content[ndx];
    this.content.splice(ndx, 1);
    return item;
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

  Select(ssr: ShapeSelectResult): boolean {

    let ndx = this.content.findIndex(c => c.Select(ssr));
    if (!this.MakeTop(ndx)) { return false; }
    ssr.layerId = this.id;
    return true;
  }

  AddLine(line: Line) {
    let L = this.lines.find(l => l.Id == line.Id);
    if (!L) {
      this.lines.push(line);
    }
    else {
      L.Update(line);
    }
  }

  RemoveLine(lineName: string) {
    let ndx = this.lines.findIndex(l => l.Id == lineName);
    if (ndx >= 0) {
      this.lines.splice(ndx, 1);
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

class Sizer implements IContextItem {
  private _handles: SizerHandle[] = [];
  private _selectedSide = -1;
  private fos: FreedomOfMotion = FreedomOfMotion.full;
  private areaType: AreaType = AreaType.normal;

  constructor(designerpad: StateIndex) {
  //  let bgNdx = DisplayValues.GetColorIndex('default.edit.background');
    //designerpad.setState(UIStates.background, bgNdx);
    //designerpad.setState(UIStates.foreground, 1);
    //designerpad.setState(UIStates.color, 4);
    //designerpad.setState(UIStates.weight, 0);
    this._handles.push(new SizerHandle('sizerTopLeft', 0, 0, 0, 0, 9, 9, 'default.edit.background'));
    this._handles.push(new SizerHandle('sizerTop', 1, 1, 0, 0, 9, 9, 'default.edit.background'));
    this._handles.push(new SizerHandle('sizerTopRight', 0, 2, 0, 0, 9, 9, 'default.edit.background'));
    this._handles.push(new SizerHandle('sizerRight', 2, 3, 0, 0, 9, 9, 'default.edit.background'));
    this._handles.push(new SizerHandle('sizerBottomRight', 0, 4, 0, 0, 9, 9, 'default.edit.background'));
    this._handles.push(new SizerHandle('sizerBottom', 1, 5, 0, 0, 9, 9, 'default.edit.background'));
    this._handles.push(new SizerHandle('sizerBottomLeft', 0, 6, 0, 0, 9, 9, 'default.edit.background'));
    this._handles.push(new SizerHandle('sizerLeft', 2, 7, 0, 0, 9, 9, 'default.edit.background'));
  }
  AssignToClass(clss: string): void { }
  CopyItem(newId: string): IContextItem { return null; }
//  UpdateContextState(): void { }

  get Id(): string { return 'sizer'; }

  get Class(): string { return ""; }

  Select(ssr: ShapeSelectResult): boolean {

    this._selectedSide = -1;
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
    this.fos = shape.FreedomOfSizing;
    this.areaType = shape.AreaType;
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
    this._handles.forEach(h => h.DrawHandle(context, this.fos, this.areaType));
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
  private _layer: ContextLayer;
  constructor() {
    super('edit', 'default');
    let bgNdx = DisplayValues.GetColorIndex('default.edit.background');
    this.designerpad.setState(UIStates.background, bgNdx);
    this.designerpad.setState(UIStates.foreground, 1);
    this.designerpad.setState(UIStates.color, 4);
    this.designerpad.setState(UIStates.weight, 0);
    this._sizer = new Sizer(this.designerpad);
  }

  get Editing() {
    return this._layer != null;
  }

  EndEdit() {
    if (!this._layer) { return; }
    this._sizer.Reset(this._layer.Content[0] as Shape);
    this._layer = null;
  }

  SetLayer(lyr: ContextLayer) {
    if (lyr) {
      this._layer = lyr;
      this._sizer.Reset(this._layer.Content[0] as Shape);
    }
  }

  Draw(context: any = null) {
    if (!this._layer) { return; }
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    this._layer.Content[0].Draw(context);
    this._sizer.Draw(context);
    let ports = (<Shape>this._layer.Content[0]).Ports;
    this._layer.Lines.forEach(l => l.DrawToContent(context,ports));
  }

  Select(ssr: ShapeSelectResult): boolean {

    let result = (this._layer && (this._sizer.Select(ssr) || this._layer.Select(ssr)));
    if (result) {
      this._sizer.Reset(this._layer.Content[0] as Shape);
    }
    return result;
  }

  private GetPath(pathName: string) {
    if (!this._layer) { return null; }

    let ppath: PortPath;
    for (let i = 0; i < this._layer.Lines.length; i = i + 1) {
      ppath = this._layer.Lines[i].Paths.find(p => p.Id == pathName);
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
    if (!this._layer) { return; }

    let ppath = this.GetPath(pathName);
    if (!ppath) { return; }
  //  let state = DisplayValues.GetPortIndex(id + "_state", "base_port_bg", "base_port_border");
    let shape = this._layer.Content[0] as Shape;
    let port = new Port(id, offsetX, offsetY, shape, type, id + "_state", pathName, ppath.Length);
    ppath.AddPortPoint(port.Center);
    shape.AddPort(port);
  }

  AddContent(content: IContextItem) {
    if (!this._layer) { return; }

    this._sizer.Reset(this._layer.Content[0] as Shape);
  }

  SelectedShape(): Shape {
    if (!this._layer) { return; }
    return this._layer.Content[0] as Shape;
  }

  MoveItem(ssr: ShapeSelectResult) {
    if (!this._layer) { return; }
    let c = this._layer.Content[0] as Shape;
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
    this._layer.Lines.forEach(l => l.ResetPath(c.Ports));
  }
}

export class UnitCell {
  constructor(
    private Id: string,
    private name: string,
    private updatedBy: string,
    private updatedOn: Date) {

  }

  get ID() { return this.Id; }
  get Name() { return this.name }
  get UpdatedBy() { return this.updatedBy; }
  get UpdatedOn() { return this.updatedOn; }
}
// manages context layers...
export class ContextSystem implements IContextSystem {

  private _cells: UnitCell[] = [];
  ssr: ShapeSelectResult;
  _staticContext: any = null;
  _activeContext: any = null;

  constructor(
    private layers: ContextLayer[] = [],
    private activeLayer: ActionLayer = null) { }

  get Id() { return this.layers[0].Id; }

  Draw(staticContext: any = null, activeContext: any = null) {
    if (staticContext == null) { staticContext = this._staticContext; }
    if (activeContext == null) { activeContext = this._activeContext; }
    this.layers.reverse().forEach(l => l.Draw(staticContext));
    if (this.activeLayer) {
      this.activeLayer.Draw(activeContext);
    }
    this._staticContext = staticContext;
    this._activeContext = activeContext;
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
      this.activeLayer.EndEdit();
      ssr.id = '';
      ssr.layerId = '';
      ssr.itemCaptured = false;
    }
    else {
      this.layers[ndx].MoveToTop(ssr.id);
      this.activeLayer.SetLayer(this.layers[ndx]);
    }
    return ndx >= 0;
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

    this.activeLayer.AddPort(id, offsetX, offsetY, type, path);
  }

  get Lines() {
    return this.layers[0].Lines;
  }

  AddLine(line: Line) {
    this.layers[0].AddLine(line);
  }

  RemoveLine(lineName: string) {
    this.layers[0].RemoveLine(lineName);
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
        shp = new Rectangle(shapeName, ssr.point.Y, ssr.point.X, 30, 30, ssr.stateName);
        break;
      case eContentType.ellipse:
        shp = new Ellipse(shapeName, ssr.point.Y, ssr.point.X, 30, 30, ssr.stateName);
        break;
    }
    if (shp) {
      this.layers[0].AddContent(shp);
      this.activeLayer.SetLayer(this.layers[0]);
      return true;
    }
    else {
      this.activeLayer.EndEdit();
    }
    return false;
  }

  get Cells() { return this._cells; }
}
