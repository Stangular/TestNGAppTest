import { IShape, AreaType, FreedomOfMotion} from './IShape';
import { Point, TrackingPoint } from './primitives/point';
import { StateIndex, UIStates, DisplayValues } from '../DisplayValues'
import { IContextItem } from '../IContextItem';
import { ShapeSelectResult } from './shapeSelected';
import { Line, PortPath } from '../lines/line';
import { ePortType, Port } from './port';
import { ImageShape } from './content/image/image';
import { IElementDefinition } from '../../../dataManagement/model/definitions/ElementDefinition';
import { Content, TextContent } from './content/Content';
import { ContentShape } from './content/ContentShape';
import { TextShape } from './content/text/text';

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

  protected _hit = false;
  protected _center: Point = new Point();
  protected _unitCell: string = '';
  protected _areaType: AreaType = AreaType.normal;
  protected _freedomOfMotion: FreedomOfMotion = FreedomOfMotion.full;
  protected _freedomOfSizing: FreedomOfMotion = FreedomOfMotion.full;
  protected _textContent: TextShape[] = [];
  protected _imageContent: ImageShape[] = [];
  protected _generalContent: Shape[] = [];

  //protected _textContent: Text = null;
  //protected _imageContent: ImageShape = null;
  protected _isSelected = false;
  protected _stateIndex: StateIndex = null;
  protected _ports: IShape[] = [];
  constructor(
    private id: string,
    protected top: number,
    protected left: number,
    protected width: number,
    protected height: number,
    private stateName: string) {
    
    this._center.SetToPosition(this.left, this.top);
    this._center.Offset(this.width / 2, this.height / 2);
    this._stateIndex = DisplayValues.GetShapeIndex(this.stateName);
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

  get StateIndex(): StateIndex {
    return this._stateIndex;
  }

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
  //abstract DrawShape(context: any);
  abstract CopyShape(newID: string): Shape;
  abstract CopyItem(newID: string): IContextItem;
  abstract Save(): any;

  LinePath(path: PortPath) {
    if (path) {
      this._ports.forEach(p => path.AddPortPoint(p.Center));
    }
  }

  Select(shapeSelectResult: ShapeSelectResult) {
    this._hit = false;
    let ndx = this._textContent.findIndex(s => s.Select(shapeSelectResult));
    if (ndx >= 0) {
      shapeSelectResult.itemCaptured = true;
      shapeSelectResult.id = this._textContent[ndx].Id;
      return true;
    }
    ndx = this._imageContent.findIndex(s => s.Select(shapeSelectResult));
    if (ndx >= 0) {
      shapeSelectResult.itemCaptured = true;
      shapeSelectResult.id = this._imageContent[ndx].Id;
      return true;
    }
    ndx = this._generalContent.findIndex(s => s.Select(shapeSelectResult));
    if (ndx >= 0) {
      shapeSelectResult.itemCaptured = true;
      shapeSelectResult.id = this._generalContent[ndx].Id;
      return true;
    }
    else {
      if (this.SelectShape(shapeSelectResult)) {
        shapeSelectResult.itemCaptured = true;
        shapeSelectResult.id = this.Id;
        this._hit = true;
        return true;
      }
    }
 
    return false;
  }

  get StateName(): string {
    return this.stateName;
  }

  public DrawContent(context: any) {
    this._textContent.forEach(s => s.Draw(context));
    this._imageContent.forEach(s => s.Draw(context));
    this._generalContent.forEach(s => s.Draw(context));

    this._ports.forEach(p => p.Draw(context));
}

  AddTextShape(shape: TextShape) {
    if (shape) {
      this._textContent.push(shape);
    }
  }

  AddImageShape(shape: ImageShape) {
    if (shape) {
      this._imageContent.push(shape);
    }
  }

  AddShape(shape: Shape) {
    if (shape) {
      this._generalContent.push(shape);
    }
  }

  get ChildShape(): Shape {
    return this.TextContent.find(s => s.IsHit) as Shape
      || this.ImageContent.find(s => s.IsHit) as Shape
      || this.GeneralContent.find(s => s.IsHit) as Shape;
  }

  SelectShape(shapeSelectResult: ShapeSelectResult): boolean {

    return this.IsPointInShape(shapeSelectResult.point);
  }

  //get ChildShape(): Shape {
  //  return this.Shapes.find(s => s.IsHit ) as Shape;
  //}

  get IsHit() {
    return this._hit;
  }

  MoveBy(x: number, y: number) {
   // this.
    switch (this._freedomOfMotion) {
      case FreedomOfMotion.horizontal: y = 0; break;
      case FreedomOfMotion.vertical: x = 0; break;
    }

    this.top += y;
    this.left += x;
    this._center.SetToPosition(this.left, this.top);
    this._center.Offset(this.width / 2, this.height / 2);
    this._ports.forEach((p, i) => p.MoveBy(x, y));
    this._textContent.forEach((s, i) => s.MoveBy(x, y));
    this._imageContent.forEach((s, i) => s.MoveBy(x, y));
    this._generalContent.forEach((s, i) => s.MoveBy(x, y));
 }

  SizeBy(context: any,top: number, right: number, bottom: number, left: number) {

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

    this._ports.forEach((p, i) => p.SizeBy(context,top, right, bottom, left));
  //  this._shapes.forEach((s, i) => s.SizeBy(context,top, right, bottom, left));
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


  get Ports() : IShape [] {
    return this._ports;
  }

  get TextContent() {
    return this._textContent;
  }

  get ImageContent() {
    return this._imageContent;
  }

  get GeneralContent() {
    return this._generalContent;
  }

  //get TextContent() {
  //  return this._textContent;
  //}

  //get ImageContent() {
  //  return this._imageContent;
  //}
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
