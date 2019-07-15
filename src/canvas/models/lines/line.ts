//import { IShape } from '../shapes/Ishape';
//import { Shape } from '../shapes/shape';
import { Port } from '../shapes/port';
import { Point } from '../shapes/primitives/point';
import { IContextItem, ContextSystem } from '../IContextItem';
import { ILine } from './Iline'
import { DisplayValues, StateIndex, UIStates } from '../DisplayValues'
import { ShapeSelectResult } from '../shapes/shapeSelected';

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

  constructor(protected id: string, protected ports: Point[] = [], offsetX: number = 0, offsetY: number = 0) { }

  get Id(): string {
    return this.id;
  }

  get Length(): number {
    return this.ports.length;
  }

  AddPortPoint(pt: Point): number {
    this.ports.push(pt);
    return this.ports.length - 1;
  }

  Clear() {
    this.ports = [];
  }

  SetInterimPorts(type: lineTypes) {

    let dx = this.ports[1].X - this.ports[0].X
    let dy = this.ports[1].Y - this.ports[0].Y;
    let p = 0;
    switch (type) {

      case lineTypes.bezier:
        p = dx / 4;
        this.ports.push(new Point());
        this.ports.push(new Point());
        this.ports[3].SetToPosition(this.ports[1].X, this.ports[1].Y);
        if (dx > 0) {
          this.ports[1].SetToPosition(this.ports[0].X + p, this.ports[0].Y - 10);
          this.ports[2].SetToPosition(this.ports[0].X + ( p * 3 ), this.ports[3].Y + 10);
        }
        else {
          this.ports[1].SetToPosition(this.ports[3].X + p, this.ports[3].Y - 10);
          this.ports[2].SetToPosition(this.ports[3].X + (p * 3), this.ports[0].Y + 10);
        }
        break;
      case lineTypes.gradient:
        p = dx / 2;
        this.ports.push(new Point());
        this.ports[1].SetToPosition(this.ports[0].X + p, this.ports[0].Y - 10);
        this.ports[2].SetToPosition(this.ports[1].X, this.ports[1].Y);
       break;
      case lineTypes.VtoV:
        this.ports.push(new Point());
        this.ports.push(new Point());
        let x = this.ports[0].X;
        this.ports[3].SetToPosition(this.ports[1].X, this.ports[1].Y);
        if (this.ports[1].X > this.ports[0].X) {
          x = this.ports[0].X + ((this.ports[1].X - this.ports[0].X) / 2);
        }
        else {
          x = this.ports[1].X + ((this.ports[0].X - this.ports[1].X) / 2);
        }
        this.ports[1].SetToPosition(x, this.ports[0].Y);
        this.ports[2].SetToPosition(x, this.ports[1].Y);
        break;
      case lineTypes.VtoH:
        this.ports.push(new Point());
        this.ports[2].SetToPosition(this.ports[1].X, this.ports[1].Y);
        this.ports[1].SetToPosition(this.ports[1].X, this.ports[0].Y);
        break;
      case lineTypes.HtoV:
        this.ports.push(new Point());
        this.ports[2].SetToPosition(this.ports[1].X, this.ports[1].Y);
        this.ports[1].SetToPosition(this.ports[0].X, this.ports[2].Y);
        break;
      case lineTypes.HtoH:
        this.ports.push(new Point());
        this.ports.push(new Point());
        let y = this.ports[0].Y;
        this.ports[3].SetToPosition(this.ports[1].X, this.ports[1].Y);
        if (this.ports[1].Y > this.ports[0].Y) {
          y = this.ports[0].Y + ((this.ports[1].Y- this.ports[0].Y) / 2);
        }
        else {
          y = this.ports[1].Y + ((this.ports[0].Y - this.ports[1].Y) / 2);
        }
        this.ports[1].SetToPosition(this.ports[0].X,y);
        this.ports[2].SetToPosition(this.ports[1].X,y);
        break;

    }
  }

  DrawLine(context: any) {
    if (this.ports.length < 2) { return; }
    context.moveTo(this.ports[0].X, this.ports[0].Y);
    for (let j = 1; j < this.ports.length; j = j + 1) {
      context.lineTo(this.ports[j].X, this.ports[j].Y);
    }
  }

  DrawBezierPath(context: any) {
    if (this.ports.length < 2) { return; }
    context.moveTo(this.ports[0].X, this.ports[0].Y);
    for (let j = 1; j < this.ports.length; j = j + 3) {
      context.bezierCurveTo(
        this.ports[j].X, this.ports[j].Y,
        this.ports[j + 1].X, this.ports[j + 1].Y,
        this.ports[j + 2].X, this.ports[j + 2].Y);
    }
  }

  DrawGradientPath(context: any) {
    if (this.ports.length < 2) { return; }
    context.moveTo(this.ports[0].X, this.ports[0].Y);
    for (let j = 1; j < this.ports.length; j = j + 2) {
      context.quadraticCurveTo(
        this.ports[j].X, this.ports[j].Y,
        this.ports[j + 1].X, this.ports[j + 1].Y);
    }
  }

  ResetToPort(port: Port) {
    this.ports[port.PathPosition] = port.Center;
  }
}

export class Line implements ILine {

  _class: string = '';
  _paths: PortPath[] = [];
  _state: StateIndex;
  constructor(private id: string,
    protected state: string,
    paths: PortPath[] = [],
    private type: lineTypes = lineTypes.straight ) {
    this._paths = paths.concat([]);
    this._state = DisplayValues.GetLineIndex(this.Id + "_state", state)
    paths.forEach(function (p, i) { p.SetInterimPorts(this.type); });
  }

  Update(line: Line) {
    this._paths = line.Paths;
    this._state = DisplayValues.GetLineIndex(this.Id + "_state", line.StateName);
    this.state = line.StateName;
    this.type = line.Type;
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

  get Class(): string {
    return this._class;
  }

  AddPath(pathName: string, points: Point[] = []) {
    let path = new PortPath(pathName, points);
    this._paths.push(path);
  }

  AssignPathPoint(pathName: string, position: Point) {
    let path = this._paths.find(p => p.Id == pathName);
    if (!path) {
      path = new PortPath(pathName);
      this._paths.push(path);
    }
    return path.AddPortPoint(position);
  }

  PathLength(pathName: string) {
    let path = this._paths.find(p => p.Id == pathName);
    if (!path) { return 0; }
    return path.Length;
  }

  get Paths() {
    return this._paths;
  }

  AssignToClass(clss: string): void {
    this._class = clss;
  }

  UpdateContextState() { }

  public DrawPortPath(context: any, path: PortPath) {
    if (!path) { return; }
    context.beginPath();
    path.DrawLine(context);
    this.Draw(context);
    context.closePath();
  }

  Draw(context: any): void {

    context.strokeStyle = 'black'; //this.state.color;
    context.lineWidth = 2; //this.state.weight;
    context.stroke();

  }

  public DrawPath(context: any, pathId: string) {
    let p = this._paths.find(p => p.Id == pathId);
    this.DrawPortPath(context, p);
  }

  public DrawAllPaths(context: any) {
    let self = this;
    this._paths.forEach(function (p, i) {
      self.DrawPortPath(context, p);
    });
  }

  public DrawToContent(context: any, ports: Port[]) {
    let self = this;
    ports.forEach(function (p, i) {
      self.DrawPath(context, p.PathId);
    });
  }

  ResetPath(ports: Port[]) {
    let self = this;
    ports.forEach(function (p, i) {
      let path = self.Paths.find(pp => pp.Id == p.PathId);
      if (path) {
        path.ResetToPort(p);
        path.SetInterimPorts(this.type);
      }
    });

  }

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


