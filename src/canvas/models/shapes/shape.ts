import { IShape } from './IShape';
import { Point, TrackingPoint } from './primitives/point';
import { StateIndex, UIStates, DisplayValues } from '../DisplayValues'
import { IContextItem } from '../IContextItem';
import { ShapeSelectResult } from './shapeSelected';
import { Line } from '../lines/line';

export enum FreedomOfMotion {
  full = 0,
  horizontal = 1,
  vertical = 2
}

export enum OffsetStyle {
  constane = 0,   // Does not change position as parent shape is resized
  absolute = 1,   // Remains at defined position from nearest corner.
  constantPercent = 2 // Remains at the same percentage offset form top/left.
}
export class ContainedShape {
  _shape: Shape;
  _offset: Point;
  _offsetStyle: OffsetStyle;

}

export class ShapeProperties {
  _lockedRatio: boolean = false;
  _constantArea: boolean = false;
  _freedomOfMotion: FreedomOfMotion = FreedomOfMotion.full;
  _freedomOfSizing: FreedomOfMotion = FreedomOfMotion.full;
}

export abstract class Shape implements IShape, IContextItem {

  _bgNdx: number = 0;
  _center: Point = new Point();
  _class: string = '';
  properties: ShapeProperties;

  protected _shapes: Shape[] = [];
  protected _isSelected = false;

  constructor(
    private id: string,
    private top: number,
    private left: number,
    private width: number,
    private height: number,
    protected state: StateIndex = null) {

    this._center.SetToPosition(this.left, this.top);
    this._center.Offset(this.width / 2, this.height / 2);

    this.UpdateContextState();
  }

  get Class(): string {
    return this._class;
  }

  AssignToClass(clss: string): void {
    this._class = clss;
  }

  UpdateContextState() {
    let bgNdx = DisplayValues.GetColorIndex(this.Id + '_' + 'bg');
    if (bgNdx <= 0) {
      bgNdx = DisplayValues.GetColorIndex(this.Id + '_' + this.Class + "_" + 'bg');
    }
    if (bgNdx >= 0) {
      this._bgNdx = bgNdx;
      this.state.setState(UIStates.background, bgNdx);
    }
    else {
      this._bgNdx = this.state.Index[UIStates.background];
    }
  }
  get BackgroundColorIndex() { return this._bgNdx; }

  get Id(): string { return this.id; }
  get Top(): number { return this.top; }
  get Right(): number { return this.width + this.left; }
  get Bottom(): number { return this.height + this.top; }
  get Left(): number { return this.left; }

  get Width(): number { return this.width; }
  get Height(): number { return this.height; }

  get Center(): Point { return this._center; }
  
  abstract Draw(context: any): void;
  abstract DrawShape(context: any);
  abstract CopyShape(newID: string): Shape;
  abstract CopyItem(newID: string): IContextItem;

  Select(shapeSelectResult: ShapeSelectResult) {
    return this.SelectShape(shapeSelectResult);
  }

  SelectShape(shapeSelectResult: ShapeSelectResult): boolean {
    this._isSelected = this.IsPointInShape(shapeSelectResult.point);
    return this._isSelected;
  }

  MoveBy(x: number, y: number) {
    this.top += y;
    this.left += x;
    this._center.SetToPosition(this.left, this.top);
    this._center.Offset(this.width / 2, this.height / 2);
    //this._ports.forEach(function (p, i) {
    //  p.MoveBy(x, y);
    //});
  }

  SizeBy(top: number, right: number, bottom: number, left: number) {
    this.top = top;
    this.left = left;
    
    this.width = right - this.left;
    this.height = bottom - this.top;
    this._center.SetToPosition(this.left, this.top);
    this._center.Offset(this.width / 2, this.height / 2);
    //this._ports.forEach(function (p, i) {
    //  p.SizeBy(top,right,bottom,left);
    //});
  }

  get IsSelected(): boolean { return this._isSelected };

  CenterOn(x: number, y: number) {
    this.top = y - (this.height / 2);
    this.left = x - (this.width / 2);
  }

  positionOnTick(x: number, y: number) {

    if (x > 0) { this.left = x; }
    if (y > 0) { this.top = y; }

  }

  public SetState(state: StateIndex) {
    this.state = state;
  }

  private IsPointInShape(point: Point) {
    return (this.top < point.Y && this.Bottom > point.Y
      && this.left < point.X && this.Right > point.X);
  }

  get Ports() {
    return this._ports;
  }
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
