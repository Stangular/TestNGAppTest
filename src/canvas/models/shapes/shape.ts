import { IShape } from './IShape';
import { Point, TrackingPoint } from './primitives/point';
import { Size } from './primitives/size';
import {  StateIndex } from '../DisplayValues'
import { Port } from './port';

export abstract class Shape implements IShape {

  _center: Point = new Point();

  protected _shapes: Shape[] = [];
  protected _ports: Port[] = [];

  constructor(
    private id: string,
    private top: number,
    private left: number,
    private width: number,
    private height: number,
    protected state: StateIndex ) {

    this._center.SetToPosition(this.left, this.top);
    this._center.Offset(this.width / 2, this.height/2);
  }

  get Id(): string { return this.id; }
  get Top(): number { return this.top; }
  get Right(): number { return this.width + this.left; }
  get Bottom(): number { return this.height + this.top; }
  get Left(): number { return this.left; }

  get Width(): number { return this.width; }
  get Height(): number { return this.height; }


  get Center(): Point { return this._center; }

  abstract DrawShape(context: any);
  
}

//export class Shapes extends Shape {
//  constructor(shapes: Shape[] = []) {
//    super();
//  }
//}

export class TrackShape {


  _hit: Point = new Point();

  constructor(public shape: Shape) { }

  Track(point: TrackingPoint) {
    // this.left += x;
    //  this.top += y;
  }

  HitTest(point: TrackingPoint) {
    const x = point.X;
    const y = point.Y;
    if (x >= this.shape.Left && x <= this.shape.Right
      && y >= this.shape.Top && y <= this.shape.Bottom) {
      this._hit.Set(point);
      return true;
    }
    return false;
  }
}
