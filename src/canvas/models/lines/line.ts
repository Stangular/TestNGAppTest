//import { IShape } from '../shapes/Ishape';
//import { Shape } from '../shapes/shape';
import { Port } from '../shapes/port';
import { Point } from '../shapes/primitives/point';
import { IContextItem, ContextSystem } from '../IContextItem';
import { ILine } from './ILine'
import { DisplayValues, StateIndex, UIStates } from '../DisplayValues'
import { ShapeSelectResult } from '../shapes/shapeSelected';
import { ContextModel } from 'src/canvas/component/context.model';
import { IShape } from '../shapes/IShape';
import { PathShape } from '../shapes/shape';

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

export class PathLink  {

  sourcePosition: Point = new Point(0,0);
  targetPosition: Point = new Point(0,0);

  constructor(protected Id: string,
    protected source: string,
    protected target: string) { }

  isSource(port: IShape): boolean {
    if (port.Id == this.source) {
      this.sourcePosition = port.Center;
      return true;
    }
    return false;
  }

  isTarget(port: IShape): boolean {
    if (port.Id == this.target) {
      this.targetPosition = port.Center;
      return true;
    }
    return false;
  }
}


export class YDNAPath {

}

export class PortPath implements IPortPath {

  protected ports: PathLink[] = [];
  constructor(
    protected id: string,
    protected lineId: string = "") { }

  get Id(): string {
    return this.id;
  }

  get Length(): number {
    return this.ports.length;
  }


  AddPorts(ports: PathLink ) {
    this.ports.push(ports);
  //  this.ports = this.ports.sort((a, b) => a.Position - b.Position);
  }

  DrawAreaPorts(context: any): void {
    this.ports.forEach(function (pp, i) {
     // pp.forEach(p => p.Draw(context));
    });
  }                                     

  MovePathPorts(shapeID: string, dx: number, dy: number) {
 
    this.Ports.forEach(function (p, i) {
     // let ports = p.filter(pp => pp.ParentShapeID == shapeID);
      //if (ports.length > 0) {
      //  let sss = 0;
      //}
      //ports.forEach(pp => pp.MoveBy(dx, dy));
      
    });
  }

  DrawActiveShapeLinks(ctx: CanvasRenderingContext2D, pathShape: PathShape, line: Line) {
 //   pathShape.FindPorts(this.Ports);
    line.DrawPathLinks(ctx, this.Ports);
  }

  DrawPathLinks(ctx: CanvasRenderingContext2D, contents: IShape[], line: Line) {

    contents.forEach(s => (<PathShape>s).FindPorts(this.Ports));
    line.DrawPathLinks(ctx, this.Ports);

  }

  DrawActiveLinks(ctx: CanvasRenderingContext2D, shape: PathShape, line: Line) {

    if (shape) {
      shape.FindPorts(this.Ports);
      line.DrawPathLinks(ctx, this.Ports);
    }
  }

  DrawShapePath(context: any, shapeID: string, line: ILine) {
    this.Ports.forEach(function (p, i) {
      //let linePorts = (<Port[]>p).filter(pp => pp.LineId == line.Id && pp.ParentShapeId == shapeID);
      //if (linePorts.length > 0) {
      //  line.DrawLine(context, linePorts.map(p => p.Center));
      //}
    });
  }

  DrawPath(context: any, line: ILine) {
    this.ports.forEach(function (p, i) {
  //    let linePorts = (<Port[]>p).filter(pp => pp.LineId == line.Id);
   //   line.DrawLine(context,linePorts.map(p => p.Center));
    });
  }
  
  RemovePortPoint(oldpt: Point) {
    //let i = this.ports.findIndex(p => p.Center.X == oldpt.X && p.Center.Y == oldpt.Y);
    //if (i >= 0) {
    //  this.ports.splice(i, 1);
    //  return true;
    //}
    return false;
  }

  ReturnActivePath(path: PathLink[]) {
    this.ports = this.ports.concat(path);
  }

  ExtractActivePath(pathports: IShape[]): PathLink[] {
    let path : PathLink[] = [];
    let self = this;
    let pathi: number[] = [];
    pathports.forEach(function (p, i) {
      let r = self.ports.findIndex(l => l.isSource(p) || l.isTarget(p));
      if (r >= 0) {
        pathi.push(r);
      }
    });
    pathi.forEach(function (p, i) {
      let port = self.ports.splice(p, 1).pop();
      path.push(port);
    });
    return path;
  }

  //FindPorts(shape : ) {

  //  this.ports.forEach(function (p, i) {
  //    pathLinks.some(l => l.isSource(p) || l.isTarget(p));
  //  });

  //}
  //AddPortPoint(pt: Point, position: number = 0): number {
  //  //switch (type) {
  //  //}
  //  this.ports.splice(position, 0, pt);
  //  return this.ports.length - 1;
  //}

  Clear() {
    this.ports = [];
  }

  Update(lineId: string, type: lineTypes) {
   // this.lineId = lineId;

  }

  //SetInterimPorts(type: lineTypes) {

  //  if (this.ports.length < 2) { return; }
  //  let dx = this.ports[1].Center.X - this.ports[0].Center.X;
  //  let dy = this.ports[1].Center.Y - this.ports[0].Center.Y;
  //  let p = 0;
  //  //switch (type) {

  //  //  case lineTypes.bezier:
  //  //    //p = dx / 4;
  //  //    //if (this.ports.length < 4) {
  //  //    //  this.ports.push(new Point());
  //  //    //  this.ports.push(new Point());
  //  //    //}
  //  //    //if (dx > 0) {
  //  //    //  this.ports[2].SetToPosition(this.ports[0].X + p, this.ports[0].Y - 10);
  //  //    //  this.ports[3].SetToPosition(this.ports[0].X + (p * 3), this.ports[3].Y + 10);
  //  //    //}
  //  //    //else {
  //  //    //  this.ports[2].SetToPosition(this.ports[3].X + p, this.ports[3].Y - 10);
  //  //    //  this.ports[3].SetToPosition(this.ports[3].X + (p * 3), this.ports[0].Y + 10);
  //  //    //}
  //  //    break;
  //  //  case lineTypes.gradient:
  //  //    //p = dx / 2;
  //  //    //if (this.ports.length < 3) {
  //  //    //  this.ports.push(new Point());
  //  //    //}
  //  //    //this.ports[2].SetToPosition(this.ports[0].X + p, this.ports[0].Y - 10);
  //  //    break;
  //  //  case lineTypes.VtoV:
  //  //    if (this.ports.length < 4) {
  //  //      this.ports.push(new Point());
  //  //      this.ports.push(new Point());
  //  //    }
  //  //    p = this.ports[0].Y + ((this.ports[1].Center.Y - this.ports[0].Center.Y) / 2);
  //  //    this.ports[2].SetToPosition(this.ports[1].Center.X, p);
  //  //    this.ports[3].SetToPosition(this.ports[0].Center.X, p);
  //  //    break;
  //  //  case lineTypes.VtoH:
  //  //    if (this.ports.length < 3) {
  //  //      this.ports.push(new Point());
  //  //    }
  //  //    this.ports[2].SetToPosition(this.ports[1].Center.X, this.ports[0].Center.Y);
  //  //    break;
  //  //  case lineTypes.HtoH:
  //  //    if (this.ports.length < 4) {
  //  //      this.ports.push(new Point());
  //  //      this.ports.push(new Point());
  //  //    }
  //  //    p = this.ports[0].X + ((this.ports[1].X - this.ports[0].X) / 2);
  //  //    this.ports[2].SetToPosition(p, this.ports[1].Y);
  //  //    this.ports[3].SetToPosition(p, this.ports[0].Y);
  //  //    break;
  //  //  case lineTypes.HtoV:
  //  //    if (this.ports.length < 3) {
  //  //      this.ports.push(new Point());
  //  //    }
  //  //    this.ports[2].SetToPosition(this.ports[0].X, this.ports[1].Y);
  //  //    break;

  //  //}
  //}

  get Ports() { return this.ports; }


  ResetToPort(position: number) {
   // let port = this.ports.find(p => p.Position == position);
   // if (port) {
   ////   port.CenterOn(port.Center.X, port.Center.Y);
   // }
  }
}

export class Line implements ILine {

  private _state: StateIndex;
  constructor(
    private id: string,
    protected state: string,
    private zindex: number = 0) {
    this._state = DisplayValues.GetLineIndex(this.StateName, state);
  }

  get zIndex() { return this.zindex; }

  Update(stateName: string) {
    this._state = DisplayValues.GetLineIndex(this.Id + "_state", stateName);
    this.state = stateName;
  }

  Save(): any {
    let model = {
      LineId: this.id,
      DisplayValueId: this.state,
      LineType: this.Type,
      OffsetX1: 0,
      OffsetY1: 0,
      OffsetX2: 0,
      OffsetY2: 0
    }
    return model;
  }

  get State(): StateIndex {
    return this._state;
  }

  get StateName() {
    return this.state;
  }

  get Id() { return this.id; }

  get Type() {
    return lineTypes.straight;
  }

  UpdateContextState() { }

  DrawPathLinks(ctx: CanvasRenderingContext2D, links: PathLink[]) {
    let self = this;
    links.forEach(function (l, i) {
      ctx.beginPath();
      ctx.moveTo(l.sourcePosition.X, l.sourcePosition.Y);
      ctx.lineTo(l.targetPosition.X, l.targetPosition.Y);
      self.Draw(ctx);
    });
  }

  DrawLine(ctx: CanvasRenderingContext2D, path: Point[] = []): void {
    ctx.beginPath();

    ctx.moveTo(path[0].X, path[0].Y);

    this.Plot(ctx, path);
    this.Draw(ctx);
  }

  Draw(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = DisplayValues.GetColor(this.State.Index[UIStates.color]);
    ctx.lineWidth = DisplayValues.GetWeight(this.State.Index[UIStates.weight]);
    ctx.stroke();
    ctx.closePath();
  }
                                                                                                                    
  Plot(ctx: CanvasRenderingContext2D, path: Point[]) {
    path.slice(1).forEach(p => ctx.lineTo(p.X, p.Y));
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

export class GradientLine extends Line {

  constructor(
    id: string,
    state: string) {
    super(id, state);
  }

  get Type() {
    return lineTypes.gradient;
  }

  Plot(ctx: CanvasRenderingContext2D, path: Point[] = []): void {
    for (let j = 1; j < path.length; j = j + 1) {
      let k = j - 1;
      ctx.quadraticCurveTo(
        path[k].X + path[k].X / 2, path[k].Y - 10,
        path[j].X, path[j].Y);
    }
  }
}

export class BezierLine extends Line {

  constructor(
    id: string,
    state: string) {
    super(id, state);
  }

  get Type() {
    return lineTypes.gradient;
  }

  Plot(ctx: CanvasRenderingContext2D, path: Point[] = []): void {
    for (let j = 1; j < path.length; j = j + 1) {
      let k = j - 1;
      let dx = (path[j].Y - path[k].Y) / 2;
      let dy = (path[j].X - path[k].X) / 4;
      ctx.bezierCurveTo(
        path[j].X - dx, path[k].Y + dx,
        path[j].X + dy, path[k].Y - dy,
        path[j].X, path[j].Y);
    }

  }
}

export class VerticalToVerticalLine extends Line {

  constructor(
    id: string,
    state: string) {
    super(id, state);
  }

  get Type() {
    return lineTypes.VtoV;
  }

  Plot(ctx: CanvasRenderingContext2D, path: Point[] = []): void {
    let p: number = 0;
    for (let j = 1; j < path.length; j = j + 1) {
      let k = j - 1;
      p = path[k].X + ((path[j].X - path[k].X) / 2);
      ctx.lineTo(p, path[k].Y);
      ctx.lineTo(p, path[j].Y);
      ctx.lineTo(path[j].X, path[j].Y);
    }

  }
}

export class HorizontallToHorizontalLine extends Line {

  constructor(
    id: string,
    state: string) {
    super(id, state);
  }

  get Type() {
    return lineTypes.HtoH;
  }

  Plot(ctx: CanvasRenderingContext2D, path: Point[] = []): void {
    let p: number = 0;
    for (let j = 1; j < path.length; j = j + 1) {
      let k = j - 1;
      p = path[k].Y + ((path[j].Y - path[k].Y) / 2);
      ctx.lineTo(path[k].X, p);
      ctx.lineTo(path[j].X, p);
      ctx.lineTo(path[j].X, path[j].Y);
    }
  }
}

export class HorizontalToVerticalLine extends Line {

  constructor(
    id: string,
    state: string) {
    super(id, state);
  }

  get Type() {
    return lineTypes.HtoV;
  }

  Plot(ctx: CanvasRenderingContext2D, path: Point[] = []): void {
    for (let j = 1; j < path.length; j = j + 1) {
      ctx.lineTo(path[j - 1].X, path[j].Y);
      ctx.lineTo(path[j].X, path[j].Y);
    }
  }
}

export class VerticaToHorizontallLine extends Line {

  constructor(
    id: string,
    state: string) {
    super(id, state);
  }

  get Type() {
    return lineTypes.VtoH;
  }

  Plot(ctx: CanvasRenderingContext2D, path: Point[] = []): void {
    for (let j = 1; j < path.length; j = j + 1) {
      ctx.lineTo(path[j].X, path[j - 1].Y);
      ctx.lineTo(path[j].X, path[j].Y);
    }
  }
}




