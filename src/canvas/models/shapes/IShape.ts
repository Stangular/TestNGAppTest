import { Point, TrackingPoint } from './primitives/point';
import { IContextItem, AreaTracker } from '../IContextItem';
import { StateIndex } from '../DisplayValues';

export enum FreedomOfMotion {
  none = 0,
  full = 1,
  horizontal = 2,
  vertical = 3,
}

export enum AreaType {
  normal = 0, // width and height change independently
  lockedRatio = 1, // Ratio between width and height remains constant as other dimension changes.
  constantArea = 2 // Total area remains the same as width of height changes
}

export interface ITracker {

  TrackedArea: IShape;
  MoveItem(dx: number, dy: number);
  Reset(shape: IShape);
  Draw(context: CanvasRenderingContext2D);
}

export interface IShape extends IContextItem {

  Id: string;
  Top: number;
  Right: number;
  Bottom: number;
  Left: number;

  Width: number;
  Height: number;

  Center: Point;
  IsHit: boolean;

  StateName: string;
  AreaType: AreaType;
  FreedomOfMotion: FreedomOfMotion;
  FreedomOfSizing: FreedomOfMotion;

  //DrawShape(context: any);
  MoveBy(x: number, y: number);
  MoveTo(x: number, y: number);
  SizeBy(context: any,top: number, right: number, bottom: number, left: number);
  CenterOn(x: number, y: number);
  SetProperties(properties: any);
  Select(criteria: any): boolean;
  IsPointInShape(point: Point);
 // Track(point: Point, tracker: AreaTracker): boolean;

  StateIndex: StateIndex;
  Touch(point: Point);
  HitTest(point: Point): boolean;
  ClearHit();
//  Tracker(): ITracker;
//  SetToPosition(point: TrackingPoint);
}

export class EmptyShape implements IShape {
  get Id(): string { return "EMPTY"; }
  get Top(): number { return -1000; }
  get Right(): number { return -1000; }
  get Bottom(): number { return -1000; }
  get Left(): number { return -1000; }

  get Width(): number { return 0; }
  get Height(): number { return 0; }

  get Center(): Point { return null; }

  get IsHit() { return false; }

  get StateName() { return ""; }
  get AreaType(): AreaType {
    return AreaType.normal;
  }
  get FreedomOfMotion(): FreedomOfMotion {
    return FreedomOfMotion.none;
  }
  get FreedomOfSizing(): FreedomOfMotion {
    return FreedomOfMotion.none;
  }

  MoveBy(x: number, y: number) { };
  MoveTo(x: number, y: number) { };
  SizeBy(context: any, top: number, right: number, bottom: number, left: number) { };
  CenterOn(x: number, y: number) { };
  SetProperties(properties: any) { };
  Select(criteria: any): boolean { return false; };
  IsPointInShape(point: Point) { };

  ClearHit(){};
  get StateIndex(): StateIndex { return null; };
  get Ports(): IShape[] { return [] };
  Touch(point: Point) { };
  HitTest(point: Point): boolean { return false; }
  public DrawContent(context: any) { }
  get zIndex(): number {
    return 0;
  };
  Draw(ctx: CanvasRenderingContext2D): void { };
  CopyItem(newId: string): IContextItem { return null; };
  Save(): any { };
}


export interface IShapeContainer extends IShape {
  InternalShape: IShape;
}



