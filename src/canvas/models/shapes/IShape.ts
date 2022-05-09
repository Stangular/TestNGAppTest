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
  SizeBy(context: any,top: number, right: number, bottom: number, left: number);
  CenterOn(x: number, y: number);
  SetProperties(properties: any);
  Select(criteria: any): boolean;
 // Track(point: Point, tracker: AreaTracker): boolean;

  StateIndex: StateIndex;
  Ports: IShape[];

  Tracker(): ITracker;
//  SetToPosition(point: TrackingPoint);
}



