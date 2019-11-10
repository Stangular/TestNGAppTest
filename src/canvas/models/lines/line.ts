//import { IShape } from '../shapes/Ishape';
//import { Shape } from '../shapes/shape';
import { Port } from '../shapes/port';
import { Point } from '../shapes/primitives/point';
import { IContextItem, ContextSystem } from '../IContextItem';
import { ILine } from './Iline'
import { DisplayValues, StateIndex, UIStates } from '../DisplayValues'
import { ShapeSelectResult } from '../shapes/shapeSelected';
import { ContextModel } from 'src/canvas/component/context.model';

export enum lineTypes {
  straight = 0,
  gradient = 1,
  bezier = 2,
  VtoV = 10,
  HtoH = 11,
  VtoH = 12,
  HtoV = 13
}

export interface IPortPath {
  Id: string
}
export class PortPath implements IPortPath {

  constructor(
    protected id: string,
    protected lineId: string,
    protected ports: Point[] = [],
    offsetX: number = 0,
    offsetY: number = 0) { }

  get Id(): string {
    return this.id;
  }

  get Length(): number {
    return this.ports.length;
  }

  get LineId() {
    return this.lineId;
  }

  RemovePortPoint(oldpt: Point,newPoint: Point = null) {
    let i = this.ports.findIndex(p => p.X == oldpt.X && p.Y == oldpt.Y);
    if (i >= 0) {
      if (newPoint) {
        this.ports.splice(i, 1, newPoint);
      }
      else {
        this.ports.splice(i, 1);
      }
      return true;
    }
    return false;
  }

  AddPortPoint(pt: Point,position:number = 0): number {
    //switch (type) {
    //}
    this.ports.splice(position,0,pt);
    return this.ports.length - 1;
  }

  Clear() {
    this.ports = [];
  }

  Update(lineId: string, type: lineTypes) {
    this.lineId = lineId;

  }

  SetInterimPorts(type: lineTypes) {

    if (this.ports.length < 2) { return; }
    let dx = this.ports[1].X - this.ports[0].X;
    let dy = this.ports[1].Y - this.ports[0].Y;
    let p = 0;
    switch (type) {

      case lineTypes.bezier:
        //p = dx / 4;
        //if (this.ports.length < 4) {
        //  this.ports.push(new Point());
        //  this.ports.push(new Point());
        //}
        //if (dx > 0) {
        //  this.ports[2].SetToPosition(this.ports[0].X + p, this.ports[0].Y - 10);
        //  this.ports[3].SetToPosition(this.ports[0].X + (p * 3), this.ports[3].Y + 10);
        //}
        //else {
        //  this.ports[2].SetToPosition(this.ports[3].X + p, this.ports[3].Y - 10);
        //  this.ports[3].SetToPosition(this.ports[3].X + (p * 3), this.ports[0].Y + 10);
        //}
        break;
      case lineTypes.gradient:
        //p = dx / 2;
        //if (this.ports.length < 3) {
        //  this.ports.push(new Point());
        //}
        //this.ports[2].SetToPosition(this.ports[0].X + p, this.ports[0].Y - 10);
        break;
      case lineTypes.VtoV:
        if (this.ports.length < 4) {
          this.ports.push(new Point());
          this.ports.push(new Point());
        }
        p = this.ports[0].Y + ((this.ports[1].Y - this.ports[0].Y) / 2);
        this.ports[2].SetToPosition(this.ports[1].X,p);
        this.ports[3].SetToPosition(this.ports[0].X,p);
        break;
      case lineTypes.VtoH:
        if (this.ports.length < 3) {
          this.ports.push(new Point());
        }
        this.ports[2].SetToPosition(this.ports[1].X, this.ports[0].Y);
        break;
      case lineTypes.HtoH:
        if (this.ports.length < 4) {
          this.ports.push(new Point());
          this.ports.push(new Point());
        }
        p = this.ports[0].X + ((this.ports[1].X - this.ports[0].X) / 2);
        this.ports[2].SetToPosition(p,this.ports[1].Y);
        this.ports[3].SetToPosition(p,this.ports[0].Y);
        break;
      case lineTypes.HtoV:
        if (this.ports.length < 3) {
          this.ports.push(new Point());
        }
        this.ports[2].SetToPosition(this.ports[0].X, this.ports[1].Y);
        break;

    }
  }

  get Ports() { return this.ports; }

  //DrawLine(context: ContextModel) {
  //  if (this.ports.length < 2) { return; }
  //  context.moveTo(this.ports[0].X, this.ports[0].Y);
  //  for (let j = this.ports.length - 1; j > 0; j = j - 1) {
  //    context.lineTo(this.ports[j].X, this.ports[j].Y);
  //  }
  //}

  //DrawBezierPath(context: ContextModel) {
  //  if (this.ports.length < 4) { return; }
  //  context.moveTo(this.ports[0].X, this.ports[0].Y);
  //  for (let j = 1; j < this.ports.length; j = j + 3) {
  //    context.bezierCurveTo(
  //      this.ports[j + 1].X, this.ports[j + 1].Y,
  //      this.ports[j + 2].X, this.ports[j + 2].Y,
  //      this.ports[j].X, this.ports[j].Y);
  //  }
  //}

  //DrawGradientPath(context: ContextModel) {
  //  if (this.ports.length < 3) { return; }
  //  try {
  //    context.moveTo(this.ports[0].X, this.ports[0].Y);
  //    for (let j = 1; j < this.ports.length - 1; j = j + 2) {
  //      context.quadraticCurveTo(
  //        this.ports[j + 1].X, this.ports[j + 1].Y,
  //        this.ports[j].X, this.ports[j].Y);
  //    }
  //  }
  //  catch (ex) {
  //    let sss = ex;
  //  }
 
  //}

  ResetToPort(port: Port) {
    
    this.ports[port.PathPosition] = port.Center;
  }
}

export class Line implements ILine {

  // _paths: PortPath[] = [];
  _state: StateIndex;
  constructor(private id: string,
    protected state: string,
    private type: lineTypes = lineTypes.straight) {
    //   let t = this.type;
    //   this._paths = paths.concat([]);
    this._state = DisplayValues.GetLineIndex(this.StateName, state);
    // paths.forEach(function (p, i) { p.SetInterimPorts(t); });
  }

  Update(stateName: string, type: lineTypes) {
    this._state = DisplayValues.GetLineIndex(this.Id + "_state", stateName);
    this.state = stateName;
    this.type = type;
  }

  Save(): any {
    let model = {
      LineId: this.id,
      DisplayValueId: this.state,
      LineType: this.type,
      OffsetX1: 0,
      OffsetY1: 0,
      OffsetX2: 0,
      OffsetY2: 0
    }
    return model;
  }


  get Type() {
    return this.type;
  }

  get State() {
    return this._state;
  }

  get StateName() {
    return this.state;
  }

  get Id() { return this.id; }


  UpdateContextState() { }

  //public DrawPortPath(context: ContextModel, path: PortPath) {
  //  if (!path) { return; }
  //  context.beginPath();
  //  switch (this.type) {
  //    case lineTypes.gradient: context.DrawGradientPath(path.Ports); break;
  //    case lineTypes.bezier: context.DrawBezierPath(path.Ports); break;
  //    default: context.DrawStraightLine(path.Ports); break;
  //  }
  //  this.Draw(context);
  //  context.closePath();
  //}

  Draw(context: ContextModel,path: Point [] = []): void {
    context.DrawLine(this, path);
  }

  //public DrawPath(context: any, pathId: string) {
  //  let p = this._paths.find(p => p.Id == pathId);
  //  this.DrawPortPath(context, p);
  //}

  //public DrawAllPaths(context: any) {
  //  let self = this;
  //  this._paths.forEach(function (p, i) {
  //    self.DrawPortPath(context, p);
  //  });
  //}

  //public DrawToContent(context: any, ports: Port[]) {
  //  let self = this;
  //  ports.forEach(function (p, i) {
  //    self.DrawPath(context, p.PathId);
  //  });
  //}

  //ResetPath(ports: Port[]) {
  //  let self = this;
  //  ports.forEach(function (p, i) {
  //    let path = self.Paths.find(pp => pp.Id == p.PathId);
  //    if (path) {
  //      path.ResetToPort(p);
  //      path.SetInterimPorts(this.type);
  //    }
  //  });

  //}

  CopyItem(newId: string) {
    return null;
  }

  Select(shapeSelectResult: ShapeSelectResult): boolean {
    return false;
  }



  SelectShape(shapeSelectResult: ShapeSelectResult) {
    return false;
    // this.IsPointInShape(point);
  }
}


