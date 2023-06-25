import { IShape, ITracker } from './IShape';
import { Point, TrackingPoint } from './primitives/point';
import { Ellipse } from './ellipse';
import { IContextItem, AreaTracker } from '../IContextItem';
import { ShapeSelectResult } from './shapeSelected';
import { StateIndex, DisplayValues } from '../DisplayValues';

//export enum ePortType {
//  source = 0,
//  target = 1
//}
export class Port implements IShape, IContextItem {
  
  private _stateIndex: StateIndex;
  private _hit: boolean = false;

  constructor(private id: string,
    private offsetX: number,
    private offsetY: number,
    private parentShapeId: string,
    private lineId:string,
    stateName: string,
    private internalShape: IShape,
    private position: number
  ) {
    this._stateIndex = DisplayValues.GetShapeIndex(stateName);
  }

  get LineId() {
    return this.lineId;
  }

  //InitializeContext(context: CanvasRenderingContext2D) { };

  get StateIndex(): StateIndex {
    return this._stateIndex;
  }

  get zIndex() { return this.internalShape.zIndex; }
  
  get IsHit(): boolean{
    return false;
  }
////  public DrawContent(context: any) { this.internalShape.DrawContent(context); }

  public HitTest(point: Point): boolean {
    const x = point.X;
    const y = point.Y;
    this._hit = (x >= this.Left && x <= this.Right
      && y >= this.Top && y <= this.Bottom);
    return this._hit;
  }

  Save(): any {
    let model = {
      ShapeId: this.parentShapeId,
      PortId: this.id,
      OffsetX: this.offsetX,
      OffsetY: this.offsetY
    }
    return model;
  }

  IsPointInShape(point: Point) { return this.internalShape.IsPointInShape(point); }

  get StateName(): string {
    return this.internalShape.StateName;
  }

  Touch(point: Point) { }

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
    return this.parentShapeId;
  }

  get Position(): number {
    return this.position;
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

  
  ClearHit(){};

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

  MoveTo(x: number, y: number) {
    this.internalShape.MoveTo(x, y);
  }

  Track(point: Point, tracker: AreaTracker): boolean {

    return false; // this.SelectContentFromPoint(point) && tracker.Reset(this);

  }

  get ParentShapeId() {
    return this.parentShapeId;
  }

  SizeBy(context: any, top: number, right: number, bottom: number, left: number) {
    this.internalShape.SizeBy(context,top, right, bottom, left);
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
