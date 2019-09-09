import { IShape } from './IShape';
import { Point, TrackingPoint } from './primitives/point';
import { StateIndex, UIStates, DisplayValues } from '../DisplayValues'
import { IContextItem } from '../IContextItem';
import { ShapeSelectResult } from './shapeSelected';
import { Line, PortPath } from '../lines/line';
import { ePortType, Port } from './port';
import { Text } from './content/text/text';
import { ContentImage } from './content/image/image';
export enum FreedomOfMotion {
  full = 0,
  horizontal = 1,
  vertical = 2
}
export enum AreaType {
  normal = 0, // width and height change independently
  lockedRatio = 1, // Ratio between width and height remains constant as other dimension changes.
  constantArea = 2 // Total area remains the same as width of height changes
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

export abstract class Shape implements IShape {

  protected _center: Point = new Point();
  protected _unitCell: string = '';
  protected _areaType: AreaType = AreaType.normal;
  protected _freedomOfMotion: FreedomOfMotion = FreedomOfMotion.full;
  protected _freedomOfSizing: FreedomOfMotion = FreedomOfMotion.full;
  protected _shapes: IShape[] = [];
  protected _isSelected = false;
  protected _stateIndex: StateIndex = null
  protected _ports: IShape[] = [];
  constructor(
    private id: string,
    private top: number,
    private left: number,
    private width: number,
    private height: number,
    private stateName: string) {

    this._center.SetToPosition(this.left, this.top);
    this._center.Offset(this.width / 2, this.height / 2);
    this._stateIndex = DisplayValues.GetShapeIndex(this.stateName);
    let self = this;
    //  ports.forEach(function (p, i) {
    //    self._ports.push(new Port(p.portId, p.offsetX, p.offsetY, self, ePortType.source, this.stateName, this.pathId));
    //    });
  }

  SetProperties(properties: any) {
    this.id = properties.name;
    this._areaType = properties.areaType;
    this._freedomOfMotion = properties.freedomOfMotion;
    this._freedomOfSizing = properties.freedomOfSizing;
    this.width = properties.width;
    this.height = properties.height;
    this.stateName = properties.state;
    this._stateIndex = DisplayValues.GetShapeIndex(this.stateName);
    //   this.UpdateContextState();
  }

  get UnitCell(): string {
    return this._unitCell;
  }

  get StateIndex() {
    return this._stateIndex;
  }

  //UpdateContextState() {
  //  //let bgNdx = DisplayValues.GetColorIndex(this.Id + '_' + 'bg');
  //  ////if (bgNdx <= 0) {
  //  ////  bgNdx = DisplayValues.GetColorIndex(this.Id + '_' + this.Class + "_" + 'bg');
  //  ////}
  //  //if (bgNdx >= 0) {
  //  //  this._bgNdx = bgNdx;
  //  //  this._stateIndex.setState(UIStates.background, bgNdx);
  //  //}
  //  //else {
  //  //  this._bgNdx = this._stateIndex.Index[UIStates.background];
  //  //}
  //}
  get BackgroundColorIndex() { return this._stateIndex.Index[UIStates.background]; }

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

  LinePath(path: PortPath) {
    this._ports.forEach(p => path.AddPortPoint(p.Center));
  }

  Select(shapeSelectResult: ShapeSelectResult) {
    if (this.SelectShape(shapeSelectResult)) {
      shapeSelectResult.itemCaptured = true;
      shapeSelectResult.id = this.Id;
      return true;
    }
    return false;
  }

  get StateName(): string {
    return this.stateName;
  }

  AddShape(shape: IShape) {
    if (shape) {
      this._shapes.push(shape);
    }
  }

  SelectShape(shapeSelectResult: ShapeSelectResult): boolean {
    return this.IsPointInShape(shapeSelectResult.point);
  }

  MoveBy(x: number, y: number) {
    switch (this._freedomOfMotion) {
      case FreedomOfMotion.horizontal: y = 0; break;
      case FreedomOfMotion.vertical: x = 0; break;
    }

    this.top += y;
    this.left += x;
    this._center.SetToPosition(this.left, this.top);
    this._center.Offset(this.width / 2, this.height / 2);
    this._ports.forEach((p, i) => p.MoveBy(x, y));
    this._shapes.forEach((s, i) => s.MoveBy(x, y));
  }

  SizeBy(top: number, right: number, bottom: number, left: number) {

    let w = this.width;
    let h = this.height;

    this.top = top;
    this.left = left;

    switch (this._areaType) {
      case AreaType.constantArea: // total area remains the same
        let a = w * h;
        this.width = right - this.left;
        this.height = bottom - this.top;
        if (w != this.width) { // width changing...
          this.height = a / this.width;
        }
        if (h != this.height) {
          this.width = a / this.height;
        }
        break;
      case AreaType.lockedRatio:  // height/width ratio remains the same
        let r = 1; // Math.round((w / h) * 100);
        //if (w < h) {
        //   r = Math.round((w / h) * 100);
        //}
        //else {
        //  r = Math.round((h/w) * 100);
        //}
        this.width = right - this.left;
        this.height = bottom - this.top;
        if (w != this.width) { // width changing...
          r = Math.round((h / w) * 100);
          this.height = Math.round((r * this.width) / 100);
        }
        else if (h != this.height) {
          r = Math.round((w / h) * 100);
          this.width = Math.round((r * this.height) / 100);
        }

        break;
      default:
        switch (this._freedomOfSizing) {
          case FreedomOfMotion.horizontal: this.width = right - this.left; break;
          case FreedomOfMotion.vertical: this.height = bottom - this.top; break;
          default:
            this.width = right - this.left;
            this.height = bottom - this.top;
            break;
        }
        break;
    }

    this._center.SetToPosition(this.left, this.top);
    this._center.Offset(this.width / 2, this.height / 2);
    this._ports.forEach((p, i) => p.SizeBy(top, right, bottom, left));
    this._shapes.forEach((s, i) => s.SizeBy(top, right, bottom, left));

  }

  public get FreedomOfMotion() {
    return this._freedomOfMotion;
  }

  public get FreedomOfSizing() {
    return this._freedomOfSizing;
  }

  public get AreaType() {
    return this._areaType;
  }


  get IsSelected(): boolean { return this._isSelected };

  CenterOn(x: number, y: number) {
    this.top = y - (this.height / 2);
    this.left = x - (this.width / 2);
    this._center.SetToPosition(this.left, this.top);
    this._center.Offset(this.width / 2, this.height / 2);
  }

  positionOnTick(x: number, y: number) {

    if (x > 0) { this.left = x; }
    if (y > 0) { this.top = y; }

  }

  public SetState(state: StateIndex) {
    this._stateIndex = state;
  }

  private IsPointInShape(point: Point) {
    return (this.top < point.Y && this.Bottom > point.Y
      && this.left < point.X && this.Right > point.X);
  }

  //AddPort( id: string,
  //  offsetX: number,
  //  offsetY: number,
  //   pathId: string,
  //   type: ePortType,
  //  state: StateIndex) {
  //  this._ports.push(new Port(id, offsetX, offsetY, this, type, state, pathId));
  //}

  AddPort(port: IShape): IShape {
    let removedPort: IShape[] = [];
    let index = this._ports.findIndex(p => p.Id.toLowerCase() == port.Id.toLowerCase());
    if (index >= 0) {// Remove items with the same Id...
      removedPort = this._ports.splice(index, 1);
    }
    this._ports.push(port);
    return (removedPort.length > 0) ? removedPort[0] : null;
  }

  RemovePort(portId: string): IShape {
    let removedPort: IShape[] = [];
    let index = this._ports.findIndex(p => p.Id.toLowerCase() == portId.toLowerCase());
    if (index >= 0) {// Remove items with the same Id...
      removedPort = this._ports.splice(index, 1);
    }
    return (removedPort.length > 0) ? removedPort[0] : null;
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
