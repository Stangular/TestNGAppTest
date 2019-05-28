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
  bezier = 2
}

export enum orthogonalTypes {
  VtoV = 0,
  HtoH = 1,
  VtoH = 2,
  HtoV = 3
}

export interface IPortPath {
  Id: string
}
export class PortPath implements IPortPath {

  constructor(protected id: string, protected ports: number[] = []) { }

  get Id(): string {
    return this.id;
  }

  AddPort(portIndex: number) {
    this.ports.push(portIndex);
  }

  DrawLine(context: any, ports: Port[]) {
    if (this.ports.length <= 1) { return; }
    ports[this.ports[0]].DrawSource(context);
    for (let j = 1; j < this.ports.length; j++) {
      ports[this.ports[j]].DrawTarget(context);
    }
  }
}

export class OrthogonalPortPath implements IPortPath {

  interimports: Point[] = [];

  constructor(private id: string,
    private ports: number[] = [],
    private type: orthogonalTypes) {

    switch (this.type) {

      case orthogonalTypes.VtoV:
        this.interimports.push(new Point());
        this.interimports.push(new Point());
        break;
      case orthogonalTypes.VtoH:
        this.interimports.push(new Point());
        break;
      case orthogonalTypes.HtoV:
        this.interimports.push(new Point());
        break;
      case orthogonalTypes.HtoH:
        this.interimports.push(new Point());
        this.interimports.push(new Point());
        break;

    }
  }

  get Id(): string {
    return this.id;
  }

  SetInterimPorts(ports: Port[]): boolean {

    if (ports.length < 1 || ports.length > 2) {
      return false;
    }
    let p1 = ports[this.ports[0]].Center;
    let p2 = ports[this.ports[1]].Center;

    switch (this.type) {

      case orthogonalTypes.VtoV: this.VerticalToVertical(p1, p2); break;
      case orthogonalTypes.VtoH: this.VerticalToHorizontal(p1, p2); break;
      case orthogonalTypes.HtoV: this.HorizontalToVertical(p1, p2); break;
      case orthogonalTypes.HtoH: this.HorizontalToHorizontal(p1, p2); break;
    }

    return true;
  }

  VerticalToVertical(point1: Point, point2: Point) {
    let x = 0;
    if (point2.X > point1.X) {
      x = point1.X + ((point2.X - point1.X) / 2);
    }
    else {
      x = point2.X + ((point1.X - point2.X) / 2);
    }
    this.interimports[0].SetToPosition(x, point1.Y);
    this.interimports[1].SetToPosition(x, point2.Y)
  }

  HorizontalToHorizontal(point1: Point, point2: Point) {
    let y = 0;
    if (point2.Y > point1.Y) {
      y = point1.Y + ((point2.Y - point1.Y) / 2);
    }
    else {
      y = point2.Y + ((point1.Y - point2.Y) / 2);
    }
    this.interimports[0].SetToPosition(point1.X, y);
    this.interimports[1].SetToPosition(point2.X, y);
  }

  HorizontalToVertical(point1: Point, point2: Point) {
    (point2.Y > point1.Y)
      ? this.interimports[0].SetToPosition(point1.X, point2.Y)
      : this.interimports[0].SetToPosition(point2.X, point1.Y);
  }

  VerticalToHorizontal(point1: Point, point2: Point) {
    (point2.X > point1.X)
      ? this.interimports[0].SetToPosition(point2.X, point1.Y)
      : this.interimports[0].SetToPosition(point1.X, point2.Y);
  }


  DrawLine(context: any, ports: Port[]) {
    if (this.ports.length <= 1) { return; }
    ports[this.ports[0]].DrawSource(context);
    for (let j = 1; j < this.ports.length; j++) {
      ports[this.ports[j]].DrawTarget(context);
    }
  }
}

export class Line implements IContextItem, ILine {

  _class: string = '';
  _paths: PortPath[] = [];

  constructor(private id: string,
    protected state: StateIndex) {
  }

  get Id() { return this.id; }

  get Class(): string {
    return this._class;
  }

  AssignPath(path: PortPath) {
    this._paths.push(path);
  }

  AddPortToLine(pathName: string, portIndex: number) {
    let path = this._paths.find(p => p.Id == pathName);
    if (!path) {
      path = new PortPath(pathName);
    }
    path.AddPort(portIndex);
  }

  get Paths() {
    return this._paths;
  }

  AssignToClass(clss: string): void {
    this._class = clss;
  }

  UpdateContextState() { }

  public DrawLine(context: any, ports: Port[]) {
    let self = this;
    this._paths.forEach(function (p, i) {
      p.DrawLine(context, ports);
      self.Draw(context);
    });
  }

  CopyItem(newId: string) {
    return null;
  }

  Select(shapeSelectResult: ShapeSelectResult): boolean {
    return false;
  }

  Draw(context: any): void {

    context.beginPath();
    context.strokeStyle = this.state.color;
    context.linewidth = this.state.weight;
    context.stroke();
    context.closePath();

  }

  SelectShape(shapeSelectResult: ShapeSelectResult) {
    return false;
    // this.IsPointInShape(point);
  }
}


