import { IShape, ITracker } from './IShape';
import { Point, TrackingPoint } from './primitives/point';
import { Ellipse } from './ellipse';
import { IContextItem, AreaTracker } from '../IContextItem';
import { ShapeSelectResult } from './shapeSelected';
import { StateIndex, DisplayValues } from '../DisplayValues';

export enum ePortType {
  source = 0,
  target = 1
}
export class Port implements IShape, IContextItem {

  internalShape: IShape;
  private _parentShapeId: string = '';
  private _stateIndex: StateIndex;

  constructor(private id: string,
    private offsetX: number,
    private offsetY: number,
    parent: IShape,
    private type: ePortType ,
    stateName: string,
    private pathId: string,
    private zindex: number = 0,
    private pathPosition: number = -1
  ) {
    this.internalShape = new Ellipse(id + "_*", 0, 0, 5, 5, stateName);
    this._parentShapeId = parent.Id;
    this.SetPortToParent(parent.Top, parent.Right, parent.Bottom, parent.Left);
    this._stateIndex = DisplayValues.GetShapeIndex(stateName);
  }

  Tracker(): ITracker {
    return null;
  }

  get StateIndex(): StateIndex {
    return this._stateIndex;
  }

  get zIndex() { return this.zindex; }

  SetPortToParent(top: number, right: number, bottom: number, left: number) {
    let w = (right - left) / 2;
    let h = (bottom - top) / 2;
    let cx = left + w;
    let cy = top + h;
    let x = Math.round(cx + (w * (this.offsetX / 100)));
    let y = Math.round(cy + (h * (this.offsetY / 100)));
    this.internalShape.CenterOn(x, y);
  }

  get IsHit(): boolean{
    return false;
  }

  Save(): any {
    let model = {
      ShapeId: this._parentShapeId,
      PathId: this.pathId,
      PortId: this.id,
      OffsetX: this.offsetX,
      OffsetY: this.offsetY
    }
    return model;
  }

  get StateName(): string {
    return this.internalShape.StateName;
  }

  public get AreaType() {
    return this.internalShape.AreaType;
  }

  public get FreedomOfMotion() {
    return this.internalShape.FreedomOfMotion;
  }

  public get FreedomOfSizing() {
    return this.internalShape.FreedomOfSizing;
  }

  public get Ports() {
    return this.internalShape.Ports;
  }

  SetProperties(properties: any) {

  }

  get ParentShapeID() {
    return this._parentShapeId;
  }

  get PortType(): ePortType {
    return this.type;
  }

  //get Class(): string {
  //  return this.internalShape.Class;
  //}

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
  //  context.beginPath();
   this.internalShape.Draw(context);
  //  context.closePath();
  }

  Draw(context: any): void {
    this.DrawShape(context);
  }

  MoveBy(x: number, y: number) {
    this.internalShape.MoveBy(x, y);
  }

  Track(point: Point, tracker: AreaTracker): boolean {

    return false; // this.SelectContentFromPoint(point) && tracker.Reset(this);

  }

  get ParentShapeId() {
    return this._parentShapeId;
  }

  SizeBy(context : any,top: number, right: number, bottom: number, left: number) {
    this.SetPortToParent(top, right, bottom, left);
  }


  get Id(): string { return this.id; }
  get Top(): number { return this.internalShape.Top }
  get Right(): number { return this.internalShape.Right; }
  get Bottom(): number { return this.internalShape.Bottom; }
  get Left(): number { return this.internalShape.Left; }

  get Width(): number { return this.internalShape.Width; }
  get Height(): number { return this.internalShape.Height; }

  get Center(): Point { return this.internalShape.Center; }
  get OffsetX() {
    return this.offsetX;
  }
  get OffsetY() {
    return this.offsetY;
  }

  get Offset(): Point {
    return this.internalShape.Center;
  }

  get InternalShape() { return this.internalShape; }
}
