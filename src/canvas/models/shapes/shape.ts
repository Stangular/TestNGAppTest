import { IShape, AreaType, FreedomOfMotion, IShapeContainer } from './IShape';
import { Point, TrackingPoint } from './primitives/point';
import { StateIndex, UIStates, DisplayValues } from '../DisplayValues'
import { IContextItem, MousePosition } from '../IContextItem';
import { ShapeSelectResult } from './shapeSelected';
import { Line, PortPath, PathLink } from '../lines/line';
//import { ePortType, Port } from './port';
//import { ImageShape } from './content/image/image';
import { IElementDefinition } from '../../../dataManagement/model/definitions/ElementDefinition';
import { Content, TextContent, IDynamicContent } from './content/Content';
import { inherits } from 'util';
import { Ellipse } from './ellipse';
import { AreaSizer } from './sizing/sizer';
//import { ContentShape } from './content/ContentShape';
//import { TextShape } from './content/text/text';

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

  protected _defaultState: string = "";
  protected _touchedContent
  protected _hit = false;
  protected _center: Point = new Point();
  protected _unitCell: string = '';
  protected _areaType: AreaType = AreaType.normal;
  protected _freedomOfMotion: FreedomOfMotion = FreedomOfMotion.full;
  protected _freedomOfSizing: FreedomOfMotion = FreedomOfMotion.full;
  private _tracked: boolean = false;

  // protected _imageContent: ImageShape[] = [];
  // protected _generalContent: Shape[] = [];

  //protected _textContent: Text = null;
  //protected _imageContent: ImageShape = null;
  protected _stateIndex: StateIndex = null;
  constructor(
    private id: string,
    protected top: number,
    protected left: number,
    protected width: number,
    protected height: number,
    private stateName: string,
    private _zIndex: number = 0,
    private hitState: string = "") {

    if (this.hitState == "") {
      this.hitState = this.stateName;
    }
    this._center.SetToPosition(this.left, this.top);
    this._center.Offset(this.width / 2, this.height / 2);
    this._stateIndex = DisplayValues.GetShapeIndex(this.stateName);
    this._defaultState = this.stateName;

  }
  get zIndex() { return this._zIndex; }

  SetProperties(properties: any) {
    this.id = properties.name || this.id;
    this._areaType = properties.areaType || this._areaType;
    this._freedomOfMotion = properties.freedomOfMotion || this._freedomOfMotion;
    this._freedomOfSizing = properties.freedomOfSizing || this._freedomOfSizing;
    this.width = properties.width || this.width;
    this.height = properties.height || this.height;
    this.stateName = properties.state || this.stateName;
    this._stateIndex = DisplayValues.GetShapeIndex(this.stateName);
    //   this.UpdateContextState();
  }

  public HitTest(point: Point): boolean {
    const x = point.X;
    const y = point.Y;
    this._hit = (x >= this.Left && x <= this.Right
      && y >= this.Top && y <= this.Bottom);
    if (this._hit) {

      this.stateName = this.hitState;
      this._stateIndex = DisplayValues.GetShapeIndex(this.stateName);

    }
    else {
      this.stateName = this._defaultState;
      this._stateIndex = DisplayValues.GetShapeIndex(this.stateName);
    }
    return this._hit;
  }

  ClearHit() {

    this._hit = false;


    this.stateName = this._defaultState;
    this._stateIndex = DisplayValues.GetShapeIndex(this.stateName);

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

  get Width(): number {
    let w = this.width;
    if (w < 0) {
      w = DisplayValues.Width + w;
    }
    return w;
  }
  get Height(): number { return this.height; }

  get Center(): Point { return this._center; }

  abstract Draw(context: CanvasRenderingContext2D): void;
  abstract CopyShape(newID: string): Shape;
  abstract CopyItem(newID: string): IContextItem;
  abstract Save(): any;

  Touch(point: Point) {
    this.HitTest(point);
  }


  get IsTracked() {
    return this._tracked;
  }

  Select(point: Point) {

    this._hit = this.IsPointInShape(point);
    this._stateIndex = DisplayValues.GetShapeIndex(this.hitState);
    return this._hit;
  }

  get StateName(): string {
    return this.stateName;
  }

  public clearAllContent() {
    this.clearContent();
  }

  public clearContent() {
    //  this._content = [];
    //  this._ports = [];
  }

  SelectShape(shapeSelectResult: ShapeSelectResult): boolean {
    return this.IsPointInShape(shapeSelectResult.point);
  }


  get IsHit() {
    return this._hit;
  }

  MoveTo(x: number, y: number) {
    this.left = x;
    this.top = y;
  }

  MoveIfHit(point: Point): boolean {
    if (this.IsHit) {
      this.MoveBy(point.X, point.Y);
      return true;
    }
    return false;
  }

  protected Reposition(x: number, y: number) {
    this.top += y;
    this.left += x;
    this._center.SetToPosition(this.left, this.top);
    this._center.Offset(this.width / 2, this.height / 2);
  }

  MoveBy(x: number, y: number) {

    switch (this._freedomOfMotion) {
      case FreedomOfMotion.none: break;
      case FreedomOfMotion.horizontal: this.Reposition(x, 0); break;
      case FreedomOfMotion.vertical: this.Reposition(0, y); break;
      default: this.Reposition(x, y); break;
    }
  }

  SizeBy(context: any, top: number, right: number, bottom: number, left: number) {

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

  CenterOn(x: number, y: number) {
    this.top = y - (this.height / 2);
    this.left = x - (this.width / 2);
    this._center.SetToPosition(this.left, this.top);
    this._center.Offset(this.width / 2, this.height / 2);
    // this.Contents.forEach(c => c.Shape.CenterOn(x, y));
  }

  positionOnTick(x: number, y: number) {

    if (x > 0) { this.left = x; }
    if (y > 0) { this.top = y; }

  }

  public SetState(state: StateIndex) {
    this._stateIndex = state;
  }

  public IsPointInShape(point: Point) {
    this._hit = this.HitTest(point);
    //console.error(point.X + "-" + point.Y + ":::" + this.top + "-" + this.Bottom + "-" + this.Left + "-" + this.Right)

    return this._hit;
  }

  //public IsPointInContent(point: Point) {
  //  return this._content.findIndex(c => c.Shape.IsPointInShape(point));
  //}

  public RemoveContentAtPoint(point: Point): IShape {
    //let i = this._content.findIndex(c => c.Shape.IsPointInShape(point));
    //if (i >= 0) {
    //  let c = this._content[i];
    //  this._content.splice(i, 1);
    //  return c.Shape;
    //}
    return null;
  }


}

export interface ISizeableArea {
  InitToSizeAbleArea();
}

export class ShapeContainer implements IShapeContainer {

  protected _selected: boolean = false;
  protected _trackdContents: IShape[] = [];

  constructor(
    protected internalShape: IShape,
    protected Contents: IShape[] = []) {

    let properties = {
      "freedomOfMotion": FreedomOfMotion.horizontal,
      "freedomOfSizing": FreedomOfMotion.none
    }
    this.internalShape.SetProperties(properties);
  }

  ClearContent() {
    this.Contents = [];
  }

  AddContentsss(content: IShape) {
    try {

      if (content) {
        content.ClearHit();
        let i = this.Contents.findIndex(c => c.Id == content.Id);
        if (i < 0) {
          this.Contents.unshift(content as PathShape);
        }
      }
      this._trackdContents = this.Contents.concat([]);
    }
    catch (e) {
      console.error("Tried to add invalid content:" + e.message);
      let sss = 0;
    }
  }

  get LeftMost(): number {
    return this._trackdContents[0].Left;
  }

  get RightMost(): number {
    let cnt = this._trackdContents.length - 1;
    return this._trackdContents[cnt].Right;
  }

  RemoveItemAtPoint(point: Point): IShape {
    let i = this.Contents.findIndex(c => c.IsPointInShape(point));
    if (i < 0) {
      return null;
    }
    let c = this.Contents.splice(i, 1);
    console.error("Removed:" + c[0].Id);
    return c[0];
  }

  AddToBack(c: IShape) {
    this._trackdContents.unshift(c);
  }

  AddToFront(c: IShape) {
    this._trackdContents.push(c);
  }

  ShiftContinuousContent(dx: number, boundingAreaRight: number, padding: number = 3) {
    let self = this;
    let w = this._trackdContents[0].Width;
    let p = w * padding;
    let len = this._trackdContents.length;
    let position = this._trackdContents[0].Left;
    let top = this._trackdContents[len - 1].Top;
    let limit = boundingAreaRight + p;
    let items = this._trackdContents.filter(c => c.Left > limit);

    this._trackdContents.splice(len - items.length);// Remove the items from the front 
    items.forEach(function (c, i) {
      position -= c.Width;
      c.MoveTo(position, top);
      self.AddToBack(c); // and add them to the end...
    });

    len = this._trackdContents.length;
    position = this._trackdContents[len - 1].Right;

    items = this._trackdContents.filter(c => c.Right < -p);// Remove items from the end
    this._trackdContents = this._trackdContents.splice(items.length);

    items.forEach(function (c, i) {
      c.MoveTo(position, top);
      self.AddToFront(c); // and add them to the front...
      position += c.Width;
    });
  }

  ShiftDiscreteContent(dx: number, boundingAreaRight: number) {

    let self = this;
    let len = this._trackdContents.length;
    this._trackdContents.forEach(function (c, i) {
      c.MoveBy(dx, 0);
    });

  }

  SelectContentFromPoint(point: Point): boolean {
    this.Contents.forEach(c => c.ClearHit());
    return this.Contents.some(c => c.IsPointInShape(point));
  }

  public DrawContent(context: any) {
    this.Contents.forEach(c => c.Draw(context));
  }

  get InternalShape(): IShape { return this.internalShape; }

  get Id(): string { return this.internalShape.Id; }
  get Top(): number { return this.internalShape.Top; }
  get Right(): number { return this.internalShape.Right; }
  get Bottom(): number { return this.internalShape.Bottom; }
  get Left(): number { return this.internalShape.Left; }

  get Width(): number { return this.internalShape.Width; }
  get Height(): number { return this.internalShape.Height; }

  get Center(): Point { return this.internalShape.Center; }
  get IsHit(): boolean { return this.internalShape.IsHit; }

  get StateName(): string { return this.internalShape.StateName; }
  get AreaType(): AreaType { return this.internalShape.AreaType; }
  get FreedomOfMotion(): FreedomOfMotion { return this.internalShape.FreedomOfMotion; }
  get FreedomOfSizing(): FreedomOfMotion { return this.internalShape.FreedomOfSizing; }

  //DrawShape(context: any);
  MoveTo(x: number, y: number) { return this.internalShape.MoveTo(x, y); }
  SizeBy(context: any, top: number, right: number, bottom: number, left: number) { return this.internalShape.SizeBy(context, top, right, bottom, left); }
  CenterOn(x: number, y: number) { return this.internalShape.CenterOn(x, y); }
  SetProperties(properties: any) { return this.internalShape.SetProperties(properties); }
  Select(criteria: any): boolean { return this.internalShape.Select(criteria); }
  IsPointInShape(point: Point) {
    return this.internalShape.IsPointInShape(point);
  }

  get StateIndex(): StateIndex { return this.internalShape.StateIndex; }

  Touch(point: Point): any {
    this.Contents.forEach(c => c.IsPointInShape(point));
  }

  HitTest(point: Point): boolean { return this.HitTest(point) };
  ClearHit(): any {

    return this.InternalShape.ClearHit();
  }

  get IsSelected() {
    return this._selected;
  }

  public UnSelect() {
    this._selected = false;
  }

  public Selected(point: Point): boolean {

    this._selected = this.InternalShape.IsPointInShape(point);
    console.error(this._selected ? "selected" : "not selected");
    return this._selected;
  }

  public DrawSelectedItem(context: any) {
    this.Contents[0].Draw(context);
  }

  public Draw(context: any) {
    this.internalShape.Draw(context);
    if (!this._selected) {
      this.Contents.forEach(s => s.Draw(context));
    }
    else {
      this._trackdContents.forEach(s => s.Draw(context));
    }
  }

  public DrawPartial(context: any) {
    this.internalShape.Draw(context);
  }

  public MoveBy(x: number, y: number) {
    this.ShiftDiscreteContent(x, this.Right);
  }

  get zIndex() { return this.internalShape.zIndex; }

  CopyShape(newID: string): Shape { return this.CopyShape(newID); }
  CopyItem(newID: string): IContextItem { return this.CopyItem(newID); }
  Save(): any { return this.internalShape.Save(); }

  SelectContentByPosition(mousePosition: MousePosition) {
    let p = mousePosition.mousePosition;
    const index = this.Contents.findIndex(c => (<IShape>c).IsPointInShape(p));
    if (index > 0) {
      this.SelectContent(index);
    }
  }

  SelectContent(index: number) {
      this.Contents.unshift(this.Contents.splice(index, 1)[0]);
  }
}

export class ShapePathContainer extends ShapeContainer {

  constructor(
    internalShape: IShape,
    Contents: PathShape[] = []) { super(internalShape, Contents) }

  public DrawContent(context: any) {
    this.Contents.forEach(c => (<PathShape>c).DrawPartial(context));
  }

  public DrawPath(context: any, path: PortPath, line: Line) {
    path.DrawPathLinks(context, this.Contents, line);
    this.Contents.forEach(c => (<PathShape>c).DrawPorts(context));
  }
}

//id: string,
//  top: number,
//    left: number,
//      width: number,
//        height: number,
//          stateName: string,
//            _zIndex: number = 0,
//              hitState: string = stateName
export abstract class PathShape implements IShapeContainer  {

  // _partialPath: PathLink[] = [];
  constructor(protected ports: IShape[] = [],
    protected internalShape: IShape) {

  }

  get InternalShape(): IShape { return this.internalShape; }


  get Id(): string { return this.internalShape.Id; }
  get Top(): number { return this.internalShape.Top; }
  get Right(): number { return this.internalShape.Right; }
  get Bottom(): number { return this.internalShape.Bottom; }
  get Left(): number { return this.internalShape.Left; }

  get Width(): number { return this.internalShape.Width; }
  get Height(): number { return this.internalShape.Height; }

  get Center(): Point { return this.internalShape.Center; }
  get IsHit(): boolean { return this.internalShape.IsHit; }

  get StateName(): string { return this.internalShape.StateName; }
  get AreaType(): AreaType { return this.internalShape.AreaType; }
  get FreedomOfMotion(): FreedomOfMotion { return this.internalShape.FreedomOfMotion; }
  get FreedomOfSizing(): FreedomOfMotion { return this.internalShape.FreedomOfSizing; }

  //DrawShape(context: any);
  MoveTo(x: number, y: number) { return this.internalShape.MoveTo(x, y); }
  SizeBy(context: any, top: number, right: number, bottom: number, left: number) { return this.internalShape.SizeBy(context, top, right, bottom, left); }
  CenterOn(x: number, y: number) { return this.internalShape.CenterOn(x, y); }
  SetProperties(properties: any) { return this.internalShape.SetProperties(properties); }
  Select(criteria: any): boolean { return this.internalShape.Select(criteria); }
  IsPointInShape(point: Point) { return this.internalShape.IsPointInShape(point); }

  get StateIndex(): StateIndex { return this.internalShape.StateIndex; }
  Touch(point: Point): any { return this.Touch(point); }
  HitTest(point: Point): boolean { return this.HitTest(point) };
  ClearHit(): any {

    return this.InternalShape.ClearHit();
  }

  //GetPartialPath(pathLinks: PathLink[]): number[] {
  //  let pathi: number[] = [];
  //  let partialPath: PathLink[] = [];
  //  this.ports.forEach(function (p, i) {
  //    let r = pathLinks.findIndex(l => l.isSource(p) || l.isTarget(p));
  //    if (r >= 0) {
  //      pathi.push(r);
  //    }
  //  });
  //  return pathi;
  //}

  FindPorts(pathLinks: PathLink[]) {

    this.ports.forEach(function (p, i) {
      pathLinks.some(l => l.isSource(p) || l.isTarget(p));
    });

  }

  public Draw(context: any) {
    this.internalShape.Draw(context);
    this.DrawPorts(context);
  }

  public DrawPartial(context: any) {
    this.internalShape.Draw(context);
  }

  public DrawPorts(context: any) {
    this.ports.forEach(p => p.Draw(context));
  }

  public MoveBy(x: number, y: number) {
  
    this.internalShape.MoveBy(x, y);
    this.ports.forEach((p, i) => p.MoveBy(x, y));

  }

  get Ports(): IShape[] {
    return this.ports;
  }

  get zIndex() { return this.internalShape.zIndex; }

  CopyShape(newID: string): Shape { return this.CopyShape(newID); }
  CopyItem(newID: string): IContextItem { return this.CopyItem(newID); }
  Save(): any { return this.internalShape.Save(); }
}

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

