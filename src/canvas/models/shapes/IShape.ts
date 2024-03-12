import { Point, TrackingPoint } from './primitives/point';
import { IContextItem } from '../IContextItem';
import { StateIndex } from '../DisplayValues';

export enum FreedomOfMotion {
  none = 1,
  full = 2,
  horizontal = 3,
  vertical = 4,
}

export enum AreaType {
  normal = 0, // width and height change independently
  lockedRatio = 1, // Ratio between width and height remains constant as other dimension changes.
  constantArea = 2 // Total area remains the same as width of height changes
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
  StateIndex: StateIndex;
  Touch(point: Point);
  HitTest(point: Point): boolean;
  ClearHit();
  CopyShape(newID: string): IShape;
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
  CopyShape(newID: string): IShape{
    return new EmptyShape();
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



