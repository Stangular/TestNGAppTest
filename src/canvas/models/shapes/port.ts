import { IShape } from './IShape';
import { Point, TrackingPoint } from './primitives/point';
import { extend } from 'webdriver-js-extender';
import { Ellipse } from './ellipse';
import { StateIndex } from '../DisplayValues';
import { Size } from 'src/d3/services/d3.common.model';
import { IContextItem } from '../IContextItem';
import { ShapeSelectResult } from './shapeSelected';
import { Path } from '../lines/path';
import { Line, PortPath } from '../lines/line';

export enum ePortType {
  source = 0,
  target = 1
}
export class Port implements IShape, IContextItem {

  internalShape: IShape;
  private _parentShapeId: string = '';
  

  constructor(private id: string,
    offsetX: number,
    offsetY: number,
    parent: IShape,
    private type: ePortType,
    state: StateIndex,
    private pathId: string,
    private pathPosition: number = -1
) {
    let x = parent.Center.X + ( parent.Width / 2 ) * (offsetX / 100);
    let y = parent.Center.Y + ( parent.Height / 2 ) * (offsetY / 100);
    this.internalShape = new Ellipse(id + "_*", 0,0, 5, 5, state);
    this.internalShape.CenterOn(x, y);
    this._parentShapeId = parent.Id;
  }

  get ParentShapeID() {
    return this._parentShapeId;
  }

  get PortType(): ePortType {
    return this.type;
  }

  get Class(): string {
    return this.internalShape.Class;
  }

  AssignToClass(clss: string): void {
    this.internalShape.AssignToClass( clss );
  }

  Select(shapeSelectResult: ShapeSelectResult): boolean {
    return false;
  }

  UpdateContextState() { }

  CopyItem(newId: string) {
    return null;
  }

  CenterOn(x: number, y: number) {
    this.internalShape.CenterOn(x, y);
  }

  get PathId() {
    return this.pathId;
  }

  get PathPosition() {
    return this.pathPosition;
  }

  //LinePathPoint(path: PortPath) {
  //  if (this.pathId != path.Id) { return null; }
  //  if (this.pathPosition != path.Length) { return null; }
  //  path.AddPortPoint(this.internalShape.Center, this.pathPosition);
  //}

  DrawShape(context: any): void {
    // get line moveto/lineto
    this.internalShape.DrawShape(context);
  }

  Draw(context: any): void {
    this.DrawShape(context);
  }

  MoveBy(x: number, y: number) {
    this.internalShape.MoveBy(x, y);
  }

  get ParentShapeId() {
    return this._parentShapeId;
  }

  SizeBy(top: number, right: number, bottom: number, left: number) {
    let w = (right - left) / 2;
    let h = ( bottom - top ) / 2;
    let cx = left + w;
    let cy = top + h;
    let x = cx + w * (this.internalShape.Center.X / 100);
    let y = cy + h * (this.internalShape.Center.Y / 100);
    this.internalShape.CenterOn(x, y);
  }
  get Id(): string { return this.id; }
  get Top(): number { return this.internalShape.Top}
  get Right(): number { return this.internalShape.Right; }
  get Bottom(): number { return this.internalShape.Bottom; }
  get Left(): number { return this.internalShape.Left; }

  get Width(): number { return this.internalShape.Width; }
  get Height(): number { return this.internalShape.Height; }

  get Center(): Point { return this.internalShape.Center; }

  get Offset(): Point {
    return this.internalShape.Center;
  }

  get InternalShape() { return this.internalShape; }
}
